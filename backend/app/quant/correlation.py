import pandas as pd
import numpy as np

def compute_correlation_matrix(indices: dict[str, pd.Series]) -> pd.DataFrame:
    df = pd.DataFrame(indices).dropna()
    log_returns = np.log(df / df.shift(1)).dropna()
    return log_returns.corr()

def rolling_correlation(indices, window=24):
    df = pd.DataFrame(indices).dropna()
    returns = np.log(df / df.shift(1)).dropna()
    return returns.rolling(window).corr().dropna()
