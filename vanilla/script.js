// Bhoomi Rakshak Dashboard Vanilla JS Logic Coordinator

// 1. Data Contracts & State Risk Profiles
const statesData = {
  "Meghalaya": {
    name: "Meghalaya",
    region: "North-East",
    riskPercentage: 78,
    riskLevel: "High",
    riskTrend: "Rising",
    lastUpdated: "2 min ago",
    alertMessage: "High landslide risk expected within the next 72 hours. Increase monitoring and prepare response teams.",
    rainfallIntensity: 42,
    rainfall24h: 120,
    rainfall7d: 280,
    rainfall72hForecast: 180,
    soilMoisture: 65,
    slopeAngle: 32,
    soilDepth: 1.2,
    elevation: 850,
    distanceToStream: 120,
    drainageDensity: 1.8,
    historicalLandslides: 18,
    crackReports: 6,
    sensorVibration: 3.2,
    seismicityIndex: 2.6,
    latitude: 25.57,
    longitude: 91.88,
    contributions: { rainfall: 31, soilMoisture: 22, slope: 17, lithology: 11, historicalEvents: 10, sensorVibration: 8 }
  },
  "Sikkim": {
    name: "Sikkim",
    region: "North-East",
    riskPercentage: 85,
    riskLevel: "Very High",
    riskTrend: "Rising",
    lastUpdated: "5 min ago",
    alertMessage: "Very high landslide probability. Restrict movement near vulnerable slopes and activate local warnings.",
    rainfallIntensity: 58,
    rainfall24h: 165,
    rainfall7d: 390,
    rainfall72hForecast: 220,
    soilMoisture: 72,
    slopeAngle: 38,
    soilDepth: 1.5,
    elevation: 1450,
    distanceToStream: 80,
    drainageDensity: 2.4,
    historicalLandslides: 28,
    crackReports: 11,
    sensorVibration: 4.8,
    seismicityIndex: 5.4,
    latitude: 27.53,
    longitude: 88.51,
    contributions: { rainfall: 35, soilMoisture: 20, slope: 22, lithology: 8, historicalEvents: 10, sensorVibration: 5 }
  },
  "Assam": {
    name: "Assam",
    region: "North-East",
    riskPercentage: 74,
    riskLevel: "High",
    riskTrend: "Rising",
    lastUpdated: "2 min ago",
    alertMessage: "High landslide risk expected within the next 72 hours. Increase monitoring and prepare response teams.",
    rainfallIntensity: 38,
    rainfall24h: 112,
    rainfall7d: 260,
    rainfall72hForecast: 155,
    soilMoisture: 68,
    slopeAngle: 18,
    soilDepth: 2.4,
    elevation: 120,
    distanceToStream: 40,
    drainageDensity: 2.1,
    historicalLandslides: 9,
    crackReports: 2,
    sensorVibration: 1.8,
    seismicityIndex: 2.1,
    latitude: 26.20,
    longitude: 92.93,
    contributions: { rainfall: 42, soilMoisture: 28, slope: 8, lithology: 10, historicalEvents: 7, sensorVibration: 5 }
  },
  "Arunachal Pradesh": {
    name: "Arunachal Pradesh",
    region: "North-East",
    riskPercentage: 68,
    riskLevel: "High",
    riskTrend: "Stable",
    lastUpdated: "10 min ago",
    alertMessage: "High landslide risk expected within the next 72 hours. Increase monitoring and prepare response teams.",
    rainfallIntensity: 31,
    rainfall24h: 92,
    rainfall7d: 210,
    rainfall72hForecast: 140,
    soilMoisture: 58,
    slopeAngle: 28,
    soilDepth: 0.9,
    elevation: 2100,
    distanceToStream: 180,
    drainageDensity: 1.4,
    historicalLandslides: 14,
    crackReports: 3,
    sensorVibration: 2.2,
    seismicityIndex: 4.8,
    latitude: 28.21,
    longitude: 94.72,
    contributions: { rainfall: 25, soilMoisture: 18, slope: 20, lithology: 15, historicalEvents: 12, sensorVibration: 10 }
  },
  "Manipur": {
    name: "Manipur",
    region: "North-East",
    riskPercentage: 55,
    riskLevel: "Moderate",
    riskTrend: "Falling",
    lastUpdated: "15 min ago",
    alertMessage: "Moderate risk detected. Continue monitoring rainfall, soil moisture, and slope conditions.",
    rainfallIntensity: 22,
    rainfall24h: 68,
    rainfall7d: 145,
    rainfall72hForecast: 95,
    soilMoisture: 48,
    slopeAngle: 24,
    soilDepth: 1.4,
    elevation: 790,
    distanceToStream: 220,
    drainageDensity: 1.2,
    historicalLandslides: 8,
    crackReports: 1,
    sensorVibration: 1.2,
    seismicityIndex: 3.2,
    latitude: 24.66,
    longitude: 93.90,
    contributions: { rainfall: 30, soilMoisture: 22, slope: 18, lithology: 12, historicalEvents: 10, sensorVibration: 8 }
  },
  "Mizoram": {
    name: "Mizoram",
    region: "North-East",
    riskPercentage: 72,
    riskLevel: "High",
    riskTrend: "Rising",
    lastUpdated: "3 min ago",
    alertMessage: "High landslide risk expected within the next 72 hours. Increase monitoring and prepare response teams.",
    rainfallIntensity: 36,
    rainfall24h: 105,
    rainfall7d: 240,
    rainfall72hForecast: 160,
    soilMoisture: 62,
    slopeAngle: 30,
    soilDepth: 1.1,
    elevation: 920,
    distanceToStream: 140,
    drainageDensity: 1.6,
    historicalLandslides: 16,
    crackReports: 5,
    sensorVibration: 2.8,
    seismicityIndex: 2.9,
    latitude: 23.16,
    longitude: 92.93,
    contributions: { rainfall: 28, soilMoisture: 20, slope: 18, lithology: 14, historicalEvents: 12, sensorVibration: 8 }
  },
  "Nagaland": {
    name: "Nagaland",
    region: "North-East",
    riskPercentage: 62,
    riskLevel: "Moderate",
    riskTrend: "Stable",
    lastUpdated: "20 min ago",
    alertMessage: "Moderate risk detected. Continue monitoring rainfall, soil moisture, and slope conditions.",
    rainfallIntensity: 28,
    rainfall24h: 82,
    rainfall7d: 190,
    rainfall72hForecast: 110,
    soilMoisture: 52,
    slopeAngle: 26,
    soilDepth: 1.3,
    elevation: 1150,
    distanceToStream: 160,
    drainageDensity: 1.3,
    historicalLandslides: 11,
    crackReports: 4,
    sensorVibration: 2.0,
    seismicityIndex: 3.5,
    latitude: 26.15,
    longitude: 94.56,
    contributions: { rainfall: 24, soilMoisture: 18, slope: 16, lithology: 15, historicalEvents: 15, sensorVibration: 12 }
  },
  "Tripura": {
    name: "Tripura",
    region: "North-East",
    riskPercentage: 45,
    riskLevel: "Moderate",
    riskTrend: "Stable",
    lastUpdated: "1 hour ago",
    alertMessage: "Moderate risk detected. Continue monitoring rainfall, soil moisture, and slope conditions.",
    rainfallIntensity: 18,
    rainfall24h: 55,
    rainfall7d: 120,
    rainfall72hForecast: 75,
    soilMoisture: 42,
    slopeAngle: 14,
    soilDepth: 2.1,
    elevation: 80,
    distanceToStream: 90,
    drainageDensity: 1.5,
    historicalLandslides: 3,
    crackReports: 0,
    sensorVibration: 1.1,
    seismicityIndex: 1.8,
    latitude: 23.94,
    longitude: 91.98,
    contributions: { rainfall: 35, soilMoisture: 25, slope: 8, lithology: 14, historicalEvents: 10, sensorVibration: 8 }
  },
  "Uttarakhand": {
    name: "Uttarakhand",
    region: "Himalayan",
    riskPercentage: 92,
    riskLevel: "Critical",
    riskTrend: "Rising",
    lastUpdated: "1 min ago",
    alertMessage: "Critical landslide conditions detected. Immediate monitoring and local authority response recommended.",
    rainfallIntensity: 65,
    rainfall24h: 195,
    rainfall7d: 480,
    rainfall72hForecast: 280,
    soilMoisture: 80,
    slopeAngle: 42,
    soilDepth: 0.8,
    elevation: 2800,
    distanceToStream: 70,
    drainageDensity: 2.8,
    historicalLandslides: 42,
    crackReports: 18,
    sensorVibration: 5.6,
    seismicityIndex: 7.2,
    latitude: 30.06,
    longitude: 79.01,
    contributions: { rainfall: 30, soilMoisture: 22, slope: 25, lithology: 8, historicalEvents: 10, sensorVibration: 5 }
  },
  "Himachal Pradesh": {
    name: "Himachal Pradesh",
    region: "Himalayan",
    riskPercentage: 81,
    riskLevel: "Very High",
    riskTrend: "Rising",
    lastUpdated: "4 min ago",
    alertMessage: "Very high landslide probability. Restrict movement near vulnerable slopes and activate local warnings.",
    rainfallIntensity: 52,
    rainfall24h: 150,
    rainfall7d: 360,
    rainfall72hForecast: 200,
    soilMoisture: 75,
    slopeAngle: 36,
    soilDepth: 1.0,
    elevation: 2200,
    distanceToStream: 90,
    drainageDensity: 2.2,
    historicalLandslides: 25,
    crackReports: 8,
    sensorVibration: 4.2,
    seismicityIndex: 5.8,
    latitude: 31.10,
    longitude: 77.17,
    contributions: { rainfall: 28, soilMoisture: 20, slope: 22, lithology: 10, historicalEvents: 12, sensorVibration: 8 }
  },
  "Jammu and Kashmir": {
    name: "Jammu and Kashmir",
    region: "Himalayan",
    riskPercentage: 76,
    riskLevel: "High",
    riskTrend: "Stable",
    lastUpdated: "8 min ago",
    alertMessage: "High landslide risk expected within the next 72 hours. Increase monitoring and prepare response teams.",
    rainfallIntensity: 40,
    rainfall24h: 125,
    rainfall7d: 290,
    rainfall72hForecast: 165,
    soilMoisture: 67,
    slopeAngle: 34,
    soilDepth: 1.1,
    elevation: 1850,
    distanceToStream: 110,
    drainageDensity: 1.9,
    historicalLandslides: 21,
    crackReports: 5,
    sensorVibration: 3.5,
    seismicityIndex: 6.2,
    latitude: 33.77,
    longitude: 76.57,
    contributions: { rainfall: 26, soilMoisture: 18, slope: 22, lithology: 12, historicalEvents: 12, sensorVibration: 10 }
  }
};

// District rankings data
const districtsRanking = [
  { rank: 1, district: "East Khasi Hills", state: "Meghalaya", score: 87, level: "Very High", driver: "Rainfall", status: "Active" },
  { rank: 2, district: "West Garo Hills", state: "Meghalaya", score: 81, level: "Very High", driver: "Soil Moisture", status: "Active" },
  { rank: 3, district: "Dima Hasao", state: "Assam", score: 78, level: "High", driver: "Rainfall", status: "Active" },
  { rank: 4, district: "Kohima", state: "Nagaland", score: 74, level: "High", driver: "Slope Angle", status: "Monitoring" },
  { rank: 5, district: "Aizawl", state: "Mizoram", score: 72, level: "High", driver: "Rainfall", status: "Monitoring" },
  { rank: 6, district: "Imphal West", state: "Manipur", score: 68, level: "High", driver: "Soil Moisture", status: "Active" },
  { rank: 7, district: "Tawang", state: "Arunachal Pradesh", score: 65, level: "High", driver: "Slope Angle", status: "Monitoring" },
  { rank: 8, district: "Gangtok", state: "Sikkim", score: 62, level: "Moderate", driver: "Rainfall", status: "Monitoring" }
];

// Live Broadcast Alerts
const liveAlerts = [
  { id: 1, district: "East Khasi Hills", state: "Meghalaya", description: "High rainfall intensity (>45mm/hr) and critical soil moisture saturation detected near highways.", type: "HIGH", status: "ACTIVE", time: "12 min ago" },
  { id: 2, district: "Dima Hasao", state: "Assam", description: "Very high rainfall forecast (>180mm) in next 72 hours. Geophones report vibrations exceeding 3.5mm/s.", type: "VERY HIGH", status: "ACTIVE", time: "18 min ago" },
  { id: 3, district: "Kohima", state: "Nagaland", description: "Elevated slope instability observed via laser displacement. Localized watch protocols active.", type: "MODERATE", status: "MONITORING", time: "43 min ago" }
];

// Baseline colors utility
const riskColors = {
  "Critical": "#991B1B",
  "Very High": "#EF4444",
  "High": "#F97316",
  "Moderate": "#FACC15",
  "Low": "#84CC16",
  "Very Low": "#22C55E",
  "Safe": "#22C55E"
};

// Global Interactive state
let activeState = "Meghalaya";
let activeRegion = "All India";
let mapZoomMode = "globe"; // globe | india | northeast
let mapZoomScale = 1.0;
let rotationAngle = 78;
let rotationInterval = null;

// Audio Alarm Siren Variables
let audioCtx = null;
let sirenOscillator1 = null;
let sirenOscillator2 = null;
let sirenGain = null;
let sirenInterval = null;
let audioAlarmMuted = false;

// Simulation Sandbox Mode Variable
let simulationMode = false;

// Chart.js Chart instances
let chartRainfallInstance = null;
let chartContributionInstance = null;
let chartTrendInstance = null;

// Initializer
document.addEventListener("DOMContentLoaded", () => {
  initDOM();
  initD3Globe();
  selectState(activeState);
  lucide.createIcons();
});

// 2. DOM Population & Layout binding
function initDOM() {
  // Populate State Select Dropdown
  const dropdown = document.getElementById("state-select-dropdown");
  dropdown.innerHTML = "";
  
  // Sort and list all states
  Object.keys(statesData).sort().forEach(state => {
    const opt = document.createElement("option");
    opt.value = state;
    opt.innerText = state;
    dropdown.appendChild(opt);
  });

  // Populate Quick Select Buttons
  const quickSelect = document.getElementById("ne-quick-select-grid");
  quickSelect.innerHTML = "";
  
  const neStates = ["Assam", "Arunachal Pradesh", "Meghalaya", "Manipur", "Mizoram", "Nagaland", "Tripura", "Sikkim"];
  neStates.forEach(state => {
    const btn = document.createElement("button");
    btn.id = `btn-quick-${state.replace(/\s+/g, '-')}`;
    btn.innerText = state;
    btn.className = "px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 bg-white/5 border border-white/8 text-textMuted hover:bg-white/10 hover:text-textWhite hover:border-white/15";
    btn.onclick = () => selectState(state);
    quickSelect.appendChild(btn);
  });

  // Populate District vulnerability table
  const tbody = document.getElementById("districts-table-body");
  tbody.innerHTML = "";
  districtsRanking.forEach(row => {
    const tr = document.createElement("tr");
    tr.className = "border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer";
    tr.onclick = () => selectState(row.state);
    
    tr.innerHTML = `
      <td class="py-3 font-mono text-[10px] text-textMuted">${row.rank}</td>
      <td class="py-3 font-bold text-textWhite">${row.district}</td>
      <td class="py-3 text-textMuted">${row.state}</td>
      <td class="py-3 text-right font-bold text-mono" style="color: ${riskColors[row.level] || '#FFFFFF'}">${row.score}%</td>
      <td class="py-3 text-right">
        <button class="px-2.5 py-1 text-[9px] font-bold rounded-full bg-white/10 border border-white/15 text-textWhite hover:bg-tealAccent hover:text-bgDark transition-colors">Select</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Populate Live Alerts Stream
  const alertsList = document.getElementById("alerts-stream-list");
  alertsList.innerHTML = "";
  liveAlerts.forEach(alert => {
    const alertCard = document.createElement("div");
    alertCard.className = "glass-panel p-4 flex gap-4 border-white/8 bg-white/3 hover:border-white/15 transition-all cursor-pointer";
    alertCard.onclick = () => selectState(alert.state);

    const typeColor = alert.type === 'HIGH' ? 'text-riskHigh' : alert.type === 'VERY HIGH' ? 'text-riskVeryHigh' : 'text-riskModerate';

    alertCard.innerHTML = `
      <!-- Left Square Telemetry geophone badge -->
      <div class="w-20 h-20 shrink-0 rounded-xl bg-bgDark/80 border border-white/10 flex items-center justify-center relative overflow-hidden group">
        <div class="absolute inset-0 rounded-full border border-dashed border-tealAccent/20 animate-spin" style="animation-duration: 6s;"></div>
        <div class="absolute w-12 h-12 rounded-full border border-dashed border-tealAccent/30 animate-spin" style="animation-duration: 4s;"></div>
        <div class="w-5 h-5 rounded-full bg-tealAccent/15 border border-tealAccent/40 flex items-center justify-center group-hover:scale-110 transition-transform">
          <i data-lucide="activity" class="w-3.5 h-3.5 text-tealAccent"></i>
        </div>
      </div>

      <!-- Right warning description -->
      <div class="flex-1 flex flex-col justify-between">
        <div>
          <div class="flex justify-between items-start gap-2">
            <h4 class="text-xs font-bold text-textWhite uppercase">${alert.district}, ${alert.state}</h4>
            <span class="text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-white/5 border border-white/8 ${typeColor}">${alert.type} WARNING</span>
          </div>
          <p class="text-[10px] text-textMuted leading-relaxed mt-1">${alert.description}</p>
        </div>
        
        <div class="flex justify-between items-center text-[9px] text-textMuted border-t border-white/5 pt-2 mt-2">
          <span class="flex items-center gap-1"><i data-lucide="clock" class="w-3 h-3"></i>${alert.time}</span>
          <button class="text-tealAccent font-bold hover:underline">View details</button>
        </div>
      </div>
    `;
    alertsList.appendChild(alertCard);
  });
}

// 3. Selection Coordinator & ML Model predict API fetch
async function selectState(stateName) {
  if (!statesData[stateName]) return;
  activeState = stateName;

  // Update State selector UI bindings
  document.getElementById("state-select-dropdown").value = stateName;
  
  // Highlight active quick select buttons
  const buttons = document.querySelectorAll("#ne-quick-select-grid button");
  buttons.forEach(btn => {
    btn.className = "px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 bg-white/5 border border-white/8 text-textMuted hover:bg-white/10 hover:text-textWhite hover:border-white/15";
  });
  const activeBtn = document.getElementById(`btn-quick-${stateName.replace(/\s+/g, '-')}`);
  if (activeBtn) {
    activeBtn.className = "px-3.5 py-1.5 text-xs font-bold rounded-full transition-all duration-200 bg-gradient-to-r from-saffronAccent to-saffronAccent/80 text-bgDark shadow-lg shadow-saffronAccent/10 border-transparent scale-105";
  }

  // Load baseline profile
  const profile = JSON.parse(JSON.stringify(statesData[stateName]));

  // Attempt real-time prediction API POST request
  try {
    const res = await fetch("http://localhost:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.status === "success") {
        profile.riskPercentage = data.predicted_risk_percentage;
        profile.riskLevel = data.predicted_risk_level;
        
        const level = data.predicted_risk_level;
        let alert = "Low current risk. Continue routine monitoring.";
        if (level === 'Critical') alert = "Critical landslide conditions detected. Immediate monitoring and local authority response recommended.";
        else if (level === 'Very High') alert = "Very high landslide probability. Restrict movement near vulnerable slopes and activate local warnings.";
        else if (level === 'High') alert = "High landslide risk expected within the next 72 hours. Increase monitoring and prepare response teams.";
        else if (level === 'Moderate') alert = "Moderate risk detected. Continue monitoring rainfall, soil moisture, and slope conditions.";
        profile.alertMessage = alert;
      }
    }
  } catch (e) {
    // Prediction server offline
  }

  // Trigger Emergency audio alarms and outlines if level is Critical
  handleRiskAlarms(profile.riskLevel);

  // Update UI Elements based on selected profile
  updateStateDetailsCard(profile);
  updateParameterGrid(profile);
  renderCharts(profile);

  // Redraw Flat India Map
  if (mapZoomMode !== 'globe') {
    drawIndiaMap();
  }
}

function updateStateDetailsCard(profile) {
  const riskColor = riskColors[profile.riskLevel] || "#FFFFFF";
  
  // State Profile card
  document.getElementById("card-state-name").innerText = profile.name;
  document.getElementById("card-state-region").innerText = `${profile.region} Region`;
  document.getElementById("card-state-risk-pct").innerText = `${profile.riskPercentage}%`;
  document.getElementById("card-state-risk-pct").style.color = riskColor;
  
  const riskLabel = document.getElementById("card-state-risk-label");
  riskLabel.innerText = `${profile.riskLevel} Risk`;
  riskLabel.style.color = riskColor;

  // Trend icon updates
  const trendLabel = document.getElementById("card-state-trend-label");
  const trendIcon = document.getElementById("card-state-trend-icon");
  trendLabel.innerText = `${profile.riskTrend} Trend`;
  if (profile.riskTrend === 'Rising') {
    trendIcon.setAttribute("data-lucide", "trending-up");
    trendIcon.className = "w-3.5 h-3.5 text-riskVeryHigh";
  } else if (profile.riskTrend === 'Falling') {
    trendIcon.setAttribute("data-lucide", "trending-down");
    trendIcon.className = "w-3.5 h-3.5 text-riskVeryLow";
  } else {
    trendIcon.setAttribute("data-lucide", "minus");
    trendIcon.className = "w-3.5 h-3.5 text-textMuted";
  }

  // Advisory alert box
  const advisoryBox = document.getElementById("card-state-advisory-box");
  const advisoryText = document.getElementById("card-state-advisory-text");
  advisoryText.innerText = profile.alertMessage;
  advisoryBox.style.borderColor = `${riskColor}22`;
  advisoryBox.style.backgroundColor = `${riskColor}0A`;
  
  // Gauge updates
  document.getElementById("gauge-risk-pct").innerText = `${profile.riskPercentage}%`;
  const progressCircle = document.getElementById("gauge-progress-circle");
  progressCircle.setAttribute("stroke", riskColor);
  
  const radius = 50;
  const circumference = 2 * Math.PI * radius; // 314.16
  const dashoffset = circumference - (profile.riskPercentage / 100) * circumference;
  progressCircle.style.strokeDashoffset = dashoffset;

  // Flashing alarm classes on Critical alert
  const card1 = document.getElementById("selected-state-details-card");
  const card2 = document.getElementById("selected-state-gauge-card");
  if (profile.riskLevel === 'Critical') {
    card1.classList.add("critical-border-alarm");
    card2.classList.add("critical-border-alarm");
  } else {
    card1.classList.remove("critical-border-alarm");
    card2.classList.remove("critical-border-alarm");
  }

  // Refresh lucide icons inside details card
  lucide.createIcons();
}

function updateParameterGrid(profile) {
  const grid = document.getElementById("parameters-feed-grid");
  grid.innerHTML = "";

  const paramKeys = [
    { key: 'rainfallIntensity', name: 'Rainfall Intensity', val: profile.rainfallIntensity, unit: 'mm/hr', min: 0, max: 80, icon: 'cloud-rain', contribution: '+18%' },
    { key: 'rainfall24h', name: '24-Hour Rainfall', val: profile.rainfall24h, unit: 'mm', min: 0, max: 250, icon: 'cloud-rain', contribution: '+22%' },
    { key: 'rainfall7d', name: '7-Day Accumulation', val: profile.rainfall7d, unit: 'mm', min: 0, max: 800, icon: 'cloud-rain', contribution: '+16%' },
    { key: 'rainfall72hForecast', name: '72H Rain Forecast', val: profile.rainfall72hForecast, unit: 'mm', min: 0, max: 300, icon: 'cloud-rain', contribution: '+14%' },
    { key: 'soilMoisture', name: 'Soil Moisture', val: profile.soilMoisture, unit: '%', min: 0, max: 100, icon: 'droplets', contribution: '+12%' },
    { key: 'slopeAngle', name: 'Slope Angle', val: profile.slopeAngle, unit: '°', min: 0, max: 60, icon: 'triangle', contribution: '+10%' },
    { key: 'soilDepth', name: 'Soil Depth', val: profile.soilDepth, unit: 'm', min: 0, max: 5.0, icon: 'layers', contribution: '+6%' },
    { key: 'elevation', name: 'Elevation', val: profile.elevation, unit: 'm', min: 0, max: 4000, icon: 'compass', contribution: '+4%' },
    { key: 'distanceToStream', name: 'Distance to Stream', val: profile.distanceToStream, unit: 'm', min: 0, max: 600, icon: 'waves', contribution: '+3%' },
    { key: 'drainageDensity', name: 'Drainage Density', val: profile.drainageDensity, unit: 'km/km²', min: 0.1, max: 6.0, icon: 'spline', contribution: '+3%' },
    { key: 'historicalLandslides', name: 'Historical Landslides', val: profile.historicalLandslides, unit: ' events', min: 0, max: 60, icon: 'history', contribution: '+7%' },
    { key: 'crackReports', name: 'Slope Crack Reports', val: profile.crackReports, unit: ' locations', min: 0, max: 30, icon: 'alert-octagon', contribution: '+4%' },
    { key: 'sensorVibration', name: 'Sensor Vibration', val: profile.sensorVibration, unit: 'mm/s', min: 0, max: 10.0, icon: 'activity', contribution: '+3%' },
    { key: 'seismicityIndex', name: 'Seismicity Index', val: profile.seismicityIndex, unit: '/10', min: 0, max: 10.0, icon: 'git-commit', contribution: '+2%' }
  ];

  paramKeys.forEach(param => {
    let label = 'Safe';
    if (param.key === 'rainfallIntensity') {
      if (param.val >= 45) label = 'Critical';
      else if (param.val >= 25) label = 'Elevated';
      else if (param.val >= 10) label = 'Watch';
    } else if (param.key === 'rainfall24h') {
      if (param.val >= 150) label = 'Critical';
      else if (param.val >= 100) label = 'Elevated';
      else if (param.val >= 50) label = 'Watch';
    } else if (param.key === 'soilMoisture') {
      if (param.val >= 80) label = 'Critical';
      else if (param.val >= 60) label = 'Elevated';
      else if (param.val >= 40) label = 'Watch';
    } else if (param.key === 'slopeAngle') {
      if (param.val >= 35) label = 'Critical';
      else if (param.val >= 25) label = 'Elevated';
      else if (param.val >= 15) label = 'Watch';
    } else {
      if (profile.riskPercentage >= 90) label = 'Critical';
      else if (profile.riskPercentage >= 70) label = 'Elevated';
      else if (profile.riskPercentage >= 40) label = 'Watch';
    }

    let progressPercent = Math.min(100, (param.val / param.max) * 100);
    if (param.key === 'distanceToStream') {
      progressPercent = Math.max(0, 100 - (param.val / param.max) * 100);
    }

    let badgeColor = 'bg-riskVeryLow/20 text-riskVeryLow border-riskVeryLow/30';
    let progressColor = '#22C55E';
    let labelColor = 'text-riskVeryLow';
    if (label === 'Critical') {
      badgeColor = 'bg-riskCritical/20 text-riskVeryHigh border-riskCritical/30';
      progressColor = '#EF4444';
      labelColor = 'text-riskVeryHigh';
    } else if (label === 'Elevated') {
      badgeColor = 'bg-riskHigh/20 text-riskHigh border-riskHigh/30';
      progressColor = '#F97316';
      labelColor = 'text-riskHigh';
    } else if (label === 'Watch') {
      badgeColor = 'bg-riskModerate/20 text-riskModerate border-riskModerate/30';
      progressColor = '#FACC15';
      labelColor = 'text-riskModerate';
    }

    const card = document.createElement("div");
    card.className = "glass-panel p-4 flex flex-col gap-3 glass-panel-hover border border-white/12";
    
    // Switch between Static Progress Bar or Interactive Range Sliders
    let bottomWidget = `
      <div class="mt-auto flex flex-col gap-2">
        <div class="w-full h-1.5 rounded-full bg-white/5 border border-white/5 overflow-hidden">
          <div class="h-full rounded-full transition-all duration-1000" style="width: ${progressPercent}%; background-color: ${progressColor};"></div>
        </div>
        <div class="flex justify-between items-center text-[9px] text-textMuted font-mono">
          <span>Weight Factor</span>
          <span class="${labelColor} font-bold">${param.contribution}</span>
        </div>
      </div>
    `;

    if (simulationMode) {
      const step = (param.key === 'soilDepth' || param.key === 'sensorVibration' || param.key === 'drainageDensity' || param.key === 'seismicityIndex') ? '0.1' : '1';
      bottomWidget = `
        <div class="mt-auto flex flex-col gap-2">
          <input type="range" min="${param.min}" max="${param.max}" step="${step}" value="${param.val}" 
            oninput="simulateParamChange('${param.key}', this.value)" 
            class="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-white/10 border border-white/5 accent-tealAccent">
          <div class="flex justify-between items-center text-[9px] text-tealAccent font-bold font-mono">
            <span>SIMULATION VALUE</span>
            <span>${param.contribution} Weight</span>
          </div>
        </div>
      `;
    }

    card.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="p-2 rounded-xl bg-white/5 border border-white/8 text-textMuted">
          <i data-lucide="${param.icon}" class="w-4 h-4 text-tealAccent"></i>
        </div>
        <span class="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${badgeColor}">
          ${label}
        </span>
      </div>

      <div>
        <span class="text-[10px] text-textMuted uppercase font-semibold tracking-wider block">
          ${param.name}
        </span>
        <div class="flex items-baseline gap-1 mt-1">
          <span id="label-val-${param.key}" class="text-xl sm:text-2xl font-black text-textWhite font-mono">${param.val}</span>
          <span class="text-xs text-textMuted font-medium font-sans">${param.unit}</span>
        </div>
      </div>

      ${bottomWidget}
    `;
    grid.appendChild(card);
  });
  lucide.createIcons();
}

// Sandbox parameter simulation
function toggleSimulationMode() {
  simulationMode = !simulationMode;
  
  const toggleBtn = document.getElementById("simulation-toggle-btn");
  const toggleDot = document.getElementById("simulation-toggle-dot");

  if (simulationMode) {
    toggleBtn.className = "w-10 h-5 rounded-full bg-tealAccent relative p-0.5 transition-colors duration-200";
    toggleDot.className = "absolute w-4 h-4 rounded-full bg-bgDark right-0.5 top-0.5 transition-all";
    addToast("Simulation Sandbox Mode enabled. Use sliders to test ML predictions!", "success");
  } else {
    toggleBtn.className = "w-10 h-5 rounded-full bg-white/10 relative p-0.5 transition-colors duration-200";
    toggleDot.className = "absolute w-4 h-4 rounded-full bg-textMuted left-0.5 top-0.5 transition-all";
    addToast("Simulation Sandbox Mode disabled. Restored baseline telemetry feed.", "info");
    
    // Reload unmodified baseline state variables
    selectState(activeState);
  }
  
  updateParameterGrid(statesData[activeState]);
}

function simulateParamChange(key, value) {
  const floatVal = parseFloat(value);
  statesData[activeState][key] = floatVal;
  
  // Real-time label text update
  const labelVal = document.getElementById(`label-val-${key}`);
  if (labelVal) labelVal.innerText = floatVal;

  // Lightweight selectState to avoid toast spam during slider drag
  lightweightRecalculate();
}

async function lightweightRecalculate() {
  const profile = JSON.parse(JSON.stringify(statesData[activeState]));
  
  try {
    const res = await fetch("http://localhost:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.status === "success") {
        profile.riskPercentage = data.predicted_risk_percentage;
        profile.riskLevel = data.predicted_risk_level;
        
        const level = data.predicted_risk_level;
        let alert = "Low current risk. Continue routine monitoring.";
        if (level === 'Critical') alert = "Critical landslide conditions detected. Immediate monitoring and local authority response recommended.";
        else if (level === 'Very High') alert = "Very high landslide probability. Restrict movement near vulnerable slopes and activate local warnings.";
        else if (level === 'High') alert = "High landslide risk expected within the next 72 hours. Increase monitoring and prepare response teams.";
        else if (level === 'Moderate') alert = "Moderate risk detected. Continue monitoring rainfall, soil moisture, and slope conditions.";
        profile.alertMessage = alert;
      }
    }
  } catch (e) {
    // Prediction server offline
  }

  handleRiskAlarms(profile.riskLevel);
  updateStateDetailsCard(profile);
  renderCharts(profile);
  if (mapZoomMode !== 'globe') {
    drawIndiaMap();
  }
}

// 4. D3 Globe & India Map Render
function initD3Globe() {
  const svg = d3.select("#svg-map");
  svg.selectAll("*").remove();

  if (mapZoomMode === 'globe') {
    document.getElementById("globe-explore-prompt").classList.remove("hidden");
    document.getElementById("map-controls-box").classList.add("hidden");
    
    // Rotating Globe Projection
    const projection = d3.geoOrthographic()
      .clipAngle(90)
      .scale(250)
      .translate([400, 400])
      .rotate([rotationAngle, -20]);

    const pathGen = d3.geoPath(projection);

    // Draw sphere background
    svg.append("path")
      .datum({ type: 'Sphere' })
      .attr("d", pathGen)
      .attr("fill", "rgba(8, 25, 41, 0.85)")
      .attr("stroke", "rgba(22, 184, 166, 0.15)")
      .attr("stroke-width", 1.2);

    // Draw grid lines
    svg.append("path")
      .datum(d3.geoGraticule().step([15, 15])())
      .attr("d", pathGen)
      .attr("fill", "none")
      .attr("stroke", "rgba(255, 255, 255, 0.03)")
      .attr("stroke-width", 0.5);

    // Draw continents
    if (window.WORLD_LAND_GEOM) {
      svg.selectAll(".continent")
        .data(window.WORLD_LAND_GEOM)
        .enter()
        .append("path")
        .attr("class", "continent")
        .attr("d", pathGen)
        .attr("fill", "rgba(30, 58, 86, 0.45)")
        .attr("stroke", "rgba(255, 255, 255, 0.1)")
        .attr("stroke-width", 0.5);
    }

    // Centroid of India beacon
    const indiaCoords = [78.96, 20.59];
    const isIndiaVisible = () => {
      const rotated = projection.rotate();
      const distance = d3.geoDistance(indiaCoords, [-rotated[0], -rotated[1]]);
      return distance < Math.PI / 2;
    };

    if (isIndiaVisible()) {
      const beaconPos = projection(indiaCoords);
      const beaconGroup = svg.append("g")
        .attr("class", "cursor-pointer")
        .on("click", () => setMapZoom('india'));

      // Outer glow pulse
      beaconGroup.append("circle")
        .attr("cx", beaconPos[0])
        .attr("cy", beaconPos[1])
        .attr("r", 24)
        .attr("fill", "rgba(22, 184, 166, 0.18)")
        .append("animate")
        .attr("attributeName", "r")
        .attr("values", "10;32;10")
        .attr("dur", "2.5s")
        .attr("repeatCount", "indefinite");

      beaconGroup.append("circle")
        .attr("cx", beaconPos[0])
        .attr("cy", beaconPos[1])
        .attr("r", 8)
        .attr("fill", "#16B8A6");

      beaconGroup.append("circle")
        .attr("cx", beaconPos[0])
        .attr("cy", beaconPos[1])
        .attr("r", 3)
        .attr("fill", "#FFFFFF");
    }

    // Globe auto-rotation trigger
    if (!rotationInterval) {
      rotationInterval = setInterval(() => {
        if (mapZoomMode === 'globe') {
          rotationAngle = (rotationAngle + 0.12) % 360;
          initD3Globe();
        }
      }, 30);
    }

  } else {
    // Stop rotation when flat map is displayed
    if (rotationInterval) {
      clearInterval(rotationInterval);
      rotationInterval = null;
    }
    document.getElementById("globe-explore-prompt").classList.add("hidden");
    document.getElementById("map-controls-box").classList.remove("hidden");
    drawIndiaMap();
  }
}

function drawIndiaMap() {
  const svg = d3.select("#svg-map");
  svg.selectAll("*").remove();

  if (!window.INDIA_STATES_PATHS) return;

  const mapGroup = svg.append("g")
    .attr("id", "india-states-group")
    .attr("class", "transition-all duration-500 ease-in-out")
    .style("transform-origin", "center center");

  // Calculate transform matrices
  let scale = mapZoomScale;
  let dx = 0;
  let dy = 0;

  if (mapZoomMode === 'northeast') {
    // Union NE bounding box
    const neStates = ["Assam", "Arunachal Pradesh", "Meghalaya", "Manipur", "Mizoram", "Nagaland", "Tripura", "Sikkim"];
    const nePaths = window.INDIA_STATES_PATHS.filter(p => neStates.includes(p.name));
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    nePaths.forEach(p => {
      minX = Math.min(minX, p.bounds[0][0]);
      minY = Math.min(minY, p.bounds[0][1]);
      maxX = Math.max(maxX, p.bounds[1][0]);
      maxY = Math.max(maxY, p.bounds[1][1]);
    });
    
    scale = 2.8 * mapZoomScale;
    dx = -minX * scale + 130;
    dy = -minY * scale + 180;
  } else if (activeState && mapZoomMode === 'india' && mapZoomScale === 1.0) {
    const paths = window.INDIA_STATES_PATHS.filter(p => p.name === activeState);
    if (paths.length > 0) {
      const [cx, cy] = paths[0].centroid;
      scale = 1.35;
      dx = -cx * scale + 400;
      dy = -cy * scale + 400;
    }
  } else if (mapZoomScale !== 1.0) {
    scale = mapZoomScale;
    dx = -400 * scale + 400;
    dy = -400 * scale + 400;
  }

  mapGroup.style("transform", `translate(${dx}px, ${dy}px) scale(${scale})`);

  // Render individual state paths
  window.INDIA_STATES_PATHS.forEach(statePath => {
    const isSelected = activeState === statePath.name;
    const isNE = ["Assam", "Arunachal Pradesh", "Meghalaya", "Manipur", "Mizoram", "Nagaland", "Tripura", "Sikkim"].includes(statePath.name);
    
    // Determine opacity based on filters
    let opacity = 1.0;
    if (activeRegion === 'North-East India' && !isNE) {
      opacity = 0.12;
    } else if (activeRegion === 'Himalayan Region') {
      const himalayan = ["Jammu and Kashmir", "Himachal Pradesh", "Uttarakhand", "Sikkim", "Arunachal Pradesh", "Ladakh"];
      if (!himalayan.includes(statePath.name)) opacity = 0.12;
    } else if (activeState && activeState !== statePath.name) {
      opacity = 0.3;
    }

    const stateProfile = statesData[statePath.name] || { riskLevel: 'Safe', riskPercentage: 10 };
    const color = riskColors[stateProfile.riskLevel] || '#22C55E';

    mapGroup.append("path")
      .attr("d", statePath.path)
      .attr("fill", color)
      .attr("stroke", isSelected ? '#16B8A6' : 'rgba(7, 26, 43, 0.75)')
      .attr("stroke-width", isSelected ? 2.5 : 0.8)
      .style("opacity", opacity)
      .attr("class", "cursor-pointer transition-all duration-200 hover:brightness-110")
      .on("click", () => selectState(statePath.name))
      .on("mousemove", (e) => {
        // Floating state tooltip
        const container = document.getElementById("dashboard");
        const rect = container.getBoundingClientRect();
        const tooltipX = e.clientX - rect.left + 15;
        const tooltipY = e.clientY - rect.top - 45;
        showTooltip(statePath.name, stateProfile, tooltipX, tooltipY);
      })
      .on("mouseleave", () => hideTooltip());
  });
}

// Tooltip helpers
function showTooltip(name, profile, x, y) {
  let tooltip = document.getElementById("map-tooltip");
  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.id = "map-tooltip";
    tooltip.className = "absolute pointer-events-none z-30 glass-panel px-3 py-2 text-xs flex flex-col gap-1 border-white/20 shadow-xl";
    document.getElementById("dashboard").appendChild(tooltip);
  }
  
  const isNE = ["Assam", "Arunachal Pradesh", "Meghalaya", "Manipur", "Mizoram", "Nagaland", "Tripura", "Sikkim"].includes(name);
  const tag = isNE ? `<span class="bg-saffronAccent/20 text-saffronAccent text-[9px] px-1.5 rounded-full font-bold">NE</span>` : '';

  tooltip.innerHTML = `
    <div class="font-semibold text-textWhite flex items-center gap-1.5">
      <span>${name}</span>
      ${tag}
    </div>
    <div class="flex items-center gap-2 mt-0.5">
      <span class="w-2 h-2 rounded-full" style="background-color: ${riskColors[profile.riskLevel] || '#FFF'}"></span>
      <span class="text-textMuted uppercase text-[9px] font-bold tracking-wider">${profile.riskLevel} (${profile.riskPercentage}%)</span>
    </div>
  `;
  tooltip.style.left = `${x}px`;
  tooltip.style.top = `${y}px`;
  tooltip.style.transform = "translate(-50%, -50%)";
  tooltip.style.display = "block";
}

function hideTooltip() {
  const tooltip = document.getElementById("map-tooltip");
  if (tooltip) tooltip.style.display = "none";
}

// 5. Chart.js visualizer updates
function renderCharts(profile) {
  // Chart 1: Rainfall area forecast
  const ctxRainfall = document.getElementById('chart-rainfall').getContext('2d');
  const rainData = [10, 24, 45, 65, 80, 110, 140, 160, 180, 140, 90, 50].map(val => Math.round(val * (profile.rainfallIntensity / 42.0)));
  
  if (chartRainfallInstance) chartRainfallInstance.destroy();
  chartRainfallInstance = new Chart(ctxRainfall, {
    type: 'line',
    data: {
      labels: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '00:00', '02:00', '04:00'],
      datasets: [
        {
          label: 'Rainfall (mm)',
          data: rainData,
          borderColor: '#16B8A6',
          backgroundColor: 'rgba(22, 184, 166, 0.15)',
          fill: true,
          tension: 0.4,
          borderWidth: 2
        },
        {
          label: 'Threshold',
          data: Array(12).fill(120),
          borderColor: 'rgba(239, 68, 68, 0.6)',
          borderDash: [5, 5],
          pointRadius: 0,
          borderWidth: 1.5,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#9FB3C8', font: { size: 9 } } },
        y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#9FB3C8', font: { size: 9 } } }
      }
    }
  });

  // Chart 2: Risk contributions horizontal bars
  const ctxContr = document.getElementById('chart-contribution').getContext('2d');
  const contrKeys = Object.keys(profile.contributions);
  const contrVals = Object.values(profile.contributions);
  const contrColors = ['#16B8A6', '#84CC16', '#FF9F43', '#3B82F6', '#EF4444', '#EC4899'];

  if (chartContributionInstance) chartContributionInstance.destroy();
  chartContributionInstance = new Chart(ctxContr, {
    type: 'bar',
    data: {
      labels: ['Rainfall', 'Soil Moisture', 'Slope Angle', 'Lithology', 'History', 'Vibration'],
      datasets: [{
        data: contrVals,
        backgroundColor: contrColors,
        borderWidth: 0,
        borderRadius: 4
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#9FB3C8', font: { size: 9 } } },
        y: { grid: { color: 'transparent' }, ticks: { color: '#F5F7FA', font: { size: 9, weight: 'bold' } } }
      }
    }
  });

  // Chart 3: Recent 7 days line trend
  const ctxTrend = document.getElementById('chart-trend').getContext('2d');
  const baseTrend = [45, 52, 60, 72, 78, 85, profile.riskPercentage];
  
  if (chartTrendInstance) chartTrendInstance.destroy();
  chartTrendInstance = new Chart(ctxTrend, {
    type: 'line',
    data: {
      labels: ['Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue'],
      datasets: [{
        data: baseTrend,
        borderColor: '#FF9F43',
        backgroundColor: 'transparent',
        borderWidth: 2,
        tension: 0.35,
        pointBackgroundColor: '#FF9F43',
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#9FB3C8', font: { size: 9 } } },
        y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#9FB3C8', font: { size: 9 } }, min: 0, max: 100 }
      }
    }
  });

  document.getElementById("charts-state-name").innerText = profile.name;
}

// 6. Web Audio API synthesized early-warning siren
function handleRiskAlarms(riskLevel) {
  if (riskLevel === 'Critical') {
    startEmergencySiren();
  } else {
    stopEmergencySiren();
  }
}

function startEmergencySiren() {
  if (audioAlarmMuted) return;

  // Initialize Audio Context on user action
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (sirenInterval) return; // Alarm is already playing

  sirenGain = audioCtx.createGain();
  sirenGain.gain.setValueAtTime(0.06, audioCtx.currentTime); // Low safe volume
  sirenGain.connect(audioCtx.destination);

  let highPitch = true;
  const pulseAlarm = () => {
    // Create twin oscillator sweep
    if (sirenOscillator1) sirenOscillator1.stop();
    if (sirenOscillator2) sirenOscillator2.stop();

    sirenOscillator1 = audioCtx.createOscillator();
    sirenOscillator2 = audioCtx.createOscillator();

    sirenOscillator1.type = 'sawtooth';
    sirenOscillator2.type = 'sine';

    const freq = highPitch ? 660 : 440; // High-Low alarm pulse
    sirenOscillator1.frequency.setValueAtTime(freq, audioCtx.currentTime);
    sirenOscillator2.frequency.setValueAtTime(freq * 1.5, audioCtx.currentTime);

    sirenOscillator1.connect(sirenGain);
    sirenOscillator2.connect(sirenGain);

    sirenOscillator1.start();
    sirenOscillator2.start();

    highPitch = !highPitch;
  };

  pulseAlarm();
  sirenInterval = setInterval(pulseAlarm, 800);
}

function stopEmergencySiren() {
  if (sirenInterval) {
    clearInterval(sirenInterval);
    sirenInterval = null;
  }
  if (sirenOscillator1) {
    sirenOscillator1.stop();
    sirenOscillator1 = null;
  }
  if (sirenOscillator2) {
    sirenOscillator2.stop();
    sirenOscillator2 = null;
  }
}

function toggleAudioAlarm() {
  audioAlarmMuted = !audioAlarmMuted;
  const btn = document.getElementById("btn-audio-siren");

  if (audioAlarmMuted) {
    stopEmergencySiren();
    btn.innerHTML = `<i data-lucide="volume-x" class="w-4 h-4 text-riskVeryHigh"></i>`;
    addToast("Emergency audio early-warning alarms muted.", "info");
  } else {
    btn.innerHTML = `<i data-lucide="volume-2" class="w-4 h-4 text-tealAccent"></i>`;
    addToast("Emergency audio early-warning alarms unmuted.", "success");
    // Play immediately if current state is critical
    const profile = statesData[activeState];
    if (profile && profile.riskLevel === 'Critical') {
      startEmergencySiren();
    }
  }
  lucide.createIcons();
}

// 7. Navigation Actions & Interactive overlays
function onStateDropdownSelect(value) {
  selectState(value);
}

function onRegionSelect(value) {
  activeRegion = value;
  if (value === 'North-East India') {
    setMapZoom('northeast');
  } else {
    setMapZoom('india');
  }
}

function setMapZoom(mode) {
  mapZoomMode = mode;
  mapZoomScale = 1.0;
  
  // Update control highlight styles
  const btnNe = document.getElementById("btn-zoom-ne");
  const btnInd = document.getElementById("btn-zoom-india");
  
  if (mode === 'northeast') {
    btnNe.className = "w-full py-1 text-[9px] font-bold uppercase rounded-full border bg-saffronAccent/15 border-saffronAccent text-saffronAccent transition-all";
    btnInd.className = "w-full py-1 text-[9px] font-bold uppercase rounded-full border bg-white/5 border-white/8 text-textMuted hover:text-textWhite transition-all";
  } else if (mode === 'india') {
    btnInd.className = "w-full py-1 text-[9px] font-bold uppercase rounded-full border bg-tealAccent/15 border-tealAccent text-tealAccent transition-all";
    btnNe.className = "w-full py-1 text-[9px] font-bold uppercase rounded-full border bg-white/5 border-white/8 text-textMuted hover:text-textWhite transition-all";
  }

  // Update left sidebar button highlight classes
  const btnDashTab = document.getElementById("btn-side-dashboard");
  const btnMapTab = document.getElementById("btn-side-risk-map");
  if (mode === 'globe') {
    btnDashTab.className = "w-full py-2.5 flex flex-col items-center justify-center gap-1 rounded-xl text-tealAccent bg-tealAccent/10 group relative";
    btnMapTab.className = "w-full py-2.5 flex flex-col items-center justify-center gap-1 rounded-xl text-textMuted hover:text-textWhite hover:bg-white/5 group relative";
  } else {
    btnMapTab.className = "w-full py-2.5 flex flex-col items-center justify-center gap-1 rounded-xl text-tealAccent bg-tealAccent/10 group relative";
    btnDashTab.className = "w-full py-2.5 flex flex-col items-center justify-center gap-1 rounded-xl text-textMuted hover:text-textWhite hover:bg-white/5 group relative";
  }

  initD3Globe();
}

function adjustMapZoomScale(amount) {
  mapZoomScale = Math.max(0.5, Math.min(4.0, mapZoomScale + amount));
  drawIndiaMap();
}

function resetMapZoom() {
  mapZoomScale = 1.0;
  if (mapZoomMode === 'globe') {
    setMapZoom('india');
  } else {
    setMapZoom('globe');
  }
}

function navigateTab(tabId) {
  const tabIds = ['dashboard', 'risk-map', 'alerts', 'methodology', 'footer'];
  tabIds.forEach(id => {
    const btn = document.getElementById(`btn-side-${id}`);
    if (id === tabId) {
      btn.className = "w-full py-2.5 flex flex-col items-center justify-center gap-1 rounded-xl text-tealAccent bg-tealAccent/10 group relative";
    } else {
      btn.className = "w-full py-2.5 flex flex-col items-center justify-center gap-1 rounded-xl text-textMuted hover:text-textWhite hover:bg-white/5 group relative";
    }
  });

  if (tabId === 'dashboard') {
    setMapZoom('globe');
  } else if (tabId === 'risk-map') {
    setMapZoom('india');
  }

  scrollToSection(tabId);
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    const yOffset = -85;
    const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
    addToast(`Navigating to ${id.replace('-', ' ')}`, 'info');
  }
}

function toggleModal(show) {
  const modal = document.getElementById("calculation-modal");
  if (show) {
    modal.classList.remove("hidden");
  } else {
    modal.classList.add("hidden");
  }
}

// Toast alerts engine
function addToast(message, type = 'info') {
  const container = document.getElementById("toast-container");
  
  const toast = document.createElement("div");
  toast.className = "flex items-center gap-3 p-3.5 rounded-xl border bg-panelBg/95 backdrop-blur border-white/15 text-xs text-textWhite shadow-2xl transition-all duration-300 transform translate-y-2 opacity-0 pointer-events-auto w-80";
  
  const iconMarkup = type === 'success' 
    ? `<div class="p-1 rounded bg-tealAccent/20 text-tealAccent"><i data-lucide="shield-check" class="w-4 h-4"></i></div>`
    : `<div class="p-1 rounded bg-white/10 text-textMuted"><i data-lucide="info" class="w-4 h-4"></i></div>`;
  
  toast.innerHTML = `
    ${iconMarkup}
    <p class="font-semibold leading-snug flex-1">${message}</p>
  `;
  
  container.appendChild(toast);
  lucide.createIcons();

  // Slide in
  setTimeout(() => {
    toast.classList.remove("translate-y-2", "opacity-0");
  }, 50);

  // Slide out and destroy
  setTimeout(() => {
    toast.classList.add("translate-y-2", "opacity-0");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4000);
}
