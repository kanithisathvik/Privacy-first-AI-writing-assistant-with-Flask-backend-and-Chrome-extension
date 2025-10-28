# Icon Assets

This folder contains ContextGuard extension icons.

## Files
- `icon16.svg` - 16x16 icon (toolbar)
- `icon48.svg` - 48x48 icon (extension management)
- `icon128.svg` - 128x128 icon (Chrome Web Store)

## Converting SVG to PNG

To convert these SVG files to PNG format required by Chrome:

### Option 1: Using Online Tools
1. Visit https://cloudconvert.com/svg-to-png
2. Upload each SVG file
3. Download the PNG versions
4. Rename to `icon16.png`, `icon48.png`, `icon128.png`

### Option 2: Using Inkscape (Command Line)
```bash
inkscape icon16.svg --export-filename=icon16.png --export-width=16 --export-height=16
inkscape icon48.svg --export-filename=icon48.png --export-width=48 --export-height=48
inkscape icon128.svg --export-filename=icon128.png --export-width=128 --export-height=128
```

### Option 3: Using ImageMagick
```bash
convert -background none icon16.svg -resize 16x16 icon16.png
convert -background none icon48.svg -resize 48x48 icon48.png
convert -background none icon128.svg -resize 128x128 icon128.png
```

## Temporary Workaround

For development testing, Chrome will accept the SVG files temporarily. Update the manifest.json to use `.svg` extensions instead of `.png` if you haven't converted them yet.
