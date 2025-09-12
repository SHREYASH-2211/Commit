const MarketplaceSchema = new mongoose.Schema({
    strategyId: { type: mongoose.Schema.Types.ObjectId, ref: "Strategy", required: true },
    sharedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: String,
        createdAt: { type: Date, default: Date.now }
      }
    ],
    createdAt: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model("Marketplace", MarketplaceSchema);
  