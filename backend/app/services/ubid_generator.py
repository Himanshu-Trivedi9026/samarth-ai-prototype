import uuid


def _normalize(value):
    return str(value or "").strip().lower()


def _business_identity(business):
    return "|".join(
        [
            _normalize(business.get("gstin")),
            _normalize(business.get("name")),
            _normalize(business.get("address")),
        ]
    )


def _cluster_id(cluster):
    signature = "||".join(sorted(_business_identity(business) for business in cluster))
    return str(uuid.uuid5(uuid.NAMESPACE_URL, f"bbgie-ubid:{signature}"))


def generate_ubids(clusters):
    results = []

    for cluster in clusters:
        ubid = _cluster_id(cluster)

        for business in cluster:
            results.append({"ubid": ubid, "business": business})

    return results
