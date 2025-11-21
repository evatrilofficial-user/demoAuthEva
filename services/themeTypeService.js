import {
  createThemeTypeRepo,
  getThemeTypeByCategoryRepo,
  findThemeTypeByIdRepo,
  findAllThemeTypesRepo,
  updateThemeTypeRepo,
  deleteThemeTypeRepo,
  findThemeCategory,
} from "../repositories/themeTypeRepository.js";
import AppError from "../utils/AppError.js";
// import { handleSequelizeError } from "../utils/handelSequelizeError.js";

export const createThemeTypeService = async (data) => {
  const { name, category_id, status } = data;

  if (!name || !category_id) {
    throw new AppError("Name and category_id are required.", 400, true);
  }
  //check for category if it exist or not

  const category = await findThemeCategory(category_id);
  if (!category) {
    throw new AppError("Category not found.", 404);
  }

  const newThemeType = await createThemeTypeRepo({
    name,
    category_id,
    status: status ?? true,
  });

  return newThemeType;
};

export const getAllThemeTypesService = async (query) => {
  const { category_id, q, page = 1, limit = 10 } = query;
  const offset = (page - 1) * limit;

  const { rows, count } = await findAllThemeTypesRepo(
    { category_id, q },
    { limit: parseInt(limit), offset: parseInt(offset) }
  );

  return {
    count,
    rows,
  };
};

export const updateThemeTypeService = async (id, data) => {
  const themeType = await findThemeTypeByIdRepo(id);
  if (!themeType) {
    throw new AppError("Theme type not found.", 404);
  }

  const allowedFields = ["name", "category_id", "status"];
  const updateData = Object.fromEntries(
    Object.entries(data).filter(([key]) => allowedFields.includes(key))
  );

  if (Object.keys(updateData).length === 0) {
    throw new AppError("No valid fields to update.", 400);
  }

  const updatedThemeType = await updateThemeTypeRepo(themeType, updateData);

  return updatedThemeType;
};

export const deleteThemeTypeService = async (id) => {
  const themeType = await findThemeTypeByIdRepo(id);
  if (!themeType) {
    throw new AppError("Theme type not found.", 404);
  }

  await deleteThemeTypeRepo(themeType);
};
export const getThemeTypeByCategoryService = async (category_id) => {
  if (!category_id) {
    throw new AppError("Category ID is required.", 400);
  }
  return await getThemeTypeByCategoryRepo(category_id);
};
