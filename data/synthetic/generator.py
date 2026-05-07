import pandas as pd
import random

# Load raw data
dept1 = pd.read_csv("data/raw/dept1.csv")
dept2 = pd.read_csv("data/raw/dept2.csv")
dept3 = pd.read_csv("data/raw/dept3.csv")

# -------------------------------
# 🔹 SIMILARITY DATA GENERATION
# -------------------------------

similarity_data = []

# Positive pairs (same business across departments)
for i in range(len(dept1)):
    name1 = dept1.loc[i, "name"]
    address1 = dept1.loc[i, "address"]

    name2 = dept2.loc[i, "business_name"]
    address2 = dept2.loc[i, "location"]

    similarity_data.append([name1, name2, address1, address2, 1])

# Negative pairs (random mismatches)
for _ in range(len(dept1)):
    i = random.randint(0, len(dept1)-1)
    j = random.randint(0, len(dept2)-1)

    if i != j:
        name1 = dept1.loc[i, "name"]
        address1 = dept1.loc[i, "address"]

        name2 = dept2.loc[j, "business_name"]
        address2 = dept2.loc[j, "location"]

        similarity_data.append([name1, name2, address1, address2, 0])

similarity_df = pd.DataFrame(
    similarity_data,
    columns=["name1", "name2", "address1", "address2", "label"]
)

similarity_df.to_csv("data/processed/similarity_data.csv", index=False)

print("✅ similarity_data.csv created")

# -------------------------------
# 🔹 ACTIVITY DATA GENERATION
# -------------------------------

activity_data = []

for i in range(len(dept3)):
    electricity = dept3.loc[i, "electricity_usage"]

    # Simulated inspection + filing
    inspection_days = random.randint(10, 900)
    filings = random.randint(0, 12)

    # Rule-based label
    if electricity > 300 and filings > 5:
        status = "ACTIVE"
    elif electricity > 100:
        status = "DORMANT"
    else:
        status = "CLOSED"

    activity_data.append([inspection_days, electricity, filings, status])

activity_df = pd.DataFrame(
    activity_data,
    columns=["inspection_days", "electricity", "filings", "status"]
)

activity_df.to_csv("data/processed/activity_data.csv", index=False)

print("✅ activity_data.csv created")