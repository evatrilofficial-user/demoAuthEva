import { validate } from "../middlewares/validate.js";
import {
  createThemeCategory,
  updateThemeCategory,
  getAllThemeCategories,
  deleteThemeCategory,
} from "../controllers/themeCategoryController.js";

import { createThemeCategorySchema } from "../validations/themeCategoryValidator.js";
import express from "express";

const router = express.Router();
// router.use(authenticate, checkStatus);

router.post(
  "/theme-category/store",
  validate(createThemeCategorySchema),
  createThemeCategory
);
router.patch(
  "/theme-category/update/:id",

  updateThemeCategory
);
router.delete(
  "/theme-category/delete/:id",

  deleteThemeCategory
);
router.get(
  "/theme-category/get", //allowed by all

  getAllThemeCategories
);

export default router;
