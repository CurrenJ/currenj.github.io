$(function() {
	console.log("Slideshow ready!");
	
	// Image collection - using a mix of artistic and personal images
	// Each entry now includes path, title, and subtitle for text overlays
	
	var images = [
		{
			path: 'slideshow/arid0.png',
			title: 'Desert Landscape',
			subtitle: 'Vast arid terrain awaits exploration'
		},
		{
			path: 'slideshow/arid1.png',
			title: 'Desert Outpost',
			subtitle: 'A solitary structure in the wasteland'
		},
		{
			path: 'slideshow/cave0.png',
			title: 'Underground Cavern',
			subtitle: 'Mysterious depths below the surface'
		},
		{
			path: 'slideshow/cave1.png',
			title: 'Crystal Cave',
			subtitle: 'Sparkling formations in the darkness'
		},
		{
			path: 'slideshow/cave2.png',
			title: 'Deep Tunnels',
			subtitle: 'Ancient passages carved by time'
		},
		{
			path: 'slideshow/cave3.png',
			title: 'Lava Chamber',
			subtitle: 'Molten rock illuminates the cavern'
		},
		{
			path: 'slideshow/cave4.png',
			title: 'Underground Lake',
			subtitle: 'Still waters in the subterranean world'
		},
		{
			path: 'slideshow/cave5.png',
			title: 'Stone Formations',
			subtitle: 'Natural architecture sculpted by nature'
		},
		{
			path: 'slideshow/cave6.png',
			title: 'Hidden Sanctuary',
			subtitle: 'A secret chamber deep underground'
		},
		{
			path: 'slideshow/tanks.png',
			title: 'Battle Tanks',
			subtitle: 'Armored vehicles ready for combat'
		}
	];
	
	var shuffledImages = [];
	var currentSlide = 0;
	var isPlaying = true;
	var slideInterval;
	var slideDuration = 5000; // 5 seconds per slide
	
	// Shuffle array function (Fisher-Yates shuffle)
	function shuffleArray(array) {
		var shuffled = array.slice(); // Create a copy
		for (var i = shuffled.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = shuffled[i];
			shuffled[i] = shuffled[j];
			shuffled[j] = temp;
		}
		return shuffled;
	}
	
	// Initialize slideshow
	function initSlideshow() {
		// Shuffle images on initialization
		shuffledImages = shuffleArray(images);
		
		var slideshow = $('#slideshow');
		
		// Create slide elements
		shuffledImages.forEach(function(imageData, index) {
			var slide = $('<div class="slide"></div>');
			var img = $('<img>').attr('src', imageData.path).attr('alt', 'Slide ' + (index + 1));
			
			// Handle image load errors gracefully
			img.on('error', function() {
				console.log('Failed to load image: ' + imageData.path);
				$(this).attr('src', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=');
			});
			
			// Create text overlay
			var textOverlay = $('<div class="slide-text-overlay"></div>');
			var title = $('<h1 class="slide-title"></h1>').text(imageData.title);
			var subtitle = $('<h2 class="slide-subtitle"></h2>').text(imageData.subtitle);
			
			textOverlay.append(title).append(subtitle);
			slide.append(img).append(textOverlay);
			slideshow.append(slide);
		});
		
		// Show first slide
		$('.slide').first().addClass('active');
		
		// Start automatic slideshow
		startSlideshow();
	}
	
	// Start automatic slideshow
	function startSlideshow() {
		if (slideInterval) clearInterval(slideInterval);
		
		slideInterval = setInterval(function() {
			if (isPlaying) {
				nextSlide();
			}
		}, slideDuration);

		// Ensure the first slide is active when starting
		if ($('.slide.active').length === 0) {
			$('.slide').removeClass('active');
			$('.slide').first().addClass('active');
			currentSlide = 0;
		}
	}
	
	// Go to next slide
	function nextSlide() {
		var slides = $('.slide');
		slides.eq(currentSlide).removeClass('active');
		
		currentSlide = (currentSlide + 1) % slides.length;
		
		// If we've reached the end, shuffle again for continuous random experience
		if (currentSlide === 0) {
			setTimeout(function() {
				reshuffleSlides();
			}, 1000); // Wait for transition to complete
		}
		
		slides.eq(currentSlide).addClass('active');
	}
	
	// Go to previous slide
	function prevSlide() {
		var slides = $('.slide');
		slides.eq(currentSlide).removeClass('active');
		
		currentSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
		slides.eq(currentSlide).addClass('active');
	}
	
	// Reshuffle slides for continuous randomness
	function reshuffleSlides() {
		shuffledImages = shuffleArray(images);
		var slides = $('.slide');
		
		// Update image sources and text with new shuffled order
		slides.each(function(index) {
			if (index < shuffledImages.length) {
				var imageData = shuffledImages[index];
				$(this).find('img').attr('src', imageData.path);
				$(this).find('.slide-title').text(imageData.title);
				$(this).find('.slide-subtitle').text(imageData.subtitle);
			}
		});
	}
	
	// Toggle play/pause
	function togglePlayPause() {
		isPlaying = !isPlaying;
		var button = $('#play-pause');
		
		if (isPlaying) {
			button.html('⏸️').attr('title', 'Pause');
			startSlideshow();
		} else {
			button.html('▶️').attr('title', 'Play');
			if (slideInterval) {
				clearInterval(slideInterval);
			}
		}
	}
	
	// Event handlers
	$('#play-pause').on('click', togglePlayPause);
	$('#next').on('click', nextSlide);
	$('#prev').on('click', prevSlide);
	
	// Keyboard controls
	$(document).on('keydown', function(e) {
		switch(e.key) {
			case 'ArrowLeft':
				prevSlide();
				break;
			case 'ArrowRight':
			case ' ':
				e.preventDefault(); // Prevent page scroll on spacebar
				nextSlide();
				break;
			case 'p':
			case 'P':
				togglePlayPause();
				break;
			case 'r':
			case 'R':
				// Manual reshuffle
				reshuffleSlides();
				break;
		}
	});
	
	// Initialize when document is ready
	initSlideshow();
});