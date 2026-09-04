# Bhoomi Rakshak (भूमि रक्षक)
### AI-GIS Landslide Early Warning & Tactical Hazard Surveillance System

Bhoomi Rakshak is an operational landslide hazard monitoring and early warning system specifically engineered for the high-risk Himalayan and Indo-Burma terrain corridors across the 8 North-Eastern states of India (Arunachal Pradesh, Assam, Manipur, Meghalaya, Mizoram, Nagaland, Sikkim, Tripura).

---

## 🌟 Key Features

1. **Precision Machine Learning Pipeline**:
   - LightGBM gradient-boosted classification model trained on 50,000 geological, meteorological, and sensor readings.
   - Evaluates real-time shear stress factors including 24-hour antecedent rainfall, 72-hour forecast precipitation, soil moisture saturation, slope gradient, lithology, and road disturbance index.

2. **Official Survey of India (SOI) Compliant GIS Map**:
   - High-definition interactive map with photorealistic Satellite Hybrid, Topographic Elevation Contours, National OSM, and Tactical Dark Canvas modes.
   - Offline point-in-polygon state boundary detection for high-speed resolution across all Indian states and Union Territories.
   - Region filtering: Active landslide risk inference for the 8 North-Eastern states; outside locations cleanly display only coordinates, state, and district while nullifying unmonitored metrics.

3. **Interactive Brand Story Film & Scroll Experience**:
   - Cinematic scroll-driven narrative showcasing the operational purpose, sensor hardware, and early warning principles of Bhoomi Rakshak.
   - Direct seamless integration into the Live GIS Dashboard.

---

## 📁 Project Architecture & File Organization

```
Bhoomi Rakshak Backend /
├── main.py                                  # FastAPI application & ML prediction engine
├── landslide_model.pkl                      # Pre-trained LightGBM classification model
├── model_metadata.json                      # Model feature sequence and encoding specifications
├── SIH26001_landslide_risk_dataset_50000.csv# Reference dataset of 50,000 geological risk vectors
├── india_states_soi.geojson                 # Official Survey of India state boundary polygons
├── india_national_boundary.geojson          # Sovereign national outer boundary
├── index.html                               # Live GIS Landslide Monitoring Dashboard
├── requirements.txt                         # Python dependencies
├── .gitignore                               # Environment & system file exclusions
└── scroll-site/                             # Cinematic Scroll Story & Visual Brand Experience
    ├── index.html                           # Scroll film interactive landing page
    ├── dashboard.html                       # Integrated GIS dashboard within story site
    ├── main.js                              # Scroll orchestration & frame scrubbing logic
    ├── video1.mp4                           # Background cinematic aerial video 1
    ├── video2.mp4                           # Background cinematic sensor feed video 2
    └── website-images/                      # WebP gallery stills, sensor diagrams & visual assets
```

---

## 🚀 Quickstart & Setup

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Launch the System
```bash
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Access the Applications
- **Live AI-GIS Dashboard**: [http://localhost:8000/](http://localhost:8000/)
- **Cinematic Story Experience**: [http://localhost:8000/story](http://localhost:8000/story)
- **Interactive API Documentation (Swagger)**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 📡 Core API Endpoints

- `GET /` — Serves the primary Bhoomi Rakshak GIS Dashboard.
- `GET /story` — Serves the interactive scroll animation story site.
- `POST /api/predict` — Ingests coordinates (`latitude`, `longitude`) and returns live weather telemetry, derived risk indices, and early warning alerts.
- `GET /api/risk-points` — Returns spatial risk intensity matrix for dynamic heatmap visualization.
- `GET /api/health` — Verifies server health and ML booster status.
- `GET /api/india-states` — Returns Survey of India compliant state polygons.
- `GET /api/india-boundary` — Returns sovereign national outer boundary.
