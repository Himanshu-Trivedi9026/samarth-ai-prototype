# No need to use ML model for now (kept separately for architecture)

def predict(inspection_days, electricity, filings):

    # 🔥 Rule-based classification
    if electricity > 300 and filings > 5:
        status = "ACTIVE"
    elif electricity >= 100:
        status = "DORMANT"
    else:
        status = "CLOSED"

    print("\n--- Activity Test ---")
    print(f"Input: days={inspection_days}, electricity={electricity}, filings={filings}")
    print(f"Prediction: {status}")


# Test cases
predict(30, 500, 12)   # ACTIVE
predict(300, 100, 2)   # DORMANT
predict(900, 0, 0)     # CLOSED