/**
 * Developed and Designed by Ahmed Salah Salama
 * Mail: ahmedsalama3014@gmail.com
 * Tel: 01558547000
 * LinkedIn: https://www.linkedin.com/in/ahmedsalama1/
 */

module.exports = (sequelize, DataTypes) => {
  const Trade = sequelize.define(
    "Trade",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_id",
      },
      symbol: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      asset_class: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      direction: {
        type: DataTypes.ENUM("BUY", "SELL"),
        allowNull: false,
      },
      tradeDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "trade_date",
      },
      entryPrice: {
        type: DataTypes.DECIMAL(15, 5),
        allowNull: false,
        field: "entry_price",
      },
      stopLoss: {
        type: DataTypes.DECIMAL(15, 5),
        field: "stop_loss",
      },
      takeProfit: {
        type: DataTypes.DECIMAL(15, 5),
        field: "take_profit",
      },
      lotSize: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: "lot_size",
      },
      exitPrice: {
        type: DataTypes.DECIMAL(15, 5),
        field: "exit_price",
      },
      // store P/L in USD with 5 decimal places (consistent with our calc & UI)
      profitLoss: {
        type: DataTypes.DECIMAL(15, 5),
        field: "profit_loss",
      },
      timeframe: {
        type: DataTypes.STRING(10),
      },
      strategy: {
        type: DataTypes.STRING(100),
      },
      notes: {
        type: DataTypes.TEXT,
      },
      isClosed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "is_closed",
      },
    },
    {
      tableName: "trades",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Trade;
};
