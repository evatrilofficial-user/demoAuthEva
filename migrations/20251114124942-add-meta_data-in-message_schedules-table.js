"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("message_schedules", "meta_data", {
      type: Sequelize.JSON,
      allowNull: true,
      after: "last_retry_at",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("message_schedules", "meta_data");
  },
};
