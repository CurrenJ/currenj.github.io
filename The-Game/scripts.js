$(function() {	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
		var JSONpaths = parseXML(this);
		//console.log(JSONpaths)

		loadOptionParsedXML(JSONpaths, "kvLulPi3MT7WQYTfneSq-1");
		}
	};
	xhttp.open("GET", "The Game.xml", true);
	xhttp.send();
});

function parseXML(xml) {
	var paths = {};
    var xmlDoc = xml.responseXML;
    $.each(xmlDoc.getElementsByTagName("mxCell"), function(index, value) {
		var style = value.getAttribute("style") + "";

		if(style.substring(0, 12) === "text;html=1;") {
			var textVal = value.getAttribute("value") + "";
			var connBox = xmlDoc.getElementById(xmlDoc.getElementById(value.getAttribute("parent")).getAttribute("source"));
			var targBox = xmlDoc.getElementById(xmlDoc.getElementById(value.getAttribute("parent")).getAttribute("target"));
			var target = xmlDoc.getElementById(value.getAttribute("parent")).getAttribute("target")
			if(connBox !== null){

				if(paths[connBox.getAttribute("id")] === undefined){
					paths[connBox.getAttribute("id")] = {};
					paths[connBox.getAttribute("id")]["text"] = connBox.getAttribute("value");
					paths[connBox.getAttribute("id")]["options"] = {};
				}
				if(targBox !== null && paths[targBox.getAttribute("id")] === undefined){
					paths[targBox.getAttribute("id")] = {};
					paths[targBox.getAttribute("id")]["text"] = targBox.getAttribute("value");
					paths[targBox.getAttribute("id")]["options"] = {};
				}
				paths[connBox.getAttribute("id")]["options"][textVal] = target;
				
			}
		}
	});
	console.log("good");
	return JSON.stringify(paths);
	
}
	
function loadOptionParsedXML(pathData, id){
	$("#text").empty();
	$("#img").empty();
	$("#buttons1").empty();
	$("#buttons2").empty();
	
	//console.log(pathData);
	if(typeof(pathData) === "string")
		pathData = JSON.parse(pathData);

	$("#text").append("<p>" + pathData[id]["text"] + "</p>");
	
	if(pathData[id]["image"] !== undefined){
		var i = "<img src=\"" + path[id]["image"] + "\">";
		$("#img").append(i);
		$("#img img").css("width", data.image[1]);
	}
	else {
		$("#img").append("<img>");
	}
	
	if(Object.keys(pathData[id]["options"]).length == 0){
		$("#img img").css("margin", 0);
	} else {
		$.each(pathData[id]["options"], function( index, value ) {
			var debug = "i: " + index + " v: " + value;
			console.log(debug);
			var b = "<button type=\"button\">" + index + "</button>";
			$(b).appendTo("#buttons1").click(function (){
				loadOptionParsedXML(pathData, value);
			});
		});
	}

}

// function loadOptionJSON(option){
		// $("#text").empty();
		// $("#img").empty();
		// $("#buttons1").empty();
		// $("#buttons2").empty();
		
		// var json = $.getJSON("paths/" + option, function(data) {
			// $("#text").append("<p>" + data.text[0] + "</p>");
			// $("#text p").css("font-size", data.text[1]);
			
			
			// var i = "<img src=\"" + data.image[0] + "\">";
			// if(data.image[0] !== "" && data.image[0] !== "null"){
			// $("#img").append(i);
			// $("#img img").css("width", data.image[1]);
			// } else {
				// $("#img").append("<img>");
			// }
			
			// $.each(data.options1, function( index, value ) {
				// var b = "<button type=\"button\">" + value.text + "</button>";
				// $(b).appendTo("#buttons1").click(function (){
					// loadOptionJSON(value.link);
				// });
			// });
			
			// $.each(data.options2, function( index, value ) {
				// var b = "<button type=\"button\">" + value.text + "</button>";
				// $("#buttons2").append(b).click(function (){
					// loadOptionJSON(value.link);
				// });
			// });
			
		// });
		
		// $.getJSON("test.json", function(json) {
		// console.log(json); // this will show the info it in firebug console
		// });
	// }