"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      // Change the existing 'message' column to allow nulls
      await queryInterface.changeColumn(
        "messages",
        "message",
        {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        { transaction },
      );

      // add the 'media url' column
      await queryInterface.addColumn(
        "messages",
        "media_url",
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction },
      );

      // Add the new 'mediaType' column
      await queryInterface.addColumn(
        "messages",
        "media_type",
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction },
      );
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      // 1. Remove the 'mediaType' column
      await queryInterface.removeColumn("messages", "media_type", {
        transaction,
      });

      // 2. Remove the 'mediaUrl' column
      await queryInterface.removeColumn("messages", "media_url", {
        transaction,
      });

      // 3. Revert the 'message' column to NOT allow nulls
      await queryInterface.changeColumn(
        "messages",
        "message",
        {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        { transaction },
      );
    });
  },
};
