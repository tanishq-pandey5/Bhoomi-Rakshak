# Bhoomi Rakshak: Live AI-GIS Landslide Early-Warning Dashboard

This folder contains the **Bhoomi Rakshak Live AI-GIS Dashboard** with Leaflet organic heatmap rendering, real-time telemetry from Open-Meteo, SRTM 90m DEM, OSM Geocoding, and live LightGBM ML risk prediction.

---

## 📂 File Structure

* [`index.html`](file:///Users/tanishqpandey/Documents/Projects/Bhoomi%20Rakshak/vanilla/index.html) — High-fidelity GIS dashboard connecting directly to the Bhoomi Rakshak Backend (`http://localhost:8000`).

---

## 🧠 Live ML Prediction Engine

The dashboard connects to the FastAPI backend running on port `8000`:
* Ingests real-time precipitation, elevation, soil saturation, and seismicity data.
* Runs predictions against the LightGBM classifier (`landslide_model.pkl`).
* Displays dynamic risk dials, 72h precipitation curves, and regional landslide warnings.
