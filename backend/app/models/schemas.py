from pydantic import BaseModel, Field
from typing import Dict, List, Optional

class SimulationRequest(BaseModel):
    community: str
    horizon_months: int = 36
    n_simulations: int = 5000

class OptimizationRequest(BaseModel):
    risk_tolerance: float = Field(..., ge=0, le=1)

class PortfolioRiskRequest(BaseModel):
    portfolio: Dict[str, float]
    investment_amount: float
    horizon_years: float = 1.0
    n_simulations: int = 10000

class StressTestRequest(BaseModel):
    portfolio: Dict[str, float]
    shock_scenario: Dict[str, float]  # community -> fractional shock (e.g., -0.3)
    investment_amount: float

class BacktestRequest(BaseModel):
    portfolio: Dict[str, float]
    rebalance_freq: str = "monthly"  # monthly, quarterly, yearly
    start_date: Optional[str] = None
    end_date: Optional[str] = None

class SavedPortfolio(BaseModel):
    name: str
    allocation: Dict[str, float]
    investment_amount: float
