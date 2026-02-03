# Until I See You - Countdown Website

An elegant, romantic countdown website built for GitHub Pages.

## Features

- **Precise Countdown**: Displays days, hours, minutes, and seconds until the target date/time
- **Daily Background Images**: Background changes automatically at midnight (local time)
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile
- **Smooth Animations**: Subtle breathing effect, fade transitions, and pulse animations
- **Glassmorphism UI**: Modern frosted glass aesthetic with elegant typography

## Configuration

### Setting the Target Date

Edit `script.js` and modify these constants at the top of the file:

```javascript
const TARGET_YEAR = 2026;
const TARGET_MONTH = 2;  // February (1-12)
const TARGET_DAY = 24;
const TARGET_HOUR = 20;  // 8 PM (20:00 in 24-hour format)
const TARGET_MINUTE = 45;
```

### Background Images

The website expects images in the `/images/` folder with the following naming convention:

```
images/
  ├── day-0.jpg
  ├── day-1.jpg
  ├── day-2.jpg
  ├── day-3.jpg
  ├── ...
  └── fallback.jpg (required)
```

**How it works:**
- Images are selected deterministically based on the number of days since February 3, 2026
- The same image will appear on the same day
- On February 3, 2026, it shows `day-0.jpg`
- On February 4, 2026, it shows `day-1.jpg`
- On February 5, 2026, it shows `day-2.jpg`
- And so on...

**Fallback Image:**
- If a day's specific image doesn't exist, `fallback.jpg` is used
- Make sure to include this file as a safety net

**Image Requirements:**
- Format: JPG recommended (but PNG, WebP also work)
- Recommended resolution: 1920x1080 or higher
- Optimize images for web to keep page load fast

### Changing the Reference Date

If you want to change when the image cycle starts, modify this line in `script.js`:

```javascript
const REFERENCE_DATE = new Date('2026-02-03');
```

## File Structure

```
.
├── index.html          # Main HTML structure
├── style.css           # All styling and animations
├── script.js           # Countdown logic and background system
└── images/             # Background images folder
    ├── day-0.jpg
    ├── day-1.jpg
    └── fallback.jpg    # Required fallback image
```

## Design Details

### Typography
- **Numbers**: Cormorant Garamond (elegant serif)
- **Labels & Message**: Inter (clean sans-serif)

### Color Scheme
- Semi-transparent glass container with backdrop blur
- White text with subtle transparency
- Dark gradient overlay on background images

### Animations
- **Page Load**: 1.5s fade-in
- **Breathing Effect**: Subtle 6s scale animation on the container
- **Second Updates**: Quick pulse animation
- **Background Transitions**: 2s cross-fade at midnight

## Technical Notes

### Assumptions Made

1. **Image Format**: Assumes JPG images, but code will work with any web-compatible format
2. **Time Zone**: All times are calculated in the user's local timezone
3. **Browser Support**: Modern browsers with CSS backdrop-filter support
4. **No Backend**: Completely static - no server-side code required

### Browser Compatibility

- **Recommended**: Chrome, Firefox, Safari, Edge (modern versions)
- **Backdrop Filter**: May have reduced visual effect in older browsers
- **Fallback**: Page remains functional without advanced CSS effects

### Performance Considerations

- Images are lazy-loaded only when needed
- Background transitions use CSS for GPU acceleration
- Countdown updates precisely every second without blocking UI

## Customization Tips

### Changing the Message

In `index.html`, find:
```html
<div class="message" id="message">until I see you</div>
```

And in `script.js`, find:
```javascript
messageEl.textContent = "I'm here.";
```

### Adjusting Colors

Modify CSS variables in `style.css`:
```css
:root {
    --overlay-dark: rgba(0, 0, 0, 0.4);
    --glass-bg: rgba(255, 255, 255, 0.08);
    --glass-border: rgba(255, 255, 255, 0.18);
    --text-primary: #ffffff;
    --text-secondary: rgba(255, 255, 255, 0.85);
}
```

### Using Different Fonts

Replace the Google Fonts import in `index.html` and update CSS variables in `style.css`.

## License

This is a personal project - use it however you'd like! ❤️
