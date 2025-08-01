$(function() {
	console.log("Terminal Ready!");
	
	// Theme system
	var currentTheme = localStorage.getItem('terminal-theme') || 'orange';
	var body = $('body');
	
	// Apply saved theme
	function applyTheme(theme) {
		body.removeClass('theme-orange theme-green theme-lavender theme-blue theme-gold');
		body.addClass('theme-' + theme);
		$('.theme-btn').removeClass('active');
		$('.theme-btn[data-theme="' + theme + '"]').addClass('active');
		currentTheme = theme;
		localStorage.setItem('terminal-theme', theme);
	}
	
	// Initialize with saved theme
	applyTheme(currentTheme);
	
	// Theme button handlers
	$('.theme-btn').on('click', function() {
		var newTheme = $(this).data('theme');
		applyTheme(newTheme);
		
		// Add a brief screen flicker effect when changing themes
		$('#crt-screen').addClass('theme-change-effect');
		setTimeout(function() {
			$('#crt-screen').removeClass('theme-change-effect');
		}, 200);
	});
	
	// Interactive Terminal System
	var rText = $("#random-text");
	var terminalInput = $("#terminal-input");
	var currentLine = $("#current-line");
	var content = $("#content");
	
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
	
	var typewriterInterval;
	var currentCommand = "";
	var currentIndex = 0;
	var inactivityTimer;
	var isTypingFlavor = false;
	var userHasTyped = false;
	
	// Command system
	var commands = {
		'ls': function() {
			return "Available commands:\n" +
				   "  ls, dir     - List available commands\n" +
				   "  help        - Show this help message\n" +
				   "  whoami      - Display user information\n" +
				   "  matrix      - Enter the Matrix\n" +
				   "  clear       - Clear the terminal\n" +
				   "  party       - Start a celebration\n" +
				   "  hack        - Initiate hacking sequence\n" +
				   "  coffee      - Take a coffee break\n" +
				   "  cat joke.txt - Display a random joke\n" +
				   "  fortune     - Get your fortune\n" +
				   "  about       - About this terminal\n" +
				   "  projects    - List available projects";
		},
		'dir': function() {
			return commands.ls();
		},
		'help': function() {
			return commands.ls();
		},
		'whoami': function() {
			setTimeout(function() {
				addGlitchEffect();
			}, 500);
			return "User: Curren Jeandell\n" +
				   "Role: Developer, Creator, Dreamer\n" +
				   "Status: Always coding something awesome\n" +
				   "Location: Somewhere between reality and code";
		},
		'matrix': function() {
			createMatrixEffect();
			return "Welcome to the Matrix, Neo...";
		},
		'clear': function() {
			clearTerminal();
			return "";
		},
		'party': function() {
			createPartyEffect();
			return "🎉 PARTY TIME! 🎉\n" +
				   "Let's celebrate another day of awesome coding!";
		},
		'hack': function() {
			createHackingEffect();
			return "Initiating hacking sequence...\n" +
				   "Access granted. Welcome, hacker.";
		},
		'coffee': function() {
			createCoffeeEffect();
			return "☕ Taking a coffee break...\n" +
				   "Ah, the fuel of developers everywhere!\n" +
				   "Productivity levels: MAXIMUM";
		},
		'cat joke.txt': function() {
			var jokes = [
				"Why do programmers prefer dark mode?\nBecause light attracts bugs!",
				"How many programmers does it take to change a light bulb?\nNone. That's a hardware problem.",
				"Why don't programmers like nature?\nIt has too many bugs.",
				"What's a programmer's favorite hangout place?\nFoo Bar!",
				"Why did the programmer quit his job?\nBecause he didn't get arrays.",
				"What do you call a programmer from Finland?\nNemo!"
			];
			return jokes[Math.floor(Math.random() * jokes.length)];
		},
		'fortune': function() {
			var fortunes = [
				"Your code will compile on the first try today.",
				"A bug you've been hunting will reveal itself soon.",
				"Great things await in your next git commit.",
				"The coffee will be strong, and the code will be clean.",
				"Today is a good day to refactor something.",
				"Your next pull request will be approved without changes.",
				"Stack Overflow will have the exact answer you need."
			];
			return "🔮 " + fortunes[Math.floor(Math.random() * fortunes.length)];
		},
		'about': function() {
			return "CURREN JEANDELL TERMINAL v2.1.0\n" +
				   "==============================\n" +
				   "An interactive terminal experience showcasing\n" +
				   "projects, skills, and a bit of personality.\n" +
				   "\n" +
				   "Built with HTML, CSS, JavaScript, and ♥";
		},
		'projects': function() {
			return "Available projects (click links above):\n" +
				   "• PLAM - Project Management Tool\n" +
				   "• Psych_Proj - Psychology Project\n" +
				   "• Music - Music-related projects\n" +
				   "• Album_Tracker - Track your music collection\n" +
				   "• Choices_The_Game - Interactive choice game\n" +
				   "• TWBTS - The World Behind The Screen\n" +
				   "• Bernie - Political engagement platform\n" +
				   "• JJ - Happy Birthday project\n" +
				   "• Guitar2Piano - Musical instrument converter\n" +
				   "• Potions_Plus - Gaming enhancement tool";
		}
	};
	
	function startFlavorText() {
		if (userHasTyped) return;
		
		var randomCommand = commandList[Math.floor(Math.random() * commandList.length)];
		currentCommand = randomCommand;
		currentIndex = 0;
		isTypingFlavor = true;
		rText.empty();
		
		typewriterInterval = setInterval(function() {
			if (currentIndex < currentCommand.length && !userHasTyped) {
				rText.text(currentCommand.substring(0, currentIndex + 1));
				currentIndex++;
			} else {
				clearInterval(typewriterInterval);
				isTypingFlavor = false;
			}
		}, 50 + Math.random() * 50);
	}
	
	function stopFlavorText() {
		clearInterval(typewriterInterval);
		isTypingFlavor = false;
		rText.empty();
	}
	
	function startInactivityTimer() {
		clearTimeout(inactivityTimer);
		inactivityTimer = setTimeout(function() {
			if (terminalInput.val().trim() === "") {
				userHasTyped = false;
				startFlavorText();
			}
		}, 5000);
	}
	
	function addTerminalLine(command, output) {
		var newLine = $('<div class="terminal-line"><span class="prompt">$</span> <span class="command">' + 
			command + '</span></div>');
		
		if (output) {
			var outputDiv = $('<div class="command-output">' + output.replace(/\n/g, '<br>') + '</div>');
			newLine.append(outputDiv);
		}
		
		currentLine.before(newLine);
		
		// Scroll to bottom
		var terminal = $("#terminal");
		terminal.scrollTop(terminal[0].scrollHeight);
	}
	
	function executeCommand(cmd) {
		var command = cmd.toLowerCase().trim();
		var output = "";
		
		if (commands[command]) {
			output = commands[command]();
		} else if (command === "") {
			// Empty command, just add a prompt line
			return;
		} else {
			output = "Command not found: " + cmd + "\nType 'help' or 'ls' to see available commands.";
		}
		
		addTerminalLine(cmd, output);
	}
	
	function clearTerminal() {
		content.find('.terminal-line:not(#current-line)').remove();
		content.find('.command-output').remove();
	}
	
	// Special effects
	function addGlitchEffect() {
		$('#crt-screen').addClass('glitch-effect');
		setTimeout(function() {
			$('#crt-screen').removeClass('glitch-effect');
		}, 1000);
	}
	
	function createMatrixEffect() {
		var matrix = $('<div id="matrix-effect"></div>');
		$('body').append(matrix);
		
		// Create matrix rain
		for (var i = 0; i < 20; i++) {
			var column = $('<div class="matrix-column"></div>');
			column.css({
				left: Math.random() * 100 + '%',
				animationDelay: Math.random() * 2 + 's'
			});
			
			// Add random characters
			var chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
			for (var j = 0; j < 20; j++) {
				var char = $('<span>' + chars.charAt(Math.floor(Math.random() * chars.length)) + '</span>');
				char.css({
					animationDelay: (j * 0.1) + 's'
				});
				column.append(char);
			}
			
			matrix.append(column);
		}
		
		setTimeout(function() {
			matrix.remove();
		}, 3000);
	}
	
	function createPartyEffect() {
		// Create particle system container
		var party = $('<div id="party-effect"></div>');
		$('body').append(party);
		
		// Initialize particle system
		var particleSystem = new ParticleSystem(party[0]);
		particleSystem.createBurst();
		
		// Flash screen colors
		var colors = ['theme-green', 'theme-blue', 'theme-lavender', 'theme-gold'];
		var colorIndex = 0;
		var colorInterval = setInterval(function() {
			body.removeClass('theme-orange theme-green theme-lavender theme-blue theme-gold');
			body.addClass(colors[colorIndex % colors.length]);
			colorIndex++;
		}, 200);
		
		setTimeout(function() {
			clearInterval(colorInterval);
			applyTheme(currentTheme);
			particleSystem.destroy();
			party.remove();
		}, 4000);
	}
	
	function createHackingEffect() {
		var hack = $('<div id="hack-effect"><div class="hack-text">HACKING IN PROGRESS...</div></div>');
		$('body').append(hack);
		
		var hackTexts = [
			'Bypassing firewall...',
			'Cracking encryption...',
			'Accessing mainframe...',
			'Downloading files...',
			'Erasing traces...',
			'Access granted.'
		];
		
		var textIndex = 0;
		var hackInterval = setInterval(function() {
			if (textIndex < hackTexts.length) {
				hack.find('.hack-text').text(hackTexts[textIndex]);
				textIndex++;
			} else {
				clearInterval(hackInterval);
				setTimeout(function() {
					hack.remove();
				}, 1000);
			}
		}, 500);
	}
	
	function createCoffeeEffect() {
		var coffee = $('<div id="coffee-effect">☕</div>');
		$('body').append(coffee);
		
		setTimeout(function() {
			coffee.addClass('coffee-animate');
		}, 100);
		
		setTimeout(function() {
			coffee.remove();
		}, 2000);
	}
	
	// Input event handlers
	terminalInput.on('focus', function() {
		stopFlavorText();
		clearTimeout(inactivityTimer);
	});
	
	terminalInput.on('input', function() {
		var hasInput = $(this).val().length > 0;
		$(this).toggleClass('has-input', hasInput);
		
		if (!userHasTyped && hasInput) {
			userHasTyped = true;
			stopFlavorText();
		}
		
		clearTimeout(inactivityTimer);
		
		if (!hasInput) {
			startInactivityTimer();
		}
	});
	
	terminalInput.on('keypress', function(e) {
		if (e.which === 13) { // Enter key
			var command = $(this).val();
			executeCommand(command);
			$(this).val('').removeClass('has-input');
			userHasTyped = false;
			startInactivityTimer();
		}
	});
	
	terminalInput.on('blur', function() {
		if ($(this).val().trim() === '') {
			$(this).removeClass('has-input');
			startInactivityTimer();
		}
	});
	
	// Focus input when clicking anywhere on the terminal
	$('#terminal').on('click', function() {
		terminalInput.focus();
	});
	
	// Start initial flavor text
	setTimeout(function() {
		startFlavorText();
	}, 2000);
	
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

	// Particle System Class
	class ParticleSystem {
		constructor(container) {
			this.container = container;
			this.particles = [];
			this.animationId = null;
			this.centerX = window.innerWidth / 2;
			this.centerY = window.innerHeight / 2;
		}
		
		createBurst() {
			// Create burst of particles from center
			for (let i = 0; i < 160; i++) {
				this.createParticle();
			}
			this.animate();
		}
		
		createParticle() {
			// Random angle for burst direction (mainly upward)
			var angle = (Math.random() * Math.PI * 0.8) + (Math.PI * 0.1); // 0.1π to 0.9π (mostly upward)
			var speed = 200 + Math.random() * 300; // Initial speed
			
			// Get terminal screen size and position from document
			var crtContainer = document.getElementById('crt-container');
			var rect = crtContainer ? crtContainer.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight, left: 0, top: 0 };

			
 			var pX = rect.left + Math.random() * rect.width; // Random X within container
			var pY = rect.top;

			// Vary drag and gravity based on particle size (smaller = more drag, less gravity)
			var size = 4 + Math.random() * 6;
			var drag = 0.98 + (10 - size) * 0.002; // 0.98 to 0.96
			var gravity = 100 + (size - 4) * 30;   // 200 to ~380

			var particle = {
				element: document.createElement('div'),
				x:  pX,
				y:  pY,
				vx: Math.cos(angle) * speed,
				vy: -Math.sin(angle) * speed, // Negative for upward
				life: 4000, // 4 seconds
				maxLife: 4000,
				size: size,
				color: 'hsl(' + Math.random() * 360 + ', 100%, 70%)',
				gravity: gravity,
				drag: drag
			};
			
			// Style the particle element
			particle.element.className = 'particle';
			particle.element.style.position = 'absolute';
			particle.element.style.width = particle.size + 'px';
			particle.element.style.height = particle.size + 'px';
			particle.element.style.backgroundColor = particle.color;
			particle.element.style.borderRadius = '50%';
			particle.element.style.pointerEvents = 'none';
			particle.element.style.zIndex = '10000';
			particle.element.style.boxShadow = '0 0 6px ' + particle.color;
			
			this.container.appendChild(particle.element);
			this.particles.push(particle);
		}
		
		animate() {
			var self = this;
			var lastTime = performance.now();
			
			function update(currentTime) {
				var deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
				lastTime = currentTime;
				
				// Update particles
				for (let i = self.particles.length - 1; i >= 0; i--) {
					var particle = self.particles[i];
					
					// Apply physics
					particle.vy += particle.gravity * deltaTime; // Gravity
					particle.vx *= particle.drag; // Air resistance
					particle.vy *= particle.drag;
					
					// Update position
					particle.x += particle.vx * deltaTime;
					particle.y += particle.vy * deltaTime;
					
					// Update life
					particle.life -= deltaTime * 1000;
					
					// Calculate opacity based on life remaining
					var opacity = Math.max(0, particle.life / particle.maxLife);
					
					// Update element position and opacity
					particle.element.style.left = particle.x + 'px';
					particle.element.style.top = particle.y + 'px';
					particle.element.style.opacity = opacity;
					
					// Remove dead particles
					if (particle.life <= 0 || particle.y > window.innerHeight + 100) {
						particle.element.remove();
						self.particles.splice(i, 1);
					}
				}
				
				// Continue animation if particles exist
				if (self.particles.length > 0) {
					self.animationId = requestAnimationFrame(update);
				}
			}
			
			this.animationId = requestAnimationFrame(update);
		}
		
		destroy() {
			if (this.animationId) {
				cancelAnimationFrame(this.animationId);
			}
			
			// Remove all remaining particles
			this.particles.forEach(particle => {
				if (particle.element && particle.element.parentNode) {
					particle.element.remove();
				}
			});
			this.particles = [];
		}
	}
});

// Add CSS for effects
$('<style>').prop('type', 'text/css').html(`
	.command-output {
		margin: 4px 0 8px 20px;
		color: #aaa;
		white-space: pre-wrap;
	}
	
	.link-click-effect {
		animation: linkClick 0.1s ease-out !important;
	}
	
	.theme-change-effect {
		animation: themeChange 0.2s ease-out !important;
	}
	
	.glitch-effect {
		animation: glitch 1s ease-out !important;
	}
	
	#matrix-effect {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.8);
		z-index: 9999;
		pointer-events: none;
	}
	
	.matrix-column {
		position: absolute;
		top: -100%;
		width: 20px;
		height: 100%;
		color: #00ff00;
		font-family: 'JetBrains Mono', monospace;
		font-size: 14px;
		animation: matrixFall 3s linear infinite;
	}
	
	.matrix-column span {
		display: block;
		animation: matrixChar 0.1s linear infinite;
	}
	
	#party-effect {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 9999;
		pointer-events: none;
	}
	
	.particle {
		transition: opacity 0.1s ease-out;
	}
	
	#hack-effect {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: rgba(0, 0, 0, 0.9);
		color: #00ff00;
		padding: 40px;
		border: 2px solid #00ff00;
		font-family: 'JetBrains Mono', monospace;
		font-size: 18px;
		z-index: 9999;
		text-align: center;
		animation: hackPulse 0.5s ease-in-out infinite alternate;
	}
	
	#coffee-effect {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-size: 80px;
		z-index: 9999;
		pointer-events: none;
		opacity: 0;
		transition: all 2s ease;
	}
	
	#coffee-effect.coffee-animate {
		opacity: 1;
		transform: translate(-50%, -50%) scale(1.5) rotate(360deg);
	}
	
	@keyframes linkClick {
		0% { filter: brightness(1.2) contrast(1.3); }
		100% { filter: brightness(1) contrast(1.1); }
	}
	
	@keyframes themeChange {
		0% { filter: brightness(1.5) contrast(1.5) saturate(1.5); }
		50% { filter: brightness(0.8) contrast(0.8) saturate(0.5); }
		100% { filter: brightness(1) contrast(1.1) saturate(1); }
	}
	
	@keyframes glitch {
		0%, 100% { transform: translate(0); }
		10% { transform: translate(-2px, 2px); }
		20% { transform: translate(2px, -2px); }
		30% { transform: translate(-2px, -2px); }
		40% { transform: translate(2px, 2px); }
		50% { transform: translate(-2px, 2px); }
		60% { transform: translate(2px, -2px); }
		70% { transform: translate(-2px, -2px); }
		80% { transform: translate(2px, 2px); }
		90% { transform: translate(-2px, 2px); }
	}
	
	@keyframes matrixFall {
		0% { top: -100%; }
		100% { top: 100%; }
	}
	
	@keyframes matrixChar {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.5; }
	}
	
	@keyframes hackPulse {
		0% { box-shadow: 0 0 10px #00ff00; }
		100% { box-shadow: 0 0 20px #00ff00, 0 0 30px #00ff00; }
	}
`).appendTo('head');