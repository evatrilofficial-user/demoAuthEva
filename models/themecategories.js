"use strict";
import slugify from "slugify";
import AppError from "../utils/appError.js";
import { validate } from "graphql";

export default (sequelize, DataTypes) => {
  const ThemeCategory = sequelize.define(
    "ThemeCategory",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Category name is required" },
          len: {
            args: [3, 50],
            msg: "Category name must be between 3 and 50 characters",
          },
          isValidCharacters(value) {
            if (!/^[a-zA-Z0-9 ]+$/.test(value)) {
              throw new AppError("Invalid characters in category name");
            }
          },
        },
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: { msg: "Category slug is required" },
        },
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Category type is required" },
          isIn: {
            args: [["video", "image", "document"]],
            msg: "invalid category type",
          },
        },
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "theme_categories",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
      hooks: {
        beforeValidate(category) {
          if (category.name) {
            category.name = category.name
              .trim()
              .replace(/[^a-zA-Z0-9\s]/g, "")
              .replace(/\s+/g, " ");
          }
          if (category.type) {
            category.type = category.type.trim().toLowerCase();
          }
        },
        beforeSave(category) {
          if (category.name) {
            category.slug =
              slugify(category.name, {
                lower: true,
                strict: true,
                replacement: "-",
              }) + "-invitation";
          }
        },
      },
    }
  );

  ThemeCategory.associate = (models) => {
    ThemeCategory.hasMany(models.Theme, {
      foreignKey: "category_id",
      as: "themes",
    });
  };

  return ThemeCategory;
};
