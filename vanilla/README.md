# Bhoomi Rakshak: Standalone HTML/JS/CSS Dashboard

This folder contains a build-less, self-contained version of the **Bhoomi Rakshak Landslide Early-Warning System** dashboard written in plain HTML, JavaScript, and CSS.

It replicates the exact design, sidebar navigation, parameter configurations, and rotating D3 map visualizers from the main dashboard, with zero build dependencies!

---

## 📂 File Structure

* [`index.html`](file:///Users/tanishqpandey/Documents/Projects/Bhoomi%20Rakshak/vanilla/index.html) — The markup, Tailwind CDN, Lucide CDN, and styling overrides.
* [`script.js`](file:///Users/tanishqpandey/Documents/Projects/Bhoomi%20Rakshak/vanilla/script.js) — Interactive D3 globe projections, state selection logic, Chart.js visualizations, and API fetch calls.
* [`mapData.js`](file:///Users/tanishqpandey/Documents/Projects/Bhoomi%20Rakshak/vanilla/mapData.js) — Projected 2D SVG path coordinates for the World and India boundaries.

---

## 🚀 How to Run

### Option 1: Direct Browser Launch (Easiest)
Simply double-click the [`index.html`](file:///Users/tanishqpandey/Documents/Projects/Bhoomi%20Rakshak/vanilla/index.html) file or open it in your browser (Chrome, Safari, Firefox, Edge). It loads all styling, icon assets, and maps instantly!

### Option 2: Run a Local Static Server
To avoid any browser CORS warnings when fetching predictions locally, spin up a quick Python static server from the terminal:
```bash
cd "/Users/tanishqpandey/Documents/Projects/Bhoomi Rakshak"
python3 -m http.server 3000 --directory vanilla
```
Then, open **`http://localhost:3000`** in your browser.

---

## 🧠 Live ML Prediction Integration

This vanilla frontend automatically connects to the Python machine learning server running on port `8000`:
1. When you select a state (like Assam, Meghalaya, or Uttarakhand), the client makes a POST request to `http://localhost:8000/predict` containing the telemetry parameters.
2. The Python backend unpickles your dataset-trained Scikit-Learn Gradient Boosting model, executes predictions, and returns the slide probability index.
3. The dashboard UI immediately refreshes the circular gauge, risk level, and warnings using the ML model's output!
4. If the server is offline or stopped, the client falls back to the mock baseline profile dynamically.
