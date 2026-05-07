import pickle
import os

from collections import defaultdict

from app.services.activity_features import (
    extract_features
)

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

    "activity_model.pkl"
)

model = None


def get_model():

    global model

    if model is None:

        if not os.path.exists(
            model_path
        ):

            raise RuntimeError(

                f"Activity model not found at {model_path}"
            )

        with open(
            model_path,
            "rb"
        ) as f:

            model = pickle.load(f)

    return model


def classify_activity(
    ubid,
    events
):

    features = extract_features(
        events
    )

    activity_model = get_model()

    prediction = (
        activity_model.predict(
            [features]
        )[0]
    )

    probs = (
        activity_model.predict_proba(
            [features]
        )[0]
    )

    confidence = max(probs)

    # =========================
    # FEATURE MAPPING
    # =========================

    feature_map = {

        "total_events":
            features[0],

        "payments":
            features[1],

        "inspections":
            features[2],

        "renewals":
            features[3],

        "recent_events":
            features[4],

        "latest_activity_days":
            features[5],

        "vitality_score":
            features[6],
    }

    # =========================
    # RULE OVERRIDES
    # =========================

    vitality = feature_map[
        "vitality_score"
    ]

    latest_days = feature_map[
        "latest_activity_days"
    ]

    if latest_days > 365:

        prediction = "CLOSED"

    elif vitality >= 20:

        prediction = "ACTIVE"

    elif vitality >= 8:

        prediction = "DORMANT"

    else:

        prediction = "CLOSED"

    # =========================
    # EXPLAINABILITY
    # =========================

    if prediction == "ACTIVE":

        explanation = (
            "Business shows strong recent operational activity."
        )

    elif prediction == "DORMANT":

        explanation = (
            "Business shows limited or declining activity."
        )

    else:

        explanation = (
            "Business appears inactive for a long duration."
        )

    return {

        "ubid": ubid,

        "state": prediction,

        "confidence": round(
            float(confidence),
            3
        ),

        "vitality_score":
            vitality,

        "explanation":
            explanation,

        "features":
            feature_map,
    }


def batch_classify_activity(
    events
):

    grouped = defaultdict(list)

    # =========================
    # GROUP EVENTS
    # =========================

    for event in events:

        ubid = event.get(
            "ubid"
        )

        if ubid:

            grouped[
                ubid
            ].append(event)

    results = []

    for ubid, ev in grouped.items():

        result = classify_activity(
            ubid,
            ev
        )

        results.append(result)

    return results