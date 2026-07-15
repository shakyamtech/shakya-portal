from PIL import Image

# Open the image
img = Image.open('public/logo.png').convert("RGBA")
datas = img.getdata()

new_data = []
# Threshold for dark background to make transparent
for item in datas:
    # item is (R, G, B, A)
    # If the pixel is very dark (close to black), make it transparent
    if item[0] < 40 and item[1] < 40 and item[2] < 40:
        new_data.append((255, 255, 255, 0))
    else:
        new_data.append(item)

img.putdata(new_data)

# Find bounding box of non-transparent pixels
bbox = img.getbbox()
if bbox:
    # Crop the image to the bounding box
    img = img.crop(bbox)
    
    # Let's crop it to be a perfect square if possible, or just leave it tight
    width, height = img.size
    size = max(width, height)
    
    # Create a square transparent image
    square_img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    # Paste the cropped image in the center
    offset = ((size - width) // 2, (size - height) // 2)
    square_img.paste(img, offset)
    
    # Add a little padding so it doesn't touch the very edges of the favicon
    padding = int(size * 0.1)
    final_size = size + padding * 2
    final_img = Image.new('RGBA', (final_size, final_size), (0, 0, 0, 0))
    final_img.paste(square_img, (padding, padding))
    
    # Resize to standard large favicon size
    final_img = final_img.resize((512, 512), Image.Resampling.LANCZOS)
    
    # Save it back
    final_img.save('public/logo.png')
    print("Logo processed successfully!")
else:
    print("Could not find bounding box.")
