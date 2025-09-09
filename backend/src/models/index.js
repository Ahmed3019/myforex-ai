/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const User = require("./User")(sequelize, DataTypes);
const Trade = require("./Trade")(sequelize, DataTypes);

User.hasMany(Trade, { foreignKey: "userId", onDelete: "CASCADE" });
Trade.belongsTo(User, { foreignKey: "userId" });

module.exports = {
  sequelize,
  User,
  Trade,
};
