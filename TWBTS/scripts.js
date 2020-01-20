var mapSizeX = 25;
var mapSizeY = 25;
var map = new Array(mapSizeX);
var players = {};
var numItemsToGenPerArea = 500; //per an average zone of 50x50

var fishingLog;
var settings = {};

var satiationMax = 100;
var healthMax = 100;
var playersRemaining;
	
$(document).ready(function() {
	$(window).resize(function () {
		$("#mapBox").css("height", $("#mapBox").css("width"));
		$("td").css("width", (100 / x) + "%");
		$("tr").css("height", $("td").css("width"));
	});
	
	settings["combatDamage"] = $("#combatDamage").is(":checked");
	settings["itemAcquisition"] = $("#allItems").is(":checked");
	settings["weaponAcquisition"] = $("#weapons").is(":checked");
	settings["foodAcquisition"] = $("#food").is(":checked");
	settings["updateMap"] = $("#updateMap").is(":checked");
	settings["foodConsumption"] = $("#eating").is(":checked");
	settings["leveling"] = $("#leveling").is(":checked");
	settings["levelingPlayers"] = $("#levelingPlayers").is(":checked");
	settings["levelingItems"] = $("#levelingItems").is(":checked");
	settings["crafting"] = $("#crafting").is(":checked");
	settings["pathfinding"] = $("#pathfinding").is(":checked");
		
	var selectedTile;
	$("#mapBox").on("click", "td", function () {
		try {
			drawTile(selectedTile.index(), selectedTile.parent().index())
			selectedTile.css("border", "0px");
		} catch(error){}
		
		selectedTile = $(this);
		if($("#borders").is(":checked")){
			selectedTile.css("background-color", "grey")
		}
		selectedTile.css("border", "1px solid black")
		
		displayTileInfo(selectedTile);
	});
		
	$("#settingsBox").on("click", "#borders", function () {
		displayBorders($("#borders").is(":checked"));
	});
	
	$("#settingsBox").on("click", "#itemsVis", function () {
		displayItems($("#itemsVis").is(":checked"));
	});
	
	$("#settingsBox").on("click", "#x1", function () {
		actionAll();
	});
	
	$("#settingsBox").on("click", "#x10", function () {
		if(!settings["updateMap"]){
			for(r = 0; r < 10; r++){
				actionAll();
			}
		} else simulateAndUpdate(10);
	});
	
	$("#settingsBox").on("click", "#x100", function () {
		if(!settings["updateMap"]){
			for(r = 0; r < 100; r++){
				actionAll();
			}
		} else simulateAndUpdate(100);
	});
	
	$("#settingsBox").on("click", "#x1000", function () {
		if(!settings["updateMap"]){
			for(r = 0; r < 1000; r++){
				actionAll();
			}
		} else simulateAndUpdate(1000);
	});
	
	$("#settingsBox").on("click", "#combatDamage", function () {
		settings["combatDamage"] = $("#combatDamage").is(":checked");
	});
	
	$("#settingsBox").on("click", "#allItems", function () {
		settings["itemAcquisition"] = $("#allItems").is(":checked");
	});
	
	$("#settingsBox").on("click", "#weapons", function () {
		settings["weaponAcquisition"] = $("#weapons").is(":checked");
	});
	
	$("#settingsBox").on("click", "#food", function () {
		settings["foodAcquisition"] = $("#food").is(":checked");
	});
	
	$("#settingsBox").on("click", "#updateMap", function () {
		settings["updateMap"] = $("#updateMap").is(":checked");
	});
	
	$("#settingsBox").on("click", "#eating", function () {
		settings["foodConsumption"] = $("#eating").is(":checked");
	});
	
	$("#settingsBox").on("click", "#levelUpStats", function () {
		settings["levelUpStats"] = $("#levelUpStats").is(":checked");
	});
	
	$("#settingsBox").on("click", "#fishing", function () {
		settings["fishing"] = $("#fishing").is(":checked");
	});
	
	$("#settingsBox").on("click", "#leveling", function () {
		settings["leveling"] = $("#leveling").is(":checked");
	});
	
	$("#settingsBox").on("click", "#levelingItems", function () {
		settings["levelingItems"] = $("#levelingItems").is(":checked");
	});
	
	$("#settingsBox").on("click", "#levelingPlayers", function () {
		settings["levelingPlayers"] = $("#levelingPlayers").is(":checked");
	});
	
	$("#pathfinding").on("click", "#pathfinding", function () {
		settings["pathfinding"] = $("#pathfinding").is(":checked");
	});
	
	function displayTileInfo(tile){
		//console.log(tile.index() + ", " + tile.parent().index());
		for (var key in map[tile.index()][tile.parent().index()]) {
			if (map[tile.index()][tile.parent().index()].hasOwnProperty(key)) {
				//console.log(key + " -> " + map[tile.index()][tile.parent().index()][key]);
				$("#infoBox").html("");
				var results = "<p>" + (JSON.stringify(map[tile.index()][tile.parent().index()], null, 4)) + "</p>";
				$("#infoBox").html(results.replace(/\n/g, "<br>").replace(/[ ]/g, "&nbsp;"));
				//$("#infoBox").html(map[tile.index()][tile.parent().index()][key].toString());
			}
		}
	}
	
	genModBounds();
	
    $("#mapBox").css("height", $("#mapBox").css("width"));
	for(x = 0; x < mapSizeX; x++){
		map[x] = new Array(mapSizeY);
		for(y = 0; y < mapSizeY; y++){
			map[x][y] = {"item": {}, "uniqueItem": {}, "terrain": {}};
		}
	}
	console.log(map);
	createMapTable(mapSizeX, mapSizeY);
	displayItems(true);
	createTerrain(mapSizeX, mapSizeY);
	
	displayBorders(false);
	createUniqueItemInWorld(2, 2, "axe");
	spawnItemsInWorld(2, 2, "timber");
	spawnItemsInWorld(2, 2, "timber");
	spawnItemsInWorld(2, 2, "timber");
	spawnItemsInWorld(2, 2, "stick");
	spawnItemsInWorld(2, 2, "stick");
	spawnItemsInWorld(2, 2, "stick");
	addPlayer(2, 3, "Curren", 68, 130, "male", 4, 8);
	movePlayer(getPlayerLoc("Curren")["x"], getPlayerLoc("Curren")["y"], 0, -1);
	//equipUniqueItem("Curren", "axe");
	autoEquip("Curren", "combat");
	
	//spawnItemsInWorld(3, 2, "fishing rod");
	//addPlayer(3, 3, "Nico", 69, 140, "male", 4, 8);
	//movePlayer(getPlayerLoc("Nico")["x"], getPlayerLoc("Nico")["y"], 0, -1);
	//equipUniqueItem("Nico", "sword");
	//autoEquip("Nico", "combat");
	
	displayItems($("#itemsVis").is(":checked"));
	build("Curren", "campfire", 1, 2);
	spawnRandomPlayers(9);	
});

var randomPlayerList = {//"Nico":{"name":"Nico", "height":69, "weight":145, "gender":"male"},
						"Bethan":{"name":"Bethan", "height":64, "weight":130, "gender":"female"},
						"Anders":{"name":"Anders", "height":68, "weight":140, "gender":"male"},
						"Johan":{"name":"Johan", "height":68, "weight":135, "gender":"male"},
						"Marina":{"name":"Marina", "height":66, "weight":140, "gender":"female"},
						"Maya":{"name":"Maya", "height":62, "weight":130, "gender":"female"},
						"James":{"name":"James", "height":71, "weight":140, "gender":"male"},
						"Thorp":{"name":"Thorp", "height":69, "weight":135, "gender":"male"},
						"Valeria":{"name":"Valeria", "height":63, "weight":110, "gender":"female"},
						"Mr. Walker":{"name":"Mr. Walker", "height":68, "weight":140, "gender":"male"}
	};
	
function spawnRandomPlayers(quantity) {
	for(p = 0; p < quantity; p++){
		player = randomPlayerList[Object.keys(randomPlayerList)[Math.floor(Math.random() * Object.keys(randomPlayerList).length)]];
		delete randomPlayerList[player["name"]];
		var x = Math.floor(Math.random() * mapSizeX);
		var y = Math.floor(Math.random() * mapSizeY);
		while(map[x][y]["terrain"]["type"] === "pond" || map[x][y]["terrain"]["type"] === "river" || map[x][y].hasOwnProperty("player")){
			x = Math.floor(Math.random() * mapSizeX);
			y = Math.floor(Math.random() * mapSizeY);
		}
		addPlayer(x, y, player["name"], player["height"], player["weight"], player["gender"]);
		//console.log(randomPlayerList);
	}
}

function addPlayer(x, y, name){
		log(name + " has entered the Woods.");
		map[x][y]["player"] = {};
		map[x][y]["player"]["name"] = name;
		map[x][y]["inventory"] = {};
		displayPlayer(x, y);
	}
	
function addPlayer(x, y, name, height, weight, gender){ //in inches and lbs
		log(name + " has entered the Woods.");
		map[x][y]["player"] = {};
		map[x][y]["player"]["name"] = name;
		map[x][y]["player"]["height"] = height;
		map[x][y]["player"]["weight"] = weight;
		map[x][y]["player"]["gender"] = gender;
		map[x][y]["player"]["inventory"] = {};
		addPlayerStats(x, y);
		displayPlayer(x, y);
	}
	
	function addPlayer(x, y, name, height, weight, gender, charisma, intelligience){ //in inches and lbs
		log(boldWord(name) + " has entered the Woods.");
		map[x][y]["player"] = {};
		map[x][y]["player"]["name"] = name;
		map[x][y]["player"]["height"] = height;
		map[x][y]["player"]["weight"] = weight;
		map[x][y]["player"]["gender"] = gender;
		map[x][y]["player"]["inventory"] = {};
		map[x][y]["player"]["charisma"] = charisma; //out of 10
		map[x][y]["player"]["intelligience"] = intelligience; //out of 10
		addPlayerStats(x, y);
		displayPlayer(x, y);
	}
	
function addPlayerStats(x, y){
	if(map[x][y]["player"]["gender"] === "male"){
		map[x][y]["player"]["speed"] = (2*(-Math.pow(map[x][y]["player"]["height"], 2)/Math.pow(96, 2)+1) + 2*(-Math.pow(map[x][y]["player"]["weight"], 2)/Math.pow(240, 2)+1)) / 2;
		map[x][y]["player"]["strength"] = 4*(Math.pow(map[x][y]["player"]["weight"], 2)/Math.pow(240, 2));
	}
	else {
		map[x][y]["player"]["speed"] = (2*(-Math.pow(map[x][y]["player"]["height"], 2)/Math.pow(91, 2)+1) + 2*(-Math.pow(map[x][y]["player"]["weight"], 2)/Math.pow(230, 2)+1)) / 2;
		map[x][y]["player"]["strength"] = 4*(Math.pow(map[x][y]["player"]["weight"], 2)/Math.pow(230, 2));
	}
	map[x][y]["player"]["typeList"] = {};
	map[x][y]["player"]["unmodifiedSpeed"] = map[x][y]["player"]["speed"];
	map[x][y]["player"]["health"] = 100;
	map[x][y]["player"]["accuracy"] = 0.8
	map[x][y]["player"]["satiation"] = satiationMax;
	map[x][y]["player"]["uniqueInventory"] = {};
	map[x][y]["player"]["activeItem"] = {};
	map[x][y]["player"]["level"] = {"curLevel": 1, "expForNext":10, "curExp": 0}
	map[x][y]["player"]["x"] = x;
	map[x][y]["player"]["y"] = y;
	// players[map[x][y]["player"]["name"]] = map[x][y]["player"];
	// players[map[x][y]["player"]["name"]]["x"] = x;
	// players[map[x][y]["player"]["name"]]["y"] = y;
	//console.log(players);
	playersRemaining++;
}

function displayPlayer(x, y){
	//$('#mapBox table tr').eq(y).find('td').eq(x).append("<p style=\"font-size:50%\">" + map[x][y]["player"]["name"] + "</p>");
	if(map[x][y].hasOwnProperty("player")){
		players[map[x][y]["player"]["name"]] = JSON.parse(JSON.stringify(map[x][y]["player"]));
		players[map[x][y]["player"]["name"]]["x"] = x;
		players[map[x][y]["player"]["name"]]["y"] = y;
		$('#mapBox table tr').eq(y).find('td').eq(x).children("p").remove();
		$('#mapBox table tr').eq(y).find('td').eq(x).append("<p style=\"font-size:50%\">" + map[x][y]["player"]["name"].substring(0, 2) + "</p>");
	} else drawTile(x, y);
}

function undisplayPlayer(x, y){
	$('#mapBox table tr').eq(y).find('td').eq(x).children("p").remove();
}

function drawTile(x, y){
	$('#mapBox table tr').eq(y).find('td').eq(x).children("p").remove();
	if(map[x][y]["terrain"].hasOwnProperty("type")){
		var terrainType = map[x][y]["terrain"]["type"];
		var color;
		switch(terrainType) {
			case "forest":
				color = "#01730e";
				break;
			case "denseForest":
				color = "#00610b";
				break;
			case "field":
				color = "#6a9400"
				break;
			case "river":
				color = "#007cad";
				break;
			case "pond":
				color = "#006891";
				break;
		}
		$('#mapBox table tr').eq(y).find('td').eq(x).css("background-color", color);
	}
	
	if(map[x][y].hasOwnProperty("player")){
		displayPlayer(x, y);
	}
	else {
		if(map[x][y].hasOwnProperty("item")){
			$.each( map[x][y]["item"], function( key, value ) {
				$('#mapBox table tr').eq(y).find('td').eq(x).children("p").remove();
				if(itemsVis)
					$('#mapBox table tr').eq(y).find('td').eq(x).append(("<p style=\"font-size:50%\" class=\"item\">" + key.substring(0, 2) + "</p>"));
			});
		}
		if(map[x][y].hasOwnProperty("uniqueItem")){
			$.each( map[x][y]["uniqueItem"], function( key, value ) {
				$('#mapBox table tr').eq(y).find('td').eq(x).children("p").remove();
				if(itemsVis)
					$('#mapBox table tr').eq(y).find('td').eq(x).append(("<p style=\"font-size:50%\" class=\"item\">" + key.substring(0, 2) + "</p>"));
			});
		}
	}
	
	$("tr").css("height", $("td").css("width"));
}


var weaponModifiers = {	"large" : {"chance":0.2, "effects":{"atk":1.2, "speed":0.9}},
						"small" : {"chance":0.2, "effects":{"atk":0.8, "speed":1.1}},
						"reinforced" : {"chance":0.05, "effects":{"atk":1.3, "speed":1}},
						"broken" : {"chance":0.02, "effects":{"atk":0.1, "speed":1}},
						"light" : {"chance":0.1, "effects":{"speed":1.1}},
						"quick" : {"chance":0.1, "effects":{"speed":1.2}},
						"heavy" : {"chance":0.1, "effects":{"speed":0.9}},
						"well-made" : {"chance":0.05, "effects":{"atk":1.2,"speed":1.2}},
						"sharp" : {"chance":0.05, "effects":{"atk":1.4}},
						"precise" : {"chance":0.1, "effects":{"atkR":0.8}}
};

var itemList = {"axe" : {"type":"weapon", "combatType":"melee", "atk":3, "atkR":1, "speed":1}, 
				"sword" : {"type":"weapon", "combatType":"melee", "atk":2, "atkR":0.5, "speed":2},
				"dagger" : {"type":"weapon", "combatType":"melee", "atk":1, "atkR":0.1, "speed":4},
				"sharp stick" : {"type":"weapon", "combatType":"mixed", "atk":1.5, "atkR":1, "speed":2},
				
				"berries" : {"type":"food", "foodPoints":10, "minQ":2, "maxQ":10},
				"raw fish" : {"type":"misc"},
				"cooked fish" : {"type":"food", "foodPoints":50},
				"raw meat" : {"type":"misc"},
				"cooked meat" : {"type":"food", "foodPoints":20},
				
				"timber" : {"type":"misc"},
				"stone" : {"type":"misc"},
				"flint" : {"type":"misc"},
				"rope" : {"type":"misc"},
				"fishing hook" : {"type":"misc"},
				"stick" : {"type":"misc"},
				"worn pocket-knife" : {"type":"misc"},
				"some bait" : {"type":"misc"},
				"strange mushrooms" : {"type":"misc"},
				"dead squirrel" : {"type":"food", "foodPoints":25, "minQ":1, "maxQ":3},
				"broken glass" : {"type":"misc"},
				
				"fishing rod" : {"type":"tool"},
				"campfire" : {"type":"build", "active":true}
};

var itemsToGen = {	"axe":0.03, "sword":0.03, "sharp stick":0.05, "dagger":0.02, "berries":0.1, "timber":0.1, "stone":0.1, "flint":0.07, "rope":0.05,
					"fishing hook":0.05, "stick":0.1, "worn pocket-knife": 0.02, "some bait": 0.2, "strange mushrooms":0.02,
					"dead squirrel":0.03, "broken glass":0.001
					};

function equipUniqueItem(playerName, id){ //players can only equip unique items (tools and weapons) to their active slot
	var player = getPlayer(playerName);
	if(player["uniqueInventory"].hasOwnProperty(id)){
		var uniqueItemName = Object.keys(player["uniqueInventory"][id])[0];
		if(playerHasActiveItem(playerName)){
			player["uniqueInventory"][getActiveItemID(playerName)] = getActiveItem(playerName);
			delete player["activeItem"][getActiveItemID(playerName)];
		}
		player["activeItem"][id] = player["uniqueInventory"][id];
		//console.log(player["activeItem"][id]);
		delete player["uniqueInventory"][id];
		log(boldWord(playerName) + " equipped " + getAOrAn(uniqueItemName) + " " + italicWord(uniqueItemName) + ".");
	}
	else if(player["activeItem"].hasOwnProperty(id)){
		log(playerName + " already has " + getAOrAn(getActiveItemName(playerName)) + " " + getActiveItemName(playerName) + " equipped.");
	}
	else {
		log(playerName + " tried to equip " + getAOrAn(getActiveItemName(playerName)) + " " + getActiveItemName(playerName) + ", but did not have any.");
	}
}

var craftables = {
	"fishing rod":{"fishing hook":{"name":"fishing hook", "quantity":1}, "rope":{"name":"rope", "quantity":1}, "stick":{"name":"stick", "quantity":1}},
	"campfire":{"timber":{"name":"timber", "quantity":3}, "stick":{"name":"stick", "quantity":3}}
};
function getCraftables(playerName){
	if(playerExists(playerName)){
		var player = getPlayer(playerName);
		canCraft = {};
		
		$.each(craftables, function( key, value ){
			var hasItems = true;
			$.each(value, function( itemName, itemDetails ){
				if(!player["inventory"].hasOwnProperty(itemDetails["name"])){
					hasItems = false;
				}
				else if(player["inventory"][itemDetails["name"]]["quantity"] < itemDetails["quantity"]){
					hasItems = false;
				}
			});
			
			if(hasItems)
				canCraft[key] = itemList[key];
		});
		//console.log(canCraft);
		return canCraft;
	}
	return {};
}

function craft(playerName, itemName, logCraft){
	var canCraft = getCraftables(playerName);
	if(canCraft.hasOwnProperty(itemName)){
		$.each(craftables[itemName], function( itemName, itemDetails ){
			for(q = 0; q < itemDetails["quantity"]; q++)
				consumeItem(playerName, itemDetails["name"]);
		});
		spawnItemsToPlayer(playerName, itemName);
		if(logCraft)
			log(boldWord(playerName) + " crafted " + getAOrAn(itemName) + " " + italicWord(itemName) + ".");
	}
	else if(logCraft) log(boldWord(playerName) + " tried to craft " + getAOrAn(itemName) + " " + italicWord(itemName) + " but did not have the necessary items.");
}

function getSurroundingArea(playerName, halfSize){
	if(playerExists(playerName)){
		var player = getPlayer(playerName);
		var surArea = [];
		var index = 0;
		for(x = -halfSize; x < halfSize; x++){
			for(y = -halfSize; y < halfSize; y++){
				var xPos = player["x"] + x;
				var yPos = player["y"] + y;
				if(xPos >= 0 && xPos < mapSizeX && yPos >= 0 && yPos < mapSizeY){
					surArea[index] = map[xPos][yPos];
					index++;
				}
			}
		}
		return surArea;
	}
}

function lookForBuild(playerName, buildName, searchHalfSize){
	var matches = [];
	var index = 0;
	var surArea = getSurroundingArea(playerName, searchHalfSize);
	$.each(surArea, function( key, value ){
		if(value["terrain"].hasOwnProperty("build") && value["terrain"]["build"].hasOwnProperty(buildName)){
			matches[index] = key;
			index++;
		}
	});
	return matches;
}

function lookForItem(playerName, itemName, searchHalfSize){
	var matches = [];
	var index = 0;
	var surArea = getSurroundingArea(playerName, searchHalfSize);
	$.each(surArea, function( key, value ){
		if(value.hasOwnProperty("item") && value["item"].hasOwnProperty(itemName)){
			matches[index] = value;
			index++;
		}
	});
	return matches;
}

function lookForType(playerName, type, searchHalfSize){
	var matches = [];
	var index = 0;
	var surArea = getSurroundingArea(playerName, searchHalfSize);
	$.each(surArea, function( key, value ){
		if(value.hasOwnProperty("item")){
			for(b = 0; b < bait.length; b++){
				if(value["item"].hasOwnProperty(bait[b])){
					matches[index] = value;
					index++;
				}
			}
		}
	});
	return matches;
}

function closestTile(playerName, tiles){
	if(playerExists(playerName)){
		var player = getPlayer(playerName);
		var leastDistance = Number.MAX_SAFE_INTEGER;
		var tile;
		for(t = 0; t < tiles.length; t++){
			var dist = heuristicPF(player["x"], player["y"], tiles[t]["x"], tiles[t]["y"]);
			//console.log(dist);
			if(dist < leastDistance){
				leastDistance = dist;
				tile = tiles[t];
			}
		}
		return tile;
	}
}

function appendPathfind(playerName, x, y){
	if(playerExists(playerName)){
		var player = getPlayer(playerName);
		if(player.hasOwnProperty("pathfind")){
			var pastPath = player["pathfind"]["path"];
			var pastStep = player["pathfind"]["step"];
			//console.log("P " + pastStep);
			//console.log(pastPath);
			
			var newPath = pathfind(pastPath[0]["x"], pastPath[0]["y"], x, y);
			var newStep = newPath.length;
			if(newPath != undefined){
				for(p = 1; p < pastPath.length; p++){
					newPath[newStep+p-1] = pastPath[p];
				}
				newStep += pastStep-1;
			}
			player["pathfind"]["path"] = newPath;
			player["pathfind"]["step"] = newStep;
			//console.log("N " + newStep);
			//console.log(newPath);
		}
		else {
			moveToLoc(playerName, x, y);
		}
		
		
		//log("Appended");
	}
}

function moveToLoc(playerName, x, y){
	if(playerExists(playerName)){
		var player = getPlayer(playerName);
		if(!player.hasOwnProperty("pathfind")){
			var path = pathfind(player["x"], player["y"], x, y);
			if(path != undefined){
				if(settings["pathfinding"])
					log(boldWord(playerName) + " is going to " + x + ", " + y);
				//console.log("pathfinding to " + x + ", " + y);
				player["pathfind"] = {};
				player["pathfind"]["path"] = path;
				player["pathfind"]["step"] = path.length-2;
			}
		}
		else pathfindStep(playerName);
	}
}

function pathfindStep(playerName){
	if(playerExists(playerName)){
		var player = getPlayer(playerName);
		if(player.hasOwnProperty("pathfind")){
			var path = player["pathfind"]["path"];
			var step = player["pathfind"]["step"];
			//console.log(player["x"] + ", " + player["y"] + " | " + (player["pathfind"]["path"][step]["x"]-player["x"]) + ", " + (player["pathfind"]["path"][step]["y"]-player["y"]));
			movePlayer(player["x"], player["y"], player["pathfind"]["path"][step]["x"]-player["x"], player["pathfind"]["path"][step]["y"]-player["y"]);
			player["pathfind"]["step"]--;
			
			if(player["pathfind"]["step"] < 0){
				delete player["pathfind"];
			}
		}
	}
}

function pathfind(startX, startY, goalX, goalY){
	var frontier = {};
	frontier[0] = {"x":startX, "y":startY};
	var cameFrom = {};
	setItemInPFObj(cameFrom, startX, startY, undefined);
	var costSoFar = {};
	setItemInPFObj(costSoFar, startX, startY, 0);
	
	var goal = {"x": goalX, "y": goalY};
	
	var index = 0;
	var step = 0;
	var stop = false; //break
	while(!stop && Object.keys(frontier).length > 0 && step < Object.keys(frontier).length){
	   var current = frontier[step];

	   if(current["x"] == goal["x"] && current["y"] == goal["y"]){
		   stop = true;
		   //console.log("stop");
	   }
	  
		//$('#mapBox table tr').eq(current["y"]).find('td').eq(current["x"]).css("background-color", "white");
	   
	   //console.log("current: " + current["x"] + ", " + current["y"] + " | goal: " + goal["x"] + ", " + goal["y"]);
	   
	   if(!stop){
		   $.each( getNeighbors(current["x"], current["y"]), function ( value, key ) {
			   newCost = getItemInPFObj(costSoFar, current["x"], current["y"]) + 1; //all tiles are weighted the same pretty much
			   if(!itemExistsInPFObj(costSoFar, key["x"], key["y"]) || newCost < getItemInPFObj(costSoFar, key["x"], key["y"])){
				   index++;
				   setItemInPFObj(costSoFar, key["x"], key["y"], newCost);
				   priority = newCost + heuristicPF(key["x"], key["y"], goal["x"], goal["y"]);
				   frontier[index] = {"x":key["x"], "y":key["y"]};
				   setItemInPFObj(cameFrom, key["x"], key["y"], current);
				   //$('#mapBox table tr').eq(key["y"]).find('td').eq(key["x"]).css("background-color", "blue");
				   //console.log("	neighbor: " + key["x"] + ", " + key["y"]);
			   }
		   });
		   step++;
	   }
	   
	   // for next in graph.neighbors(current):
		  // new_cost = cost_so_far[current] + graph.cost(current, next)
		  // if next not in cost_so_far or new_cost < cost_so_far[next]:
			 // cost_so_far[next] = new_cost
			 // priority = new_cost + heuristic(goal, next)
			 // frontier.put(next, priority)
			 // came_from[next] = current
	}
	
	return tracebackPF(cameFrom, goal);
}

function tracebackPF(cameFrom, goal){
	var path = [];
	tracebackRecursiveStore(cameFrom, goal["x"], goal["y"], path, 0);
	//console.log(path);
	if(path.length <= 1)
		return undefined;
	
	return path;
}

function tracebackRecursive(cameFrom, x, y){
	drawTile(x, y);
	$('#mapBox table tr').eq(y).find('td').eq(x).css("background-color", "white");
	if(getItemInPFObj(cameFrom, x, y) != undefined)
		tracebackRecursive(cameFrom, getItemInPFObj(cameFrom, x, y)["x"], getItemInPFObj(cameFrom, x, y)["y"]);
}

function tracebackRecursiveStore(cameFrom, x, y, storeObj, index){
	drawTile(x, y);
	storeObj[index] = {"x":x, "y":y};
	//$('#mapBox table tr').eq(y).find('td').eq(x).css("background-color", "white");
	if(getItemInPFObj(cameFrom, x, y) != undefined)
		tracebackRecursiveStore(cameFrom, getItemInPFObj(cameFrom, x, y)["x"], getItemInPFObj(cameFrom, x, y)["y"], storeObj, index+1);
}

function heuristicPF(x1, y1, x2, y2){
	return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function getNeighbors(x, y){
	var index = 0;
	var neighbors = {};
	
	if(x-1 >= 0 && x-1 < mapSizeX && y >= 0 && y < mapSizeY && map[x-1][y]["terrain"]["type"] !== "pond"){
		neighbors[index] = map[x-1][y];
		index++;
	}
	if(x >= 0 && x < mapSizeX && y-1 >= 0 && y-1 < mapSizeY && map[x][y-1]["terrain"]["type"] !== "pond"){
		neighbors[index] = map[x][y-1];
		index++;
	}
	if(x+1 >= 0 && x+1 < mapSizeX && y >= 0 && y < mapSizeY && map[x+1][y]["terrain"]["type"] !== "pond"){
		neighbors[index] = map[x+1][y];
		index++;
	}
	if(x >= 0 && x < mapSizeX && y+1 >= 0 && y+1 < mapSizeY && map[x][y+1]["terrain"]["type"] !== "pond"){
		neighbors[index] = map[x][y+1];
		index++;
	}
	
	return neighbors;
}

function setItemInPFObj(obj, x, y, val){ //item here doesn't refer to a game item, rather an item used to store the tiles being accessed by the pathfinding algorithm
	if(!obj.hasOwnProperty(x))
		obj[x] = {};
	obj[x][y] = val;
}

function delItemInPFObj(obj, x, y){ //ditto
	if(obj.hasOwnProperty(x) && obj[x].hasOwnProperty(y))
		delete obj[x][y];
}

function getItemInPFObj(obj, x, y){ //ditto
	if(obj.hasOwnProperty(x) && obj[x].hasOwnProperty(y))
		return obj[x][y];
	else return undefined;
}

function itemExistsInPFObj(obj, x, y){ //ditto
	if(getItemInPFObj(obj, x, y) == undefined)
		return false;
	else return true;
}

function build(playerName, itemName, x, y){
	if(playerExists(playerName)){
		var player = getPlayer(playerName);
		
		if(player["inventory"].hasOwnProperty(itemName)){
			placeBuildInWorld(playerName, itemName, x, y);
		}
		else if(getCraftables(playerName).hasOwnProperty(itemName)){
			craft(playerName, itemName, false);
			placeBuildInWorld(playerName, itemName, x, y);
		}
	}
}

function placeBuildInWorld(playerName, itemName, x, y){
	if(!map[x][y]["terrain"].hasOwnProperty("build")){
		map[x][y]["terrain"]["build"] = {};
		map[x][y]["terrain"]["build"][itemName] = JSON.parse(JSON.stringify(itemList[itemName]));
		consumeItem(playerName, itemName);
		log(boldWord(playerName) + " built a " + itemName + ".");
	} else {
		log(boldWord(playerName) + " tried to build " + getAOrAn(itemName) + ", but there was no space.");
	}
}

function combat(combatantA, combatantB){ //pass in player object
	autoEquip(combatantA["name"], "combat");
	autoEquip(combatantB["name"], "combat");
	var firstHitter;
	var secondHitter;
	if(combatantA["speed"] > combatantB["speed"]){
		firstHitter = combatantA;
		secondHitter = combatantB;
	}
	else {
		firstHitter = combatantB;
		secondHitter = combatantA;
	}
	var nameFH = firstHitter["name"];
	var nameSH = secondHitter["name"];
	
	var activeItemFHName;
	if(playerHasActiveItem(nameFH))
		activeItemFHName = getActiveItemName(nameFH);
	else activeItemFHName = "their bare hands";
	var activeItemSHName;
	if(playerHasActiveItem(nameSH))
		activeItemSHName = getActiveItemName(nameSH);
	else activeItemSHName = "their bare hands";
	
	var attacksPerTurnFH;
	var attacksPerTurnSH;
	if(playerHasActiveItem(nameFH) && getActiveItemData(nameFH)["type"] === "weapon"){
		attacksPerTurnFH = Math.floor(firstHitter["speed"] * getActiveItemData(nameFH)["speed"]);
	}
	else attacksPerTurnFH = 1;
	if(playerHasActiveItem(nameSH) && getActiveItemData(nameSH)["type"] === "weapon"){
		attacksPerTurnSH = Math.floor(secondHitter["speed"] * getActiveItemData(nameSH)["speed"]);
	}
	else attacksPerTurnSH = 1;
	
	//log(nameFH + " attacks first.");
	//log(nameFH + " attacks " + attacksPerTurnFH + " times.");
	//log(nameSH + " attacks " + attacksPerTurnSH + " times.");
	var max = Math.max(attacksPerTurnFH, attacksPerTurnSH);
	var dmgByFH = 0;
	var dmgBySH = 0;
	var died = false;
	var deathInfo;
	for(a = 0; a < max && !died; a++){
		if(a % 2 == 0 && firstHitter){ //alternating which combatant gets the first hit (in the code)
			if(a < attacksPerTurnFH){
				var info = combatAttack(firstHitter, secondHitter);
				dmgByFH += info["dmg"];
				died = info["died"];
				deathInfo = info["deathInfo"];
			}
			if(a < attacksPerTurnSH && !died){
				var info = combatAttack(secondHitter, firstHitter);
				dmgBySH += info["dmg"];
				died = info["died"];
				deathInfo = info["deathInfo"];
			}
		}
		else {
			if(a < attacksPerTurnSH){
				var info = combatAttack(secondHitter, firstHitter);
				dmgBySH += info["dmg"];
				died = info["died"];
				deathInfo = info["deathInfo"];
			}
			if(a < attacksPerTurnFH && !died){
				var info = combatAttack(firstHitter, secondHitter);
				dmgByFH += info["dmg"];
				died = info["died"];
				deathInfo = info["deathInfo"];
			}
		}
	}
	
	
	if(settings["combatDamage"]){
	if(dmgByFH > 0)
		log(nameFH + " attacked " + nameSH + " with a " + activeItemFHName + " for " + round(dmgByFH, 2) + " damage.");
	else log(nameFH + " tried to attack " + nameSH + " but missed.");
	if(dmgBySH > 0)
		log(nameSH + " attacked " + nameFH + " with a " + activeItemSHName + " for " + round(dmgBySH, 2) + " damage.");
	else log(nameSH + " tried to attack " + nameFH + " but missed.");
	}
	
	if(died){
		deathMessages(deathInfo);
		if(settings["leveling"] && settings["levelingPlayers"])
			log(boldWord(deathInfo["killerName"]) + " gained " + underlineWord(deathInfo["exp"]) + " exp.");
	}
}

function combatAttack(combatantA, combatantB){
	//console.log(combatantA);
	var seedA = Math.random();
	var seedB = Math.random();
	var nameA = combatantA["name"];
	var nameB = combatantB["name"];
	//log(nameA + " and " + nameB + " are fighting.")
	
	// if(playerHasActiveItem(nameA)){
		// //log(nameA + " is wielding a " + getActiveItemID(nameA));
	// }
	// //else log(nameA + " is unarmed.");
	// if(playerHasActiveItem(nameB)){
		// //log(nameB + " is wielding a " + getActiveItemID(nameB));
	// }
	// //else log(nameB + " is unarmed.");
	
	var activeItemA = getActiveItemData(nameA);
	var activeItemNameA = getActiveItemName(nameA);
	var activeItemB = getActiveItemData(nameB);
	var activeItemNameB = getActiveItemName(nameB);
	if(seedA < combatantA["accuracy"]){
		var dmgA;
		if(playerHasActiveItem(nameA) && activeItemA["type"] === "weapon"){
			dmgA = round((activeItemA["atk"] + (Math.random() * activeItemA["atkR"] - 0.5 * activeItemA["atkR"])) * combatantA["strength"], 2); 
			activeItemGainExp(nameA, dmgA);

			//log(nameA + " attacked " + nameB + " with a " + getActiveItemID(nameA) + " for " + round(dmgA, 2) + " damage.");
		}
		else {
			dmgA = 0.5;
		}
		
		var died = changeHealth(combatantB, -dmgA);
		var exp = 0;
		if(died){
			var exp = combatantB["level"]["curLevel"] * 3
			gainExp(nameA, combatantB["level"]["curLevel"] * 3);
		}
		combatantB["health"] = round(combatantB["health"], 2);
		var infoToReturn = {"dmg":dmgA, "died":died, "deathInfo":{"type":"combat", "name":nameB,"killerName":nameA,"weapon":activeItemNameA, "exp":exp}};
		if(infoToReturn["deathInfo"]["weapon"] == undefined)
			infoToReturn["deathInfo"]["weapon"] = "their bare fists";
		return infoToReturn;
	}
	else {
		//log(nameA + " tried to attack " + nameB + " but missed.");
		return 0;
	}
	// if(seedB < combatantB["accuracy"]){
		// if(activeItemB["type"] === "weapon"){
			// var dmgB = activeItemB["atk"] + (Math.random() * activeItemB["atkR"] - 0.5 * activeItemB["atkR"]);
			// changeHealth(combatantA, -dmgB);
			// log(nameB + " attacked " + nameA + " with a " + getActiveItemID(nameB) + " for " + round(dmgB, 2) + " damage.");
		// }
	// }
	// else {
		// log(nameB + " tried to attack " + nameA + " but missed.");
	// }
}

function autoEquip(playerName, purpose){
	if(playerExists(playerName)){
		var player = getPlayer(playerName);
		if(purpose === "combat" && player["typeList"].hasOwnProperty("weapon")){
			var stop = false;
			var bestYet = 0;
			var id = "";
			$.each( player["typeList"]["weapon"], function( key, value ) {
				if(value[Object.keys(value)[0]]["atk"] * value[Object.keys(value)[0]]["speed"] > bestYet){
					bestYet = value[Object.keys(value)[0]]["atk"] * value[Object.keys(value)[0]]["speed"];
					id = key;
					//console.log(key + " | " + bestYet);
				}
			});
			
			//console.log(id + " | " + bestYet);
			if(bestYet > 0 && !player["activeItem"].hasOwnProperty(id))
				equipUniqueItem(playerName, id);
		}
	}
}

function changeHealth(player, change){ //returns true if player has died from this change (useful for displaying death messages)
	player["health"] += change;
	if(player["health"] > healthMax)
		player["health"] = healthMax;
	if(player["health"] <= 0){
		playerDied(player["name"]);
		return true;
	}
	else return false;
}

function playerDied(playerName){
	//console.log(players);
	var pos = getPlayerLoc(playerName);
	map[pos["x"]][pos["y"]]["item"] = getPlayer(playerName)["inventory"];
	if(playerHasActiveItem(playerName))
		map[pos["x"]][pos["y"]]["uniqueItem"][getActiveItemID(playerName)] = getActiveItem(playerName);
	delete map[pos["x"]][pos["y"]]["player"];
	delete players[playerName];
	drawTile(pos["x"], pos["y"]);
	//log(playerName + " has died at " + pos["x"] + ", " + pos["y"] + ".");
}

function deathMessages(deathInfo){
	if(deathInfo["type"] === "combat"){
		log(boldWord(deathInfo["name"]) + " was killed by " + boldWord(deathInfo["killerName"]) + " with " + getAOrAn(deathInfo["weapon"]) + " " + italicWord(deathInfo["weapon"]) + ".");
	}
}

var statLevelBoosts = {"strength": 1.2, "speed": 1.2, "health":1.5};
function gainExp(playerName, exp){
	var player = getPlayer(playerName);
	player["level"]["curExp"] += exp;
	if(player["level"]["curExp"] > player["level"]["expForNext"]){
		player["level"]["curLevel"]++;
		player["level"]["curExp"] -= player["level"]["expForNext"];
		player["level"]["expForNext"] += 5;
		
		$.each(statLevelBoosts, function( key, value ) {
			player[key] *= value;
		});
		
		if(settings["leveling"] && settings["levelingPlayers"]){
			if(settings["levelUpStats"])
				log(boldWord(playerName) + " leveled up! New stats: St: " + player["strength"] + ", Sp: " + player["speed"] + ", H: " + player["health"]);	
			else {log(boldWord(playerName) + " leveled up!")};
		}
	}
}

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
} //@jacklmoore

function playerHasActiveItem(playerName){
	var player = getPlayer(playerName);
	return Object.keys(player["activeItem"]).length != 0;
}

function getActiveItem(playerName){ //returns whole item from [ID] onwards as {name:{~item data~}}
	var player = getPlayer(playerName);
	if(playerHasActiveItem(playerName))
		return player["activeItem"][Object.keys(player["activeItem"])[0]];
	else return undefined;
}

function getActiveItemID(playerName){
	var player = getPlayer(playerName);
	if(playerHasActiveItem(playerName)){
		return Object.keys(player["activeItem"])[0];
	}
	else return undefined;
}

function getActiveItemName(playerName){ //returns name from [activeItem][ID][name]
	if(playerHasActiveItem(playerName))
		return Object.keys(getActiveItem(playerName))[0];
	else return undefined;
}

function getActiveItemData(playerName){ //data from [activeItem][ID][name] onwards
	if(playerHasActiveItem(playerName))
		return getActiveItem(playerName)[getActiveItemName(playerName)];
	return undefined;
}

function getAOrAn(itemName, capsBool){
	if(vowelFirst(itemName) && capsBool)
		return "An";
	else if(vowelFirst(itemName) && !capsBool)
		return "an";
	else if(!vowelFirst(itemName) && capsBool)
		return "A";
	else if(!vowelFirst(itemName) && !capsBool)
		return "a";
	
}

function getPlayer(playerName){
	if(playerExists(playerName)){
		var pos = getPlayerLoc(playerName);
		//console.log(map[pos["x"]][pos["y"]]["player"]);
		return map[pos["x"]][pos["y"]]["player"];
	} else return undefined;
}

function getPlayerTerrain(playerName){
	var pos = getPlayerLoc(playerName);
	return map[pos[x]][pos[y]]["terrain"]["type"];
}

function genRandomItems(){
	for(i = 0; i < (mapSizeX * mapSizeY / Math.pow(50, 2)) * numItemsToGenPerArea; i++){
		var seed = Math.random();
		var lastBound = 0;
		$.each(itemsToGen, function( key, value ) {
				if(seed >= lastBound && seed < value + lastBound){
					var x = Math.floor(Math.random()*mapSizeX);
					var y = Math.floor(Math.random()*mapSizeY);
					while(map[x][y]["terrain"]["type"] === "pond" || map[x][y]["terrain"]["type"] === "river"){
						x = Math.floor(Math.random()*mapSizeX);
						y = Math.floor(Math.random()*mapSizeY);
					}
					if(itemList[key]["type"] === "weapon"){
						//log("Created " + key + " [" + x + ", " + y + "]");
						createUniqueItemInWorld(x, y, key);
					}
					else {
						spawnItemsInWorld(x, y, key);
						//log("Created " + key + " [" + x + ", " + y + "]");
					}
					
					//console.log(key + " " + lastBound + "-" + (value + lastBound));
				}
				lastBound = value + lastBound;
		});
	}
}

function spawnItemsInWorld(x, y, itemName){
	var q;

	if(itemList[itemName].hasOwnProperty("minQ") && itemList[itemName].hasOwnProperty("maxQ")){
		q = Math.floor(Math.random() * (itemList[itemName]["maxQ"] - itemList[itemName]["minQ"] + 1)) +  itemList[itemName]["minQ"];
	} else q = 1;
	
	if(!map[x][y]["item"].hasOwnProperty(itemName)){
		map[x][y]["item"][itemName] = JSON.parse(JSON.stringify(itemList[itemName]));
		map[x][y]["item"][itemName]["quantity"] = q;
	}
	else {
		map[x][y]["item"][itemName]["quantity"] += q;
	}

	
	// if(vowelFirst(itemName))
		// log("An " + itemName + " has appeared.");
	// else(vowelFirst(itemName))
		// log("A " + itemName + " has appeared.");
	drawTile(x, y);
}

function spawnItemsToPlayer(playerName, itemName){
	if(playerExists(playerName)){
		var player = getPlayer(playerName);
		if(player["inventory"].hasOwnProperty(itemName)){
			player["inventory"][itemName]["quantity"]++;
		}
		else {
			player["inventory"][itemName] = JSON.parse(JSON.stringify(itemList[itemName]));
			player["inventory"][itemName]["quantity"] = 1;
		}
		
		if(!player["typeList"].hasOwnProperty(itemList[itemName]["type"]))
			player["typeList"][itemList[itemName]["type"]] = {};
		player["typeList"][itemList[itemName]["type"]][itemName] = player["inventory"][itemName];
	}
}

function getPlayerLoc(playerName){
	if(playerExists(playerName))
		return {"x":players[playerName]["x"], "y":players[playerName]["y"]};
	else return undefined;
}

function log(message){
	$("#consoleBox .inner").append("<p>" + message + "</p>");
	$('#consoleBox').stop().animate({
	  scrollTop: $('#consoleBox')[0].scrollHeight
	}, 800);
}

function interactWithTile(x, y){
	if(map[x][y].hasOwnProperty("item")){
		$.each( map[x][y]["item"], function( key, value ) {
		if(key === "broken glass"){
			delete map[x][y]["item"][key];
			//TODO HEALTH
			if(settings["itemAcquisition"]){
				//og(map[x][y]["player"]["name"] + " stepped on broken glass and suffered minor injuries.")
			}
		}
		else {
			if(map[x][y]["player"]["inventory"].hasOwnProperty(key)){
				//log("QB: " + value["quantity"]);
				map[x][y]["player"]["inventory"][key]["quantity"] += value["quantity"];
				//log("QA: " + value["quantity"]);				
			}
			else{
				map[x][y]["player"]["inventory"][key] = JSON.parse(JSON.stringify(value));
			}
			
			if(!map[x][y]["player"]["typeList"].hasOwnProperty(value["type"]))
				map[x][y]["player"]["typeList"][value["type"]] = {};
			map[x][y]["player"]["typeList"][value["type"]][key] = value;
			
			delete map[x][y]["item"][key];
			
			if(settings["itemAcquisition"]){
				//console.log(settings["weaponAcquisition"] + ", " + value["type"]);
				if(value["type"] === "weapon"){
					if(settings["weaponAcquisition"])
						log(boldWord(map[x][y]["player"]["name"]) + " picked up " + getAOrAn(key) + " " + italicWord(key) + ".");
				}
				else if(value["type"] === "food"){
					if(settings["foodAcquisition"])
						log(boldWord(map[x][y]["player"]["name"]) + " picked up " + getAOrAn(key) + " " + italicWord(key) + ".");
				}
				else {} //log(map[x][y]["player"]["name"] + " picked up " + getAOrAn(key) + " " + key);
			}
		}
		});
	}
	if(map[x][y].hasOwnProperty("uniqueItem")){
		$.each( map[x][y]["uniqueItem"], function( id, itemObj ) {
			var itemName = Object.keys(itemObj)[0];
			var itemData = itemObj[itemName];
			
			
			if(map[x][y]["player"]["uniqueInventory"].hasOwnProperty(id)){
				map[x][y]["player"]["uniqueInventory"][id]["quantity"] += itemData["quantity"];			
			}
			else{
				map[x][y]["player"]["uniqueInventory"][id] = JSON.parse(JSON.stringify(itemObj));
			}
			
			if(!map[x][y]["player"]["typeList"].hasOwnProperty(itemData["type"]))
				map[x][y]["player"]["typeList"][itemData["type"]] = {};
			map[x][y]["player"]["typeList"][itemData["type"]][id] = itemObj;
			
			delete map[x][y]["uniqueItem"][id];
			
			gainExp(map[x][y]["player"]["name"], 1);
			
			if(settings["itemAcquisition"]){
				if(itemData["type"] === "weapon"){
					if(settings["weaponAcquisition"])
						log(boldWord(map[x][y]["player"]["name"]) + " picked up " + getAOrAn(itemName) + " " + italicWord(itemName) + " and gained " + underlineWord("1") + " exp.");
				}
				else {}
			}
		});
	}
}

function vowelFirst(word){
	if(word.substring(0,1) === 'a' || word.substring(0,1) === 'e' && word.substring(0,1) === 'i' && word.substring(0,1) === 'o' && word.substring(0,1) === 'u' ){
		return true;
	}
	return false;
}

function createMapTable(x, y){
		$("#mapBox").append("<table></table>");
		$("table").css("height", "100%");
		$("table").css("width", "100%");
		var temp = "";
		for(i = 0; i < y; i++){
			temp += "<tr>";
			for(j = 0; j < x; j++){
				temp += "<td></td>";
			}
			temp += "</tr>";
		}
		$("table").append(temp);
		
		$("td").css("width", (100 / x) + "%");
		$("tr").css("height", $("td").css("width"));
		
	}
	
var terrainTypes = {"forest":"", "denseForest":"", "field":""};
function createTerrain(sizeX, sizeY){
	for(x = 0; x < sizeX; x++){
		for(y = 0; y < sizeY; y++){
			if(x == 0 && y == 0){
				map[x][y]["terrain"]["type"] = Object.keys(terrainTypes)[Math.floor(Math.random() * Object.keys(terrainTypes).length)];
			}
			else {
				//console.log("Gen " + x + ", " + y);
				var surroundings = terrainTypes;
				$.each( surroundings, function( key, value ) {
					surroundings[key] = 0;
				});
				
				if(map[x+1] != undefined){
					if(map[x+1][y]["terrain"]["type"] != undefined){
						surroundings[map[x+1][y]["terrain"]["type"]]++;
					}
					//console.log("right " + map[x+1][y]["terrain"]["type"]);
				}
				
				if(map[x-1] != undefined){
					if(map[x-1][y]["terrain"]["type"] != undefined){
						surroundings[map[x-1][y]["terrain"]["type"]]++;
					}
					//console.log("left " + map[x-1][y]["terrain"]["type"]);
				}
				
				if(map[x][y+1] != undefined){
					if(map[x][y+1]["terrain"]["type"] != undefined){
						surroundings[map[x][y+1]["terrain"]["type"]]++;
					}
					//console.log("down " + map[x][y+1]["terrain"]["type"]);
				}

				if(map[x][y-1] != undefined){
					if(map[x][y-1]["terrain"]["type"] != undefined){
						surroundings[map[x][y-1]["terrain"]["type"]]++;
					}
					//console.log("up " + map[x][y-1]["terrain"]["type"]);
				}
				
				var randomBounds = {};
				var lastBound = 0;
				var total = 0;
				$.each( surroundings, function( key, value ) {
					  total += value;
				  //console.log(key + ": " + value);
				});
				//console.log("total: " + total);
				
				$.each( surroundings, function( key, value ) {
				  if(key != "undefined"){
					  randomBounds[key] = .9 * (value / (total)) + lastBound;
					  lastBound = randomBounds[key];
				  }
				});
				
				//console.log(randomBounds);
				var seed = Math.random();
				//console.log(seed);
				lastBound = 0;
				var stop = false;
				$.each( randomBounds, function( key, value ) {
				  if(seed >= lastBound && seed < value && !stop){
					  map[x][y]["terrain"]["type"] = key;
					  //console.log("Type at " + x + ", " + y + ": " + key + "[" + lastBound + "-" + value + "]");
					  stop = true;
				  }
				});
				
				if(map[x][y]["terrain"]["type"] == undefined){
					map[x][y]["terrain"]["type"] = Object.keys(terrainTypes)[Math.floor(Math.random() * Object.keys(terrainTypes).length)];
					//console.log("Random type " + Math.floor(Math.random() * Object.keys(terrainTypes).length));
				}
			}
			//console.log(map[x][y]["terrain"]["type"]);
			map[x][y]["x"] = x;
			map[x][y]["y"] = y;
			drawTile(x, y);
		}
	}
	
	var areaPerPond = (Math.floor(Math.random()*100)+100);
	for(p = 0; p < mapSizeX * mapSizeY / areaPerPond; p++){
		genPondInit();
	}
	genRandomItems();
}

function genRiverInit(x, y){
	
}

function genRiver(x, y){
	if(map[x][y]["terrain"]["type"] !== "pond" || map[x][y]["terrain"]["type"] !== "river"){
		
	}
}

function genPondInit(){
	var x = Math.floor(Math.random() * (mapSizeX));
	var y = Math.floor(Math.random() * (mapSizeY));
	//console.log(x + " | " + y)
	createPondTile(x, y);
	var seed = Math.random();
	var chance = 1;
	var decrement = {0.1: 0.1, 0.15: 0.2, 0.2: 0.5, 0.25: 0.9, 0.3: 1};
	var lastBound = 0;
	//console.log(Object.keys(decrement));
	var stop = false;
	for(r = 0; r < Object.keys(decrement).length && !stop; r++){
		if(seed >= lastBound && seed < decrement[Object.keys(decrement)[r]]){
			decrement = Object.keys(decrement)[r];
			stop = true;
		}
	}
	//console.log("dec: " + decrement);

	//console.log(x + ", " + y + " | " + chance);
	if(seed < chance && map[x+1] != undefined){
		genPond(x+1, y, chance-decrement, decrement);
	}
	
	//seed = Math.random();
	if(seed < chance && map[x-1] != undefined){
		genPond(x-1, y, chance-decrement, decrement);
	}
	
	//seed = Math.random();
	if(seed < chance && map[x][y+1] != undefined){
		genPond(x, y+1, chance-decrement, decrement);
	}
	
	//seed = Math.random();
	if(seed < chance && map[x][y-1] != undefined){
		genPond(x, y-1, chance-decrement, decrement);
	}
	
	drawTile(x, y);
}

function genPondInitLoc(x, y){
	createPondTile(x, y);
	var seed = Math.random();
	var chance = 1;
	var decrement = {0.1: 0.1, 0.15: 0.2, 0.2: 0.5, 0.25: 0.9, 0.3: 1};
	var lastBound = 0;
	//console.log(Object.keys(decrement));
	var stop = false;
	for(r = 0; r < Object.keys(decrement).length && !stop; r++){
		if(seed >= lastBound && seed < decrement[Object.keys(decrement)[r]]){
			decrement = Object.keys(decrement)[r];
			stop = true;
		}
	}
	//console.log("dec: " + decrement);

	//console.log(x + ", " + y + " | " + chance);
	if(seed < chance && map[x+1] != undefined){
		genPond(x+1, y, chance-decrement, decrement);
	}
	
	//seed = Math.random();
	if(seed < chance && map[x-1] != undefined){
		genPond(x-1, y, chance-decrement, decrement);
	}
	
	//seed = Math.random();
	if(seed < chance && map[x][y+1] != undefined){
		genPond(x, y+1, chance-decrement, decrement);
	}
	
	//seed = Math.random();
	if(seed < chance && map[x][y-1] != undefined){
		genPond(x, y-1, chance-decrement, decrement);
	}
	
	drawTile(x, y);
}

function genPond(x, y, chance, decrement){
	createPondTile(x, y);
	var seed = Math.random();
	//console.log(x + ", " + y + " | " + chance);
	if(seed < chance && map[x+1] != undefined){
		genPond(x+1, y, chance-decrement, decrement);
	}
	
	//seed = Math.random();
	if(seed < chance && map[x-1] != undefined){
		genPond(x-1, y, chance-decrement, decrement);
	}
	
	//seed = Math.random();
	if(seed < chance && map[x][y+1] != undefined){
		genPond(x, y+1, chance-decrement, decrement);
	}
	
	//seed = Math.random();
	if(seed < chance && map[x][y-1] != undefined){
		genPond(x, y-1, chance-decrement, decrement);
	}
	
	drawTile(x, y);
}

function createPondTile(x, y){
	map[x][y]["terrain"]["type"] = "pond";
	map[x][y]["terrain"]["fishCatchChance"] = Math.random() * 0.75 + 0.25;
}

function playerExists(playerName){
	if(players.hasOwnProperty(playerName))
		return true;
	else return false;
}

function perTurnCode(playerName){
	if(playerExists(playerName)){
		var player = getPlayer(playerName);
		if(player["satiation"] <= 0){
			//console.log("starve");
			if(changeHealth(player, -5)){
				log(boldWord(playerName) + " has starved to death.");
			}
		}
		else if(player["satiation"] > 0 && player["satiation"] < satiationMax){
			changeHealth(player, 0.25);
		}
		else if(player["satiation"] > satiationMax){
			changeHealth(player, 0.5);
		}
	}
}

function action(playerName){ //has the player perform an "intelligient" action
	if(playerExists(playerName)){
		randomPlayerAction(playerName, checkActions(playerName));
	}	
}

function actionAll(){
	var allPlayerAllActions = {};
	var allPlayerHPA = {};
	$.each(players, function( key, value ) {
		allPlayerAllActions[value["name"]] = checkActions(value["name"]);
		allPlayerHPA[value["name"]] = getHPA(allPlayerAllActions[value["name"]]);
	});
	console.log(allPlayerHPA);
	
	var toRemove = {};
	$.each(allPlayerHPA, function( key, value ) {
		if(!toRemove.hasOwnProperty(key)){
			if(value["action"] === "combat" && allPlayerHPA[value["foe"]["name"]]["action"] === "combat" && allPlayerHPA[value["foe"]["name"]]["foe"]["name"] === key){
				toRemove[value["foe"]["name"]] = value["foe"]["name"];
				//console.log("yes");
			}
		}
	});
	//console.log(toRemove);
	
	$.each(toRemove, function( key, value ) {
		delete allPlayerHPA[value];
	});
	//console.log(allPlayerHPA);
	
	$.each(allPlayerHPA, function( key, value ) {
		if(players.hasOwnProperty(key))
			randomPlayerAction(key, allPlayerAllActions[key]);
	});
	
	
	if(Object.keys(players).length < playersRemaining && Object.keys(players).length == 1){ //checks for WINNER
		log(boldWord(Object.keys(players)[0]) + " is the only person left alive in the Woods.");
	}
	playersRemaining = Object.keys(players).length;
}

var curTurn = 0;
var maxTurn;
function simulateAndUpdate(turns){
	curTurn = 0;
	maxTurn = turns;
}

window.setInterval(function(){
  if(curTurn < maxTurn){
	  actionAll();
	  curTurn++;
  }
}, 10);

function changeSatiation(playerName, points){
	var player = getPlayer(playerName);
	if(player["satiation"] > 0 && player["satiation"] + points <= 0){
		if(settings["foodConsumption"])
			log(boldWord(playerName) + " is starving.")
	}
	else if(player["satiation"] < satiationMax && player["satiation"] + points >= satiationMax){
		if(settings["foodConsumption"])
			log(boldWord(playerName) + " is full.")
	}
	player["satiation"] += points;
}
	
function movePlayer(x, y, dX, dY){
	if(map[x][y].hasOwnProperty("player")){
		//console.log("change " + dX + ", " + dY);
		var newX = x + dX;
		var newY = y + dY;
		if(newX >= 0 && newX < mapSizeX && newY >= 0 && newY < mapSizeY &&
																map[newX][newY]["terrain"]["type"] != "pond" && map[newX][newY]["terrain"]["type"] != "river" &&
																!map[newX][newY].hasOwnProperty("player")){
			map[newX][newY]["player"] = map[x][y]["player"];
			delete map[x][y]["player"];
			undisplayPlayer(x, y);
			displayPlayer(newX, newY);
					
			map[newX][newY]["player"]["x"] = newX;
			map[newX][newY]["player"]["y"] = newY;
			interactWithTile(newX, newY);
			changeSatiation(map[newX][newY]["player"]["name"], -1);
		}
	}
}

function getHPA(actions){ //highest priority action
	var highestPriorityAction = {"priority": -1};
	$.each(actions, function( key, value ) {
		if(value["priority"] > highestPriorityAction["priority"]){
			highestPriorityAction = value;
			highestPriorityAction["action"] = key;
		}
		else if(value["priority"] == highestPriorityAction["priority"]){
			if(Math.random() < 0.5){
				highestPriorityAction = value;
				highestPriorityAction["action"] = key;
			}
		}
	});
	return highestPriorityAction;
}

function randomPlayerAction(playerName, actions){ //choose what a given player should do from a set of actions and their priorities
	var highestPriorityAction = getHPA(actions); //highest priority action
	//console.log("HPA: " + highestPriorityAction["action"]);
	
	var x = getPlayerLoc(playerName)["x"];
	var y = getPlayerLoc(playerName)["y"];
	//console.log("loc " + x + ", " + y);
	if(highestPriorityAction["action"] === "moveToItem"){
		movePlayer(x, y, highestPriorityAction["x"] - x, highestPriorityAction["y"] - y);
	}
	else if(highestPriorityAction["action"] === "move"){
		var seed = Math.random();
		if(seed >= 0 && seed < 0.25)
			movePlayer(x, y, 1, 0);
		else if(seed >= 0.25 && seed < 0.5)
			movePlayer(x, y, -1, 0);
		else if(seed >= 0.5 && seed < 0.75)
			movePlayer(x, y, 0, 1);
		else if(seed >= 0.75 && seed < 1)
			movePlayer(x, y, 0, -1);
	}
	else if(highestPriorityAction["action"] === "combat"){
		combat(getPlayer(playerName), highestPriorityAction["foe"]);
	}
	else if(highestPriorityAction["action"] === "eat"){
		eat(playerName);
	}
	else if(highestPriorityAction["action"] === "craft"){
		craft(playerName, highestPriorityAction["item"], settings["crafting"]);
	}
	else if(highestPriorityAction["action"] === "fish"){
		fish(playerName, highestPriorityAction["x"], highestPriorityAction["y"]);
	}
	else if(highestPriorityAction["action"] === "build"){
		build(playerName, highestPriorityAction["name"], highestPriorityAction["x"], highestPriorityAction["y"]);
	}
	else if(highestPriorityAction["action"] === "use build"){
		useBuild(playerName, highestPriorityAction["x"], highestPriorityAction["y"]);
	}
	else if(highestPriorityAction["action"] === "start pathfind"){
		for(p = 0; p < highestPriorityAction["destinations"].length; p++){
			if(p == 0){
				if(!highestPriorityAction["append"])
						moveToLoc(playerName, highestPriorityAction["destinations"][p]["x"], highestPriorityAction["destinations"][p]["y"]);
				else appendPathfind(playerName, highestPriorityAction["destinations"][p]["x"], highestPriorityAction["destinations"][p]["y"]);
			} 
			else { 
				appendPathfind(playerName, highestPriorityAction["destinations"][p]["x"], highestPriorityAction["destinations"][p]["y"]); 
			}
		}
	}
	else if(highestPriorityAction["action"] === "pathfind"){
		pathfindStep(playerName);
	}
	
	perTurnCode(playerName);
}

function checkActions(playerName){ //figures out what possible actions the player has on a given turn, and what their priorities are
	var pos = getPlayerLoc(playerName);
	var player = getPlayer(playerName);
	var surroundings = getSurroundings(playerName);
	var actionList = {"move": {"priority": 1}};
	//console.log(surroundings);
	$.each( surroundings, function( key, value ) { //every action must have a priority. some actions have their own required properties, ex. location
		//console.log(value);
		  if(key !== "here" && Object.keys(value["item"]).length > 0 && (value["terrain"]["type"] !== "pond" || value["terrain"]["type"] !== "river")){
			actionList["moveToItem"] = {"priority": 2, "x":value["x"], "y":value["y"]};
		  }
		  if(value["terrain"]["type"] === "pond" || value["terrain"]["type"] === "river"){ //TODO: implement fishing, dynamically assign priority based on hunger
			if(player["inventory"].hasOwnProperty("fishing rod")){
				if(playerHasBait(playerName)){
					actionList["fish"] = {"priority": 2.5 + Math.random() * -2, "x":value["x"], "y":value["y"]};
				}
				else {
					if(!player.hasOwnProperty("pathfind")){
						var tile = closestTile(playerName, lookForType(playerName, "bait", 5));
						console.log(tile);
						if(tile != undefined){
							if(settings["fishing"])
								log(boldWord(playerName) + " is looking for bait.");
							actionList["start pathfind"] = {"priority": 2.5, "destinations": [{"x":tile["x"], "y":tile["y"]}, {"x":player["x"], "y":player["y"]}], "append": true};
						}
					}
				}
			}
			else if(getCraftables(playerName).hasOwnProperty("fishing rod")){
				actionList["craft"] = {"priority": 2.5, "item":"fishing rod"};
			}
		  }
		  if(player["inventory"].hasOwnProperty("raw fish")){
			  if(value["terrain"].hasOwnProperty("build") && value["terrain"]["build"].hasOwnProperty("campfire")){
				  actionList["use build"] = {"priority": 2.6, "x":value["x"], "y":value["y"]};
			  }
			  else if(lookForBuild(playerName, "campfire").length > 0 && !player.hasOwnProperty("pathfind")){
				  var tile = closestTile(playerName, lookForBuild(playerName, "campfire"), 10);
				  if(tile != undefined)
					actionList["start pathfind"] = {"priority": 2.55, "destinations": [{"x":tile["x"], "y":tile["y"]}], "append": false};
			  }
			  else if(getCraftables(playerName).hasOwnProperty("campfire") && !map[value["x"]][value["y"]]["terrain"] !== "river" && !map[value["x"]][value["y"]]["terrain"] !== "pond"){
				  actionList["build"] = {"priority": 2.4, "name":"campfire", "x":value["x"], "y":value["y"]};
			  }
		  }
		  if(key !== "here" && value.hasOwnProperty("player")) {//make sure it isn't the tile the player is standing on, then check for other players
			actionList["combat"] = {"priority":3, "foe":value["player"]}; 
			//TODO: dynamically assign priority based on various factors, maybe make it so the alternative to fight is always run? both run or combat should always be higher priority than other actions
		  }
		  if(player["typeList"].hasOwnProperty("food") && Object.keys(player["typeList"]["food"]).length > 0){
			  if(player["satiation"] < 10)
				actionList["eat"] = {"priority":4}
			  else if(player["satiation"] > satiationMax)
				actionList["eat"] = {"priority":0 + Math.random() * 1.05} //usually will prefer anything over eating at this point, but small chance to eat
			  else {
				actionList["eat"] = {"priority":1.5 + (Math.random() - 0.5) * 2} //usually will prefer eating over random movement. but priority can range from [0.5 - 2.5]
			  }
		  }
		  if(player.hasOwnProperty("pathfind")){
			  actionList["pathfind"] = {"priority":2.57};
		  }
		});
		
		if((!player["typeList"].hasOwnProperty("food") || Object.keys(player["typeList"]["food"]).length == 0) && player["satiation"] < satiationMax){
			var tile = closestTile(playerName, lookForType(playerName, "food", 3));
			if(tile != undefined && !player.hasOwnProperty("pathfind")){
				//log(boldWord(playerName) + " is looking for food at " + tile["x"] + ", " + tile["y"]);
				actionList["start pathfind"] = {"priority": 2.5, "destinations":[{"x":tile["x"], "y":tile["y"]}], "append":false};
			}
		}
	//console.log(actionList);
	return actionList;
}

function useBuild(playerName, x, y){
	if(playerExists(playerName)){
		var player = getPlayer(playerName);
		if(map[x][y]["terrain"]["build"].hasOwnProperty("campfire") || player["inventory"].hasOwnProperty("raw fish")){
			consumeItem(playerName, "raw fish");
			spawnItemsToPlayer(playerName, "cooked fish");
			if(settings["itemAcquisition"] && settings["fishing"])
				log(boldWord(playerName) + " cooked a " + italicWord("fish"));
		}
	}
}

var bait = ["some bait"];
function fish(playerName, x, y){
	if(playerExists(playerName)){
		var player = getPlayer(playerName);
		if(map[x][y]["terrain"]["type"] === "river" || map[x][y]["terrain"]["type"] === "pond" && playerHasBait(playerName)){
			var seed = Math.random();
			if(seed < map[x][y]["terrain"]["fishCatchChance"]){
				consumeBait(playerName);
				spawnItemsToPlayer(playerName, "raw fish");
				if(settings["fishing"])
					log(boldWord(playerName) + " caught a " + italicWord("fish") + ".");
			} else {
				if(settings["fishing"])
					log(boldWord(playerName) + " failed to catch a fish.");
			}
		}
		else {
			if(settings["fishing"])
				log(boldWord(playerName) + " didn't have any bait.");
		}
	}
}

function consumeBait(playerName){
	for(p = 0; p < bait.length; p++){
		if(getPlayer(playerName)["inventory"].hasOwnProperty(bait[p])){
			consumeItem(playerName, bait[p]);
			if(settings["fishing"])
				log(boldWord(playerName) + " used " + italicWord(bait[p]));
		}
	}
}

function playerHasBait(playerName){
	for(p = 0; p < bait.length; p++){
		if(getPlayer(playerName)["inventory"].hasOwnProperty(bait[p])){
			return true;
		} else return false;
	}
}

function eat(playerName){
	var player = getPlayer(playerName);
	
	//console.log("EAT");
	var edibFoodCount = 1;
	var foodEaten = {};
	while(edibFoodCount > 0 && player["satiation"] < satiationMax){
		var bestFoodPoints = 0;
		var foodName;
		edibFoodCount = -1;
		$.each(player["typeList"]["food"], function( key, value ) {
			if(value["foodPoints"] > bestFoodPoints){
				bestFoodPoints = value["foodPoints"];
				foodName = key;
			}
			if(value["foodPoints"] > 0)
				edibFoodCount += value["quantity"];
		});
		if(bestFoodPoints > 0){
			consumeItem(playerName, foodName);
			changeSatiation(playerName, bestFoodPoints);
			
			if(foodEaten.hasOwnProperty(foodName)){
				foodEaten[foodName]["quantity"]++;
				foodEaten[foodName]["foodPoints"] += bestFoodPoints; 
			}
			else {
				foodEaten[foodName] = {"quantity":1, "foodPoints":bestFoodPoints};
			}
		}
	}
	
	$.each(foodEaten, function( key, value ) {
		if(settings["foodConsumption"])
			log(boldWord(playerName) + " ate " + underlineWord(value["quantity"]) + " " + italicWord(key) + " for " + value["foodPoints"] + " satiation.");
	});
}

function consumeItem(playerName, itemName){
	var player = getPlayer(playerName);
	if(player["inventory"].hasOwnProperty(itemName)){
		player["inventory"][itemName]["quantity"] -= 1;
		if(player["inventory"][itemName]["quantity"] <= 0){
			delete player["typeList"][player["inventory"][itemName]["type"]][itemName];
			//console.log("Consumed " + itemName);
			delete player["inventory"][itemName];
		}
	}
}

function getPlayerName(x, y){
	return map[x][y]["player"]["name"];
}

function getSurroundings(playerName){
	var x = getPlayerLoc(playerName)["x"];
	var y = getPlayerLoc(playerName)["y"];
	//console.log("p: " + x + ", " + y);
	var surroundings = {};
	if(map[x+1] != undefined){
		surroundings["right"] = map[x+1][y];
		surroundings["right"]["x"] = x+1;
		surroundings["right"]["y"] = y;
	}
	if(map[x-1] != undefined){
		surroundings["left"] = map[x-1][y];
		surroundings["left"]["x"] = x-1;
		surroundings["left"]["y"] = y;
	}
	if(map[x][y+1] != undefined){
		surroundings["down"] = map[x][y+1];
		surroundings["down"]["x"] = x;
		surroundings["down"]["y"] = y+1;
	}
	if(map[x][y-1] != undefined){
		surroundings["up"] = map[x][y-1];
		surroundings["up"]["x"] = x;
		surroundings["up"]["y"] = y-1;
	}
	surroundings["here"] = map[x][y];
	surroundings["here"]["x"] = x;
	surroundings["here"]["y"] = y;
	return surroundings;
}

function displayBorders(bool){
	//console.log(bool);
	if(!bool){
		$("td").css("border", "0px");
		$("table").css("border-spacing", "0px");
	}
	else {
		$("td").css("border", "1px solid black");
		$("table").css("border-spacing", "1px");
	}
}

var itemsVis;
function displayItems(bool){
	itemsVis = bool;
	if(!itemsVis){
		$(".item").css("display", "none")
	}
	else if(itemsVis){
		$(".item").css("display", "block")
	}
}

function createUniqueItemInWorld(x, y, itemName){
	var id = generateID();
	var itemData = JSON.parse(JSON.stringify(itemList[itemName])); //clones
	var modChance = 0.2;
	var seed = Math.random();
	
	//console.log(x + ", " + y);
	map[x][y]["uniqueItem"][id] = {};
	map[x][y]["uniqueItem"][id][itemName] = itemData;
	map[x][y]["uniqueItem"][id][itemName]["quantity"] = 1;
	
	if(map[x][y]["uniqueItem"][id][itemName]["type"] === "weapon"){
		map[x][y]["uniqueItem"][id][itemName]["level"] = {"curLevel": 1, "curExp": 0, "expForNext": 50};
	}
	
	if(seed < modChance)
		modUniqueItem(map[x][y]["uniqueItem"][id]);
	
	drawTile(x, y);
}

var itemStatLevelBoosts = {"atk": 1.25, "speed": 1.1, "atkR": 0.9}
function activeItemGainExp(playerName, exp) {
	if(playerExists(playerName) && playerHasActiveItem(playerName)){
		var player = getPlayer(playerName);
		var activeItemName = getActiveItemName(playerName);
		var activeItemData = getActiveItemData(playerName);
		activeItemData["level"]["curExp"] += exp;
		//log(boldWord(playerName) + "'s " + italicWord(activeItemName) + " gained " + underlineWord(exp) + " exp.");
		
		if(activeItemData["level"]["curExp"] > activeItemData["level"]["expForNext"]){
			activeItemData["level"]["curLevel"]++;
			activeItemData["level"]["curExp"] -= activeItemData["level"]["expForNext"];
			activeItemData["level"]["expForNext"] *= 1.25;
			
			$.each(itemStatLevelBoosts, function( key, value ) {
				activeItemData[key] *= value;
			});
			
			if(settings["leveling"] && settings["levelingItems"])
				log(boldWord(playerName) + " has leveled-up their " + italicWord(activeItemName) + " to level " + underlineWord(activeItemData["level"]["curLevel"]) + "!");
		}
	}
}

var modBounds = {};
function genModBounds(){
	var lastBound = 0;
	$.each(weaponModifiers, function( key, value ) {
		modBounds[key] = lastBound + value["chance"];
		lastBound = modBounds[key];
	});
}

function modUniqueItem(itemRef){
	var seed = Math.random();
	var lastBound = 0;
	var mod = undefined;
	var modName = undefined; 
	var itemName = Object.keys(itemRef)[0];
	var itemData = JSON.parse(JSON.stringify(itemRef[itemName]));
	console.log(itemRef);
	$.each(modBounds, function( key, value ) {
		if(seed >= lastBound && seed < value){
			mod = weaponModifiers[key];
			modName = key;
			//console.log(key);
		}
		lastBound = value;
	});
	
	if(mod != undefined){
		$.each(mod["effects"], function( key, value ) {
			itemData[key] *= value;
		});
		
		delete itemRef[itemName];
		itemRef[modName + " " + itemName] = itemData;
		//console.log(itemRef);
	}
}

function generateID(){
	var id = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for ( var i = 0; i < 10; i++ ) {
		id += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return id;
}

function boldWord(word){
	return "<b>" + word + "</b>";
}

function italicWord(word){
	return "<i>" + word + "</i>";
}

function underlineWord(word){
	return "<u>" + word + "</u>";
}