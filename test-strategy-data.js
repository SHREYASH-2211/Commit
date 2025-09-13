// Test the strategy data structure that will be sent to backend
const testStrategyData = {
  name: "Test Strategy",
  description: "A test strategy for debugging",
  category: "trend-following",
  entryRules: [
    {
      id: "default_entry",
      name: "Entry Condition",
      type: "entry",
      conditions: [{
        indicator: "price",
        operator: "crosses_above",
        value: "sma",
        timeframe: "1h"
      }],
      action: {
        type: "buy",
        quantity: "all"
      },
      logicalOperator: "AND",
      description: "Price crosses above 20-day SMA"
    }
  ],
  exitRules: [
    {
      id: "default_exit",
      name: "Exit Condition", 
      type: "exit",
      conditions: [{
        indicator: "price",
        operator: "crosses_below",
        value: "sma",
        timeframe: "1h"
      }],
      action: {
        type: "sell",
        quantity: "all"
      },
      logicalOperator: "AND",
      description: "Price crosses below 20-day SMA"
    }
  ],
  riskManagement: {
    stopLoss: 2,
    takeProfit: 6,
    maxPositionSize: 5,
    maxDailyLoss: 10,
    maxDrawdown: 20
  },
  executionSettings: {
    timeframe: "1h",
    executionMode: "paper",
    slippage: 0.1,
    commission: 0.1,
    allowMultiplePositions: true,
    maxConcurrentPositions: 5,
    requireExitBeforeEntry: false
  },
  tags: ["user-created"]
};

console.log("🧪 Testing Strategy Data Structure");
console.log("==================================");
console.log("✅ Strategy Name:", testStrategyData.name);
console.log("✅ Description:", testStrategyData.description);
console.log("✅ Category:", testStrategyData.category);
console.log("✅ Entry Rules Count:", testStrategyData.entryRules.length);
console.log("✅ Exit Rules Count:", testStrategyData.exitRules.length);
console.log("✅ Risk Management:", Object.keys(testStrategyData.riskManagement).length, "fields");
console.log("✅ Execution Settings:", Object.keys(testStrategyData.executionSettings).length, "fields");
console.log("✅ Tags:", testStrategyData.tags.length, "items");

console.log("\n📋 Entry Rule Structure:");
console.log("- ID:", testStrategyData.entryRules[0].id);
console.log("- Name:", testStrategyData.entryRules[0].name);
console.log("- Type:", testStrategyData.entryRules[0].type);
console.log("- Conditions:", testStrategyData.entryRules[0].conditions.length);
console.log("- Action:", testStrategyData.entryRules[0].action.type);
console.log("- Logical Operator:", testStrategyData.entryRules[0].logicalOperator);

console.log("\n📋 Exit Rule Structure:");
console.log("- ID:", testStrategyData.exitRules[0].id);
console.log("- Name:", testStrategyData.exitRules[0].name);
console.log("- Type:", testStrategyData.exitRules[0].type);
console.log("- Conditions:", testStrategyData.exitRules[0].conditions.length);
console.log("- Action:", testStrategyData.exitRules[0].action.type);
console.log("- Logical Operator:", testStrategyData.exitRules[0].logicalOperator);

console.log("\n🎯 This data structure should now work with the backend!");
console.log("📝 Next steps:");
console.log("   1. Open http://localhost:8081 (frontend is on port 8081)");
console.log("   2. Login to the application");
console.log("   3. Go to Strategy Builder");
console.log("   4. Try creating a strategy");
console.log("   5. Check browser console for the logged data");
