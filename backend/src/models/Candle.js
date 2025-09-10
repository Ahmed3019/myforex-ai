/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

module.exports = (sequelize, DataTypes) => {
  const Candle = sequelize.define(
    "Candle",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      symbol: { type: DataTypes.STRING(20), allowNull: false },
      timeframe: { type: DataTypes.STRING(5), allowNull: false }, // e.g. M1,M5,H1
      time: { type: DataTypes.DATE, allowNull: false },           // candle open time
      open: { type: DataTypes.DECIMAL(20, 6), allowNull: false },
      high: { type: DataTypes.DECIMAL(20, 6), allowNull: false },
      low:  { type: DataTypes.DECIMAL(20, 6), allowNull: false },
      close:{ type: DataTypes.DECIMAL(20, 6), allowNull: false },
      volume:{ type: DataTypes.BIGINT, allowNull: true },
    },
    {
      tableName: "candles",
      timestamps: false,
      indexes: [
        { fields: ["symbol", "timeframe", "time"] },
      ],
    }
  );

  return Candle;
};
