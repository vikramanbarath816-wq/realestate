def liquidity_score(transactions_df):
    monthly = transactions_df.set_index('transaction_date').resample('M').size()
    return monthly.mean()
