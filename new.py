from flask import Flask, request
from flask_cors import CORS
import re
import string
import nltk
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import load_model
import joblib;


tokenizer = joblib.load("models/tokkenizer");
lemmatizer = nltk.WordNetLemmatizer()

CNN =load_model("models/CNN.h5")
# CNN =joblib.load("models/CNN.pkl")
# RNN =load_model("models/RNN.h5")

def wordopt(text):
    text = text.lower()
    text = re.sub('\[.*?\]', '', text)
    text = re.sub("\\W", " ", text)
    text = re.sub('https?://\S+|www\.\S+', '', text)
    text = re.sub('<.*?>+', '', text)
    text = re.sub('[%s]' % re.escape(string.punctuation), '', text)
    text = re.sub('\n', '', text)
    text = re.sub('\w*\d\w*', '', text)
    return text


def lemmatize_text(text):
    words = nltk.word_tokenize(text)
    lemmatized_words = [lemmatizer.lemmatize(word) for word in words]
    return ' '.join(lemmatized_words)


article_text = "Many people have raised the alarm regarding the fact that Donald Trump is dangerously close to becoming an autocrat. The thing is, democracies become autocracies right "
article_text = wordopt(article_text)
article_text = lemmatize_text(article_text)
# Convert the article text into numerical features
article_text = tokenizer.texts_to_sequences([article_text])
article_text = pad_sequences(article_text, padding='post', maxlen=500)
# Make a prediction on the padded sequence of article
prediction=CNN.predict(article_text)
if prediction>0.5:
    print("True")
else:
    print("False")
print(prediction)
