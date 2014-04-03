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
	$('<option value=' + "0" + '>' + '' + '</option>').appendTo(
			'#headerOptions');
	$.each(mycsv[0], function(index, value) {
		// alert( index + ": " + value );
		// var radioBtn = $('<input type="radio" name="header" value =
		// '+value+'>'+value+'<br>');
		var option = $('<option value=' + (index + 1) + '>' + value
				+ '</option>');
		option.appendTo('#headerOptions');
	});
}

function selectMagnitude() {
	// Send to Server
	selectedVal = "";
	// var selected = $("input[type='radio'][name='header']:checked");
	// if (selected.length > 0) {
	// selectedVal = selected.val();
	// }
	selectedVal = $("#headerOptions option:selected").val();
	sendData(selectedVal);
}

function sendData(selectedMag) {
	console.log('hello ' + selectedMag);
	$.ajax({
		url : "/GIS2/ProcessFile",
		type : "post",
		data : {
			meh : originalCsv,
			mag : selectedMag,
			fileName : $('#fileName').val(),
			fileType : $('input[name=dataCategory]:checked').val()
		}
	}).done(function(result) {
		console.log(result);
		var stat = $.parseJSON(result);
		var printToScreen = "";
		$.each(stat, function(index, value) {
			printToScreen += (value[0] + ": " + value[1] + "</br>");
		});
		$('#statsScore').html(printToScreen);
	});

	// convert to geo JSON
	processUpload();
}

function sendTestData(dd) {
	console.log('Test Send ' + dd);
	$.ajax({
		url : "/GIS2/test",
		type : "post",
		data : {
			'meh' : dd
		}
	}).done(function(result) {
		console.log(result);
		$('#statsScore').html(result);
	});

	// convert to geo JSON
	processUpload();
}

function createNewAmenitySelection() {
	var newTableRow = '<tr><td><select style="width:70px" name="amenities" >';
	$
			.ajax({
				url : "/GIS2/GetAllAmenities",
				type : "get"
			})
			.done(
					function(result) {
						result = $.parseJSON(result);
						$.each(result, function(index, value) {
							newTableRow += ('<option value="' + value + '">'
									+ value + '</option>');
						});
						newTableRow += '</select></td>';
						newTableRow += '<td><select style="width:70px" name="regressionType" onchange="return createValueInput(this.value)"><option value="radius">Radius</option><option value="distance">Distance</option><option value="magnitude">Magnitude</option></select></td><td><input type="text" name="radius" style="width:50px;"/></td>';
						$('#regressionTable').append(newTableRow);
					});
}

function createValueInput(value) {
	if (value === "radius") {
		$(event.srcElement.parentElement.parentElement.children[2]).html(
				'<input type="text" name="radius" style="width:50px;"/>');
	} else if (value === "distance") {
		$(event.srcElement.parentElement.parentElement.children[2]).html(
				'<input type="text" disabled="disabled" style="width:50px;"/>');
	} else if (value === "magnitude") {
		var userAmenitySelection = '<select name="userAmenity">';
		var location = $(event.srcElement.parentElement.parentElement.children[2]);
		var selectedFileName = $(
				event.srcElement.parentElement.parentElement.children[0]).find(
				'option:selected').text();
		$.ajax({
			url : "/GIS2/GetFileHeaders",
			type : "get",
			data : {
				'fileName' : selectedFileName
			}
		}).done(
				function(result) {
					if (result.length > 0) {
						result = $.parseJSON(result);
						$.each(result, function(index, value) {
							userAmenitySelection += ('<option value="' + index
									+ '">' + value + '</option>');
						});
						userAmenitySelection += '</select>';
						location.html(userAmenitySelection);
					} else {
						location.html('No Options');
					}
				});

	}
}

function grabRegSettings() {
	var result = "";
	var last = "";
	$('#regressionTable > tbody  > tr').each(function(index1, value1) {
		if (index1 > 0) {
			$.each(value1.children, function(index2, value2) {
				if (index2 < 2) {
					console.log($(value2).find('option:selected').val());
					result += ($(value2).find('option:selected').val() + ",");
					last = $(value2).find('option:selected').val();
				}else{
					if(last === "radius"){
						console.log($(value2).find('input:text[name=radius]').val());
						result += $(value2).find('input:text[name=radius]').val();
					}else if(last === "distance"){
						console.log($(value2).find('input:text').val());
						result += NaN;
					}else if(last === "magnitude"){
						console.log(parseInt($(value2).find('option:selected').val()) + 1);
						result += (parseInt($(value2).find('option:selected').val()) + 1);
					}
					if(index1 !== ($('#regressionTable > tbody  > tr').length -1)){
						result += "~";
					}
				}
			});
		}
	});
	sendRegressionData(result);
	//sendGWRData(result);
	console.log(result);
}

function sendRegressionData(data){
	$.ajax({
		url : "/GIS2/GetRegressionResult",
		type : "get",
		data : {'regData' : data}
	}).done(function(result) {
		result = $.parseJSON(result);
		//console.log(result);
		$('.toDelete').remove();
		var index;
		for(index = 0; index < result['headerVals'][0].length; index++){
		
			$('#regressionResult').append("<tr class='toDelete' ><td><i>"+result['headerVals'][0][index]+"</i></td><td><i>"+result['statsVals'][index][0]+"</i></td><td><i>"+result['statsVals'][index][1]+"</i></td><td><i>"+result['statsVals'][index][2]+"</i></td><td><i>"+result['statsVals'][index][3]+"</i></td></tr>");
		}
		
		
		
	});
}

function sendGWRData(data){
	$.ajax({
		url : "/GIS2/GetGWRResult",
		type : "get",
		data : {'regData' : data}
	}).done(function(result) {
		result = $.parseJSON(result);
		console.log(result);
	});
}

function errorHandler(evt) {
	if (evt.target.error.name == "NotReadableError") {
		alert("Canno't read file !");
	}
}

//function pinDrop(){
//	$.ajax({
//        url: "/GIS2/GetVariableValue",
//        type: "get",
//        data: {
//            'userPoints': "103.90969,1.305"
//        }
//    }).done(function(result) {
//        console.log(result);
//    });
//
//}