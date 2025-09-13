// Test script to verify strategy creation
const axios = require('axios');

const BASE_URL = 'http://localhost:8000/api/v1';

async function testStrategyCreation() {
  console.log('🧪 Testing Strategy Creation...\n');

  try {
    // First, let's test if we can get components (no auth required)
    console.log('1️⃣ Testing components endpoint...');
    const componentsResponse = await axios.get(`${BASE_URL}/strategies/components`);
    console.log('✅ Components loaded successfully');
    console.log('   Indicators:', componentsResponse.data.data.indicators.length);
    console.log('');

    // Test strategy creation with a simple payload
    console.log('2️⃣ Testing strategy creation...');
    const testStrategy = {
      name: "Test Strategy",
      description: "A test strategy for debugging",
      category: "trend-following",
      entryRules: [
        {
          id: "test_entry_1",
          type: "entry",
          condition: "price > sma",
          indicator: "price",
          operator: ">",
          value: 0,
          timeframe: "1h",
          action: "buy",
          quantity: "all",
          description: "Buy when price is above SMA"
        }
      ],
      exitRules: [
        {
          id: "test_exit_1",
          type: "exit",
          condition: "price < sma",
          indicator: "price",
          operator: "<",
          value: 0,
          timeframe: "1h",
          action: "sell",
          quantity: "all",
          description: "Sell when price is below SMA"
        }
      ],
      riskManagement: {
        stopLoss: 2,
        takeProfit: 6,
        maxPositionSize: 5
      },
      executionSettings: {
        timeframe: "1h",
        executionMode: "paper"
      },
      tags: ["test"]
    };

    try {
      const createResponse = await axios.post(`${BASE_URL}/strategies`, testStrategy);
      console.log('✅ Strategy created successfully!');
      console.log('   Strategy ID:', createResponse.data.data._id);
      console.log('   Strategy Name:', createResponse.data.data.name);
    } catch (error) {
      console.log('❌ Strategy creation failed:');
      console.log('   Status:', error.response?.status);
      console.log('   Message:', error.response?.data?.message);
      console.log('   Full error:', error.response?.data);
      
      if (error.response?.status === 401) {
        console.log('\n💡 This is expected - you need to be authenticated to create strategies');
        console.log('   The API is working, but requires login');
      }
    }

    console.log('\n🎯 Next steps:');
    console.log('   1. Make sure backend is running: npm start (in backend folder)');
    console.log('   2. Make sure frontend is running: npm run dev (in frontend folder)');
    console.log('   3. Open http://localhost:8080 and login');
    console.log('   4. Try creating a strategy in the Strategy Builder');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check if backend is running on port 8000');
    console.log('   2. Check backend logs for errors');
    console.log('   3. Verify database connection');
  }
}

// Run the test
testStrategyCreation();
