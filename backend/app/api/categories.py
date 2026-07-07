"""
Categories routes - powers the Category Analytics page (bar, donut, heatmap).

All numeric columns are wrapped in TRY_CAST(... AS DOUBLE). This is a
defensive guard: if the Gold layer ever wrote a numeric column as a
string (a common Glue/Spark quirk, e.g. "12.34" or "12.34%" stored as
varchar), a bare SUM()/AVG() on that column fails the entire query in
Athena and the API silently returns an empty result. TRY_CAST returns
NULL for anything it can't parse instead of erroring the whole query,
so real numeric data still comes through even if a few rows are odd.
"""

from fastapi import APIRouter
from app.services.athena_service import execute_query

router = APIRouter(prefix="/api", tags=["Categories"])


def region_where(region: str) -> str:
    if region.upper() == "ALL":
        return ""
    return f"WHERE LOWER(region) = '{region.lower()}'"


@router.get("/category-kpis")
def category_kpis(region: str = "ALL"):
    where = region_where(region)

    query = f"""
    SELECT
        COUNT(DISTINCT category_name) AS total_categories,
        SUM(TRY_CAST(total_views AS DOUBLE)) AS total_views,
        SUM(TRY_CAST(video_count AS DOUBLE)) AS total_videos,
        ROUND(AVG(TRY_CAST(avg_engagement_rate AS DOUBLE)), 2) AS avg_engagement_rate
    FROM category_analytics
    {where}
    """

    return execute_query(query)


@router.get("/category-region-heatmap")
def category_region_heatmap():
    """
    One row per (region, category) pair with average engagement - used to
    render a heatmap grid. No region filter here since the whole point of
    a heatmap is comparing across every region at once.
    """
    query = """
    SELECT
        region,
        category_name AS category,
        ROUND(AVG(TRY_CAST(avg_engagement_rate AS DOUBLE)), 2) AS avg_engagement_rate
    FROM category_analytics
    GROUP BY region, category_name
    ORDER BY region, category_name
    """

    return execute_query(query)
