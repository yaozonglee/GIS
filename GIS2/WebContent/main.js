//global variables
var map; //map object
var layerControl;
var info;

var CCData=L.layerGroup();
var ChildCareData=L.layerGroup();
var HawkerCentreData=L.layerGroup();
var KinderGartenData=L.layerGroup();
var PrivateEducationData=L.layerGroup();

var userMarkers;
var userMarkersPos=new Array();


var dataToLoad;
var region;

var coor;
var subRegion=L.layerGroup();
var education=L.layerGroup();
var rails=L.layerGroup();
var legendControl;





window.onload = initialize(); 

//the first function called once the html is loaded
function initialize(){
  setMap(); 
};


//set basemap parameters
function setMap() {
  

// REMOVING PREVIOUS INFO BOX
  // if (info != undefined) {
  //  info.removeFrom(map)
  // }

  //clustering start
  var resize = function () {
    var $map = $('#map');
    
    $map.height($(window).height());
    
    if (map) {
      map.invalidateSize();
    }
  };

// Resize the map element on window resize
  $(window).on('resize', function () {
    resize();
  });
  
  // Resize the map element
  resize();

  //create  the map and set its initial view
  map = L.map('map',{layers:[]}).setView([1.355312,103.827068], 11);
  
  // The {s} indicates possible server instances from which the map can draw tiles.  For each loaded tile, {z} indicates its zoom level, {x} indicates its horizontal coordinate, and {y} indicates its vertical coordinate.  Near all public tile services use this z/x/y directory format, which was pioneered by Google. 
  var layer = L.tileLayer(
    'http://{s}.tile.osm.org/{z}/{x}/{y}.png', 
    {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

  // Initialize the legend control and add it to the map
  // var legendControl = new L.Control.Legend({});
  // legendControl.addTo(map);

  
   $.getJSON('data/PrivateEducation.geojson', function(data) { 
    L.geoJson(data, {     
      onEachFeature: function (feature, layer) {   
        var marker = new L.Marker(new L.LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]));
        PrivateEducationData.addLayer(marker);
      }       
    });
  });
   
   $.getJSON('data/KinderGartens.geojson', function(data) { 
	    L.geoJson(data, {     
	      onEachFeature: function (feature, layer) {   
	        var marker = new L.Marker(new L.LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]));
	        KinderGartenData.addLayer(marker);
	      }       
	    });
	  });
   
   $.getJSON('data/HawkerCentre.geojson', function(data) { 
	    L.geoJson(data, {     
	      onEachFeature: function (feature, layer) {   
	        var marker = new L.Marker(new L.LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]));
	        HawkerCentreData.addLayer(marker);
	      }       
	    });
	  });
   
   $.getJSON('data/ChildCare.geojson', function(data) { 
	    L.geoJson(data, {     
	      onEachFeature: function (feature, layer) {   
	        var marker = new L.Marker(new L.LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]));
	        ChildCareData.addLayer(marker);
	      }       
	    });
	  });
   
   $.getJSON('data/CCs.geojson', function(data) { 
	    L.geoJson(data, {     
	      onEachFeature: function (feature, layer) {   
	        var marker = new L.Marker(new L.LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]));
	        CCData.addLayer(marker);
	      }       
	    });
	  });



// adding region with total pop data 
//$.getJSON('data/census.geojson', function(data) { 
//  region= L.geoJson(data, {style: style,         
//    onEachFeature: function (feature, layer) { 
//      subRegion.addLayer(layer);
//      layer.on({
//        mouseover: highlightFeature,
//        mouseout: resetHighlight,
//        click: zoomToFeature
//    }); 
//      // subRegion.addLayer(layer.bindPopup(feature.properties.Census2000_Education)); 
//    }       
//  }); 
//});

//$.getJSON('data/sgrailnetwork.geojson', function(data) { 
// L.geoJson(data,{     
//      onEachFeature: function (feature, layer) {   
//        layer.addTo(rails).bindPopup(feature.properties.name);
//      }       
//    })
//});



  map.on('click', onMapClick);

  var baseMaps = {
    // "Minimal": minimal,
    // "Night View": midnight
  };

  var overlays = {
    "Private Education": PrivateEducationData,
    "Child Care Centre": ChildCareData,
    "Hawker Centre": HawkerCentreData,
    "Kindergartens": KinderGartenData,
    "Community Centre": CCData
  };

  
  
  
// adding a division of information content on mouse over
  info = L.control({position: 'topleft'});
  

  info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
  };

  // method that we will use to update the control based on feature properties passed
  info.update = function (props) {
    // test=prop;
    this._div.innerHTML = '<h4>Analysis</h4>' +  (props ?
        '<b>' + props.DGPZ_NAME + '</b><br />' + props.Census2000_TOTALPOP + ' people'
        : 'Plant a pin on the map and run analysis');
  };
  
  info.addTo(map);

//  var legend = L.control({position: 'bottomleft'});
//
//  legend.onAdd = function (map) {
//
//      var div = L.DomUtil.create('div', 'info legend'),
//          grades = [0, 1385, 4994, 16944, 137152],
//          labels = [];
//
//      // loop through our intervals and generate a label with a colored square for each interval
//      for (var i = 0; i < grades.length; i++) {
//          // div.innerHTML +=
//          //     '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
//          //     '&#60;' + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
//          div.innerHTML +=
//              '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
//              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
//      }
//
//      return div;
//  };
//
//
  layerControl=L.control.layers(baseMaps,overlays).addTo(map);
  
//  legend.addTo(map);


//styling of region polygon with census data         start
//  function style(feature) {
//      return {
//          fillColor: getColor(feature.properties.Census2000_TOTALPOP),
//          weight: 2,
//          opacity: 1,
//          color: 'white',
//          dashArray: '3',
//          fillOpacity: 0.7
//      };
//  };
//
////set colour for the choropleth scale  -   EQUAL COUNT
//  function getColor(d) {
//      return d > 137152 ? '#a50f15' :
//             d > 16944  ? '#de2d26' :
//             d > 4994  ? '#fb6a4a' :
//             d > 1385  ? '#fcae91' :
//            '#fee5d9';
//  };

//EQUAL INTERVAL
// function getColor(d) {
//     return d > 91440 ? '#a50f15' :
//            d > 68580  ? '#de2d26' :
//            d > 45720  ? '#fb6a4a' :
//            d > 22860  ? '#fcae91' :
//           '#fee5d9';
// };

//styling og region polygon with census data         end

//choropleth map zoomin and highlight       Start
//  function resetHighlight(e) {
//    info.update();
//    region.resetStyle(e.target);
//  }
//
//  function zoomToFeature(e) {
//      map.fitBounds(e.target.getBounds());
//  }
//
//  function highlightFeature(e) {
//    
//      var layer = e.target;
//      info.update(layer.feature.properties);
//      layer.setStyle({
//          weight: 5,
//          color: '#666',
//          dashArray: '',
//          fillOpacity: 0.7
//      });
//
//      if (!L.Browser.ie && !L.Browser.opera) {
//          layer.bringToFront();
//      }
//  }

//choropleth map zoomin and highlight       end

  userMarkers = new L.LayerGroup();
  map.addLayer(userMarkers);

function onMapClick(e) {
	$('#clearPoints').css('display','');
    var marker = new L.Marker(e.latlng);
//    var marker = new L.circleMarker(e.latlng);
    userMarkers.addLayer(marker);
    userMarkersPos.push(e.latlng);
    
    layerControl.addOverlay(userMarkers,'Clicked Points');  	
    info.update();
    // alert("You clicked the map at " + e.latlng);
}

$('#clearPoints').click(function(){
$('#clearPoints').css('display','none');
  info.update();
  userMarkersPos=new Array();
  map.removeLayer(userMarkers);
  layerControl.removeLayer(userMarkers);
  userMarkers = new L.LayerGroup();
  map.addLayer(userMarkers);
});

//function plotCircle(data,radius){
//	data.each(function(){
//		var marker = new L.Marker(e.latlng);
//		
//	});	
//}


};
    
console.log("I LOVE GEOSPATIAL");
