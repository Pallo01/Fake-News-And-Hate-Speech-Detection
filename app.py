from flask import Flask, request
from flask_cors import CORS
import re
import string
import nltk
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import load_model
import joblib

# Download necessary resources for tokenization and lemmatization
nltk.download('punkt')
nltk.download('wordnet')
lemmatizer = nltk.WordNetLemmatizer()

app = Flask(__name__)
CORS(app)
cors = CORS(app, resources={r"*": {"origins": "*"}})
# Load the tokenizer
fn_tokenizer=""
try:
    fn_tokenizer = joblib.load("models/fakeNews/tokenizer")
except FileNotFoundError as e:
    print(e.filename+"Not loaded")
#Load the models
fn_directory = ["models/fakeNews/CNN.h5", "models/fakeNews/RNN.h5"]
fn_models = []
fn_results={}
for i in range(len(fn_directory)):
    try:
        x = fn_directory[i]
        fn_models.append(load_model(x))
        modelName = x[x.rindex('/')+1:x.index('.h5')]
        fn_results[modelName] = "-1"
    except OSError as e:
        print(">"+fn_directory[i]+" Not loaded")
        


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


def fn_predict(text):
    for i in range(len(fn_models)):
        key = list(fn_results.keys())[i]
        try:
            prediction = fn_models[i].predict(text)
            if(prediction >0.5):
               fn_results[key] = "1"
            else:
                fn_results[key] = "0"
        except:
            print("Failed to predict with model"+fn_models[i])
    return fn_results


@app.route('/', methods=['GET'])
def home():
    return "Backend Running....."


@app.route('/detectNews', methods=['POST'])
def index():
    article_text = request.json.get('text')
    if (len(fn_models) and fn_tokenizer):
        article_text = wordopt(article_text)
        article_text = lemmatize_text(article_text)
        # Convert the article text into numerical features
        sequences = fn_tokenizer.texts_to_sequences([article_text])
        # Pad sequences to same length
        X_padded = pad_sequences(sequences, maxlen=500, padding='post')
        # Make a prediction on the padded sequence of article
        prediction = fn_predict(X_padded)
        # Return the prediction result as a JSON response
        return {"status": "success", "result": prediction}
    else:
        return {"status": "fail"}


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
