import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Users,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Eye,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const Dashboard: React.FC = () => {
  // Mock data for charts
  const portfolioData = [
    { name: 'Jan', value: 10000 },
    { name: 'Feb', value: 12000 },
    { name: 'Mar', value: 11500 },
    { name: 'Apr', value: 14000 },
    { name: 'May', value: 13800 },
    { name: 'Jun', value: 16500 },
  ];

  const allocationData = [
    { name: 'Equity Strategies', value: 45, color: '#0ea5e9' },
    { name: 'Options Trading', value: 30, color: '#8b5cf6' },
    { name: 'Futures', value: 15, color: '#f59e0b' },
    { name: 'Cash', value: 10, color: '#10b981' },
  ];

  const activeStrategies = [
    {
      name: 'Moving Average Crossover',
      status: 'Active',
      pnl: '+12.5%',
      trades: 24,
      winRate: '78%',
    },
    {
      name: 'Mean Reversion Bot',
      status: 'Active', 
      pnl: '+8.3%',
      trades: 18,
      winRate: '72%',
    },
    {
      name: 'Momentum Scalper',
      status: 'Paused',
      pnl: '-2.1%',
      trades: 12,
      winRate: '45%',
    },
  ];

  const recentTrades = [
    {
      symbol: 'AAPL',
      action: 'BUY',
      quantity: 100,
      price: 175.25,
      pnl: '+2.5%',
      time: '10:30 AM',
    },
    {
      symbol: 'TSLA',
      action: 'SELL',
      quantity: 50,
      price: 245.80,
      pnl: '+5.2%',
      time: '09:45 AM',
    },
    {
      symbol: 'MSFT',
      action: 'BUY',
      quantity: 75,
      price: 415.60,
      pnl: '-1.2%',
      time: '09:15 AM',
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold gradient-text">Trading Dashboard</h1>
            <p className="text-muted-foreground">Monitor your algorithmic trading performance</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              View Reports
            </Button>
            <Button variant="hero">
              <Plus className="w-4 h-4 mr-2" />
              New Strategy
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card className="gradient-card border-0 shadow-card hover:shadow-premium transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Portfolio</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$164,500</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1 text-profit" />
                +12.5% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="gradient-card border-0 shadow-card hover:shadow-premium transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's P&L</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-profit">+$2,847</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <ArrowUpRight className="w-3 h-3 mr-1 text-profit" />
                +1.73% today
              </p>
            </CardContent>
          </Card>

          <Card className="gradient-card border-0 shadow-card hover:shadow-premium transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Strategies</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">2 paused, 6 running</p>
            </CardContent>
          </Card>

          <Card className="gradient-card border-0 shadow-card hover:shadow-premium transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">74.2%</div>
              <p className="text-xs text-muted-foreground">Across all strategies</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Portfolio Performance */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="gradient-card border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Portfolio Performance
                  <Badge variant="outline" className="text-profit">+65% YTD</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={portfolioData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Asset Allocation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="gradient-card border-0 shadow-card">
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={allocationData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                    >
                      {allocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-4">
                  {allocationData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Active Strategies & Recent Trades */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Active Strategies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="gradient-card border-0 shadow-card">
              <CardHeader>
                <CardTitle>Active Strategies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeStrategies.map((strategy, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="space-y-1">
                      <p className="font-medium">{strategy.name}</p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Badge 
                          variant={strategy.status === 'Active' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {strategy.status}
                        </Badge>
                        <span>{strategy.trades} trades</span>
                        <span>Win: {strategy.winRate}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${strategy.pnl.startsWith('+') ? 'text-profit' : 'text-loss'}`}>
                        {strategy.pnl}
                      </p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  View All Strategies
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Trades */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="gradient-card border-0 shadow-card">
              <CardHeader>
                <CardTitle>Recent Trades</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentTrades.map((trade, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{trade.symbol}</span>
                        <Badge 
                          variant={trade.action === 'BUY' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {trade.action}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {trade.quantity} @ ${trade.price}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${trade.pnl.startsWith('+') ? 'text-profit' : 'text-loss'}`}>
                        {trade.pnl}
                      </p>
                      <p className="text-xs text-muted-foreground">{trade.time}</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  View Trade History
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;