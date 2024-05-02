
from flask import Flask,render_template,request,jsonify
import pickle
import warnings
warnings.filterwarnings("ignore")
import numpy as np 
import pandas as pd 
import seaborn as sns
import matplotlib.pyplot as plt

import nltk
from sklearn.pipeline import Pipeline
from nltk.corpus import stopwords
from string import punctuation 
from sklearn.linear_model import LogisticRegression
from sklearn.feature_extraction.text import CountVectorizer,TfidfVectorizer
from sklearn import model_selection
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import f1_score
from wordcloud import WordCloud, STOPWORDS
from nltk.corpus import stopwords 
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import string
from sklearn.model_selection import train_test_split
import nltk
from nltk.corpus import stopwords
import pandas as pd
from imblearn.under_sampling import RandomUnderSampler
import pandas as pd
from sklearn.metrics import confusion_matrix, classification_report
from flask_cors import CORS
from flask import Response
nltk.download('stopwords')
nltk.download('punkt')

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


import pickle

# Load the saved model from a file
with open('model.pkl', 'rb') as file:
    model = pickle.load(file)

@app.before_request
def basic_authentication():
    if request.method.lower() == 'options':
        return Response()



@app.route('/api/data',methods=['POST'])
def get_data():
    data = request.get_json()  # Extract JSON data from the request
    question = data.get('question')  # Extract the question from the JSON data
   
    text_list = [question]

    # Assuming model.predict(text_list) returns 1 for Insincere and 0 for Sincere
    result = model.predict(text_list)
    confidence = model.predict_proba(text_list)[0][1]

    if result[0] == 1:
        result = 'Insincere'
        confidence = (confidence)*100
    else:
        result = 'Sincere'
        confidence = (1 - confidence)*100
    
        
        
    return jsonify({'result': result, 'confidence':confidence})

@app.route('/')
def hello_world():
	return 'Hello World'
@app.route('/test')
def test():
	return render_template('index.html')

@app.route('/predict',methods=['POST'])
def predict_placement():
    question = request.form.get('question')
    print(question);
    text_list = [question]

    result = model.predict(text_list)

    if result[0] == 1:
        result = 'Insincere'
    else:
        result = 'Sincere'

    return render_template('index.html',result=result)


# main driver function
if __name__ == '__main__':

	# run() method of Flask class runs the application 
	# on the local development server.
	app.run()


    
