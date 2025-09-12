import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  TrendingUp,
  Star,
  Copy,
  Eye,
  Heart,
  MessageCircle,
  Search,
  Filter,
  Award,
  BarChart3,
  DollarSign,
} from 'lucide-react';

const SocialTrading: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const topTraders = [
    {
      id: 1,
      name: 'Alex Chen',
      username: '@alexchen',
      avatar: '',
      followers: 2847,
      totalReturn: '+127.3%',
      winRate: '78.2%',
      strategies: 12,
      verified: true,
      performance: [
        { month: 'Jan', return: 8.5 },
        { month: 'Feb', return: 12.1 },
        { month: 'Mar', return: -2.3 },
        { month: 'Apr', return: 15.7 },
        { month: 'May', return: 9.2 },
        { month: 'Jun', return: 11.8 },
      ]
    },
    {
      id: 2,
      name: 'Sarah Kim',
      username: '@sarahk',
      avatar: '',
      followers: 1923,
      totalReturn: '+89.7%',
      winRate: '71.4%',
      strategies: 8,
      verified: false,
      performance: [
        { month: 'Jan', return: 6.2 },
        { month: 'Feb', return: 9.8 },
        { month: 'Mar', return: 4.1 },
        { month: 'Apr', return: 13.2 },
        { month: 'May', return: 7.9 },
        { month: 'Jun', return: 8.5 },
      ]
    },
    {
      id: 3,
      name: 'Mike Johnson',
      username: '@mikej',
      avatar: '',
      followers: 3156,
      totalReturn: '+156.8%',
      winRate: '82.1%',
      strategies: 15,
      verified: true,
      performance: [
        { month: 'Jan', return: 11.3 },
        { month: 'Feb', return: 14.7 },
        { month: 'Mar', return: 8.9 },
        { month: 'Apr', return: 18.2 },
        { month: 'May', return: 12.4 },
        { month: 'Jun', return: 15.1 },
      ]
    }
  ];

  const popularStrategies = [
    {
      id: 1,
      name: 'AI Momentum Scanner',
      author: 'Alex Chen',
      description: 'Advanced momentum strategy using machine learning to identify breakout patterns',
      followers: 524,
      return: '+45.2%',
      risk: 'Medium',
      likes: 89,
      copies: 156,
      category: 'Momentum'
    },
    {
      id: 2,
      name: 'Low Risk DCA Bot',
      author: 'Sarah Kim',
      description: 'Dollar-cost averaging with smart entry points during market dips',
      followers: 312,
      return: '+22.8%',
      risk: 'Low',
      likes: 67,
      copies: 203,
      category: 'DCA'
    },
    {
      id: 3,
      name: 'Options Wheel Strategy',
      author: 'Mike Johnson',
      description: 'Generate consistent income through covered calls and cash-secured puts',
      followers: 718,
      return: '+38.7%',
      risk: 'Medium',
      likes: 134,
      copies: 89,
      category: 'Options'
    }
  ];

  const socialPosts = [
    {
      id: 1,
      author: 'Alex Chen',
      username: '@alexchen',
      time: '2h',
      content: 'Just closed my TSLA position for a 15% gain! The momentum strategy is working beautifully in this market. 📈',
      likes: 47,
      comments: 12,
      verified: true
    },
    {
      id: 2,
      author: 'Sarah Kim',
      username: '@sarahk',
      time: '4h',
      content: 'Market volatility is creating great DCA opportunities. My bot just triggered 3 new positions in tech stocks.',
      likes: 23,
      comments: 8,
      verified: false
    },
    {
      id: 3,
      author: 'Mike Johnson',
      username: '@mikej',
      time: '6h',
      content: 'Weekly options income: $2,847 from covered calls. The wheel strategy continues to deliver consistent returns! 💰',
      likes: 78,
      comments: 15,
      verified: true
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
              <Users className="w-8 h-8" />
              Social Trading
            </h1>
            <p className="text-muted-foreground">Follow top traders and discover profitable strategies</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search strategies or traders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </motion.div>

        <Tabs defaultValue="discover" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
            <TabsTrigger value="feed">Social Feed</TabsTrigger>
          </TabsList>

          {/* Discover Tab */}
          <TabsContent value="discover" className="space-y-6">
            {/* Top Traders */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Award className="w-6 h-6 text-warning" />
                Top Performers
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topTraders.map((trader, index) => (
                  <motion.div
                    key={trader.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="gradient-card border-0 shadow-card hover:shadow-premium transition-all duration-300">
                      <CardHeader className="text-center pb-4">
                        <div className="flex items-center justify-center gap-3 mb-3">
                          <Avatar className="w-16 h-16">
                            <AvatarImage src={trader.avatar} />
                            <AvatarFallback className="gradient-primary text-white text-lg font-semibold">
                              {trader.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          {trader.verified && (
                            <Badge variant="default" className="text-xs">
                              <Star className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl">{trader.name}</CardTitle>
                        <p className="text-muted-foreground">{trader.username}</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <p className="text-2xl font-bold text-profit">{trader.totalReturn}</p>
                            <p className="text-xs text-muted-foreground">Total Return</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold">{trader.winRate}</p>
                            <p className="text-xs text-muted-foreground">Win Rate</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{trader.followers} followers</span>
                          <span>{trader.strategies} strategies</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="hero" className="flex-1">
                            <Users className="w-4 h-4 mr-1" />
                            Follow
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Popular Strategies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-primary" />
                Trending Strategies
              </h2>
              <div className="grid gap-4">
                {popularStrategies.map((strategy, index) => (
                  <motion.div
                    key={strategy.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                  >
                    <Card className="gradient-card border-0 shadow-card hover:shadow-premium transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3">
                              <h3 className="text-xl font-semibold">{strategy.name}</h3>
                              <Badge variant="outline">{strategy.category}</Badge>
                              <Badge 
                                variant={strategy.risk === 'Low' ? 'default' : strategy.risk === 'Medium' ? 'secondary' : 'destructive'}
                              >
                                {strategy.risk} Risk
                              </Badge>
                            </div>
                            
                            <p className="text-muted-foreground">by {strategy.author}</p>
                            <p className="text-card-foreground">{strategy.description}</p>
                            
                            <div className="flex items-center gap-6 text-sm">
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4 text-muted-foreground" />
                                <span>{strategy.followers} followers</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="w-4 h-4 text-muted-foreground" />
                                <span>{strategy.likes} likes</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Copy className="w-4 h-4 text-muted-foreground" />
                                <span>{strategy.copies} copies</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right space-y-3">
                            <div>
                              <p className="text-2xl font-bold text-profit">{strategy.return}</p>
                              <p className="text-sm text-muted-foreground">6M Return</p>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                              <Button size="sm" variant="hero">
                                <Copy className="w-4 h-4 mr-1" />
                                Copy
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* Following Tab */}
          <TabsContent value="following">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Start Following Traders</h3>
              <p className="text-muted-foreground mb-6">
                Follow successful traders to get updates on their strategies and performance.
              </p>
              <Button variant="hero">Discover Top Traders</Button>
            </motion.div>
          </TabsContent>

          {/* Social Feed Tab */}
          <TabsContent value="feed">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-semibold mb-4">Community Feed</h2>
              {socialPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="gradient-card border-0 shadow-card">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="gradient-primary text-white font-semibold">
                            {post.author.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{post.author}</span>
                            {post.verified && <Star className="w-4 h-4 text-warning" />}
                            <span className="text-muted-foreground">{post.username}</span>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-muted-foreground text-sm">{post.time}</span>
                          </div>
                          
                          <p className="text-card-foreground">{post.content}</p>
                          
                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <button className="flex items-center gap-1 hover:text-primary transition-colors">
                              <Heart className="w-4 h-4" />
                              {post.likes}
                            </button>
                            <button className="flex items-center gap-1 hover:text-primary transition-colors">
                              <MessageCircle className="w-4 h-4" />
                              {post.comments}
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SocialTrading;