import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
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
  Loader2,
  Play,
  Pause,
  Edit,
  Trash2,
  Settings,
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
import { strategyAPI, Strategy, StrategyListResponse } from '@/services/api';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStrategies: 0,
    activeStrategies: 0,
    pausedStrategies: 0,
    totalPnL: 0,
  });

  // Mock data for charts (these would come from backtesting/performance APIs)
  const portfolioData = [
    { name: 'Jan', value: 10000 },
    { name: 'Feb', value: 12000 },
    { name: 'Mar', value: 11500 },
    { name: 'Apr', value: 14000 },
    { name: 'May', value: 13800 },
    { name: 'Jun', value: 16500 },
  ];

  const allocationData = [
    { name: 'Trend Following', value: 35, color: '#0ea5e9' },
    { name: 'Mean Reversion', value: 25, color: '#8b5cf6' },
    { name: 'Momentum', value: 20, color: '#f59e0b' },
    { name: 'Breakout', value: 15, color: '#10b981' },
    { name: 'Other', value: 5, color: '#ef4444' },
  ];

  // Load strategies on component mount
  useEffect(() => {
    loadStrategies();
  }, []);

  const loadStrategies = async () => {
    try {
      setIsLoading(true);
      const response = await strategyAPI.getUserStrategies({ limit: 10 });
      if (response.success) {
        setStrategies(response.data.strategies);
        updateStats(response.data.strategies);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load strategies",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateStats = (strategyList: Strategy[]) => {
    const active = strategyList.filter(s => s.isActive).length;
    const paused = strategyList.filter(s => !s.isActive).length;
    
    setStats({
      totalStrategies: strategyList.length,
      activeStrategies: active,
      pausedStrategies: paused,
      totalPnL: 0, // This would come from performance data
    });
  };

  const handleToggleStrategy = async (strategyId: string, isActive: boolean) => {
    try {
      const response = await strategyAPI.updateStrategy(strategyId, { isActive: !isActive });
      if (response.success) {
        setStrategies(prev => 
          prev.map(s => s._id === strategyId ? { ...s, isActive: !isActive } : s)
        );
        updateStats(strategies.map(s => s._id === strategyId ? { ...s, isActive: !isActive } : s));
        toast({
          title: "Success",
          description: `Strategy ${!isActive ? 'activated' : 'paused'} successfully`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update strategy status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteStrategy = async (strategyId: string) => {
    try {
      const response = await strategyAPI.deleteStrategy(strategyId);
      if (response.success) {
        setStrategies(prev => prev.filter(s => s._id !== strategyId));
        updateStats(strategies.filter(s => s._id !== strategyId));
        toast({
          title: "Success",
          description: "Strategy deleted successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete strategy",
        variant: "destructive",
      });
    }
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
              <CardTitle className="text-sm font-medium">Total Strategies</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStrategies}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeStrategies} active, {stats.pausedStrategies} paused
              </p>
            </CardContent>
          </Card>

          <Card className="gradient-card border-0 shadow-card hover:shadow-premium transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Strategies</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-profit">{stats.activeStrategies}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <ArrowUpRight className="w-3 h-3 mr-1 text-profit" />
                Currently running
              </p>
            </CardContent>
          </Card>

          <Card className="gradient-card border-0 shadow-card hover:shadow-premium transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paused Strategies</CardTitle>
              <Pause className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pausedStrategies}</div>
              <p className="text-xs text-muted-foreground">Not currently active</p>
            </CardContent>
          </Card>

          <Card className="gradient-card border-0 shadow-card hover:shadow-premium transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0.00</div>
              <p className="text-xs text-muted-foreground">From backtesting data</p>
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
                <CardTitle>My Strategies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : strategies.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">No strategies created yet</p>
                    <Button variant="outline" className="mt-4">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Strategy
                    </Button>
                  </div>
                ) : (
                  strategies.map((strategy) => (
                    <div key={strategy._id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{strategy.name}</p>
                          <Badge variant="outline" className="text-xs">{strategy.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">{strategy.description}</p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <Badge 
                            variant={strategy.isActive ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {strategy.isActive ? 'Active' : 'Paused'}
                          </Badge>
                          <span>{strategy.entryRules.length} entry rules</span>
                          <span>{strategy.exitRules.length} exit rules</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleStrategy(strategy._id, strategy.isActive)}
                        >
                          {strategy.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate(`/strategy/${strategy._id}`)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteStrategy(strategy._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
                {strategies.length > 0 && (
                  <Button variant="outline" className="w-full">
                    View All Strategies
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Strategy Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="gradient-card border-0 shadow-card">
              <CardHeader>
                <CardTitle>Strategy Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">Performance data will appear here</p>
                  <p className="text-xs mt-2">Run backtests to see strategy performance</p>
                </div>
                <Button variant="outline" className="w-full">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Run Backtest
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