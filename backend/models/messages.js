"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Message.belongsTo(models.User, {
        foreignKey: "senderId",
        as: "sender",
        onDelete: "CASCADE", // alias for this relationship
        onUpdate: "CASCADE", // alias for this relationship
      });

      Message.belongsTo(models.Chat, {
        foreignKey: "chatId",
        as: "chat",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Message.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      senderId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      chatId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Message",
      tableName: "messages",
      freezeTableName: true,
      underscored: true,
      timestamps: true,
    },
  );
  return Message;
};
