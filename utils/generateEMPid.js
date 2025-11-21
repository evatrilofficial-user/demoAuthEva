import db from "../models/index.js";
export const generateEMPId = async () => {
  const year = new Date().getFullYear().toString().slice(2);
  const lastAdmin = await db.Admin.findOne({
    where: {
      emp_id: {
        [db.Sequelize.Op.like]: `EMP${year}%`,
      },
    },
    order: [["created_at", "DESC"]],
  });

  let newSerial = 1;

  if (lastAdmin?.emp_id) {
    const lastEmpId = lastAdmin.emp_id;
    const lastSerial = parseInt(lastEmpId.slice(5), 10); // extract ### part
    newSerial = lastSerial + 1;
  }

  // Convert serial number to 3-digit padded string
  const paddedSerial = newSerial.toString().padStart(3, "0");

  return `EMP${year}${paddedSerial}`;
};
