# Dubai Real Estate Quant Portfolio Engine

Repeat-sales price indices, Monte Carlo simulation, Markowitz optimization, VaR/CVaR risk, stress testing, backtesting, and PDF reporting for Dubai real estate communities.

## Stack
- **Backend**: FastAPI + pandas/numpy/scipy/statsmodels, Supabase (Postgres + Auth), Redis cache, Celery worker for DLD ingestion.
- **Frontend**: React + Vite + Tailwind, Recharts for charts, an animated Aurora WebGL background (React Bits).

## Local development

Backend:
```bash
cd backend
python -m venv .venv && . .venv/Scripts/activate  # Windows
pip install -r requirements.txt
cp ../.env.example ../.env   # fill in SUPABASE_URL / SUPABASE_SERVICE_KEY
uvicorn app.main:app --reload
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

Or run everything with Docker:
```bash
docker compose up --build
```

## Database
Apply `supabase/migrations/0001_init.sql` to your Supabase project (SQL editor or `supabase db push`). Load your Dubai Land Department transaction CSV into the `transactions` table.

## Deploying

- **Frontend → Vercel**: `vercel.json` builds `frontend/` and serves `frontend/dist`. Vercel is static-only — it does **not** host the FastAPI backend.
- **Backend → Render/Railway/Fly.io**: deploy `backend/Dockerfile` as a container service (needs Redis for caching + Celery). Point the frontend's `/api` proxy or `VITE_API_URL` at that backend's public URL.
