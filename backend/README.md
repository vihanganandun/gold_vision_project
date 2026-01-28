# Gold Vision Backend API

This is a Flask-based REST API that serves predictions from the trained Random Forest model for gold price forecasting.

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Start the Backend Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### POST /api/predict

Generates a gold price prediction based on market indicators.

**Request:**
```json
{
  "spx": 4780.20,
  "uso": 75.50,
  "slv": 23.40,
  "eurUsd": 1.09,
  "usdLkr": 309.03
}
```

**Response:**
```json
{
  "success": true,
  "predictedUsd": 2150.45,
  "lkrPawan": 5280.50,
  "lkrGram": 660.06,
  "analysis": "Market analysis description...",
  "timestamp": "2026-01-28T10:30:00"
}
```

### GET /api/health

Health check endpoint to verify the API and model are loaded.

**Response:**
```json
{
  "status": "ok",
  "model_loaded": true,
  "features": ["SPX", "USO", "SLV", "EUR/USD"]
}
```

## Model Information

- **Algorithm**: Random Forest Regressor (100 estimators)
- **R² Score**: 0.9884
- **Training Data**: 2,527 historical records (2015-2025)
- **Features**: S&P 500, US Oil, Silver, EUR/USD Exchange Rate
- **Model File**: `saved_models/gold_price_model_2025.pkl`

## Frontend Integration

The React frontend in `src/pages/index.tsx` is configured to call `http://localhost:5000/api/predict` when the user clicks "Generate Prediction".

Make sure:
1. Backend is running on port 5000
2. Frontend is running on port 8080
3. Both services are running simultaneously for full functionality

## Troubleshooting

- **Connection refused**: Ensure backend is running with `python app.py`
- **CORS errors**: Flask-CORS is enabled for all origins
- **Model not found**: Verify the saved model files exist in `saved_models/`
