from app.services.similarity_engine import compute_similarity
from app.services.review_handler import add_to_review, get_review_decision

# 🔥 IMPROVED THRESHOLDS
HIGH_THRESHOLD = 0.75
LOW_THRESHOLD = 0.55


def _normalize(value):
    value = str(value or "").strip().lower()

    # 🔥 BUSINESS SUFFIX NORMALIZATION
    replacements = {
        "private limited": "pvt ltd",
        "private ltd": "pvt ltd",
        "pvt. ltd.": "pvt ltd",
        "pvt ltd.": "pvt ltd",
        "limited": "ltd",
        "india": "",
    }

    for old, new in replacements.items():
        value = value.replace(old, new)

    return " ".join(value.split())


def _business_sort_key(item):
    return (
        _normalize(item.get("gstin")),
        _normalize(item.get("name")),
        _normalize(item.get("address")),
    )


def _cluster_sort_key(cluster):
    return _business_sort_key(cluster[0])


def match_entities(data):

    clusters = []
    explanations = []
    review_cases = []

    for item in sorted(data, key=_business_sort_key):

        gst_matches = []
        review_matches = []
        high_matches = []
        medium_matches = []

        # 🔥 NORMALIZED INPUT
        normalized_name = _normalize(item.get("name"))
        normalized_address = _normalize(item.get("address"))

        for cluster in sorted(clusters, key=_cluster_sort_key):

            ref = cluster[0]

            ref_name = _normalize(ref.get("name"))
            ref_address = _normalize(ref.get("address"))

            sim = compute_similarity(item, ref)

            gst_score = sim.get("gst_score", 0.0)

            # 🔥 GST MISMATCH
            if gst_score == -1.0:
                continue

            # 🔥 GST EXACT MATCH
            if gst_score == 1.0:
                gst_matches.append((cluster, ref, sim))
                continue

            # 🔥 MANUAL REVIEW DECISION
            decision = get_review_decision(item, ref)

            if decision == "merge":
                review_matches.append((cluster, ref, sim))
                continue

            if decision == "separate":
                continue

            score = sim.get("total_score", 0.0)

            # 🔥 STRONG NORMALIZED NAME MATCH
            strong_name_match = (
                normalized_name == ref_name
            )

            # 🔥 STRONG ADDRESS MATCH
            strong_address_match = (
                normalized_address == ref_address
            )

            # 🔥 SMART DUPLICATE OVERRIDE
            if strong_name_match and score >= 0.55:
                high_matches.append((0.95, cluster, ref, sim))
                continue

            if strong_name_match and strong_address_match:
                high_matches.append((0.98, cluster, ref, sim))
                continue

            # 🔥 HIGH CONFIDENCE
            if score >= HIGH_THRESHOLD:
                high_matches.append(
                    (score, cluster, ref, sim)
                )

            # 🔥 REVIEW CASE
            elif LOW_THRESHOLD <= score < HIGH_THRESHOLD:
                medium_matches.append(
                    (score, cluster, ref, sim)
                )

        # 🔥 GST MATCH
        if gst_matches:

            cluster, ref, sim = gst_matches[0]

            cluster.append(item)

            explanations.append(
                {
                    "business": item,
                    "matched_with": ref,
                    "scores": sim,
                    "decision": "auto-merge (GST match)",
                    "confidence_level": "high",
                }
            )

            continue

        # 🔥 REVIEW OVERRIDE
        if review_matches:

            cluster, ref, sim = review_matches[0]

            cluster.append(item)

            explanations.append(
                {
                    "business": item,
                    "matched_with": ref,
                    "scores": sim,
                    "decision": "auto-merge (review override)",
                    "confidence_level": "high",
                }
            )

            continue

        # 🔥 HIGH CONFIDENCE MERGE
        if high_matches:

            _, cluster, ref, sim = max(
                high_matches,
                key=lambda match: (
                    match[0],
                    _cluster_sort_key(match[1]),
                ),
            )

            cluster.append(item)

            explanations.append(
                {
                    "business": item,
                    "matched_with": ref,
                    "scores": sim,
                    "decision": "auto-merge",
                    "confidence_level": "high",
                }
            )

            continue

        # 🔥 HUMAN REVIEW CASE
        if medium_matches:

            _, _, ref, sim = max(
                medium_matches,
                key=lambda match: (
                    match[0],
                    _cluster_sort_key(match[1]),
                ),
            )

            review_item = add_to_review(
                item,
                ref,
                sim,
            )

            review_cases.append(review_item)

            explanations.append(
                {
                    "business": item,
                    "matched_with": ref,
                    "scores": sim,
                    "decision": "sent-to-review",
                    "review_id": review_item["review_id"],
                    "confidence_level": "medium",
                }
            )

        # 🔥 NEW CLUSTER
        clusters.append([item])

    return clusters, explanations, review_cases