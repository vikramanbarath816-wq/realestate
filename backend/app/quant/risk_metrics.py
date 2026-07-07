import numpy as np
from .monte_carlo import correlated_portfolio_simulation

def portfolio_var(portfolio, index_data, mu_dict, sigma_dict, corr_df,
                  investment, horizon_years=1, n_sim=10000):
    communities = list(portfolio.keys())
    weights = np.array([portfolio[c] for c in communities])
    S0 = np.array([index_data[c].iloc[-1] for c in communities])
    mu = np.array([mu_dict[c] for c in communities])
    sigma = np.array([sigma_dict[c] for c in communities])
    corr = corr_df.loc[communities, communities].values
    portfolio_paths = correlated_portfolio_simulation(S0, mu, sigma, corr, weights, T=horizon_years,
                                                      steps=int(horizon_years*12), n_sim=n_sim)
    terminal_values = portfolio_paths[:, -1]
    PnL = (terminal_values / S0 @ weights) * investment - investment
    var_95 = np.percentile(PnL, 5)
    cvar_95 = PnL[PnL <= var_95].mean() if np.any(PnL <= var_95) else var_95
    var_99 = np.percentile(PnL, 1)
    cvar_99 = PnL[PnL <= var_99].mean() if np.any(PnL <= var_99) else var_99
    return {"var_95": var_95, "cvar_95": cvar_95, "var_99": var_99, "cvar_99": cvar_99,
            "horizon_years": horizon_years, "investment_amount": investment}

def max_drawdown(series):
    cumulative = (1 + series).cumprod()
    peak = cumulative.expanding().max()
    dd = (cumulative - peak) / peak
    return dd.min()

def sharpe_ratio(returns, rf=0.0, periods=12):
    excess = returns - rf/periods
    return excess.mean() / excess.std() * np.sqrt(periods)

def sortino_ratio(returns, rf=0.0, periods=12):
    excess = returns - rf/periods
    downside = excess[excess < 0].std()
    return excess.mean() / downside * np.sqrt(periods) if downside != 0 else 0
