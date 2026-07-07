import numpy as np
from scipy.optimize import minimize

def efficient_frontier_points(expected_returns, cov_matrix, n_points=50):
    n = len(expected_returns)
    constraints = ({'type': 'eq', 'fun': lambda w: np.sum(w) - 1})
    bounds = [(0, 1) for _ in range(n)]
    x0 = np.ones(n) / n
    res_min = minimize(lambda w: w @ cov_matrix @ w, x0, bounds=bounds, constraints=constraints, method='SLSQP')
    min_vol = np.sqrt(res_min.fun)
    min_ret = res_min.x @ expected_returns
    max_ret = np.max(expected_returns)
    targets = np.linspace(min_ret, max_ret, n_points)
    frontier = []
    for t in targets:
        cons = ({'type': 'eq', 'fun': lambda w: np.sum(w) - 1},
                {'type': 'eq', 'fun': lambda w: w @ expected_returns - t})
        res = minimize(lambda w: w @ cov_matrix @ w, x0, bounds=bounds, constraints=cons, method='SLSQP')
        if res.success:
            frontier.append({'risk': np.sqrt(res.fun), 'return': t, 'weights': res.x.tolist()})
    return frontier

def optimal_for_risk(expected_returns, cov_matrix, risk_tolerance, community_names):
    frontier = efficient_frontier_points(expected_returns, cov_matrix, n_points=200)
    risks = [p['risk'] for p in frontier]
    min_risk, max_risk = min(risks), max(risks)
    target = min_risk + (max_risk - min_risk) * risk_tolerance
    idx = np.argmin(np.abs(np.array(risks) - target))
    point = frontier[idx]
    alloc = {community_names[i]: w for i, w in enumerate(point['weights']) if w > 1e-6}
    return {'allocation': alloc, 'expected_return': point['return'], 'expected_volatility': point['risk']}
