import Joi from "joi";

export const createThemeSchema = Joi.object({
  occasion_id: Joi.number().integer().required().message({
    "any.required": "Occasion ID is required",
    "number.base": "Occasion ID must be a number",
  }),
  category_id: Joi.number().integer().required().message({
    "any.required": "Category ID is required",
    "number.base": "Category ID must be a number",
  }),
});
