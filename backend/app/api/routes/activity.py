from fastapi import APIRouter, HTTPException
from typing import List
from app.models.event import Event
from app.services.activity_classifier import classify_activity, batch_classify_activity

router = APIRouter()


# 🔹 Single UBID API (already exists)
@router.post("/")
def activity(events: List[Event]):
    if not events:
        raise HTTPException(status_code=400, detail="Events list cannot be empty")

    ubids = {e.ubid for e in events}
    if len(ubids) != 1:
        raise HTTPException(status_code=400, detail="All events must have same UBID")

    ubid = ubids.pop()
    event_dicts = [e.model_dump() for e in events]

    try:
        return classify_activity(ubid, event_dicts)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


# 🔥 NEW: Batch API
@router.post("/batch")
def activity_batch(events: List[Event]):
    if not events:
        raise HTTPException(status_code=400, detail="Events list cannot be empty")

    event_dicts = [e.model_dump() for e in events]

    try:
        return batch_classify_activity(event_dicts)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
