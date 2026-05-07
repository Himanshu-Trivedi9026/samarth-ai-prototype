from fastapi import APIRouter, UploadFile, File
import pandas as pd
import io

from app.services.pipeline import run_pipeline

router = APIRouter()


@router.post("/")
async def upload_file(
    file: UploadFile = File(...)
):

    # =========================
    # READ CSV
    # =========================

    contents = await file.read()

    df = pd.read_csv(
        io.BytesIO(contents)
    )

    # =========================
    # COLUMN NORMALIZATION
    # =========================

    rename_map = {
        "business_name": "name",
        "location": "address",
    }

    df = df.rename(columns=rename_map)

    # =========================
    # REQUIRED COLUMNS
    # =========================

    if "name" not in df.columns:
        return {
            "success": False,
            "error": "CSV must contain business name column"
        }

    if "address" not in df.columns:
        return {
            "success": False,
            "error": "CSV must contain address column"
        }

    # =========================
    # BUILD BUSINESS OBJECTS
    # =========================

    businesses = []

    for _, row in df.iterrows():

        business = {

            "ubid": f"upload-{_}",

            "name": str(
                row.get("name", "")
            ),

            "address": str(
                row.get("address", "")
            ),

            "gstin": str(
                row.get("gstin", "")
            ),
        }

        businesses.append(business)

    # =========================
    # BUILD SYNTHETIC EVENTS
    # =========================

    events = []

    for business in businesses:

        source_ubid = business["ubid"]

        events.extend([

            {
                "ubid": source_ubid,
                "type": "payment",
                "timestamp": pd.Timestamp.now().isoformat(),
            },

            {
                "ubid": source_ubid,
                "type": "inspection",
                "timestamp": pd.Timestamp.now().isoformat(),
            },

            {
                "ubid": source_ubid,
                "type": "renewal",
                "timestamp": pd.Timestamp.now().isoformat(),
            },
        ])

    # =========================
    # RUN AI PIPELINE
    # =========================

    pipeline_result = run_pipeline({

        "businesses": businesses,

        "events": events,
    })

    # =========================
    # RESPONSE
    # =========================

    return {

        "success": True,

        "filename": file.filename,

        # 🔥 FRONTEND SUPPORT
        "rows": int(len(df)),

        "columns": list(df.columns),

        # 🔥 EXISTING RESPONSE
        "rows_processed": len(df),

        "businesses_uploaded": len(
            businesses
        ),

        "events_generated": len(
            events
        ),

        "pipeline_result": pipeline_result,

        "preview": df.head(10).to_dict(
            orient="records"
        ),
    }