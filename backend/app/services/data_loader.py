import pandas as pd
from ..database import get_supabase
from ..services.cache_service import get_cache, set_cache

async def get_community_transactions(community: str):
    supabase = get_supabase()
    resp = supabase.table("transactions").select("*").eq("community", community).execute()
    return pd.DataFrame(resp.data)

async def get_or_compute_index(community: str):
    cached = await get_cache(f"index:{community}")
    if cached:
        return pd.Series(cached["index"]).sort_index()
    df = await get_community_transactions(community)
    df["property_id"] = df["community"] + "_" + df["area_sqft"].astype(str)
    df["transaction_date"] = pd.to_datetime(df["transaction_date"])
    from ..quant.repeat_sales import build_repeat_sales_index
    index = build_repeat_sales_index(df)
    await set_cache(f"index:{community}", {"index": {str(d.date()): v for d, v in index.items()}})
    return index

async def get_all_community_indices():
    supabase = get_supabase()
    resp = supabase.table("transactions").select("community").execute()
    communities = pd.DataFrame(resp.data)["community"].unique()
    indices = {}
    for c in communities:
        idx = await get_or_compute_index(c)
        indices[c] = idx
    return indices
