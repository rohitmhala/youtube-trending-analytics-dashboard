import logging
import pandas as pd
from pyathena import connect
from fastapi import HTTPException
from app.config.settings import (
    AWS_REGION,
    ATHENA_DATABASE,
    ATHENA_OUTPUT_LOCATION,
    ATHENA_WORKGROUP,
)

logger = logging.getLogger("athena_service")


def execute_query(query: str):
    """
    Runs a SQL query against Amazon Athena and returns the result as a
    list of plain dicts (JSON-serializable), ready to hand straight to
    the frontend.

    Any Athena/connection failure is logged and re-raised as a clean
    HTTP 502, instead of crashing the process or leaking a raw stack
    trace to the client.
    """
    try:
        conn = connect(
            region_name=AWS_REGION,
            schema_name=ATHENA_DATABASE,
            s3_staging_dir=ATHENA_OUTPUT_LOCATION,
            work_group=ATHENA_WORKGROUP,
        )

        df = pd.read_sql(query, conn)

        # Athena can return NaN for nulls, which is not valid JSON -
        # convert to None so the response always serializes cleanly.
        df = df.where(pd.notnull(df), None)

        return df.to_dict(orient="records")

    except Exception as exc:
        logger.error("Athena query failed: %s\nQuery was:\n%s", exc, query)
        raise HTTPException(
            status_code=502,
            detail=f"Athena query failed: {str(exc)}",
        )
