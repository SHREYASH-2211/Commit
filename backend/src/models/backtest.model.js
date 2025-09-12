import mongoose from "mongoose";

const backtestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    strategyName: {
      type: String,
      required: true,
    },
    ticker: {
      type: String,
      required: true,
    },
    timeframe: {
      type: String,
      enum: ["1d", "1h", "15m"],
      default: "1d",
    },
    parameters: {
      type: Object, // e.g. { shortMA: 20, longMA: 50 }
    },
    results: {
      totalReturn: Number,
      sharpeRatio: Number,
      maxDrawdown: Number,
      volatility: Number,
      trades: [
        {
          entryDate: Date,
          exitDate: Date,
          entryPrice: Number,
          exitPrice: Number,
          profitLoss: Number,
        },
      ],
    },
  },
  { timestamps: true }
);

export const Backtest = mongoose.model("Backtest", backtestSchema);
