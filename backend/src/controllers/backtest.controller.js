import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Backtest } from "../models/backtest.model.js";
import yahooFinance from "yahoo-finance2";

// Helper for metrics
const calculateMetrics = (prices, trades) => {
  let returns = prices.map((p, i) =>
    i === 0 ? 0 : (prices[i] - prices[i - 1]) / prices[i - 1]
  );

  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const stdDev = Math.sqrt(
    returns.map(r => Math.pow(r - avgReturn, 2)).reduce((a, b) => a + b, 0) /
      returns.length
  );
  const sharpeRatio = stdDev !== 0 ? avgReturn / stdDev : 0;

  const cumulative = prices[prices.length - 1] / prices[0] - 1;

  let maxDrawdown = 0;
  let peak = prices[0];
  prices.forEach(price => {
    if (price > peak) peak = price;
    const dd = (peak - price) / peak;
    if (dd > maxDrawdown) maxDrawdown = dd;
  });

  return {
    totalReturn: cumulative,
    sharpeRatio,
    maxDrawdown,
    volatility: stdDev,
    trades,
  };
};

// @desc Start new backtest
export const startBacktest = asyncHandler(async (req, res) => {
  const { ticker, strategyName, parameters, timeframe } = req.body;

  console.log('Backtest request:', { ticker, strategyName, parameters, timeframe });

  if (!ticker || !strategyName) {
    throw new ApiError(400, "Ticker and strategyName are required");
  }

  // Map frontend timeframes to Yahoo Finance supported intervals
  const timeframeMap = {
    '1d': { method: 'historical', interval: '1d' },
    '1h': { method: 'chart', interval: '1h' },
    '5m': { method: 'chart', interval: '5m' }
  };
  
  const config = timeframeMap[timeframe] || timeframeMap['1d'];
  
  // fetch historical data from Yahoo Finance
  let result;
  try {
    if (config.method === 'chart') {
      // Use chart method for intraday data
      const chartData = await yahooFinance.chart(ticker, {
        period1: "2020-01-01",
        interval: config.interval
      });
      
      if (!chartData || !chartData.quotes) {
        throw new ApiError(404, "No chart data available for this ticker");
      }
      
      // Convert chart data to historical format
      result = chartData.quotes
        .filter(quote => quote.close && quote.date)
        .map(quote => ({
          date: new Date(quote.date),
          close: quote.close
        }));
    } else {
      // Use historical method for daily data
      result = await yahooFinance.historical(ticker, {
        period1: "2020-01-01",
        interval: config.interval
      });
    }
  } catch (error) {
    console.error('Yahoo Finance API error:', error);
    throw new ApiError(500, `Failed to fetch historical data: ${error.message}`);
  }

  if (!result || result.length === 0) {
    throw new ApiError(404, "No historical data found");
  }

  const prices = result.map(d => d.close);

  // --- Example strategy: Moving Average Crossover ---
  const short = parameters?.shortMA || 20;
  const long = parameters?.longMA || 50;

  let trades = [];
  let position = null;

  for (let i = long; i < prices.length; i++) {
    const shortMA =
      prices.slice(i - short, i).reduce((a, b) => a + b, 0) / short;
    const longMA =
      prices.slice(i - long, i).reduce((a, b) => a + b, 0) / long;

    if (!position && shortMA > longMA) {
      position = { entryDate: result[i].date, entryPrice: prices[i] };
    } else if (position && shortMA < longMA) {
      trades.push({
        ...position,
        exitDate: result[i].date,
        exitPrice: prices[i],
        profitLoss: prices[i] - position.entryPrice,
      });
      position = null;
    }
  }

  const metrics = calculateMetrics(prices, trades);

  const backtest = await Backtest.create({
    user: req.user._id,
    ticker,
    strategyName,
    timeframe,
    parameters,
    results: metrics,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, backtest, "Backtest completed"));
});

// @desc Get backtest by ID
export const getBacktestById = asyncHandler(async (req, res) => {
  const backtest = await Backtest.findById(req.params.id);
  if (!backtest) throw new ApiError(404, "Backtest not found");
  return res.status(200).json(new ApiResponse(200, backtest));
});

// @desc List all backtests of current user
export const listBacktests = asyncHandler(async (req, res) => {
  const backtests = await Backtest.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  return res.status(200).json(new ApiResponse(200, backtests));
});
