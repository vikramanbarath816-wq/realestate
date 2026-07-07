from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import index, simulation, correlation, optimization, risk, backtest, stress, reports, auth

app = FastAPI(title="Dubai Real Estate Quant Engine")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

app.include_router(index.router)
app.include_router(simulation.router)
app.include_router(correlation.router)
app.include_router(optimization.router)
app.include_router(risk.router)
app.include_router(backtest.router)
app.include_router(stress.router)
app.include_router(reports.router)
app.include_router(auth.router)


@app.get("/")
async def root():
    return {"status": "ok", "service": "dubai-quant-engine"}
