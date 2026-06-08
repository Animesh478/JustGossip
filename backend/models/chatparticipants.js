"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ChatParticipants extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // a participant record belongs to one specific chat
      ChatParticipants.belongsTo(models.Chat, { foreignKey: "chatId" });

      // a participant record belongs to one specific user
      ChatParticipants.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  ChatParticipants.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      chatId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "chat_id",
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "user_id",
      },
    },
    {
      sequelize,
      modelName: "ChatParticipants",
      tableName: "chat_participants",
      freezeTableName: true,
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );
  return ChatParticipants;
};
