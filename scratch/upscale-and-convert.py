import os
from PIL import Image, ImageEnhance

folder = 'scroll-site/website-images'
mapping = {
    "origin-mountains(1).jpg": "origin-mountains.webp",
    "sensor-node-telemetry(1).jpg": "sensor-node-telemetry.webp",
    "ml-risk-analysis(1).jpg": "ml-risk-analysis.webp",
    "gallery-misty-peaks(1).jpg": "gallery-misty-peaks.webp",
    "gallery-sensor-probe(1).jpg": "gallery-sensor-probe.webp",
    "gallery-displacement-collapse(1).jpg": "gallery-displacement-collapse.webp",
    "gallery-warning-tower(1).jpg": "gallery-warning-tower.webp"
}

print("Running image upscale, detail enhancement, and WebP compile...")

for src_name, dest_name in mapping.items():
    src_path = os.path.join(folder, src_name)
    dest_path = os.path.join(folder, dest_name)
    
    if os.path.exists(src_path):
        img = Image.open(src_path).convert('RGB')
        w, h = img.size
        
        # Upscale to 1920px width if it is smaller
        if w < 1920:
            scale = 1920.0 / w
            new_w = 1920
            new_h = int(h * scale)
            img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
            print(f"  Upscaling {src_name}: {w}x{h} → {new_w}x{new_h}")
        else:
            print(f"  Keeping native resolution for {src_name}: {w}x{h}")
            
        # Apply detail enhancements
        img = ImageEnhance.Contrast(img).enhance(1.10)
        img = ImageEnhance.Sharpness(img).enhance(1.30)
        
        # Save as WebP with high preservation quality
        img.save(dest_path, "WEBP", quality=90)
        print(f"  Saved: website-images/{dest_name}")
        
        # Remove temporary source JPG
        os.remove(src_path)
        print(f"  Cleaned: deleted {src_name}")
    else:
        print(f"  Warning: Expected image {src_name} not found in website-images/.")

print("All custom images processed successfully!")
