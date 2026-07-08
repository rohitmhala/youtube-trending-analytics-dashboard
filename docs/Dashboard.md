# Dashboard

A FastAPI + React application that queries the Gold layer live via Amazon
Athena — every chart, KPI, and table is a real SQL aggregation, nothing
mocked or pre-computed.

## Pages

| Page | Answers | Key visuals |
|---|---|---|
| **Dashboard** | How is trending content performing overall? | KPI strip, views/likes trend, category donut, top-channels bar chart, category view-share monitor, top channels table, insights |
| **Analytics** | Where is engagement strongest? | Views-vs-engagement scatter, category donut, engagement trend, category performance bar chart |
| **Channels** | Which channels matter most? | KPI cards, scatter, region comparison, searchable + paginated table |
| **Categories** | Which categories are winning, and where? | Donut, bar chart, category × region heatmap |
| **Regions** | How does performance vary by market? | Geographic map, region bar chart |
| **Settings** | What is this built on? | Live Athena connection info, Gold table names — read from real config |

## Data Model

**`trending_analytics`** — daily metrics per region
`region · trending_date_parsed · total_videos · total_views · total_likes · avg_views_per_video · avg_like_ratio · avg_engagement_rate · unique_channels · unique_categories`

**`channel_analytics`** — channel-level performance
`channel_title · region · total_videos · total_views · avg_engagement_rate · times_trending · rank_in_region · categories`

**`category_analytics`** — category breakdowns
`category_name · category_id · region · trending_date_parsed · video_count · total_views · total_likes · total_comments · avg_engagement_rate · unique_channels · view_share_pct`

Supported regions: `US · GB · CA · DE · FR · IN · JP · KR · MX · RU`

## API Reference

All endpoints are read-only GET requests, prefixed `/api`. Swagger UI is
available at `/docs` on the running backend.

| Endpoint | Page |
|---|---|
| `/kpis`, `/views-trend`, `/category-distribution`, `/top-channels`, `/business-insights`, `/regions` | Dashboard |
| `/analytics-kpis`, `/category-performance`, `/engagement-distribution`, `/channel-scatter`, `/analytics-insights` | Analytics |
| `/channel-kpis`, `/channel-analysis` | Channels |
| `/category-kpis`, `/category-region-heatmap` | Categories |
| `/region-performance` | Regions |
| `/system-info` | Settings |

## Local Setup

**Backend**
```bash
cd backend
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env    # fill in AWS region, Athena database, results bucket
uvicorn main:app --reload
```

**Frontend**
```bash
cd frontend
npm install
cp .env.example .env    # points at your local or deployed API URL
npm run dev
```

Visit `http://localhost:5173`.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | FastAPI, boto3, PyAthena, pandas, Uvicorn |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4, Recharts, Leaflet, React Router, Axios |
