$(function() {
	console.log("Slideshow ready!");
	
	// Image collection - using a mix of artistic and personal images
	
	var images = [
		'slideshow/arid0.png',
		'slideshow/arid1.png',
		'slideshow/cave0.png',
		'slideshow/cave1.png',
		'slideshow/cave2.png',
		'slideshow/cave3.png',
		'slideshow/cave4.png',
		'slideshow/cave5.png',
		'slideshow/cave6.png',
		'slideshow/tanks.png',
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
		shuffledImages.forEach(function(imagePath, index) {
			var slide = $('<div class="slide"></div>');
			var img = $('<img>').attr('src', imagePath).attr('alt', 'Slide ' + (index + 1));
			
			// Handle image load errors gracefully
			img.on('error', function() {
				console.log('Failed to load image: ' + imagePath);
				$(this).attr('src', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=');
			});
			
			slide.append(img);
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
		
		// Update image sources with new shuffled order
		slides.each(function(index) {
			if (index < shuffledImages.length) {
				$(this).find('img').attr('src', shuffledImages[index]);
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