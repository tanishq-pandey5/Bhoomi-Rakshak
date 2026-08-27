import fs from 'fs';
import path from 'path';

function convert() {
  console.log("Converting mapPaths.ts to vanilla mapData.js...");
  const tsPath = path.resolve('src/components/Map/mapPaths.ts');
  const jsDir = path.resolve('vanilla');
  const jsPath = path.join(jsDir, 'mapData.js');

  if (!fs.existsSync(jsDir)) {
    fs.mkdirSync(jsDir, { recursive: true });
  }

  if (!fs.existsSync(tsPath)) {
    console.error("Source mapPaths.ts not found. Run prepare-maps.js first.");
    process.exit(1);
  }

  let content = fs.readFileSync(tsPath, 'utf-8');

  // Strip TypeScript interface definitions and exports
  content = content.replace(/export interface IndiaStatePath \{[\s\S]*?\}/g, '');
  content = content.replace(/export interface WorldGeom \{[\s\S]*?\}/g, '');
  content = content.replace(/export const/g, 'const');
  content = content.replace(/: IndiaStatePath\[\]/g, '');
  content = content.replace(/: WorldGeom\[\]/g, '');

  // Add standard browser exports at the bottom
  const exports = `
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { WORLD_LAND_GEOM, INDIA_STATES_PATHS };
} else {
  window.WORLD_LAND_GEOM = WORLD_LAND_GEOM;
  window.INDIA_STATES_PATHS = INDIA_STATES_PATHS;
}
`;

  fs.writeFileSync(jsPath, content + exports, 'utf-8');
  console.log("Successfully wrote vanilla/mapData.js!");
}

convert();
