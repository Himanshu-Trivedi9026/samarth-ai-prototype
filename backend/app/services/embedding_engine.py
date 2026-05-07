from sentence_transformers import SentenceTransformer, util

# load once (global)
model = SentenceTransformer("all-MiniLM-L6-v2")

def embed(text: str):
    return model.encode(text, convert_to_tensor=True)

def cosine_sim(a, b):
    return float(util.cos_sim(a, b))