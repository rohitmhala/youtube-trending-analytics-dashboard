"""
Analytics routes - powers the deeper "Advanced Analytics" page.

Real columns only (see dashboard.py header for the full schema reference).
"""

from fastapi import APIRouter
from app.services.athena_service import execute_query

router = APIRouter(prefix="/api", tags=["Analytics"])


def region_where(region: str) -> str:
    if region.upper() == "ALL":
        return ""
    return f"WHERE LOWER(region) = '{region.lower()}'"


# ============================================================
# Analytics KPI strip
# ============================================================
@router.get("/analytics-kpis")
def analytics_kpis(region: str = "ALL"):
    """
    All four metrics come straight from trending_analytics, which already
    stores these as per-region-per-day aggregates in the Gold layer.
    """
    where = region_where(region)

    query = f"""
    SELECT
        ROUND(AVG(avg_views_per_video), 0) AS avg_views_per_video,
        ROUND(AVG(avg_engagement_rate), 2) AS avg_engagement_rate,
        ROUND(AVG(avg_like_ratio), 4)      AS avg_like_ratio,
        ROUND(AVG(unique_categories), 0)   AS avg_unique_categories
    FROM trending_analytics
    {where}
    """

    return execute_query(query)


# ============================================================
# Category performance (horizontal bar chart)
# ============================================================
@router.get("/category-performance")
def category_performance(region: str = "ALL"):
    where = region_where(region)

    query = f"""
    SELECT
        category_name AS category,
        ROUND(AVG(TRY_CAST(avg_engagement_rate AS DOUBLE)), 2) AS avg_engagement_rate,
        SUM(TRY_CAST(total_views AS DOUBLE)) AS total_views,
        SUM(TRY_CAST(video_count AS DOUBLE)) AS video_count
    FROM category_analytics
    {where}
    GROUP BY category_name
    ORDER BY avg_engagement_rate DESC
    """

    return execute_query(query)


# ============================================================
# Engagement trend over time (bar chart)
# ============================================================
@router.get("/engagement-distribution")
def engagement_distribution(region: str = "ALL"):
    where = region_where(region)

    query = f"""
    SELECT
        trending_date_parsed,
        ROUND(AVG(avg_engagement_rate), 2) AS avg_engagement_rate
    FROM trending_analytics
    {where}
    GROUP BY trending_date_parsed
    ORDER BY trending_date_parsed
    """

    return execute_query(query)


# ============================================================
# Analytics insights panel
# ============================================================
@router.get("/analytics-insights")
def analytics_insights(region: str = "ALL"):
    where = region_where(region)

    top_channel = execute_query(f"""
        SELECT channel_title, total_views
        FROM channel_analytics
        {where}
        ORDER BY total_views DESC
        LIMIT 1
    """)

    top_category = execute_query(f"""
        SELECT category_name AS category, AVG(avg_engagement_rate) AS engagement
        FROM category_analytics
        {where}
        GROUP BY category_name
        ORDER BY engagement DESC
        LIMIT 1
    """)

    # "Peak day views" = the single highest daily total_views recorded,
    # a genuine value from trending_analytics (not a fabricated column).
    peak = execute_query(f"""
        SELECT MAX(total_views) AS peak_day_views
        FROM trending_analytics
        {where}
    """)

    trending = execute_query(f"""
        SELECT SUM(times_trending) AS times_trending
        FROM channel_analytics
        {where}
    """)

    return {
        "top_channel": top_channel[0] if top_channel else {},
        "top_category": top_category[0] if top_category else {},
        "peak": peak[0] if peak else {},
        "trending": trending[0] if trending else {},
    }
