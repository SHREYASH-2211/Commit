import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import {
  BarChart3,
  Play,
  Download,
  Settings,
  CalendarIcon,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

const Backtesting: React.FC = () => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [isRunning, setIsRunning] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState('');

  // Mock backtest results data
  const performanceData = [
    { date: '2023-01', portfolio: 10000, benchmark: 10000 },
    { date: '2023-02', portfolio: 10500, benchmark: 10200 },
    { date: '2023-03', portfolio: 11200, benchmark: 10100 },
    { date: '2023-04', portfolio: 10800, benchmark: 10400 },
    { date: '2023-05', portfolio: 12100, benchmark: 10600 },
    { date: '2023-06', portfolio: 13500, benchmark: 11000 },
  ];

  const monthlyReturns = [
    { month: 'Jan', returns: 5.0 },
    { month: 'Feb', returns: 6.7 },
    { month: 'Mar', returns: -3.6 },
    { month: 'Apr', returns: 12.0 },
    { month: 'May', returns: 11.5 },
    { month: 'Jun', returns: 8.3 },
  ];

  const strategies = [
    { id: 'ma-crossover', name: 'Moving Average Crossover', status: 'Ready' },
    { id: 'mean-reversion', name: 'Mean Reversion Bot', status: 'Ready' },
    { id: 'momentum', name: 'Momentum Scalper', status: 'Draft' },
  ];

  const runBacktest = async () => {
    setIsRunning(true);
    // Simulate backtest running
    setTimeout(() => {
      setIsRunning(false);
    }, 3000);
  };

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
            <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
              <BarChart3 className="w-8 h-8" />
              Backtesting Engine
            </h1>
            <p className="text-muted-foreground">Test your strategies against historical market data</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Results
            </Button>
            <Button variant="hero" onClick={runBacktest} disabled={isRunning}>
              <Play className="w-4 h-4 mr-2" />
              {isRunning ? 'Running...' : 'Run Backtest'}
            </Button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Strategy Selection */}
            <Card className="gradient-card border-0 shadow-card">
              <CardHeader>
                <CardTitle>Strategy Selection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="strategy">Select Strategy</Label>
                  <Select value={selectedStrategy} onValueChange={setSelectedStrategy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a strategy to test" />
                    </SelectTrigger>
                    <SelectContent>
                      {strategies.map((strategy) => (
                        <SelectItem key={strategy.id} value={strategy.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{strategy.name}</span>
                            <Badge
                              variant={strategy.status === 'Ready' ? 'default' : 'secondary'}
                              className="ml-2"
                            >
                              {strategy.status}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="p-3 rounded-lg bg-muted/30 text-sm">
                  <p className="font-medium mb-1">Selected Strategy:</p>
                  <p className="text-muted-foreground">
                    {selectedStrategy ? strategies.find(s => s.id === selectedStrategy)?.name : 'No strategy selected'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Date Range */}
            <Card className="gradient-card border-0 shadow-card">
              <CardHeader>
                <CardTitle>Backtest Period</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="initial-capital">Initial Capital</Label>
                  <Input
                    id="initial-capital"
                    type="number"
                    placeholder="100000"
                    defaultValue="100000"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Advanced Settings */}
            <Card className="gradient-card border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Advanced Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="commission">Commission (%)</Label>
                  <Input id="commission" type="number" step="0.01" placeholder="0.1" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="slippage">Slippage (%)</Label>
                  <Input id="slippage" type="number" step="0.01" placeholder="0.05" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="benchmark">Benchmark</Label>
                  <Select defaultValue="spy">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spy">S&P 500 (SPY)</SelectItem>
                      <SelectItem value="qqq">NASDAQ (QQQ)</SelectItem>
                      <SelectItem value="iwm">Russell 2000 (IWM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Performance Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="gradient-card border-0 shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Return</p>
                      <p className="text-2xl font-bold text-profit">+35.2%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-profit" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="gradient-card border-0 shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
                      <p className="text-2xl font-bold">1.84</p>
                    </div>
                    <Target className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="gradient-card border-0 shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Max Drawdown</p>
                      <p className="text-2xl font-bold text-loss">-8.3%</p>
                    </div>
                    <TrendingDown className="w-8 h-8 text-loss" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="gradient-card border-0 shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Win Rate</p>
                      <p className="text-2xl font-bold">68.7%</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-success" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Chart */}
            <Card className="gradient-card border-0 shadow-card">
              <CardHeader>
                <CardTitle>Cumulative Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
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
                      dataKey="portfolio" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      name="Strategy"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="benchmark" 
                      stroke="hsl(var(--muted-foreground))" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Benchmark"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Monthly Returns */}
            <Card className="gradient-card border-0 shadow-card">
              <CardHeader>
                <CardTitle>Monthly Returns</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={monthlyReturns}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar 
                      dataKey="returns" 
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Running Status */}
        {isRunning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <Card className="gradient-card border-0 shadow-premium p-8 text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Clock className="w-8 h-8 text-primary animate-spin" />
                <div>
                  <h3 className="text-xl font-semibold">Running Backtest</h3>
                  <p className="text-muted-foreground">Analyzing historical data...</p>
                </div>
              </div>
              <div className="w-64 bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full animate-pulse w-2/3"></div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Backtesting;