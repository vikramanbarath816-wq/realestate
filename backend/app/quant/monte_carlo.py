import numpy as np

def simulate_gbm(S0, mu, sigma, T, steps, n_sim=5000):
    dt = T / steps
    Z = np.random.normal(0, 1, (n_sim, steps))
    log_returns = (mu - 0.5*sigma**2)*dt + sigma*np.sqrt(dt)*Z
    log_returns = np.concatenate([np.zeros((n_sim,1)), log_returns], axis=1)
    return S0 * np.exp(np.cumsum(log_returns, axis=1))

def percentile_bands(paths, percentiles=[5,25,50,75,95]):
    return {p: np.percentile(paths, p, axis=0).tolist() for p in percentiles}

def correlated_portfolio_simulation(initial_prices, mu_vec, sigma_vec, corr, weights,
                                    T, steps, n_sim=10000):
    n = len(weights)
    cov = np.outer(sigma_vec, sigma_vec) * corr
    L = np.linalg.cholesky(cov)
    dt = T / steps
    Z = np.random.normal(0, 1, (n_sim, n, steps))
    dW = np.einsum('ij,kjl->kil', L, Z) * np.sqrt(dt)
    drift = (mu_vec - 0.5*sigma_vec**2) * dt
    log_returns = drift + dW
    cum_log = np.concatenate([np.zeros((n_sim,n,1)), np.cumsum(log_returns, axis=2)], axis=2)
    asset_paths = initial_prices[np.newaxis,:,np.newaxis] * np.exp(cum_log)
    portfolio_value = np.tensordot(asset_paths, weights, axes=([1],[0]))
    return portfolio_value
