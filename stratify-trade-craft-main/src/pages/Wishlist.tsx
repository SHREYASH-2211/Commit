import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Plus, Search, TrendingUp, TrendingDown, Star, MoreHorizontal, X } from 'lucide-react';

const Wishlist: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [isAddStrategyOpen, setIsAddStrategyOpen] = useState(false);
  
  const [newStock, setNewStock] = useState({
    symbol: '',
    name: '',
    price: 0,
    change: 0,
    changePercent: 0,
    high52w: 0,
    low52w: 0,
    marketCap: '',
    sector: '',
  });

  const [newStrategy, setNewStrategy] = useState({
    name: '',
    creator: '',
    return: '',
    subscribers: 0,
    rating: 0,
  });

  const [watchlistItems, setWatchlistItems] = useState([
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
  ]);

  const [strategies, setStrategies] = useState([
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
  ]);

  const handleStockInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewStock({
      ...newStock,
      [name]: name === 'symbol' || name === 'name' || name === 'marketCap' || name === 'sector' 
        ? value 
        : parseFloat(value),
    });
  };

  const handleStrategyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewStrategy({
      ...newStrategy,
      [name]: name === 'name' || name === 'creator' || name === 'return' 
        ? value 
        : parseFloat(value),
    });
  };

  const handleAddStock = () => {
    if (!newStock.symbol || !newStock.name) {
      alert('Please fill in at least the symbol and name fields');
      return;
    }

    setWatchlistItems([...watchlistItems, newStock]);
    setNewStock({
      symbol: '',
      name: '',
      price: 0,
      change: 0,
      changePercent: 0,
      high52w: 0,
      low52w: 0,
      marketCap: '',
      sector: '',
    });
    setIsAddStockOpen(false);
  };

  const handleAddStrategy = () => {
    if (!newStrategy.name || !newStrategy.creator) {
      alert('Please fill in at least the name and creator fields');
      return;
    }

    setStrategies([...strategies, newStrategy]);
    setNewStrategy({
      name: '',
      creator: '',
      return: '',
      subscribers: 0,
      rating: 0,
    });
    setIsAddStrategyOpen(false);
  };

  const removeStock = (symbol: string) => {
    setWatchlistItems(watchlistItems.filter(item => item.symbol !== symbol));
  };

  const removeStrategy = (name: string) => {
    setStrategies(strategies.filter(strategy => strategy.name !== name));
  };

  const filteredWatchlist = watchlistItems.filter(item => 
    item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Wishlist</h1>
          <p className="text-muted-foreground">
            Track your favorite stocks and strategies
          </p>
        </div>
        
        <Dialog open={isAddStockOpen} onOpenChange={setIsAddStockOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add to Wishlist
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add to Wishlist</DialogTitle>
              <DialogDescription>
                Choose what you want to add to your wishlist
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4 py-4">
              <Button 
                variant="outline" 
                className="h-24 flex flex-col items-center justify-center"
                onClick={() => {
                  setIsAddStockOpen(false);
                  // This would open the stock dialog, but we'll implement it separately
                }}
              >
                <TrendingUp className="h-8 w-8 mb-2" />
                Add Stock
              </Button>
              
              <Button 
                variant="outline" 
                className="h-24 flex flex-col items-center justify-center"
                onClick={() => {
                  setIsAddStockOpen(false);
                  // This would open the strategy dialog, but we'll implement it separately
                }}
              >
                <Star className="h-8 w-8 mb-2" />
                Add Strategy
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Stock Watchlist */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Stock Watchlist
              </CardTitle>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Stock
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add Stock to Watchlist</DialogTitle>
                    <DialogDescription>
                      Add a stock to your watchlist. Only symbol and name are required.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="symbol" className="text-right">
                        Symbol*
                      </Label>
                      <Input
                        id="symbol"
                        name="symbol"
                        value={newStock.symbol}
                        onChange={handleStockInputChange}
                        className="col-span-3"
                        placeholder="e.g., AAPL"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name*
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={newStock.name}
                        onChange={handleStockInputChange}
                        className="col-span-3"
                        placeholder="e.g., Apple Inc."
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="price" className="text-right">
                        Price
                      </Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        value={newStock.price}
                        onChange={handleStockInputChange}
                        className="col-span-3"
                        placeholder="e.g., 175.25"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="sector" className="text-right">
                        Sector
                      </Label>
                      <Input
                        id="sector"
                        name="sector"
                        value={newStock.sector}
                        onChange={handleStockInputChange}
                        className="col-span-3"
                        placeholder="e.g., Technology"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleAddStock}>Add Stock</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
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
              {filteredWatchlist.map((stock, index) => (
                <div key={index} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium">{stock.symbol}</p>
                        <p className="text-sm text-muted-foreground">{stock.name}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-medium">${stock.price.toFixed(2)}</p>
                      <Badge variant={stock.change >= 0 ? 'default' : 'destructive'}>
                        {stock.change >= 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {stock.change >= 0 ? '+' : ''}${Math.abs(stock.change).toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                    <div>52W High: ${stock.high52w.toFixed(2)}</div>
                    <div>52W Low: ${stock.low52w.toFixed(2)}</div>
                    <div>Market Cap: {stock.marketCap}</div>
                  </div>
                  
                  <div className="mt-2 flex items-center justify-between">
                    <Badge variant="outline">{stock.sector}</Badge>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => removeStock(stock.symbol)}>
                        <X className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredWatchlist.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm ? 'No stocks match your search' : 'No stocks in your watchlist'}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Strategy Wishlist */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Strategy Wishlist
              </CardTitle>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Strategy
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add Strategy to Wishlist</DialogTitle>
                    <DialogDescription>
                      Add a trading strategy to your wishlist
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="strategy-name" className="text-right">
                        Name*
                      </Label>
                      <Input
                        id="strategy-name"
                        name="name"
                        value={newStrategy.name}
                        onChange={handleStrategyInputChange}
                        className="col-span-3"
                        placeholder="e.g., RSI Mean Reversion"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="creator" className="text-right">
                        Creator*
                      </Label>
                      <Input
                        id="creator"
                        name="creator"
                        value={newStrategy.creator}
                        onChange={handleStrategyInputChange}
                        className="col-span-3"
                        placeholder="e.g., John Doe"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="return" className="text-right">
                        Return
                      </Label>
                      <Input
                        id="return"
                        name="return"
                        value={newStrategy.return}
                        onChange={handleStrategyInputChange}
                        className="col-span-3"
                        placeholder="e.g., +15.6%"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="rating" className="text-right">
                        Rating
                      </Label>
                      <Input
                        id="rating"
                        name="rating"
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={newStrategy.rating}
                        onChange={handleStrategyInputChange}
                        className="col-span-3"
                        placeholder="e.g., 4.8"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleAddStrategy}>Add Strategy</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
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
                      <Button variant="ghost" size="sm" onClick={() => removeStrategy(strategy.name)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {strategies.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No strategies in your wishlist
                </div>
              )}
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
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Stock to Watchlist
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add Stock to Watchlist</DialogTitle>
                </DialogHeader>
                {/* Stock form would go here */}
              </DialogContent>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="justify-start">
                  <Star className="h-4 w-4 mr-2" />
                  Browse Popular Strategies
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Popular Strategies</DialogTitle>
                </DialogHeader>
                {/* Strategy browser would go here */}
              </DialogContent>
            </Dialog>
            
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

// Add the missing Label component
const Label: React.FC<{ htmlFor: string; className?: string; children: React.ReactNode }> = ({ 
  htmlFor, 
  className, 
  children 
}) => {
  return (
    <label htmlFor={htmlFor} className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>
      {children}
    </label>
  );
};

export default Wishlist;