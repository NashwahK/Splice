from fastapi import FastAPI
from pydantic import BaseModel
import pickle
from preprocessing import preprocess_message

app = FastAPI()

# Load models and vectorizer
with open("model/naive_bayes_model.pkl", "rb") as f:
    nb_model = pickle.load(f)
with open("model/svm_model.pkl", "rb") as f:
    svm_model = pickle.load(f)
with open("model/vectorizer.pkl", "rb") as f:
    vectorizer = pickle.load(f)

class MessageInput(BaseModel):
    message: str

@app.post("/predict")
def predict(input: MessageInput):
    cleaned = preprocess_message(input.message)  # Preprocess the message
    vectorized = vectorizer.transform([cleaned])  # Vectorize the message
    
    # Naive Bayes prediction and confidence
    nb_pred = nb_model.predict(vectorized)[0]
    nb_prob = nb_model.predict_proba(vectorized)[0][nb_pred] * 100  # Confidence percentage

    # SVM prediction and confidence
    svm_pred = svm_model.predict(vectorized)[0]
    svm_prob = svm_model.predict_proba(vectorized)[0][svm_pred] * 100  # Confidence percentage

    # Return predictions and confidence
    return {
        "naive_bayes": "Spam" if nb_pred == 1 else "Ham",
        "naive_bayes_confidence": f"{nb_prob:.2f}%",  # Confidence of Naive Bayes
        "svm": "Spam" if svm_pred == 1 else "Ham",
        "svm_confidence": f"{svm_prob:.2f}%"  # Confidence of SVM
    }
