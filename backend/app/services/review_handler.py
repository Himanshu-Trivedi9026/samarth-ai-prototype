import uuid

from app.db.database import (

    insert_review,
)


# =========================================
# IN-MEMORY REVIEW CACHE
# =========================================

review_decisions = {}


# =========================================
# CREATE REVIEW CASE
# =========================================

def add_to_review(

    business_1,

    business_2,

    similarity
):

    review_id = str(
        uuid.uuid4()
    )

    review_item = {

        "review_id":
            review_id,

        "business_1":
            business_1,

        "business_2":
            business_2,

        "scores":
            similarity,

        "status":
            "PENDING",
    }

    # =====================================
    # STORE IN DATABASE
    # =====================================

    insert_review({

        "review_id":
            review_id,

        "business_1_name":
            business_1.get("name"),

        "business_1_address":
            business_1.get(
                "address"
            ),

        "business_2_name":
            business_2.get("name"),

        "business_2_address":
            business_2.get(
                "address"
            ),

        "similarity_score":
            similarity.get(
                "total_score",
                0
            ),

        "decision":
            "PENDING",

        "status":
            "OPEN",
    })

    return review_item


# =========================================
# SAVE REVIEW DECISION
# =========================================

def save_review_decision(

    review_id,

    decision
):

    review_decisions[
        review_id
    ] = decision


# =========================================
# GET REVIEW DECISION
# =========================================

def get_review_decision(
    business_1,
    business_2
):

    for review_id, decision in (
        review_decisions.items()
    ):

        if decision == "merge":
            return "merge"

        elif decision == "separate":
            return "separate"

    return None