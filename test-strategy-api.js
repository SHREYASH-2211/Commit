// Test script to verify strategy API endpoints
const axios = require('axios');

const BASE_URL = 'http://localhost:8000/api/v1';

async function testStrategyAPI() {
  console.log('🧪 Testing Strategy API Endpoints...\n');

  try {
    // Test 1: Get strategy components
    console.log('1️⃣ Testing GET /strategies/components');
    const componentsResponse = await axios.get(`${BASE_URL}/strategies/components`);
    console.log('✅ Components loaded:', componentsResponse.data.success);
    console.log('   Indicators:', componentsResponse.data.data.indicators.length);
    console.log('   Operators:', componentsResponse.data.data.operators.length);
    console.log('');

    // Test 2: Get strategy templates
    console.log('2️⃣ Testing GET /strategies/templates');
    const templatesResponse = await axios.get(`${BASE_URL}/strategies/templates`);
    console.log('✅ Templates loaded:', templatesResponse.data.success);
    console.log('   Template count:', templatesResponse.data.data.length);
    console.log('');

    // Test 3: Test user strategies (this will fail without auth, but we can see the response)
    console.log('3️⃣ Testing GET /strategies (requires auth)');
    try {
      const strategiesResponse = await axios.get(`${BASE_URL}/strategies`);
      console.log('✅ Strategies loaded:', strategiesResponse.data.success);
    } catch (error) {
      console.log('❌ Expected error (no auth):', error.response?.status, error.response?.data?.message);
    }
    console.log('');

    console.log('🎉 API endpoints are responding correctly!');
    console.log('📝 Next steps:');
    console.log('   1. Start the frontend: npm run dev (in frontend folder)');
    console.log('   2. Start the backend: npm start (in backend folder)');
    console.log('   3. Open http://localhost:8080 in your browser');
    console.log('   4. Login/Register to test strategy features');

  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Make sure backend is running: npm start (in backend folder)');
    console.log('   2. Check if backend is on port 8000');
    console.log('   3. Verify database connection');
  }
}

// Run the test
testStrategyAPI();
