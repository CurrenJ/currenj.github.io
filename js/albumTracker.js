var list = [
			// {'album': 'A Brief Enquiry Into Online Relationships', 'artist': 'The 1975', 'ranking': 'green'},
			// {'album': 'We Don’t Have Each Other', 'artist': 'Aaron West and the Roaring Twenties', 'ranking': 'green'},
			// {'album': 'Love in the Time of E-mail ', 'artist': 'Antarctigo Vespucci', 'ranking': 'orange'},
			// {'album': 'Hospice', 'artist': 'The Antlers', 'ranking': 'green'},
			// {'album': 'Funeral', 'artist': 'Arcade Fire', 'ranking': 'green'},
			// {'album': 'Suck It and See', 'artist': 'Arctic Monkeys', 'ranking': 'green'},
			// {'album': 'Tranquility Base Hotel and Casino', 'artist': 'Arctic Monkeys', 'ranking': 'orange'},
			// {'album': 'Deadroses', 'artist': 'blackbear', 'ranking': 'orange'},
			// {'album': 'digital druglord', 'artist': 'blackbear', 'ranking': 'orange'},
			// {'album': 'California', 'artist': 'blink-182', 'ranking': 'orange'},
			// {'album': 'Silent Alarm', 'artist': 'Bloc Party', 'ranking': 'red'},
			// {'album': 'I’m Wide Awake It’s Morning', 'artist': 'Bright Eyes', 'ranking': 'green'},
			// {'album': 'Bananas for Breakfast - EP', 'artist': 'c a n d i d !', 'ranking': 'orange'},
			// {'album': 'Melophobia', 'artist': 'Cage the Elephant', 'ranking': 'orange'},
			// {'album': 'Camp', 'artist': 'Childish Gambino', 'ranking': 'green'},
			// {'album': 'the boys - EP', 'artist': 'cleopatrick', 'ranking': 'green'},
			// {'album': 'Blushing', 'artist': 'Copeland', 'ranking': 'green'},
			// {'album': 'Plans', 'artist': 'Death Cab for Cutie', 'ranking': 'green'}
			// {'album': '', 'artist': '', 'ranking': ''}
			]
			
//var rawText = "A Brief Inquiry Into Online Relationships - The 1975\nWe Don’t Have Each Other - Aaron West and the Roaring Twenties\nLove in the Time of E-mail - Antarctigo Vespucci\nHospice - The Antlers\nFuneral - Arcade Fire\nSuck It and See - Arctic Monkeys\nTranquility Base Hotel and Casino - Arctic Monkeys\nDeadroses - blackbear\ndigital druglord - blackbear\nCalifornia - blink-182\nSilent Alarm - Bloc Party\nI’m Wide Awake It’s Morning - Bright Eyes\nBananas for Breakfast - EP - c a n d i d !\nMelophobia - Cage the Elephant\nCamp - Childish Gambino\nthe boys - EP - cleopatrick\nBlushing - Copeland\nPlans - Death Cab for Cutie\n+ - Ed Sheeran\n÷ - Ed Sheeran\nThe Earth Is Not a Cold Dead Place - Explosions In the Sky\nSpending Eternity in a Japanese Coconvenience Store - Forests\nThe Albatross - Foxing\nDealer - Foxing\nNearer My God - Foxing\nAnn - EP - The Front Bottoms\nBack on Top - The Front Bottoms\nThe Front Bottoms - The Front Bottoms\nGoing Grey - The Front Bottoms\nTalon of the Hawk - The Front Bottoms\nGrad Life - Graduating Life\na modern tragedy, vol. 1 - EP - grandson\nThe Boy Who Died Wolf - Highly Suspect\nHome, Like Noplace is There - The Hotelier\nPetty Grudge Pop - The Hubbards\nNight Visions - Imagine Dragons\nBleed American - Jimmy Eat World\nIn Tongues - EP - Joji\nThe Human Condition - Jon Bellion\nNever Hungover Again - Joyce Manor\nHot Fuss - The Killers\nIn a Perfect World - Kodaline\nPanorama - La Dispute\nBobby Tarantino II - Logic\nMelodrama - Lorde\nIII - The Lumineers\nSpin - EP - Mallory Run\nA Black Mile To The Surface - Manchester Orchestra\nLoner - MISSIO\nSports - Modern Baseball\nThe Nameless Ranger - EP - Modern Baseball\nYou’re Gonna Miss It All - Modern Baseball\nBabel - Mumford & Sons\nSigh No More - Mumford & Sons\nBlack Holes and Revelations - Muse\nDrones - Muse\nOrigins of Symmetry - Muse\nThe Black Parade - My Chemical Romance\nSleep Well Beast - The National\nA Bad Girl In Harlem - New Politics\nPerception - NF\nModal Soul - Nujabes\nGen 3 - EP - Origami Angel\nThe Yunahon Mixtape - Oso Oso\nDeath of a Bachelor - Panic! At the Disco\nCreatures - Pavvla\nHomemade Stuff - Pavvla\nGive Up - The Postal Service\nCosmic Thrill Seekers - Prince Daddy & The Hyena\nThe Dream Is Over - PUP\nMorbid Stuff - PUP\nIn Rainbows - Radiohead\nKid A - Radiohead\nA Moon Shaped Pool - Radiohead\nOK Computer - Radiohead\nApricot Princess - Rex Orange County\nTell Me It’s Real - Seafret\nBirdie - Slaughter Beach, Dog\nSafe and Also No Fear - Slaughter Beach, Dog\nMore Scared of You Than You Are of Me - The Smith Street Band\nEyes Open - Snow Patrol\nForgettable - Sorority Noise\nYou’re Not as ____ as You Think - Sorority Noise\nIs This It - The Strokes\nThe Age of Adz - Sufjan Stevens\nCarrie & Lowell - Sufjan Stevens\nIllinois - Sufjan Stevens\nPlanetarium - Sufjan Stevens, Bryce Dessner, Nico Muhly & James McAlister\nSwell - Tiny Moving Parts\nChemical Miracle - Trophy Eyes\nBlurryface - twenty one pilots\nTOPxMM - EP - twenty one pilots\ntwenty one pilots - twenty one pilots\nVessel - twenty one pilots\nx Infinity - Watsky\nWeezer (White Album) - Weezer\nYankee Hotel Foxtrot - Wilco\nGlitterbug - The Wombats\nThe Greatest Generation - The Wonder Years\nNo Closer to Heaven - The Wonder Years\nSister Cities - The Wonder Years\nOcean Avenue - Yellowcard";
var rawText = "";

$( function() {
	$( "#save" ).click(function() {
		$.each($(".item"), function(index, value){
			list[index] = {};
			list[index]['artist'] = $(value).find(".artist").html();
			list[index]['album'] = $(value).find(".album").html();
			list[index]['ranking'] = $(value).prop("class").substring(5);
		});
		saveText(JSON.stringify(list));
	});
	
	$( "#add-button" ).click(function() {
		addEditable();
	});
	
	$( ".lock label div input" ).click(function() {
		console.log($(this).attr("checked"));	
		editMode(this.checked);
	});
	
	$( "#sort" ).click(function() {
		sortList();
	});
	
	
	 var fileInput = document.getElementById('inputId');
	 
	  fileInput.addEventListener('change', function(e) {
			var file = fileInput.files[0];
			var textType = /json.*/;

			if (file.type.match(textType)) {
				var reader = new FileReader();

				reader.onload = function(e) {
					list = JSON.parse(reader.result);
					console.log(list);
					genList();
				}

				reader.readAsText(file);	
			} else {

			}
		});

	
	$.each(rawText.split("\n"), function(index, value){
		var dual = value.split("-");
		if(dual.length == 2)
			list.push({'artist': dual[1], 'album': dual[0], 'ranking': ''});
		else if(dual.length > 2){
			var itemObj = {'artist': '', 'album': '', 'ranking': ''};
			$.each(dual, function(index, value){
				if(index != dual.length-1){
					itemObj['album'] += value;
					if(index != dual.length-2)
						itemObj['album'] += " - ";
				}
				else itemObj['artist'] = value;
			});
			list.push(itemObj);
		}
	});
	
	genList();
	inputUpdate();
});

function createEl(before, obj) {
	var el = "<div class=\"item " + obj['ranking'] + "\"><div class=\"inner\"><i><div class=\"artist\">" + obj['artist'] + "</div></i>&nbsp-&nbsp<div class=\"album\">" + obj['album'] + "</div></div></div>";
	before.before(el);
}

function genList(){
	$.each($(".item"), function(index, value){
		$(value).remove();
	});
	
	$.each(list, function(index, value){

		console.log(value['artist'] + " - " + value['album']);
		createEl($("#add-button"), value);
	});	
}

function sortList(){
	var sortedArtists = [];
	
	
	$.each($(".item"), function(index, value){
		list[index] = {};
		list[index]['artist'] = $(value).find(".artist").html();
		list[index]['album'] = $(value).find(".album").html();
		list[index]['ranking'] = $(value).prop("class").substring(5);
	});
	
	list.sort(function(a, b) {
		var artistA = a['artist'].toLowerCase();
		if(artistA.substring(0, 4) === "the "){
			artistA = artistA.substring(4);
		}
		var artistB = b['artist'].toLowerCase();
		if(artistB.substring(0, 4).toLowerCase() === "the "){
			artistB = artistB.substring(4);
		}
		console.log(artistA + " | " + artistB);
		
		return ((artistA+a['album'] < artistB+b['album']) ? -1 : ((artistA+a['album'] == artistB+b['album']) ? 0 : 1));
	});
	
	genList();		
	inputUpdate();
	
	// $.each($(".item", function(index, value){
		// sortedArtists[index] = $(value).find(".artist").html() + $(value).find(".album").html();
		// refList[index] = {};
		// refList[index]['artist'] = $(value).find(".artist").html();
		// refList[index]['album'] = $(value).find(".album").html();
		// refList[index]['ranking'] = $(value).prop("class").substring(5);
	// });
	// sortedArtists.sort();
}

function saveText(text){
	console.log("Saving as JSON...");
	var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(text);
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "albumData" + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}


function inputUpdate(){
	var contents = document.querySelectorAll("[contenteditable=true]");
	[].forEach.call(contents, function (content) {
		// When you click on item, record into `data-initial-text` content of this item.
		content.addEventListener("focus", function () {
			if(content.innerHTML === "artist" || content.innerHTML === "album")
				content.innerHTML = "";
			content.setAttribute("data-initial-text", content.innerHTML);
		});
		// When you leave an item...
		content.addEventListener("blur", function () {
			// ...if content is different...
			if (content.getAttribute("data-initial-text") !== content.innerHTML) {
				console.log("New data when content change.");
				console.log(content.innerHTML);
				if(content.innerHTML === "" || content.innerHTML === "<br>"){
					content.innerHTML = content.className;
				}
			}
			else if(content.innerHTML === "" || content.innerHTML === "<br>"){
				content.innerHTML = content.className;
			}
		});
	});
	
	$("input[type='radio']").click(function(){

            var radioValue = $(this).attr('id');

			console.log($(this));
			if(radioValue.substring(0, 6) === "match_"){
					
					if(parseInt(radioValue.substring(6)) % 3 == 1){
						$(this).closest(".item").removeClass("green").removeClass("red").removeClass("orange").addClass("green");
					}
					else if(parseInt(radioValue.substring(6)) % 3 == 2){
						$(this).closest(".item").removeClass("green").removeClass("red").removeClass("orange").addClass("red");
					}
					else if(parseInt(radioValue.substring(6)) % 3 == 0){
						$(this).closest(".item").removeClass("green").removeClass("red").removeClass("orange").addClass("orange");
					}
				}

    });
}

alert = function() {
  console.log(new Error().stack);
  old.apply(window, arguments);
};

var buttonIndex = 1;
function addEditable(){
	var el = "<div class=\"item " + "\"><div class=\"inner\"><i><div class=\"artist\" contenteditable=\"true\">" + "artist" + "</div></i><div>&nbsp-&nbsp</div><div class=\"album\" contenteditable=\"true\">" + "album" + "</div></div>" + 
	"<div class=\"form\">" +
		"<form>" +
			"<fieldset class=\"form__options\">" +
				"<p class=\"form__answer\">" +
					"<input type=\"radio\" name=\"match\" id=\"match_" + buttonIndex + "\" value=\"guy\"> " +
					"<label for=\"match_" + buttonIndex + "\" class=\"green\">" +
						"" +
					"</label>" +
				"</p>" +
				
				"<p class=\"form__answer\">" +
					"<input type=\"radio\" name=\"match\" id=\"match_" + (buttonIndex + 1) + "\" value=\"girl\"> " +
					"<label for=\"match_" + (buttonIndex + 1) + "\" class=\"red\">" +
						"" +
					"</label>" +
				"</p>" +
				
				"<p class=\"form__answer\">" +
					"<input type=\"radio\" name=\"match\" id=\"match_" + (buttonIndex + 2) + "\" value=\"cat\"> " +
					"<label for=\"match_" + (buttonIndex + 2) + "\" class=\"orange\">" +
						"Cat" +
					"</label>" +
				"</p>" +
				
			"</fieldset>" +	
		"</form>" +
	"</div>" +
	"</div>";
	$("#add-button").before(el);
	buttonIndex += 3;
	inputUpdate();
	editMode(true);
}

function addColorSelector(el){
	var formHTML = "<div class=\"form\">" +
		"<form>" +
			"<fieldset class=\"form__options\">" +
				"<p class=\"form__answer\">" +
					"<input type=\"radio\" name=\"match\" id=\"match_" + buttonIndex + "\" value=\"guy\"> " +
					"<label for=\"match_" + buttonIndex + "\" class=\"green\">" +
						"" +
					"</label>" +
				"</p>" +
				
				"<p class=\"form__answer\">" +
					"<input type=\"radio\" name=\"match\" id=\"match_" + (buttonIndex + 1) + "\" value=\"girl\"> " +
					"<label for=\"match_" + (buttonIndex + 1) + "\" class=\"red\">" +
						"" +
					"</label>" +
				"</p>" +

				"<p class=\"form__answer\">" +
					"<input type=\"radio\" name=\"match\" id=\"match_" + (buttonIndex + 2) + "\" value=\"cat\" > " +
					"<label for=\"match_" + (buttonIndex + 2) + "\" class=\"orange\">" +
						"Cat" +
					"</label>" +
				"</p>" +
				
			"</fieldset>" +	
		"</form>" +
	"</div>";
	var appended = $(el).append(formHTML);
	if($(el).hasClass("green")){
		console.log($(appended).find("label.green").siblings("input"));
		$(appended).find("label.green").siblings("input").prop("checked", true);
	}
	else if($(el).hasClass("red")){
		$(appended).find("label.red").siblings("input").prop("checked", true);
	}
	else if($(el).hasClass("orange")){
		$(appended).find("label.orange").siblings("input").prop("checked", true);
	}
	
	buttonIndex += 3;
	inputUpdate();
}

function editMode(enabled){
	if(enabled){
		$(".lock").find("input").prop("checked", true);
		$.each($(".item"), function(index, value){
			if($(value).children(".form").length == 0){
				addColorSelector($(value));
			}
			$(value).find(".artist").attr('contenteditable','true');
			$(value).find(".album").attr('contenteditable','true');
		});
		inputUpdate();
	}
	else {
		$.each($(".item"), function(index, value){
			if($(value).children(".form").length > 0){
				$(value).children(".form").remove();
			}
			$(value).find(".artist").attr('contenteditable','false');
			$(value).find(".album").attr('contenteditable','false');
			if($(value).find(".artist").html() === "artist" && $(value).find(".album").html() === "album"){
				console.log("hey");
				$(value).remove();
			}
		});
	}
}