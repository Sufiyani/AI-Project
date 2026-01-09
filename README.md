🚗 AI Car Price Prediction System
A machine learning-powered web application that predicts used car prices based on user inputs and visualizes year-by-year price trends for depreciation analysis.

✨ Key Features

🔮 Smart Price Prediction - ML-powered accurate car price estimation
📊 Price Trend Analysis - Interactive year-wise depreciation graphs
🏙️ Multi-City Support - Price predictions across different locations
⚡ Fast & Interactive - Real-time predictions with modern UI
🎯 User-Friendly - Simple input form with instant results


🧠 Machine Learning Models
The system uses multiple algorithms and selects the best performer:

Linear Regression - Baseline model for price trends
Random Forest Regressor - Ensemble learning for robust predictions
Gradient Boosting Regressor - Advanced boosting for accuracy

Pipeline: Data Preprocessing → Feature Encoding → Scaling → Model Training → Best Model Selection

📈 Price Trend Visualization
Example: For a 2015 car, the system generates a comprehensive graph showing:

Historical price depreciation
Year-over-year value changes
Future price projections

This helps buyers and sellers understand market trends and make informed decisions.

🛠️ Tech Stack
Frontend

React.js - Component-based UI framework
Vite - Next-generation build tool
Tailwind CSS - Utility-first styling
Chart.js/Recharts - Interactive data visualizations

Backend

Python 3.x - Core backend language
Flask - Lightweight web framework
REST API - Clean endpoint architecture

Machine Learning

Scikit-learn - ML algorithms and tools
Pandas - Data manipulation
NumPy - Numerical computing

📂 Project Structure
AI-Project/
│
├── backend/                    # Flask backend
│   ├── app.py                 # Main Flask application
│   ├── chatbot.py             # chatbot
│   └── requirements.txt       # Python dependencies
│
├── frontend/vite-project/     # React frontend
│   ├── src/                   # Source files
│   ├── public/                # Static assets
│   └── package.json           # Node dependencies
│
├── data/                      # Training datasets
├── models/                    # Trained ML models
├── visualizations/            # Generated graphs
│
├── train-model.py            # Model training script
├── data-preprocessing.py     # Data cleaning & feature engineering
├── test-predictions.py       # Model testing & validation
│
└── README.md                 # Project documentation

🚀 How to Run
Prerequisites

Python 3.8 or higher
Node.js 16 or higher
npm or yarn

Backend Setup
# Navigate to project root
cd AI-Project

# Install Python dependencies
pip install -r requirements.txt

# Train the model (first time only)
python train-model.py

# Start Flask server
python app.py

The backend will run on http://localhost:5000

Frontend Setup

# Navigate to frontend directory
cd frontend/vite-project

# Install dependencies
npm install

# Start development server
npm run dev

The frontend will run on http://localhost:5173

🎯 Use Cases

🚙 Car Buyers - Get fair market value before purchasing
💰 Sellers - Price your car competitively
📊 Market Analysis - Understand depreciation trends
🎓 Academic Projects - Learn ML implementation in real-world scenarios
💼 Dealers - Quick price estimations for inventory

👨‍💻 Author
Sufiyan Imran

GitHub: https://github.com/sufiyanimran
LinkedIn: https://linkedin.com/in/sufiyanimran
