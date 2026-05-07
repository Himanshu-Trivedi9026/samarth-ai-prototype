from rapidfuzz import fuzz

from app.services.embedding_engine import embed, cosine_sim

from app.utils.text_cleaning import clean_text
from app.utils.address_normalizer import normalize_address

import pickle
import os


# =========================
# LOAD ML MODEL
# =========================

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.dirname(
            os.path.dirname(__file__)
        )
    )
)

model_path = os.path.join(
    BASE_DIR,
    "ml_models",
    "similarity_model.pkl"
)

ml_model = None
vectorizer = None


def get_similarity_model():

    global ml_model
    global vectorizer

    if ml_model is None:

        if not os.path.exists(model_path):
            raise RuntimeError(
                f"Similarity model not found at {model_path}"
            )

        with open(model_path, "rb") as f:

            ml_model, vectorizer = pickle.load(f)

    return ml_model, vectorizer


# =========================
# FUZZY MATCHING
# =========================

def fuzzy_score(a, b):
    return fuzz.token_sort_ratio(a, b) / 100


# =========================
# MAIN SIMILARITY FUNCTION
# =========================

def compute_similarity(b1, b2):

    # =========================
    # RAW INPUTS
    # =========================

    raw_name1 = b1.get("name", "")
    raw_name2 = b2.get("name", "")

    raw_addr1 = b1.get("address", "")
    raw_addr2 = b2.get("address", "")

    gst1 = b1.get("gstin")
    gst2 = b2.get("gstin")

    # =========================
    # CLEANING
    # =========================

    name1 = clean_text(raw_name1)
    name2 = clean_text(raw_name2)

    addr1 = normalize_address(raw_addr1)
    addr2 = normalize_address(raw_addr2)

    # =========================
    # GST LOGIC
    # =========================

    gst_score = 0.0
    gst_reason = "No GST info"

    if gst1 and gst2:

        if gst1 == gst2:
            gst_score = 1.0
            gst_reason = "GST match"

        else:
            gst_score = -1.0
            gst_reason = "GST mismatch"

    # =========================
    # EMBEDDING SIMILARITY
    # =========================

    name_vec1 = embed(name1)
    name_vec2 = embed(name2)

    addr_vec1 = embed(addr1)
    addr_vec2 = embed(addr2)

    semantic_name_score = cosine_sim(
        name_vec1,
        name_vec2
    )

    semantic_address_score = cosine_sim(
        addr_vec1,
        addr_vec2
    )

    # =========================
    # FUZZY MATCHING
    # =========================

    fuzzy_name_score = fuzzy_score(
        name1,
        name2
    )

    fuzzy_address_score = fuzzy_score(
        addr1,
        addr2
    )

    # =========================
    # ML PREDICTION
    # =========================

    similarity_model, similarity_vectorizer = (
        get_similarity_model()
    )

    combined_text = (
        f"{name1} {addr1} {name2} {addr2}"
    )

    vectorized = similarity_vectorizer.transform(
        [combined_text]
    )

    ml_probability = similarity_model.predict_proba(
        vectorized
    )[0][1]

    # =========================
    # HYBRID SCORING
    # =========================

    final_name_score = (
        0.5 * semantic_name_score
        + 0.5 * fuzzy_name_score
    )

    final_address_score = (
        0.5 * semantic_address_score
        + 0.5 * fuzzy_address_score
    )

    total_score = (
        0.35 * final_name_score
        + 0.25 * final_address_score
        + 0.25 * ml_probability
        + 0.15 * max(gst_score, 0)
    )

    # =========================
    # DECISION REASONING
    # =========================

    if gst_score == 1.0:

        reason = (
            "Strong duplicate match due to GSTIN"
        )

    elif gst_score == -1.0:

        reason = (
            "GST mismatch indicates separate entities"
        )

    elif total_score >= 0.85:

        reason = (
            "Very high ML-powered business similarity"
        )

    elif total_score >= 0.70:

        reason = (
            "Moderate duplicate similarity detected"
        )

    elif total_score >= 0.50:

        reason = (
            "Weak similarity match"
        )

    else:

        reason = (
            "Businesses appear different"
        )

    return {

        "name_score": round(final_name_score, 3),

        "address_score": round(
            final_address_score,
            3
        ),

        "semantic_name_score": round(
            semantic_name_score,
            3
        ),

        "semantic_address_score": round(
            semantic_address_score,
            3
        ),

        "fuzzy_name_score": round(
            fuzzy_name_score,
            3
        ),

        "fuzzy_address_score": round(
            fuzzy_address_score,
            3
        ),

        "ml_probability": round(
            float(ml_probability),
            3
        ),

        "gst_score": gst_score,

        "total_score": round(
            total_score,
            3
        ),

        "reason": reason,

        "gst_reason": gst_reason,
    }