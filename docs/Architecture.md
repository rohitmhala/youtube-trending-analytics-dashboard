# Architecture

## Data Pipeline

```mermaid
flowchart LR
    subgraph Sources
        A1[YouTube Data API v3]
        A2[Kaggle Historical Dataset]
    end

    subgraph Bronze["Bronze — Raw"]
        B1[(S3: Raw JSON / CSV)]
    end

    subgraph Silver["Silver — Cleansed"]
        C1[Glue PySpark: Schema + Dedup]
        C2[(S3: Parquet)]
    end

    subgraph Quality["Data Quality Gate"]
        D1[Lambda: Row count, nulls, schema, freshness checks]
        D2[SNS Alert on failure]
    end

    subgraph Gold["Gold — Business Aggregates"]
        E1[Glue PySpark: Aggregations]
        E2[(trending_analytics)]
        E3[(channel_analytics)]
        E4[(category_analytics)]
    end

    F[Amazon Athena]
    G[Glue Data Catalog]

    A1 --> B1
    A2 --> B1
    B1 --> C1 --> C2
    C2 --> D1
    D1 -- fail --> D2
    D1 -- pass --> E1
    E1 --> E2 & E3 & E4
    E2 & E3 & E4 --> F
    G -.metadata.-> F

    H[AWS Step Functions] -. orchestrates .-> B1
    H -. orchestrates .-> C1
    H -. orchestrates .-> D1
    H -. orchestrates .-> E1
```

## Analytics Application

```mermaid
flowchart LR
    A[Amazon Athena] --> B[FastAPI Backend]
    B --> C[React + TypeScript Frontend]
    C --> D[Analyst / Stakeholder]

    B -. hosted on .-> E[Render]
    C -. hosted on .-> F[Vercel]
```

The backend exists for one reason: Athena needs AWS credentials to run
queries, and those credentials should never reach the browser. FastAPI is a
stateless query executor — every request runs real SQL against Athena and
returns clean JSON, so the dashboard always reflects the Gold layer's
current state.
