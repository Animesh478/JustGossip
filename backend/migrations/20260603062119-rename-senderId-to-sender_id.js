"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // remove fk constraint
    await queryInterface.removeConstraint("messages", "messages_ibfk_1");

    //rename column
    await queryInterface.renameColumn("messages", "senderId", "sender_id");

    // give correct type
    await queryInterface.changeColumn("messages", "sender_id", {
      type: Sequelize.UUID,
      allowNull: false,
    });

    // add fk constraint
    await queryInterface.addConstraint("messages", {
      fields: ["sender_id"],
      type: "foreign key",
      name: "messages_sender_id_fk",
      references: {
        table: "users",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("messages", "messages_sender_id_fk");
  },
};
