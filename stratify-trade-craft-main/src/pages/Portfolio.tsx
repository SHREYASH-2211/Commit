import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Plus, MoreHorizontal } from 'lucide-react';

const Portfolio: React.FC = () => {
  const holdings = [
    {
      symbol: 'RELIANCE',
      name: 'Reliance Industries Ltd',
      quantity: 50,
      avgPrice: 2450.25,
      currentPrice: 2567.80,
      change: +4.78,
      changePercent: +4.8,
    },
    {
      symbol: 'TCS',
      name: 'Tata Consultancy Services',
      quantity: 25,
      avgPrice: 3245.60,
      currentPrice: 3198.45,
      change: -47.15,
      changePercent: -1.45,
    },
    {
      symbol: 'INFY',
      name: 'Infosys Limited',
      quantity: 75,
      avgPrice: 1456.30,
      currentPrice: 1523.75,
      change: +67.45,
      changePercent: +4.63,
    },
  ];

  const totalValue = holdings.reduce((sum, holding) => sum + (holding.currentPrice * holding.quantity), 0);
  const totalInvestment = holdings.reduce((sum, holding) => sum + (holding.avgPrice * holding.quantity), 0);
  const totalGainLoss = totalValue - totalInvestment;

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Portfolio</h1>
          <p className="text-muted-foreground">
            Manage your investment portfolio
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Stock
        </Button>
      </div>

      {/* Portfolio Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalValue.toLocaleString('en-IN')}</div>
            <p className="text-xs text-muted-foreground">Current market value</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investment</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalInvestment.toLocaleString('en-IN')}</div>
            <p className="text-xs text-muted-foreground">Total invested amount</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">P&L</CardTitle>
            {totalGainLoss >= 0 ? (
              <TrendingUp className="h-4 w-4 text-success" />
            ) : (
              <TrendingDown className="h-4 w-4 text-destructive" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-success' : 'text-destructive'}`}>
              ₹{Math.abs(totalGainLoss).toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-muted-foreground">
              {((totalGainLoss / totalInvestment) * 100).toFixed(2)}% return
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Holdings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{holdings.length}</div>
            <p className="text-xs text-muted-foreground">Active positions</p>
          </CardContent>
        </Card>
      </div>

      {/* Holdings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Holdings</CardTitle>
          <CardDescription>Your current stock positions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {holdings.map((holding, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-medium">{holding.symbol}</p>
                    <p className="text-sm text-muted-foreground">{holding.name}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Qty: {holding.quantity}</p>
                  <p className="text-sm">Avg: ₹{holding.avgPrice.toFixed(2)}</p>
                </div>
                
                <div className="text-right">
                  <p className="font-medium">₹{holding.currentPrice.toFixed(2)}</p>
                  <Badge variant={holding.change >= 0 ? 'default' : 'destructive'}>
                    {holding.change >= 0 ? '+' : ''}₹{holding.change.toFixed(2)} ({holding.changePercent.toFixed(2)}%)
                  </Badge>
                </div>
                
                <div className="text-right">
                  <p className="font-medium">₹{(holding.currentPrice * holding.quantity).toLocaleString('en-IN')}</p>
                  <p className="text-sm text-muted-foreground">Market Value</p>
                </div>
                
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Portfolio;