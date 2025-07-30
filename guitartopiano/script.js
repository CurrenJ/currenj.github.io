function getKeys()
{
	var keys = document.body.getElementsByClassName("piano")[0].children;
  return keys;
}

function getKey(x)
{
	var key = getKeys()[x];
  return key;
}

function highlightKey(x)
{
	getKey(x).style.backgroundColor = "lightGreen";
}

function resetColor(element)
{
	element.style.backgroundColor = "";
}

function clearHighlights()
{
	for(const element of getKeys())
 	{
  	resetColor(element);
  }
}

maxCapo = 15;
capo = 0;
function setCapo(x)
{
	capo = x;
  updateDisplay();
}

guitarStringNoteMappingEADGBE = {0: 19, 1: 24, 2: 29, 3: 34, 4: 38, 5: 43};
guitarStringNoteMappingDADGAD = {0: 17, 1: 24, 2: 29, 3: 34, 4: 36, 5: 41};
guitarStringNoteMappingFACGCE = {0: 20, 1: 24, 2: 27, 3: 34, 4: 39, 5: 41};
guitarTunings = {"EADGBE": guitarStringNoteMappingEADGBE, "DADGAD": guitarStringNoteMappingDADGAD, "FACGCE": guitarStringNoteMappingFACGCE};
function convert(guitarStringIndex, fretIndex)
{
	let guitarStringNoteMapping = guitarTunings[tuning];
	return guitarStringNoteMapping[guitarStringIndex] + fretIndex + Number(capo);
}


tuning = "EADGBE";
// 0 = standard EADGBE
// 1 = DADGAD
function setTuning(x)
{
	tuning = x;
	updateDisplay(); 
}

function convertText(text)
{
  clearHighlights();

	let stringIndex = 0;
  let temp = '';
  let validFret = false;
	for(const char of text)
  {
  	if(char != ',') {
    	if(char >= '0' && char <= '9'){
    		temp += char;
        validFret = true;
      }
    }
    else {
    	if(validFret)
    		highlightKey(convert(stringIndex, Number(temp)));
      temp = 0;
    	stringIndex++;
      validFret = false;
    }
  }
  if(validFret)
  	highlightKey(convert(stringIndex, Number(temp)));
}

function updateDisplay()
{
  convertText(document.getElementById("guitarChordText").value)
}


window.onload = function() {
	updateDisplay();
};



// SONG STUFF

function saveSong(songDOM)
{
	songObj = getNewSongObj();
	console.log(songDOM);
	songObj["title"] = songDOM.getElementsByClassName("song-title")[0].innerHTML;

	songObj["tuning"] = songDOM.getElementsByClassName("song-tuning")[0].value;
	songObj["capo"] = songDOM.getElementsByClassName("song-capo")[0].value;

	chords = songDOM.getElementsByClassName("song-chords")[0].getElementsByClassName("song-chord");
	songObj["chords"] = [];
	for (let i = 0; i < chords.length; i++)
	{
		chord = chords[i].getElementsByTagName("SPAN")[0].innerHTML;
		songObj["chords"].push(chord);
	}
	songObj["info"] = songDOM.getElementsByClassName("song-description")[0].innerHTML;


	songJSON = JSON.stringify(songObj)
	var bb = new Blob([songJSON], { type: 'text/plain' });
	var a = document.createElement('a');
	a.download = songObj["title"].replace(/[^a-zA-Z0-9]/g, '')+ '.json';
	a.href = window.URL.createObjectURL(bb);
	a.click();
}

function loadSong()
{
	var input = document.createElement('input');
	input.type = 'file';
	input.click();

	input.onchange = e => { 

		// getting a hold of the file reference
		var file = e.target.files[0]; 
	 
		// setting up the reader
		var reader = new FileReader();
		reader.readAsText(file,'UTF-8');
	 
		// here we tell the reader what to do when it's done reading...
		reader.onload = readerEvent => {
		   var content = readerEvent.target.result; // this is the content!
		   addSongToDOM(JSON.parse(content));
		}
	 
	}	 
}

function addSongToDOM(songObj)
{
	song = document.createElement("DIV");
	song.setAttribute("CLASS", "song");

	// Song Title
	songTitle = document.createElement("P");
	songTitle.setAttribute("CLASS", "song-title");
	songTitle.setAttribute("CONTENTEDITABLE", "true")
	songTitle.innerHTML = songObj["title"];
	song.appendChild(songTitle);

	// Tuning Dropdown
	songTuning = getTuningInputElement();
	songTuning.value = songObj["tuning"];
	song.appendChild(songTuning);

	// Capo Dropdown
	songCapo = getCapoInputElement();
	songCapo.value = songObj["capo"];
	song.appendChild(songCapo);

	songDescription = document.createElement("P");
	songDescription.setAttribute("CLASS", "song-description");
	songDescription.setAttribute("CONTENTEDITABLE", "true");
	songDescription.innerHTML = songObj["info"];
	song.appendChild(songDescription);

	// Song Chords
	songChords = document.createElement("UL");
	songChords.setAttribute("CLASS", "song-chords no-bullets");

	songObj["chords"].forEach(chord => {
		songChord = getSongChordElement(chord);
		songChords.appendChild(songChord);
	});
	song.appendChild(songChords);


	// Song Save / Add Chord Buttons
	songAddChordButton = document.createElement("INPUT");
	songAddChordButton.setAttribute("TYPE", "button");
	songAddChordButton.setAttribute("CLASS", "song-add-chord");
	songAddChordButton.setAttribute("VALUE", "Add Chord");
	songAddChordButton.onclick = function(e){ 
		songChord = getSongChordElement(document.getElementById("guitarChordText").value);
		e.target.parentNode.getElementsByClassName("song-chords")[0].append(songChord);
	};
	song.appendChild(songAddChordButton);

	songSaveJSONButton = document.createElement("INPUT");
	songSaveJSONButton.setAttribute("TYPE", "button");
	songSaveJSONButton.setAttribute("CLASS", "song-save song-button");
	songSaveJSONButton.setAttribute("VALUE", "Save as JSON");
	songSaveJSONButton.onclick = function(e){
		saveSong(e.target.parentNode);
	};
	song.appendChild(songSaveJSONButton);

	document.getElementById("songs").appendChild(song);
}

function getSongChordElement(chordString){
	songChord = document.createElement("LI");
	songChord.setAttribute("CLASS", "song-chord");
	songChord.setAttribute("DRAGGABLE", "true");
	songChord.setAttribute("ONDRAGOVER", "dragOver(event)");
	songChord.setAttribute("ONDRAGSTART", "dragStart(event)");

	songChordText = document.createElement("SPAN");
	songChordText.setAttribute("CLASS", "song-chord-text");
	songChordText.innerHTML=chordString;
	songChordText.onclick = function(e){ 
		document.getElementById("guitarChordText").value = e.target.innerHTML;
		updateDisplay();
		document.getElementById("tuning").value = e.target.parentNode.parentNode.parentNode.getElementsByClassName("song-tuning")[0].value;
		document.getElementById("capo").value = e.target.parentNode.parentNode.parentNode.getElementsByClassName("song-capo")[0].value;
	};
	songChord.appendChild(songChordText);

	songChordSet = document.createElement("INPUT");
	songChordSet.setAttribute("TYPE", "button");
	songChordSet.setAttribute("VALUE", "Set");
	songChordSet.onclick = function(e){ 
		e.target.parentNode.getElementsByClassName("song-chord-text")[0].innerHTML = document.getElementById("guitarChordText").value;
	};
	songChordSet.setAttribute("CLASS", "song-chord-set song-button");
	songChord.appendChild(songChordSet);
	
	songChordDelete = document.createElement("INPUT");
	songChordDelete.setAttribute("TYPE", "button");
	songChordDelete.setAttribute("VALUE", "Remove");
	songChordDelete.onclick = function(e){ 
		e.target.parentNode.remove();
	};
	songChordDelete.setAttribute("CLASS", "song-chord-delete song-button");
	songChord.appendChild(songChordDelete);

	return songChord;
}

function getTuningInputElement()
{
	tuningInput = document.createElement("SELECT");
	tuningInput.setAttribute("CLASS", "song-tuning");
	Object.keys(guitarTunings).forEach(function(key) {
		tuningOption = document.createElement("OPTION");
		tuningOption.setAttribute("VALUE", key)
		tuningOption.innerHTML = key;
		tuningInput.appendChild(tuningOption);
	 });
	return tuningInput;
}

function getCapoInputElement()
{
	capoInput = document.createElement("SELECT");
	capoInput.setAttribute("CLASS", "song-capo");
	for (let i = 0; i < maxCapo; i++) {
		capoOption = document.createElement("OPTION");
		capoOption.setAttribute("VALUE", i);
		capoOption.innerHTML = "Capo " + i;
		capoInput.append(capoOption);
	}
	return capoInput;
}

function newSong()
{
	addSongToDOM(getNewSongObj());
}

function getNewSongObj()
{
	songObj = 
	{
		"title": "New Song",
		"chords": ["1,2,3,4,5,6", "0,0,0,0,0,0"],
		"tuning": "EADGBE",
		"info": "Some information about your song."
	};
	return songObj;
}




// Drag & Drop List from @davidf

var _el;

function dragOver(e) {
	var target = e.target;
	while (target.parentNode.tagName != 'UL') {
		target = target.parentNode;
	}

  if (isBefore(_el, target))
    target.parentNode.insertBefore(_el, target);
  else
    target.parentNode.insertBefore(_el, target.nextSibling);
}

function dragStart(e) {
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/plain", null); // Thanks to bqlou for their comment.
  var target = e.target;
  while (target.parentNode.tagName != 'UL') {
	  target = target.parentNode;
  }
  _el = target;
}

function isBefore(el1, el2) {
  if (el2.parentNode === el1.parentNode)
    for (var cur = el1.previousSibling; cur && cur.nodeType !== 9; cur = cur.previousSibling)
      if (cur === el2)
        return true;
  return false;
}
