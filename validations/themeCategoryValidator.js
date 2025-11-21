// validators/themeCategoryValidator.js
import Joi from "joi";
import { sanitize } from "../utils/requiredMethods.js";

export const createThemeCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).required(),
  type: Joi.string().trim().required(),
  status: Joi.boolean().optional()
});

export const updateThemeCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).optional(),
  type: Joi.string().trim().optional(),
  status: Joi.boolean().optional()
});

