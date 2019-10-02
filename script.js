$(function() {
	console.log("Ready!");
	$("#title-wrapper").after("<span id=\"randomText\"></span>");
    var rText = $("#randomText");
	var textList = ["is Dennis Reynolds.", "believes in Froggyland.", "won't let you down.", "believes in you!"];
	console.log(textList[Math.floor(Math.random() * textList.length)]);
	rText.html(textList[Math.floor(Math.random() * textList.length)]);
});