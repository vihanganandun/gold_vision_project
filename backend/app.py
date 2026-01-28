from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# ---------------- LOAD MODEL ----------------
BASE_DIR = os.path.dirname(__file__)

model_path = os.path.join(BASE_DIR, "../saved_models/gold_price_model_new.pkl")
features_path = os.path.join(BASE_DIR, "../saved_models/feature_names_gold_price_model_new.pkl")

model = joblib.load(model_path)
feature_names = joblib.load(features_path)

print("Model loaded:", type(model))
print("Expected feature order:", feature_names)

# ---------------- CONSTANTS ----------------
TROY_OUNCE_TO_GRAMS = 31.1035
KARAT_22_FACTOR = 22 / 24  # exact
DEFAULT_PAWAN_WEIGHT = 8.0  # Sri Lanka standard

# ---------------- HELPERS ----------------
def validate_inputs(data, required_fields):
    missing = [f for f in required_fields if f not in data or data[f] is None]
    if missing:
        raise ValueError(f"Missing fields: {', '.join(missing)}")

# Map frontend field names to model feature names
FIELD_MAPPING = {
    "spx": "SPX",
    "uso": "USO",
    "slv": "SLV",
    "eurUsd": "EUR/USD"
}

def build_feature_vector(data):
    """
    Build feature array in the EXACT order used during training
    Maps frontend camelCase field names to model feature names
    """
    mapped_data = {FIELD_MAPPING.get(k, k): v for k, v in data.items()}
    return np.array([[float(mapped_data[name]) for name in feature_names]])

# ---------------- ROUTES ----------------
@app.route("/api/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json(force=True)

        # Required inputs (using frontend field names)
        validate_inputs(data, ["usdLkr", "spx", "uso", "slv", "eurUsd"])

        usd_lkr = float(data["usdLkr"])
        pawan_weight = float(data.get("pawanWeight", DEFAULT_PAWAN_WEIGHT))

        # Build model input safely
        features = build_feature_vector(data)

        # Predict USD price (per troy ounce)
        predicted_usd_per_oz = float(model.predict(features)[0])

        # ---- Currency & Unit Conversions ----
        lkr_per_oz_24k = predicted_usd_per_oz * usd_lkr
        lkr_per_gram_24k = lkr_per_oz_24k / TROY_OUNCE_TO_GRAMS

        lkr_per_gram_22k = lkr_per_gram_24k * KARAT_22_FACTOR
        lkr_per_pawan_22k = lkr_per_gram_22k * pawan_weight

        # ---- Market Insight (non-random) ----
        eur_usd = float(data.get("eurUsd", 0))
        analysis = (
            "Gold is gaining support from a weaker dollar."
            if eur_usd > 1
            else "Dollar strength is applying pressure on gold prices."
        )

        return jsonify({
            "success": True,
            "predictedUsdPerOz": round(predicted_usd_per_oz, 2),
            "lkrPerGram22K": round(lkr_per_gram_22k, 2),
            "lkrPerPawan22K": round(lkr_per_pawan_22k, 2),
            "assumptions": {
                "unit": "USD per troy ounce",
                "pawanWeightGrams": pawan_weight,
                "karat": "22K"
            },
            "analysis": analysis,
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }), 200

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": "Prediction failed", "details": str(e)}), 500


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "modelLoaded": True,
        "expectedFeatures": feature_names
    }), 200


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
