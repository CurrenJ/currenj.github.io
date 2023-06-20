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

capo = 0;
function setCapo(x)
{
	capo = x;
  updateDisplay();
}

guitarStringNoteMapping = {0: 19, 1: 24, 2: 29, 3: 34, 4: 38, 5: 43};
function convert(guitarStringIndex, fretIndex)
{
	return guitarStringNoteMapping[guitarStringIndex] + fretIndex + Number(capo);
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

