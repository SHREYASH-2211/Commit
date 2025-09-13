# 🧪 Strategy API Integration Testing Guide

## 🚀 Quick Start

### 1. **Start the Backend**
```bash
cd backend
npm install
npm start
```
**Expected:** Server running on `http://localhost:8000`

### 2. **Start the Frontend**
```bash
cd stratify-trade-craft-main
npm install
npm run dev
```
**Expected:** Frontend running on `http://localhost:8080`

### 3. **Test API Endpoints**
```bash
cd /Users/shreyashsingh/Documents/Hackathon/Commit
node test-strategy-api.js
```

## 🔍 What Each Feature Does

### 📊 **Dashboard Features**
- **Displays real strategy data** from your backend
- **Shows strategy statistics** (total, active, paused)
- **Strategy management buttons**:
  - ▶️ **Play/Pause**: Toggle strategy active status
  - ✏️ **Edit**: Navigate to strategy detail page
  - 🗑️ **Delete**: Remove strategy (with confirmation)
- **Empty state**: Shows "Create Strategy" button when no strategies exist

### 🏗️ **Strategy Builder Features**
- **Template Selection**: Choose from pre-built strategy templates
- **Dynamic Form**: Strategy name, description, category
- **Rule Building**: Add entry/exit rules with drag-and-drop
- **Risk Management**: Configure stop-loss, take-profit, position sizing
- **Execution Settings**: Set timeframe, execution mode, slippage
- **Real-time Saving**: Auto-save with loading indicators
- **Template Cloning**: Copy existing templates to create new strategies

### 📋 **Strategy Detail Features**
- **Complete Strategy View**: All strategy information in one place
- **Inline Editing**: Edit strategy properties directly
- **Rule Management**: Add/remove entry and exit rules
- **Status Control**: Activate/pause strategies
- **Risk Settings**: Modify risk management parameters
- **Delete Confirmation**: Safe strategy deletion

## 🧪 Step-by-Step Testing

### **Test 1: Backend API**
1. Run `node test-strategy-api.js`
2. **Expected Results**:
   - ✅ Components endpoint returns indicators, operators, etc.
   - ✅ Templates endpoint returns strategy templates
   - ❌ Strategies endpoint returns 401 (expected - needs auth)

### **Test 2: Frontend Login**
1. Open `http://localhost:8080`
2. Click "Login" or "Sign Up"
3. Create account or login
4. **Expected**: Redirected to Dashboard

### **Test 3: Dashboard Loading**
1. After login, you should see the Dashboard
2. **Expected Results**:
   - Loading spinner initially
   - Strategy count in stats cards
   - "No strategies created yet" message (if empty)
   - "Create Strategy" button

### **Test 4: Strategy Builder**
1. Click "New Strategy" button
2. **Expected Results**:
   - Strategy Builder page loads
   - Templates load in left sidebar
   - Indicators load in left sidebar
   - Form fields are editable

### **Test 5: Create Strategy**
1. In Strategy Builder:
   - Enter strategy name: "Test Strategy"
   - Add description: "My first test strategy"
   - Select category: "Trend Following"
   - Click "Save Strategy"
2. **Expected Results**:
   - Loading spinner appears
   - Success toast notification
   - Strategy appears in Dashboard

### **Test 6: Strategy Management**
1. In Dashboard, find your created strategy
2. **Test Play/Pause**:
   - Click play/pause button
   - **Expected**: Status changes, toast notification
3. **Test Edit**:
   - Click edit button
   - **Expected**: Navigate to Strategy Detail page
4. **Test Delete**:
   - Click delete button
   - **Expected**: Confirmation dialog, strategy removed

### **Test 7: Strategy Detail Page**
1. Click edit button on any strategy
2. **Expected Results**:
   - Strategy details load
   - All form fields populated
   - Entry/exit rules displayed
   - Risk management settings shown

### **Test 8: Template System**
1. In Strategy Builder, click on a template
2. **Expected Results**:
   - Strategy name updates
   - Description updates
   - Rules populate in the canvas
   - Risk management settings update

## 🐛 Common Issues & Solutions

### **Issue: "Failed to load strategies"**
**Solution**: 
- Check if backend is running on port 8000
- Verify database connection
- Check browser console for CORS errors

### **Issue: "Failed to load templates"**
**Solution**:
- Run `POST /api/v1/strategies/seed-templates` to populate templates
- Check if templates exist in database

### **Issue: CORS errors**
**Solution**:
- Backend CORS is configured for `http://localhost:8080`
- Make sure frontend is running on port 8080
- Check backend logs for CORS issues

### **Issue: Authentication errors**
**Solution**:
- Make sure you're logged in
- Check if JWT token is valid
- Clear localStorage and login again

## 📱 Frontend URLs

- **Dashboard**: `http://localhost:8080/dashboard`
- **Strategy Builder**: `http://localhost:8080/strategy-builder`
- **Strategy Detail**: `http://localhost:8080/strategy/{id}`

## 🔧 Backend Endpoints

- **Components**: `GET /api/v1/strategies/components`
- **Templates**: `GET /api/v1/strategies/templates`
- **User Strategies**: `GET /api/v1/strategies`
- **Create Strategy**: `POST /api/v1/strategies`
- **Update Strategy**: `PUT /api/v1/strategies/{id}`
- **Delete Strategy**: `DELETE /api/v1/strategies/{id}`

## 🎯 Expected User Flow

1. **Login** → Dashboard loads with strategy list
2. **Create Strategy** → Strategy Builder with templates
3. **Configure Strategy** → Add rules, risk management
4. **Save Strategy** → Returns to Dashboard
5. **Manage Strategy** → Edit, activate/pause, delete
6. **View Details** → Complete strategy information

## 🚨 Debugging Tips

1. **Check Browser Console** for JavaScript errors
2. **Check Network Tab** for failed API calls
3. **Check Backend Logs** for server errors
4. **Use Browser DevTools** to inspect API responses
5. **Test API directly** with Postman or curl

## 📊 Success Indicators

- ✅ Dashboard loads with real data
- ✅ Strategy Builder creates strategies
- ✅ Templates load and can be cloned
- ✅ Strategy management works (edit, delete, toggle)
- ✅ No console errors
- ✅ Smooth user experience with loading states
