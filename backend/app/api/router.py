from fastapi import APIRouter

from app.api.routes import upload
from app.api.routes import matching
from app.api.routes import activity
from app.api.routes import analyze
from app.api.routes import review
from app.api.routes import explain
from app.api.routes import reversal

from app.api.routes.analytics import (
    router as analytics_router
)

api_router = APIRouter()

# =========================
# ANALYTICS
# =========================

api_router.include_router(
    analytics_router
)

# =========================
# CSV UPLOAD
# =========================

api_router.include_router(
    upload.router,
    prefix="/upload",
    tags=["Upload"]
)

# =========================
# ENTITY MATCHING
# =========================

api_router.include_router(
    matching.router,
    prefix="/match",
    tags=["Matching"]
)

# =========================
# ACTIVITY INTELLIGENCE
# =========================

api_router.include_router(
    activity.router,
    prefix="/activity",
    tags=["Activity"]
)

# =========================
# PIPELINE
# =========================

api_router.include_router(
    analyze.router,
    prefix="/analyze",
    tags=["Pipeline"]
)

# =========================
# HUMAN REVIEW
# =========================

api_router.include_router(
    review.router,
    prefix="/review",
    tags=["Review"]
)

# =========================
# EXPLAINABILITY
# =========================

api_router.include_router(
    explain.router,
    prefix="/explain",
    tags=["Explainability"]
)

# =========================
# REVERSIBILITY ENGINE
# =========================

api_router.include_router(
    reversal.router,
    prefix="/reversal",
    tags=["Reversal"]
)