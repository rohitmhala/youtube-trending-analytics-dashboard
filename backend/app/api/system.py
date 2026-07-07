"""
System routes - powers the Settings page with real configuration info
(read from environment variables, not hardcoded/fabricated).
"""

from fastapi import APIRouter
from app.config.settings import AWS_REGION, ATHENA_DATABASE, ATHENA_WORKGROUP

router = APIRouter(prefix="/api", tags=["System"])


@router.get("/system-info")
def system_info():
    """
    Returns the actual configured AWS/Athena connection details this
    backend is using, plus a static description of the pipeline
    architecture (from the project README) for the Settings page.
    """
    return {
        "aws_region": AWS_REGION,
        "athena_database": ATHENA_DATABASE,
        "athena_workgroup": ATHENA_WORKGROUP,
        "gold_tables": [
            "trending_analytics",
            "channel_analytics",
            "category_analytics",
        ],
        "architecture": [
            "YouTube Data API v3 + Kaggle historical dataset",
            "AWS Lambda - ingestion",
            "Amazon S3 - Bronze / Silver / Gold (Medallion Architecture)",
            "AWS Glue (PySpark) - transformations",
            "AWS Step Functions - orchestration",
            "Amazon Athena - query engine (this dashboard's data source)",
            "AWS Glue Data Catalog - table metadata",
        ],
    }
