$(function() {	
	initTabs();
	getJSON();
});

var files = ["messages/message_1.json", "messages/message_2.json", "messages/message_3.json", "messages/message_4.json", "messages/message_5.json"];
function getJSON(){
	loadData();
}

var fileIndex = 0;
function loadData(){
	if(fileIndex < files.length){
		console.log("Loading message data from '" + files[fileIndex] + "'");
		requestData(files[fileIndex]);
		fileIndex++;
	}
	else {
		dataLoaded();
	}
}

function dataLoaded(){
	console.log("Data succesfully loaded.");
	groupAllMessagesByToken();
	newNamedTab("Tokens", createTokenHTML(sortTokens(messagesByToken), "Words Used (Ranked by Frequency):"));
}

function requestData(url){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var messages = parseJSON(this.response);
			
			loadData();
		}
	};
	xhttp.open("GET", url, true);
	xhttp.send();
}

var allMessages = {};
var messagesBySender = {};
var messageGroups = 0;
function parseJSON(jsonString) {
	var messages = (JSON.parse(jsonString));
	//console.log(messages);
	
	//add this message group to allMessages
	allMessages[messageGroups] = messages;
	messageGroups++;
	
	groupMessagesBySender(messages["messages"]);
	groupMessagesBySenderAndToken();
	groupMessagesBySenderTokenAndMention();
	
	//Setup a tab for each participant
	$(messages['participants']).each(function() {
		var participantName = ($(this)[0]["name"]);
		
		var participantTabExists = false;
		$(".tab").each(function(){
			if($(this).children(".label").html() === participantName){
				participantTabExists = true;
			}
		});
		
		var tabHTML = createSenderTabHTML(participantName);
		
		if(!participantTabExists){
			newNamedTab(participantName, tabHTML);
		}
		else {
			$(".tab").each(function(){
				if($(this).children(".label").html() === participantName){
					tabs[$(this).prop("num")] = tabHTML;
				}
			});
		}
	});
}

function groupAllMessagesByToken(){
	var array = Object.entries(allMessages).map(([key, value]) => ({key,value}));
	$(array).each(function(){
		var mBT = groupMessagesByToken($(this)[0]["value"]["messages"]);
		var mBTarray = Object.entries(mBT).map(([key, value]) => ({key,value}));
		$(mBTarray).each(function(index){
			var token = $(this)[0]["key"];
			var messages = $(this)[0]["value"];
			
			//if the token isnt in the list, add it.
			if(messagesByToken[token] == undefined){
				messagesByToken[token] = messages;
			}
			else { //else, add all the messages to the existing token
				$(messages["messages"]).each(function(){
					messagesByToken[token]["messages"].push($(this));
				});
			}
		});
	});
	console.log(messagesByToken);
}

function createTokenHTML(tokens, title){
	var tokenArray = tokens;
	if(!Array.isArray(tokens))
		tokenArray = Object.entries(tokens).map(([key, value]) => ({key,value}));
	
	var createdHTML = "<div class=\"tokenBox left\"><p><u>" + title + "</u></p>";
	$(tokenArray).each(function(index){
		var token = $(this)[0]["key"];
		var count = $(this)[0]["value"]["messages"].length;
		createdHTML += "<span class=\"messageSpan\"><span class=\"tokenRank\">" + index + ".</span><span class=\"messageContent\">" + token + "</span><span class=\"tokenCount\">(<span class=\"small\">x</span>" + count + ")</span></span>";
	});
	createdHTML += "</div>";
	
	return createdHTML;
}

function getRandomMessage(participantName){
	var count = messagesBySender[participantName]["messages"].length;
	var message = messagesBySender[participantName]["messages"][(Math.round(Math.random() * count))];
	var messageTimestamp = message[0]["timestamp_ms"];
	var displayTimestamp = (new Date(messageTimestamp));
	$(".randomText").find(".messageTimestamp").html(getMonth(displayTimestamp.getMonth()) + " " + displayTimestamp.getDate());
	$(".randomText").find(".messageContent").html(message[0]["content"]);
	return message;
}

function createRandomMessageBySenderHTML(participantName){
	var randomHTML = "<div class=\"randomBox\">";
	
	randomHTML += "<div class=\"randomButton\"><p>Random Message</p></div>";
	randomHTML += "<div class=\"randomText\"><span class=\"messageSpan\"><span class=\"messageTimestamp\"></span><span class=\"messageContent\"></span></span></div>";
	
	randomHTML += "</div>";
	
	return randomHTML;
}

function createMessageHTML(messagesArray){
	var createdHTML = "";
	$(messagesArray).each(function(){
		var messageContent = $(this)[0]["content"];
		if(messageContent != undefined) {
			var c2 = messageContent.replace(/[^A-Za-z0-9 ]/, "");
			var messageTimestamp = $(this)[0]["timestamp_ms"];
			var displayTimestamp = (new Date(messageTimestamp));
			createdHTML += "<span class=\"messageSpan\"><span class=\"messageTimestamp\">" + getMonth(displayTimestamp.getMonth()) + " " + displayTimestamp.getDate() + "</span><span class=\"messageContent\">" + c2 + "</span></span>";
		}
	});
	return createdHTML;
}

function createSenderTabHTML(participantName){
	var messagesHTML = "<div class=\"messageBox right\">" + "<p class=\"tabTitle\"><u>" + participantName + "</u> (" + messagesBySender[participantName]["messages"].length + " messages)</p>";
	messagesHTML += createMessageHTML(messagesBySender[participantName]["messages"]);
	messagesHTML += "</div>"
	
	var tokensHTML = createTokenHTML(senderTokensSorted[participantName], participantName + "'s Top Words:");
	
	var mentionsHTML = createTokenHTML(mentionsBySender[participantName], participantName + "'s Most Frequently Mentioned:");
	
	var randomHTML = createRandomMessageBySenderHTML(participantName);
	
	var middleColumn = "<div class=\"middleColumn\">" + mentionsHTML + randomHTML + "</div>";
	
	return tokensHTML + middleColumn + messagesHTML;
}

function getMonth(monthNum){
	switch(monthNum){
		case 0:
			return "January";
			break;
		case 1:
			return "February";
			break;
		case 2:
			return "March";
			break;
		case 3:
			return "April";
			break;
		case 4:
			return "May";
			break;
		case 5:
			return "June";
			break;
		case 6:
			return "July";
			break;
		case 7:
			return "August";
			break;
		case 8:
			return "September";
			break;
		case 9:
			return "October";
			break;
		case 10:
			return "November";
			break;
		case 11:
			return "December";
			break;
	}
}

var senderTokensSorted = {};
function groupMessagesBySenderAndToken(){
	var array = Object.entries(messagesBySender).map(([key, value]) => ({key,value}));
	$(array).each(function(){
		var participantName = $(this)[0]["key"];
		var grouped = groupMessagesByToken($(this)[0]["value"]["messages"]);
		grouped = sortTokens(grouped);
		senderTokensSorted[participantName] = grouped;		
	});
	console.log(senderTokensSorted);
}

function groupMessagesBySender(messagesArray){
	$(messagesArray).each(function(index){
		var messageContent = $(this)[0]["content"];
		var messageSender = $(this)[0]["sender_name"];
		var messageTimestamp = $(this)[0]["timestamp_ms"];
		
		if(messagesBySender[messageSender] == undefined)
			messagesBySender[messageSender] = [];
		if(messagesBySender[messageSender]["messages"] == undefined)
			messagesBySender[messageSender]["messages"] = [];
		messagesBySender[messageSender]["messages"].push($(this));
	});
}

var mentionsBySender = {};
function groupMessagesBySenderTokenAndMention(){
	var array = Object.entries(messagesBySender).map(([key, value]) => ({key,value}));
	var mBS = {};
	$(array).each(function(){
		var participantName = $(this)[0]["key"];
		var senderTokens = senderTokensSorted[participantName];
		
		$(senderTokens).each(function(index){
			var token = $(this)[0]["key"];
			var count = $(this)[0]["value"]["messages"].length;
			var messages = $(this)[0]["value"];
			
			$(array).each(function(){
				var participantName2 = $(this)[0]["key"];
				
				if(token === participantName2.split(" ")[0].toLowerCase()){
					
					if(mBS[participantName] == undefined)
						mBS[participantName] = {};
					
					mBS[participantName][participantName2] = messages;
				}
			});
		});
		
		mentionsBySender[participantName] = sortTokens(mBS[participantName]);
	});
	
	console.log();
}

var messagesByToken = {};
function groupMessagesByToken(messagesArray){
	var mBT = {};
	$(messagesArray).each(function(index){
			var message = $(this);
			var messageContent = message[0]["content"];
			// if(index % 100 == 0)
				// console.log(messageContent);
			
			if(messageContent != undefined){
				var messageTokens = messageContent.split(/[^A-Za-z']/);
				// if(index % 100 == 0)
					// console.log(messageTokens);
								
				$(messageTokens).each(function(){
					var token = this.toString().toLowerCase();
					
					if(token != "" && token != "'"){
						if(mBT[token] == undefined)
							mBT[token] = [];
						if(mBT[token]["messages"] == undefined)
							mBT[token]["messages"] = [];
						
						mBT[token]["messages"].push(message);
					}
				});
			}
	});
	return mBT;
}

function sortTokens(messageTokenArray){
	try{
	var array = Object.entries(messageTokenArray).map(([key, value]) => ({key,value}));
	array.sort((a, b) => (a["value"]["messages"].length < b["value"]["messages"].length) ? 1 : -1)
	return array;
	} catch(error){
		console.error(error);
		console.log(messageTokenArray);
		console.log(array);
	}
}

function updateTab(tabName, newHTML){
	$(".tab").each(function(){
			if($(this).children(".label").html() === tabName){
				tabs[$(this).prop("num")] = newHTML;
				if($(this).prop("num") == $("#current-tab").prop("num"))
					$("#current-tab").html(newHTML);
			}
	});
}

var tab;
function initTabs(){
	tab = $(".tab")[0].outerHTML;
	$(".tab").remove();
}

function newNamedTab(tabName, tabElement){
	var newTab = $(tab).clone();
	$(newTab).children(".label").html(tabName);
	$("#tab-bar").append(newTab)
	createTab(newTab, tabElement);
}

var tabCounter = 0;
var tabs = {};
function createTab(tabButton, tabElement){
	$(tabButton).prop("num", tabCounter);
	$(tabButton).click(function (){
		clickTab($(this).prop("num"));
	});
	tabs[tabCounter] = $(tabElement);
	
	tabCounter++;
}

function clickTab(tabNum){
	var tabWrapper = getCurrentTab();

	var lastNum = $(tabWrapper).prop("num");
	if(lastNum != undefined){
		tabs[lastNum] = tabWrapper.html();
	}

	$(tabWrapper).prop("num", tabNum);
	$(tabWrapper).html("");
	$(tabWrapper).append(tabs[tabNum])
	$(".randomButton").click(function(){
		console.log("click");
		$(".tab").each(function(){
			console.log($(this).prop("num") + ", " + tabNum);
			if($(this).prop("num") == tabNum){
				getRandomMessage($(this).children(".label").html());
			}
		});
	});
}

function getCurrentTab(){
	return $("#current-tab");
}