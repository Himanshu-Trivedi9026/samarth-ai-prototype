import json
import os

DB_FILE = "business_db.json"


def load_businesses():
    if not os.path.exists(DB_FILE):
        return []

    with open(DB_FILE, "r") as f:
        return json.load(f)


def save_businesses(data):
    with open(DB_FILE, "w") as f:
        json.dump(data, f, indent=2)