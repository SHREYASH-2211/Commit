import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Lightbulb, TrendingUp, AlertTriangle } from 'lucide-react';

const StratifyAI: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot' as const,
      content: "Hello! I'm Stratify Copilot. I can help you optimize trading strategies, analyze market conditions, and suggest improvements. What would you like to work on today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const chatRef = useRef<HTMLDivElement>(null);

  const sendMessageToAPI = async (text: string) => {
    if (!text.trim()) return;

    const newUserMessage = {
      id: messages.length + 1,
      type: 'user' as const,
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, newUserMessage]);
    setMessage('');

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text }),
      });
      const data = await res.json();
      const botMessage = {
        id: messages.length + 2,
        type: 'bot' as const,
        content: data?.text || "I'm having trouble generating a response.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: messages.length + 2,
        type: 'bot' as const,
        content: "Sorry, I'm having trouble connecting to the server. Please try again later.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    }
  };

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

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

  const handleSuggestionClick = (suggestion: typeof suggestions[0]) => {
    sendMessageToAPI(suggestion.description);
  };

  return (
    <div className="stratify-container">
      <style>{`
        .stratify-container { padding: 2rem; font-family: sans-serif; }
        .chat-card { height: 600px; display: flex; flex-direction: column; }
        .messages { flex: 1; overflow-y: auto; margin-bottom: 1rem; display: flex; flex-direction: column; gap: 0.5rem; }
        .message { max-width: 75%; padding: 0.5rem 1rem; border-radius: 0.5rem; font-size: 0.875rem; }
        .bot-message { background-color: #f3f3f3; color: #333; align-self: flex-start; }
        .user-message { background-color: #3b82f6; color: #fff; align-self: flex-end; }
        .chat-input { display: flex; gap: 0.5rem; margin-top: auto; }
        .suggestions { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1rem; }
      `}</style>

      <h1 className="text-3xl font-bold mb-4">Stratify AI Copilot</h1>

      <div style={{ display: 'flex', gap: '2rem' }}>
        <div style={{ flex: 3 }}>
          <Card className="chat-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Stratify Copilot
                <Badge variant="secondary">AI Assistant</Badge>
              </CardTitle>
              <CardDescription>
                Get personalized trading advice and strategy optimization
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col">
              <div className="messages" ref={chatRef}>
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`message ${msg.type === 'user' ? 'user-message' : 'bot-message'}`}
                  >
                    <div style={{ fontSize: '0.7rem', marginBottom: '0.25rem' }}>
                      {msg.timestamp}
                    </div>
                    {msg.content}
                  </div>
                ))}
              </div>

              <div className="chat-input">
                <Input
                  placeholder="Ask about strategy, risk, or market insights..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && sendMessageToAPI(message)}
                />
                <Button onClick={() => sendMessageToAPI(message)}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div style={{ flex: 1 }}>
          <div className="suggestions">
            {suggestions.map((s, i) => (
              <Button
                key={i}
                variant="outline"
                onClick={() => handleSuggestionClick(s)}
              >
                <div className="flex items-center gap-2">
                  <s.icon className="h-4 w-4" />
                  <div>
                    <p className="font-medium text-sm">{s.title}</p>
                    <p className="text-xs text-muted-foreground">{s.description}</p>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StratifyAI;