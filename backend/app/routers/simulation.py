from fastapi import APIRouter, HTTPException
import numpy as np
from ..models.schemas import SimulationRequest
from ..services.data_loader import get_or_compute_index
from ..quant.monte_carlo import simulate_gbm, percentile_bands

router = APIRouter(tags=["simulation"])


@router.post("/simulate")
async def simulate(req: SimulationRequest):
    try:
        series = await get_or_compute_index(req.community)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

    returns = np.log(series / series.shift(1)).dropna()
    mu = returns.mean() * 12
    sigma = returns.std() * np.sqrt(12)
    S0 = float(series.iloc[-1])

    paths = simulate_gbm(S0, mu, sigma, T=req.horizon_months / 12,
                          steps=req.horizon_months, n_sim=req.n_simulations)
    bands = percentile_bands(paths)
    return {
        "community": req.community,
        "initial_value": S0,
        "annualized_return": mu,
        "annualized_volatility": sigma,
        "percentile_bands": bands,
    }
