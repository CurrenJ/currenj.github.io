$(function() {
	console.log("Slideshow ready!");
	
	// Image collection - using a mix of artistic and personal images
	var images = [
		'css/1.jpg',
		'css/2.jpg', 
		'css/3.jpg',
		'css/4.jpg',
		'css/5.jpg',
		'css/6.jpg',
		'css/MilkboatFinal8.png',
		'css/album.jpg',
		'css/SquareWaterStyle.jpg',
		'css/MoonBad.jpg',
		'css/background2.jpg',
		'happybirthday/wedding.jpg',
		'happybirthday/canyoncliff.jpg',
		'happybirthday/newyears.jpg',
		'happybirthday/ascot.jpg',
		'happybirthday/friends2018.jpg',
		'happybirthday/rowing.jpg',
		'happybirthday/southbank.jpg',
		'happybirthday/uniformed.jpg',
		'happybirthday/pub.jpg'
	];
	
	var currentSlide = 0;
	var isPlaying = true;
	var slideInterval;
	var slideDuration = 4000; // 4 seconds per slide
	
	// Initialize slideshow
	function initSlideshow() {
		var slideshow = $('#slideshow');
		
		// Create slide elements
		images.forEach(function(imagePath, index) {
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
	}
	
	// Go to next slide
	function nextSlide() {
		var slides = $('.slide');
		slides.eq(currentSlide).removeClass('active');
		
		currentSlide = (currentSlide + 1) % slides.length;
		slides.eq(currentSlide).addClass('active');
	}
	
	// Go to previous slide
	function prevSlide() {
		var slides = $('.slide');
		slides.eq(currentSlide).removeClass('active');
		
		currentSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
		slides.eq(currentSlide).addClass('active');
	}
	
	// Toggle play/pause
	function togglePlayPause() {
		isPlaying = !isPlaying;
		var button = $('#play-pause');
		
		if (isPlaying) {
			button.text('⏸️ Pause');
			startSlideshow();
		} else {
			button.text('▶️ Play');
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
				nextSlide();
				break;
			case 'p':
			case 'P':
				togglePlayPause();
				break;
		}
	});
	
	// Pause on hover for better UX
	$('#slideshow').on('mouseenter', function() {
		if (slideInterval) {
			clearInterval(slideInterval);
		}
	}).on('mouseleave', function() {
		if (isPlaying) {
			startSlideshow();
		}
	});
	
	// Initialize when document is ready
	initSlideshow();
});