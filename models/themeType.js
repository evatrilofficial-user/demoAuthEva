"use strict";

export default (sequelize, DataTypes) => {
  const ThemeType = sequelize.define(
    "ThemeType",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      category_id: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Category is required" },
          isInt: { msg: "category ID must be integer" },
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "name is required" },
          len: {
            args: [1, 10],
            msg: "name must be between 1 and 10 characters",
          },
          isValidCharacters(value) {
            if (!/^[a-zA-Z0-9 ]+$/.test(value)) {
              throw new AppError(
                "name can only contain letters, numbers, and spaces"
              );
            }
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
      tableName: "theme_types",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
      hooks: {
        beforeValidate(themeType) {
          if (themeType.name) {
            themeType.name = themeType.name
              .trim()
              .replace(/[^a-zA-Z0-9\s]/g, "")
              .replace(/\s+/g, " ");
          }
        },
      },
    }
  );

  ThemeType.associate = (models) => {
    ThemeType.belongsTo(models.ThemeCategory, {
      foreignKey: "category_id",
      as: "themeCategory",
    });
  };

  return ThemeType;
};
