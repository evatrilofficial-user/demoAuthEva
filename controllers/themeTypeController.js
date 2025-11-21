import {
  createThemeTypeService,
  getAllThemeTypesService,
  updateThemeTypeService,
  deleteThemeTypeService,
  getThemeTypeByCategoryService,
} from "../services/themeTypeService.js";

export const createThemeType = async (req, res, next) => {
  try {
    const data = await createThemeTypeService(req.body);
    res.status(201).json({
      success: true,
      message: "Theme type created successfully.",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllThemeTypes = async (req, res,next) => {
  try {
    const data = await getAllThemeTypesService(req.query);
    res.status(200).json({
      success: true,
      message: "Theme types fetched successfully.",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

export const updateThemeType = async (req, res,next) => {
  try {
    const { id } = req.params;
    const data = await updateThemeTypeService(id, req.body);
    return res.status(data.status).json({
      success: true,
      message: "theme updated successfully",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteThemeType = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await deleteThemeTypeService(id);
    return res.status(data.status).json({
      success: true,
      message: "Theme type deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const getThemeTypeByCategory = async (req, res,next) => {
  
  try {
    const { category_id } = req.params;
    const data = await getThemeTypeByCategoryService(category_id);
    return res.status(200).json({
      success: true,
      message: "Theme types fetched successfully by category.",
      data: data,
    });
  } catch (error) {
    next(error);
    
  }
};
