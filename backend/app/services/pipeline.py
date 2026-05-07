from app.services.entity_resolution import match_entities
from app.services.ubid_generator import generate_ubids
from app.services.activity_classifier import batch_classify_activity

# 🔥 DATABASE IMPORTS
from app.db.database import (
    get_all_businesses,
    insert_business,
    insert_event,
)


def _map_events_to_generated_ubids(events, ubid_results):
    source_to_generated = {}

    for item in ubid_results:
        source_ubid = item["business"].get("ubid")

        if source_ubid:
            source_to_generated[source_ubid] = item["ubid"]

    mapped_events = []

    for event in events:
        mapped_event = dict(event)

        source_ubid = mapped_event.get("ubid")

        if source_ubid in source_to_generated:
            mapped_event["source_ubid"] = source_ubid
            mapped_event["ubid"] = source_to_generated[source_ubid]

        mapped_events.append(mapped_event)

    return mapped_events


def run_pipeline(data):

    # 🔥 NEW INPUT
    incoming_businesses = data.get("businesses", [])
    incoming_events = data.get("events", [])

    # 🔥 LOAD HISTORICAL BUSINESSES
    stored_businesses = get_all_businesses()

    # 🔥 COMBINE OLD + NEW
    businesses = stored_businesses + incoming_businesses

    # 🔥 ENTITY RESOLUTION
    clusters, explanations, review_cases = match_entities(
        businesses
    )

    # 🔥 GENERATE UBIDS
    ubid_results = generate_ubids(clusters)

    # 🔥 MAP EVENTS TO GENERATED UBIDS
    mapped_events = _map_events_to_generated_ubids(
        incoming_events,
        ubid_results
    )

    # 🔥 STORE EVENTS
    for event in mapped_events:
        insert_event(event)

    # 🔥 ACTIVITY INTELLIGENCE
    activity_results = batch_classify_activity(
        mapped_events
    )

    activity_map = {
        a["ubid"]: a for a in activity_results
    }

    final_results = []

    # 🔥 SAVE BUSINESSES TO DATABASE
    for item in ubid_results:

        ubid = item["ubid"]

        business = item["business"]

        # attach generated ubid
        business["ubid"] = ubid

        insert_business(business)

        activity = activity_map.get(
            ubid,
            {
                "ubid": ubid,
                "state": "Unknown",
                "confidence": 0,
                "features": {
                    "total_events": 0,
                    "payments": 0,
                    "inspections": 0,
                    "renewals": 0,
                    "recent_events": 0,
                },
            },
        )

        final_results.append({

            "ubid": ubid,

            "business": business,

            "activity": activity,

            # 🔥 DUPLICATE DETECTION OUTPUT
            "is_duplicate": item.get(
                "is_duplicate",
                False
            ),

            "similarity_score": item.get(
                "similarity_score",
                0
            ),

            "reason": item.get(
                "reason",
                "No explanation"
            ),
        })

    return {
        "clusters": len(clusters),
        "results": final_results,
        "events": mapped_events,
        "activity_results": activity_results,
        "matching_explanations": explanations,
        "review_cases": review_cases,
    }