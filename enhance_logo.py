from PIL import Image, ImageEnhance

# Open original image
img = Image.open(r'C:\Users\shaky\.gemini\antigravity-ide\brain\61c1ef9d-2176-4179-ad15-51e9347d5643\logo_minimalist_1784086981336.png').convert("RGBA")

# 1. Crop out the bottom text (text is usually in the bottom 20-30%)
width, height = img.size
img = img.crop((0, 0, width, int(height * 0.75)))

# 2. Make dark background transparent and boost yellow
datas = img.getdata()
new_data = []

# We want a "gada yellow" (bold/strong yellow). 
# We'll boost the R and G channels for non-dark pixels to make them more solid yellow.
for item in datas:
    if item[0] < 50 and item[1] < 50 and item[2] < 50:
        # Transparent background
        new_data.append((0, 0, 0, 0))
    else:
        # Boost color to bold yellow
        # The user wants "gada yellow". We can map the colors towards #FFB300 or just increase intensity
        r = min(255, int(item[0] * 1.3))
        g = min(255, int(item[1] * 1.3))
        b = int(item[2] * 0.7) # reduce blue to make it more yellow/gold
        new_data.append((r, g, b, item[3]))

img.putdata(new_data)

# 3. Find true bounding box of the M
bbox = img.getbbox()
if bbox:
    img = img.crop(bbox)
    
    # 4. Make it a perfect square with slight padding
    width, height = img.size
    size = max(width, height)
    padding = int(size * 0.05)
    final_size = size + padding * 2
    
    final_img = Image.new('RGBA', (final_size, final_size), (0, 0, 0, 0))
    offset_x = padding + (size - width) // 2
    offset_y = padding + (size - height) // 2
    final_img.paste(img, (offset_x, offset_y))
    
    # Resize for high quality favicon
    final_img = final_img.resize((512, 512), Image.Resampling.LANCZOS)
    
    # Enhance contrast and color saturation to make it really pop
    enhancer = ImageEnhance.Color(final_img)
    final_img = enhancer.enhance(1.5)
    
    final_img.save('public/logo.png')
    print("Logo enhanced, cropped, and saved!")
else:
    print("Failed to process bounding box")
