import React, { useState, useEffect } from 'react';
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
import { backtestAPI, strategyAPI, Backtest, BacktestResult } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
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
  const [ticker, setTicker] = useState('');
  const [shortMA, setShortMA] = useState(20);
  const [longMA, setLongMA] = useState(50);
  const [initialCapital, setInitialCapital] = useState(100000);
  const [commission, setCommission] = useState(0.1);
  const [slippage, setSlippage] = useState(0.05);
  const [benchmark, setBenchmark] = useState('spy');
  const [timeframe, setTimeframe] = useState('1d');
  
  // State for backtest results
  const [backtestResults, setBacktestResults] = useState<Backtest | null>(null);
  const [backtestHistory, setBacktestHistory] = useState<Backtest[]>([]);
  const [strategies, setStrategies] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  
  const { toast } = useToast();

  // Load strategies and backtest history on component mount
  useEffect(() => {
    loadStrategies();
    loadTemplates();
    loadBacktestHistory();
  }, []);

  const loadStrategies = async () => {
    try {
      const response = await strategyAPI.getUserStrategies();
      setStrategies(response.data?.strategies || []);
    } catch (error) {
      console.error('Failed to load strategies:', error);
      toast({
        title: "Error",
        description: "Failed to load strategies",
        variant: "destructive",
      });
    }
  };

  const loadTemplates = async () => {
    try {
      const response = await strategyAPI.getTemplates();
      setTemplates(response.data || []);
    } catch (error) {
      console.error('Failed to load templates:', error);
      // Don't show error toast for templates as they might not exist yet
    }
  };

  const seedTemplates = async () => {
    try {
      setLoading(true);
      await strategyAPI.seedTemplates();
      await loadTemplates();
      toast({
        title: "Templates Seeded",
        description: "Strategy templates have been loaded successfully",
      });
    } catch (error: any) {
      console.error('Failed to seed templates:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to seed templates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadBacktestHistory = async () => {
    try {
      const response = await backtestAPI.getBacktests();
      setBacktestHistory(response.data || []);
    } catch (error) {
      console.error('Failed to load backtest history:', error);
    }
  };

  // Extract parameters from strategy schema
  const extractStrategyParameters = (strategy: any) => {
    if (!strategy) return { shortMA: 20, longMA: 50 };

    const rules = strategy.rules || strategy.entryRules || [];
    let shortMA = 20;
    let longMA = 50;

    // Look for SMA parameters in strategy rules
    rules.forEach((rule: any) => {
      if (rule.conditions) {
        rule.conditions.forEach((condition: any) => {
          if (condition.indicator === 'sma' && condition.params?.period) {
            const period = condition.params.period;
            if (period <= 30) {
              shortMA = period;
            } else {
              longMA = period;
            }
          }
        });
      }
    });

    return { shortMA, longMA };
  };

  // Get strategy execution settings for backtesting
  const getStrategyExecutionSettings = (strategy: any) => {
    if (!strategy) return {};

    return {
      // Risk Management
      maxPositionSize: strategy.riskManagement?.maxPositionSize || 10,
      maxDailyLoss: strategy.riskManagement?.maxDailyLoss || 5,
      stopLossEnabled: strategy.riskManagement?.stopLossEnabled || true,
      takeProfitEnabled: strategy.riskManagement?.takeProfitEnabled || false,
      
      // Execution Settings
      allowMultiplePositions: strategy.executionSettings?.allowMultiplePositions || false,
      maxConcurrentPositions: strategy.executionSettings?.maxConcurrentPositions || 1,
      requireExitBeforeEntry: strategy.executionSettings?.requireExitBeforeEntry || true,
      
      // Strategy Rules
      entryRules: strategy.entryRules || [],
      exitRules: strategy.exitRules || [],
      rules: strategy.rules || []
    };
  };

  // Handle strategy selection
  const handleStrategySelection = (strategyId: string) => {
    setSelectedStrategy(strategyId);
    
    const strategy = showTemplates ? 
      templates.find(t => t._id === strategyId) : 
      strategies.find(s => s._id === strategyId);
    
    if (strategy) {
      const params = extractStrategyParameters(strategy);
      setShortMA(params.shortMA);
      setLongMA(params.longMA);
    }
  };

  const runBacktest = async () => {
    if (!selectedStrategy || !ticker) {
      toast({
        title: "Missing Information",
        description: "Please select a strategy and enter a ticker symbol",
        variant: "destructive",
      });
      return;
    }

    if (shortMA >= longMA) {
      toast({
        title: "Invalid Parameters",
        description: "Short MA period must be less than Long MA period",
        variant: "destructive",
      });
      return;
    }

    setIsRunning(true);
    setLoading(true);

    try {
      const strategy = showTemplates ? 
        templates.find(t => t._id === selectedStrategy) : 
        strategies.find(s => s._id === selectedStrategy);
      
      // Use strategy schema variables
      const executionSettings = getStrategyExecutionSettings(strategy);
      let strategyParams = {
        shortMA: shortMA,
        longMA: longMA,
        ...executionSettings
      };
      
      const backtestData = {
        ticker: ticker.toUpperCase(),
        strategyName: strategy?.name || 'Custom Strategy',
        parameters: strategyParams,
        timeframe: timeframe
      };

      const response = await backtestAPI.startBacktest(backtestData);
      setBacktestResults(response.data);
      
      toast({
        title: "Backtest Completed",
        description: "Your backtest has been completed successfully",
      });

      // Reload backtest history
      loadBacktestHistory();
    } catch (error: any) {
      console.error('Backtest failed:', error);
      toast({
        title: "Backtest Failed",
        description: error.response?.data?.message || "Failed to run backtest",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
      setLoading(false);
    }
  };

  // Generate performance data from backtest results
  const generatePerformanceData = () => {
    if (!backtestResults?.results?.trades) return [];
    
    const trades = backtestResults.results.trades;
    const initialValue = initialCapital;
    let currentValue = initialValue;
    const performanceData = [];
    
    // Generate cumulative performance data
    trades.forEach((trade, index) => {
      const returnRate = trade.profitLoss / trade.entryPrice;
      currentValue = currentValue * (1 + returnRate);
      
      performanceData.push({
        date: new Date(trade.exitDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        portfolio: Math.round(currentValue),
        benchmark: Math.round(initialValue * (1 + index * 0.02)) // Simple benchmark growth
      });
    });
    
    return performanceData;
  };

  const generateMonthlyReturns = () => {
    if (!backtestResults?.results?.trades) return [];
    
    const trades = backtestResults.results.trades;
    const monthlyData = {};
    
    // Group trades by month
    trades.forEach(trade => {
      const date = new Date(trade.exitDate);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
      const returnRate = trade.profitLoss / trade.entryPrice;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = [];
      }
      monthlyData[monthKey].push(returnRate);
    });
    
    // Calculate average monthly returns
    return Object.entries(monthlyData).map(([month, returns]) => ({
      month,
      returns: Math.round((returns as number[]).reduce((sum, ret) => sum + ret, 0) / (returns as number[]).length * 100 * 100) / 100
    }));
  };

  const performanceData = generatePerformanceData();
  const monthlyReturns = generateMonthlyReturns();

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
            <Button variant="hero" onClick={runBacktest} disabled={isRunning || loading}>
              <Play className="w-4 h-4 mr-2" />
              {isRunning || loading ? 'Running...' : 'Run Backtest'}
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
                  <Label htmlFor="ticker">Ticker Symbol</Label>
                  <Input
                    id="ticker"
                    placeholder="e.g., AAPL, MSFT, TSLA"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value)}
                  />
                </div>
                
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                  <Label htmlFor="strategy">Select Strategy</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowTemplates(!showTemplates)}
                      >
                        {showTemplates ? 'My Strategies' : 'Templates'}
                      </Button>
                      {templates.length === 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={seedTemplates}
                          disabled={loading}
                        >
                          Load Templates
                        </Button>
                      )}
                    </div>
                  </div>
                  <Select value={selectedStrategy} onValueChange={handleStrategySelection}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a strategy to test" />
                    </SelectTrigger>
                    <SelectContent>
                      {showTemplates ? (
                        templates.length > 0 ? (
                          templates.map((template) => (
                            <SelectItem key={template._id} value={template._id}>
                              <div className="flex items-center justify-between w-full">
                                <span>{template.name}</span>
                                <Badge variant="secondary" className="ml-2">
                                  Template
                                </Badge>
                              </div>
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-4 text-center text-muted-foreground">
                            No templates available. Click "Load Templates" to seed strategy templates.
                          </div>
                        )
                      ) : (
                        strategies.length > 0 ? (
                          strategies.map((strategy) => (
                            <SelectItem key={strategy._id} value={strategy._id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{strategy.name}</span>
                            <Badge
                                  variant={strategy.isActive ? 'default' : 'secondary'}
                              className="ml-2"
                            >
                                  {strategy.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </SelectItem>
                          ))
                        ) : (
                          <div className="p-4 text-center text-muted-foreground">
                            No strategies found. Create a strategy in the Strategy Builder or load templates.
                          </div>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timeframe">Timeframe</Label>
                  <Select value={timeframe} onValueChange={setTimeframe}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1d">Daily</SelectItem>
                      <SelectItem value="1h">Hourly</SelectItem>
                      <SelectItem value="5m">5 Minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="p-3 rounded-lg bg-muted/30 text-sm">
                  <p className="font-medium mb-1">Selected Strategy:</p>
                  <p className="text-muted-foreground">
                    {selectedStrategy ? 
                      (showTemplates ? 
                        templates.find(t => t._id === selectedStrategy)?.name : 
                        strategies.find(s => s._id === selectedStrategy)?.name
                      ) : 'No strategy selected'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Strategy Parameters */}
            <Card className="gradient-card border-0 shadow-card">
              <CardHeader>
                <CardTitle>Strategy Parameters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="short-ma">Short MA Period</Label>
                    <Input
                      id="short-ma"
                      type="number"
                      placeholder="20"
                      value={shortMA}
                      onChange={(e) => setShortMA(Number(e.target.value))}
                      min="1"
                      max="100"
                    />
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="long-ma">Long MA Period</Label>
                    <Input
                      id="long-ma"
                      type="number"
                      placeholder="50"
                      value={longMA}
                      onChange={(e) => setLongMA(Number(e.target.value))}
                      min="1"
                      max="200"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="initial-capital">Initial Capital</Label>
                  <Input
                    id="initial-capital"
                    type="number"
                    placeholder="100000"
                    value={initialCapital}
                    onChange={(e) => setInitialCapital(Number(e.target.value))}
                  />
                </div>
                
                <div className="p-3 rounded-lg bg-muted/30 text-sm">
                  <p className="font-medium mb-1">Strategy Configuration:</p>
                  {selectedStrategy ? (
                    <div className="space-y-1 text-muted-foreground">
                      <p>• MA Parameters: {shortMA}-period vs {longMA}-period</p>
                      <p>• Max Position Size: {getStrategyExecutionSettings(showTemplates ? 
                        templates.find(t => t._id === selectedStrategy) : 
                        strategies.find(s => s._id === selectedStrategy))?.maxPositionSize || 10}%</p>
                      <p>• Max Daily Loss: {getStrategyExecutionSettings(showTemplates ? 
                        templates.find(t => t._id === selectedStrategy) : 
                        strategies.find(s => s._id === selectedStrategy))?.maxDailyLoss || 5}%</p>
                      <p>• Stop Loss: {getStrategyExecutionSettings(showTemplates ? 
                        templates.find(t => t._id === selectedStrategy) : 
                        strategies.find(s => s._id === selectedStrategy))?.stopLossEnabled ? 'Enabled' : 'Disabled'}</p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Select a strategy to see its configuration</p>
                  )}
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
                  <Input 
                    id="commission" 
                    type="number" 
                    step="0.01" 
                    placeholder="0.1" 
                    value={commission}
                    onChange={(e) => setCommission(Number(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="slippage">Slippage (%)</Label>
                  <Input 
                    id="slippage" 
                    type="number" 
                    step="0.01" 
                    placeholder="0.05" 
                    value={slippage}
                    onChange={(e) => setSlippage(Number(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="benchmark">Benchmark</Label>
                  <Select value={benchmark} onValueChange={setBenchmark}>
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
                      <p className={`text-2xl font-bold ${backtestResults?.results?.totalReturn ? (backtestResults.results.totalReturn >= 0 ? 'text-profit' : 'text-loss') : ''}`}>
                        {backtestResults?.results?.totalReturn ? `${(backtestResults.results.totalReturn * 100).toFixed(2)}%` : 'N/A'}
                      </p>
                    </div>
                    <TrendingUp className={`w-8 h-8 ${backtestResults?.results?.totalReturn ? (backtestResults.results.totalReturn >= 0 ? 'text-profit' : 'text-loss') : 'text-muted-foreground'}`} />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="gradient-card border-0 shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
                      <p className="text-2xl font-bold">
                        {backtestResults?.results?.sharpeRatio ? backtestResults.results.sharpeRatio.toFixed(2) : 'N/A'}
                      </p>
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
                      <p className="text-2xl font-bold text-loss">
                        {backtestResults?.results?.maxDrawdown ? `${(backtestResults.results.maxDrawdown * 100).toFixed(2)}%` : 'N/A'}
                      </p>
                    </div>
                    <TrendingDown className="w-8 h-8 text-loss" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="gradient-card border-0 shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Volatility</p>
                      <p className="text-2xl font-bold">
                        {backtestResults?.results?.volatility ? `${(backtestResults.results.volatility * 100).toFixed(2)}%` : 'N/A'}
                      </p>
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
                {performanceData.length > 0 ? (
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
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Run a backtest to see performance charts</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Monthly Returns */}
            <Card className="gradient-card border-0 shadow-card">
              <CardHeader>
                <CardTitle>Monthly Returns</CardTitle>
              </CardHeader>
              <CardContent>
                {monthlyReturns.length > 0 ? (
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
                ) : (
                  <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Run a backtest to see monthly returns</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Backtest History */}
            {backtestHistory.length > 0 && (
              <Card className="gradient-card border-0 shadow-card">
                <CardHeader>
                  <CardTitle>Recent Backtests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {backtestHistory.slice(0, 5).map((backtest) => (
                      <div
                        key={backtest._id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => setBacktestResults(backtest)}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{backtest.ticker}</span>
                            <Badge variant="outline">{backtest.strategyName}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(backtest.createdAt), 'MMM dd, yyyy HH:mm')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${backtest.results?.totalReturn ? (backtest.results.totalReturn >= 0 ? 'text-profit' : 'text-loss') : ''}`}>
                            {backtest.results?.totalReturn ? `${(backtest.results.totalReturn * 100).toFixed(2)}%` : 'N/A'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Sharpe: {backtest.results?.sharpeRatio ? backtest.results.sharpeRatio.toFixed(2) : 'N/A'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>

        {/* Running Status */}
        {(isRunning || loading) && (
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