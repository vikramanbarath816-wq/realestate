from fastapi import APIRouter
from ..models.schemas import BacktestRequest
from ..services.data_loader import get_all_community_indices
from ..quant.backtest import backtest_portfolio

router = APIRouter(tags=["backtest"])


@router.post("/backtest")
async def backtest(req: BacktestRequest):
    indices = await get_all_community_indices()
    selected = {c: indices[c] for c in req.portfolio.keys()}
    result = backtest_portfolio(
        selected, req.portfolio,
        rebalance_freq=req.rebalance_freq,
        start_date=req.start_date, end_date=req.end_date,
    )
    return result
