from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import nltk
import pandas as pd
import os
import random
from preprocessing import preprocess_message

nltk.data.path.append('./nltk_data')
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models and vectorizer
with open("model/naive_bayes_model.pkl", "rb") as f:
    nb_model = pickle.load(f)
with open("model/svm_model.pkl", "rb") as f:
    svm_model = pickle.load(f)
with open("model/vectorizer.pkl", "rb") as f:
    vectorizer = pickle.load(f)

class MessageInput(BaseModel):
    message: str

class ReportInput(BaseModel):
    category: str
    message: str
    label: int

@app.post("/predict")
def predict(input: MessageInput):
    cleaned = preprocess_message(input.message)
    vectorized = vectorizer.transform([cleaned])
    
    nb_pred = nb_model.predict(vectorized)[0]
    nb_prob = nb_model.predict_proba(vectorized)[0][nb_pred] * 100

    svm_pred = svm_model.predict(vectorized)[0]
    svm_prob = svm_model.predict_proba(vectorized)[0][svm_pred] * 100

    return {
        "naive_bayes": "Spam" if nb_pred == 1 else "Ham",
        "naive_bayes_confidence": f"{nb_prob:.2f}%",
        "svm": "Spam" if svm_pred == 1 else "Ham",
        "svm_confidence": f"{svm_prob:.2f}%"
    }

@app.post("/report")
def report_message(data: ReportInput):
    dataset_path = "data/spam_detection_dataset.csv"

    new_entry = pd.DataFrame([{
        "Category": data.category,
        "Message": data.message,
        "Label": data.label
    }])

    if not os.path.isfile(dataset_path):
        new_entry.to_csv(dataset_path, index=False)
    else:
        new_entry.to_csv(dataset_path, mode="a", header=False, index=False)

    return {"success": True, "message": "Message reported successfully"}

@app.get("/quiz-data")
def get_quiz_data():
    dataset_path = "data/spam_detection_dataset.csv"
    if not os.path.isfile(dataset_path):
        return {"error": "Dataset not found"}

    df = pd.read_csv(dataset_path)

    # Sample and clean
    df = df.sample(n=20, random_state=random.randint(0, 9999))
    df = df[["Message", "Label"]].rename(columns={"Message": "text", "Label": "trueLabel"})

    # Convert int64 to int for JSON serialization
    data = df.to_dict(orient="records")
    for item in data:
        item["trueLabel"] = int(item["trueLabel"])

    return data
