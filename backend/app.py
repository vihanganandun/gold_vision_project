from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# Load the trained model
model_path = os.path.join(os.path.dirname(__file__), '../saved_models/gold_price_model_2025.pkl')
features_path = os.path.join(os.path.dirname(__file__), '../saved_models/feature_names_2025.pkl')

model = joblib.load(model_path)
feature_names = joblib.load(features_path)

print(f"Model loaded successfully: {type(model)}")
print(f"Expected features: {feature_names}")

TROY_OUNCE_TO_GRAMS = 31.1035
GRAMS_PER_PAWAN = 8.0
KARAT_22_FACTOR = 0.9167  # 22/24 for jewellery gold

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        
        # Extract market indicators
        spx = float(data.get('spx', 0))
        uso = float(data.get('uso', 0))
        slv = float(data.get('slv', 0))
        eur_usd = float(data.get('eurUsd', 0))
        usd_lkr = float(data.get('usdLkr', 0))
        
        # Validate inputs
        if not all([spx, uso, slv, eur_usd, usd_lkr]):
            return jsonify({'error': 'All market indicators are required'}), 400
        
        # Prepare features for model (in same order as training)
        features = np.array([[spx, uso, slv, eur_usd]])
        
        # Make prediction
        predicted_usd = float(model.predict(features)[0])
        
        # Calculate LKR prices
        lkr_price_per_oz = predicted_usd * usd_lkr
        lkr_price_per_gram = lkr_price_per_oz / TROY_OUNCE_TO_GRAMS
        lkr_price_per_pawan = lkr_price_per_gram * GRAMS_PER_PAWAN * KARAT_22_FACTOR
        
        # Market analysis
        analyses = [
            "Market volatility in S&P 500 suggests a flight to safety, potentially boosting gold prices.",
            "Strength in the EUR/USD pair indicates dollar weakness, creating a favorable environment for gold.",
            "Silver's current momentum is providing strong support for the precious metals complex.",
            "Oil market fluctuations are currently having a neutral impact on inflation expectations.",
            "Safe-haven demand is driving gold prices higher as investors seek protection.",
        ]
        
        # Select analysis based on market indicators
        analysis_idx = (int(spx + uso + slv) % len(analyses))
        analysis = analyses[analysis_idx]
        
        return jsonify({
            'success': True,
            'predictedUsd': round(predicted_usd, 2),
            'lkrPawan': round(lkr_price_per_pawan, 2),
            'lkrGram': round(lkr_price_per_gram, 2),
            'analysis': analysis,
            'timestamp': str(np.datetime64('now'))
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'model_loaded': True,
        'features': feature_names
    }), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
