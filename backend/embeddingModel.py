#SentenceTransformer and other NLP models are designed to work with Python
from sentence_transformers import SentenceTransformer
import sys
import json

#Load a pretrained Sentence Transformer model
model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

#Generate embeddings
def generate_embedding(query):
    embedding = model.encode(query)
    return embedding.tolist() #Convert to list for JSON serialization

if __name__ == "__main__":
    query = sys.argv[1] #Query passed as argument
    embedding = generate_embedding(query)
    print(json.dumps(embedding)) #Output embedding as JSON string for Node to read

