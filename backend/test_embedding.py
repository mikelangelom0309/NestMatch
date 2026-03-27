from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

q1 = "3 bedroom house with a big backyard in Gainesville"
q2 = "home with 3 beds and large yard in Gainesville"
q3 = "downtown apartment with 2 bedrooms in Miami"

emb1 = model.encode(q1)
emb2 = model.encode(q2)
emb3 = model.encode(q3)

print("Embedding length:", len(emb1))
print("Cosine similarity between q1 and q2:", cosine_similarity([emb1], [emb2])[0][0])
print("Cosine similarity between q1 and q3:", cosine_similarity([emb1], [emb3])[0][0])