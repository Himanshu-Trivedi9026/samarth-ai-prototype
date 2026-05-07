import re


def clean_text(text):

    if not text:
        return ""

    text = text.lower()

    # Remove punctuation
    text = re.sub(r"[^a-z0-9\s]", " ", text)

    # Normalize company suffixes
    replacements = {

        "pvt ltd": "private limited",
        "pvt. ltd.": "private limited",
        "pvt": "private",
        "ltd": "limited",
        "co": "company",
        "&": "and",
    }

    for old, new in replacements.items():
        text = text.replace(old, new)

    # Remove extra spaces
    text = re.sub(r"\s+", " ", text).strip()

    return text