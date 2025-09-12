const MarketDataSchema = new mongoose.Schema({
    symbol: { type: String, required: true }, // e.g. "AAPL"
    date: { type: Date, required: true },
    open: Number,
    high: Number,
    low: Number,
    close: Number,
    volume: Number
  });
  
  MarketDataSchema.index({ symbol: 1, date: 1 }, { unique: true });
  
  module.exports = mongoose.model("MarketData", MarketDataSchema);
  