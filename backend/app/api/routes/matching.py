from fastapi import APIRouter, HTTPException
from typing import Any
from pydantic import BaseModel, ConfigDict, Field

from app.services.entity_resolution import match_entities
from app.services.ubid_generator import generate_ubids

router = APIRouter()


class MatchRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    businesses: list[dict[str, Any]] = Field(default_factory=list)


@router.post("/")
def run_matching(data: MatchRequest | list[dict[str, Any]]):
    businesses = data.businesses if isinstance(data, MatchRequest) else data

    if not businesses:
        raise HTTPException(status_code=400, detail="Businesses list cannot be empty")

    clusters, explanations, review_cases = match_entities(businesses)
    results = generate_ubids(clusters)

    return {
        "clusters": len(clusters),
        "results": results,
        "explanations": explanations,
        "review_cases": review_cases,
    }
