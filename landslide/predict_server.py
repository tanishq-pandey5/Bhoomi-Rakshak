import http.server
import json
import os
import pickle
import pandas as pd
import numpy as np
from sklearn.ensemble import HistGradientBoostingClassifier

# Configuration
PORT = 8000
DATASET_PATH = 'landslide/SIH26001_landslide_risk_dataset_50000.csv'
MODEL_PATH = 'landslide/landslide_model_sklearn.pkl'

# Features mapping (numerical features used for model)
FEATURE_COLS = [
  'latitude', 'longitude', 'rainfall_3h_mm', 'rainfall_24h_mm', 'rainfall_7d_mm',
  'rainfall_forecast_72h_mm', 'soil_moisture_pct', 'soil_depth_cm', 'slope_angle_deg',
  'elevation_m', 'ndvi', 'lithology_risk', 'distance_to_road_m', 'distance_to_stream_m',
  'drainage_density_km_km2', 'curvature_index', 'road_cutting_index', 'seismicity_index',
  'historical_landslides_5yr', 'crack_report_count', 'sensor_vibration_mm_s', 'risk_score'
]
TARGET_COL = 'landslide_event_next_72h'

model = None

# Map string categories to numeric levels
lithology_mapping = {'low': 0, 'medium': 1, 'high': 2}

def train_model():
    global model
    print("Training scikit-learn fallback model on dataset...")
    if not os.path.exists(DATASET_PATH):
        raise FileNotFoundError(f"Dataset not found at {DATASET_PATH}. Cannot train model.")
    
    # Load dataset
    df = pd.read_csv(DATASET_PATH)
    
    # Preprocess categorical lithology column
    df['lithology_risk'] = df['lithology_risk'].astype(str).str.lower().map(lithology_mapping).fillna(0)
    
    # Drop rows with NaN in key features or target
    df = df.dropna(subset=FEATURE_COLS + [TARGET_COL])
    
    X = df[FEATURE_COLS]
    y = df[TARGET_COL]
    
    print(f"Training set size: {X.shape[0]} rows, {X.shape[1]} features.")
    
    # Train Gradient Boosting Classifier
    clf = HistGradientBoostingClassifier(
        max_iter=150, 
        learning_rate=0.05, 
        max_depth=5, 
        random_state=42
    )
    clf.fit(X, y)
    
    # Save model
    with open(MODEL_PATH, 'wb') as f:
        pickle.dump(clf, f)
    
    model = clf
    print(f"Model trained and saved to {MODEL_PATH}")

# Load or Train Model on Startup
if os.path.exists(MODEL_PATH):
    try:
        with open(MODEL_PATH, 'rb') as f:
            model = pickle.load(f)
        print("Model loaded successfully from cache.")
    except Exception as e:
        print(f"Error loading cached model: {e}. Re-training...")
        train_model()
else:
    train_model()


class LandslidePredictorHandler(http.server.BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        # Handle CORS Preflight request
        self.send_response(200, "ok")
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type")
        self.end_headers()

    def do_POST(self):
        if self.path == '/predict':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                
                # Preprocess client-side lithology_risk (supports number or string)
                lith = data.get('lithology_risk', 'medium')
                if isinstance(lith, str):
                    lith_val = lithology_mapping.get(lith.lower(), 1)
                else:
                    lith_val = int(lith)

                # Extract input parameters with fallbacks
                inputs = {
                    'latitude': float(data.get('latitude', 25.57)), # default ML centroid
                    'longitude': float(data.get('longitude', 91.88)),
                    'rainfall_3h_mm': float(data.get('rainfallIntensity', 42.0)),
                    'rainfall_24h_mm': float(data.get('rainfall24h', 120.0)),
                    'rainfall_7d_mm': float(data.get('rainfall7d', 280.0)),
                    'rainfall_forecast_72h_mm': float(data.get('rainfall72hForecast', 180.0)),
                    'soil_moisture_pct': float(data.get('soilMoisture', 65.0)),
                    'soil_depth_cm': float(data.get('soilDepth', 1.2)) * 100.0, # convert meters to cm
                    'slope_angle_deg': float(data.get('slopeAngle', 32.0)),
                    'elevation_m': float(data.get('elevation', 850.0)),
                    'ndvi': float(data.get('ndvi', 0.4)),
                    'lithology_risk': float(lith_val),
                    'distance_to_road_m': float(data.get('distance_to_road_m', 250.0)),
                    'distance_to_stream_m': float(data.get('distanceToStream', 120.0)),
                    'drainage_density_km_km2': float(data.get('drainageDensity', 1.8)),
                    'curvature_index': float(data.get('curvature_index', 0.1)),
                    'road_cutting_index': float(data.get('road_cutting_index', 1.0)),
                    'seismicity_index': float(data.get('seismicityIndex', 2.6)),
                    'historical_landslides_5yr': float(data.get('historicalLandslides', 18.0)),
                    'crack_report_count': float(data.get('crackReports', 6.0)),
                    'sensor_vibration_mm_s': float(data.get('sensorVibration', 3.2)),
                    'risk_score': float(data.get('risk_score', 0.78)) # base risk factor
                }

                # Construct feature array in correct column order
                features = [inputs[col] for col in FEATURE_COLS]
                features_array = np.array([features])
                
                # Predict probability of class 1 (landslide event next 72h)
                prob = model.predict_proba(features_array)[0][1]
                prob_percent = round(prob * 100)
                
                # Determine risk level based on percentage
                level = 'Low'
                if prob_percent <= 20: level = 'Very Low'
                elif prob_percent <= 40: level = 'Low'
                elif prob_percent <= 60: level = 'Moderate'
                elif prob_percent <= 80: level = 'High'
                elif prob_percent <= 95: level = 'Very High'
                else: level = 'Critical'
                
                response = {
                    'status': 'success',
                    'predicted_risk_percentage': prob_percent,
                    'predicted_risk_level': level,
                    'features_used': inputs
                }
                
                # Send Success Response
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(response).encode('utf-8'))
                
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'status': 'error', 'message': str(e)}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

def run(server_class=http.server.HTTPServer, handler_class=LandslidePredictorHandler):
    server_address = ('', PORT)
    httpd = server_class(server_address, handler_class)
    print(f"Bhoomi Rakshak prediction API server running on port {PORT}...")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    print("Server stopped.")

if __name__ == '__main__':
    run()
