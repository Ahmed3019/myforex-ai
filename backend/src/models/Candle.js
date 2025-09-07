/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Candle = sequelize.define('Candle', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  symbol: {
    type: DataTypes.STRING(20),
    allowNull: false,
    index: true,
  },
  timeframe: {
    type: DataTypes.STRING(5), // M1, M5, M15, H1, D1...
    allowNull: false,
  },
  ts: {
    type: DataTypes.DATE, // timestamp (UTC)
    allowNull: false,
  },
  open: { type: DataTypes.FLOAT, allowNull: false },
  high: { type: DataTypes.FLOAT, allowNull: false },
  low:  { type: DataTypes.FLOAT, allowNull: false },
  close:{ type: DataTypes.FLOAT, allowNull: false },
  volume:{ type: DataTypes.FLOAT, allowNull: true },
}, {
  tableName: 'candles',
  timestamps: false,
  indexes: [
    { fields: ['symbol', 'timeframe', 'ts'] },
  ],
});

module.exports = Candle;
