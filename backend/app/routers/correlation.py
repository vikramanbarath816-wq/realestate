from fastapi import APIRouter
from ..services.data_loader import get_all_community_indices
from ..quant.correlation import compute_correlation_matrix

router = APIRouter(tags=["correlation"])


@router.get("/correlation-matrix")
async def correlation_matrix():
    indices = await get_all_community_indices()
    corr = compute_correlation_matrix(indices)
    return {"communities": corr.columns.tolist(), "matrix": corr.values.tolist()}
