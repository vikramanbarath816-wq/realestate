from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from ..database import get_supabase
from ..models.schemas import SavedPortfolio

router = APIRouter(tags=["auth"])


class Credentials(BaseModel):
    email: str
    password: str


@router.post("/auth/signup")
async def signup(creds: Credentials):
    supabase = get_supabase()
    try:
        resp = supabase.auth.sign_up({"email": creds.email, "password": creds.password})
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    return {"user": resp.user.id if resp.user else None, "session": bool(resp.session)}


@router.post("/auth/login")
async def login(creds: Credentials):
    supabase = get_supabase()
    try:
        resp = supabase.auth.sign_in_with_password({"email": creds.email, "password": creds.password})
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
    return {
        "access_token": resp.session.access_token if resp.session else None,
        "user": resp.user.id if resp.user else None,
    }


def _user_id_from_token(authorization: str | None):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")
    supabase = get_supabase()
    token = authorization.replace("Bearer ", "")
    user = supabase.auth.get_user(token)
    if not user or not user.user:
        raise HTTPException(status_code=401, detail="Invalid session")
    return user.user.id


@router.post("/portfolio/save")
async def save_portfolio(portfolio: SavedPortfolio, authorization: str | None = Header(default=None)):
    user_id = _user_id_from_token(authorization)
    supabase = get_supabase()
    resp = supabase.table("saved_portfolios").insert({
        "user_id": user_id,
        "name": portfolio.name,
        "allocation": portfolio.allocation,
        "investment_amount": portfolio.investment_amount,
    }).execute()
    return {"saved": True, "data": resp.data}


@router.get("/portfolio/list")
async def list_portfolios(authorization: str | None = Header(default=None)):
    user_id = _user_id_from_token(authorization)
    supabase = get_supabase()
    resp = supabase.table("saved_portfolios").select("*").eq("user_id", user_id).execute()
    return {"portfolios": resp.data}
