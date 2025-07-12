# AgroPulse Flask Application Setup Guide

## 📁 Project Structure
\`\`\`
AgroPulse/
├── app.py                 # Main Flask application
├── run.py                 # Application runner with setup
├── requirements.txt       # Python dependencies
├── models/               # 🔴 PLACE YOUR CNN MODEL HERE
│   └── turmeric_cnn_model.h5  # Your trained model
├── templates/            # HTML templates
├── static/
│   ├── uploads/         # Uploaded images storage
│   ├── css/
│   └── js/
└── agropulse.db         # SQLite database (auto-created)
\`\`\`

## 🔧 Installation Steps

### 1. Install Python Dependencies
\`\`\`bash
pip install -r requirements.txt
\`\`\`

### 2. Place Your CNN Model
- Copy your `turmeric_cnn_model.h5` file to the `models/` folder
- The application will automatically detect and load it

### 3. Run the Application
\`\`\`bash
python run.py
\`\`\`

### 4. Access the Website
- Open your browser and go to: `http://localhost:5000`
- The homepage will show model status

## 🎯 CNN Model Integration

### Model Requirements
- **File Name**: `turmeric_cnn_model.h5`
- **Location**: `models/turmeric_cnn_model.h5`
- **Input Shape**: 150x150x3 (RGB images, 150x150 pixels)
- **Output Classes**: 5 classes [Healthy, Leaf Spot, Leaf Blight, Rhizome Rot, Root Rot]

### How It Works
1. **Upload**: User uploads plant image via web interface
2. **Preprocessing**: Image resized to 150x150, normalized to [0,1]
3. **Prediction**: CNN model predicts disease class with confidence scores
4. **Results**: Disease classification + treatment recommendations
5. **Storage**: Results saved to database + accessible via dashboard

## 🚀 Features Available

### ✅ Active Features
- **Disease Prediction**: Soil parameter analysis
- **Bacillus Analysis**: Soil bacteria count prediction  
- **Image Analysis**: CNN-based plant disease detection
- **Dashboard**: Visual analytics and statistics
- **History**: Complete prediction timeline
- **PDF Export**: Generate analysis reports
- **User Authentication**: Login/register system

### 🔄 Real-time CNN Integration
- Automatic model loading on startup
- Real image preprocessing and prediction
- Confidence scores for all disease classes
- Treatment recommendations based on predictions
- Results automatically saved to dashboard

## 🛠️ Troubleshooting

### Model Not Loading
- Ensure file is named exactly: `turmeric_cnn_model.h5`
- Check file is in `models/` folder
- Verify TensorFlow installation: `pip install tensorflow==2.13.0`

### Port Already in Use
\`\`\`bash
# Run on different port
python -c "from app import app; app.run(port=5001)"
\`\`\`

### Database Issues
\`\`\`bash
# Reset database
rm agropulse.db
python run.py
\`\`\`

## 📊 Model Performance
- The application will display model status on homepage
- Green indicator = Model loaded successfully
- Yellow indicator = Model not found/loaded

## 🔐 Security Notes
- Change SECRET_KEY in production
- Use environment variables for sensitive data
- Enable HTTPS for production deployment

## 📱 Access Points
- **Homepage**: `http://localhost:5000`
- **Predictions**: `http://localhost:5000/predict`
- **Image Analysis**: `http://localhost:5000/image-analysis`
- **Dashboard**: `http://localhost:5000/dashboard`
- **History**: `http://localhost:5000/history`
