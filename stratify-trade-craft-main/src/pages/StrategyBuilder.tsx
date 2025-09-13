import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Bot,
  Plus,
  Play,
  Pause,
  Save,
  Settings,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Zap,
  Target,
  AlertTriangle,
  Code,
  Layers,
  Loader2,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { strategyAPI, Strategy, StrategyTemplate, BuilderComponents, StrategyRule, RiskManagement, ExecutionSettings } from '@/services/api';

interface StrategyBlock {
  id: string;
  type: 'entry' | 'exit';
  title: string;
  content: string;
  rule?: StrategyRule;
}

const StrategyBuilder: React.FC = () => {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [strategyName, setStrategyName] = useState('My New Strategy');
  const [strategyDescription, setStrategyDescription] = useState('');
  const [strategyCategory, setStrategyCategory] = useState('trend-following');
  const [strategyBlocks, setStrategyBlocks] = useState<StrategyBlock[]>([
    {
      id: 'default_entry',
      type: 'entry',
      title: 'Entry Condition',
      content: 'Price crosses above 20-day SMA',
      rule: {
        id: 'default_entry',
        name: 'Entry Condition',
        type: 'entry' as const,
        conditions: [{
          indicator: 'price',
          operator: 'crosses_above',
          value: 'sma',
          timeframe: '1h'
        }],
        action: {
          type: 'buy' as const,
          quantity: 'all' as const
        },
        logicalOperator: 'AND' as const,
        description: 'Price crosses above 20-day SMA'
      }
    },
    {
      id: 'default_exit',
      type: 'exit',
      title: 'Exit Condition',
      content: 'Price crosses below 20-day SMA',
      rule: {
        id: 'default_exit',
        name: 'Exit Condition',
        type: 'exit' as const,
        conditions: [{
          indicator: 'price',
          operator: 'crosses_below',
          value: 'sma',
          timeframe: '1h'
        }],
        action: {
          type: 'sell' as const,
          quantity: 'all' as const
        },
        logicalOperator: 'AND' as const,
        description: 'Price crosses below 20-day SMA'
      }
    }
  ]);
  const [templates, setTemplates] = useState<StrategyTemplate[]>([]);
  const [builderComponents, setBuilderComponents] = useState<BuilderComponents | null>(null);
  const [riskManagement, setRiskManagement] = useState<RiskManagement>({
    stopLoss: 2,
    takeProfit: 6,
    maxPositionSize: 5,
    maxDailyLoss: 10,
    maxDrawdown: 20,
  });
  const [executionSettings, setExecutionSettings] = useState<ExecutionSettings>({
    timeframe: '1h',
    executionMode: 'paper',
    slippage: 0.1,
    commission: 0.1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [strategyId, setStrategyId] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    loadTemplates();
    loadBuilderComponents();
  }, []);

  const loadTemplates = async () => {
    try {
      setIsLoading(true);
      const response = await strategyAPI.getTemplates();
      if (response.success) {
        setTemplates(response.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load strategy templates",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadBuilderComponents = async () => {
    try {
      const response = await strategyAPI.getBuilderComponents();
      if (response.success) {
        setBuilderComponents(response.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load builder components",
        variant: "destructive",
      });
    }
  };

  const addBlock = (type: 'entry' | 'exit') => {
    const blockId = `block_${Date.now()}`;
    const newBlock: StrategyBlock = {
      id: blockId,
      type,
      title: type === 'entry' ? 'New Entry Condition' : 'New Exit Condition',
      content: type === 'entry' ? 'Price crosses above SMA' : 'Price crosses below SMA',
      rule: {
        id: blockId,
        name: type === 'entry' ? 'New Entry Condition' : 'New Exit Condition',
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
        description: type === 'entry' ? 'Price crosses above SMA' : 'Price crosses below SMA'
      }
    };
    setStrategyBlocks([...strategyBlocks, newBlock]);
  };

  const onDragEnd = (result: any) => {
    const { destination, source } = result;
    if (!destination) return;
    const items = Array.from(strategyBlocks);
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);
    setStrategyBlocks(items);
  };

  // ...existing code...
const handleTemplateSelect = async (templateId: string) => {
  setSelectedTemplate(templateId);
  const template = templates.find(t => t._id === templateId);
  if (template) {
    setStrategyName(`${template.name} - Copy`);
    setStrategyDescription(template.description);
    setStrategyCategory(template.category);
    
    // Convert template rules to blocks
    const entryBlocks: StrategyBlock[] = template.rules
      .filter(rule => rule.type === 'entry')
      .map((rule, index) => ({
        id: `entry_${index}`,
        type: 'entry' as const,
        title: 'Entry Condition',
        content: `${rule.conditions[0]?.indicator} ${rule.conditions[0]?.operator} ${rule.conditions[0]?.value}`,
        rule,
      }));
    
    const exitBlocks: StrategyBlock[] = template.rules
      .filter(rule => rule.type === 'exit')
      .map((rule, index) => ({
        id: `exit_${index}`,
        type: 'exit' as const,
        title: 'Exit Condition',
        content: `${rule.conditions[0]?.indicator} ${rule.conditions[0]?.operator} ${rule.conditions[0]?.value}`,
        rule,
      }));
    
    setStrategyBlocks([...entryBlocks, ...exitBlocks]);
    
    if (template.riskManagement) {
      setRiskManagement(template.riskManagement);
    }
  }
};
// ...existing code...

  const handleSaveStrategy = async () => {
    try {
      setIsSaving(true);
      
      // Validate required fields
      if (!strategyName.trim()) {
        toast({
          title: "Error",
          description: "Strategy name is required",
          variant: "destructive",
        });
        return;
      }
      
      if (!strategyDescription.trim()) {
        toast({
          title: "Error",
          description: "Strategy description is required",
          variant: "destructive",
        });
        return;
      }
      
      // Convert blocks to rules with proper structure for backend validation
      const entryRules = strategyBlocks
        .filter(block => block.type === 'entry')
        .map(block => {
          if (block.rule) {
            return block.rule;
          }
          // Create a default entry rule if none exists
          return {
            id: block.id,
            name: block.title,
            type: 'entry' as const,
            conditions: [{
              indicator: 'price',
              operator: 'crosses_above',
              value: 'sma',
              timeframe: '1h'
            }],
            action: {
              type: 'buy' as const,
              quantity: 'all' as const
            },
            logicalOperator: 'AND' as const,
            description: block.content,
          };
        });
      
      const exitRules = strategyBlocks
        .filter(block => block.type === 'exit')
        .map(block => {
          if (block.rule) {
            return block.rule;
          }
          // Create a default exit rule if none exists
          return {
            id: block.id,
            name: block.title,
            type: 'exit' as const,
            conditions: [{
              indicator: 'price',
              operator: 'crosses_below',
              value: 'sma',
              timeframe: '1h'
            }],
            action: {
              type: 'sell' as const,
              quantity: 'all' as const
            },
            logicalOperator: 'AND' as const,
            description: block.content,
          };
        });

      // Ensure we have at least one entry and one exit rule (backend requirement)
      if (entryRules.length === 0) {
        entryRules.push({
          id: 'default_entry_' + Date.now(),
          name: 'Default Entry Rule',
          type: 'entry' as const,
          conditions: [{
            indicator: 'price',
            operator: 'crosses_above',
            value: 'sma',
            timeframe: '1h'
          }],
          action: {
            type: 'buy' as const,
            quantity: 'all' as const
          },
          logicalOperator: 'AND' as const,
          description: 'Default entry condition'
        });
      }

      if (exitRules.length === 0) {
        exitRules.push({
          id: 'default_exit_' + Date.now(),
          name: 'Default Exit Rule',
          type: 'exit' as const,
          conditions: [{
            indicator: 'price',
            operator: 'crosses_below',
            value: 'sma',
            timeframe: '1h'
          }],
          action: {
            type: 'sell' as const,
            quantity: 'all' as const
          },
          logicalOperator: 'AND' as const,
          description: 'Default exit condition'
        });
      }

      // Ensure all required fields are present with defaults
      const completeRiskManagement = {
        stopLoss: riskManagement.stopLoss || 2,
        takeProfit: riskManagement.takeProfit || 6,
        maxPositionSize: riskManagement.maxPositionSize || 5,
        maxDailyLoss: riskManagement.maxDailyLoss || 10,
        maxDrawdown: riskManagement.maxDrawdown || 20,
      };

      const completeExecutionSettings = {
        timeframe: executionSettings.timeframe || '1h',
        executionMode: executionSettings.executionMode || 'paper',
        slippage: executionSettings.slippage || 0.1,
        commission: executionSettings.commission || 0.1,
        allowMultiplePositions: true,
        maxConcurrentPositions: 5,
        requireExitBeforeEntry: false,
      };

      const strategyData = {
        name: strategyName.trim(),
        description: strategyDescription.trim(),
        category: strategyCategory,
        entryRules,
        exitRules,
        riskManagement: completeRiskManagement,
        executionSettings: completeExecutionSettings,
        tags: ['user-created'],
      };

      // Log the data being sent for debugging
      console.log('Strategy data being sent:', JSON.stringify(strategyData, null, 2));
      console.log('Entry rules count:', entryRules.length);
      console.log('Exit rules count:', exitRules.length);

      let response;
      if (strategyId) {
        response = await strategyAPI.updateStrategy(strategyId, strategyData);
      } else {
        response = await strategyAPI.createStrategy(strategyData);
        if (response.success) {
          setStrategyId(response.data._id);
        }
      }

      if (response.success) {
        toast({
          title: "Success",
          description: strategyId ? "Strategy updated successfully" : "Strategy created successfully",
        });
      }
    } catch (error: any) {
      console.error('Strategy save error:', error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to save strategy";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloneTemplate = async (templateId: string) => {
    try {
      setIsLoading(true);
      const response = await strategyAPI.cloneFromTemplate(templateId, `${strategyName} - Copy`);
      if (response.success) {
        toast({
          title: "Success",
          description: "Strategy cloned from template successfully",
        });
        // Refresh the page or navigate to the new strategy
        window.location.reload();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clone template",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
              <Bot className="w-8 h-8" /> Strategy Builder
            </h1>
            <p className="text-muted-foreground">Create and customize your algorithmic trading strategies</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline"><Code className="w-4 h-4 mr-2" />Code View</Button>
            <Button 
              variant="success" 
              onClick={handleSaveStrategy}
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {isSaving ? 'Saving...' : 'Save Strategy'}
            </Button>
            <Button variant="hero"><Play className="w-4 h-4 mr-2" />Test Strategy</Button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-6">
            <Card className="gradient-card border-0 shadow-card">
              <CardHeader><CardTitle className="text-lg">Strategy Templates</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {isLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : templates.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    <p className="text-sm">No templates available</p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => strategyAPI.seedTemplates()}
                    >
                      Load Templates
                    </Button>
                  </div>
                ) : (
                  templates.map(template => (
                    <div key={template._id} className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-card ${selectedTemplate === template._id ? 'border-primary bg-primary/5' : 'border-border bg-muted/20 hover:border-primary/50'}`} onClick={() => handleTemplateSelect(template._id)}>
                      <div className="flex items-start gap-3">
                        <TrendingUp className="w-5 h-5 text-primary mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{template.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">{template.category}</Badge>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-6 px-2 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCloneTemplate(template._id);
                              }}
                            >
                              Clone
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="gradient-card border-0 shadow-card">
              <CardHeader><CardTitle className="text-lg">Indicators</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {builderComponents?.indicators.map((indicator, index) => (
                  <div key={index} className="p-2 rounded border border-border bg-muted/20 hover:bg-accent cursor-pointer transition-colors" draggable>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{indicator.name}</span>
                      <Badge variant="outline" className="text-xs">{indicator.description}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Canvas */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 space-y-6">
            <Card className="gradient-card border-0 shadow-card">
              <CardHeader>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Input 
                      value={strategyName} 
                      onChange={(e) => setStrategyName(e.target.value)} 
                      className="text-lg font-semibold bg-transparent border-0 p-0 h-auto focus-visible:ring-0" 
                      placeholder="Strategy Name"
                    />
                    <div className="flex gap-2">
                      <Badge variant="outline">Draft</Badge>
                      <Badge variant="secondary">Untested</Badge>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="strategy-description">Description</Label>
                      <Textarea
                        id="strategy-description"
                        value={strategyDescription}
                        onChange={(e) => setStrategyDescription(e.target.value)}
                        placeholder="Describe your strategy..."
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="strategy-category">Category</Label>
                      <Select value={strategyCategory} onValueChange={setStrategyCategory}>
                        <SelectTrigger className="mt-1">
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
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="gradient-card border-0 shadow-card min-h-96">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2"><Layers className="w-5 h-5" /> Strategy Flow</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => addBlock('entry')}><Plus className="w-4 h-4 mr-1" /> Entry</Button>
                    <Button size="sm" variant="outline" onClick={() => addBlock('exit')}><Plus className="w-4 h-4 mr-1" /> Exit</Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="strategyCanvas">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                        {strategyBlocks.map((block, index) => (
                          <Draggable key={block.id} draggableId={block.id.toString()} index={index}>
                            {(provided) => (
                              <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={`p-4 rounded-lg border-2 ${block.type === 'entry' ? 'border-success bg-success/5' : 'border-destructive bg-destructive/5'}`}>
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${block.type === 'entry' ? 'bg-success' : 'bg-destructive'}`} />
                                    <span className="font-medium">{block.title}</span>
                                  </div>
                                  <Button variant="ghost" size="sm"><Settings className="w-4 h-4" /></Button>
                                </div>
                                <p className="text-sm text-muted-foreground">{block.content}</p>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Sidebar */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="space-y-6">
            <Card className="gradient-card border-0 shadow-card">
              <CardHeader><CardTitle className="text-lg flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-warning" /> Risk Management</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="position-size">Position Size (%)</Label>
                  <Input 
                    id="position-size" 
                    type="number" 
                    value={riskManagement.maxPositionSize || ''} 
                    onChange={(e) => setRiskManagement(prev => ({ ...prev, maxPositionSize: Number(e.target.value) }))}
                    placeholder="5" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stop-loss">Stop Loss (%)</Label>
                  <Input 
                    id="stop-loss" 
                    type="number" 
                    value={riskManagement.stopLoss || ''} 
                    onChange={(e) => setRiskManagement(prev => ({ ...prev, stopLoss: Number(e.target.value) }))}
                    placeholder="2" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="take-profit">Take Profit (%)</Label>
                  <Input 
                    id="take-profit" 
                    type="number" 
                    value={riskManagement.takeProfit || ''} 
                    onChange={(e) => setRiskManagement(prev => ({ ...prev, takeProfit: Number(e.target.value) }))}
                    placeholder="6" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-daily-loss">Max Daily Loss (%)</Label>
                  <Input 
                    id="max-daily-loss" 
                    type="number" 
                    value={riskManagement.maxDailyLoss || ''} 
                    onChange={(e) => setRiskManagement(prev => ({ ...prev, maxDailyLoss: Number(e.target.value) }))}
                    placeholder="10" 
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="gradient-card border-0 shadow-card">
              <CardHeader><CardTitle className="text-lg">Market Settings</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="timeframe">Timeframe</Label>
                  <Select value={executionSettings.timeframe} onValueChange={(value) => setExecutionSettings(prev => ({ ...prev, timeframe: value }))}>
                    <SelectTrigger><SelectValue placeholder="Select timeframe" /></SelectTrigger>
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
                <div className="space-y-2">
                  <Label htmlFor="execution-mode">Execution Mode</Label>
                  <Select value={executionSettings.executionMode} onValueChange={(value: 'live' | 'paper') => setExecutionSettings(prev => ({ ...prev, executionMode: value }))}>
                    <SelectTrigger><SelectValue placeholder="Select mode" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paper">Paper Trading</SelectItem>
                      <SelectItem value="live">Live Trading</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slippage">Slippage (%)</Label>
                  <Input 
                    id="slippage" 
                    type="number" 
                    step="0.1"
                    value={executionSettings.slippage || ''} 
                    onChange={(e) => setExecutionSettings(prev => ({ ...prev, slippage: Number(e.target.value) }))}
                    placeholder="0.1" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commission">Commission (%)</Label>
                  <Input 
                    id="commission" 
                    type="number" 
                    step="0.1"
                    value={executionSettings.commission || ''} 
                    onChange={(e) => setExecutionSettings(prev => ({ ...prev, commission: Number(e.target.value) }))}
                    placeholder="0.1" 
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="gradient-card border-0 shadow-card">
              <CardHeader><CardTitle className="text-lg">Quick Actions</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start"><Play className="w-4 h-4 mr-2" />Backtest Strategy</Button>
                <Button variant="outline" className="w-full justify-start"><BarChart3 className="w-4 h-4 mr-2" />View Performance</Button>
                <Button variant="outline" className="w-full justify-start"><Settings className="w-4 h-4 mr-2" />Advanced Settings</Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StrategyBuilder;
