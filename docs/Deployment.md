# Deployment

## Current Live Setup

| Service | Platform | Notes |
|---|---|---|
| Frontend | Vercel | Auto-deploys from `main`, `frontend/` as root directory |
| Backend | Render | Free tier — spins down after inactivity, ~30-60s cold start |
| Data | AWS (S3, Glue, Athena) | Unaffected by frontend/backend redeploys |

## Environment Variables

**Backend** (`backend/.env`)
```
AWS_REGION=ap-south-1
ATHENA_DATABASE=your_database_name
ATHENA_OUTPUT_LOCATION=s3://your-athena-results-bucket/
ATHENA_WORKGROUP=primary
```

**Frontend** (`frontend/.env`)
```
VITE_API_BASE_URL=https://your-backend.onrender.com/api
```

## Deploying the Backend (Render)

1. New Web Service → connect this repo, root directory `backend`
2. Build command: `pip install -r requirements.txt`
3. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add the environment variables above
5. Ensure the deploy's IAM credentials (or attached role) can run Athena
   queries and read the Gold S3 bucket + Athena results bucket

## Deploying the Frontend (Vercel)

1. New Project → connect this repo, root directory `frontend`
2. Framework preset: Vite
3. Add `VITE_API_BASE_URL` pointing at the deployed backend
4. Deploy

## Updating the Pipeline

The AWS pipeline (`pipeline/`) is deployed independently via the AWS CLI /
Step Functions console — it's not part of the Vercel/Render deploy flow.
Redeploying the dashboard never touches the pipeline, and vice versa.
