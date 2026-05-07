from fastapi import APIRouter

from app.db.database import (
    get_all_businesses,
    get_all_events,
)

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.get("/")
def get_analytics():

    businesses = get_all_businesses()
    events = get_all_events()

    total_businesses = len(businesses)

    unique_ubids = set()

    for b in businesses:

        ubid = b.get("ubid")

        if ubid:
            unique_ubids.add(ubid)

    duplicate_businesses = (
        total_businesses - len(unique_ubids)
    )

    activity_states = {
        "ACTIVE": 0,
        "DORMANT": 0,
        "CLOSED": 0,
        "UNKNOWN": 0,
    }

    for event in events:

        state = str(
            event.get("activity_state", "UNKNOWN")
        ).upper()

        if state not in activity_states:
            state = "UNKNOWN"

        activity_states[state] += 1

    return {

        "total_businesses": total_businesses,

        "unique_businesses": len(unique_ubids),

        "duplicate_businesses": duplicate_businesses,

        "total_events": len(events),

        "activity_distribution": activity_states,
    }