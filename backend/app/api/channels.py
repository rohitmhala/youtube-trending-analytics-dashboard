"""
Channels routes - powers the Channels page (rankings, search, pagination).
Real columns only: channel_analytics has no total_likes/total_comments.

All three routes below dedupe channel_analytics via ROW_NUMBER() before
aggregating/returning rows. This guards against the pipeline writing
more than one row per (channel_title, region) pair over time (e.g. an
append-on-each-run Glue job instead of an overwrite) - without this,
the same channel name shows up multiple times with different numbers,
and SUM()-based totals would double count.
"""

from fastapi import APIRouter
from app.services.athena_service import execute_query

router = APIRouter(prefix="/api", tags=["Channels"])


def region_where(region: str) -> str:
    if region.upper() == "ALL":
        return ""
    return f"WHERE LOWER(region) = '{region.lower()}'"


DEDUPE_CTE = """
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
    ),
    deduped AS (
        SELECT * FROM ranked WHERE rn = 1
    )
"""


@router.get("/channel-kpis")
def channel_kpis(region: str = "ALL"):
    where = region_where(region)

    query = f"""
    {DEDUPE_CTE.format(where=where)}
    SELECT
        SUM(total_views) AS total_views,
        SUM(total_videos) AS total_videos,
        COUNT(DISTINCT channel_title) AS active_channels,
        ROUND(AVG(avg_engagement_rate), 2) AS avg_engagement_rate
    FROM deduped
    """

    return execute_query(query)


@router.get("/channel-analysis")
def channel_analysis(region: str = "ALL"):
    """Full channel list - frontend handles search/sort/pagination client-side."""
    where = region_where(region)

    query = f"""
    {DEDUPE_CTE.format(where=where)}
    SELECT
        channel_title,
        region,
        total_views,
        total_videos,
        avg_engagement_rate,
        times_trending,
        rank_in_region,
        categories
    FROM deduped
    ORDER BY total_views DESC
    """

    return execute_query(query)


@router.get("/channel-scatter")
def channel_scatter(region: str = "ALL"):
    """
    channel_analytics has no total_likes/total_comments column, so this
    plots total_views against avg_engagement_rate instead, with total
    videos driving bubble size - all real columns. Used by both the
    Analytics page and the Channels page scatter charts.
    """
    where = region_where(region)

    query = f"""
    {DEDUPE_CTE.format(where=where)}
    SELECT
        channel_title,
        region,
        total_views,
        total_videos,
        avg_engagement_rate
    FROM deduped
    ORDER BY total_views DESC
    LIMIT 100
    """

    return execute_query(query)
