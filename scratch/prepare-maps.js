import fs from 'fs';
import path from 'path';
import * as d3 from 'd3-geo';

const WORLD_GEOJSON_URL = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_land.geojson';
// List of fallback URLs for India states GeoJSON
const INDIA_GEOJSON_URLS = [
  'https://raw.githubusercontent.com/india-in-data/india-states-2019/master/india_states.geojson',
  'https://raw.githubusercontent.com/AnujTiwari/GeoJson-India/master/state/india_states.geojson',
  'https://raw.githubusercontent.com/Subhashish/india-state-geojson/master/india_state.geojson'
];

async function fetchWithFallback(urls) {
  for (const url of urls) {
    try {
      console.log(`Trying to fetch from: ${url}`);
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        console.log(`Success fetching from: ${url}`);
        return data;
      }
      console.warn(`Failed to fetch from: ${url} (status: ${res.status})`);
    } catch (e) {
      console.warn(`Error fetching from: ${url}: ${e.message}`);
    }
  }
  throw new Error('All fallback URLs failed.');
}

async function main() {
  console.log('Fetching map data...');

  try {
    // 1. Fetch World Land
    const worldRes = await fetch(WORLD_GEOJSON_URL);
    if (!worldRes.ok) throw new Error(`Failed to fetch world land: ${worldRes.statusText}`);
    const worldData = await worldRes.json();
    console.log('World GeoJSON fetched.');

    // 2. Fetch India States
    const indiaData = await fetchWithFallback(INDIA_GEOJSON_URLS);
    console.log('India GeoJSON fetched.');

    // 3. Project World Land for a Globe (Orthographic)
    const worldGeom = worldData.features.map(f => {
      return {
        type: f.geometry.type,
        coordinates: f.geometry.coordinates
      };
    });

    // 4. Project India States for static display
    const width = 800;
    const height = 800;
    const projection = d3.geoMercator()
      .center([82.9, 22.9])
      .scale(1000)
      .translate([width / 2, height / 2]);

    const pathGenerator = d3.geoPath().projection(projection);

    const indiaPaths = [];
    
    for (const feature of indiaData.features) {
      const pathData = pathGenerator(feature);
      if (!pathData) continue; // Skip features that failed to project

      const bounds = pathGenerator.bounds(feature);
      const centroid = pathGenerator.centroid(feature);

      // Skip features with invalid bounds or centroids
      if (!bounds || 
          isNaN(bounds[0][0]) || isNaN(bounds[0][1]) || 
          isNaN(bounds[1][0]) || isNaN(bounds[1][1])) {
        continue;
      }
      if (!centroid || isNaN(centroid[0]) || isNaN(centroid[1])) {
        continue;
      }

      let name = feature.properties.ST_NM || feature.properties.state_name || feature.properties.NAME_1 || feature.properties.NAME || feature.properties.name || 'State';
      
      // Standardize state names to match our mockData keys exactly
      name = name.replace(/&/g, 'and')
                 .replace(/ Islands/i, '')
                 .replace(/ Island/i, '')
                 .replace(/Orissa/i, 'Odisha')
                 .replace(/Uttaranchal/i, 'Uttarakhand')
                 .trim();
                 
      if (name.includes('Arunachal')) name = 'Arunachal Pradesh';
      else if (name.includes('Andhra')) name = 'Andhra Pradesh';
      else if (name.includes('Himachal')) name = 'Himachal Pradesh';
      else if (name.includes('Jammu')) name = 'Jammu and Kashmir';
      else if (name.includes('Madhya')) name = 'Madhya Pradesh';
      else if (name.includes('Uttar Pradesh')) name = 'Uttar Pradesh';
      else if (name.includes('West Bengal')) name = 'West Bengal';
      else if (name.includes('Tamil')) name = 'Tamil Nadu';
      else if (name.includes('Puducherry') || name.includes('Pondicherry')) name = 'Puducherry';
      else if (name.includes('Delhi')) name = 'Delhi';
      else if (name.includes('Dadra') || name.includes('Daman')) name = 'Dadra and Nagar Haveli';

      indiaPaths.push({
        name,
        path: pathData,
        bounds,
        centroid
      });
    }

    console.log(`Projected ${indiaPaths.length} valid India state paths.`);

    // Write to src/components/Map/mapPaths.ts
    const outputDir = path.resolve('src/components/Map');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const fileContent = `// Auto-generated map coordinates and paths
// Generated on: ${new Date().toISOString()}

export interface IndiaStatePath {
  name: string;
  path: string;
  bounds: [[number, number], [number, number]];
  centroid: [number, number];
}

export interface WorldGeom {
  type: string;
  coordinates: any;
}

export const WORLD_LAND_GEOM: WorldGeom[] = ${JSON.stringify(worldGeom, null, 2)};

export const INDIA_STATES_PATHS: IndiaStatePath[] = ${JSON.stringify(indiaPaths, null, 2)};
`;

    fs.writeFileSync(path.join(outputDir, 'mapPaths.ts'), fileContent, 'utf-8');
    console.log('Successfully wrote mapPaths.ts!');

  } catch (error) {
    console.error('Error preparing map data:', error);
    process.exit(1);
  }
}

main();
