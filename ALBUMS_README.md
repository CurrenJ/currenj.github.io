# Album Cover Grid Page

This directory contains a new album cover grid page feature that displays a horizontally scrolling grid of album covers.

## Features

- **5-row grid layout** with infinite horizontal scrolling
- **Responsive design** that works on desktop and mobile devices
- **iTunes API integration** for fetching album cover artwork
- **Graceful fallback** to styled placeholders when API is unavailable
- **Hover effects** and smooth animations
- **Clean navigation** integration with the main site

## Files

### Main Implementation
- `albums.html` - The main album grid page
- `css/albums.css` - Styling for the grid layout and animations
- `js/albums.js` - JavaScript functionality for API calls and grid generation

### Fallback Tool
- `album_cover_downloader.py` - Python script for downloading album covers locally

## Usage

### Viewing the Album Grid
1. Navigate to the main site
2. Click on the "Albums" link in the project list
3. View the horizontally scrolling grid of album covers

### Adding New Albums
To add new albums to the grid, edit the `albumData` array in `js/albums.js`:

```javascript
const albumData = [
    { artist: "Artist Name", album: "Album Title" },
    // Add more entries here...
];
```

### Using the Python Fallback Script
If the iTunes API is unavailable or you prefer local images:

```bash
python3 album_cover_downloader.py
```

This will:
- Fetch album covers from the iTunes API
- Save them as high-resolution JPEG files
- Create safe filenames from artist and album names
- Save all images to an `album_covers/` directory

## Technical Details

### API Integration
The page uses the iTunes Search API to fetch album artwork:
- **Endpoint**: `https://itunes.apple.com/search`
- **Parameters**: `term={artist} {album}&media=music&entity=album&limit=1`
- **Image Resolution**: Automatically upgraded to 600x600 from default 100x100

### Animation
- **CSS Keyframes**: Infinite horizontal scrolling using `transform: translateX()`
- **Duration**: 120 seconds for smooth, slow movement
- **Seamless Loop**: Content is triplicated to create infinite scroll effect

### Responsive Breakpoints
- **Desktop (>1200px)**: 200x200px album covers
- **Tablet (768px-1200px)**: 180x180px album covers  
- **Mobile (<768px)**: 150x150px album covers
- **Small Mobile (<480px)**: 120x120px album covers

### Browser Compatibility
- **Modern browsers**: Full functionality with API integration
- **Older browsers**: Graceful degradation to static placeholders
- **No JavaScript**: Basic styling still applies

## Dependencies

### Frontend
- jQuery 3.4.1 (already included in the site)
- Modern browser with CSS3 animation support
- Internet connection for iTunes API (optional)

### Python Script
- Python 3.6+
- `requests` library for HTTP calls
- `urllib` for file downloads (standard library)

## Styling

The page uses a dark gradient background with:
- **Colors**: Dark grays with subtle gradients
- **Typography**: Raleway font family (consistent with site)
- **Animations**: Smooth hover effects and transitions
- **Layout**: Flexbox for responsive grid arrangement

## Notes

- Album covers are fetched asynchronously to avoid blocking the UI
- Placeholder images maintain the same aspect ratio as real covers
- The grid automatically adjusts to different screen sizes
- All external API calls include proper error handling