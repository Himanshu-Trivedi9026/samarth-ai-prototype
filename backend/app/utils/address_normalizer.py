import re


def normalize_address(address):

    if not address:
        return ""

    address = address.lower()

    replacements = {

        "india": "",
        "road": "rd",
        "street": "st",
        "lane": "ln",
        "nagar": "ngr",
    }

    for old, new in replacements.items():
        address = address.replace(old, new)

    address = re.sub(
        r"[^a-z0-9\s]",
        " ",
        address
    )

    address = re.sub(
        r"\s+",
        " ",
        address
    ).strip()

    return address