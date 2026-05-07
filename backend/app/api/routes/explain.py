from fastapi import APIRouter

from app.db.database import (
    get_all_businesses,
)

from app.services.similarity_engine import (
    compute_similarity,
)

router = APIRouter()


# =====================================================
# EXISTING GLOBAL EXPLAINABILITY ANALYSIS
# =====================================================

@router.get("/")
def explain_matches():

    businesses = get_all_businesses()

    explanations = []

    # compare businesses pairwise
    for i in range(len(businesses)):

        for j in range(i + 1, len(businesses)):

            b1 = businesses[i]
            b2 = businesses[j]

            similarity = compute_similarity(
                b1,
                b2
            )

            total_score = float(
                similarity.get(
                    "total_score",
                    0
                )
            )

            # =========================================
            # CONFIDENCE LEVEL
            # =========================================

            if total_score >= 0.90:
                confidence_level = "VERY HIGH"

            elif total_score >= 0.75:
                confidence_level = "HIGH"

            elif total_score >= 0.60:
                confidence_level = "MEDIUM"

            else:
                confidence_level = "LOW"

            explanations.append({

                "business_1": {
                    "ubid": str(b1.get("ubid")),
                    "name": str(b1.get("name")),
                    "address": str(b1.get("address")),
                    "gstin": str(b1.get("gstin")),
                },

                "business_2": {
                    "ubid": str(b2.get("ubid")),
                    "name": str(b2.get("name")),
                    "address": str(b2.get("address")),
                    "gstin": str(b2.get("gstin")),
                },

                "scores": {

                    "semantic_name_score":
                        float(similarity.get(
                            "semantic_name_score",
                            0
                        )),

                    "semantic_address_score":
                        float(similarity.get(
                            "semantic_address_score",
                            0
                        )),

                    "fuzzy_name_score":
                        float(similarity.get(
                            "fuzzy_name_score",
                            0
                        )),

                    "fuzzy_address_score":
                        float(similarity.get(
                            "fuzzy_address_score",
                            0
                        )),

                    "final_name_score":
                        float(similarity.get(
                            "name_score",
                            0
                        )),

                    "final_address_score":
                        float(similarity.get(
                            "address_score",
                            0
                        )),

                    "gst_score":
                        float(similarity.get(
                            "gst_score",
                            0
                        )),

                    "total_score":
                        total_score,
                },

                "confidence_level":
                    confidence_level,

                "review_needed":
                    bool(
                        0.65 <= total_score < 0.90
                    ),

                "reason":
                    str(similarity.get(
                        "reason",
                        ""
                    )),

                "gst_reason":
                    str(similarity.get(
                        "gst_reason",
                        ""
                    )),
            })

    explanations = sorted(

        explanations,

        key=lambda x:
            x["scores"]["total_score"],

        reverse=True
    )

    return {
        "total_explanations":
            int(len(explanations)),

        "results":
            explanations
    }


# =====================================================
# NEW DIRECT EXPLAINABILITY ENDPOINT
# =====================================================

@router.post("/")
async def explain_match(payload: dict):

    business1 = payload.get(
        "business_1",
        {}
    )

    business2 = payload.get(
        "business_2",
        {}
    )

    similarity = compute_similarity(
        business1,
        business2
    )

    total_score = float(
        similarity.get(
            "total_score",
            0
        )
    )

    # =========================================
    # CONFIDENCE LEVEL
    # =========================================

    if total_score >= 0.90:
        confidence_level = "VERY HIGH"

    elif total_score >= 0.75:
        confidence_level = "HIGH"

    elif total_score >= 0.60:
        confidence_level = "MEDIUM"

    else:
        confidence_level = "LOW"

    return {

        "similarity_score":
            total_score,

        "confidence_level":
            confidence_level,

        "explanation":
            str(
                similarity.get(
                    "reason",
                    ""
                )
            ),

        "review_needed":
            bool(
                0.65 <= total_score < 0.90
            ),

        "breakdown": {

            "name_score":
                float(
                    similarity.get(
                        "name_score",
                        0
                    )
                ),

            "address_score":
                float(
                    similarity.get(
                        "address_score",
                        0
                    )
                ),

            "semantic_name_score":
                float(
                    similarity.get(
                        "semantic_name_score",
                        0
                    )
                ),

            "semantic_address_score":
                float(
                    similarity.get(
                        "semantic_address_score",
                        0
                    )
                ),

            "fuzzy_name_score":
                float(
                    similarity.get(
                        "fuzzy_name_score",
                        0
                    )
                ),

            "fuzzy_address_score":
                float(
                    similarity.get(
                        "fuzzy_address_score",
                        0
                    )
                ),

            "gst_score":
                float(
                    similarity.get(
                        "gst_score",
                        0
                    )
                ),

            "gst_reason":
                str(
                    similarity.get(
                        "gst_reason",
                        ""
                    )
                ),
        }
    }