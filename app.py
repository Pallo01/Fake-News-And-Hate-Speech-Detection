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
nltk.download('stopwords')
from nltk.corpus import stopwords
lemmatizer = nltk.WordNetLemmatizer()

app = Flask(__name__)
CORS(app)
cors = CORS(app, resources={r"*": {"origins": "*"}})

@app.route('/', methods=['GET'])
def home():
    return "Backend Running....."


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

# Define a function to lemmatize a list of words
def lemmatize_text(text):
    words = nltk.word_tokenize(text)
    # lemmatized_words = [lemmatizer.lemmatize(word) for word in words]
    lemmatized_words = [lemmatizer.lemmatize(word) for word in words if word not in set(stopwords.words('english'))]
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


@app.route('/detectNews', methods=['POST'])
def index1():
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
        return {"model":"fakeNews","status": "success", "result": prediction}
    else:
        return {"model":"fakeNews","status": "fail"}

# Load the tokenizer
hs_tokenizer=""
try:
    hs_tokenizer=joblib.load("models/hateSpeech/tokenizer")
except FileNotFoundError as e:
    print(e.filename+"Not loaded")

#Load the models
hs_directory = ["models/hateSpeech/CNN.h5", "models/hateSpeech/RNN.h5"]
hs_models=[]
hs_results={}
for i in range(len(hs_directory)):
    try:
        x = hs_directory[i]
        hs_models.append(load_model(x))
        modelName = x[x.rindex('/')+1:x.index('.h5')]
        hs_results[modelName] = "-1"
    except OSError as e:
        print(">"+hs_directory[i]+" Not loaded")

    
def hs_predict(text):
    for i in range(len(hs_models)):
        key = list(hs_results.keys())[i]
        try:
            prediction = hs_models[i].predict(text)
            if(prediction >0.5):
               hs_results[key] = "1"
            else:
                hs_results[key] = "0"
        except:
            print("Failed to predict with model"+hs_models[i])
    return hs_results
    
@app.route('/detectSpeech', methods=['POST'])
def index2():
    speech = request.json.get('text')
    if (len(hs_models) and hs_tokenizer):
        speech = wordopt(speech)
        speech = lemmatize_text(speech)
        # Convert the article text into numerical features
        speech_seq = hs_tokenizer.texts_to_sequences([speech])
        # Pad sequences to same length
        speech_pad = pad_sequences(speech_seq, padding='post', maxlen=500)
        # Make a prediction on the padded sequence of article
        prediction = hs_predict(speech_pad)
        # Return the prediction result as a JSON response
        return {"model":"hateSpeech","status": "success", "result": prediction}
    else:
        return {"model":"hateSpeech","status": "fail"}


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
