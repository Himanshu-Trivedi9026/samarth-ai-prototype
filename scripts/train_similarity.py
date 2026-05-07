import pandas as pd
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

# Load processed data
df = pd.read_csv("data/processed/similarity_data.csv")

# Combine features into single text
df["text"] = (
    df["name1"] + " " +
    df["address1"] + " " +
    df["name2"] + " " +
    df["address2"]
)

# Vectorize text
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(df["text"])

y = df["label"]

# Train model
model = LogisticRegression()
model.fit(X, y)

# Save model
with open("ml_models/similarity_model.pkl", "wb") as f:
    pickle.dump((model, vectorizer), f)

print("✅ similarity_model.pkl created")