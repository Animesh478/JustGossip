"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("messages", null, {});
    await queryInterface.addColumn("messages", "chat_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "chats",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("messages", "chat_id");
  },
};
