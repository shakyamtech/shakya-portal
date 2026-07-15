from PIL import Image, ImageEnhance

img = Image.open(r'C:\Users\shaky\.gemini\antigravity-ide\brain\61c1ef9d-2176-4179-ad15-51e9347d5643\logo_minimalist_1784086981336.png').convert("RGBA")

# The image is 1024x1024. The M is in the center. The text is below it.
# We will explicitly crop out the center area where ONLY the M lives, ignoring the bottom completely.
width, height = img.size
# Let's crop from Y=10% to Y=70%, which is well above the text.
crop_box = (0, int(height * 0.1), width, int(height * 0.65))
img = img.crop(crop_box)

datas = img.getdata()
new_data = []

for item in datas:
    # Remove dark background
    if item[0] < 50 and item[1] < 50 and item[2] < 50:
        new_data.append((0, 0, 0, 0))
    else:
        # Boost color
        r = min(255, int(item[0] * 1.5))
        g = min(255, int(item[1] * 1.5))
        b = int(item[2] * 0.5)
        new_data.append((r, g, b, item[3]))

img.putdata(new_data)

bbox = img.getbbox()
if bbox:
    img = img.crop(bbox)
    
    # Make square
    w, h = img.size
    size = max(w, h)
    padding = int(size * 0.1)
    final_size = size + padding * 2
    
    final = Image.new('RGBA', (final_size, final_size), (0, 0, 0, 0))
    offset_x = padding + (size - w) // 2
    offset_y = padding + (size - h) // 2
    final.paste(img, (offset_x, offset_y))
    
    final = final.resize((512, 512), Image.Resampling.LANCZOS)
    
    # Save as v2 to break browser cache
    final.save('public/logo_v2.png')
    print("Saved logo_v2.png")
else:
    print("Bounding box failed")
