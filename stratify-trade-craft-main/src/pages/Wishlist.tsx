import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Heart, Plus, Search, TrendingUp, TrendingDown, Star, MoreHorizontal } from 'lucide-react';

const Wishlist: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const watchlistItems = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 175.25,
      change: +2.34,
      changePercent: +1.35,
      high52w: 198.23,
      low52w: 164.08,
      marketCap: '2.8T',
      sector: 'Technology',
    },
    {
      symbol: 'TSLA',
      name: 'Tesla, Inc.',
      price: 242.68,
      change: -5.12,
      changePercent: -2.07,
      high52w: 299.29,
      low52w: 138.80,
      marketCap: '771B',
      sector: 'Automotive',
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      price: 378.85,
      change: +1.87,
      changePercent: +0.50,
      high52w: 384.30,
      low52w: 309.45,
      marketCap: '2.8T',
      sector: 'Technology',
    },
  ];

  const strategies = [
    {
      name: 'RSI Mean Reversion',
      creator: 'John Doe',
      return: '+15.6%',
      subscribers: 1234,
      rating: 4.8,
    },
    {
      name: 'Momentum Breakout',
      creator: 'Jane Smith',
      return: '+22.3%',
      subscribers: 867,
      rating: 4.6,
    },
    {
      name: 'Pairs Trading NIFTY',
      creator: 'Alex Kumar',
      return: '+8.9%',
      subscribers: 543,
      rating: 4.2,
    },
  ];

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Wishlist</h1>
          <p className="text-muted-foreground">
            Track your favorite stocks and strategies
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add to Wishlist
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Stock Watchlist */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Stock Watchlist
            </CardTitle>
            <CardDescription>
              Keep track of stocks you're interested in
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stocks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="space-y-3">
              {watchlistItems.map((stock, index) => (
                <div key={index} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium">{stock.symbol}</p>
                        <p className="text-sm text-muted-foreground">{stock.name}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-medium">${stock.price}</p>
                      <Badge variant={stock.change >= 0 ? 'default' : 'destructive'}>
                        {stock.change >= 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                    <div>52W High: ${stock.high52w}</div>
                    <div>52W Low: ${stock.low52w}</div>
                    <div>Market Cap: {stock.marketCap}</div>
                  </div>
                  
                  <div className="mt-2 flex items-center justify-between">
                    <Badge variant="outline">{stock.sector}</Badge>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Strategy Wishlist */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Strategy Wishlist
            </CardTitle>
            <CardDescription>
              Strategies you want to follow or implement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {strategies.map((strategy, index) => (
                <div key={index} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium">{strategy.name}</p>
                      <p className="text-sm text-muted-foreground">by {strategy.creator}</p>
                    </div>
                    <Badge variant="outline" className="text-success">
                      {strategy.return}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{strategy.rating}</span>
                      </div>
                      <span className="text-muted-foreground">
                        {strategy.subscribers.toLocaleString()} followers
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Follow</Button>
                      <Button variant="default" size="sm">Copy</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full">
              Browse More Strategies
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" className="justify-start">
              <Plus className="h-4 w-4 mr-2" />
              Add Stock to Watchlist
            </Button>
            <Button variant="outline" className="justify-start">
              <Star className="h-4 w-4 mr-2" />
              Browse Popular Strategies
            </Button>
            <Button variant="outline" className="justify-start">
              <TrendingUp className="h-4 w-4 mr-2" />
              Market Screener
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Wishlist;