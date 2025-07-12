# AgroPulse - Simple Setup Guide

## 🚀 Quick Start (3 Steps)

### 1. Create Virtual Environment
\`\`\`bash
# Create virtual environment
python -m venv agropulse_env

# Activate it
# Windows:
agropulse_env\Scripts\activate
# Mac/Linux:
source agropulse_env/bin/activate
\`\`\`

### 2. Install Dependencies
\`\`\`bash
pip install -r requirements.txt
\`\`\`

### 3. Add Your Model & Run
\`\`\`bash
# Place your model file
# Copy turmeric_cnn_model.h5 to models/ folder

# Run the application
python run.py
\`\`\`

## 📁 File Structure
\`\`\`
AgroPulse/
├── app.py                    # Main application
├── run.py                    # Startup script
├── requirements.txt          # Dependencies
├── models/                   # Place your model here
│   └── turmeric_cnn_model.h5 # Your CNN model
├── templates/                # HTML files
├── static/uploads/           # Auto-created for images
└── agropulse.db             # Auto-created database
\`\`\`

## 🌐 Access Points
- **Homepage**: http://127.0.0.1:5000
- **Image Analysis**: http://127.0.0.1:5000/image-analysis
- **Dashboard**: http://127.0.0.1:5000/dashboard
- **History**: http://127.0.0.1:5000/history

## ✅ What Works
- ✅ CNN model integration
- ✅ Image upload and analysis
- ✅ Disease prediction with confidence scores
- ✅ Treatment recommendations
- ✅ Results dashboard
- ✅ Prediction history

## 🔧 Troubleshooting
- **Model not loading**: Ensure file is named exactly `turmeric_cnn_model.h5` in `models/` folder
- **Port in use**: Change port in run.py: `app.run(port=5001)`
- **TensorFlow issues**: Try: `pip install tensorflow==2.13.0`

## 🛑 Stop Application
Press `Ctrl+C` in terminal to stop the server
