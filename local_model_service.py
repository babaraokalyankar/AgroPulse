import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from flask import Flask, request, jsonify
from flask_cors import CORS
import io
from PIL import Image
import json

app = Flask(__name__)
CORS(app)

# Global variables for model and class names
model = None
class_names = []

def load_model_and_classes():
    global model, class_names
    
    # Load your trained model
    model_path = "turmeric_cnn_model.h5"  # Update this path to your model
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found: {model_path}")
    
    model = tf.keras.models.load_model(model_path)
    print(f"✅ Model loaded successfully from {model_path}")
    
    # Define your class names (update these based on your model's classes)
    class_names = ["Healthy", "Leaf Spot", "Leaf Blight", "Rhizome Rot", "Root Rot"]
    print(f"📋 Classes: {class_names}")

def preprocess_image(image_file):
    """Preprocess the uploaded image for model prediction"""
    try:
        # Open image using PIL
        image = Image.open(io.BytesIO(image_file.read()))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Resize to model input size
        image = image.resize((150, 150))
        
        # Convert to array and normalize
        img_array = img_to_array(image)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = img_array / 255.0
        
        return img_array
    except Exception as e:
        raise ValueError(f"Error preprocessing image: {str(e)}")

def get_recommendations(disease_class):
    """Get treatment recommendations based on disease class"""
    recommendations = {
        "Healthy": [
            "Continue with regular watering schedule of 2-3 times per week.",
            "Maintain organic mulch around plants to preserve soil moisture.",
            "Apply balanced NPK fertilizer (5-5-5) every 2-3 months.",
            "Monitor for early signs of pest activity with weekly inspections.",
            "Ensure adequate sunlight (6-8 hours daily) for optimal growth."
        ],
        "Leaf Spot": [
            "Remove and destroy infected leaves immediately to prevent spread.",
            "Apply copper-based fungicide every 7-10 days until symptoms subside.",
            "Improve air circulation by proper spacing between plants (30-45cm apart).",
            "Avoid overhead irrigation; water at soil level only.",
            "Apply neem oil spray as a preventive measure every 14 days.",
            "Ensure proper drainage to prevent water stagnation."
        ],
        "Leaf Blight": [
            "Remove severely infected plants and destroy them completely.",
            "Apply systemic fungicide containing azoxystrobin or propiconazole.",
            "Maintain proper drainage in the field to prevent water stagnation.",
            "Rotate crops with non-host plants for at least 2 years.",
            "Apply Trichoderma-based bio-fungicides to soil before planting.",
            "Reduce plant density to improve air circulation."
        ],
        "Rhizome Rot": [
            "Immediately isolate affected plants to prevent disease spread.",
            "Drench soil with copper oxychloride solution (2g/liter water).",
            "Improve drainage by adding organic matter and sand to soil.",
            "Treat seed rhizomes with Trichoderma viride before planting.",
            "Reduce irrigation frequency and monitor soil moisture levels.",
            "Apply carbendazim fungicide to surrounding healthy plants."
        ],
        "Root Rot": [
            "Remove affected plants including all root material immediately.",
            "Apply fungicide containing metalaxyl or fosetyl-aluminum to surrounding plants.",
            "Improve soil drainage by adding sand or perlite to heavy soils.",
            "Avoid excessive nitrogen fertilization which promotes soft growth.",
            "Implement crop rotation with non-susceptible crops for 3-4 years.",
            "Use raised beds to improve drainage in heavy clay soils."
        ]
    }
    
    return recommendations.get(disease_class, [
        "Consult with a plant pathologist for accurate diagnosis.",
        "Monitor plant health closely and document any changes.",
        "Ensure proper growing conditions including adequate sunlight and water.",
        "Consider soil testing to check for nutrient deficiencies."
    ])

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        image_file = request.files['image']
        if image_file.filename == '':
            return jsonify({'error': 'No image file selected'}), 400
        
        # Preprocess the image
        processed_image = preprocess_image(image_file)
        
        # Make prediction
        predictions = model.predict(processed_image)
        predicted_class_index = np.argmax(predictions[0])
        predicted_class = class_names[predicted_class_index]
        
        # Get confidence scores for all classes
        confidence_scores = {}
        for i, class_name in enumerate(class_names):
            confidence_scores[class_name] = float(predictions[0][i])
        
        # Get recommendations
        recommendations = get_recommendations(predicted_class)
        
        # Prepare response
        response = {
            'disease_class': predicted_class,
            'confidence_scores': confidence_scores,
            'recommendations': recommendations,
            'classification_report': f"Predicted: {predicted_class} with {confidence_scores[predicted_class]*100:.2f}% confidence"
        }
        
        print(f"🔍 Prediction: {predicted_class} ({confidence_scores[predicted_class]*100:.2f}%)")
        
        return jsonify(response)
        
    except Exception as e:
        print(f"❌ Error during prediction: {str(e)}")
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'classes': class_names
    })

if __name__ == '__main__':
    try:
        print("🚀 Starting AgroPulse CNN Model Service...")
        load_model_and_classes()
        print("🌐 Service running on http://localhost:8000")
        print("📡 Ready to receive image analysis requests!")
        app.run(host='0.0.0.0', port=8000, debug=True)
    except Exception as e:
        print(f"❌ Failed to start service: {str(e)}")
