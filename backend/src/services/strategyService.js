// server/services/strategyService.js
import Strategy from '../models/strategy.model.js';
import { calculateIndicators } from './indicatorService.js';
import { formatErrorResponse, formatSuccessResponse } from '../utils/helpers.js';

class StrategyService {
  constructor() {
    this.runningStrategies = new Map(); // Track running strategies
  }

  // Execute strategy against market data for backtesting
  async executeStrategy(strategyId, marketData, options = {}) {
    try {
      const strategy = await Strategy.findById(strategyId);
      if (!strategy) {
        throw new Error('Strategy not found');
      }

      const {
        initialCapital = 10000,
        commission = 0.001, // 0.1%
        startDate,
        endDate
      } = options;

      // Filter data by date range if provided
      let filteredData = marketData;
      if (startDate || endDate) {
        filteredData = this.filterDataByDateRange(marketData, startDate, endDate);
      }

      // Validate data
      if (filteredData.length < 30) {
        throw new Error('Insufficient data for strategy execution (minimum 30 data points)');
      }

      const results = await this.runBacktest(strategy, filteredData, {
        initialCapital,
        commission
      });

      return formatSuccessResponse('Strategy executed successfully', results);
    } catch (error) {
      return formatErrorResponse('Strategy execution failed', error.message);
    }
  }

  // Run backtest simulation
  async runBacktest(strategy, marketData, options) {
    const { initialCapital, commission } = options;
    
    let portfolio = {
      cash: initialCapital,
      shares: 0,
      value: initialCapital,
      maxValue: initialCapital,
      maxDrawdown: 0
    };

    const trades = [];
    const portfolioHistory = [];
    const signals = [];

    // Calculate all required indicators upfront
    const indicators = await calculateIndicators(marketData, this.getRequiredIndicators(strategy));

    for (let i = 50; i < marketData.length; i++) { // Start after indicator warm-up period
      const currentPrice = marketData[i].close;
      const currentData = {
        ...marketData[i],
        indicators: this.getIndicatorsAtIndex(indicators, i)
      };

      // Evaluate all strategy rules
      const activeRules = strategy.rules.filter(rule => rule.isActive);
      const triggeredRule = await this.evaluateRules(activeRules, currentData, marketData, i);

      if (triggeredRule) {
        const signal = {
          timestamp: currentData.timestamp,
          price: currentPrice,
          rule: triggeredRule.name,
          action: triggeredRule.action.type,
          reason: this.generateSignalReason(triggeredRule, currentData)
        };
        signals.push(signal);

        // Execute trade if conditions are met
        const trade = this.executeTrade(
          portfolio, 
          currentPrice, 
          triggeredRule.action, 
          commission,
          currentData.timestamp
        );
        
        if (trade) {
          trades.push(trade);
        }
      }

      // Update portfolio value
      portfolio.value = portfolio.cash + (portfolio.shares * currentPrice);
      portfolio.maxValue = Math.max(portfolio.maxValue, portfolio.value);
      
      // Calculate drawdown
      const currentDrawdown = ((portfolio.maxValue - portfolio.value) / portfolio.maxValue) * 100;
      portfolio.maxDrawdown = Math.max(portfolio.maxDrawdown, currentDrawdown);

      // Record portfolio state
      portfolioHistory.push({
        timestamp: currentData.timestamp,
        value: portfolio.value,
        cash: portfolio.cash,
        shares: portfolio.shares,
        price: currentPrice,
        drawdown: currentDrawdown
      });

      // Apply risk management
      if (this.shouldStopTrading(portfolio, strategy.riskManagement, initialCapital)) {
        break;
      }
    }

    // Calculate final metrics
    const metrics = this.calculatePerformanceMetrics(
      trades,
      portfolioHistory,
      initialCapital,
      marketData
    );

    return {
      portfolio,
      trades,
      signals,
      portfolioHistory,
      metrics,
      strategy: {
        id: strategy._id,
        name: strategy.name,
        rules: strategy.rules.length,
        riskManagement: strategy.riskManagement
      }
    };
  }

  // Evaluate strategy rules
  async evaluateRules(rules, currentData, marketData, currentIndex) {
    // Sort rules by priority
    const sortedRules = rules.sort((a, b) => a.priority - b.priority);

    for (const rule of sortedRules) {
      if (await this.evaluateRuleConditions(rule, currentData, marketData, currentIndex)) {
        return rule;
      }
    }

    return null;
  }

  // Evaluate individual rule conditions
  async evaluateRuleConditions(rule, currentData, marketData, currentIndex) {
    const { conditions, logicalOperator } = rule;
    
    const results = await Promise.all(conditions.map(condition => 
      this.evaluateCondition(condition, currentData, marketData, currentIndex)
    ));

    if (logicalOperator === 'AND') {
      return results.every(result => result === true);
    } else {
      return results.some(result => result === true);
    }
  }

  // Evaluate single condition
  async evaluateCondition(condition, currentData, marketData, currentIndex) {
    const { indicator, operator, value } = condition;

    let leftValue = this.getIndicatorValue(indicator, condition, currentData);
    let rightValue = value;

    // Handle complex value (another indicator)
    if (typeof value === 'object' && value.indicator) {
      rightValue = this.getIndicatorValue(value.indicator, value, currentData);
    }

    // Handle cross conditions (requires previous data)
    if (operator === 'crosses_above' || operator === 'crosses_below') {
      if (currentIndex < 1) return false;
      
      const prevData = {
        ...marketData[currentIndex - 1],
        indicators: this.getIndicatorsAtIndex(
          await calculateIndicators(marketData.slice(0, currentIndex), this.getRequiredIndicators({ rules: [{ conditions: [condition] }] })),
          currentIndex - 1
        )
      };
      
      const prevLeftValue = this.getIndicatorValue(indicator, condition, prevData);
      const prevRightValue = typeof value === 'object' && value.indicator 
        ? this.getIndicatorValue(value.indicator, value, prevData)
        : rightValue;

      if (operator === 'crosses_above') {
        return prevLeftValue <= prevRightValue && leftValue > rightValue;
      } else {
        return prevLeftValue >= prevRightValue && leftValue < rightValue;
      }
    }

    // Standard comparisons
    switch (operator) {
      case '>': return leftValue > rightValue;
      case '<': return leftValue < rightValue;
      case '>=': return leftValue >= rightValue;
      case '<=': return leftValue <= rightValue;
      case '==': return Math.abs(leftValue - rightValue) < 0.001; // Float comparison with tolerance
      default: return false;
    }
  }

  // Get indicator value from current data
  getIndicatorValue(indicatorType, params, currentData) {
    switch (indicatorType) {
      case 'price':
        return currentData.close;
      case 'volume':
        return currentData.volume;
      case 'sma':
        return currentData.indicators[`sma_${params.params?.period || 20}`];
      case 'ema':
        return currentData.indicators[`ema_${params.params?.period || 20}`];
      case 'rsi':
        return currentData.indicators[`rsi_${params.params?.period || 14}`];
      case 'macd':
        const macdKey = `macd_${params.params?.fast || 12}_${params.params?.slow || 26}_${params.params?.signal || 9}`;
        if (params.line === 'signal') {
          return currentData.indicators[`${macdKey}_signal`];
        }
        return currentData.indicators[macdKey];
      case 'bollinger_bands':
        const bbKey = `bb_${params.params?.period || 20}_${params.params?.stdDev || 2}`;
        if (params.band === 'upper') {
          return currentData.indicators[`${bbKey}_upper`];
        } else if (params.band === 'lower') {
          return currentData.indicators[`${bbKey}_lower`];
        }
        return currentData.indicators[`${bbKey}_middle`];
      default:
        return 0;
    }
  }

  // Execute a trade
  executeTrade(portfolio, price, action, commission, timestamp) {
    let trade = null;

    if (action.type === 'buy' && portfolio.cash > 0) {
      let buyAmount = 0;
      
      switch (action.quantity) {
        case 'all':
          buyAmount = portfolio.cash * (1 - commission);
          break;
        case 'half':
          buyAmount = portfolio.cash * 0.5 * (1 - commission);
          break;
        case 'custom':
          buyAmount = Math.min(action.customQuantity, portfolio.cash * (1 - commission));
          break;
      }

      const shares = Math.floor(buyAmount / price);
      const cost = shares * price * (1 + commission);

      if (shares > 0 && cost <= portfolio.cash) {
        portfolio.cash -= cost;
        portfolio.shares += shares;

        trade = {
          timestamp,
          type: 'buy',
          shares,
          price,
          cost,
          commission: cost * commission
        };
      }
    } else if (action.type === 'sell' && portfolio.shares > 0) {
      let sellShares = 0;

      switch (action.quantity) {
        case 'all':
          sellShares = portfolio.shares;
          break;
        case 'half':
          sellShares = Math.floor(portfolio.shares / 2);
          break;
        case 'custom':
          sellShares = Math.min(Math.floor(action.customQuantity / price), portfolio.shares);
          break;
      }

      if (sellShares > 0) {
        const revenue = sellShares * price * (1 - commission);
        
        portfolio.cash += revenue;
        portfolio.shares -= sellShares;

        trade = {
          timestamp,
          type: 'sell',
          shares: sellShares,
          price,
          revenue,
          commission: sellShares * price * commission
        };
      }
    }

    return trade;
  }

  // Calculate performance metrics
  calculatePerformanceMetrics(trades, portfolioHistory, initialCapital, marketData) {
    if (portfolioHistory.length === 0) {
      return this.getDefaultMetrics();
    }

    const finalValue = portfolioHistory[portfolioHistory.length - 1].value;
    const totalReturn = ((finalValue - initialCapital) / initialCapital) * 100;

    // Calculate buy & hold return for comparison
    const buyHoldReturn = ((marketData[marketData.length - 1].close - marketData[0].close) / marketData[0].close) * 100;

    const winningTrades = trades.filter(t => t.type === 'sell').length;
    const totalTrades = trades.filter(t => t.type === 'buy').length;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

    // Calculate Sharpe ratio (simplified)
    const returns = portfolioHistory.map((p, i) => 
      i > 0 ? (p.value - portfolioHistory[i-1].value) / portfolioHistory[i-1].value : 0
    ).slice(1);

    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const returnStd = Math.sqrt(returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length);
    const sharpeRatio = returnStd > 0 ? (avgReturn / returnStd) * Math.sqrt(252) : 0; // Annualized

    const maxDrawdown = Math.max(...portfolioHistory.map(p => p.drawdown));

    return {
      totalReturn: Number(totalReturn.toFixed(2)),
      buyHoldReturn: Number(buyHoldReturn.toFixed(2)),
      sharpeRatio: Number(sharpeRatio.toFixed(2)),
      maxDrawdown: Number(maxDrawdown.toFixed(2)),
      winRate: Number(winRate.toFixed(2)),
      totalTrades,
      winningTrades,
      finalValue: Number(finalValue.toFixed(2)),
      totalCommissions: Number(trades.reduce((sum, t) => sum + (t.commission || 0), 0).toFixed(2))
    };
  }

  // Helper methods
  getRequiredIndicators(strategy) {
    const indicators = new Set();
    
    strategy.rules.forEach(rule => {
      rule.conditions.forEach(condition => {
        indicators.add(condition.indicator);
        if (typeof condition.value === 'object' && condition.value.indicator) {
          indicators.add(condition.value.indicator);
        }
      });
    });

    return Array.from(indicators);
  }

  getIndicatorsAtIndex(indicators, index) {
    const result = {};
    Object.keys(indicators).forEach(key => {
      result[key] = indicators[key][index];
    });
    return result;
  }

  generateSignalReason(rule, currentData) {
    return `${rule.name}: ${rule.conditions.map(c => 
      `${c.indicator} ${c.operator} ${c.value}`
    ).join(` ${rule.logicalOperator} `)}`;
  }

  shouldStopTrading(portfolio, riskManagement, initialCapital) {
    if (!riskManagement) return false;

    // Check daily loss limit
    if (riskManagement.maxDailyLoss) {
      const currentLoss = ((initialCapital - portfolio.value) / initialCapital) * 100;
      if (currentLoss >= riskManagement.maxDailyLoss) {
        return true;
      }
    }

    return false;
  }

  filterDataByDateRange(data, startDate, endDate) {
    return data.filter(item => {
      const itemDate = new Date(item.timestamp);
      if (startDate && itemDate < new Date(startDate)) return false;
      if (endDate && itemDate > new Date(endDate)) return false;
      return true;
    });
  }

  getDefaultMetrics() {
    return {
      totalReturn: 0,
      buyHoldReturn: 0,
      sharpeRatio: 0,
      maxDrawdown: 0,
      winRate: 0,
      totalTrades: 0,
      winningTrades: 0,
      finalValue: 0,
      totalCommissions: 0
    };
  }
}

const strategyService = new StrategyService();

export const executeStrategy = strategyService.executeStrategy.bind(strategyService);
export const runBacktest = strategyService.runBacktest.bind(strategyService);
export const evaluateRules = strategyService.evaluateRules.bind(strategyService);
export const evaluateRuleConditions = strategyService.evaluateRuleConditions.bind(strategyService);
export const evaluateCondition = strategyService.evaluateCondition.bind(strategyService);
export const getIndicatorValue = strategyService.getIndicatorValue.bind(strategyService);
export const executeTrade = strategyService.executeTrade.bind(strategyService);
export const calculatePerformanceMetrics = strategyService.calculatePerformanceMetrics.bind(strategyService);
export const getRequiredIndicators = strategyService.getRequiredIndicators.bind(strategyService);
export const getIndicatorsAtIndex = strategyService.getIndicatorsAtIndex.bind(strategyService);
export const generateSignalReason = strategyService.generateSignalReason.bind(strategyService);
export const shouldStopTrading = strategyService.shouldStopTrading.bind(strategyService);
export const filterDataByDateRange = strategyService.filterDataByDateRange.bind(strategyService);
export const getDefaultMetrics = strategyService.getDefaultMetrics.bind(strategyService);

export default strategyService;