"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.renameColumn("users", "createdAt", "created_at"),
      queryInterface.renameColumn("users", "updatedAt", "updated_at"),
    ]);
  },

  async down(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.renameColumn("users", "created_at", "createdAt"),
      queryInterface.renameColumn("users", "updated_at", "updatedAt"),
    ]);
  },
};
