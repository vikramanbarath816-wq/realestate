import pandas as pd
import numpy as np

def backtest_portfolio(index_data, allocation, rebalance_freq='M',
                       start_date=None, end_date=None, initial_capital=100000):
    df = pd.DataFrame(index_data).dropna()
    df = df.pct_change().dropna()
    if start_date:
        df = df[df.index >= start_date]
    if end_date:
        df = df[df.index <= end_date]
    weights = pd.Series(allocation)
    weights = weights / weights.sum()
    portfolio_returns = (df * weights).sum(axis=1)
    equity_curve = (1 + portfolio_returns).cumprod() * initial_capital
    return {
        "equity_curve": equity_curve.to_dict(),
        "annual_return": portfolio_returns.mean() * 12,
        "volatility": portfolio_returns.std() * np.sqrt(12),
        "max_drawdown": (equity_curve / equity_curve.cummax() - 1).min()
    }
