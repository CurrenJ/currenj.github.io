#!/usr/bin/env python3
"""
Album Cover Downloader Script

This script fetches album covers from the iTunes API and saves them locally.
Use this as a fallback if the web-based album cover fetching doesn't work.

Usage: python3 album_cover_downloader.py

You can modify the album_list below to include your desired albums.
Each entry should be a dictionary with 'artist' and 'album' keys.
"""

import requests
import json
import os
import time
from urllib.parse import quote
from urllib.request import urlretrieve

def create_safe_filename(artist, album):
    """Create a safe filename from artist and album names."""
    safe_name = f"{artist} - {album}"
    # Remove or replace unsafe characters
    safe_chars = []
    for char in safe_name:
        if char.isalnum() or char in [' ', '-', '_', '.']:
            safe_chars.append(char)
        else:
            safe_chars.append('_')
    return ''.join(safe_chars).strip()

def fetch_album_cover_url(artist, album):
    """Fetch album cover URL from iTunes API."""
    try:
        query = quote(f"{artist} {album}")
        url = f"https://itunes.apple.com/search?term={query}&media=music&entity=album&limit=1"
        
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        
        if data.get('results') and len(data['results']) > 0:
            result = data['results'][0]
            # Get the highest resolution available
            cover_url = result.get('artworkUrl100', '')
            if cover_url:
                # Replace with higher resolution
                cover_url = cover_url.replace('100x100', '600x600')
                return cover_url, result.get('collectionName', album)
        
        return None, None
        
    except Exception as e:
        print(f"Error fetching data for {artist} - {album}: {e}")
        return None, None

def download_album_cover(artist, album, output_dir='album_covers'):
    """Download album cover and save to file."""
    cover_url, actual_album_name = fetch_album_cover_url(artist, album)
    
    if not cover_url:
        print(f"❌ No cover found for: {artist} - {album}")
        return False
    
    try:
        # Create output directory if it doesn't exist
        os.makedirs(output_dir, exist_ok=True)
        
        # Create safe filename
        filename = create_safe_filename(artist, actual_album_name or album)
        filepath = os.path.join(output_dir, f"{filename}.jpg")
        
        # Download the image
        print(f"📥 Downloading: {artist} - {actual_album_name or album}")
        urlretrieve(cover_url, filepath)
        
        print(f"✅ Saved: {filepath}")
        return True
        
    except Exception as e:
        print(f"❌ Error downloading {artist} - {album}: {e}")
        return False

def main():
    """Main function to download album covers."""
    # Album list - modify this to include your desired albums
    album_list = [
        {"artist": "The Beatles", "album": "Abbey Road"},
        {"artist": "Pink Floyd", "album": "Dark Side of the Moon"},
        {"artist": "Led Zeppelin", "album": "IV"},
        {"artist": "Queen", "album": "Bohemian Rhapsody"},
        {"artist": "David Bowie", "album": "The Rise and Fall of Ziggy Stardust"},
        {"artist": "The Rolling Stones", "album": "Sticky Fingers"},
        {"artist": "Fleetwood Mac", "album": "Rumours"},
        {"artist": "AC/DC", "album": "Back in Black"},
        {"artist": "Nirvana", "album": "Nevermind"},
        {"artist": "Radiohead", "album": "OK Computer"},
        {"artist": "The Velvet Underground", "album": "The Velvet Underground & Nico"},
        {"artist": "Jimi Hendrix", "album": "Are You Experienced"},
        {"artist": "The Doors", "album": "The Doors"},
        {"artist": "Bob Dylan", "album": "Highway 61 Revisited"},
        {"artist": "The Clash", "album": "London Calling"},
        {"artist": "Joy Division", "album": "Unknown Pleasures"},
        {"artist": "The Smiths", "album": "The Queen Is Dead"},
        {"artist": "Talking Heads", "album": "Remain in Light"},
        {"artist": "Prince", "album": "Purple Rain"},
        {"artist": "Michael Jackson", "album": "Thriller"},
        {"artist": "Stevie Wonder", "album": "Songs in the Key of Life"},
        {"artist": "Marvin Gaye", "album": "What's Going On"},
        {"artist": "Miles Davis", "album": "Kind of Blue"},
        {"artist": "John Coltrane", "album": "A Love Supreme"},
        {"artist": "The Beach Boys", "album": "Pet Sounds"}
    ]
    
    print("🎵 Album Cover Downloader")
    print("=" * 40)
    print(f"Found {len(album_list)} albums to download")
    print()
    
    successful_downloads = 0
    failed_downloads = 0
    
    for i, album in enumerate(album_list, 1):
        print(f"[{i}/{len(album_list)}] Processing: {album['artist']} - {album['album']}")
        
        success = download_album_cover(album['artist'], album['album'])
        
        if success:
            successful_downloads += 1
        else:
            failed_downloads += 1
        
        # Add a small delay to be respectful to the API
        if i < len(album_list):
            time.sleep(0.5)
        
        print()
    
    print("=" * 40)
    print(f"✅ Successfully downloaded: {successful_downloads}")
    print(f"❌ Failed downloads: {failed_downloads}")
    print(f"📁 Albums saved in: album_covers/")
    
    if successful_downloads > 0:
        print("\n💡 You can now use these images in your album grid webpage!")

if __name__ == "__main__":
    main()