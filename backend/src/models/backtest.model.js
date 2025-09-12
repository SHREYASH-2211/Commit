const BacktestSchema = new mongoose.Schema({
    strategyId: { type: mongoose.Schema.Types.ObjectId, ref: "Strategy", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
    symbol: { type: String, required: true },  // e.g. "AAPL"
    timeframe: { type: String, enum: ["1m", "5m", "1d"], default: "1d" },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  
    metrics: {
      totalReturn: Number,
      sharpeRatio: Number,
      winRate: Number,
      maxDrawdown: Number
    },
  
    trades: [
      {
        date: Date,
        action: { type: String, enum: ["BUY", "SELL"] },
        price: Number,
        quantity: Number
      }
    ],
  
    createdAt: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model("Backtest", BacktestSchema);
  