# backend/preprocess.py
import re
import string
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')

stop_words = set(stopwords.words("english"))
lemmatizer = WordNetLemmatizer()

def preprocess_message(message):
    message = message.lower()
    message = re.sub(f"[{re.escape(string.punctuation)}0-9]", " ", message)
    message = re.sub(r"\s+", " ", message)
    tokens = nltk.word_tokenize(message)
    cleaned_tokens = [
        lemmatizer.lemmatize(word)
        for word in tokens
        if word not in stop_words and len(word) > 2
    ]
    return " ".join(cleaned_tokens)
