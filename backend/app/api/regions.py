"""
Regions routes - powers the Regional Analytics page.
"""

from fastapi import APIRouter
from app.services.athena_service import execute_query

router = APIRouter(prefix="/api", tags=["Regions"])


@router.get("/region-performance")
def region_performance():
    """
    Sourced from trending_analytics (the daily per-region aggregate table)
    rather than channel_analytics, since it already carries total_likes
    and unique_channels alongside total_views.
    """
    query = """
    SELECT
        region,
        SUM(total_views) AS total_views,
        SUM(total_likes) AS total_likes,
        SUM(total_videos) AS total_videos,
        ROUND(AVG(unique_channels), 0) AS avg_unique_channels,
        ROUND(AVG(avg_engagement_rate), 2) AS avg_engagement_rate
    FROM trending_analytics
    GROUP BY region
    ORDER BY total_views DESC
    """

    return execute_query(query)
