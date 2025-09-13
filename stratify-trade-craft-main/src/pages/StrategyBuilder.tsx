import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
} from 'lucide-react';

interface StrategyBlock {
  id: number;
  type: 'entry' | 'exit';
  title: string;
  content: string;
}

const StrategyBuilder: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [strategyName, setStrategyName] = useState('My New Strategy');
  const [strategyBlocks, setStrategyBlocks] = useState<StrategyBlock[]>([
    { id: 1, type: 'entry', title: 'Entry Condition', content: 'When price crosses above 20-day SMA' },
    { id: 2, type: 'exit', title: 'Stop Loss', content: '2% below entry price' },
  ]);

  const templates = [
    { id: 'moving-average', name: 'Moving Average Crossover', description: 'Classic trend-following strategy using SMA crossovers', risk: 'Medium', complexity: 'Beginner', icon: TrendingUp },
    { id: 'mean-reversion', name: 'Mean Reversion', description: 'Buy low, sell high based on price deviation from mean', risk: 'Low', complexity: 'Intermediate', icon: BarChart3 },
    { id: 'momentum', name: 'Momentum Trading', description: 'Follow strong price movements with momentum indicators', risk: 'High', complexity: 'Advanced', icon: Zap },
    { id: 'breakout', name: 'Breakout Strategy', description: 'Capture profits from price breakouts above/below key levels', risk: 'Medium', complexity: 'Intermediate', icon: Target },
  ];

  const indicators = [
    { name: 'Simple Moving Average (SMA)', type: 'Trend' },
    { name: 'Exponential Moving Average (EMA)', type: 'Trend' },
    { name: 'Relative Strength Index (RSI)', type: 'Momentum' },
    { name: 'MACD', type: 'Momentum' },
    { name: 'Bollinger Bands', type: 'Volatility' },
    { name: 'Stochastic', type: 'Momentum' },
  ];

  const addBlock = (type: 'entry' | 'exit') => {
    const newBlock: StrategyBlock = {
      id: Date.now(),
      type,
      title: type === 'entry' ? 'New Entry Condition' : 'New Exit Condition',
      content: 'Configure your condition...',
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
            <Button variant="success"><Save className="w-4 h-4 mr-2" />Save Strategy</Button>
            <Button variant="hero"><Play className="w-4 h-4 mr-2" />Test Strategy</Button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-6">
            <Card className="gradient-card border-0 shadow-card">
              <CardHeader><CardTitle className="text-lg">Strategy Templates</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {templates.map(template => (
                  <div key={template.id} className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-card ${selectedTemplate === template.id ? 'border-primary bg-primary/5' : 'border-border bg-muted/20 hover:border-primary/50'}`} onClick={() => setSelectedTemplate(template.id)}>
                    <div className="flex items-start gap-3">
                      <template.icon className="w-5 h-5 text-primary mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{template.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">{template.complexity}</Badge>
                          <Badge variant={template.risk === 'Low' ? 'default' : template.risk === 'Medium' ? 'secondary' : 'destructive'} className="text-xs">{template.risk} Risk</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="gradient-card border-0 shadow-card">
              <CardHeader><CardTitle className="text-lg">Indicators</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {indicators.map((indicator, index) => (
                  <div key={index} className="p-2 rounded border border-border bg-muted/20 hover:bg-accent cursor-pointer transition-colors" draggable>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{indicator.name}</span>
                      <Badge variant="outline" className="text-xs">{indicator.type}</Badge>
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
                <CardTitle className="flex items-center justify-between">
                  <Input value={strategyName} onChange={(e) => setStrategyName(e.target.value)} className="text-lg font-semibold bg-transparent border-0 p-0 h-auto focus-visible:ring-0" />
                  <div className="flex gap-2">
                    <Badge variant="outline">Draft</Badge>
                    <Badge variant="secondary">Untested</Badge>
                  </div>
                </CardTitle>
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
                <div className="space-y-2"><Label htmlFor="position-size">Position Size (%)</Label><Input id="position-size" type="number" placeholder="5" /></div>
                <div className="space-y-2"><Label htmlFor="stop-loss">Stop Loss (%)</Label><Input id="stop-loss" type="number" placeholder="2" /></div>
                <div className="space-y-2"><Label htmlFor="take-profit">Take Profit (%)</Label><Input id="take-profit" type="number" placeholder="6" /></div>
                <div className="space-y-2"><Label htmlFor="max-positions">Max Positions</Label><Input id="max-positions" type="number" placeholder="5" /></div>
              </CardContent>
            </Card>

            <Card className="gradient-card border-0 shadow-card">
              <CardHeader><CardTitle className="text-lg">Market Settings</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2"><Label htmlFor="timeframe">Timeframe</Label>
                  <Select>
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
                <div className="space-y-2"><Label htmlFor="market">Market</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select market" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stocks">Stocks</SelectItem>
                      <SelectItem value="forex">Forex</SelectItem>
                      <SelectItem value="crypto">Crypto</SelectItem>
                      <SelectItem value="futures">Futures</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label htmlFor="symbols">Trading Symbols</Label><Input id="symbols" placeholder="AAPL, MSFT, GOOGL..." /></div>
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
