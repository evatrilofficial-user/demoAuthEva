"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("invitation_payments", "remarks");
    await queryInterface.addColumn("invitation_payments", "remarks", {
      type: Sequelize.STRING(255),
      allowNull: true,
      after: "refunded_at",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("invitation_payments", "remarks");
    await queryInterface.addColumn("invitation_payments", "remarks", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    
  },
};
