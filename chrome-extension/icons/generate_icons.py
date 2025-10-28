from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, filename):
    # Create image with gradient background
    img = Image.new('RGB', (size, size), color='white')
    draw = ImageDraw.Draw(img)
    
    # Draw gradient-like background
    for i in range(size):
        color_val = int(102 + (118 - 102) * (i / size))
        draw.rectangle([(0, i), (size, i+1)], fill=(color_val, 126, 234))
    
    # Draw lock icon (simplified)
    lock_size = size // 2
    lock_x = size // 4
    lock_y = size // 4
    
    # Lock body
    draw.rounded_rectangle(
        [(lock_x, lock_y + lock_size//3), (lock_x + lock_size, lock_y + lock_size)],
        radius=size//20,
        fill='white'
    )
    
    # Lock shackle
    draw.arc(
        [(lock_x + lock_size//6, lock_y), (lock_x + lock_size*5//6, lock_y + lock_size//2)],
        start=180, end=0, fill='white', width=size//15
    )
    
    # Keyhole
    keyhole_radius = size // 25
    keyhole_x = lock_x + lock_size // 2
    keyhole_y = lock_y + lock_size * 2 // 3
    draw.ellipse(
        [(keyhole_x - keyhole_radius, keyhole_y - keyhole_radius),
         (keyhole_x + keyhole_radius, keyhole_y + keyhole_radius)],
        fill=(102, 126, 234)
    )
    
    img.save(filename)
    print(f"Created {filename}")

# Create icons in different sizes
create_icon(16, 'icon16.png')
create_icon(48, 'icon48.png')
create_icon(128, 'icon128.png')
