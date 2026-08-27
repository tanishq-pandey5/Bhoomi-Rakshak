import os
import json
import cv2
from PIL import Image

# Configurations
V1_PATH = 'Inspiration/Earth_zooming_to_Indian_mountains_202608280102.mp4'
V2_PATH = 'Inspiration/AI_climate_risk_analysis_video_202608280107.mp4'
OUTPUT_DIR = 'scroll-site/frames'
TARGET_WIDTH = 1400
TARGET_HEIGHT = 788 # Keep 16:9 aspect ratio of 1920x1080

os.makedirs(OUTPUT_DIR, exist_ok=True)

# Clean up existing frames
print("Cleaning up old frames in scroll-site/frames...")
for f in os.listdir(OUTPUT_DIR):
    if f.endswith('.webp') or f.endswith('.json'):
        try:
            os.remove(os.path.join(OUTPUT_DIR, f))
        except OSError:
            pass

def extract_frames_from_video(video_path, start_index):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"Error opening video: {video_path}")
        return 0
        
    count = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break
            
        # Convert BGR (OpenCV) to RGB (Pillow)
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        img = Image.fromarray(rgb_frame)
        
        # Resize frame
        img_resized = img.resize((TARGET_WIDTH, TARGET_HEIGHT), Image.Resampling.LANCZOS)
        
        # Save as WebP
        frame_idx = start_index + count
        output_path = os.path.join(OUTPUT_DIR, f"frame_{frame_idx+1:04d}.webp")
        img_resized.save(output_path, 'WEBP', quality=85)
        
        count += 1
        if count % 20 == 0:
            print(f"  Processed {count} frames from {os.path.basename(video_path)}...")
            
    cap.release()
    return count

print("Processing Video 1: Earth zoom to mountains...")
v1_count = extract_frames_from_video(V1_PATH, 0)
print(f"Video 1 complete. Extracted {v1_count} frames.")

print("Processing Video 2: AI climate risk analysis...")
v2_count = extract_frames_from_video(V2_PATH, v1_count)
print(f"Video 2 complete. Extracted {v2_count} frames.")

total_frames = v1_count + v2_count
print(f"Extraction complete! Total frames generated: {total_frames}")

# Write frames.json manifest
manifest = {
    "count": total_frames,
    "pattern": "frames/frame_%04d.webp"
}
with open(os.path.join(OUTPUT_DIR, "frames.json"), 'w') as f:
    json.dump(manifest, f)
print("Updated manifest frames.json written successfully.")
