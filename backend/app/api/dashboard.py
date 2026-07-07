"""
Dashboard routes - powers the main "command center" overview page.

All queries here read ONLY from real Gold-layer columns as defined in the
pipeline README:

  trending_analytics: region, trending_date_parsed, total_videos, total_views,
                       total_likes, avg_views_per_video, avg_like_ratio,
                       avg_engagement_rate, unique_channels, unique_categories

  channel_analytics:  channel_title, region, total_videos, total_views,
                       avg_engagement_rate, times_trending, rank_in_region,
                       categories

  category_analytics: category, region, trending_date_parsed, video_count,
                       total_views, avg_engagement_rate, view_share_pct

No fabricated columns (no total_comments, peak_views, category_name -
those do not exist in the pipeline and have been removed).
"""

from fastapi import APIRouter
from app.services.athena_service import execute_query

router = APIRouter(prefix="/api", tags=["Dashboard"])


def region_where(region: str) -> str:
    """Builds a safe WHERE clause for the region filter, or none for ALL."""
    if region.upper() == "ALL":
        return ""
    return f"WHERE LOWER(region) = '{region.lower()}'"


# ============================================================
# Top KPI strip
# ============================================================
@router.get("/kpis")
def kpis(region: str = "ALL"):
    """
    Executive KPI strip. Sourced from trending_analytics, which already
    stores one aggregated row per region per day - so SUM() here gives a
    true cumulative total across the selected time range, and AVG() gives
    a genuine daily average (not a double-counted total).
    """
    where = region_where(region)

    query = f"""
    SELECT
        SUM(total_views)              AS total_views,
        SUM(total_likes)              AS total_likes,
        SUM(total_videos)             AS total_videos,
        ROUND(AVG(avg_engagement_rate), 2) AS avg_engagement_rate,
        ROUND(AVG(unique_channels), 0)     AS avg_unique_channels,
        ROUND(AVG(unique_categories), 0)   AS avg_unique_categories
    FROM trending_analytics
    {where}
    """

    return execute_query(query)


# ============================================================
# Views + Likes trend (line chart)
# ============================================================
@router.get("/views-trend")
def views_trend(region: str = "ALL"):
    where = region_where(region)

    query = f"""
    SELECT
        trending_date_parsed,
        SUM(total_views) AS total_views,
        SUM(total_likes) AS total_likes
    FROM trending_analytics
    {where}
    GROUP BY trending_date_parsed
    ORDER BY trending_date_parsed
    """

    return execute_query(query)


# ============================================================
# Category distribution (donut chart)
# ============================================================
@router.get("/category-distribution")
def category_distribution(region: str = "ALL"):
    """
    view_share_pct already exists as a real pre-computed column in the
    Gold layer, so we average it directly instead of re-deriving a
    percentage on the frontend.

    Real column is category_name (confirmed via DESCRIBE category_analytics),
    aliased to `category` here so the frontend response shape is unchanged.
    """
    where = region_where(region)

    query = f"""
    SELECT
        category_name AS category,
        SUM(TRY_CAST(total_views AS DOUBLE)) AS total_views,
        ROUND(AVG(TRY_CAST(view_share_pct AS DOUBLE)), 2) AS view_share_pct
    FROM category_analytics
    {where}
    GROUP BY category_name
    ORDER BY total_views DESC
    LIMIT 8
    """

    return execute_query(query)


# ============================================================
# Top 10 channels table
# ============================================================
@router.get("/top-channels")
def top_channels(region: str = "ALL"):
    """
    channel_analytics can contain more than one row per (channel_title,
    region) pair - e.g. if the pipeline appends a new snapshot on each
    scheduled run instead of overwriting. ROW_NUMBER() picks a single
    consistent row per channel+region (the one with the highest
    total_views, treated as the most complete/recent snapshot) instead
    of showing the same channel name multiple times.
    """
    where = region_where(region)

    query = f"""
    WITH ranked AS (
        SELECT
            channel_title,
            region,
            total_views,
            total_videos,
            avg_engagement_rate,
            times_trending,
            rank_in_region,
            categories,
            ROW_NUMBER() OVER (
                PARTITION BY channel_title, region
                ORDER BY total_views DESC
            ) AS rn
        FROM channel_analytics
        {where}
    )
    SELECT
        channel_title,
        region,
        total_views,
        total_videos,
        avg_engagement_rate,
        times_trending,
        rank_in_region,
        categories
    FROM ranked
    WHERE rn = 1
    ORDER BY total_views DESC
    LIMIT 10
    """

    return execute_query(query)


# ============================================================
# Business insights panel
# ============================================================
@router.get("/business-insights")
def business_insights(region: str = "ALL"):
    where = region_where(region)

    top_channel = execute_query(f"""
        SELECT channel_title, total_views
        FROM channel_analytics
        {where}
        ORDER BY total_views DESC
        LIMIT 1
    """)

    top_category = execute_query(f"""
        SELECT category_name AS category, SUM(total_views) AS total_views
        FROM category_analytics
        {where}
        GROUP BY category_name
        ORDER BY total_views DESC
        LIMIT 1
    """)

    top_region = execute_query(f"""
        SELECT region, SUM(total_views) AS total_views
        FROM trending_analytics
        GROUP BY region
        ORDER BY total_views DESC
        LIMIT 1
    """)

    engagement = execute_query(f"""
        SELECT ROUND(AVG(avg_engagement_rate), 2) AS avg_engagement_rate
        FROM trending_analytics
        {where}
    """)

    return {
        "top_channel": top_channel[0] if top_channel else {},
        "top_category": top_category[0] if top_category else {},
        "top_region": top_region[0] if top_region else {},
        "engagement": engagement[0] if engagement else {},
    }


# ============================================================
# Region list (used to populate filter dropdowns)
# ============================================================
@router.get("/regions")
def regions():
    query = """
    SELECT DISTINCT region
    FROM trending_analytics
    ORDER BY region
    """

    return execute_query(query)
