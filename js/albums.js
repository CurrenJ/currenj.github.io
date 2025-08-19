$(document).ready(function() {
    // Sample album data - artist and album title pairs
    const albumData = [
        { artist: "The Beatles", album: "Abbey Road" },
        { artist: "Pink Floyd", album: "Dark Side of the Moon" },
        { artist: "Led Zeppelin", album: "IV" },
        { artist: "Queen", album: "Bohemian Rhapsody" },
        { artist: "David Bowie", album: "The Rise and Fall of Ziggy Stardust" },
        { artist: "The Rolling Stones", album: "Sticky Fingers" },
        { artist: "Fleetwood Mac", album: "Rumours" },
        { artist: "AC/DC", album: "Back in Black" },
        { artist: "Nirvana", album: "Nevermind" },
        { artist: "Radiohead", album: "OK Computer" },
        { artist: "The Velvet Underground", album: "The Velvet Underground & Nico" },
        { artist: "Jimi Hendrix", album: "Are You Experienced" },
        { artist: "The Doors", album: "The Doors" },
        { artist: "Bob Dylan", album: "Highway 61 Revisited" },
        { artist: "The Clash", album: "London Calling" },
        { artist: "Joy Division", album: "Unknown Pleasures" },
        { artist: "The Smiths", album: "The Queen Is Dead" },
        { artist: "Talking Heads", album: "Remain in Light" },
        { artist: "Prince", album: "Purple Rain" },
        { artist: "Michael Jackson", album: "Thriller" },
        { artist: "Stevie Wonder", album: "Songs in the Key of Life" },
        { artist: "Marvin Gaye", album: "What's Going On" },
        { artist: "Miles Davis", album: "Kind of Blue" },
        { artist: "John Coltrane", album: "A Love Supreme" },
        { artist: "The Beach Boys", album: "Pet Sounds" },
        { artist: "Joni Mitchell", album: "Blue" },
        { artist: "Neil Young", album: "Harvest" },
        { artist: "Carole King", album: "Tapestry" },
        { artist: "The Who", album: "Who's Next" },
        { artist: "Black Sabbath", album: "Paranoid" },
        { artist: "Deep Purple", album: "Machine Head" },
        { artist: "Cream", album: "Disraeli Gears" },
        { artist: "The Kinks", album: "The Kinks Are the Village Green Preservation Society" },
        { artist: "Elvis Presley", album: "Elvis Presley" },
        { artist: "Chuck Berry", album: "Chuck Berry Is on Top" },
        { artist: "Aretha Franklin", album: "I Never Loved a Man the Way I Love You" },
        { artist: "Otis Redding", album: "Otis Blue" },
        { artist: "James Brown", album: "Live at the Apollo" },
        { artist: "Sly & The Family Stone", album: "There's a Riot Goin' On" },
        { artist: "Parliament-Funkadelic", album: "Mothership Connection" },
        { artist: "Kraftwerk", album: "Trans-Europe Express" },
        { artist: "Brian Eno", album: "Another Green World" },
        { artist: "Roxy Music", album: "For Your Pleasure" },
        { artist: "T. Rex", album: "Electric Warrior" },
        { artist: "The Stooges", album: "Fun House" },
        { artist: "MC5", album: "Kick Out the Jams" },
        { artist: "Television", album: "Marquee Moon" },
        { artist: "Patti Smith", album: "Horses" },
        { artist: "Blondie", album: "Parallel Lines" },
        { artist: "The Ramones", album: "Ramones" }
    ];

    let loadedAlbums = [];
    const ALBUMS_PER_ROW = 8; // Number of albums to show per row
    const TOTAL_ROWS = 5;

    // Initialize the album grid
    function initializeAlbumGrid() {
        $('#loading-indicator').addClass('show');
        loadAlbumCovers(albumData).then(() => {
            generateAlbumGrid();
            $('#loading-indicator').removeClass('show');
        });
    }

    // Fetch album cover from iTunes API
    async function fetchAlbumCover(artist, album) {
        try {
            const query = encodeURIComponent(`${artist} ${album}`);
            const response = await fetch(`https://itunes.apple.com/search?term=${query}&media=music&entity=album&limit=1`);
            
            // Check if response is ok
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                const result = data.results[0];
                return {
                    artist: artist,
                    album: album,
                    coverUrl: result.artworkUrl100.replace('100x100', '600x600'), // Get higher resolution
                    success: true
                };
            } else {
                return {
                    artist: artist,
                    album: album,
                    coverUrl: null,
                    success: false
                };
            }
        } catch (error) {
            console.warn(`API unavailable for ${artist} - ${album}, using placeholder`);
            return {
                artist: artist,
                album: album,
                coverUrl: null,
                success: false
            };
        }
    }

    // Load album covers with delay to avoid rate limiting
    async function loadAlbumCovers(albums) {
        loadedAlbums = [];
        
        for (let i = 0; i < albums.length; i++) {
            const album = albums[i];
            const result = await fetchAlbumCover(album.artist, album.album);
            loadedAlbums.push(result);
            
            // Small delay to avoid overwhelming the API
            if (i < albums.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
    }

    // Generate the album grid with infinite scroll effect
    function generateAlbumGrid() {
        const grid = $('#album-grid');
        grid.empty();

        // Create enough albums to fill the grid and provide seamless looping
        const totalAlbumsNeeded = TOTAL_ROWS * ALBUMS_PER_ROW * 3; // Triple for seamless loop
        const repeatedAlbums = [];
        
        // Repeat the album list to get enough albums
        for (let i = 0; i < totalAlbumsNeeded; i++) {
            repeatedAlbums.push(loadedAlbums[i % loadedAlbums.length]);
        }

        // Create rows
        for (let row = 0; row < TOTAL_ROWS; row++) {
            const rowDiv = $('<div class="album-row"></div>');
            
            // Add albums to this row
            for (let col = 0; col < ALBUMS_PER_ROW * 3; col++) { // Triple width for looping
                const albumIndex = (row * ALBUMS_PER_ROW * 3) + col;
                const album = repeatedAlbums[albumIndex];
                
                const albumItem = createAlbumItem(album);
                rowDiv.append(albumItem);
            }
            
            grid.append(rowDiv);
        }
    }

    // Create individual album item
    function createAlbumItem(album) {
        const albumDiv = $('<div class="album-item"></div>');
        
        if (album.success && album.coverUrl) {
            const img = $('<img class="album-cover" alt="Album Cover">');
            img.attr('src', album.coverUrl);
            albumDiv.append(img);
            
            // Add error handling for images that fail to load
            img.on('error', function() {
                $(this).replaceWith(createPlaceholder(album));
            });
        } else {
            albumDiv.append(createPlaceholder(album));
        }

        // Add album info overlay
        const infoDiv = $('<div class="album-info"></div>');
        infoDiv.append(`<div class="album-title">${album.album}</div>`);
        infoDiv.append(`<div class="album-artist">${album.artist}</div>`);
        albumDiv.append(infoDiv);

        return albumDiv;
    }

    // Create placeholder for albums without covers
    function createPlaceholder(album) {
        return $(`<div class="album-placeholder">
            <div class="album-text">
                <div style="font-weight: 500; font-size: 0.85rem;">${album.album}</div>
                <div style="font-size: 0.75rem; margin-top: 5px; opacity: 0.8;">${album.artist}</div>
            </div>
        </div>`);
    }

    // Adjust animation speed based on content width
    function adjustAnimationSpeed() {
        const gridWidth = $('#album-grid').width();
        const containerWidth = $('#album-grid-container').width();
        
        if (gridWidth > containerWidth) {
            const duration = Math.max(60, gridWidth / 8); // Minimum 60s, scale with content
            $('#album-grid').css('animation-duration', duration + 's');
        }
    }

    // Handle window resize
    $(window).on('resize', function() {
        setTimeout(adjustAnimationSpeed, 100);
    });

    // Initialize everything when document is ready
    initializeAlbumGrid();
});