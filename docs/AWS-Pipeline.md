# AWS Data Pipeline

The data engineering layer of this platform: a medallion-architecture ETL
pipeline that ingests, cleans, and aggregates YouTube trending data across
10 regions, entirely on AWS.

## Data Flow

**Bronze (raw)** — an ingestion Lambda pulls the top 50 trending videos per
region from the YouTube Data API v3, plus category ID mappings. Stored as raw
JSON in S3, partitioned by region/date/hour. Historical Kaggle CSV data can
also be backfilled into this layer.

**Silver (cleansed)** — a Glue PySpark job enforces schema across both the
API and Kaggle sources, casts types, standardizes regions, deduplicates to
the latest record per video/region/date, and derives `like_ratio` and
`engagement_rate`. A parallel Lambda normalizes category JSON to Parquet.
Output: Snappy-compressed Parquet, partitioned by region.

**Data Quality Gate** — before anything reaches Gold, a Lambda validates:

| Check | Threshold |
|---|---|
| Row count | ≥ 10 |
| Null percentage (critical columns) | ≤ 5% |
| Schema | Required columns present |
| Value ranges | Views sanity check |
| Freshness | < 48 hours |

A failure halts the pipeline and sends an SNS alert — Gold aggregation never
runs on bad data.

**Gold (business-ready)** — a second Glue job produces three aggregated
tables (`trending_analytics`, `channel_analytics`, `category_analytics`),
registered in the Glue Data Catalog and queryable via Athena. Full column
definitions are in [`Dashboard.md`](Dashboard.md#data-model).

## Orchestration

AWS Step Functions runs the full pipeline on an EventBridge schedule, with
retry logic (3 attempts, exponential backoff), parallel Silver-layer
transforms, and CloudWatch logging at every step.

## Tech Stack

| Component | Technology |
|---|---|
| Compute | AWS Lambda, AWS Glue (PySpark) |
| Storage | Amazon S3 (Parquet, Snappy) |
| Orchestration | AWS Step Functions |
| Scheduling | Amazon EventBridge |
| Metadata | AWS Glue Data Catalog |
| Query Engine | Amazon Athena |
| Alerting | Amazon SNS |
| Monitoring | Amazon CloudWatch |

## Project Files

See [`../pipeline/`](../pipeline/) for the actual Lambda and Glue job source
code.
