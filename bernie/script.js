var counter = 0;

$(function() {	
	var mouth = $("#bernie-div #mouth");
	
	mouth.css("top", "25px");
	
	mouth.click(function() {
	  mouth.animate({
		top: 0
	  }, 250, function() {
		// Animation complete.
	  }).animate({
		top: 25
	  }, 250, function() {
		// Animation complete.
	  });
	  
	  incrementCounter();
	});
	
	var currentMousePos = { x: -1, y: -1 };
	
	$(document).mousemove(function(e) {
		currentMousePos.x = e.pageX;
        currentMousePos.y = e.pageY;
		$('.salami.move').offset({
			left: currentMousePos.x - 25,
			top: currentMousePos.y - 25
		});
	});
	
	$(document).click(function(){
		var salami = $("<div class=\"salami\"><img src=\"littlesalami.png\"></div>");
		$("#content-area").append(salami);
		console.log(currentMousePos.x);
		salami.css("top", currentMousePos.y-25);
		salami.css("left", currentMousePos.x-25);
	});
});


function incrementCounter() {
	counter++;
	$(".counter #counter").html(counter);
}


