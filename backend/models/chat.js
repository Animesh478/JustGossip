"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Chat.belongsToMany(models.User, {
        through: models.ChatParticipants,
        foreignKey: "chatId",
        otherKey: "userId",
        as: "participants",
      });

      Chat.hasMany(models.Message, {
        foreignKey: "chatId",
        as: "messages",
        onDelete: "CASCADE",
      });
    }
  }
  Chat.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      isGroup: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Chat",
      tableName: "chats",
      freezeTableName: true,
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );
  return Chat;
};
