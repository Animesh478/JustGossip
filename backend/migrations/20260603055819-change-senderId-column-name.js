"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.renameColumn("messages", "senderId", "sender_id");
  },

  async down(queryInterface, Sequelize) {
    // await queryInterface.renameColumn("messages", "sender_id", "senderId");
  },
};
