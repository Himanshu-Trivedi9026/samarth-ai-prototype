import sqlite3
from pathlib import Path
from datetime import datetime

# =========================
# DATABASE PATH
# =========================

BASE_DIR = Path(__file__).resolve().parent

DB_PATH = BASE_DIR / "ubid_system.db"


# =========================
# CONNECTION
# =========================

def get_connection():

    conn = sqlite3.connect(DB_PATH)

    conn.row_factory = sqlite3.Row

    return conn


# =========================
# INITIALIZE DATABASE
# =========================

def init_db():

    conn = get_connection()

    cursor = conn.cursor()

    # =========================
    # BUSINESSES TABLE
    # =========================

    cursor.execute("""

    CREATE TABLE IF NOT EXISTS businesses (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        ubid TEXT UNIQUE,

        name TEXT,

        address TEXT,

        gstin TEXT,

        created_at TEXT
    )

    """)

    # =========================
    # EVENTS TABLE
    # =========================

    cursor.execute("""

    CREATE TABLE IF NOT EXISTS events (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        ubid TEXT,

        event_type TEXT,

        timestamp TEXT
    )

    """)

    # =========================
    # REVIEWS TABLE
    # =========================

    cursor.execute("""

    CREATE TABLE IF NOT EXISTS reviews (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        review_id TEXT UNIQUE,

        business_1_name TEXT,

        business_1_address TEXT,

        business_2_name TEXT,

        business_2_address TEXT,

        similarity_score REAL,

        decision TEXT,

        status TEXT,

        created_at TEXT,

        reviewed_at TEXT
    )

    """)

    # =========================
    # MERGE HISTORY TABLE
    # =========================

    cursor.execute("""

    CREATE TABLE IF NOT EXISTS merge_history (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        source_ubid TEXT,

        target_ubid TEXT,

        action TEXT,

        timestamp TEXT
    )

    """)

    conn.commit()

    conn.close()


# =========================
# BUSINESS OPERATIONS
# =========================

def insert_business(business):

    conn = get_connection()

    cursor = conn.cursor()

    cursor.execute("""

    INSERT OR IGNORE INTO businesses

    (
        ubid,
        name,
        address,
        gstin,
        created_at
    )

    VALUES (?, ?, ?, ?, ?)

    """, (

        business.get("ubid"),

        business.get("name"),

        business.get("address"),

        business.get("gstin", ""),

        datetime.utcnow().isoformat()
    ))

    conn.commit()

    conn.close()


def get_all_businesses():

    conn = get_connection()

    cursor = conn.cursor()

    cursor.execute("""

    SELECT * FROM businesses

    """)

    rows = cursor.fetchall()

    conn.close()

    return [dict(row) for row in rows]


# =========================
# EVENT OPERATIONS
# =========================

def insert_event(event):

    conn = get_connection()

    cursor = conn.cursor()

    cursor.execute("""

    INSERT INTO events

    (
        ubid,
        event_type,
        timestamp
    )

    VALUES (?, ?, ?)

    """, (

        event.get("ubid"),

        event.get("type"),

        event.get("timestamp")
    ))

    conn.commit()

    conn.close()


def get_events_by_ubid(ubid):

    conn = get_connection()

    cursor = conn.cursor()

    cursor.execute("""

    SELECT * FROM events

    WHERE ubid = ?

    """, (ubid,))

    rows = cursor.fetchall()

    conn.close()

    return [dict(row) for row in rows]


def get_all_events():

    conn = get_connection()

    cursor = conn.cursor()

    cursor.execute("""

    SELECT * FROM events

    """)

    rows = cursor.fetchall()

    conn.close()

    return [dict(row) for row in rows]


# =========================
# REVIEW OPERATIONS
# =========================

def insert_review(review):

    conn = get_connection()

    cursor = conn.cursor()

    cursor.execute("""

    INSERT OR REPLACE INTO reviews

    (
        review_id,

        business_1_name,

        business_1_address,

        business_2_name,

        business_2_address,

        similarity_score,

        decision,

        status,

        created_at,

        reviewed_at
    )

    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

    """, (

        review.get("review_id"),

        review.get("business_1_name"),

        review.get("business_1_address"),

        review.get("business_2_name"),

        review.get("business_2_address"),

        review.get("similarity_score"),

        review.get("decision", "PENDING"),

        review.get("status", "OPEN"),

        datetime.utcnow().isoformat(),

        review.get("reviewed_at")
    ))

    conn.commit()

    conn.close()


def get_all_reviews():

    conn = get_connection()

    cursor = conn.cursor()

    cursor.execute("""

    SELECT * FROM reviews

    ORDER BY created_at DESC

    """)

    rows = cursor.fetchall()

    conn.close()

    return [dict(row) for row in rows]


def get_pending_reviews():

    conn = get_connection()

    cursor = conn.cursor()

    cursor.execute("""

    SELECT * FROM reviews

    WHERE status = 'OPEN'

    ORDER BY created_at DESC

    """)

    rows = cursor.fetchall()

    conn.close()

    return [dict(row) for row in rows]


def update_review_decision(
    review_id,
    decision
):

    conn = get_connection()

    cursor = conn.cursor()

    cursor.execute("""

    UPDATE reviews

    SET

        decision = ?,

        status = 'RESOLVED',

        reviewed_at = ?

    WHERE review_id = ?

    """, (

        decision,

        datetime.utcnow().isoformat(),

        review_id
    ))

    conn.commit()

    conn.close()


# =========================
# MERGE HISTORY OPERATIONS
# =========================

def add_merge_history(

    source_ubid,

    target_ubid,

    action
):

    conn = get_connection()

    cursor = conn.cursor()

    cursor.execute("""

    INSERT INTO merge_history

    (
        source_ubid,
        target_ubid,
        action,
        timestamp
    )

    VALUES (?, ?, ?, ?)

    """, (

        source_ubid,

        target_ubid,

        action,

        datetime.utcnow().isoformat()
    ))

    conn.commit()

    conn.close()


def get_merge_history():

    conn = get_connection()

    cursor = conn.cursor()

    cursor.execute("""

    SELECT *

    FROM merge_history

    ORDER BY timestamp DESC

    """)

    rows = cursor.fetchall()

    conn.close()

    return [dict(row) for row in rows]