from fastapi import APIRouter

from app.db.database import (

    get_pending_reviews,

    get_all_reviews,

    update_review_decision,
)

from app.services.review_handler import (
    save_review_decision
)

router = APIRouter()


# =========================================
# GET PENDING REVIEWS
# =========================================

@router.get("/pending")
def pending_reviews():

    reviews = get_pending_reviews()

    return {

        "total_pending":
            len(reviews),

        "reviews":
            reviews,
    }


# =========================================
# GET ALL REVIEWS
# =========================================

@router.get("/")
def all_reviews():

    reviews = get_all_reviews()

    return {

        "total_reviews":
            len(reviews),

        "reviews":
            reviews,
    }


# =========================================
# SUBMIT REVIEW DECISION
# =========================================

@router.post("/decision")
def review_decision(payload: dict):

    review_id = payload.get(
        "review_id"
    )

    decision = payload.get(
        "decision"
    )

    # =====================================
    # UPDATE DATABASE
    # =====================================

    update_review_decision(

        review_id,

        decision
    )

    # =====================================
    # UPDATE MEMORY CACHE
    # =====================================

    if decision == "APPROVE":

        save_review_decision(
            review_id,
            "merge"
        )

    else:

        save_review_decision(
            review_id,
            "separate"
        )

    return {

        "success": True,

        "review_id":
            review_id,

        "decision":
            decision,
    }