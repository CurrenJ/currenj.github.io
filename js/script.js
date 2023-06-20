$(function() {
	console.log("Ready!");
	$("#title-wrapper").after("<span id=\"randomText\"></span>");
    var rText = $("#randomText");
	var textList = [
		"demonstrates his value.",
		"believes in Froggyland.",
		"won't let you down.",
		"believes in you!",
		"is Milkboat!",
		"A professional.",
		"codes, codes, codes.",
		"2024",
		"knows the end.",
		"We can do much more together.",
		"is the life of the party!",
		"makes games.",
		"The man, the myth, the legend.",
		":)",
		":D",
		"Loves flavour text.",
		"Only 1 known bug!",
		"is object-oriened.",
		"felt the Illinoise!",
		"dived too deep for coins.",
		"wants to take you far from the cynics in this town.",
		"is so American.",
		"has big, big plans.",
		"has a chance to construct something beautiful.",
		"Can't believe how strange it is to be anything at all."
	];
	console.log(textList[Math.floor(Math.random() * textList.length)]);
	rText.html(textList[Math.floor(Math.random() * textList.length)]);
});