    /**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Trade = sequelize.define('Trade', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  symbol: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  asset_class: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  direction: {
    type: DataTypes.ENUM('BUY', 'SELL'),
    allowNull: false,
  },
  tradeDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  entryPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  stopLoss: {
    type: DataTypes.FLOAT,
  },
  takeProfit: {
    type: DataTypes.FLOAT,
  },
  lotSize: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  exitPrice: {
    type: DataTypes.FLOAT,
  },
  profitLoss: {
    type: DataTypes.FLOAT,
  },
  isClosed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  strategy: {
    type: DataTypes.STRING,
  },
  timeframe: {
    type: DataTypes.STRING,
  },
  notes: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'trades',
  timestamps: true,
});

module.exports = Trade;
