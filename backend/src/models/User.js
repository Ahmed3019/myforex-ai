// backend/src/models/User.js
const { Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
      email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      password: { type: DataTypes.STRING(100), allowNull: false },
      balance: { type: DataTypes.DECIMAL(15, 2), defaultValue: 100.0 },

      // Settings (تخزين بأسماء snake_case + تعريض بـ camelCase)
      baseCurrency: {
        type: DataTypes.STRING(10),
        allowNull: true,
        defaultValue: "USD",
        field: "base_currency",
      },
      defaultLeverage: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 100,
        field: "default_leverage",
      },
      timezone: {
        type: DataTypes.STRING(64),
        allowNull: true,
        defaultValue: "Africa/Cairo",
      },
      theme: {
        type: DataTypes.STRING(10),
        allowNull: true,
        defaultValue: "light",
      },
    },
    {
      tableName: "users",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return User;
};
