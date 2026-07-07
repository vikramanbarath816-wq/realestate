from fastapi import APIRouter, HTTPException
from ..services.data_loader import get_or_compute_index, get_all_community_indices

router = APIRouter(prefix="/index", tags=["index"])


@router.get("/{community}")
async def get_index(community: str):
    try:
        series = await get_or_compute_index(community)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
    return {"community": community, "index": {str(d.date()): v for d, v in series.items()}}


@router.get("")
async def get_all_indices():
    indices = await get_all_community_indices()
    return {c: {str(d.date()): v for d, v in s.items()} for c, s in indices.items()}
