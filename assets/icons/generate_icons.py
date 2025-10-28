"""
Quick icon generator for ContextGuard
Creates simple PNG icons using PIL
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, filename):
    """Create a simple gradient icon with lightning bolt"""
    # Create image with transparency
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Draw gradient circle (simplified - solid color)
    color = (102, 126, 234, 255)  # #667eea
    draw.ellipse([2, 2, size-2, size-2], fill=color)
    
    # Draw lightning bolt (simplified)
    if size >= 32:
        # Larger icons get a detailed bolt
        bolt = [
            (size*0.58, size*0.25),
            (size*0.42, size*0.50),
            (size*0.48, size*0.50),
            (size*0.42, size*0.75),
            (size*0.58, size*0.50),
            (size*0.52, size*0.50),
        ]
        draw.polygon(bolt, fill=(255, 255, 255, 255))
    else:
        # Smaller icon gets simpler bolt
        bolt = [
            (size*0.6, size*0.3),
            (size*0.45, size*0.5),
            (size*0.5, size*0.5),
            (size*0.4, size*0.7),
            (size*0.55, size*0.5),
            (size*0.5, size*0.5),
        ]
        draw.polygon(bolt, fill=(255, 255, 255, 255))
    
    # Save
    img.save(filename, 'PNG')
    print(f"Created {filename}")

# Create icons
script_dir = os.path.dirname(os.path.abspath(__file__))

create_icon(16, os.path.join(script_dir, 'icon16.png'))
create_icon(48, os.path.join(script_dir, 'icon48.png'))
create_icon(128, os.path.join(script_dir, 'icon128.png'))

print("\nAll icons created successfully!")
print("You can replace these with higher quality versions later.")
