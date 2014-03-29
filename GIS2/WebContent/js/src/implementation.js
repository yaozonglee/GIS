var mycsv;
var originalCsv;
var aaa;

function handleFiles(files) {
	// Check for the various File API support.
	if (window.FileReader) {
		// FileReader are supported.
		getAsText(files[0]);
	} else {
		alert('FileReader are not supported in this browser.');
	}
}

function getAsText(fileToRead) {
	var reader = new FileReader();
	// Read file into memory as UTF-8
	reader.readAsText(fileToRead);
	// Handle errors load
	reader.onload = loadHandler;
	reader.onerror = errorHandler;
}

function loadHandler(event) {
	var csv = event.target.result;
	processData(csv);
}

function processData(csv) {
	var allTextLines = csv.split(/\r\n|\r|\n/g);
	var lines = [];
	for (var i = 0; i < allTextLines.length; i++) {
		var data = allTextLines[i].split(',');
		var tarr = [];
		for (var j = 0; j < data.length; j++) {
			tarr.push(data[j]);
		}
		lines.push(tarr);
	}
	mycsv = lines;
	originalCsv = csv;

	$('<option value='+"0"+'>'+''+'</option>').appendTo('#headerOptions');
	$.each(mycsv[0], function( index, value ) {
//		  alert( index + ": " + value );
		  //var radioBtn = $('<input type="radio" name="header" value = '+value+'>'+value+'<br>');
		var option = $('<option value='+(index+1)+'>'+value+'</option>');
		option.appendTo('#headerOptions');
	});
	$("#gistLinkContainer").show();
}

function selectMagnitude(){
	// Send to Server
	selectedVal = "";
//	var selected = $("input[type='radio'][name='header']:checked");
//	if (selected.length > 0) {
//	    selectedVal = selected.val();
//	}
	selectedVal = $("#headerOptions option:selected").val();
	$("#gistLinkContainer").hide();
	$('#headerOptions').empty();
	sendData(selectedVal);
}

function sendData(selectedMag){
	console.log('hello ' + selectedMag);
	$.ajax({
		url : "/GIS2/ProcessFile",
		type : "post",
		data: {meh : originalCsv,
			mag : selectedMag}
	}).done(function(result) {
		console.log(result);
		var stat = $.parseJSON(result);
		var printToScreen = "";
		$.each(stat, function(index, value){
			printToScreen += (value[0] + ": " + value[1] + "</br>");
		});
		$('#statsScore').html(printToScreen);
	});

	// convert to geo JSON
	processUpload();
}

function sendTestData(dd){
	console.log('Test Send ' + dd);
	$.ajax({
		url : "/GIS2/test",
		type : "post",
		data: {'meh' : dd}
	}).done(function(result) {
		console.log(result);
		$('#statsScore').html(result);
	});

	// convert to geo JSON
	processUpload();
}

function errorHandler(evt) {
	if (evt.target.error.name == "NotReadableError") {
		alert("Canno't read file !");
	}
}