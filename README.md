# AgroPulse - AI-Powered Agricultural Disease Prediction Platform
Developed a smart farming platform using RNNs for Bacillus prediction, CNNs for leaf disease detection, and Random Forest for disease risk prediction, based on IoT-based environmental data. Created a web dashboard for real-time trends and fertilizer recommendations.


## 📋 Table of Contents

- [About The Project](#about-the-project)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [Machine Learning Models](#machine-learning-models)


## 🎯 About The Project

![Homepage Screenshot](Homepage.png)

AgroPulse is an innovative AI-powered agricultural platform specifically designed for **turmeric cultivation**. It leverages advanced machine learning algorithms to help farmers predict crop diseases, analyze soil health, and receive actionable recommendations for optimal crop management.

### 🌟 Why AgroPulse?

- **Early Disease Detection**: Predict diseases before they become critical
- **Soil Health Analysis**: Monitor and optimize soil conditions
- **Data-Driven Decisions**: Make informed farming choices based on AI insights
- **Multi-Language Support**: Available in English, Hindi, and Marathi
- **Mobile-Friendly**: Access from anywhere, anytime

## ✨ Features

### 🔬 Core Functionality
- **Disease Prediction**: AI-powered analysis of crop health conditions
- **Soil Health Monitoring**: Bacteria count prediction and soil analysis
- **Image-Based Diagnosis**: Upload plant photos for instant disease detection
- **Environmental Analysis**: Weather and soil condition assessment

### 📊 Analytics & Insights
- **Real-time Dashboard**: Visual analytics and trend monitoring
- **Historical Tracking**: Track predictions and outcomes over time
- **PDF Reports**: Generate detailed analysis reports
- **Recommendation Engine**: Personalized treatment suggestions

### 🌐 User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Progressive Web App**: Offline functionality and app-like experience
- **Multi-Language Interface**: English, Hindi, Marathi support
- **Intuitive UI**: Step-by-step guided prediction process

## 🛠 Technology Stack

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Hooks
- **Charts**: Recharts
- **PDF Generation**: jsPDF

### Backend & AI/ML
- **Web Framework**: Flask (Python)
- **Machine Learning**: 
  - TensorFlow/Keras (Deep Learning)
  - scikit-learn (Traditional ML)
  - OpenCV (Image Processing)
- **Models**:
  - Random Forest Classifier (Disease Prediction)
  - LSTM Neural Network (Soil Analysis)
  - CNN (Image Classification)

### Database & Storage
- **Database**: SQLite
- **File Storage**: Local file system
- **Data Format**: CSV, JSON

### Development Tools
- **Package Manager**: npm, pip
- **Code Quality**: ESLint, Prettier
- **Version Control**: Git
- **Deployment**: Vercel (Frontend), Heroku (Backend)

## 🚀 Getting Started

### Prerequisites

Before running AgroPulse, ensure you have the following installed:

- **Node.js** (v18.0 or higher)
- **Python** (v3.8 or higher)
- **npm** or **yarn**
- **pip** (Python package manager)

### System Requirements

- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: 2GB free space
- **OS**: Windows 10+, macOS 10.15+, or Linux

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/agropulse.git
cd agropulse
```

### 2. Frontend Setup (Next.js)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 3. Backend Setup (Python/Flask)

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\\Scripts\\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Start Flask server
python run.py
```

The backend API will be available at `http://127.0.0.1:5000`

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:5000
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
```

## 🎮 Usage

### Step 1: Access the Application
Navigate to `http://localhost:3000` in your web browser.

![Login Screen](Login Screen.png)

### Step 2: Input Environmental Data
Fill in the prediction form with:
- Soil pH level
- Temperature and humidity
- Rainfall data
- Irrigation type
- Fertilizer information
- Season and UV index

![Prediction Form](images/prediction-form.png)

### Step 3: Get AI Predictions
Receive instant analysis including:
- Disease probability assessment
- Soil health metrics
- Treatment recommendations

![Results Dashboard](images/results-dashboard.png)

### Step 4: Image Analysis (Optional)
Upload plant photos for visual disease detection:

![Image Analysis](images/image-analysis.png)

### Step 5: Track History
Monitor your predictions and outcomes over time:

![History Tracker](images/history-tracker.png)

## 📡 API Documentation

### Disease Prediction Endpoint

```http
POST /api/predict-turmeric
Content-Type: application/json

{
  "ph": 6.5,
  "temperature": 28.5,
  "rainfall": 150.0,
  "humidity": 75.0,
  "soil_moisture": 45.0,
  "irrigation_type": "drip",
  "fertilizer_type": "organic",
  "season": "monsoon",
  "uv_index": 7.2
}
```

**Response:**
```json
{
  "prediction": "mild",
  "probability": 0.73,
  "recommendations": [
    "Apply organic fungicide",
    "Improve drainage",
    "Monitor soil moisture"
  ]
}
```

### Soil Health Analysis Endpoint

```http
POST /api/predict-bacillus
Content-Type: application/json

{
  "ph": 6.8,
  "temperature": 26.0,
  "moisture": 40.0,
  "organic_matter": 3.2
}
```

**Response:**
```json
{
  "bacteria_count": 1250000,
  "health_status": "good",
  "recommendations": [
    "Maintain current soil conditions",
    "Consider organic amendments"
  ]
}
```

### Image Analysis Endpoint

```http
POST /api/analyze-image
Content-Type: multipart/form-data

{
  "image": [binary file data]
}
```


## 📸 Screenshots

### Homepage
![Homepage](images/homepage-full.png)

### Prediction Interface
![Prediction Form](images/prediction-interface.png)

### Results Dashboard
![Dashboard](images/dashboard-analytics.png)

### Mobile View
![Mobile Interface](images/mobile-view.png)

### Image Analysis
![Image Analysis Feature](images/image-analysis-feature.png)

## 🧠 Machine Learning Models

### 1. Disease Prediction Model
- **Algorithm**: Random Forest Classifier
- **Features**: 8 environmental parameters
- **Accuracy**: 91.2%
- **Classes**: None, Mild, Moderate, Severe
- **Training Data**: 10,000+ samples

### 2. Soil Health Model
- **Algorithm**: LSTM Neural Network
- **Features**: Soil conditions + environmental factors
- **Accuracy**: 87.5%
- **Output**: Bacteria count (CFU/g)
- **Training Data**: 5,000+ soil samples

### 3. Image Classification Model
- **Algorithm**: Convolutional Neural Network (CNN)
- **Architecture**: ResNet-50 based
- **Accuracy**: 89.3%
- **Classes**: 12 disease types
- **Training Data**: 15,000+ plant images

### Model Performance Metrics

| Model | Accuracy | Precision | Recall | F1-Score |
|-------|----------|-----------|--------|----------|
| Disease Prediction | 91.2% | 89.8% | 90.5% | 90.1% |
| Soil Health | 87.5% | 86.2% | 88.1% | 87.1% |
| Image Classification | 89.3% | 88.7% | 89.9% | 89.3% |
