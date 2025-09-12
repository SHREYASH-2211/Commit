const StrategySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    description: { type: String },
    logic: { type: Object, required: true }, 
    indicators: [{ type: String }], // e.g. ["SMA", "RSI", "MACD"]
  
    visibility: { type: String, enum: ["private", "public"], default: "private" },
  
    forkedFrom: { type: mongoose.Schema.Types.ObjectId, ref: "Strategy" },
  
    version: { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model("Strategy", StrategySchema);
  