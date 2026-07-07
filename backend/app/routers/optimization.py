from fastapi import APIRouter
import numpy as np
from ..models.schemas import OptimizationRequest
from ..services.data_loader import get_all_community_indices
from ..quant.optimization import efficient_frontier_points, optimal_for_risk

router = APIRouter(tags=["optimization"])


async def _expected_returns_and_cov():
    indices = await get_all_community_indices()
    communities = list(indices.keys())
    import pandas as pd
    df = pd.DataFrame(indices).dropna()
    log_returns = np.log(df / df.shift(1)).dropna()
    expected_returns = log_returns.mean().values * 12
    cov_matrix = log_returns.cov().values * 12
    return communities, expected_returns, cov_matrix


@router.get("/efficient-frontier")
async def efficient_frontier():
    communities, expected_returns, cov_matrix = await _expected_returns_and_cov()
    frontier = efficient_frontier_points(expected_returns, cov_matrix)
    return {"communities": communities, "frontier": frontier}


@router.post("/optimize")
async def optimize(req: OptimizationRequest):
    communities, expected_returns, cov_matrix = await _expected_returns_and_cov()
    result = optimal_for_risk(expected_returns, cov_matrix, req.risk_tolerance, communities)
    return result
