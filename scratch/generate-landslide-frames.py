import os
import json
import math
import random
from PIL import Image, ImageDraw, ImageFont

# Configurations
FRAMES_DIR = 'scroll-site/frames'
IMAGE_WIDTH = 1400
IMAGE_HEIGHT = 1050
NUM_FRAMES = 100

os.makedirs(FRAMES_DIR, exist_ok=True)

# Generate frames
print(f"Generating {NUM_FRAMES} high-resolution landslide simulation frames...")

for i in range(NUM_FRAMES):
    # Create image
    img = Image.new('RGB', (IMAGE_WIDTH, IMAGE_HEIGHT), color='#051321')
    draw = ImageDraw.Draw(img)
    
    # 1. Background grid overlay
    grid_spacing = 80
    for x in range(0, IMAGE_WIDTH, grid_spacing):
        draw.line([(x, 0), (x, IMAGE_HEIGHT)], fill='#0b263d', width=1)
    for y in range(0, IMAGE_HEIGHT, grid_spacing):
        draw.line([(0, y), (IMAGE_WIDTH, y)], fill='#0b263d', width=1)
        
    # 2. Draw mountain profile layers
    # Bedrock profile
    bedrock_pts = [
        (0, IMAGE_HEIGHT),
        (0, 800),
        (400, 680),
        (800, 520),
        (1200, 420),
        (IMAGE_WIDTH, 400),
        (IMAGE_WIDTH, IMAGE_HEIGHT)
    ]
    draw.polygon(bedrock_pts, fill='#0d263a')
    
    # Clay boundary layer (dynamic color depending on saturation level)
    # Saturation increases from frame 20 onwards
    sat_factor = 0.0
    if i >= 20:
        sat_factor = min(1.0, (i - 20) / 40.0) # maxes out at frame 60
        
    # Color transition: Green -> Saffron -> Red
    r = int(22 + sat_factor * (239 - 22))
    g = int(197 - sat_factor * (197 - 68))
    b = int(94 - sat_factor * (94 - 68))
    clay_color = f'#{r:02x}{g:02x}{b:02x}'
    
    clay_thickness = 25
    clay_pts = []
    for x, y in [(0, 800), (400, 680), (800, 520), (1200, 420), (IMAGE_WIDTH, 400)]:
        clay_pts.append((x, y - clay_thickness))
    # Reverse loop for thickness
    for x, y in reversed([(0, 800), (400, 680), (800, 520), (1200, 420), (IMAGE_WIDTH, 400)]):
        clay_pts.append((x, y))
        
    draw.polygon(clay_pts, fill=clay_color)
    
    # Topsoil layer (physically slides down starting at frame 60)
    slide_offset_x = 0
    slide_offset_y = 0
    if i >= 60:
        slide_progress = (i - 60) / 25.0 # slides for 25 frames
        slide_offset_x = min(120, int(slide_progress * 120))
        slide_offset_y = min(90, int(slide_progress * 90))
        
    topsoil_pts = [
        (0 + slide_offset_x, 800 - clay_thickness - 120 + slide_offset_y),
        (400 + slide_offset_x, 680 - clay_thickness - 100 + slide_offset_y),
        (800 + slide_offset_x, 520 - clay_thickness - 80 + slide_offset_y),
        (1200 + slide_offset_x, 420 - clay_thickness - 60 + slide_offset_y),
        (IMAGE_WIDTH + slide_offset_x, 400 - clay_thickness - 50 + slide_offset_y),
        (IMAGE_WIDTH + slide_offset_x, 400 - clay_thickness + slide_offset_y),
        (1200 + slide_offset_x, 420 - clay_thickness + slide_offset_y),
        (800 + slide_offset_x, 520 - clay_thickness + slide_offset_y),
        (400 + slide_offset_x, 680 - clay_thickness + slide_offset_y),
        (0 + slide_offset_x, 800 - clay_thickness + slide_offset_y)
    ]
    draw.polygon(topsoil_pts, fill='#1e3a5f')
    
    # 3. Dynamic Rain lines
    # Rain density increases over time
    rain_density = 40 + min(120, int(i * 1.5))
    random.seed(i * 123) # consistent rain positions per frame
    for _ in range(rain_density):
        rx = random.randint(0, IMAGE_WIDTH)
        ry = random.randint(0, IMAGE_HEIGHT - 300)
        rlen = random.randint(15, 45)
        # falling angle
        draw.line([(rx, ry), (rx - 10, ry + rlen)], fill='#4a6b8c', width=1)
        
    # 4. Draw Geophone/Telemetry Node
    # Node sits on the slope at x=800
    node_x = 800
    node_y = 520 - clay_thickness - 80
    
    # Apply slide offset if sliding
    if i >= 60:
        node_x += slide_offset_x
        node_y += slide_offset_y
        
    if i >= 20:
        # Pulsing circle overlay
        pulse_r = int(12 + abs(math.sin(i * 0.2)) * 36)
        draw.ellipse([(node_x - pulse_r, node_y - pulse_r), (node_x + pulse_r, node_y + pulse_r)], outline='#16b8a6', width=2)
        
        # Node body
        draw.rectangle([(node_x - 14, node_y - 28), (node_x + 14, node_y + 6)], fill='#0b263d', outline='#16b8a6', width=3)
        draw.ellipse([(node_x - 6, node_y - 18), (node_x + 6, node_y - 6)], fill='#16b8a6')
        
    # 5. Early Warning Siren Tower
    # Tower sits at x=1200, y=420 (on stable bedrock)
    tower_x = 1200
    tower_y = 420 - clay_thickness - 60
    # Draw tower scaffold
    draw.line([(tower_x, tower_y), (tower_x - 20, tower_y + 120)], fill='#9fb3c8', width=4)
    draw.line([(tower_x, tower_y), (tower_x + 20, tower_y + 120)], fill='#9fb3c8', width=4)
    draw.line([(tower_x - 20, tower_y + 120), (tower_x + 20, tower_y + 120)], fill='#9fb3c8', width=4)
    
    # Broadcast sirens
    draw.ellipse([(tower_x - 10, tower_y - 10), (tower_x + 10, tower_y + 10)], fill='#0b263d', outline='#9fb3c8', width=2)
    
    # Siren flash waves (starting from frame 75 onwards)
    if i >= 75:
        # Alternating flashing red beacons
        flash_color = '#ef4444' if (i // 3) % 2 == 0 else '#ff9f43'
        draw.ellipse([(tower_x - 6, tower_y - 18), (tower_x + 6, tower_y - 6)], fill=flash_color)
        
        # Audio waves
        wave_r1 = int(20 + (i % 6) * 12)
        draw.arc([(tower_x - wave_r1, tower_y - wave_r1), (tower_x + wave_r1, tower_y + wave_r1)], start=135, end=225, fill=flash_color, width=2)
        draw.arc([(tower_x - wave_r1, tower_y - wave_r1), (tower_x + wave_r1, tower_y + wave_r1)], start=315, end=45, fill=flash_color, width=2)

    # 6. Scanning Radar Sweep (frames 0-25)
    if i < 25:
        sweep_y = int((i / 25.0) * IMAGE_HEIGHT)
        draw.line([(0, sweep_y), (IMAGE_WIDTH, sweep_y)], fill='#16b8a6', width=2)
        
    # 7. Write Telemetry text overlay (using default drawing since system fonts differ)
    # Draw simple telemetry panel in top-right
    panel_left = 980
    panel_top = 50
    draw.rectangle([(panel_left, panel_top), (panel_left + 360, panel_top + 260)], fill='#0b263d', outline='#16b8a6', width=2)
    
    # Telemetry title
    draw.text((panel_left + 15, panel_top + 15), "BHOOMI RAKSHAK TELEMETRY", fill='#16b8a6')
    draw.text((panel_left + 15, panel_top + 45), f"STATE: ACTIVE", fill='#f5f7fa')
    
    # Dynamic telemetry values
    val_intensity = min(68.0, 12.0 + i * 0.6)
    val_moisture = min(85.0, 42.0 + i * 0.5)
    val_factor = max(0.88, 1.45 - i * 0.007)
    
    draw.text((panel_left + 15, panel_top + 85), f"Rain Intensity: {val_intensity:.1f} mm/h", fill='#9fb3c8')
    draw.text((panel_left + 15, panel_top + 115), f"Soil Moisture: {val_moisture:.1f}%", fill='#9fb3c8')
    draw.text((panel_left + 15, panel_top + 145), f"Safety Factor: {val_factor:.2f} Fs", fill='#9fb3c8')
    
    # State flags
    state_txt = "MONITORING"
    state_color = '#22c55e'
    if i >= 75:
        state_txt = "CRITICAL ALARM"
        state_color = '#ef4444'
    elif i >= 40:
        state_txt = "ELEVATED THREAT"
        state_color = '#ff9f43'
        
    draw.rectangle([(panel_left + 15, panel_top + 185), (panel_left + 345, panel_top + 235)], fill='#051321', outline=state_color, width=1)
    draw.text((panel_left + 30, panel_top + 200), f"STATUS: {state_txt}", fill=state_color)

    # Save frame
    frame_path = os.path.join(FRAMES_DIR, f"frame_{i+1:04d}.webp")
    img.save(frame_path, 'WEBP', quality=82)

# Write frames.json manifest
manifest = {
    "count": NUM_FRAMES,
    "pattern": "frames/frame_%04d.webp"
}
with open(os.path.join(FRAMES_DIR, "frames.json"), 'w') as f:
    json.dump(manifest, f)

print(f"Successfully generated {NUM_FRAMES} simulation frames in scroll-site/frames!")
