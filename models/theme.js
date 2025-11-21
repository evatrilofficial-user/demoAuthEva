"use strict";
import slugify from "slugify";

export default (sequelize, DataTypes) => {
  const Theme = sequelize.define(
    "Theme",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      occasion_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notEmpty: { msg: "occasion Id is required" },
          isInt: { msg: "occasion Id must be integer" },
        },
      },
      category_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notEmpty: { msg: "category Id is required" },
          isInt: { msg: "category Id must be integer" },
        },
      },
      theme_type_id: {
        type: DataTypes.TINYINT,
        allowNull: true,
        validate: {
          isInt: { msg: "theme type Id must be integer" },
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "theme name is required" },
          len: {
            args: [3, 50],
            msg: "theme name must be between 3 and 50 characters",
          },
        },
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      preview_image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      preview_video: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      component_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "component name is required" },
        },
      },
      config: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      base_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
        validate: {
          isDecimal: { msg: "Base price must be a valid decimal number" },
        },
      },
      offer_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
          isDecimal: { msg: "Offer price must be a valid decimal number" },
        },
      },
      currency: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: "INR",
        validate: {
          notEmpty: { msg: "currency is required" },
        },
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "themes",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
      hooks: {
        beforeValidate(theme) {
          if (theme.name) {
            theme.name = theme.name
              .trim()
              .replace(/[^a-zA-Z0-9\s]/g, "")
              .replace(/\s+/g, " ");
          }
          if (theme.component_name) {
            theme.component_name = theme.component_name.trim();
          }
        },
        // beforeSave(theme) {
        //   if (theme.name) {
        //     theme.slug =
        //       slugify(theme.name, {
        //         lower: true,
        //         strict: true,
        //        replacement: "-",
        //       })
        //   }
        // },
      },
    }
  );

  Theme.associate = (models) => {
    Theme.belongsTo(models.ThemeCategory, {
      foreignKey: "category_id",
      as: "themeCategory",
    });
    Theme.belongsTo(models.ThemeType, {
      foreignKey: "theme_type_id",
      as: "themeType",
    });
  };

  return Theme;
};
