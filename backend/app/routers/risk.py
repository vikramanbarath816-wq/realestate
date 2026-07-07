from fastapi import APIRouter
import numpy as np
import pandas as pd
from ..models.schemas import PortfolioRiskRequest
from ..services.data_loader import get_all_community_indices
from ..quant.correlation import compute_correlation_matrix
from ..quant.risk_metrics import portfolio_var

router = APIRouter(tags=["risk"])


@router.post("/portfolio-risk")
async def portfolio_risk(req: PortfolioRiskRequest):
    indices = await get_all_community_indices()
    communities = list(req.portfolio.keys())
    df = pd.DataFrame({c: indices[c] for c in communities}).dropna()
    log_returns = np.log(df / df.shift(1)).dropna()
    mu_dict = (log_returns.mean() * 12).to_dict()
    sigma_dict = (log_returns.std() * np.sqrt(12)).to_dict()
    corr_df = compute_correlation_matrix({c: indices[c] for c in communities})

    result = portfolio_var(
        req.portfolio, indices, mu_dict, sigma_dict, corr_df,
        req.investment_amount, req.horizon_years, req.n_simulations,
    )
    return result
