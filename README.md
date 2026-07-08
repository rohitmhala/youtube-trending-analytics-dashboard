# 📊 YouTube Trending Analytics Dashboard

> End-to-End AWS Data Pipeline \| FastAPI \| React \| Amazon Athena

```{=html}
<p align="center">
```
`<a href="https://youtube-trending-analytics-dashboar.vercel.app/">`{=html}
`<img src="https://img.shields.io/badge/🚀_Live_Dashboard-Open-success?style=for-the-badge">`{=html}
`</a>`{=html}
`<a href="https://github.com/rohitmhala/youtube-trending-analytics-dashboard">`{=html}
`<img src="https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github">`{=html}
`</a>`{=html}
```{=html}
</p>
```
## Overview

This project implements a complete cloud analytics solution for YouTube
Trending data using a modern AWS data architecture.

-   Amazon S3 Data Lake
-   AWS Glue ETL (Bronze → Silver → Gold)
-   AWS Glue Data Catalog
-   Amazon Athena
-   FastAPI REST APIs
-   React + TypeScript Dashboard
-   Render + Vercel Deployment

## Live Demo

-   **Dashboard:**
    https://youtube-trending-analytics-dashboar.vercel.app/
-   **Backend:**
    https://youtube-trending-analytics-dashboard.onrender.com

## Architecture

``` text
Dataset
   │
   ▼
Amazon S3
   │
   ▼
AWS Glue ETL
Bronze → Silver → Gold
   │
   ▼
Glue Catalog
   │
   ▼
Athena
   │
   ▼
FastAPI
   │
   ▼
React Dashboard
```

## Dashboard

Create a folder named `docs` and save your screenshot as:

`docs/dashboard.png`

Then GitHub will render it:

``` markdown
![Dashboard](docs/dashboard.png)
```

## Features

-   Executive KPI Dashboard
-   Views & Likes Trend
-   Category Distribution
-   Analytics Dashboard
-   Channel Analytics
-   Region Analytics
-   Business Insights
-   Interactive Charts

## Tech Stack

### Frontend

-   React
-   TypeScript
-   Vite
-   Axios
-   Recharts

### Backend

-   FastAPI
-   Python
-   Pandas
-   PyAthena
-   Boto3

### AWS

-   Amazon S3
-   AWS Glue
-   AWS Glue Catalog
-   Amazon Athena
-   IAM
-   CloudWatch

### Deployment

-   Vercel
-   Render
-   GitHub

## API

-   GET /api/kpis
-   GET /api/views-trend
-   GET /api/category-distribution
-   GET /api/top-channels
-   GET /api/channels
-   GET /api/regions
-   GET /api/business-insights

## Folder Structure

``` text
backend/
frontend/
docs/
README.md
```

## Skills Demonstrated

-   Data Engineering
-   ETL Pipelines
-   AWS Cloud
-   SQL Analytics
-   Data Warehousing
-   FastAPI
-   React
-   Data Visualization
-   Business Intelligence

## Note

The backend is hosted on Render's free tier. The first request after
inactivity may take longer due to a cold start.

## Author

**Rohit Mhala**

-   GitHub: https://github.com/rohitmhala
-   Live Dashboard:
    https://youtube-trending-analytics-dashboar.vercel.app/

⭐ If you like this project, please give it a star.
