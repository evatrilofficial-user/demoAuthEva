"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    // 1️⃣ Modify 'occasion_id' to be nullable
    await queryInterface.changeColumn("message_templates", "occasion_id", {
      type: Sequelize.BIGINT,
      allowNull: true,
    });

    // 2️⃣ Modify 'template_code' to be nullable
    await queryInterface.changeColumn("message_templates", "template_code", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("message_templates", "message_content", {
      type: Sequelize.JSON,
      allowNull: true,

    });
  },

  async down(queryInterface, Sequelize) {
    // Revert 'occasion_id'
    await queryInterface.changeColumn("message_templates", "occasion_id", {
      type: Sequelize.BIGINT,
      allowNull: false,
    });

    // Revert 'template_code'
    await queryInterface.changeColumn("message_templates", "template_code", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.removeColumn("message_templates", "message_content");
  },
};
