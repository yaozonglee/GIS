var mycsv;
var originalCsv;
var aaa;

function handleFiles(files) {
	// Check for the various File API support.
	if (window.FileReader && files[0] != null) {
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
	$('#headerOptions').empty();
	$('<option value='+"0"+'>'+''+'</option>').appendTo('#headerOptions');
	$.each(mycsv[0], function( index, value ) {
//		  alert( index + ": " + value );
		  //var radioBtn = $('<input type="radio" name="header" value = '+value+'>'+value+'<br>');
		var option = $('<option value='+(index+1)+'>'+value+'</option>');
		option.appendTo('#headerOptions');
	});
}

function selectMagnitude(){
	// Send to Server
	selectedVal = "";
//	var selected = $("input[type='radio'][name='header']:checked");
//	if (selected.length > 0) {
//	    selectedVal = selected.val();
//	}
	selectedVal = $("#headerOptions option:selected").val();
	sendData(selectedVal);
}

function sendData(selectedMag){
	console.log('hello ' + selectedMag);
	$.ajax({
		url : "/GIS2/ProcessFile",
		type : "post",
		data: {meh : originalCsv,
			mag : selectedMag,
			fileName : $('#fileName').val()}
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

function createNewAmenitySelection(){
	var newTableRow = '<tr><td><select name="amenities">'; 
	$.ajax({
		url : "/GIS2/GetAllAmenities",
		type : "get"
	}).done(function(result) {
		result =  $.parseJSON(result);
		console.log(result);
		$.each(result, function(index, value){
			newTableRow += ('<option value="'+value+'">'+value+'</option>');
		});
		newTableRow += '</select></td>';
		newTableRow += '<td><select name="regressionType" onchange="return createValueInput(this.value)"><option value="radius">Radius</option><option value="distance">Distance</option><option value="magnitude">Magnitude</option></select></td><td><input type="text" name="radius" style="width:50px;"/></td>';
		//$('#statsScore').html(result);
		//$('#regressionTable').append('<tr><td><select name="cars"><option value="volvo">Volvo</option><option value="saab">Saab</option><option value="fiat">Fiat</option><option value="audi">Audi</option></select></td><td><select name="meh"><option value="volvo">Volvo</option><option value="saab">Saab</option><option value="fiat">Fiat</option><option value="audi">Audi</option></select></td><td>94</td></tr>');
		$('#regressionTable').append(newTableRow);
	});
}

function createValueInput(value){
	if(value === "radius"){
		$(event.srcElement.parentElement.parentElement.children[2]).html('<input type="text" name="radius" style="width:50px;"/>');
	}else if(value === "distance"){
		$(event.srcElement.parentElement.parentElement.children[2]).html('<input type="text" disabled="disabled" style="width:50px;"/>');
	}else if(value === "magnitude"){
		var userAmenitySelection = '<select name="userAmenity">';
		var location = $(event.srcElement.parentElement.parentElement.children[2]);
		$.ajax({
			url : "/GIS2/GetAllAmenities",
			type : "get"
		}).done(function(result) {
			result =  $.parseJSON(result);
			console.log(result);
			$.each(result, function(index, value){
				userAmenitySelection += ('<option value="'+value+'">'+value+'</option>');
			});
			userAmenitySelection += '</select>';
			location.html(userAmenitySelection);
		});
		
		
	}
}

function errorHandler(evt) {
	if (evt.target.error.name == "NotReadableError") {
		alert("Canno't read file !");
	}
}