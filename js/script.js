$(function() {
	console.log("Terminal Ready!");
	
	var rText = $("#random-text");
	var commandList = [
		"echo \"demonstrates his value.\"",
		"cat /beliefs/froggyland.txt",
		"whoami # won't let you down",
		"fortune # believes in you!",
		"echo \"Milkboat detected\"",
		"ps aux | grep professional",
		"while true; do code; done",
		"date +%Y # 2024",
		"grep -r \"the end\" /universe",
		"echo \"We can do much more together.\"",
		"party --mode=life",
		"make games",
		"legend --man --myth",
		"echo \":)\"",
		"echo \":D\"",
		"cat /dev/flavour_text",
		"bug_count --known=1",
		"typo --object-oriented",
		"play illinoise.mp3",
		"dive --depth=too_deep --target=coins",
		"escape --from=\"cynics\" --destination=\"far\"",
		"echo \"so American\"",
		"cat big_plans.txt",
		"construct --type=beautiful",
		"philosophy --existence=strange"
	];
	
	// Type out random command with typewriter effect
	var randomCommand = commandList[Math.floor(Math.random() * commandList.length)];
	var currentIndex = 0;
	
	function typeWriter() {
		if (currentIndex < randomCommand.length) {
			rText.html(randomCommand.substring(0, currentIndex + 1));
			currentIndex++;
			setTimeout(typeWriter, 50 + Math.random() * 50);
		}
	}
	
	// Start typing after a short delay
	setTimeout(typeWriter, 2000);
	
	// Add some interactive terminal effects
	$(document).on('click', '.project-link', function(e) {
		// Brief screen flicker effect on link click
		$('#crt-screen').addClass('link-click-effect');
		setTimeout(function() {
			$('#crt-screen').removeClass('link-click-effect');
		}, 100);
	});
	
	// Periodically add some screen interference
	setInterval(function() {
		if (Math.random() < 0.1) { // 10% chance every interval
			$('#static-noise').css('opacity', 0.6);
			setTimeout(function() {
				$('#static-noise').css('opacity', 0.4);
			}, 100);
		}
	}, 3000);
});

// Add CSS for link click effect
$('<style>').prop('type', 'text/css').html(`
	.link-click-effect {
		animation: linkClick 0.1s ease-out !important;
	}
	
	@keyframes linkClick {
		0% { filter: brightness(1.2) contrast(1.3); }
		100% { filter: brightness(1) contrast(1.1); }
	}
`).appendTo('head');