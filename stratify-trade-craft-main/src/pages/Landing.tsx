import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  TrendingUp,
  Bot,
  Users,
  BarChart3,
  Zap,
  FileText,
  Briefcase,
  Target,
  Shield,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
} from 'lucide-react';

const Landing: React.FC = () => {
  const features = [
    {
      icon: TrendingUp,
      title: 'TRADING ENGINE',
      description: 'Advanced algorithmic trading with real-time execution and market data integration.',
    },
    {
      icon: Bot,
      title: 'STRATEGY BUILDER',
      description: 'Drag-and-drop interface to create sophisticated trading strategies without coding.',
    },
    {
      icon: Users,
      title: 'SOCIAL TRADING',
      description: 'Follow top traders, copy strategies, and learn from the community.',
    },
    {
      icon: BarChart3,
      title: 'BACKTESTING ENGINE',
      description: 'Test your strategies against historical data with advanced analytics.',
    },
    {
      icon: Zap,
      title: 'EXECUTION ALGOS',
      description: 'Lightning-fast order execution with multiple algorithm types.',
    },
    {
      icon: FileText,
      title: 'REPORTS',
      description: 'Comprehensive P&L reports, trade analytics, and performance metrics.',
    },
    {
      icon: Briefcase,
      title: 'FUND MANAGEMENT',
      description: 'Professional portfolio management tools with risk controls.',
    },
    {
      icon: Target,
      title: 'KEYWORDS',
      description: 'Smart market scanning and signal detection based on custom keywords.',
    },
  ];

  const benefits = [
    'No servers, delays, or complexity',
    'Professional-grade infrastructure',
    'Real-time market data',
    'Advanced risk management',
    'Regulatory compliance built-in',
    'Multi-asset class support',
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Quantitative Trader',
      content: 'Stratify transformed my trading approach. The backtesting engine is incredibly detailed and helped me optimize my strategies for better returns.',
      rating: 5,
    },
    {
      name: 'Michael Rodriguez',
      role: 'Retail Investor',
      content: 'As someone new to algorithmic trading, the strategy builder made it easy to get started. I\'m now running multiple profitable strategies.',
      rating: 5,
    },
    {
      name: 'Emma Thompson',
      role: 'Fund Manager',
      content: 'The risk management features and reporting capabilities are exactly what we needed for our institutional clients.',
      rating: 5,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text animate-gradient-shift bg-[length:200%_200%]">
                One Algo Trading Platform.
              </span>
              <br />
              Built for Traders, Advisors & Enterprises.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Whether you're a Retail Trader, Quant Developer, RA/RIA, Broking House, or a Fintech firm—Stratify gives you the tools, infrastructure, and compliance to build, deploy, and scale algorithmic strategies with ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/signup">
                <Button variant="hero" size="xl" className="group">
                  Start Trading Now @ ₹99 for 7 Days
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="xl">
                  Explore Solutions
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 rounded-lg bg-warning/10 border border-warning/20 max-w-3xl mx-auto">
              <div className="w-3 h-3 bg-warning rounded-full animate-pulse" />
              <p className="text-sm text-warning-foreground">
                Whether you're looking to automate your own trades or offer algo solutions to your existing user base at any scale — we have end-to-end solutions tailored for you.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Video Section (Mock) */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-premium bg-gradient-to-br from-card to-card/50 border border-border/50">
              <div className="aspect-video flex items-center justify-center bg-muted/20">
                <Button variant="hero" size="icon" className="w-20 h-20 rounded-full">
                  <Play className="w-8 h-8 ml-1" />
                </Button>
              </div>
              <div className="absolute bottom-4 left-4 flex gap-2">
                <Button variant="secondary" size="sm">Stratify Overview</Button>
                <Button variant="ghost" size="sm">Strategy Builder</Button>
                <Button variant="ghost" size="sm">Backtesting Engine</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who is Stratify for? */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-6">
              Who is <span className="gradient-text">Stratify</span> for?
            </motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Retail Traders & Investors',
                description: 'Trade smarter using ready-made strategies, create your own using forms/AI, or let experts build it for you —no code needed.',
                link: '/dashboard',
              },
              {
                title: 'Quant Developers & Coders',
                description: 'Code in Python. Use advanced tools, ML libraries, and deploy live—without managing servers.',
                link: '/strategy-builder',
              },
              {
                title: 'Strategy Creators & Advisors',
                description: 'Monetize your trading expertise by creating and sharing strategies with our community.',
                link: '/social-trading',
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <Card className="h-full gradient-card border-0 shadow-card hover:shadow-premium transition-all duration-300">
                  <CardContent className="p-8 text-center">
                    <h3 className="text-xl font-semibold mb-4 text-card-foreground">{item.title}</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">{item.description}</p>
                    <Link to={item.link}>
                      <Button variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground">
                        Explore Solutions
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-6">
              Powerful Features for <span className="gradient-text">Every Trader</span>
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From strategy creation to execution, we provide everything you need to succeed in algorithmic trading.
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div key={feature.title} variants={itemVariants} whileHover={{ y: -5 }}>
                <Card className="h-full bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all duration-300 group">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-lg gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-3 text-card-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Why Choose <span className="gradient-text">Stratify</span>?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Built by traders, for traders. Experience the difference of a platform designed with your success in mind.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <Card className="gradient-card border-0 shadow-premium p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Shield className="w-8 h-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">Enterprise Security</h3>
                      <p className="text-sm text-muted-foreground">Bank-grade security and compliance</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Zap className="w-8 h-8 text-warning" />
                    <div>
                      <h3 className="font-semibold">Lightning Fast</h3>
                      <p className="text-sm text-muted-foreground">Sub-millisecond execution times</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Target className="w-8 h-8 text-success" />
                    <div>
                      <h3 className="font-semibold">Proven Results</h3>
                      <p className="text-sm text-muted-foreground">Trusted by 10,000+ active traders</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-6">
              Trusted by <span className="gradient-text">Thousands</span>
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-muted-foreground">
              See what our traders are saying about their success with Stratify
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div key={testimonial.name} variants={itemVariants}>
                <Card className="h-full gradient-card border-0 shadow-card hover:shadow-premium transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                      ))}
                    </div>
                    <p className="text-card-foreground mb-6 leading-relaxed italic">"{testimonial.content}"</p>
                    <div>
                      <p className="font-semibold text-card-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Trading?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of traders who have already revolutionized their approach with Stratify.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button variant="secondary" size="xl" className="bg-white text-primary hover:bg-white/90">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="xl" className="border-white text-white hover:bg-white/10">
                  View Demo
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;