import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Trophy, ArrowLeft, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TradingLevels = () => {
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [currentQuiz, setCurrentQuiz] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const { toast } = useToast();

  // Quiz data with algorithmic trading questions
  const quizData = {
    1: {
      title: "Basic Trading Concepts",
      questions: [
        {
          question: "What does 'buy low, sell high' mean in trading?",
          options: ["Buy expensive stocks", "Purchase stocks at low prices and sell at higher prices", "Only buy during market lows", "Sell first, then buy"],
          correct: 1
        },
        {
          question: "What is a stock market index?",
          options: ["A single stock price", "A measure of market performance across multiple stocks", "A trading strategy", "A type of bond"],
          correct: 1
        },
        {
          question: "What does volatility mean in trading?",
          options: ["The price never changes", "How much a stock price fluctuates", "The trading volume", "The dividend yield"],
          correct: 1
        }
      ]
    },
    2: {
      title: "Market Analysis Fundamentals",
      questions: [
        {
          question: "What is technical analysis?",
          options: ["Analyzing company financials", "Studying price charts and patterns", "Reading news articles", "Calculating dividends"],
          correct: 1
        },
        {
          question: "What is a support level?",
          options: ["A price level where buying interest is strong", "The highest price ever reached", "A type of order", "Market closing price"],
          correct: 0
        },
        {
          question: "What does RSI stand for?",
          options: ["Rapid Stock Index", "Relative Strength Index", "Real Sector Investment", "Risk Safety Indicator"],
          correct: 1
        }
      ]
    },
    3: {
      title: "Trading Orders & Execution",
      questions: [
        {
          question: "What is a limit order?",
          options: ["An order with no price limit", "An order to buy/sell at a specific price or better", "An order that expires daily", "A type of stop loss"],
          correct: 1
        },
        {
          question: "What is slippage in trading?",
          options: ["A trading mistake", "The difference between expected and actual execution price", "A type of chart pattern", "A market indicator"],
          correct: 1
        },
        {
          question: "What is bid-ask spread?",
          options: ["The profit margin", "The difference between highest bid and lowest ask price", "A trading strategy", "A market timing tool"],
          correct: 1
        }
      ]
    },
    4: {
      title: "Risk Management Basics",
      questions: [
        {
          question: "What is position sizing?",
          options: ["The physical size of a trade", "Determining how much capital to risk on each trade", "The number of stocks in the market", "A chart pattern"],
          correct: 1
        },
        {
          question: "What is a stop-loss order?",
          options: ["An order to buy more stocks", "An order to limit losses by selling at a predetermined price", "A profit-taking strategy", "A market analysis tool"],
          correct: 1
        },
        {
          question: "What does diversification mean?",
          options: ["Buying only one stock", "Spreading investments across different assets", "Trading frequently", "Following market trends"],
          correct: 1
        }
      ]
    },
    5: {
      title: "Algorithmic Trading Introduction",
      questions: [
        {
          question: "What is algorithmic trading?",
          options: ["Manual trading only", "Using computer programs to execute trades automatically", "Trading based on emotions", "Random trading decisions"],
          correct: 1
        },
        {
          question: "What is a trading algorithm?",
          options: ["A mathematical formula", "A set of rules for making trading decisions", "A type of stock", "A market indicator"],
          correct: 1
        },
        {
          question: "What is backtesting?",
          options: ["Testing strategies on historical data", "Testing new computers", "Trading in reverse", "A type of order"],
          correct: 0
        }
      ]
    },
    6: {
      title: "Moving Averages & Indicators",
      questions: [
        {
          question: "What is a moving average?",
          options: ["A static price level", "An average price over a specific time period", "A trading volume measure", "A market cap indicator"],
          correct: 1
        },
        {
          question: "What is a golden cross?",
          options: ["When short-term MA crosses above long-term MA", "A chart pattern", "A support level", "A resistance level"],
          correct: 0
        },
        {
          question: "What does MACD stand for?",
          options: ["Market Average Cross Divergence", "Moving Average Convergence Divergence", "Maximum Available Capital Deployment", "Market Analysis Calculation Display"],
          correct: 1
        }
      ]
    },
    7: {
      title: "Advanced Technical Patterns",
      questions: [
        {
          question: "What is a head and shoulders pattern?",
          options: ["A continuation pattern", "A reversal pattern with three peaks", "A support level", "A type of moving average"],
          correct: 1
        },
        {
          question: "What is a double bottom pattern?",
          options: ["A bearish reversal pattern", "A bullish reversal pattern", "A continuation pattern", "A sideways pattern"],
          correct: 1
        },
        {
          question: "What is a breakout?",
          options: ["When price moves through a support or resistance level", "A market crash", "A trading error", "A type of order"],
          correct: 0
        }
      ]
    },
    8: {
      title: "Options & Derivatives Basics",
      questions: [
        {
          question: "What is a call option?",
          options: ["The right to sell a stock", "The right to buy a stock at a specific price", "A type of bond", "A market indicator"],
          correct: 1
        },
        {
          question: "What is implied volatility?",
          options: ["Historical price movements", "Market's expectation of future volatility", "Current trading volume", "Daily price range"],
          correct: 1
        },
        {
          question: "What is delta in options?",
          options: ["The option price", "How much option price changes per $1 change in underlying", "The expiration date", "The strike price"],
          correct: 1
        }
      ]
    },
    9: {
      title: "Quantitative Trading Strategies",
      questions: [
        {
          question: "What is pair trading?",
          options: ["Trading two random stocks", "Trading two correlated stocks in opposite directions", "Buying two stocks together", "A chart pattern"],
          correct: 1
        },
        {
          question: "What is mean reversion?",
          options: ["Prices tend to return to their average over time", "Prices always go up", "Prices follow trends", "A type of indicator"],
          correct: 0
        },
        {
          question: "What is momentum trading?",
          options: ["Trading based on price trends and momentum", "Random trading", "Trading against trends", "A risk management technique"],
          correct: 0
        }
      ]
    },
    10: {
      title: "Advanced Algorithmic Strategies",
      questions: [
        {
          question: "What is high-frequency trading (HFT)?",
          options: ["Manual trading", "Ultra-fast algorithmic trading using millisecond execution", "Long-term investing", "Options trading"],
          correct: 1
        },
        {
          question: "What is arbitrage?",
          options: ["A type of chart", "Profiting from price differences of the same asset in different markets", "A risk management tool", "A technical indicator"],
          correct: 1
        },
        {
          question: "What is machine learning in trading?",
          options: ["Manual analysis", "Using AI algorithms to identify patterns and make trading decisions", "Basic calculations", "Chart reading"],
          correct: 1
        }
      ]
    }
  };

  // Load completed levels from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem("completedLevels");
    if (saved) {
      setCompletedLevels(JSON.parse(saved));
    }
  }, []);

  // Save completed levels to localStorage
  const saveProgress = (newCompletedLevels: number[]) => {
    localStorage.setItem("completedLevels", JSON.stringify(newCompletedLevels));
    setCompletedLevels(newCompletedLevels);
  };

  // Start a quiz for a specific level
  const startQuiz = (level: number) => {
    setCurrentQuiz(level);
    setCurrentQuestion(0);
    setScore(0);
    setQuizComplete(false);
  };

  // Handle answer selection
  const handleAnswer = (selectedIndex: number) => {
    const quiz = quizData[currentQuiz as keyof typeof quizData];
    const isCorrect = selectedIndex === quiz.questions[currentQuestion].correct;
    
    if (isCorrect) {
      setScore(score + 1);
    }

    // Move to next question or complete quiz
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeQuiz();
    }
  };

  // Complete the current quiz
  const completeQuiz = () => {
    setQuizComplete(true);
    const quiz = quizData[currentQuiz as keyof typeof quizData];
    const passed = score >= Math.ceil(quiz.questions.length * 0.7); // 70% to pass
    
    if (passed && !completedLevels.includes(currentQuiz!)) {
      const newCompleted = [...completedLevels, currentQuiz!];
      saveProgress(newCompleted);
      toast({
        title: "Level Completed!",
        description: `Congratulations! You've completed Level ${currentQuiz}`,
      });
    }
  };

  // Close quiz dialog
  const closeQuiz = () => {
    setCurrentQuiz(null);
    setCurrentQuestion(0);
    setScore(0);
    setQuizComplete(false);
  };

  // Generate and download certificate
  const downloadCertificate = (level: number) => {
    // Create a canvas to generate the certificate
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Certificate background
    ctx.fillStyle = '#f9f9f9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Border
    ctx.strokeStyle = '#00cd66';
    ctx.lineWidth = 10;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
    
    // Title
    ctx.fillStyle = '#0c9651';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Certificate of Completion', canvas.width / 2, 100);
    
    // Subtitle
    ctx.fillStyle = '#000000';
    ctx.font = '24px Arial';
    ctx.fillText('Algorithmic Trading Mastery Program', canvas.width / 2, 150);
    
    // Level completed
    ctx.font = 'bold 28px Arial';
    ctx.fillStyle = '#00cd66';
    ctx.fillText(`Level ${level}: ${quizData[level as keyof typeof quizData].title}`, canvas.width / 2, 250);
    
    // User message
    ctx.fillStyle = '#000000';
    ctx.font = '20px Arial';
    ctx.fillText('This certifies that', canvas.width / 2, 320);
    
    // User name (you could get this from auth context)
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#0c9651';
    ctx.fillText('Trading Student', canvas.width / 2, 360);
    
    // Completion date
    ctx.font = '18px Arial';
    ctx.fillStyle = '#000000';
    ctx.fillText(`Completed on: ${new Date().toLocaleDateString()}`, canvas.width / 2, 420);
    
    // Signature line
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 100, 500);
    ctx.lineTo(canvas.width / 2 + 100, 500);
    ctx.stroke();
    
    ctx.font = '16px Arial';
    ctx.fillStyle = '#000000';
    ctx.fillText('Stratify Academy', canvas.width / 2, 530);
    
    // Convert to image and download
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `Algorithmic-Trading-Level-${level}-Certificate.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate level positions (similar to the game layout in the reference image)
  const getLevelPosition = (level: number) => {
    const positions = [
      { top: "80%", left: "10%" },   // Level 1
      { top: "65%", left: "25%" },   // Level 2  
      { top: "50%", left: "15%" },   // Level 3
      { top: "35%", left: "30%" },   // Level 4
      { top: "20%", left: "20%" },   // Level 5
      { top: "15%", left: "45%" },   // Level 6
      { top: "30%", left: "60%" },   // Level 7
      { top: "45%", left: "75%" },   // Level 8
      { top: "60%", left: "85%" },   // Level 9
      { top: "75%", left: "70%" },   // Level 10
    ];
    return positions[level - 1];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-secondary/20 rounded-full blur-lg"></div>
        <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-primary/15 rounded-full blur-xl"></div>
        <div className="absolute bottom-40 right-1/4 w-12 h-12 bg-secondary/25 rounded-full blur-lg"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">
              Algorithmic Trading Mastery
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              Master trading from basics to advanced algorithmic strategies
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-[#00cd66]" />
            <span className="text-xl font-semibold">
              {completedLevels.length}/10 Levels
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-muted/30 border border-[#00cd66] rounded-full h-3 mb-8">
          <div 
            className="bg-gradient-to-r from-[#9aff9a] to-[#0c9651] h-3 rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${(completedLevels.length / 10) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Game Map with Levels */}
      <div className="relative flex-1 min-h-[600px]">
        {/* Curved Path SVG */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="none">
            <path
              d="M 100,480 Q 200,350 150,300 T 300,200 Q 400,150 450,270 T 600,350 Q 750,300 850,420"
              stroke="#00cd66"
              strokeWidth="8"
              fill="none"
              className="opacity-30"
            />
        </svg>

        {/* Level Buttons */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => {
          const position = getLevelPosition(level);
          const isCompleted = completedLevels.includes(level);
          const isAccessible = level === 1 || completedLevels.includes(level - 1);
          
          return (
            <div
              key={level}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ top: position.top, left: position.left }}
            >
              <Button
                onClick={() => isAccessible && startQuiz(level)}
                disabled={!isAccessible}
                size="lg"
                className={`
                  relative w-16 h-16 rounded-full text-xl font-bold shadow-lg border-2
                  transition-all duration-300 hover:scale-110 hover:shadow-xl
                  ${isCompleted 
                    ? 'bg-[#00cd66] text-white border-[#0c9651] shadow-[#00cd66]/25' 
                    : isAccessible 
                      ? 'bg-card text-foreground border-[#00cd66] hover:bg-[#00cd66]/10 hover:border-[#00cd66]' 
                      : 'bg-muted text-muted-foreground border-muted cursor-not-allowed opacity-50'
                  }
                `}
              >
                {isCompleted && (
                  <CheckCircle className="absolute -top-2 -right-2 w-6 h-6 text-[#00cd66] bg-card border border-[#00cd66] rounded-full" />
                )}
                {level}
              </Button>
              
              {/* Level Badge */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                <Badge 
                  variant={isCompleted ? "default" : "secondary"}
                  className="text-xs whitespace-nowrap border border-[#00cd66]"
                >
                  Level {level}
                </Badge>
              </div>
              
              {/* Certificate Download Button for Completed Levels */}
              {isCompleted && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadCertificate(level);
                    }}
                    size="sm"
                    className="bg-[#0c9651] hover:bg-[#00cd66] text-white border border-[#00cd66]"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Certificate
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quiz Dialog */}
      {currentQuiz && (
        <Dialog open={!!currentQuiz} onOpenChange={closeQuiz}>
          <DialogContent className="max-w-2xl border-2 border-[#00cd66]">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Level {currentQuiz}: {quizData[currentQuiz as keyof typeof quizData].title}</span>
                <Button variant="ghost" size="icon" onClick={closeQuiz}>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </DialogTitle>
            </DialogHeader>

            {!quizComplete ? (
              <div className="space-y-6">
                {/* Progress */}
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Question {currentQuestion + 1} of {quizData[currentQuiz as keyof typeof quizData].questions.length}</span>
                  <span>Score: {score}/{currentQuestion + (quizComplete ? 1 : 0)}</span>
                </div>

                {/* Question */}
                <Card className="border border-[#00cd66]">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {quizData[currentQuiz as keyof typeof quizData].questions[currentQuestion].question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {quizData[currentQuiz as keyof typeof quizData].questions[currentQuestion].options.map((option, index) => (
                        <Button
                          key={index}
                          onClick={() => handleAnswer(index)}
                          variant="outline"
                          className="w-full text-left justify-start p-4 h-auto border border-[#9aff9a] hover:border-[#00cd66] hover:bg-[#9aff9a]/10"
                        >
                          <span className="mr-3 text-[#00cd66] font-semibold">{String.fromCharCode(65 + index)}.</span>
                          {option}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <div className="text-6xl">
                  {score >= Math.ceil(quizData[currentQuiz as keyof typeof quizData].questions.length * 0.7) ? "🎉" : "📚"}
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">
                    {score >= Math.ceil(quizData[currentQuiz as keyof typeof quizData].questions.length * 0.7) 
                      ? "Congratulations!" 
                      : "Keep Learning!"
                    }
                  </h3>
                  <p className="text-lg text-muted-foreground">
                    You scored {score} out of {quizData[currentQuiz as keyof typeof quizData].questions.length}
                  </p>
                  {score >= Math.ceil(quizData[currentQuiz as keyof typeof quizData].questions.length * 0.7) ? (
                    <div>
                      <p className="text-[#00cd66] font-semibold mt-2">Level {currentQuiz} Complete!</p>
                      <Button 
                        onClick={() => downloadCertificate(currentQuiz)} 
                        className="mt-4 bg-[#0c9651] hover:bg-[#00cd66]"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Certificate
                      </Button>
                    </div>
                  ) : (
                    <p className="text-destructive mt-2">Need 70% to pass. Try again!</p>
                  )}
                </div>
                <div className="flex gap-3 justify-center">
                  <Button onClick={closeQuiz} variant="outline" className="border-[#00cd66]">
                    Continue
                  </Button>
                  {score < Math.ceil(quizData[currentQuiz as keyof typeof quizData].questions.length * 0.7) && (
                    <Button onClick={() => startQuiz(currentQuiz)} className="bg-[#00cd66] hover:bg-[#0c9651]">
                      Try Again
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TradingLevels;