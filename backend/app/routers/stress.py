from fastapi import APIRouter
from ..models.schemas import StressTestRequest

router = APIRouter(tags=["stress"])


@router.post("/stress-test")
async def stress_test(req: StressTestRequest):
    shocked_value = 0.0
    breakdown = {}
    for community, weight in req.portfolio.items():
        shock = req.shock_scenario.get(community, 0.0)
        allocation_value = req.investment_amount * weight
        new_value = allocation_value * (1 + shock)
        breakdown[community] = {
            "allocation_value": allocation_value,
            "shock": shock,
            "value_after_shock": new_value,
            "loss": new_value - allocation_value,
        }
        shocked_value += new_value

    return {
        "investment_amount": req.investment_amount,
        "value_after_shock": shocked_value,
        "total_pnl": shocked_value - req.investment_amount,
        "breakdown": breakdown,
    }
