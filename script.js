$(function() {
	console.log("Ready!");
	$("#title-wrapper").after("<span id=\"randomText\"></span>");
    var rText = $("#randomText");
	var textList = ["demonstrates his value.", "believes in Froggyland.", "won't let you down.", "believes in you!", "supports milkboat!", "A professional.", "codes, codes, codes."];
	console.log(textList[Math.floor(Math.random() * textList.length)]);
	rText.html(textList[Math.floor(Math.random() * textList.length)]);
});