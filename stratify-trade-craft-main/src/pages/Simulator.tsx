import React, { useState } from 'react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  ChevronDown, 
  ChevronRight, 
  BarChart3, 
  Target, 
  Play, 
  DoorOpen, 
  Shield, 
  Loader2,
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Percent, 
  Activity,
  Download,
  Copy,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Minus,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BacktestFormData {
  ticker: string;
  startDate: string;
  endDate: string;
  startingCapital: number;
  strategyType: 'pattern' | 'indicator' | 'mixed';
  pattern: string;
  indicator: string;
  confidenceThreshold: number;
  entrySide: 'long' | 'short' | 'both';
  holdingPeriod: number;
  stopLoss: number;
  takeProfit: number;
  trailingStop: boolean;
  positionSizing: 'fixed' | 'percentage' | 'kelly';
  positionSize: number;
  maxOpenTrades: number;
  maxDrawdown: number;
}

interface BacktestResult {
  cumulativeReturn: number;
  annualizedSharpe: number;
  maxDrawdown: number;
  winRate: number;
  totalTrades: number;
  totalPnL: number;
  equityCurve: { date: string; value: number }[];
  trades: {
    entryDate: string;
    entryPrice: number;
    pattern: string;
    confidence: number;
    exitDate: string;
    exitPrice: number;
    pnl: number;
    exitReason: string;
  }[];
}

// Mock API function - replace with actual API call
const runBacktest = async (formData: BacktestFormData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock successful response
  return {
    cumulativeReturn: 15.4,
    annualizedSharpe: 1.23,
    maxDrawdown: 8.7,
    winRate: 62.5,
    totalTrades: 48,
    totalPnL: 15400,
    equityCurve: Array.from({ length: 252 }, (_, i) => ({
      date: new Date(2022, 0, i + 1).toISOString().split('T')[0],
      value: 100000 + (Math.random() - 0.4) * 5000 * (i / 10)
    })),
    trades: Array.from({ length: 48 }, (_, i) => ({
      entryDate: new Date(2022, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      entryPrice: 150 + Math.random() * 50,
      pattern: ['Doji', 'Hammer', 'Shooting Star'][Math.floor(Math.random() * 3)],
      confidence: 0.6 + Math.random() * 0.4,
      exitDate: new Date(2022, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      exitPrice: 150 + Math.random() * 50,
      pnl: (Math.random() - 0.4) * 1000,
      exitReason: ['Time limit', 'Stop loss', 'Take profit'][Math.floor(Math.random() * 3)]
    }))
  };
};

const CollapsiblePanel = ({ 
  title, 
  icon: Icon, 
  isOpen, 
  onToggle, 
  children 
}: { 
  title: string; 
  icon: any; 
  isOpen: boolean; 
  onToggle: () => void; 
  children: React.ReactNode;
}) => (
  <Card className="border border-border/50 shadow-soft">
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center gap-3">
              <Icon className="h-5 w-5 text-primary" />
              <span>{title}</span>
            </div>
            {isOpen ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </CardTitle>
        </CardHeader>
      </CollapsibleTrigger>
      <CollapsibleContent className="animate-accordion-down">
        <CardContent className="pt-0">
          {children}
        </CardContent>
      </CollapsibleContent>
    </Collapsible>
  </Card>
);

const MetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  format = 'number' 
}: { 
  title: string; 
  value: number; 
  icon: any; 
  trend?: 'up' | 'down' | 'neutral';
  format?: 'number' | 'percentage' | 'currency';
}) => {
  const formatValue = (val: number) => {
    switch (format) {
      case 'percentage':
        return `${val.toFixed(2)}%`;
      case 'currency':
        return `$${val.toLocaleString()}`;
      default:
        return val.toLocaleString();
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="h-4 w-4 text-profit" />;
      case 'down':
        return <ArrowDown className="h-4 w-4 text-loss" />;
      default:
        return <Minus className="h-4 w-4 text-neutral" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-profit';
      case 'down':
        return 'text-loss';
      default:
        return 'text-foreground';
    }
  };

  return (
    <Card className="border border-border/50 shadow-soft hover:shadow-medium transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{title}</p>
              <p className={cn("text-2xl font-bold", getTrendColor())}>
                {formatValue(value)}
              </p>
            </div>
          </div>
          {trend && getTrendIcon()}
        </div>
      </CardContent>
    </Card>
  );
};

function BacktestForm({ onSubmit, isLoading }: { onSubmit: (data: BacktestFormData) => void; isLoading: boolean; }) {
  const [formData, setFormData] = useState<BacktestFormData>({
    ticker: 'AAPL',
    startDate: '2022-01-01',
    endDate: '2023-01-01',
    startingCapital: 100000,
    strategyType: 'pattern',
    pattern: 'doji',
    indicator: 'rsi',
    confidenceThreshold: 0.8,
    entrySide: 'long',
    holdingPeriod: 3,
    stopLoss: 0,
    takeProfit: 0,
    trailingStop: false,
    positionSizing: 'percentage',
    positionSize: 5,
    maxOpenTrades: 5,
    maxDrawdown: 20,
  });

  const [openPanels, setOpenPanels] = useState<Record<string, boolean>>({
    data: true,
    strategy: false,
    entry: false,
    exit: false,
    risk: false,
  });

  const togglePanel = (panel: string) => {
    setOpenPanels(prev => ({ ...prev, [panel]: !prev[panel] }));
  };

  const updateFormData = (field: keyof BacktestFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isFormValid = () => {
    return formData.ticker && 
           formData.startDate && 
           formData.endDate && 
           formData.startingCapital >= 1000;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Data Configuration Panel */}
      <CollapsiblePanel
        title="Data Configuration"
        icon={BarChart3}
        isOpen={openPanels.data}
        onToggle={() => togglePanel('data')}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="ticker">Stock Ticker</Label>
            <Input
              id="ticker"
              value={formData.ticker}
              onChange={(e) => updateFormData('ticker', e.target.value.toUpperCase())}
              placeholder="AAPL"
              className="font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startingCapital">Starting Capital ($)</Label>
            <Input
              id="startingCapital"
              type="number"
              min="1000"
              value={formData.startingCapital}
              onChange={(e) => updateFormData('startingCapital', Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => updateFormData('startDate', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => updateFormData('endDate', e.target.value)}
            />
          </div>
        </div>
      </CollapsiblePanel>

      {/* Strategy Selection Panel */}
      <CollapsiblePanel
        title="Strategy Selection"
        icon={Target}
        isOpen={openPanels.strategy}
        onToggle={() => togglePanel('strategy')}
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <Label>Strategy Type</Label>
            <RadioGroup
              value={formData.strategyType}
              onValueChange={(value) => updateFormData('strategyType', value)}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pattern" id="pattern-based" />
                <Label htmlFor="pattern-based">Pattern-based</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="indicator" id="indicator-based" />
                <Label htmlFor="indicator-based">Indicator-based</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mixed" id="mixed" />
                <Label htmlFor="mixed">Mixed</Label>
              </div>
            </RadioGroup>
          </div>

          {(formData.strategyType === 'pattern' || formData.strategyType === 'mixed') && (
            <div className="space-y-2">
              <Label>Pattern</Label>
              <Select value={formData.pattern} onValueChange={(value) => updateFormData('pattern', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="doji">Doji</SelectItem>
                  <SelectItem value="hammer">Hammer</SelectItem>
                  <SelectItem value="shooting-star">Shooting Star</SelectItem>
                  <SelectItem value="engulfing">Engulfing</SelectItem>
                  <SelectItem value="morning-star">Morning Star</SelectItem>
                  <SelectItem value="evening-star">Evening Star</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {(formData.strategyType === 'indicator' || formData.strategyType === 'mixed') && (
            <div className="space-y-2">
              <Label>Indicator</Label>
              <Select value={formData.indicator} onValueChange={(value) => updateFormData('indicator', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rsi">RSI</SelectItem>
                  <SelectItem value="macd">MACD</SelectItem>
                  <SelectItem value="sma">SMA</SelectItem>
                  <SelectItem value="bollinger">Bollinger Bands</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CollapsiblePanel>

      {/* Entry Rules Panel */}
      <CollapsiblePanel
        title="Entry Rules"
        icon={Play}
        isOpen={openPanels.entry}
        onToggle={() => togglePanel('entry')}
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <Label>Confidence Threshold: {formData.confidenceThreshold.toFixed(2)}</Label>
            <Slider
              value={[formData.confidenceThreshold]}
              onValueChange={(value) => updateFormData('confidenceThreshold', value[0])}
              max={1}
              min={0}
              step={0.05}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <Label>Entry Side</Label>
            <RadioGroup
              value={formData.entrySide}
              onValueChange={(value) => updateFormData('entrySide', value)}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="long" id="long" />
                <Label htmlFor="long">Long</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="short" id="short" />
                <Label htmlFor="short">Short</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="both" id="both" />
                <Label htmlFor="both">Both</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </CollapsiblePanel>

      {/* Exit Rules Panel */}
      <CollapsiblePanel
        title="Exit Rules"
        icon={DoorOpen}
        isOpen={openPanels.exit}
        onToggle={() => togglePanel('exit')}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="holdingPeriod">Holding Period (days)</Label>
            <Input
              id="holdingPeriod"
              type="number"
              min="1"
              max="60"
              value={formData.holdingPeriod}
              onChange={(e) => updateFormData('holdingPeriod', Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stopLoss">Stop-loss (%)</Label>
            <Input
              id="stopLoss"
              type="number"
              min="0"
              max="50"
              value={formData.stopLoss}
              onChange={(e) => updateFormData('stopLoss', Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="takeProfit">Take-profit (%)</Label>
            <Input
              id="takeProfit"
              type="number"
              min="0"
              max="100"
              value={formData.takeProfit}
              onChange={(e) => updateFormData('takeProfit', Number(e.target.value))}
            />
          </div>
          <div className="flex items-center space-x-2 pt-6">
            <Checkbox
              id="trailingStop"
              checked={formData.trailingStop}
              onCheckedChange={(checked) => updateFormData('trailingStop', checked)}
            />
            <Label htmlFor="trailingStop">Trailing Stop</Label>
          </div>
        </div>
      </CollapsiblePanel>

      {/* Risk Management Panel */}
      <CollapsiblePanel
        title="Risk Management"
        icon={Shield}
        isOpen={openPanels.risk}
        onToggle={() => togglePanel('risk')}
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <Label>Position Sizing</Label>
            <RadioGroup
              value={formData.positionSizing}
              onValueChange={(value) => updateFormData('positionSizing', value)}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fixed" id="fixed" />
                <Label htmlFor="fixed">Fixed dollar amount</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="percentage" id="percentage" />
                <Label htmlFor="percentage">Percentage of capital</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="kelly" id="kelly" />
                <Label htmlFor="kelly">Kelly fraction</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="positionSize">
                Position Size {formData.positionSizing === 'fixed' ? '($)' : '(%)'}
              </Label>
              <Input
                id="positionSize"
                type="number"
                min="0.1"
                max="100"
                step="0.1"
                value={formData.positionSize}
                onChange={(e) => updateFormData('positionSize', Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxOpenTrades">Max Open Trades</Label>
              <Input
                id="maxOpenTrades"
                type="number"
                min="1"
                max="20"
                value={formData.maxOpenTrades}
                onChange={(e) => updateFormData('maxOpenTrades', Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxDrawdown">Max Drawdown (%)</Label>
              <Input
                id="maxDrawdown"
                type="number"
                min="0"
                max="50"
                value={formData.maxDrawdown}
                onChange={(e) => updateFormData('maxDrawdown', Number(e.target.value))}
              />
            </div>
          </div>
        </div>
      </CollapsiblePanel>

    <div className="flex justify-center pt-6">
  <Button
    type="submit"
    size="lg"
    disabled={!isFormValid() || isLoading}
    className={cn(
      "min-w-[200px] h-12 text-lg font-semibold transition-all duration-300",
      "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-medium hover:scale-105",
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    )}
  >
    {isLoading ? (
      <>
        <Loader2 className="mr-2 h-5 w-5 animate-loading-spin" />
        Running Backtest...
      </>
    ) : (
      <>
        <Play className="mr-2 h-5 w-5" />
        Run Backtest
      </>
    )}
  </Button>
</div>
    </form>
  );
}

function BacktestResults({ results, onReset }: { results: BacktestResult; onReset: () => void; }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string>('entryDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const tradesPerPage = 10;

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedTrades = [...results.trades].sort((a, b) => {
    const aVal = a[sortField as keyof typeof a];
    const bVal = b[sortField as keyof typeof b];
    
    if (sortDirection === 'asc') {
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    } else {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    }
  });

  const paginatedTrades = sortedTrades.slice(
    (currentPage - 1) * tradesPerPage,
    currentPage * tradesPerPage
  );

  const totalPages = Math.ceil(results.trades.length / tradesPerPage);

  const exportToCsv = () => {
    const csvContent = [
      ['Entry Date', 'Entry Price', 'Pattern', 'Confidence', 'Exit Date', 'Exit Price', 'P&L', 'Exit Reason'],
      ...results.trades.map(trade => [
        trade.entryDate,
        trade.entryPrice.toString(),
        trade.pattern,
        trade.confidence.toString(),
        trade.exitDate,
        trade.exitPrice.toString(),
        trade.pnl.toString(),
        trade.exitReason
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backtest-results.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    const text = results.trades.map(trade => 
      `${trade.entryDate} | ${trade.pattern} | P&L: $${trade.pnl.toFixed(2)}`
    ).join('\n');
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Success Message */}
      <Card className="border-success/20 bg-success/5 shadow-soft">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-success/20">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <p className="text-lg font-semibold text-success animate-pulse-success">
              Backtest completed successfully!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Cumulative Return"
          value={results.cumulativeReturn}
          icon={Percent}
          format="percentage"
          trend={results.cumulativeReturn > 0 ? 'up' : 'down'}
        />
        <MetricCard
          title="Annualized Sharpe Ratio"
          value={results.annualizedSharpe}
          icon={Activity}
          trend={results.annualizedSharpe > 1 ? 'up' : results.annualizedSharpe > 0 ? 'neutral' : 'down'}
        />
        <MetricCard
          title="Max Drawdown"
          value={results.maxDrawdown}
          icon={TrendingDown}
          format="percentage"
          trend="down"
        />
        <MetricCard
          title="Win Rate"
          value={results.winRate}
          icon={Target}
          format="percentage"
          trend={results.winRate > 50 ? 'up' : 'down'}
        />
        <MetricCard
          title="Number of Trades"
          value={results.totalTrades}
          icon={Activity}
          trend="neutral"
        />
        <MetricCard
          title="Total P&L"
          value={results.totalPnL}
          icon={DollarSign}
          format="currency"
          trend={results.totalPnL > 0 ? 'up' : 'down'}
        />
      </div>

      {/* Equity Curve Chart */}
      <Card className="border border-border/50 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Equity Curve
          </CardTitle>
          <CardDescription>Portfolio value over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={results.equityCurve}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs"
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis 
                  className="text-xs"
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Portfolio Value']}
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--chart-primary))" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: 'hsl(var(--chart-primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Trade Log Table */}
      <Card className="border border-border/50 shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Trade Log
              </CardTitle>
              <CardDescription>
                Showing {(currentPage - 1) * tradesPerPage + 1}-{Math.min(currentPage * tradesPerPage, results.trades.length)} of {results.trades.length} trades
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={exportToCsv}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => handleSort('entryDate')}
                  >
                    Entry Date {sortField === 'entryDate' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => handleSort('entryPrice')}
                  >
                    Entry Price {sortField === 'entryPrice' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead>Pattern</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => handleSort('confidence')}
                  >
                    Confidence {sortField === 'confidence' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => handleSort('exitDate')}
                  >
                    Exit Date {sortField === 'exitDate' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => handleSort('exitPrice')}
                  >
                    Exit Price {sortField === 'exitPrice' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => handleSort('pnl')}
                  >
                    P&L {sortField === 'pnl' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead>Exit Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTrades.map((trade, index) => (
                  <TableRow key={index} className="hover:bg-accent/30 transition-colors">
                    <TableCell className="font-mono text-sm">
                      {new Date(trade.entryDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-mono">
                      ${trade.entryPrice.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-medium">
                        {trade.pattern}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={trade.confidence > 0.7 ? "default" : "secondary"}
                        className="font-mono"
                      >
                        {(trade.confidence * 100).toFixed(0)}%
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {new Date(trade.exitDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-mono">
                      ${trade.exitPrice.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <span className={cn(
                        "font-mono font-semibold",
                        trade.pnl > 0 ? "text-profit" : trade.pnl < 0 ? "text-loss" : "text-neutral"
                      )}>
                        ${trade.pnl.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {trade.exitReason}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reset Button */}
      <div className="flex justify-center pt-6">
        <Button 
          variant="outline" 
          size="lg" 
          onClick={onReset}
          className="min-w-[200px] h-12 text-lg font-semibold transition-all duration-300 hover:shadow-medium hover:scale-105"
        >
          <RefreshCw className="mr-2 h-5 w-5" />
          Reset Form
        </Button>
      </div>
    </div>
  );
}

export default function BacktestingApp() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<BacktestResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (formData: BacktestFormData) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await runBacktest(formData);
      setResults(response);
    } catch (err) {
      setError('Failed to run backtest. Please check your connection and try again.');
      console.error('Backtest error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Stock Pattern Backtesting Assistant
              </h1>
              <p className="text-lg text-muted-foreground">
                Detect patterns and test trading strategies with confidence
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Error Banner */}
        {error && (
          <Alert variant="destructive" className="mb-8 animate-slide-in">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        {!results ? (
          <div className="max-w-4xl mx-auto">
            <BacktestForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <BacktestResults results={results} onReset={handleReset} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>Built with React, TypeScript, and Tailwind CSS</p>
          </div>
        </div>
      </footer>
    </div>
  );
}