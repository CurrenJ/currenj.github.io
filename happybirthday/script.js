var setBlur;
var picIndex;
var itemsLoaded = 0;
$(function() {
	console.log("Ready!");
	
	$(window).resize(function() { resizeDiv(); });

	addButtons();
	
	     // Generic function to set blur radius of $ele
		setBlur = function(ele, radius) {
            $(ele).css({
               "-webkit-filter": "grayscale("+radius+"%)",
                "filter": "grayscale("+radius+"%)"
           });
       }
    
	loadJSON();
});

function cyclePic(change){
	picIndex += change;
	console.log(change);
	if(picIndex >= itemsLoaded)
		picIndex %= itemsLoaded;
	else if(picIndex < 0)
		picIndex = itemsLoaded+picIndex;
	
	loadImgFromJSON(picIndex);
}

function addButtons(){
	$("#buttonRight").click(function() {
	  console.log("RIGHT");
	  cyclePic(1);
	});
	
	$("#buttonLeft").click(function() {
	  console.log("LEFT");
	  cyclePic(-1);
	});
}

var items = [];
function loadJSON(){
	$.getJSON( "stuff.json", function( data ) {
	  $.each( data, function( key, val ) {
			items.push(val);
			console.log(val["img"] + ", " + val["overlay"] + ", " + val["text"]);
			itemsLoaded++;
	  });
	});
	console.log(items);	
	loadItems();
}

function loadItems(){
	console.log("loading...");
	if (items.length > 0) {
		loadImgFromJSON(0);
      } else {
           setTimeout(loadItems, 250);
     }
}

function loadImgFromJSON(index){
	picIndex = index;
	console.log(index);
	$("#content").html("");
	var item = items[index];
	addImage(item["img"]);	
	addOverlay(item["overlay"]);
	addText("<p style=\"font-weight:400\">" + item["description"] + "</p><br><p style=\"font-weight:200\">" + item["place"] + "</p><br><i>" + item["time"] + "</i>");
	createCanvas();
}

function resizeDiv () {
	defaultHeight = $(".imgDiv").height();
	defaultWidth = $(".hoverImage").width();

}


function addImage(file){
	var imgHTML = "<div class=\"imgDiv\"><img class=\"mainImage\" src=\"" + file + "\"></div>";
	$("#content").append(imgHTML);
}

function addOverlay(file){
	var imgHTML = "<div class=\"overlayDiv\"><div class=\"rel\"><img class=\"hoverImage\" src=\"" + file + "\"></div></div>";
	$(".imgDiv").append(imgHTML);
}

function addText(txt){
	var textHTML = "<div class=\"info\">" + txt + "</div>";
	$(".imgDiv").append(textHTML);
}

function setText(txt){
	$(".info").html(txt);
}

var hovering = false;
var defaultHeight;
var defaultWidth;
function hoverEnter(){
	hovering = true;
	if(defaultHeight == null){
		defaultHeight = $(".hoverImage").height();
	}
	if(defaultWidth == null){
		defaultWidth = $(".hoverImage").width();
	}
	console.log("Hover started.");
	
	$(".hoverImage").stop();
	$(".hoverImage").animate({
		height: defaultHeight*1.1,
	  }, 250, "easeOutQuad", false, function() {
		// Animation complete.
	 });
	 
	 $(".overlayDiv").stop();
	 $(".overlayDiv").animate({
	 	right: ((defaultWidth*1.1)-defaultWidth) / 8,
	  }, 250, "linear", false, function() {
		// Animation complete.
	 });
	 
	 $(".info").css("width", "20%");
	 $(".info").css("opacity", "80%");
	 
	 
    setBlur($(".mainImage"), 100);
}

function hoverExit(){
	hovering = false;
	console.log("Hover exited.");
	$(".hoverImage").stop();
	$(".hoverImage").animate({
		height: defaultHeight
	  }, 500, "easeOutQuad", false, function() {
			//After
	});
	
	$(".overlayDiv").stop();
	 $(".overlayDiv").animate({
	 	right: 0,
	  }, 250, "linear", false, function() {
		// Animation complete.
	 });
	 
	 $(".info").css("width", "0");
	 $(".info").css("opacity", "0");
	 
    setBlur($(".mainImage"), 0);
}

function createCanvas(){
	var img = $(".hoverImage")[0];
	var canvas = document.createElement("canvas");
	canvas.width = img.width;
	canvas.height = img.height;
	canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
	
	
	$('.hoverImage').mousemove(function(e) {
			
			if(!this.canvas) {
				this.canvas = $('<canvas />')[0];
				this.canvas.width = this.width;
				this.canvas.height = this.height;
				this.canvas.getContext('2d').drawImage(this, 0, 0, this.width, this.height);
			}
			
			var pixelData = this.canvas.getContext('2d').getImageData(event.offsetX, event.offsetY, 1, 1).data;
			var alpha = pixelData[3];
			if(alpha > 25){
				if(!hovering)
					hoverEnter();
			}
			else {
				if(hovering)
					hoverExit();
			}
			
	});
}
