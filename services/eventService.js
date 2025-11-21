import {
  getEventsRepo,
  getUsersByIds,
  getOccasionsByIds,
  searchRemoteUsers,
} from "../repositories/eventRepository.js";
import { Op } from "sequelize";
import moment from "moment-timezone";

export const getAllEventsService = async (query) => {
  const { page = 1, limit = 10, q, occasion, startDate, endDate, status } = query;

  const offset = (page - 1) * limit;
  const whereConditions = {};

  // ---------------------------------------------------------------------------
  // 1. OCCASION FILTER
  // ---------------------------------------------------------------------------
  if (occasion) whereConditions.occasion_id = occasion;

  // ---------------------------------------------------------------------------
  // 2. USER DATE FILTER (convert IST → UTC)
  // ---------------------------------------------------------------------------
  let rangeStart = null;
  let rangeEnd = null;

  if (startDate) {
    rangeStart = moment.tz(startDate, "Asia/Kolkata").startOf("day").utc().toDate();
  }

  if (endDate) {
    rangeEnd = moment.tz(endDate, "Asia/Kolkata").endOf("day").utc().toDate();
  }

  // ---------------------------------------------------------------------------
  // 3. STATUS FILTER (also IST → UTC)
  // ---------------------------------------------------------------------------
  const nowIST = moment().tz("Asia/Kolkata");

  const statusStartOfTodayUTC = nowIST.clone().startOf("day").utc().toDate();
  const statusEndOfTodayUTC = nowIST.clone().endOf("day").utc().toDate();

  let statusStart = null;
  let statusEnd = null;

  if (status) {
    switch (String(status).toLowerCase()) {
      case "today":
        statusStart = statusStartOfTodayUTC;
        statusEnd = statusEndOfTodayUTC;
        break;

      case "upcoming":
        // strictly after today -> tomorrow onwards
        statusStart = moment(statusEndOfTodayUTC).add(1, "ms").toDate();
        whereConditions.deleted_at = null;
        break;

      case "completed":
        // strictly before today -> yesterday or earlier
        statusEnd = moment(statusStartOfTodayUTC).subtract(1, "ms").toDate();
        whereConditions.deleted_at = null;
        break;

      case "deleted":
        whereConditions.deleted_at = { [Op.ne]: null };
        break;

      default:
        break;
    }
  }

  // ---------------------------------------------------------------------------
  // 4. MERGE USER DATE RANGE & STATUS DATE RANGE
  // ---------------------------------------------------------------------------
  let finalStart = rangeStart ?? statusStart;
  let finalEnd = rangeEnd ?? statusEnd;

  if (rangeStart && statusStart) finalStart = moment(maxDate(rangeStart, statusStart)).toDate();
  if (rangeEnd && statusEnd) finalEnd = moment(minDate(rangeEnd, statusEnd)).toDate();

  // If finalStart > finalEnd → no results possible
  if (finalStart && finalEnd && finalStart > finalEnd) {
    return emptyResponse(page, limit);
  }

  // EVENT_DATETIME FILTER
  if (finalStart && finalEnd) {
    whereConditions.event_datetime = { [Op.between]: [finalStart, finalEnd] };
  } else if (finalStart) {
    whereConditions.event_datetime = { [Op.gte]: finalStart };
  } else if (finalEnd) {
    whereConditions.event_datetime = { [Op.lte]: finalEnd };
  }

  // ---------------------------------------------------------------------------
  // 5. SEARCH (q)
  // ---------------------------------------------------------------------------
  if (q && q.trim() !== "") {
    const term = q.trim();
    const userIds = await searchRemoteUsers(term);

    whereConditions[Op.or] = [
      { title: { [Op.like]: `%${term}%` } },
      { slug: { [Op.like]: `%${term}%` } },
      { venue_name: { [Op.like]: `%${term}%` } },
      { venue_address: { [Op.like]: `%${term}%` } },
      ...(userIds.length > 0 ? [{ user_id: { [Op.in]: userIds } }] : []),
    ];
  }

  // ---------------------------------------------------------------------------
  // 6. FETCH EVENTS
  // ---------------------------------------------------------------------------
  const { rows: events, count: total } = await getEventsRepo({
    whereConditions,
    limit: Number(limit),
    offset,
  });

  // ---------------------------------------------------------------------------
  // 7. FETCH RELATED USER & OCCASION DATA
  // ---------------------------------------------------------------------------
  const userIds = [...new Set(events.map((e) => e.user_id).filter(Boolean))];
  const occasionIds = [...new Set(events.map((e) => e.occasion_id).filter(Boolean))];

  const users = userIds.length ? await getUsersByIds(userIds) : [];
  const occasions = occasionIds.length ? await getOccasionsByIds(occasionIds) : [];

  const userMap = Object.fromEntries(users.map((u) => [u.id, u]));
  const occasionMap = Object.fromEntries(occasions.map((o) => [o.id, o]));

  // ---------------------------------------------------------------------------
  // 8. CALCULATE STATUS (CORRECT IST LOGIC)
  // ---------------------------------------------------------------------------
  const result = events.map((e) => {
    const eventIST = moment.utc(e.event_datetime).tz("Asia/Kolkata");
    const todayIST = moment().tz("Asia/Kolkata");

    const eventDay = eventIST.clone().startOf("day");
    const todayDay = todayIST.clone().startOf("day");

    let eventStatus = "upcoming";

    if (e.deleted_at) eventStatus = "deleted";
    else if (eventDay.isSame(todayDay)) eventStatus = "today";
    else if (eventDay.isAfter(todayDay)) eventStatus = "upcoming";
    else eventStatus = "completed";

    return {
      ...e.toJSON(),
      status: eventStatus,
      user: userMap[e.user_id] || null,
      occasion: occasionMap[e.occasion_id] || null,
    };
  });

  // ---------------------------------------------------------------------------
  // 9. RETURN RESPONSE
  // ---------------------------------------------------------------------------
  return {
    total,
    currentPage: Number(page),
    totalPages: Math.ceil(total / limit),
    limit: Number(limit),
    count: result.length,
    data: result,
  };
};

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------
const maxDate = (a, b) => (a > b ? a : b);
const minDate = (a, b) => (a < b ? a : b);

const emptyResponse = (page, limit) => ({
  total: 0,
  currentPage: Number(page),
  totalPages: 0,
  limit: Number(limit),
  count: 0,
  data: [],
});
