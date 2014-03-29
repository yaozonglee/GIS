var mycsv;
var originalCsv;
var aaa;

// $(function() {
// 'use strict';
// // Change this to the location of your server-side upload handler:
// var url = window.location.hostname === 'blueimp.github.io' ?
// '//jquery-file-upload.appspot.com/' : 'server/php/',
// uploadButton = $('<button/>')
// .addClass('btn btn-primary')
// .prop('disabled', true)
// .text('Processing...')
// .on('click', function() {
// var $this = $(this),
// data = $this.data();
// $this
// .off('click')
// .text('Abort')
// .on('click', function() {
// $this.remove();
// data.abort();
// });
// data.submit().always(function() {
// $this.remove();
// });
// });
// $('#fileupload').fileupload({
// url: url,
// dataType: 'json',
// autoUpload: false,
// //acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
// maxFileSize: 5000000, // 5 MB
// // Enable image resizing, except for Android and Opera,
// // which actually support image resizing, but fail to
// // send Blob objects via XHR requests:
// disableImageResize: /Android(?!.*Chrome)|Opera/
// .test(window.navigator.userAgent),
// previewMaxWidth: 100,
// previewMaxHeight: 100,
// previewCrop: true
// }).on('fileuploadadd', function(e, data) {
// data.context = $('<div/>').appendTo('#files');
// $.each(data.files, function(index, file) {
// var node = $('<p/>')
// .append($('<span/>').text(file.name));
// if (!index) {
// node
// .append('<br>')
// .append(uploadButton.clone(true).data(data));
// }
// node.appendTo(data.context);
// });
// }).on('fileuploadprocessalways', function(e, data) {
// var index = data.index,
// file = data.files[index],
// node = $(data.context.children()[index]);
// if (file.preview) {
// node
// .prepend('<br>')
// .prepend(file.preview);
// }
// if (file.error) {
// node
// .append('<br>')
// .append($('<span class="text-danger"/>').text(file.error));
// }
// if (index + 1 === data.files.length) {
// data.context.find('button')
// .text('Upload')
// .prop('disabled', !! data.files.error);
// }
// }).on('fileuploadprogressall', function(e, data) {
// var progress = parseInt(data.loaded / data.total * 100, 10);
// $('#progress .progress-bar').css(
// 'width',
// progress + '%'
// );
// }).on('fileuploaddone', function(e, data) {
// $.each(data.result.files, function(index, file) {
// if (file.url) {
// var link = $('<a>')
// .attr('target', '_blank')
// .prop('href', file.url);
// $(data.context.children()[index])
// .wrap(link);
// } else if (file.error) {
// var error = $('<span class="text-danger"/>').text(file.error);
// $(data.context.children()[index])
// .append('<br>')
// .append(error);
// }
// });
// }).on('fileuploadfail', function(e, data) {
// $.each(data.files, function(index, file) {
// var error = $('<span class="text-danger"/>').text('File upload failed.');
// $(data.context.children()[index])
// .append('<br>')
// .append(error);
// });
// }).prop('disabled', !$.support.fileInput)
// .parent().addClass($.support.fileInput ? undefined : 'disabled');
// });

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
		aaa = stat;
		$.each(stat, function(index, value){
			printToScreen += (value[0] + ": " + value[1] + "</br>");
		});
		$('#statsScore').html(printToScreen);
	});

	// convert to geo JSON
	processUpload();
}

function errorHandler(evt) {
	if (evt.target.error.name == "NotReadableError") {
		alert("Canno't read file !");
	}
}