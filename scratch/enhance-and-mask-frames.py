import os
from PIL import Image, ImageEnhance, ImageDraw

# Configurations
FRAMES_DIR = 'scroll-site/frames'
BG_COLOR = (5, 19, 33) # #051321 in RGB
FADE_HEIGHT = 45 # Height of the bottom gradient mask in pixels

print("Starting cinematic enhancement and watermark masking...")

# Get list of frames
frames = sorted([f for f in os.listdir(FRAMES_DIR) if f.endswith('.webp') and f != 'frames.json'])
num_frames = len(frames)

if num_frames == 0:
    print("Error: No frames found in the frames directory.")
    exit(1)

for idx, f_name in enumerate(frames):
    f_path = os.path.join(FRAMES_DIR, f_name)
    img = Image.open(f_path).convert('RGBA')
    width, height = img.size
    
    # 1. Enhance Contrast
    contrast_enhancer = ImageEnhance.Contrast(img)
    img = contrast_enhancer.enhance(1.12)
    
    # 2. Enhance Sharpness
    sharpness_enhancer = ImageEnhance.Sharpness(img)
    img = sharpness_enhancer.enhance(1.25)
    
    # 3. Create a smooth gradient fade to cover the Google logo at the bottom
    # Create mask layer
    mask_layer = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(mask_layer)
    
    start_y = height - FADE_HEIGHT
    for y in range(FADE_HEIGHT):
        current_y = start_y + y
        # Calculate alpha ratio from 0.0 (transparent) to 1.0 (fully solid bg color)
        alpha = int((y / float(FADE_HEIGHT)) * 255)
        # Draw horizontal line with increasing opacity of the background color
        draw.line([(0, current_y), (width, current_y)], fill=(BG_COLOR[0], BG_COLOR[1], BG_COLOR[2], alpha))
        
    # Composite the gradient mask over the enhanced image
    img_final = Image.alpha_composite(img, mask_layer).convert('RGB')
    
    # Save back as WebP
    img_final.save(f_path, 'WEBP', quality=85)
    
    if (idx + 1) % 40 == 0 or (idx + 1) == num_frames:
        print(f"  Processed {idx + 1}/{num_frames} frames...")

print("All 384 frames have been successfully enhanced and masked!")
