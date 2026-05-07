import pickle
from difflib import SequenceMatcher

# Load model (kept for architecture completeness)
model, vectorizer = pickle.load(open("ml_models/similarity_model.pkl", "rb"))

def similarity(a, b):
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()

def predict(name1, addr1, name2, addr2):
    # 🔥 Rule-based similarity
    name_score = similarity(name1, name2)
    addr_score = similarity(addr1, addr2)

    final_score = (name_score * 0.6 + addr_score * 0.4)

    # 🔹 ML (optional – for comparison)
    text = name1 + " " + addr1 + " " + name2 + " " + addr2
    vec = vectorizer.transform([text])
    ml_prob = model.predict_proba(vec)[0][1]

    print("\n--- Similarity Test ---")
    print(f"Input: {name1} vs {name2}")
    print(f"Name Score: {round(name_score, 2)}")
    print(f"Address Score: {round(addr_score, 2)}")
    print(f"Final Score: {round(final_score, 2)}")
    print(f"ML Confidence: {round(ml_prob * 100, 2)}%")

    if final_score > 0.7:
        print("Prediction: Duplicate")
    else:
        print("Prediction: Not Duplicate")


# Test cases
predict("ABC Pvt Ltd", "Connaught Place", "ABC Private Limited", "Connaught Place")
predict("ABC Pvt Ltd", "Delhi", "XYZ Industries", "Mumbai")