import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Settings, DollarSign, Shield, AlertTriangle, Percent } from 'lucide-react';

const FundManagement: React.FC = () => {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Fund Management</h1>
        <p className="text-muted-foreground">
          Configure capital allocation and risk management settings
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Capital Allocation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Capital Allocation
            </CardTitle>
            <CardDescription>
              Set how much capital to allocate to different strategies
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="total-capital">Total Available Capital</Label>
              <Input id="total-capital" placeholder="₹1,00,000" />
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Algorithmic Strategies</Label>
                  <span className="text-sm text-muted-foreground">60%</span>
                </div>
                <Slider defaultValue={[60]} max={100} step={5} />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Manual Trading</Label>
                  <span className="text-sm text-muted-foreground">25%</span>
                </div>
                <Slider defaultValue={[25]} max={100} step={5} />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Cash Reserve</Label>
                  <span className="text-sm text-muted-foreground">15%</span>
                </div>
                <Slider defaultValue={[15]} max={100} step={5} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Risk Management
            </CardTitle>
            <CardDescription>
              Configure risk controls and safety limits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="max-loss">Maximum Daily Loss (%)</Label>
              <Input id="max-loss" placeholder="5" type="number" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="position-size">Maximum Position Size (%)</Label>
              <Input id="position-size" placeholder="10" type="number" />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto Stop Trading on Loss Limit</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically pause trading when loss limit is hit
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Portfolio Hedge</Label>
                <p className="text-sm text-muted-foreground">
                  Automatic hedging during high volatility
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Strategy Limits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Strategy Limits
            </CardTitle>
            <CardDescription>
              Per-strategy capital and risk limits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {['Moving Average Crossover', 'Mean Reversion', 'Momentum Strategy'].map((strategy, index) => (
              <div key={index} className="p-3 border border-border rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">{strategy}</h4>
                  <Switch defaultChecked={index < 2} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Max Capital</Label>
                    <Input placeholder="₹20,000" className="h-8" />
                  </div>
                  <div>
                    <Label className="text-xs">Max Loss (%)</Label>
                    <Input placeholder="3" type="number" className="h-8" />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Percent className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
            <CardDescription>
              Current fund performance overview
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-success">+12.5%</div>
                <div className="text-sm text-muted-foreground">Total Return</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">1.85</div>
                <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-destructive">-5.2%</div>
                <div className="text-sm text-muted-foreground">Max Drawdown</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">78.3%</div>
                <div className="text-sm text-muted-foreground">Win Rate</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <p className="text-sm text-warning-foreground">
                Portfolio allocation exceeds recommended limits
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <Button>Save Configuration</Button>
        <Button variant="outline">Reset to Defaults</Button>
      </div>
    </div>
  );
};

export default FundManagement;