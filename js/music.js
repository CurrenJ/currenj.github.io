$( function() {
	drawWave($('#sin1').children("svg")[0], 10);
	drawWave($('#sin2').children("svg")[0], 15);
	drawWave($('#sin3').children("svg")[0], 25);
});

function drawWave(svg, amplitude) {
	var contHeight = $(svg).css("height");
	var c2 = contHeight / 2;
	var origin = { //origin of axes
		x: 0,
		y: 75
	};
	//var amplitude = 10; // wave amplitude
	var rarity = 1; // point spacing
	var freq = Math.PI * 2 / parseInt($("body").css("width")) * rarity; // angular frequency
	console.log($("body").css("width"));
	var phase = 0; // phase angle
	console.log($("body").css("width"));
	console.log(contHeight);

	for (var i = 0; i < parseInt($("body").css("width")) * 2; i++) {
		var line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");

		line1.setAttribute('x1', (i - 1) * rarity + origin.x);
		line1.setAttribute('y1', Math.sin(freq*(i - 1 + phase)) * amplitude + origin.y);

		line1.setAttribute('x2', (i - 1) * rarity + origin.x);
		line1.setAttribute('y2', contHeight);

		line1.setAttribute('style', "stroke:white;stroke-width:1;fill:white;fill-rule=\"nonzero\"");

		svg.appendChild(line1);
		
		var line2 = document.createElementNS("http://www.w3.org/2000/svg", "line");

		line2.setAttribute('x1', (i - 1) * rarity + origin.x);
		line2.setAttribute('y1', contHeight);

		line2.setAttribute('x2', i * rarity + origin.x);
		line2.setAttribute('y2', contHeight);

		line2.setAttribute('style', "stroke:white;stroke-width:1;fill:white;fill-rule=\"nonzero\"");

		svg.appendChild(line2);
		
		var line3 = document.createElementNS("http://www.w3.org/2000/svg", "line");

		line3.setAttribute('x1', i * rarity + origin.x);
		line3.setAttribute('y1', contHeight);

		line3.setAttribute('x2', i * rarity + origin.x);
		line3.setAttribute('y2', Math.sin(freq*(i + phase)) * amplitude + origin.y);

		line3.setAttribute('style', "stroke:white;stroke-width:1;fill:white;fill-rule=\"nonzero\"");

		svg.appendChild(line3);
		
		var line4 = document.createElementNS("http://www.w3.org/2000/svg", "line");

		line4.setAttribute('x2', (i - 1) * rarity + origin.x);
		line4.setAttribute('y2', Math.sin(freq*(i - 1 + phase)) * amplitude + origin.y);

		line4.setAttribute('x1', i * rarity + origin.x);
		line4.setAttribute('y1', Math.sin(freq*(i + phase)) * amplitude + origin.y);

		line4.setAttribute('style', "stroke:white;stroke-width:1;fill:white;fill-rule=\"nonzero\"");

		svg.appendChild(line4);
		
		
	}
}
