import numpy as np
import pandas as pd
import statsmodels.api as sm
from scipy.sparse import csr_matrix

class InsufficientDataError(Exception):
    pass

def build_repeat_sales_index(df: pd.DataFrame) -> pd.Series:
    df = df.sort_values(["property_id", "transaction_date"])
    df["prev_price"] = df.groupby("property_id")["transaction_price"].shift(1)
    df["prev_date"] = df.groupby("property_id")["transaction_date"].shift(1)
    pairs = df.dropna(subset=["prev_price", "prev_date"]).copy()
    pairs["log_return"] = np.log(pairs["transaction_price"] / pairs["prev_price"])
    if len(pairs) < 10:
        raise InsufficientDataError("Less than 10 repeat-sales pairs.")
    all_months = pd.date_range(df["transaction_date"].min().to_period("M").to_timestamp(),
                                df["transaction_date"].max().to_period("M").to_timestamp(), freq="MS")
    month_to_idx = {m: i for i, m in enumerate(all_months)}
    n_pairs, n_months = len(pairs), len(all_months)
    rows, cols, data = [], [], []
    for i, (_, pair) in enumerate(pairs.iterrows()):
        t2 = pair["transaction_date"].to_period("M").to_timestamp()
        t1 = pair["prev_date"].to_period("M").to_timestamp()
        rows.extend([i, i])
        cols.extend([month_to_idx[t2], month_to_idx[t1]])
        data.extend([1, -1])
    X = csr_matrix((data, (rows, cols)), shape=(n_pairs, n_months))
    X_red = X[:, 1:].toarray()
    model = sm.OLS(pairs["log_return"].values, X_red).fit()
    betas = np.insert(model.params, 0, 0.0)
    log_index = np.cumsum(betas)
    level = np.exp(log_index)
    level = level / level[0] * 100.0
    return pd.Series(level, index=all_months, name="price_index")
