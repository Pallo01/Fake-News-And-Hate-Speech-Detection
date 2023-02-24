from flask import Flask, request
from flask_cors import CORS
import re
import string
import nltk
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import load_model
import joblib
lemmatizer = nltk.WordNetLemmatizer()

app = Flask(__name__)
CORS(app)
cors = CORS(app, resources={r"*": {"origins": "*"}})
# Load the tokenizer
tokenizer=""
try:
    tokenizer = joblib.load("models/tokenizer")
except FileNotFoundError as e:
    print(e.filename+"Not loaded")
#Load the models
directory = ["models/RNN.h5", "models/CNN.h5"]
models = []
result = {}
for i in range(len(directory)):
    try:
        x = directory[i]
        models.append(load_model(x))
        modelName = x[x.index('/')+1:x.index('.h5')]
        result[modelName] = "-1"
    except OSError as e:
        print(">"+directory[i]+" Not loaded")


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


def predict(text):
    for i in range(len(models)):
        key = list(result.keys())[i]
        try:
            prediction = models[i].predict(text);
            if(prediction >0.5):
                result[key] = "1"
            else:
                result[key] = "0"
        except:
            print("Failed to predict with model"+models[i])
    return result


@app.route('/', methods=['GET'])
def home():
    return "Backend Running....."


@app.route('/predict', methods=['POST'])
def index():
    article_text = request.json.get('text')
    if (len(models) and tokenizer):
        article_text = wordopt(article_text)
        article_text = lemmatize_text(article_text)
        # Convert the article text into numerical features
        sequences = tokenizer.texts_to_sequences([article_text])
        # Pad sequences to same length
        X_padded = pad_sequences(sequences, maxlen=500, padding='post')
        # Make a prediction on the padded sequence of article
        prediction = predict(X_padded)
        # Return the prediction result as a JSON response
        return {"status": "success", "result": prediction}
    else:
        return {"status": "fail"}


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
