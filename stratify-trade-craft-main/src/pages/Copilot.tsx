import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Bot, User, Lightbulb, TrendingUp, AlertTriangle } from 'lucide-react';

const Copilot: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hello! I'm your Strategy Copilot. I can help you optimize your trading strategies, analyze market conditions, and suggest improvements. What would you like to work on today?",
      timestamp: '10:00 AM',
    },
  ]);

  const suggestions = [
    {
      title: 'Optimize Moving Average',
      description: 'Analyze optimal periods for your moving average crossover strategy',
      icon: TrendingUp,
      action: 'optimize_ma',
    },
    {
      title: 'Risk Assessment',
      description: 'Evaluate and reduce drawdown risk in your current portfolio',
      icon: AlertTriangle,
      action: 'risk_assessment',
    },
    {
      title: 'Market Analysis',
      description: 'Get insights on current market conditions and opportunities',
      icon: Lightbulb,
      action: 'market_analysis',
    },
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newUserMessage = {
      id: messages.length + 1,
      type: 'user' as const,
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const botResponse = {
      id: messages.length + 2,
      type: 'bot' as const,
      content: "I understand your query. Based on your trading history and current market conditions, I recommend adjusting your position sizing and implementing a trailing stop loss. Would you like me to create a detailed plan?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, newUserMessage, botResponse]);
    setMessage('');
  };

  const handleSuggestionClick = (suggestion: typeof suggestions[0]) => {
    const suggestionMessage = {
      id: messages.length + 1,
      type: 'user' as const,
      content: suggestion.description,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const responses: Record<string, string> = {
      optimize_ma: "Based on your historical data, I suggest using a 12-day and 26-day EMA combination instead of your current 10-20 setup. This could improve your win rate by approximately 8.5% while reducing false signals.",
      risk_assessment: "Your current portfolio shows a maximum drawdown of 15.3%. I recommend implementing position sizing based on the Kelly Criterion and adding a portfolio-wide stop loss at 10% to better manage risk.",
      market_analysis: "Current market conditions show high volatility in the tech sector with strong momentum in energy stocks. Consider rotating 30% of your portfolio towards defensive sectors and increasing your cash position to 15%.",
    };

    const botResponse = {
      id: messages.length + 2,
      type: 'bot' as const,
      content: responses[suggestion.action] || "Let me analyze that for you...",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, suggestionMessage, botResponse]);
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Strategy Copilot</h1>
        <p className="text-muted-foreground">
          AI-powered assistant for strategy optimization and market insights
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Strategy Copilot
                <Badge variant="secondary">AI Assistant</Badge>
              </CardTitle>
              <CardDescription>
                Get personalized trading advice and strategy optimization
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              {/* Messages */}
              <div className="flex-1 space-y-4 overflow-y-auto mb-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.type === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {msg.type === 'bot' ? (
                          <Bot className="h-4 w-4" />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                        <span className="text-xs">{msg.timestamp}</span>
                      </div>
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Ask me about strategy optimization, risk management, or market analysis..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Suggestions */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start h-auto p-3 text-left"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="flex items-start gap-3">
                    <suggestion.icon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{suggestion.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {suggestion.description}
                      </p>
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Badge variant="outline">Market Alert</Badge>
                <p className="text-sm">High volatility detected in your watchlist stocks</p>
              </div>
              <div className="space-y-2">
                <Badge variant="outline">Strategy Tip</Badge>
                <p className="text-sm">Consider rebalancing your portfolio allocation</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Copilot;