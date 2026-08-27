import os
import shutil
from PIL import Image

# Configurations
FRAMES_DIR = 'scroll-site/frames'
ASSETS_DIR = 'scroll-site/website-images'

os.makedirs(ASSETS_DIR, exist_ok=True)

# List of frames used in index.html static sections and their new names
static_assets = {
    "frame_0001.webp": "origin-mountains.webp",
    "frame_0180.webp": "sensor-node-telemetry.webp",
    "frame_0300.webp": "ml-risk-analysis.webp",
    "frame_0080.webp": "gallery-misty-peaks.webp",
    "frame_0150.webp": "gallery-sensor-probe.webp",
    "frame_0240.webp": "gallery-displacement-collapse.webp",
    "frame_0350.webp": "gallery-warning-tower.webp"
}

print("Extracting and separating static web assets...")

for src_name, dest_name in static_assets.items():
    src_path = os.path.join(FRAMES_DIR, src_name)
    dest_path = os.path.join(ASSETS_DIR, dest_name)
    
    if os.path.exists(src_path):
        # We save a high-quality copy directly to the static assets folder
        shutil.copy2(src_path, dest_path)
        print(f"  Copied {src_name} → website-images/{dest_name}")
    else:
        print(f"  Warning: Source frame {src_name} not found.")

print("Static assets folder setup complete.")
