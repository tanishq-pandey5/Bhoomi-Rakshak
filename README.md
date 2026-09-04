# Bhoomi Rakshak (भूमि रक्षक)
> **AI-GIS Landslide Early Warning & Operational Hazard Surveillance Corridor for Northeast India**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.10%20%7C%203.11%20%7C%203.12-3776AB.svg?logo=python&logoColor=white)](https://www.python.org)
[![LightGBM](https://img.shields.io/badge/Model-LightGBM%20Classifier-brightgreen.svg)](https://lightgbm.readthedocs.io)
[![Leaflet](https://img.shields.io/badge/GIS-Leaflet%201.9-199900.svg?logo=leaflet&logoColor=white)](https://leafletjs.com)
[![Vite](https://img.shields.io/badge/Frontend-Vite%20%2B%20Tailwind-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev)
[![Status](https://img.shields.io/badge/Status-Operational-success.svg)](#)

Bhoomi Rakshak is an operational environmental intelligence and early warning platform engineered to forecast slope instability and imminent landslides across the high-vulnerability Himalayan and Indo-Burma terrain corridors of **Northeast India** (covering Arunachal Pradesh, Assam, Manipur, Meghalaya, Mizoram, Nagaland, Sikkim, and Tripura).

---

## 🏔️ Mission & Background

The North-Eastern mountain ranges of India face severe seasonal slope failure hazards triggered by torrential monsoon precipitation, seismic tremors, and steep topography. Bhoomi Rakshak provides an end-to-end operational shield:
- **Continuous Multi-Source Sensor & Satellite Telemetry Ingestion**
- **37-Feature Machine Learning Inference Engine (LightGBM)**
- **Sub-Second Early Warning Protocol Generation (GSI / NDMA Alert Levels)**
- **Photorealistic GIS Map Surface Compliant with the Survey of India (SOI)**
- **Cinematic Public Awareness Narrative Film & Interactive Dashboard**

---

## 🏗️ System Architecture

```
                                  [ Open-Meteo Weather API ]
                                  [ Open-Elevation SRTM DEM ]
                                  [ ISRIC SoilGrids Database ]
                                  [ Seismic & Crack Sensors ]
                                               │
                                               ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                FastAPI Backend Engine                                  │
│                                                                                        │
│  1. Spatial Boundary Validation (Offline Survey of India Polygon Point-in-Poly Engine) │
│  2. Dynamic Real-time Feature Engineering (37 Engineered Metrics & Interaction Terms)  │
│  3. LightGBM Gradient-Boosted Probability Inference Engine (Threshold: 0.29)          │
│  4. Early Warning Directive Matrix (Normal / Moderate / Critical Protocols)            │
└────────────────────────────────────────────────────────────────────────────────────────┘
                                               │
                       ┌───────────────────────┴───────────────────────┐
                       ▼                                               ▼
     ┌───────────────────────────────────┐           ┌───────────────────────────────────┐
     │    Cinematic Story Experience     │           │    Interactive AI-GIS Dashboard   │
     │            (/story)               │           │                (/)                │
     │                                   │           │                                   │
     │ • Frame-scrubbed aerial video     │           │ • 4 Basemaps (Satellite, Topo,    │
     │ • Hardware sensor specs & craft   │           │   National OSM, Tactical Dark)    │
     │ • Interactive narrative roadmap   │           │ • Real-time Radar Target Pins     │
     │ • Integrated Live Dashboard launch│           │ • Radial Threat Gauge & Cards     │
     └───────────────────────────────────┘           └───────────────────────────────────┘
```

---

## 🌟 Key Capabilities

### 1. Precision Machine Learning Classifier (LightGBM)
- Trained on **50,000 geological risk vectors** capturing critical historical slope failures.
- **Engineered Interactions**:
  - Rainfall–Soil Interaction: `rainfall_24h_mm × soil_moisture_pct`
  - Rainfall–Slope Shear Index: `rainfall_forecast_72h_mm × slope_angle_deg`
  - Soil Saturation Ratio: `soil_moisture_pct / (soil_depth_cm + 1)`
  - Road Disturbance Index: `road_cutting_index / (distance_to_road_m + 1)`
  - Seismicity and Vibration Multipliers: `sensor_vibration_mm_s × crack_report_count`

### 2. High-Speed Offline Geocoding & Boundary Resolution
- Custom ray-casting point-in-polygon engine parses **Survey of India (SOI)** multi-polygons in **under 1 millisecond** without hitting third-party rate limits.
- **Sovereign Geographic Integrity**: Correctly represents official Indian boundaries including Jammu & Kashmir, Ladakh, and Aksai Chin.

### 3. Selective Regional Surveillance Protocol
- **Within the 8 Northeast States**: Full automated telemetry fetching, real-time probability prediction, radial threat gauge animation, and actionable safety directives.
- **Outside Northeast India**: Prevents misleading telemetry by cleanly displaying **only** coordinates, state, and district, while setting risk values and unmonitored sensor cards to `null`.

### 4. Interactive GIS Map & HUD
- **4 Photorealistic Map Modes**: High-Resolution Satellite Hybrid, Topographic Elevation Relief with Contours, National OSM Street Canvas, and Tactical Dark Ops.
- Real-time coordinate HUD, dynamic heatmap density overlays, target quick-jumps (Guwahati, Gangtok, Shillong, Itanagar, Kohima, Imphal, Aizawl, Agartala), and GPS geolocation.

---

## 📁 Repository Structure

```
Bhoomi-Rakshak/
├── backend/                                 # Production FastAPI Backend & ML Engine
│   ├── main.py                              # Core application, routes, and inference pipeline
│   ├── index.html                           # Real-time Leaflet GIS surveillance dashboard
│   ├── landslide_model.pkl                  # Fitted LightGBM booster model
│   ├── SIH26001_landslide_risk_dataset_50000.csv # Geological risk training dataset
│   ├── india-boundary-data.js               # Geographic vector dataset
│   ├── data/geojson/                        # Survey of India boundary GeoJSON datasets
│   │   ├── india_states_soi.geojson         # Survey of India state boundary polygons
│   │   └── india_national_boundary.geojson  # Official sovereign national boundary
│   ├── models/                              # Machine Learning configurations
│   │   └── model_metadata.json              # Feature column sequence and encoding metadata
│   ├── requirements.txt                     # Python dependencies
│   ├── README.md                            # Backend documentation
│   └── .gitignore                           # Backend ignore rules
├── scroll-site/                             # Cinematic Scroll Narrative Experience
│   ├── index.html                           # Brand story and interactive video scrubber
│   ├── dashboard.html                       # Embedded live GIS dashboard
│   ├── main.js                              # Scroll timeline orchestration logic
│   ├── video1.mp4                           # Aerial terrain footage sequence
│   ├── video2.mp4                           # Tactical sensor telemetry sequence
│   └── website-images/                      # WebP gallery stills & hardware diagrams
├── vanilla/                                 # Standalone Live GIS Dashboard
│   └── index.html                           # Fullscreen tactical GIS risk dashboard
├── src/                                     # React TypeScript application (Vite template)
├── public/                                  # Static frontend assets
├── package.json                             # Node.js project manifest
├── vite.config.ts                           # Vite build configuration
├── tailwind.config.js                       # Tailwind CSS theme settings
├── README.md                                # Root project documentation
└── .gitignore                               # Global repository exclusions
```

---

## 🚀 Quickstart Guide

### Prerequisites
- **Python**: 3.10+ installed
- **Node.js**: 18+ (optional, for React frontend dev server)

### 1. Launch the Backend & Integrated Dashboard
```bash
# Navigate to the backend folder
cd backend

# Install Python requirements
pip install -r requirements.txt

# Run the FastAPI server
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Open the Applications in Your Browser
- **Live AI-GIS Landslide Dashboard**: [http://localhost:8000/](http://localhost:8000/)
- **Cinematic Scroll Experience**: [http://localhost:8000/story](http://localhost:8000/story)
- **Interactive Swagger API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)

*(Optional: If running the Vite React application: `npm install && npm run dev`)*

---

## 📡 Core API Specification

| Endpoint | Method | Parameters / Body | Description |
|---|---|---|---|
| `/` | `GET` | — | Serves the full Live AI-GIS Landslide Hazard Dashboard. |
| `/story` | `GET` | — | Redirects to the cinematic scroll story experience (`/scroll-site/`). |
| `/dashboard` | `GET` | — | Direct alias to the live dashboard. |
| `/api/predict` | `POST` | `{"latitude": float, "longitude": float}` | Runs live telemetry fetch and LightGBM model prediction. |
| `/api/risk-points`| `GET` | — | Returns spatial risk intensity matrix across Northeast India for heatmaps. |
| `/api/health` | `GET` | — | Returns health status and ML model loaded verification. |
| `/api/india-states` | `GET`| — | Streams official Survey of India state boundary GeoJSON. |
| `/api/india-boundary`| `GET`| — | Streams sovereign outer national boundary GeoJSON. |

### Sample Prediction Request
```bash
curl -X POST http://localhost:8000/api/predict   -H "Content-Type: application/json"   -d '{"latitude": 26.1445, "longitude": 91.7362}'
```

### Sample Prediction Response (Guwahati, Assam — Monitored Zone)
```json
{
  "risk_score": 0.455,
  "risk_percentage": 45.5,
  "risk_level": "Moderate",
  "threshold": 0.29,
  "latitude": 26.1445,
  "longitude": 91.7362,
  "state": "Assam",
  "district": "Kamrup Metropolitan",
  "inputs": {
    "rainfall_24h_mm": 25.0,
    "rainfall_forecast_72h_mm": 40.0,
    "soil_moisture_pct": 40.0,
    "slope_angle_deg": 18.5,
    "elevation_m": 450.0,
    "lithology_risk": "Medium",
    "road_cutting_index": 0.2
  },
  "data_quality": "Optimal",
  "updated_at": "2026-09-04T12:30:00+00:00"
}
```

### Sample Prediction Response (New Delhi — Outside NE Monitoring Zone)
```json
{
  "outside_ne_india": true,
  "state": "Delhi",
  "district": "New Delhi",
  "latitude": 28.6139,
  "longitude": 77.2090,
  "risk_percentage": null,
  "risk_level": "OUTSIDE MONITORING ZONE",
  "risk_score": null,
  "inputs": {
    "rainfall_24h_mm": null,
    "rainfall_forecast_72h_mm": null,
    "soil_moisture_pct": null,
    "slope_angle_deg": null,
    "elevation_m": null,
    "lithology_risk": null,
    "road_cutting_index": null
  },
  "data_quality": "Unmonitored Zone",
  "message": "Location in New Delhi, Delhi is outside the Northeast India landslide monitoring zone."
}
```

---

## 🛠️ Tech Stack

- **Machine Learning**: LightGBM, Scikit-Learn, Pandas, NumPy, Joblib
- **Backend API**: FastAPI, Uvicorn, Pydantic, Requests
- **Geographic Information Systems (GIS)**: Leaflet.js, Leaflet-Heat, GeoJSON (Survey of India)
- **Frontend & UI**: Tailwind CSS, Lucide Icons, Chart.js, Vanilla ES6 Modules, Vite, TypeScript
- **Media & Animation**: HTML5 Canvas, Dual-Stream MP4 Scrubber, Custom Scroll Engine

---

## 📜 License & Compliance

- Designed and developed for the **Smart India Hackathon (SIH 2024 / 2025)** under Problem Statement **SIH26001**.
- Geographic spatial boundaries adhere strictly to the **Survey of India (SOI)** national cartographic representations.
