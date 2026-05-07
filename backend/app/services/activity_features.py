from datetime import datetime


def extract_features(events):

    total_events = len(events)

    payments = 0

    inspections = 0

    renewals = 0

    recent_events = 0

    now = datetime.utcnow()

    latest_activity_days = 9999

    for event in events:

        event_type = (
            event.get("type", "")
            .lower()
            .strip()
        )

        # =========================
        # EVENT COUNTS
        # =========================

        if event_type == "payment":
            payments += 1

        elif event_type == "inspection":
            inspections += 1

        elif event_type == "renewal":
            renewals += 1

        # =========================
        # TEMPORAL ANALYSIS
        # =========================

        timestamp = event.get(
            "timestamp"
        )

        if timestamp:

            try:

                event_time = (
                    datetime.fromisoformat(
                        timestamp.replace(
                            "Z",
                            ""
                        )
                    )
                )

                delta_days = (
                    now - event_time
                ).days

                # recent event
                if delta_days <= 90:
                    recent_events += 1

                # latest activity
                latest_activity_days = min(
                    latest_activity_days,
                    delta_days
                )

            except Exception:
                pass

    # =========================
    # VITALITY SCORE
    # =========================

    vitality_score = (

        (payments * 4)

        + (renewals * 5)

        + (inspections * 2)

        + (recent_events * 3)
    )

    # inactivity penalty
    if latest_activity_days > 365:

        vitality_score -= 15

    elif latest_activity_days > 180:

        vitality_score -= 8

    elif latest_activity_days > 90:

        vitality_score -= 3

    vitality_score = max(
        vitality_score,
        0
    )

    return [

        total_events,

        payments,

        inspections,

        renewals,

        recent_events,

        latest_activity_days,

        vitality_score,
    ]