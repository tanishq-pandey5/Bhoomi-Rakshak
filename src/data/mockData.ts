export interface DistrictRisk {
  name: string;
  riskScore: number;
  riskLevel: 'Very Low' | 'Low' | 'Moderate' | 'High' | 'Very High' | 'Critical';
  mainDriver: string;
  alertStatus: 'Active' | 'Monitoring' | 'Resolved';
}

export interface RainfallForecastPoint {
  time: string;
  rainfall: number;
}

export interface RiskTrendPoint {
  day: string;
  risk: number;
}

export interface StateRiskProfile {
  name: string;
  code: string;
  region: 'North-East India' | 'Himalayan Region' | 'Other Regions';
  riskPercentage: number;
  riskLevel: 'Very Low' | 'Low' | 'Moderate' | 'High' | 'Very High' | 'Critical';
  riskTrend: 'Rising' | 'Stable' | 'Falling';
  lastUpdated: string;
  alertMessage: string;
  
  // 14 Risk Parameters
  rainfallIntensity: number; // mm/hr
  rainfall24h: number; // mm
  rainfall7d: number; // mm
  rainfall72hForecast: number; // mm
  soilMoisture: number; // %
  slopeAngle: number; // degrees
  soilDepth: number; // meters
  elevation: number; // meters
  distanceToStream: number; // meters
  drainageDensity: number; // km/km^2
  historicalLandslides: number; // events count
  crackReports: number; // count
  sensorVibration: number; // mm/s
  seismicityIndex: number; // 0-10 scale
  
  // Parameter Contribution (percentages summing to 100 or relative scores)
  contributions: {
    rainfall: number;
    soilMoisture: number;
    slope: number;
    lithology: number; // soil depth / elevation / geology
    historicalEvents: number;
    sensorVibration: number;
  };
  
  forecastSeries: RainfallForecastPoint[];
  trendSeries: RiskTrendPoint[];
  districts: DistrictRisk[];
}

export const getRiskLevel = (percentage: number): StateRiskProfile['riskLevel'] => {
  if (percentage <= 20) return 'Very Low';
  if (percentage <= 40) return 'Low';
  if (percentage <= 60) return 'Moderate';
  if (percentage <= 80) return 'High';
  if (percentage <= 95) return 'Very High';
  return 'Critical';
};

export const getRiskColor = (level: StateRiskProfile['riskLevel']): string => {
  switch (level) {
    case 'Very Low': return '#22C55E';
    case 'Low': return '#84CC16';
    case 'Moderate': return '#FACC15';
    case 'High': return '#F97316';
    case 'Very High': return '#EF4444';
    case 'Critical': return '#991B1B';
  }
};

// Handcrafted profiles for the 8 North-Eastern states and key Himalayan states
export const mockStatesData: Record<string, StateRiskProfile> = {
  "Meghalaya": {
    name: "Meghalaya",
    code: "ML",
    region: "North-East India",
    riskPercentage: 92,
    riskLevel: "Very High",
    riskTrend: "Rising",
    lastUpdated: "10 mins ago",
    alertMessage: "Very high landslide probability. Restrict movement near vulnerable slopes and activate local warnings.",
    rainfallIntensity: 58,
    rainfall24h: 182,
    rainfall7d: 540,
    rainfall72hForecast: 220,
    soilMoisture: 89,
    slopeAngle: 38,
    soilDepth: 2.8,
    elevation: 1496,
    distanceToStream: 120,
    drainageDensity: 4.2,
    historicalLandslides: 34,
    crackReports: 14,
    sensorVibration: 5.6,
    seismicityIndex: 6.8,
    contributions: {
      rainfall: 35,
      soilMoisture: 25,
      slope: 15,
      lithology: 10,
      historicalEvents: 10,
      sensorVibration: 5
    },
    forecastSeries: [
      { time: "0h", rainfall: 15 },
      { time: "12h", rainfall: 42 },
      { time: "24h", rainfall: 65 },
      { time: "36h", rainfall: 80 },
      { time: "48h", rainfall: 110 },
      { time: "60h", rainfall: 165 },
      { time: "72h", rainfall: 220 }
    ],
    trendSeries: [
      { day: "Aug 21", risk: 65 },
      { day: "Aug 22", risk: 70 },
      { day: "Aug 23", risk: 72 },
      { day: "Aug 24", risk: 78 },
      { day: "Aug 25", risk: 85 },
      { day: "Aug 26", risk: 89 },
      { day: "Aug 27", risk: 92 }
    ],
    districts: [
      { name: "East Khasi Hills", riskScore: 96, riskLevel: "Critical", mainDriver: "Extreme Rainfall", alertStatus: "Active" },
      { name: "West Garo Hills", riskScore: 88, riskLevel: "Very High", mainDriver: "Soil Saturation", alertStatus: "Active" },
      { name: "Ribhoi", riskScore: 78, riskLevel: "High", mainDriver: "Slope Angle", alertStatus: "Monitoring" },
      { name: "West Jaintia Hills", riskScore: 74, riskLevel: "High", mainDriver: "Rainfall Intensity", alertStatus: "Monitoring" },
      { name: "South Garo Hills", riskScore: 65, riskLevel: "High", mainDriver: "Soil Saturation", alertStatus: "Monitoring" }
    ]
  },
  "Sikkim": {
    name: "Sikkim",
    code: "SK",
    region: "North-East India",
    riskPercentage: 97,
    riskLevel: "Critical",
    riskTrend: "Rising",
    lastUpdated: "5 mins ago",
    alertMessage: "Critical landslide conditions detected. Immediate monitoring and local authority response recommended.",
    rainfallIntensity: 62,
    rainfall24h: 210,
    rainfall7d: 610,
    rainfall72hForecast: 280,
    soilMoisture: 93,
    slopeAngle: 44,
    soilDepth: 1.5,
    elevation: 3200,
    distanceToStream: 85,
    drainageDensity: 5.1,
    historicalLandslides: 48,
    crackReports: 22,
    sensorVibration: 8.2,
    seismicityIndex: 7.9,
    contributions: {
      rainfall: 30,
      soilMoisture: 20,
      slope: 20,
      sensorVibration: 15,
      historicalEvents: 10,
      lithology: 5
    },
    forecastSeries: [
      { time: "0h", rainfall: 25 },
      { time: "12h", rainfall: 58 },
      { time: "24h", rainfall: 92 },
      { time: "36h", rainfall: 130 },
      { time: "48h", rainfall: 180 },
      { time: "60h", rainfall: 240 },
      { time: "72h", rainfall: 280 }
    ],
    trendSeries: [
      { day: "Aug 21", risk: 78 },
      { day: "Aug 22", risk: 80 },
      { day: "Aug 23", risk: 84 },
      { day: "Aug 24", risk: 89 },
      { day: "Aug 25", risk: 93 },
      { day: "Aug 26", risk: 95 },
      { day: "Aug 27", risk: 97 }
    ],
    districts: [
      { name: "Gangtok", riskScore: 98, riskLevel: "Critical", mainDriver: "Sensor Vibration", alertStatus: "Active" },
      { name: "Mangan", riskScore: 97, riskLevel: "Critical", mainDriver: "Extreme Rainfall", alertStatus: "Active" },
      { name: "Pakyong", riskScore: 89, riskLevel: "Very High", mainDriver: "Slope Stability", alertStatus: "Active" },
      { name: "Gyalshing", riskScore: 82, riskLevel: "Very High", mainDriver: "Soil Moisture", alertStatus: "Monitoring" },
      { name: "Soreng", riskScore: 72, riskLevel: "High", mainDriver: "Seismicity Index", alertStatus: "Monitoring" }
    ]
  },
  "Assam": {
    name: "Assam",
    code: "AS",
    region: "North-East India",
    riskPercentage: 78,
    riskLevel: "High",
    riskTrend: "Stable",
    lastUpdated: "25 mins ago",
    alertMessage: "High landslide risk expected within the next 72 hours. Increase monitoring and prepare response teams.",
    rainfallIntensity: 42,
    rainfall24h: 115,
    rainfall7d: 310,
    rainfall72hForecast: 150,
    soilMoisture: 82,
    slopeAngle: 25,
    soilDepth: 4.2,
    elevation: 350,
    distanceToStream: 180,
    drainageDensity: 3.8,
    historicalLandslides: 18,
    crackReports: 5,
    sensorVibration: 3.1,
    seismicityIndex: 5.2,
    contributions: {
      rainfall: 40,
      soilMoisture: 30,
      historicalEvents: 15,
      slope: 5,
      lithology: 5,
      sensorVibration: 5
    },
    forecastSeries: [
      { time: "0h", rainfall: 10 },
      { time: "12h", rainfall: 30 },
      { time: "24h", rainfall: 55 },
      { time: "36h", rainfall: 80 },
      { time: "48h", rainfall: 105 },
      { time: "60h", rainfall: 130 },
      { time: "72h", rainfall: 150 }
    ],
    trendSeries: [
      { day: "Aug 21", risk: 75 },
      { day: "Aug 22", risk: 76 },
      { day: "Aug 23", risk: 78 },
      { day: "Aug 24", risk: 78 },
      { day: "Aug 25", risk: 79 },
      { day: "Aug 26", risk: 78 },
      { day: "Aug 27", risk: 78 }
    ],
    districts: [
      { name: "Dima Hasao", riskScore: 87, riskLevel: "Very High", mainDriver: "Slope Instability", alertStatus: "Active" },
      { name: "Karbi Anglong", riskScore: 76, riskLevel: "High", mainDriver: "Soil Saturation", alertStatus: "Monitoring" },
      { name: "Cachar", riskScore: 68, riskLevel: "High", mainDriver: "Accumulated Rainfall", alertStatus: "Monitoring" },
      { name: "Kamrup Metropolitan", riskScore: 62, riskLevel: "High", mainDriver: "Urban Slope Cuts", alertStatus: "Monitoring" },
      { name: "Hailakandi", riskScore: 55, riskLevel: "Moderate", mainDriver: "Riverbank Erosion", alertStatus: "Resolved" }
    ]
  },
  "Arunachal Pradesh": {
    name: "Arunachal Pradesh",
    code: "AR",
    region: "North-East India",
    riskPercentage: 86,
    riskLevel: "Very High",
    riskTrend: "Rising",
    lastUpdated: "15 mins ago",
    alertMessage: "Very high landslide probability. Restrict movement near vulnerable slopes and activate local warnings.",
    rainfallIntensity: 52,
    rainfall24h: 160,
    rainfall7d: 490,
    rainfall72hForecast: 195,
    soilMoisture: 87,
    slopeAngle: 42,
    soilDepth: 2.1,
    elevation: 2100,
    distanceToStream: 95,
    drainageDensity: 4.8,
    historicalLandslides: 31,
    crackReports: 12,
    sensorVibration: 4.8,
    seismicityIndex: 7.1,
    contributions: {
      rainfall: 32,
      slope: 22,
      soilMoisture: 18,
      historicalEvents: 12,
      sensorVibration: 10,
      lithology: 6
    },
    forecastSeries: [
      { time: "0h", rainfall: 12 },
      { time: "12h", rainfall: 35 },
      { time: "24h", rainfall: 60 },
      { time: "36h", rainfall: 90 },
      { time: "48h", rainfall: 120 },
      { time: "60h", rainfall: 160 },
      { time: "72h", rainfall: 195 }
    ],
    trendSeries: [
      { day: "Aug 21", risk: 74 },
      { day: "Aug 22", risk: 78 },
      { day: "Aug 23", risk: 80 },
      { day: "Aug 24", risk: 83 },
      { day: "Aug 25", risk: 85 },
      { day: "Aug 26", risk: 86 },
      { day: "Aug 27", risk: 86 }
    ],
    districts: [
      { name: "Tawang", riskScore: 92, riskLevel: "Very High", mainDriver: "Slope Angle", alertStatus: "Active" },
      { name: "West Kameng", riskScore: 87, riskLevel: "Very High", mainDriver: "Extreme Rainfall", alertStatus: "Active" },
      { name: "Papum Pare", riskScore: 82, riskLevel: "Very High", mainDriver: "Soil Saturation", alertStatus: "Monitoring" },
      { name: "Lower Subansiri", riskScore: 78, riskLevel: "High", mainDriver: "Lithology Cut", alertStatus: "Monitoring" },
      { name: "East Siang", riskScore: 69, riskLevel: "High", mainDriver: "Seismicity", alertStatus: "Monitoring" }
    ]
  },
  "Nagaland": {
    name: "Nagaland",
    code: "NL",
    region: "North-East India",
    riskPercentage: 81,
    riskLevel: "Very High",
    riskTrend: "Rising",
    lastUpdated: "18 mins ago",
    alertMessage: "Very high landslide probability. Restrict movement near vulnerable slopes and activate local warnings.",
    rainfallIntensity: 48,
    rainfall24h: 135,
    rainfall7d: 410,
    rainfall72hForecast: 170,
    soilMoisture: 84,
    slopeAngle: 36,
    soilDepth: 2.5,
    elevation: 1444,
    distanceToStream: 110,
    drainageDensity: 4.0,
    historicalLandslides: 24,
    crackReports: 9,
    sensorVibration: 4.2,
    seismicityIndex: 6.4,
    contributions: {
      rainfall: 35,
      soilMoisture: 20,
      slope: 15,
      historicalEvents: 12,
      sensorVibration: 10,
      lithology: 8
    },
    forecastSeries: [
      { time: "0h", rainfall: 8 },
      { time: "12h", rainfall: 28 },
      { time: "24h", rainfall: 50 },
      { time: "36h", rainfall: 78 },
      { time: "48h", rainfall: 110 },
      { time: "60h", rainfall: 140 },
      { time: "72h", rainfall: 170 }
    ],
    trendSeries: [
      { day: "Aug 21", risk: 70 },
      { day: "Aug 22", risk: 73 },
      { day: "Aug 23", risk: 76 },
      { day: "Aug 24", risk: 79 },
      { day: "Aug 25", risk: 80 },
      { day: "Aug 26", risk: 81 },
      { day: "Aug 27", risk: 81 }
    ],
    districts: [
      { name: "Kohima", riskScore: 89, riskLevel: "Very High", mainDriver: "Slope Instability", alertStatus: "Active" },
      { name: "Phek", riskScore: 82, riskLevel: "Very High", mainDriver: "Soil Saturation", alertStatus: "Active" },
      { name: "Mokokchung", riskScore: 75, riskLevel: "High", mainDriver: "Seismicity", alertStatus: "Monitoring" },
      { name: "Wokha", riskScore: 68, riskLevel: "High", mainDriver: "Rainfall Intensity", alertStatus: "Monitoring" },
      { name: "Dimapur", riskScore: 42, riskLevel: "Low", mainDriver: "Flat Terrain", alertStatus: "Resolved" }
    ]
  },
  "Manipur": {
    name: "Manipur",
    code: "MN",
    region: "North-East India",
    riskPercentage: 74,
    riskLevel: "High",
    riskTrend: "Stable",
    lastUpdated: "32 mins ago",
    alertMessage: "High landslide risk expected within the next 72 hours. Increase monitoring and prepare response teams.",
    rainfallIntensity: 39,
    rainfall24h: 98,
    rainfall7d: 280,
    rainfall72hForecast: 130,
    soilMoisture: 79,
    slopeAngle: 32,
    soilDepth: 2.9,
    elevation: 790,
    distanceToStream: 140,
    drainageDensity: 3.5,
    historicalLandslides: 16,
    crackReports: 4,
    sensorVibration: 2.9,
    seismicityIndex: 6.0,
    contributions: {
      rainfall: 38,
      soilMoisture: 22,
      slope: 18,
      historicalEvents: 10,
      sensorVibration: 6,
      lithology: 6
    },
    forecastSeries: [
      { time: "0h", rainfall: 5 },
      { time: "12h", rainfall: 22 },
      { time: "24h", rainfall: 42 },
      { time: "36h", rainfall: 65 },
      { time: "48h", rainfall: 88 },
      { time: "60h", rainfall: 110 },
      { time: "72h", rainfall: 130 }
    ],
    trendSeries: [
      { day: "Aug 21", risk: 71 },
      { day: "Aug 22", risk: 72 },
      { day: "Aug 23", risk: 73 },
      { day: "Aug 24", risk: 74 },
      { day: "Aug 25", risk: 74 },
      { day: "Aug 26", risk: 74 },
      { day: "Aug 27", risk: 74 }
    ],
    districts: [
      { name: "Senapati", riskScore: 82, riskLevel: "Very High", mainDriver: "Soil Moisture", alertStatus: "Monitoring" },
      { name: "Tamenglong", riskScore: 78, riskLevel: "High", mainDriver: "Slope Stability", alertStatus: "Monitoring" },
      { name: "Ukhrul", riskScore: 75, riskLevel: "High", mainDriver: "Historical Events", alertStatus: "Monitoring" },
      { name: "Churachandpur", riskScore: 68, riskLevel: "High", mainDriver: "Rainfall intensity", alertStatus: "Monitoring" },
      { name: "Imphal West", riskScore: 48, riskLevel: "Low", mainDriver: "Low Slope Angle", alertStatus: "Resolved" }
    ]
  },
  "Mizoram": {
    name: "Mizoram",
    code: "MZ",
    region: "North-East India",
    riskPercentage: 79,
    riskLevel: "High",
    riskTrend: "Rising",
    lastUpdated: "20 mins ago",
    alertMessage: "High landslide risk expected within the next 72 hours. Increase monitoring and prepare response teams.",
    rainfallIntensity: 45,
    rainfall24h: 120,
    rainfall7d: 380,
    rainfall72hForecast: 160,
    soilMoisture: 83,
    slopeAngle: 35,
    soilDepth: 2.3,
    elevation: 1132,
    distanceToStream: 105,
    drainageDensity: 4.1,
    historicalLandslides: 22,
    crackReports: 8,
    sensorVibration: 3.9,
    seismicityIndex: 6.5,
    contributions: {
      rainfall: 36,
      soilMoisture: 24,
      slope: 16,
      historicalEvents: 12,
      sensorVibration: 6,
      lithology: 6
    },
    forecastSeries: [
      { time: "0h", rainfall: 8 },
      { time: "12h", rainfall: 25 },
      { time: "24h", rainfall: 52 },
      { time: "36h", rainfall: 75 },
      { time: "48h", rainfall: 105 },
      { time: "60h", rainfall: 135 },
      { time: "72h", rainfall: 160 }
    ],
    trendSeries: [
      { day: "Aug 21", risk: 72 },
      { day: "Aug 22", risk: 74 },
      { day: "Aug 23", risk: 75 },
      { day: "Aug 24", risk: 76 },
      { day: "Aug 25", risk: 77 },
      { day: "Aug 26", risk: 79 },
      { day: "Aug 27", risk: 79 }
    ],
    districts: [
      { name: "Aizawl", riskScore: 88, riskLevel: "Very High", mainDriver: "Urban Slopes", alertStatus: "Active" },
      { name: "Lunglei", riskScore: 81, riskLevel: "Very High", mainDriver: "Rainfall Intensity", alertStatus: "Monitoring" },
      { name: "Champhai", riskScore: 74, riskLevel: "High", mainDriver: "Seismicity", alertStatus: "Monitoring" },
      { name: "Serchhip", riskScore: 67, riskLevel: "High", mainDriver: "Soil Saturation", alertStatus: "Monitoring" },
      { name: "Mamit", riskScore: 59, riskLevel: "Moderate", mainDriver: "River Action", alertStatus: "Resolved" }
    ]
  },
  "Tripura": {
    name: "Tripura",
    code: "TR",
    region: "North-East India",
    riskPercentage: 54,
    riskLevel: "Moderate",
    riskTrend: "Stable",
    lastUpdated: "45 mins ago",
    alertMessage: "Moderate risk detected. Continue monitoring rainfall, soil moisture, and slope conditions.",
    rainfallIntensity: 28,
    rainfall24h: 65,
    rainfall7d: 190,
    rainfall72hForecast: 85,
    soilMoisture: 72,
    slopeAngle: 18,
    soilDepth: 3.8,
    elevation: 150,
    distanceToStream: 220,
    drainageDensity: 3.1,
    historicalLandslides: 6,
    crackReports: 1,
    sensorVibration: 1.5,
    seismicityIndex: 4.8,
    contributions: {
      rainfall: 45,
      soilMoisture: 25,
      historicalEvents: 10,
      slope: 10,
      lithology: 5,
      sensorVibration: 5
    },
    forecastSeries: [
      { time: "0h", rainfall: 2 },
      { time: "12h", rainfall: 12 },
      { time: "24h", rainfall: 25 },
      { time: "36h", rainfall: 42 },
      { time: "48h", rainfall: 58 },
      { time: "60h", rainfall: 72 },
      { time: "72h", rainfall: 85 }
    ],
    trendSeries: [
      { day: "Aug 21", risk: 52 },
      { day: "Aug 22", risk: 53 },
      { day: "Aug 23", risk: 54 },
      { day: "Aug 24", risk: 54 },
      { day: "Aug 25", risk: 54 },
      { day: "Aug 26", risk: 54 },
      { day: "Aug 27", risk: 54 }
    ],
    districts: [
      { name: "Dhalai", riskScore: 62, riskLevel: "High", mainDriver: "Soil Moisture", alertStatus: "Monitoring" },
      { name: "South Tripura", riskScore: 58, riskLevel: "Moderate", mainDriver: "Rainfall Accumulation", alertStatus: "Monitoring" },
      { name: "Unakoti", riskScore: 52, riskLevel: "Moderate", mainDriver: "Slope Stability", alertStatus: "Resolved" },
      { name: "West Tripura", riskScore: 44, riskLevel: "Low", mainDriver: "Gentle Terrain", alertStatus: "Resolved" }
    ]
  },
  "Himachal Pradesh": {
    name: "Himachal Pradesh",
    code: "HP",
    region: "Himalayan Region",
    riskPercentage: 88,
    riskLevel: "Very High",
    riskTrend: "Rising",
    lastUpdated: "12 mins ago",
    alertMessage: "Very high landslide probability. Restrict movement near vulnerable slopes and activate local warnings.",
    rainfallIntensity: 48,
    rainfall24h: 145,
    rainfall7d: 420,
    rainfall72hForecast: 180,
    soilMoisture: 86,
    slopeAngle: 39,
    soilDepth: 1.8,
    elevation: 2200,
    distanceToStream: 98,
    drainageDensity: 4.5,
    historicalLandslides: 38,
    crackReports: 16,
    sensorVibration: 5.1,
    seismicityIndex: 7.2,
    contributions: {
      rainfall: 32,
      slope: 22,
      soilMoisture: 18,
      historicalEvents: 12,
      sensorVibration: 10,
      lithology: 6
    },
    forecastSeries: [
      { time: "0h", rainfall: 15 },
      { time: "12h", rainfall: 38 },
      { time: "24h", rainfall: 62 },
      { time: "36h", rainfall: 85 },
      { time: "48h", rainfall: 120 },
      { time: "60h", rainfall: 150 },
      { time: "72h", rainfall: 180 }
    ],
    trendSeries: [
      { day: "Aug 21", risk: 79 },
      { day: "Aug 22", risk: 81 },
      { day: "Aug 23", risk: 83 },
      { day: "Aug 24", risk: 85 },
      { day: "Aug 25", risk: 87 },
      { day: "Aug 26", risk: 88 },
      { day: "Aug 27", risk: 88 }
    ],
    districts: [
      { name: "Shimla", riskScore: 92, riskLevel: "Very High", mainDriver: "Construction Stress", alertStatus: "Active" },
      { name: "Kullu", riskScore: 89, riskLevel: "Very High", mainDriver: "Extreme Rainfall", alertStatus: "Active" },
      { name: "Mandi", riskScore: 84, riskLevel: "Very High", mainDriver: "Slope Stability", alertStatus: "Monitoring" },
      { name: "Kangra", riskScore: 76, riskLevel: "High", mainDriver: "Soil Moisture", alertStatus: "Monitoring" },
      { name: "Chamba", riskScore: 72, riskLevel: "High", mainDriver: "Historical Slides", alertStatus: "Monitoring" }
    ]
  },
  "Uttarakhand": {
    name: "Uttarakhand",
    code: "UT",
    region: "Himalayan Region",
    riskPercentage: 91,
    riskLevel: "Very High",
    riskTrend: "Rising",
    lastUpdated: "8 mins ago",
    alertMessage: "Very high landslide probability. Restrict movement near vulnerable slopes and activate local warnings.",
    rainfallIntensity: 54,
    rainfall24h: 175,
    rainfall7d: 510,
    rainfall72hForecast: 210,
    soilMoisture: 88,
    slopeAngle: 41,
    soilDepth: 1.6,
    elevation: 2500,
    distanceToStream: 90,
    drainageDensity: 4.7,
    historicalLandslides: 42,
    crackReports: 19,
    sensorVibration: 5.9,
    seismicityIndex: 7.5,
    contributions: {
      rainfall: 34,
      slope: 20,
      soilMoisture: 18,
      historicalEvents: 12,
      sensorVibration: 10,
      lithology: 6
    },
    forecastSeries: [
      { time: "0h", rainfall: 18 },
      { time: "12h", rainfall: 42 },
      { time: "24h", rainfall: 70 },
      { time: "36h", rainfall: 98 },
      { time: "48h", rainfall: 135 },
      { time: "60h", rainfall: 175 },
      { time: "72h", rainfall: 210 }
    ],
    trendSeries: [
      { day: "Aug 21", risk: 80 },
      { day: "Aug 22", risk: 82 },
      { day: "Aug 23", risk: 85 },
      { day: "Aug 24", risk: 87 },
      { day: "Aug 25", risk: 89 },
      { day: "Aug 26", risk: 91 },
      { day: "Aug 27", risk: 91 }
    ],
    districts: [
      { name: "Chamoli", riskScore: 95, riskLevel: "Critical", mainDriver: "Debris Flow", alertStatus: "Active" },
      { name: "Pithoragarh", riskScore: 91, riskLevel: "Very High", mainDriver: "Seismicity", alertStatus: "Active" },
      { name: "Uttarkashi", riskScore: 89, riskLevel: "Very High", mainDriver: "Extreme Rainfall", alertStatus: "Active" },
      { name: "Rudraprayag", riskScore: 87, riskLevel: "Very High", mainDriver: "Slope Failure", alertStatus: "Monitoring" },
      { name: "Dehradun", riskScore: 68, riskLevel: "High", mainDriver: "Soil Saturation", alertStatus: "Monitoring" }
    ]
  },
  "Jammu and Kashmir": {
    name: "Jammu and Kashmir",
    code: "JK",
    region: "Himalayan Region",
    riskPercentage: 78,
    riskLevel: "High",
    riskTrend: "Stable",
    lastUpdated: "35 mins ago",
    alertMessage: "High landslide risk expected within the next 72 hours. Increase monitoring and prepare response teams.",
    rainfallIntensity: 38,
    rainfall24h: 92,
    rainfall7d: 260,
    rainfall72hForecast: 120,
    soilMoisture: 78,
    slopeAngle: 36,
    soilDepth: 2.0,
    elevation: 2200,
    distanceToStream: 110,
    drainageDensity: 3.9,
    historicalLandslides: 26,
    crackReports: 6,
    sensorVibration: 3.2,
    seismicityIndex: 6.9,
    contributions: {
      rainfall: 35,
      slope: 20,
      soilMoisture: 18,
      historicalEvents: 12,
      sensorVibration: 8,
      lithology: 7
    },
    forecastSeries: [
      { time: "0h", rainfall: 5 },
      { time: "12h", rainfall: 20 },
      { time: "24h", rainfall: 40 },
      { time: "36h", rainfall: 60 },
      { time: "48h", rainfall: 80 },
      { time: "60h", rainfall: 100 },
      { time: "72h", rainfall: 120 }
    ],
    trendSeries: [
      { day: "Aug 21", risk: 75 },
      { day: "Aug 22", risk: 76 },
      { day: "Aug 23", risk: 77 },
      { day: "Aug 24", risk: 78 },
      { day: "Aug 25", risk: 78 },
      { day: "Aug 26", risk: 78 },
      { day: "Aug 27", risk: 78 }
    ],
    districts: [
      { name: "Ramban", riskScore: 88, riskLevel: "Very High", mainDriver: "NH-44 Cutting stress", alertStatus: "Active" },
      { name: "Reasi", riskScore: 81, riskLevel: "Very High", mainDriver: "Seismicity", alertStatus: "Monitoring" },
      { name: "Poonch", riskScore: 74, riskLevel: "High", mainDriver: "Soil Moisture", alertStatus: "Monitoring" },
      { name: "Srinagar", riskScore: 45, riskLevel: "Low", mainDriver: "Low Slope", alertStatus: "Resolved" }
    ]
  }
};

// All other Indian states and UTs with structured automatic generated profiles for clean searches
export const otherStatesList: { name: string; code: string; region: StateRiskProfile['region']; baseRisk: number }[] = [
  { name: "Andhra Pradesh", code: "AP", region: "Other Regions", baseRisk: 28 },
  { name: "Bihar", code: "BR", region: "Other Regions", baseRisk: 15 },
  { name: "Chhattisgarh", code: "CG", region: "Other Regions", baseRisk: 24 },
  { name: "Goa", code: "GA", region: "Other Regions", baseRisk: 48 },
  { name: "Gujarat", code: "GJ", region: "Other Regions", baseRisk: 12 },
  { name: "Haryana", code: "HR", region: "Other Regions", baseRisk: 8 },
  { name: "Jharkhand", code: "JH", region: "Other Regions", baseRisk: 22 },
  { name: "Karnataka", code: "KA", region: "Other Regions", baseRisk: 42 },
  { name: "Kerala", code: "KL", region: "Other Regions", baseRisk: 68 },
  { name: "Madhya Pradesh", code: "MP", region: "Other Regions", baseRisk: 16 },
  { name: "Maharashtra", code: "MH", region: "Other Regions", baseRisk: 55 },
  { name: "Odisha", code: "OD", region: "Other Regions", baseRisk: 34 },
  { name: "Punjab", code: "PB", region: "Other Regions", baseRisk: 5 },
  { name: "Rajasthan", code: "RJ", region: "Other Regions", baseRisk: 9 },
  { name: "Tamil Nadu", code: "TN", region: "Other Regions", baseRisk: 38 },
  { name: "Telangana", code: "TG", region: "Other Regions", baseRisk: 14 },
  { name: "Uttar Pradesh", code: "UP", region: "Other Regions", baseRisk: 11 },
  { name: "West Bengal", code: "WB", region: "Other Regions", baseRisk: 35 },
  { name: "Delhi", code: "DL", region: "Other Regions", baseRisk: 5 },
  { name: "Ladakh", code: "LA", region: "Himalayan Region", baseRisk: 48 },
  { name: "Puducherry", code: "PY", region: "Other Regions", baseRisk: 8 },
  { name: "Andaman and Nicobar", code: "AN", region: "Other Regions", baseRisk: 32 },
  { name: "Chandigarh", code: "CH", region: "Other Regions", baseRisk: 5 },
  { name: "Dadra and Nagar Haveli", code: "DN", region: "Other Regions", baseRisk: 15 },
  { name: "Lakshadweep", code: "LD", region: "Other Regions", baseRisk: 6 }
];

// Helper to compile data dynamically on request
export const getFullStateProfile = (stateName: string): StateRiskProfile => {
  if (mockStatesData[stateName]) {
    return mockStatesData[stateName];
  }
  
  const found = otherStatesList.find(s => s.name.toLowerCase() === stateName.toLowerCase() || s.code.toLowerCase() === stateName.toLowerCase());
  
  const baseRisk = found ? found.baseRisk : 15;
  const region = found ? found.region : "Other Regions";
  const code = found ? found.code : "IN";
  const level = getRiskLevel(baseRisk);
  
  // Generate a realistic mock profile for a given state
  const isHighRisk = baseRisk > 50;
  const slope = isHighRisk ? 28 : (baseRisk > 30 ? 16 : 8);
  const moisture = baseRisk + 15;
  const vibration = isHighRisk ? 3.2 : 0.8;
  const seismicity = isHighRisk ? 5.2 : 1.5;
  const intensity = baseRisk / 2;
  const rainfall24h = baseRisk * 1.5;
  
  let alert = "Low current risk. Continue routine monitoring.";
  if (level === 'Critical') alert = "Critical landslide conditions detected. Immediate monitoring and local authority response recommended.";
  else if (level === 'Very High') alert = "Very high landslide probability. Restrict movement near vulnerable slopes and activate local warnings.";
  else if (level === 'High') alert = "High landslide risk expected within the next 72 hours. Increase monitoring and prepare response teams.";
  else if (level === 'Moderate') alert = "Moderate risk detected. Continue monitoring rainfall, soil moisture, and slope conditions.";

  return {
    name: found ? found.name : stateName,
    code,
    region,
    riskPercentage: baseRisk,
    riskLevel: level,
    riskTrend: "Stable",
    lastUpdated: "1 hour ago",
    alertMessage: alert,
    
    rainfallIntensity: Number(intensity.toFixed(1)),
    rainfall24h: Number(rainfall24h.toFixed(1)),
    rainfall7d: Number((baseRisk * 4).toFixed(1)),
    rainfall72hForecast: Number((baseRisk * 2).toFixed(1)),
    soilMoisture: Number(Math.min(95, moisture).toFixed(1)),
    slopeAngle: slope,
    soilDepth: 3.5,
    elevation: region === "Himalayan Region" ? 1800 : (isHighRisk ? 600 : 80),
    distanceToStream: isHighRisk ? 150 : 450,
    drainageDensity: 2.1,
    historicalLandslides: isHighRisk ? 12 : 1,
    crackReports: isHighRisk ? 3 : 0,
    sensorVibration: vibration,
    seismicityIndex: seismicity,
    contributions: {
      rainfall: 40,
      soilMoisture: 30,
      slope: 15,
      lithology: 5,
      historicalEvents: 5,
      sensorVibration: 5
    },
    forecastSeries: [
      { time: "0h", rainfall: Math.round(rainfall24h * 0.1) },
      { time: "12h", rainfall: Math.round(rainfall24h * 0.3) },
      { time: "24h", rainfall: Math.round(rainfall24h * 0.6) },
      { time: "36h", rainfall: Math.round(rainfall24h * 0.8) },
      { time: "48h", rainfall: Math.round(rainfall24h * 1.0) },
      { time: "60h", rainfall: Math.round(rainfall24h * 1.2) },
      { time: "72h", rainfall: Math.round(rainfall24h * 1.5) }
    ],
    trendSeries: [
      { day: "Aug 21", risk: Math.max(0, baseRisk - 4) },
      { day: "Aug 22", risk: Math.max(0, baseRisk - 2) },
      { day: "Aug 23", risk: baseRisk },
      { day: "Aug 24", risk: baseRisk },
      { day: "Aug 25", risk: baseRisk },
      { day: "Aug 26", risk: baseRisk },
      { day: "Aug 27", risk: baseRisk }
    ],
    districts: [
      { name: "District A", riskScore: baseRisk + 5, riskLevel: getRiskLevel(baseRisk + 5), mainDriver: "Rainfall", alertStatus: "Monitoring" },
      { name: "District B", riskScore: Math.max(0, baseRisk - 5), riskLevel: getRiskLevel(Math.max(0, baseRisk - 5)), mainDriver: "Slope Stability", alertStatus: "Resolved" }
    ]
  };
};

export const allStatesList = [
  ...Object.keys(mockStatesData),
  ...otherStatesList.map(s => s.name)
].sort();

// Core alerts list showing critical/high risks primarily focused on NE region
export interface SystemAlert {
  id: string;
  severity: 'Critical' | 'High' | 'Moderate' | 'Info';
  location: string;
  message: string;
  timestamp: string;
  action: string;
  status: 'Active' | 'Monitoring' | 'Resolved';
}

export const liveAlertsData: SystemAlert[] = [
  {
    id: "alert-1",
    severity: "Critical",
    location: "Mangan, Sikkim",
    message: "Critical landslide condition detected. Local rainfall exceeded 210mm in 24 hours. Crack sensor vibration alert triggered.",
    timestamp: "5 mins ago",
    action: "Evacuate low-lying slopes. Restrict NH-10 highway traffic. Mobilize NDRF teams.",
    status: "Active"
  },
  {
    id: "alert-2",
    severity: "High",
    location: "East Khasi Hills, Meghalaya",
    message: "Extreme soil moisture saturation (89%) and rising rainfall intensity of 58mm/hr.",
    timestamp: "10 mins ago",
    action: "Activate local monitoring. Advisory warning for Cherrapunji and surrounding cliffs.",
    status: "Active"
  },
  {
    id: "alert-3",
    severity: "High",
    location: "Kohima, Nagaland",
    message: "Slope displacement indicator shows movement of 4.2mm/s. High probability of slide within 24 hours.",
    timestamp: "18 mins ago",
    action: "Divert traffic from vulnerable bypasses. Restrict building works.",
    status: "Monitoring"
  },
  {
    id: "alert-4",
    severity: "Moderate",
    location: "Dima Hasao, Assam",
    message: "Elevated slope instability observed along railway cuts. Cumulative 7-day rainfall at 310mm.",
    timestamp: "25 mins ago",
    action: "Run train speed restrictions on hilly segments. Clean debris catchments.",
    status: "Monitoring"
  },
  {
    id: "alert-5",
    severity: "High",
    location: "Chamoli, Uttarakhand",
    message: "Debris flow threat due to rainstorm. Soil saturation levels at 88%.",
    timestamp: "40 mins ago",
    action: "Restrict trekking routes. Monitor river valley levels closely.",
    status: "Active"
  },
  {
    id: "alert-6",
    severity: "Moderate",
    location: "Wayanad, Kerala",
    message: "Western Ghats telemetry reports moderate rainfall accumulation. High local saturation.",
    timestamp: "1 hour ago",
    action: "Routine monitoring active. Local community volunteers notified.",
    status: "Monitoring"
  },
  {
    id: "alert-7",
    severity: "Info",
    location: "Gangtok, Sikkim",
    message: "Historical landslide zone stabilized after structural netting. Sensor vibrations normal.",
    timestamp: "4 hours ago",
    action: "Telemetry calibration completed. Netting status secure.",
    status: "Resolved"
  }
];
