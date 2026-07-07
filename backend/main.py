from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.dashboard import router as dashboard_router
from app.api.analytics import router as analytics_router
from app.api.channels import router as channels_router
from app.api.regions import router as regions_router
from app.api.categories import router as categories_router
from app.api.system import router as system_router

app = FastAPI(title="YouTube Analytics API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard_router)
app.include_router(analytics_router)
app.include_router(channels_router)
app.include_router(regions_router)
app.include_router(categories_router)
app.include_router(system_router)


@app.get("/")
def root():
    return {
        "status": "running",
        "message": "YouTube Analytics API",
    }
