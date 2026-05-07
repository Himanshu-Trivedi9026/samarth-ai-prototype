import pandas as pd
import pickle

from sklearn.ensemble import (
    RandomForestClassifier
)

# =========================
# LOAD DATA
# =========================

df = pd.read_csv(
    "data/processed/activity_data.csv"
)

# =========================
# SYNTHETIC FEATURES
# =========================

# simulated renewals
df["renewals"] = (
    df["filings"] // 2
)

# recent operational events
df["recent_events"] = (
    df["filings"] // 3
)

# latest activity approximation
df["latest_activity_days"] = (
    df["inspection_days"]
)

# vitality score
df["vitality_score"] = (

    (df["electricity"] // 40)

    + (df["filings"] * 2)
)

# total events approximation
df["total_events"] = (

    df["filings"]

    + df["renewals"]

    + 1
)

# payments approximation
df["payments"] = (
    df["filings"]
)

# inspections approximation
df["inspections"] = (
    df["inspection_days"] // 30
)

# =========================
# FEATURES
# =========================

X = df[[

    "total_events",

    "payments",

    "inspections",

    "renewals",

    "recent_events",

    "latest_activity_days",

    "vitality_score",
]]

# =========================
# LABELS
# =========================

y = df["status"]

# =========================
# TRAIN MODEL
# =========================

model = RandomForestClassifier(

    n_estimators=100,

    random_state=42
)

model.fit(X, y)

# =========================
# SAVE MODEL
# =========================

with open(
    "ml_models/activity_model.pkl",
    "wb"
) as f:

    pickle.dump(model, f)

print(
    "✅ activity_model.pkl retrained successfully"
)