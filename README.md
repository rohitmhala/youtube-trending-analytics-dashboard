# YouTube Trending Analytics Dashboard

A live analytics dashboard built on top of an AWS Medallion Architecture
YouTube data pipeline (Bronze -> Silver -> Gold), queried live through
Amazon Athena. No mock/fake data - every chart, KPI, and table reads
directly from the real Gold-layer tables:

- `trending_analytics`
- `channel_analytics`
- `category_analytics`

> Full architecture documentation and deployment guide will be completed
> in a later phase. This README covers running the project locally.

## Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- AWS credentials configured locally (`aws configure`) with permission
  to run Athena queries and read the Gold S3 bucket + Athena results bucket
- Your Athena Gold database already populated (this dashboard does not
  run the pipeline itself - it only reads from it)

## 1. Backend setup (FastAPI)

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

Copy `.env.example` to `.env` and fill in your real values (region,
Athena database name, Athena results bucket, workgroup):

```bash
cp .env.example .env
```

Run the backend:

```bash
uvicorn main:app --reload
```

Visit `http://127.0.0.1:8000` - you should see:
```json
{"status": "running", "message": "YouTube Analytics API"}
```

## 2. Frontend setup (React + Vite)

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`.

By default the frontend talks to `http://127.0.0.1:8000/api` (set in
`frontend/.env` via `VITE_API_BASE_URL`). Change this before deploying
to point at your deployed API Gateway URL instead.

## Project structure

```
youtube-live-dashboard/
├── backend/
│   ├── app/
│   │   ├── api/          # One route file per dashboard page
│   │   ├── services/     # Athena query execution
│   │   └── config/       # Environment-driven settings
│   ├── main.py
│   └── requirements.txt
│
└── frontend/
    └── src/
        ├── pages/         # One page per dashboard (Dashboard, Analytics,
        │                    Channels, Categories, Regions, Settings)
        ├── components/    # Charts, tables, KPI cards, layout
        ├── context/       # Region filter state
        └── services/      # Axios client for the backend API
```

## Notes on data accuracy

Every number shown in this dashboard is either a direct column from the
Gold layer or a genuine SQL aggregation (`SUM`, `AVG`, `MAX`, `COUNT`) of
those columns - there are no hardcoded or placeholder values in any
chart, table, or KPI card. The one exception is the "Regions" map, where
marker *positions* use real-world capital city coordinates as a
reference (not business data) - the size/color of each marker is driven
entirely by live `total_views`/`avg_engagement_rate` from Athena.
