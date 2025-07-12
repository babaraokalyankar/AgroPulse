from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename
import os
import json
import numpy as np
from datetime import datetime
import uuid

# Import TensorFlow for CNN model
try:
    import tensorflow as tf
    from tensorflow.keras.preprocessing.image import load_img, img_to_array
    TF_AVAILABLE = True
except ImportError:
    TF_AVAILABLE = False
    print("TensorFlow not installed. Image analysis will be disabled.")

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-change-this'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///agropulse.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'static/uploads'

db = SQLAlchemy(app)

# Ensure directories exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs('models', exist_ok=True)

# Global variables for CNN model
cnn_model = None
class_names = ['Healthy', 'Leaf Spot', 'Leaf Blight', 'Rhizome Rot', 'Root Rot']

def load_cnn_model():
    """Load the trained CNN model"""
    global cnn_model
    if not TF_AVAILABLE:
        return False
        
    try:
        model_path = 'models/turmeric_cnn_model.h5'
        if os.path.exists(model_path):
            cnn_model = tf.keras.models.load_model(model_path)
            print("✅ CNN Model loaded successfully")
            return True
        else:
            print("❌ Model file not found. Place turmeric_cnn_model.h5 in models/ folder")
            return False
    except Exception as e:
        print(f"❌ Error loading CNN model: {str(e)}")
        return False

def predict_with_cnn(image_path):
    """Make prediction using the loaded CNN model"""
    global cnn_model, class_names
    
    if cnn_model is None:
        raise ValueError("CNN model is not loaded")
    
    try:
        # Load and preprocess image
        img = load_img(image_path, target_size=(150, 150))
        img_array = img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = img_array / 255.0
        
        # Make prediction
        predictions = cnn_model.predict(img_array, verbose=0)
        predicted_class_index = np.argmax(predictions[0])
        predicted_class = class_names[predicted_class_index]
        
        # Get confidence scores
        confidence_scores = {}
        for i, class_name in enumerate(class_names):
            confidence_scores[class_name] = float(predictions[0][i])
        
        # Get recommendations
        recommendations = get_recommendations(predicted_class)
        
        return {
            'disease_class': predicted_class,
            'confidence_scores': confidence_scores,
            'recommendations': recommendations
        }
        
    except Exception as e:
        raise ValueError(f"Error during prediction: {str(e)}")

def get_recommendations(disease_class):
    """Get treatment recommendations"""
    recommendations = {
        "Healthy": [
            "Continue regular watering 2-3 times per week",
            "Apply balanced NPK fertilizer every 2-3 months",
            "Monitor for early signs of pest activity"
        ],
        "Leaf Spot": [
            "Remove infected leaves immediately",
            "Apply copper-based fungicide every 7-10 days",
            "Improve air circulation between plants"
        ],
        "Leaf Blight": [
            "Remove severely infected plants completely",
            "Apply systemic fungicide",
            "Improve field drainage"
        ],
        "Rhizome Rot": [
            "Isolate affected plants immediately",
            "Apply copper oxychloride solution",
            "Improve soil drainage"
        ],
        "Root Rot": [
            "Remove affected plants with all root material",
            "Apply appropriate fungicide to surrounding plants",
            "Improve soil drainage significantly"
        ]
    }
    
    return recommendations.get(disease_class, [
        "Consult with a plant pathologist",
        "Monitor plant health closely",
        "Ensure proper growing conditions"
    ])

# Database Models
class Prediction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.String(36), nullable=False)
    prediction_type = db.Column(db.String(20), nullable=False)
    input_data = db.Column(db.Text, nullable=False)
    result_data = db.Column(db.Text, nullable=False)
    image_filename = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Helper Functions
def get_session_id():
    if 'session_id' not in session:
        session['session_id'] = str(uuid.uuid4())
    return session['session_id']

# Routes
@app.route('/')
def index():
    model_status = cnn_model is not None
    return render_template('index.html', model_loaded=model_status)

@app.route('/image-analysis')
def image_analysis():
    model_status = cnn_model is not None
    return render_template('image_analysis.html', model_loaded=model_status)

@app.route('/analyze-image', methods=['POST'])
def analyze_image():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image uploaded'}), 400
            
        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No image selected'}), 400
        
        # Save uploaded file
        filename = secure_filename(file.filename)
        unique_filename = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{filename}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(filepath)
        
        # Analyze with CNN model
        if cnn_model is not None:
            result = predict_with_cnn(filepath)
        else:
            return jsonify({'error': 'CNN model not loaded'}), 500
        
        result['image_path'] = unique_filename
        
        # Save prediction to database
        prediction = Prediction(
            session_id=get_session_id(),
            prediction_type='image',
            input_data=json.dumps({'filename': unique_filename}),
            result_data=json.dumps(result),
            image_filename=unique_filename
        )
        db.session.add(prediction)
        db.session.commit()
        
        return jsonify(result)
        
    except Exception as e:
        print(f"Error in image analysis: {str(e)}")
        return jsonify({'error': f'Analysis failed: {str(e)}'}), 500

@app.route('/dashboard')
def dashboard():
    predictions = Prediction.query.filter_by(session_id=get_session_id()).order_by(Prediction.created_at.desc()).limit(10).all()
    
    processed_predictions = []
    for pred in predictions:
        processed_predictions.append({
            'id': pred.id,
            'type': pred.prediction_type,
            'result_data': json.loads(pred.result_data),
            'created_at': pred.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'image_filename': pred.image_filename
        })
    
    return render_template('dashboard.html', predictions=processed_predictions)

@app.route('/history')
def history():
    predictions = Prediction.query.filter_by(session_id=get_session_id()).order_by(Prediction.created_at.desc()).all()
    
    history_data = []
    for pred in predictions:
        history_data.append({
            'id': pred.id,
            'type': pred.prediction_type,
            'result_data': json.loads(pred.result_data),
            'timestamp': pred.created_at.isoformat(),
            'image_filename': pred.image_filename
        })
    
    return render_template('history.html', history=history_data)

# Initialize database and load model
@app.before_first_request
def initialize_app():
    db.create_all()
    load_cnn_model()

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)
