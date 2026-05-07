from fastapi import APIRouter, HTTPException
from typing import Any
from pydantic import BaseModel, ConfigDict, Field
from app.services.pipeline import run_pipeline

router = APIRouter()


class AnalyzeRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    businesses: list[dict[str, Any]] = Field(default_factory=list)
    events: list[dict[str, Any]] = Field(default_factory=list)


@router.post("/")
def analyze(data: AnalyzeRequest):
    if not data.businesses:
        raise HTTPException(status_code=400, detail="Businesses list cannot be empty")

    try:
        return run_pipeline(data.model_dump())
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
