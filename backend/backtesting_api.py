# backtesting_api.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, field_validator
from typing import Optional, List, Dict, Any
import pandas as pd
import numpy as np
import yfinance as yf
from datetime import datetime
import uuid

app = FastAPI(title="Backtesting Assistant API", version="1.0.0")

class BacktestRequest(BaseModel):
    # Data parameters
    ticker: str
    start_date: str
    end_date: str
    capital: float
    
    # Strategy parameters
    strategy_type: str  # pattern, indicator, mixed
    pattern: Optional[str] = None
    indicator: Optional[str] = None
    
    # Entry rules
    min_confidence: float = Field(0.8, ge=0.0, le=1.0)
    entry_side: str = Field('long', pattern='^(long|short|both)$')
    
    # Exit rules
    hold_days: int = Field(3, gt=0)
    stop_loss: float = Field(0.0, ge=0.0)
    take_profit: float = Field(0.0, ge=0.0)
    trailing_stop: bool = False
    
    # Risk management
    position_sizing: str = Field('percent_capital', pattern='^(fixed_dollar|percent_capital|kelly)$')
    position_size_value: float = Field(5.0, ge=0.0)
    max_open_trades: int = Field(5, gt=0)
    max_drawdown: float = Field(20.0, ge=0.0)
    
    @field_validator('start_date', 'end_date')
    @classmethod
    def validate_dates(cls, v):
        try:
            datetime.strptime(v, '%Y-%m-%d')
        except ValueError:
            raise ValueError('Date format must be YYYY-MM-DD')
        return v
    
    @field_validator('strategy_type')
    @classmethod
    def validate_strategy_type(cls, v):
        if v not in ['pattern', 'indicator', 'mixed']:
            raise ValueError('Strategy type must be pattern, indicator, or mixed')
        return v

class Trade(BaseModel):
    entry_date: str
    entry_price: float
    exit_date: str
    exit_price: float
    pattern: str
    confidence: float
    shares: int
    pnl: float
    exit_reason: str

class Metrics(BaseModel):
    starting_capital: float
    final_capital: float
    cumulative_return_pct: float
    annualized_sharpe_ratio: float
    max_drawdown_pct: float
    win_rate_pct: float
    number_of_trades: int
    total_pnl: float

class EquityPoint(BaseModel):
    date: str
    equity: float

class BacktestResponse(BaseModel):
    metrics: Metrics
    equity_curve: List[EquityPoint]
    trades: List[Trade]

def fetch_stock_data(ticker: str, start_date: str, end_date: str):
    """Fetch stock data from Yahoo Finance"""
    try:
        data = yf.download(ticker, start=start_date, end=end_date)
        if data.empty:
            raise HTTPException(status_code=400, detail="No data found for the given ticker and date range")
        
        # Format data
        data.reset_index(inplace=True)
        formatted_data = data[['Date', 'Open', 'High', 'Low', 'Close', 'Volume']].copy()
        formatted_data['Date'] = formatted_data['Date'].dt.strftime('%Y-%m-%d')
        return formatted_data
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error downloading data: {str(e)}")

def detect_patterns(data_df):
    """Simple pattern detection for demonstration"""
    patterns = []
    for i in range(1, len(data_df)):
        # Fix: Properly extract scalar values using .iloc
        close = float(data_df['Close'].iloc[i])
        open_price = float(data_df['Open'].iloc[i])
        high = float(data_df['High'].iloc[i])
        low = float(data_df['Low'].iloc[i])
        date = str(data_df['Date'].iloc[i])  # Convert to string for use as key
        
        body = abs(close - open_price)
        total_range = high - low
        
        if body < 0.1 * total_range:
            patterns.append({
                'type': 'Doji',
                'date': date,
                'confidence': 0.9
            })
        elif body < 0.3 * total_range and (min(close, open_price) - low) > 2 * body:
            patterns.append({
                'type': 'Hammer',
                'date': date,
                'confidence': 0.85
            })
    
    return patterns

def run_backtest(request: BacktestRequest, ohlc_data: pd.DataFrame):
    """Run backtest with all configuration"""
    # Detect patterns
    patterns = detect_patterns(ohlc_data)
    
    # Initialize backtesting variables
    capital = request.capital
    trades = []
    
    # Fix: Properly extract the first date as string
    if len(ohlc_data) > 0:
        first_date = str(ohlc_data['Date'].iloc[0])
    else:
        first_date = "2022-01-01"
    
    equity_curve = [{'date': first_date, 'equity': float(capital)}]
    open_positions = []
    max_equity = capital
    
    # Get target pattern
    target_pattern = request.pattern or 'Doji'
    
    # Create pattern signals dictionary
    pattern_signals = {}
    for pattern in patterns:
        if pattern['type'] == target_pattern and pattern['confidence'] >= request.min_confidence:
            # Fix: Use string date as key
            pattern_signals[pattern['date']] = pattern
    
    # Convert Date column to datetime if it's not already
    if not pd.api.types.is_datetime64_any_dtype(ohlc_data['Date']):
        ohlc_data['Date'] = pd.to_datetime(ohlc_data['Date'])
    
    # Run through data
    for i in range(1, len(ohlc_data)):
        # Fix: Extract scalar values properly using .iloc
        current_date = ohlc_data['Date'].iloc[i]
        current_price = float(ohlc_data['Close'].iloc[i])
        
        # Update open positions
        positions_to_close = []
        for pos in open_positions[:]:  # Create a copy to avoid modification during iteration
            # Check stop loss
            if request.stop_loss > 0:
                stop_level = pos['entry_price'] * (1 - request.stop_loss/100)
                if current_price <= stop_level:
                    pnl = (current_price - pos['entry_price']) * pos['shares']
                    trades.append({
                        'entry_date': str(pos['entry_date'])[:10],  # Format as YYYY-MM-DD
                        'entry_price': float(pos['entry_price']),
                        'exit_date': str(current_date)[:10],  # Format as YYYY-MM-DD
                        'exit_price': float(current_price),
                        'pattern': pos['pattern'],
                        'confidence': float(pos['confidence']),
                        'shares': int(pos['shares']),
                        'pnl': float(pnl),
                        'exit_reason': 'Stop Loss'
                    })
                    capital += current_price * pos['shares']
                    positions_to_close.append(pos)
                    continue
            
            # Check take profit
            if request.take_profit > 0:
                tp_level = pos['entry_price'] * (1 + request.take_profit/100)
                if current_price >= tp_level:
                    pnl = (current_price - pos['entry_price']) * pos['shares']
                    trades.append({
                        'entry_date': str(pos['entry_date'])[:10],  # Format as YYYY-MM-DD
                        'entry_price': float(pos['entry_price']),
                        'exit_date': str(current_date)[:10],  # Format as YYYY-MM-DD
                        'exit_price': float(current_price),
                        'pattern': pos['pattern'],
                        'confidence': float(pos['confidence']),
                        'shares': int(pos['shares']),
                        'pnl': float(pnl),
                        'exit_reason': 'Take Profit'
                    })
                    capital += current_price * pos['shares']
                    positions_to_close.append(pos)
                    continue
            
            # Check holding period
            if hasattr(pos['entry_date'], 'days'):
                days_held = pos['entry_date'].days
            else:
                # Calculate days between dates
                days_held = (current_date - pos['entry_date']).days
            
            if days_held >= request.hold_days:
                pnl = (current_price - pos['entry_price']) * pos['shares']
                trades.append({
                    'entry_date': str(pos['entry_date'])[:10],  # Format as YYYY-MM-DD
                    'entry_price': float(pos['entry_price']),
                    'exit_date': str(current_date)[:10],  # Format as YYYY-MM-DD
                    'exit_price': float(current_price),
                    'pattern': pos['pattern'],
                    'confidence': float(pos['confidence']),
                    'shares': int(pos['shares']),
                    'pnl': float(pnl),
                    'exit_reason': 'Time Exit'
                })
                capital += current_price * pos['shares']
                positions_to_close.append(pos)
        
        # Remove closed positions
        for pos in positions_to_close:
            if pos in open_positions:
                open_positions.remove(pos)
        
        # Check for new entry signals
        # Fix: Properly format current date as string
        current_date_str = current_date.strftime('%Y-%m-%d')
        signal = pattern_signals.get(current_date_str)
        
        if signal and len(open_positions) < request.max_open_trades:
            entry_price = float(ohlc_data['Open'].iloc[i])
            
            # Calculate position size
            if request.position_sizing == 'fixed_dollar':
                position_value = min(request.position_size_value, capital * 0.95)
            elif request.position_sizing == 'percent_capital':
                position_value = capital * (request.position_size_value / 100)
            else:  # Kelly or default
                position_value = capital * 0.05  # Simple fixed percentage
            
            shares = int(position_value / entry_price) if entry_price > 0 else 0
            if shares > 0 and capital > entry_price * shares:
                # Enter position
                capital -= entry_price * shares
                open_positions.append({
                    'entry_date': current_date,
                    'entry_price': entry_price,
                    'pattern': signal['type'],
                    'confidence': signal['confidence'],
                    'shares': shares
                })
        
        # Update equity curve
        open_position_value = sum(pos['shares'] * current_price for pos in open_positions)
        total_equity = capital + open_position_value
        # Fix: Properly format date as string
        equity_curve.append({
            'date': current_date.strftime('%Y-%m-%d'), 
            'equity': float(total_equity)
        })
        
        # Check max drawdown
        max_equity = max(max_equity, total_equity)
        if max_equity > 0:
            current_drawdown = (max_equity - total_equity) / max_equity * 100
            if current_drawdown > request.max_drawdown:
                break
    
    # Close all open positions
    if len(ohlc_data) > 0 and len(open_positions) > 0:
        final_price = float(ohlc_data['Close'].iloc[-1])
        final_date = ohlc_data['Date'].iloc[-1]
        for pos in open_positions[:]:  # Create a copy to avoid modification during iteration
            pnl = (final_price - pos['entry_price']) * pos['shares']
            trades.append({
                'entry_date': str(pos['entry_date'])[:10],  # Format as YYYY-MM-DD
                'entry_price': float(pos['entry_price']),
                'exit_date': str(final_date)[:10],  # Format as YYYY-MM-DD
                'exit_price': float(final_price),
                'pattern': pos['pattern'],
                'confidence': float(pos['confidence']),
                'shares': int(pos['shares']),
                'pnl': float(pnl),
                'exit_reason': 'End of Period'
            })
    
    return {
        'trades': trades,
        'equity_curve': equity_curve,
        'final_capital': capital + sum(pos['shares'] * final_price if 'final_price' in locals() else 0 for pos in open_positions),
        'total_trades': len(trades)
    }

def calculate_metrics(request: BacktestRequest, backtest_results: dict):
    """Calculate performance metrics"""
    if not backtest_results or not backtest_results['trades']:
        return {
            'starting_capital': request.capital,
            'final_capital': request.capital,
            'cumulative_return_pct': 0.0,
            'annualized_sharpe_ratio': 0.0,
            'max_drawdown_pct': 0.0,
            'win_rate_pct': 0.0,
            'number_of_trades': 0,
            'total_pnl': 0.0
        }
    
    trades = backtest_results['trades']
    equity_curve = backtest_results['equity_curve']
    starting_capital = request.capital
    final_capital = backtest_results['final_capital']
    
    # Calculate metrics
    if starting_capital > 0:
        cumulative_return = (final_capital - starting_capital) / starting_capital * 100
    else:
        cumulative_return = 0.0
    
    # Win rate
    if len(trades) > 0:
        winning_trades = sum(1 for t in trades if float(t['pnl']) > 0)
        win_rate = (winning_trades / len(trades) * 100)
    else:
        win_rate = 0.0
    
    # PnL calculations
    pnls = [float(t['pnl']) for t in trades]
    total_pnl = sum(pnls)
    
    # Max drawdown
    try:
        equity_values = [float(e['equity']) for e in equity_curve]
        if len(equity_values) > 0:
            peak = np.maximum.accumulate(equity_values)
            drawdown = [(equity_values[i] - peak[i]) / max(peak[i], 1e-10) for i in range(len(equity_values))]
            max_drawdown = abs(min(drawdown)) * 100 if len(drawdown) > 0 else 0
        else:
            max_drawdown = 0.0
    except:
        max_drawdown = 0.0
    
    # Sharpe ratio (simplified)
    if len(pnls) > 1 and starting_capital > 0:
        avg_return = np.mean(pnls) / starting_capital * 100
        std_return = np.std(pnls) / starting_capital * 100
        if std_return > 0:
            sharpe_ratio = (avg_return / std_return) * np.sqrt(252)
        else:
            sharpe_ratio = 0
    else:
        sharpe_ratio = 0
    
    return {
        'starting_capital': round(float(starting_capital), 2),
        'final_capital': round(float(final_capital), 2),
        'cumulative_return_pct': round(float(cumulative_return), 2) if not np.isnan(cumulative_return) else 0.0,
        'annualized_sharpe_ratio': round(float(sharpe_ratio), 2) if not np.isnan(sharpe_ratio) else 0.0,
        'max_drawdown_pct': round(float(max_drawdown), 2) if not np.isnan(max_drawdown) else 0.0,
        'win_rate_pct': round(float(win_rate), 2) if not np.isnan(win_rate) else 0.0,
        'number_of_trades': len(trades),
        'total_pnl': round(float(total_pnl), 2) if not np.isnan(total_pnl) else 0.0
    }

@app.post("/run-backtest", response_model=BacktestResponse)
async def run_backtest_endpoint(request: BacktestRequest):
    """Run backtest with all parameters in a single request"""
    # Validate strategy parameters
    if request.strategy_type == 'pattern' and not request.pattern:
        raise HTTPException(status_code=400, detail="Pattern is required for pattern strategy")
    
    if request.strategy_type == 'indicator' and not request.indicator:
        raise HTTPException(status_code=400, detail="Indicator is required for indicator strategy")
    
    if request.strategy_type == 'mixed' and (not request.pattern or not request.indicator):
        raise HTTPException(status_code=400, detail="Both pattern and indicator are required for mixed strategy")
    
    # Fetch data
    ohlc_data = fetch_stock_data(request.ticker, request.start_date, request.end_date)
    
    # Run backtest
    backtest_results = run_backtest(request, ohlc_data)
    
    # Calculate metrics
    metrics = calculate_metrics(request, backtest_results)
    
    # Return response
    return BacktestResponse(
        metrics=Metrics(**metrics),
        equity_curve=[EquityPoint(**point) for point in backtest_results['equity_curve']],
        trades=[Trade(**trade) for trade in backtest_results['trades']]
    )

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)