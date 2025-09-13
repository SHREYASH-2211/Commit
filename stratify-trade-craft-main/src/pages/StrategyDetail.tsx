import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Edit,
  Save,
  Trash2,
  Play,
  Pause,
  Settings,
  Plus,
  Minus,
  BarChart3,
  AlertTriangle,
  Bot,
  Loader2,
} from 'lucide-react';
import { strategyAPI, Strategy, StrategyRule, RiskManagement, ExecutionSettings } from '@/services/api';

const StrategyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedStrategy, setEditedStrategy] = useState<Partial<Strategy>>({});

  useEffect(() => {
    if (id) {
      loadStrategy(id);
    }
  }, [id]);

  const loadStrategy = async (strategyId: string) => {
    try {
      setIsLoading(true);
      const response = await strategyAPI.getStrategy(strategyId);
      if (response.success) {
        setStrategy(response.data);
        setEditedStrategy(response.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load strategy",
        variant: "destructive",
      });
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!id) return;
    
    try {
      setIsSaving(true);
      const response = await strategyAPI.updateStrategy(id, editedStrategy);
      if (response.success) {
        setStrategy(response.data);
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Strategy updated successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update strategy",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async () => {
    if (!id || !strategy) return;
    
    try {
      const response = await strategyAPI.updateStrategy(id, { isActive: !strategy.isActive });
      if (response.success) {
        setStrategy(response.data);
        toast({
          title: "Success",
          description: `Strategy ${!strategy.isActive ? 'activated' : 'paused'} successfully`,
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

  const handleDelete = async () => {
    if (!id) return;
    
    if (window.confirm('Are you sure you want to delete this strategy?')) {
      try {
        const response = await strategyAPI.deleteStrategy(id);
        if (response.success) {
          toast({
            title: "Success",
            description: "Strategy deleted successfully",
          });
          navigate('/dashboard');
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete strategy",
          variant: "destructive",
        });
      }
    }
  };

  const addRule = (type: 'entry' | 'exit') => {
    const newRule: StrategyRule = {
      id: `rule_${Date.now()}`,
      name: type === 'entry' ? 'Entry Condition' : 'Exit Condition',
      type,
      conditions: [{
        indicator: 'price',
        operator: type === 'entry' ? 'crosses_above' : 'crosses_below',
        value: 'sma',
        timeframe: '1h'
      }],
      action: {
        type: type === 'entry' ? 'buy' : 'sell',
        quantity: 'all'
      },
      logicalOperator: 'AND',
      description: '',
    };

    if (type === 'entry') {
      setEditedStrategy(prev => ({
        ...prev,
        entryRules: [...(prev.entryRules || []), newRule]
      }));
    } else {
      setEditedStrategy(prev => ({
        ...prev,
        exitRules: [...(prev.exitRules || []), newRule]
      }));
    }
  };

  const removeRule = (type: 'entry' | 'exit', ruleId: string) => {
    if (type === 'entry') {
      setEditedStrategy(prev => ({
        ...prev,
        entryRules: (prev.entryRules || []).filter(rule => rule.id !== ruleId)
      }));
    } else {
      setEditedStrategy(prev => ({
        ...prev,
        exitRules: (prev.exitRules || []).filter(rule => rule.id !== ruleId)
      }));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!strategy) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Strategy not found</h2>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const currentStrategy = isEditing ? editedStrategy : strategy;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
                <Bot className="w-8 h-8" />
                {currentStrategy.name}
              </h1>
              <p className="text-muted-foreground">{currentStrategy.description}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant={strategy.isActive ? "destructive" : "default"}
              onClick={handleToggleActive}
            >
              {strategy.isActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {strategy.isActive ? 'Pause' : 'Activate'}
            </Button>
            {isEditing ? (
              <Button variant="success" onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </motion.div>

        {/* Strategy Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid lg:grid-cols-3 gap-6"
        >
          <Card className="gradient-card border-0 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Strategy Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={currentStrategy.name || ''}
                  onChange={(e) => setEditedStrategy(prev => ({ ...prev, name: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={currentStrategy.description || ''}
                  onChange={(e) => setEditedStrategy(prev => ({ ...prev, description: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={currentStrategy.category || ''}
                  onValueChange={(value) => setEditedStrategy(prev => ({ ...prev, category: value }))}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trend-following">Trend Following</SelectItem>
                    <SelectItem value="mean-reversion">Mean Reversion</SelectItem>
                    <SelectItem value="momentum">Momentum</SelectItem>
                    <SelectItem value="breakout">Breakout</SelectItem>
                    <SelectItem value="scalping">Scalping</SelectItem>
                    <SelectItem value="swing">Swing Trading</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={strategy.isActive ? 'default' : 'secondary'}>
                  {strategy.isActive ? 'Active' : 'Paused'}
                </Badge>
                <Badge variant="outline">{strategy.category}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card border-0 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Risk Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="stopLoss">Stop Loss (%)</Label>
                <Input
                  id="stopLoss"
                  type="number"
                  value={currentStrategy.riskManagement?.stopLoss || ''}
                  onChange={(e) => setEditedStrategy(prev => ({
                    ...prev,
                    riskManagement: { ...prev.riskManagement, stopLoss: Number(e.target.value) }
                  }))}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="takeProfit">Take Profit (%)</Label>
                <Input
                  id="takeProfit"
                  type="number"
                  value={currentStrategy.riskManagement?.takeProfit || ''}
                  onChange={(e) => setEditedStrategy(prev => ({
                    ...prev,
                    riskManagement: { ...prev.riskManagement, takeProfit: Number(e.target.value) }
                  }))}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="maxPositionSize">Max Position Size (%)</Label>
                <Input
                  id="maxPositionSize"
                  type="number"
                  value={currentStrategy.riskManagement?.maxPositionSize || ''}
                  onChange={(e) => setEditedStrategy(prev => ({
                    ...prev,
                    riskManagement: { ...prev.riskManagement, maxPositionSize: Number(e.target.value) }
                  }))}
                  disabled={!isEditing}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card border-0 shadow-card">
            <CardHeader>
              <CardTitle>Execution Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="timeframe">Timeframe</Label>
                <Select
                  value={currentStrategy.executionSettings?.timeframe || ''}
                  onValueChange={(value) => setEditedStrategy(prev => ({
                    ...prev,
                    executionSettings: { ...prev.executionSettings, timeframe: value }
                  }))}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1m">1 Minute</SelectItem>
                    <SelectItem value="5m">5 Minutes</SelectItem>
                    <SelectItem value="15m">15 Minutes</SelectItem>
                    <SelectItem value="1h">1 Hour</SelectItem>
                    <SelectItem value="4h">4 Hours</SelectItem>
                    <SelectItem value="1d">1 Day</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="executionMode">Execution Mode</Label>
                <Select
                  value={currentStrategy.executionSettings?.executionMode || ''}
                  onValueChange={(value: 'live' | 'paper') => setEditedStrategy(prev => ({
                    ...prev,
                    executionSettings: { ...prev.executionSettings, executionMode: value }
                  }))}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paper">Paper Trading</SelectItem>
                    <SelectItem value="live">Live Trading</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Rules */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid lg:grid-cols-2 gap-6"
        >
          {/* Entry Rules */}
          <Card className="gradient-card border-0 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Entry Rules ({currentStrategy.entryRules?.length || 0})
                {isEditing && (
                  <Button size="sm" onClick={() => addRule('entry')}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Rule
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentStrategy.entryRules?.map((rule, index) => (
                <div key={rule.id} className="p-3 rounded-lg border border-border bg-muted/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Rule {index + 1}</span>
                    {isEditing && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeRule('entry', rule.id)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {rule.conditions[0]?.indicator} {rule.conditions[0]?.operator} {rule.conditions[0]?.value}
                  </p>
                  {rule.description && (
                    <p className="text-xs text-muted-foreground mt-1">{rule.description}</p>
                  )}
                </div>
              ))}
              {(!currentStrategy.entryRules || currentStrategy.entryRules.length === 0) && (
                <div className="text-center py-4 text-muted-foreground">
                  <p className="text-sm">No entry rules defined</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Exit Rules */}
          <Card className="gradient-card border-0 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Exit Rules ({currentStrategy.exitRules?.length || 0})
                {isEditing && (
                  <Button size="sm" onClick={() => addRule('exit')}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Rule
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentStrategy.exitRules?.map((rule, index) => (
                <div key={rule.id} className="p-3 rounded-lg border border-border bg-muted/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Rule {index + 1}</span>
                    {isEditing && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeRule('exit', rule.id)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {rule.conditions[0]?.indicator} {rule.conditions[0]?.operator} {rule.conditions[0]?.value}
                  </p>
                  {rule.description && (
                    <p className="text-xs text-muted-foreground mt-1">{rule.description}</p>
                  )}
                </div>
              ))}
              {(!currentStrategy.exitRules || currentStrategy.exitRules.length === 0) && (
                <div className="text-center py-4 text-muted-foreground">
                  <p className="text-sm">No exit rules defined</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center gap-4"
        >
          <Button variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Run Backtest
          </Button>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Advanced Settings
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default StrategyDetail;