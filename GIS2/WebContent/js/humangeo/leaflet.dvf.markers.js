L.Path.XLINK_NS = 'http://www.w3.org/1999/xlink';

/*
 * Functions that support displaying text on an SVG path
 */
var TextFunctions = TextFunctions || {
	__updatePath: L.Path.prototype._updatePath,
	
	_updatePath: function () {
		this.__updatePath.call(this);
		
		if (this.options.text) {
			this._createText(this.options.text);
		}
	},
	
	_initText: function () {
		if (this.options.text) {
			this._createText(this.options.text);
		}
	},
	
	getTextAnchor: function () {
		if (this._point) {
			return this._point;
		}
	},
	
	setTextAnchor: function (anchorPoint) {
		if (this._text) {
			this._text.setAttribute('x', anchorPoint.x);
			this._text.setAttribute('y', anchorPoint.y);
		}
	},
	
	_createText: function (options) {
		if (this._text) {
			this._container.removeChild(this._text);
		}
		
		if (this._pathDef) {
			this._defs.removeChild(this._pathDef);
		}
		
		// Set element style
		var setStyle = function (element, style) {
			var styleString = '';
			
			for (var key in style) {
				styleString += key + ': ' + style[key] + ';';
			}
			
			element.setAttribute('style', styleString);
			
			return element;
		};
		
		// Set attributes for an element
		var setAttr = function (element, attr) {
			for (var key in attr) {
				element.setAttribute(key, attr[key]);
			}
			
			return element;
		};
		
		this._text = this._createElement('text');
		
		var textNode = document.createTextNode(options.text);
		
		// If path is true, then create a textPath element and append it
		// to the text element; otherwise, populate the text element with a text node
		if (options.path) {
			
			var pathOptions = options.path;
			
			// Generate and set an id for the path - the textPath element will reference this id
			var pathID = L.Util.guid();

			var clonedPath = this._createElement('path');
			clonedPath.setAttribute('d', this._path.getAttribute('d'));
			clonedPath.setAttribute('id', pathID);
			
			if (!this._defs) {
				this._defs = this._createElement('defs');
				this._container.appendChild(this._defs);
			}
			
			this._defs.appendChild(clonedPath);
			this._pathDef = clonedPath;
			
			// Create the textPath element and add attributes to reference this path
			var textPath = this._createElement('textPath');
			
			if (pathOptions.startOffset) {
				textPath.setAttribute('startOffset', pathOptions.startOffset);
			}
			
			if (pathOptions.attr) {
				setAttr(textPath, pathOptions.attr);
			}
			
			if (pathOptions.style) {
				setStyle(textPath, pathOptions.style);
			}
			
			textPath.setAttributeNS(L.Path.XLINK_NS, 'xlink:href', '#' + pathID);
			textPath.appendChild(textNode);
			
			// Add the textPath element to the text element
			this._text.appendChild(textPath); 
		}
		else {
			this._text.appendChild(textNode);
			var anchorPoint = this.getTextAnchor();
			this.setTextAnchor(anchorPoint);
		}
		
		//className
		if (options.className) {
			this._text.setAttribute('class', options.className);
		}
		else {
			this._text.setAttribute('class', 'leaflet-svg-text');
		}
		
		//attributes		
		if (options.attr) {
			setAttr(this._text, options.attr);
		}
		
		//style
		if (options.style) {
			setStyle(this._text, options.style);
		}
		
		this._container.appendChild(this._text);
	}
};

/*
 * Functions that support additions to the basic SVG Path features provided by Leaflet
 */
var PathFunctions = PathFunctions || {
	__updateStyle: L.Path.prototype._updateStyle,
	
	_createDefs: function () {
		this._defs = this._createElement('defs');
		this._container.appendChild(this._defs);
	},
	
	_createGradient: function (options) {
	
		if (!this._defs) {
			this._createDefs();
		};
		
		if (this._gradient) {
			this._defs.removeChild(this._gradient);
		}
		
		var gradient = this._createElement('linearGradient');
		var gradientGuid = L.Util.guid();
		this._gradientGuid = gradientGuid;
		
		options = options !== true ? $.extend(true, {}, options) : {};
		
		var vector = options.vector || [['0%','0%'], ['100%','100%']];
		var vectorOptions = {
			x1: vector[0][0],
			x2: vector[1][0],
			y1: vector[0][1],
			y2: vector[1][1]
		};
		
		vectorOptions.id = 'grad' + gradientGuid;
		
		var stops = options.stops || [
			{
				offset: '0%',
				style: {
					color: 'rgb(255, 255, 255)',
					opacity: 1
				}
			},
			{
				offset: '60%',
				style: {
					color: this.options.fillColor || this.options.color,
					opacity: 1
				}
			}
		];
		
		for (var key in vectorOptions) {
			gradient.setAttribute(key, vectorOptions[key]);
		}
		
		for (var i = 0; i < stops.length; ++i) {
			var stop = stops[i];
			var stopElement = this._createElement('stop');
			
			stop.style = stop.style || {};
			
			for (var key in stop) {
				var stopProperty = stop[key];
				
				if (key === 'style') {
					var styleProperty = '';

					stopProperty.color = stopProperty.color || (this.options.fillColor || this.options.color);
					stopProperty.opacity = typeof stopProperty.opacity === 'undefined' ? 1 : stopProperty.opacity;
					
					for (var propKey in stopProperty) {
						styleProperty += 'stop-' + propKey + ':' + stopProperty[propKey] + ';';
					}
		
					stopProperty = styleProperty;
				}
				
				stopElement.setAttribute(key, stopProperty);
			}
			
			gradient.appendChild(stopElement);
		}
		
		this._gradient = gradient;
		this._defs.appendChild(gradient);
	},
	
	_createDropShadow: function (options) {
	
		if (!this._defs) {
			this._createDefs();
		};
		
		if (this._dropShadow) {
			this._defs.removeChild(this._dropShadow);
		}
		
		var filterGuid = L.Util.guid();
		var filter = this._createElement('filter');
		var feOffset = this._createElement('feOffset');
		var feGaussianBlur = this._createElement('feGaussianBlur');
		var feBlend = this._createElement('feBlend');
		
		options = options || {
			width: '200%',
			height: '200%'
		};
		
		options.id = 'filter' + filterGuid;
		
		for (var key in options) {
			filter.setAttribute(key, options[key]);
		}
		
		var offsetOptions = {
			result: 'offOut',
			'in': 'SourceAlpha',
			dx: '2',
			dy: '2'
		};
		
		var blurOptions = {
			result: 'blurOut',
			'in': 'offOut',
			stdDeviation: '2'
		};

		var blendOptions = {
			'in': 'SourceGraphic',
			in2: 'blurOut',
			mode: 'lighten'
		};

		for (var key in offsetOptions) {
			feOffset.setAttribute(key, offsetOptions[key]);
		}
		
		for (var key in blurOptions) {
			feGaussianBlur.setAttribute(key, blurOptions[key]);
		}
		
		for (var key in blendOptions) {
			feBlend.setAttribute(key, blendOptions[key]);
		}

		filter.appendChild(feOffset);
		filter.appendChild(feGaussianBlur);
		filter.appendChild(feBlend);
		
		this._dropShadow = filter;
		this._defs.appendChild(filter);
	},

	_createCustomElement: function (tag, attributes) {
		var element = this._createElement(tag);
		
		for (var key in attributes) {
			if (attributes.hasOwnProperty(key)) {
				element.setAttribute(key, attributes[key]);
			}
		}
		
		return element;
	},
	
	_createImage: function (imageOptions) {
		var image = this._createElement('image');
		image.setAttribute('width', imageOptions.width);
		image.setAttribute('height', imageOptions.height);
		image.setAttribute('x', imageOptions.x || 0);
		image.setAttribute('y', imageOptions.y || 0);
        image.setAttributeNS(L.Path.XLINK_NS, 'xlink:href', imageOptions.url);

		return image;
	},
	
	_createPattern: function (patternOptions) {
		var pattern = this._createCustomElement('pattern', patternOptions);
		return pattern;
	},
	
	_createShape: function (type, shapeOptions) {
		var shape = this._createCustomElement(type, shapeOptions);
		
		return shape;
	},
	
	// Override this in inheriting classes
	_applyCustomStyles: function () {
	},
	
	_createFillPattern: function (imageOptions) {
		var patternGuid = L.Util.guid();
		var patternOptions = imageOptions.pattern;

		patternOptions.id = patternGuid;
		patternOptions.patternUnits = patternOptions.patternUnits || 'objectBoundingBox';
		
		var pattern = this._createPattern(patternOptions);
		var image = this._createImage(imageOptions.image);
		
        image.setAttributeNS(L.Path.XLINK_NS, 'xlink:href', imageOptions.url);

		pattern.appendChild(image);
		
		if (!this._defs) {
			this._createDefs();
		};
		
		this._defs.appendChild(pattern);
		this._path.setAttribute('fill', 'url(#' + patternGuid + ')');
	},
	
	_getDefaultDiameter: function (radius) {
		return 1.75 * radius;
	},
	
	// Added for image circle
	_createShapeImage: function (imageOptions) {
		
		imageOptions = imageOptions || {};
		
		var patternGuid = L.Util.guid();
		
		var radius = this.options.radius || Math.max(this.options.radiusX, this.options.radiusY);
		var diameter = this._getDefaultDiameter(radius);
		var imageSize = imageOptions.imageSize || new L.Point(diameter, diameter);
		
		var circleSize = imageOptions.radius || diameter/2;

		var shapeOptions = imageOptions.shape || {
			circle: {
				r: circleSize,
				cx: 0,
				cy: 0
			}
		};
		
		var patternOptions = imageOptions.pattern || {
			width: imageSize.x,
			height: imageSize.y,
			x: 0,
			y: 0
		};
		
		var shapeKeys = Object.keys(shapeOptions);
		var shapeType = shapeKeys.length > 0 ? shapeKeys[0] : 'circle';
		
		shapeOptions[shapeType].fill = 'url(#' + patternGuid + ')';
		
		var shape = this._createShape(shapeType, shapeOptions[shapeType]);
		
		if (this.options.clickable) {
			shape.setAttribute('class', 'leaflet-clickable');
		}
		
		patternOptions.id = patternGuid;
		patternOptions.patternUnits = patternOptions.patternUnits || 'objectBoundingBox';
		
		var pattern = this._createPattern(patternOptions);
		
		var imageOptions = imageOptions.image || {
			width: imageSize.x,
			height: imageSize.y,
			x: 0,
			y: 0,
			url: this.options.imageCircleUrl
		};
		
		var image = this._createImage(imageOptions);
        image.setAttributeNS(L.Path.XLINK_NS, 'xlink:href', imageOptions.url);

		pattern.appendChild(image);
		this._defs.appendChild(pattern);
		this._container.insertBefore(shape, this._defs);

		this._shape = shape;
	},
	
	_updateStyle: function () {
		this.__updateStyle.call(this);
		
		if (this.options.stroke) {
			if (this.options.lineCap) {
				this._path.setAttribute('stroke-linecap', this.options.lineCap);
			}
		
			if (this.options.lineJoin) {
				this._path.setAttribute('stroke-linejoin', this.options.lineJoin);
			}
		}
		
		if (this.options.gradient) {
			this._createGradient(this.options.gradient);
			
			this._path.setAttribute('fill', 'url(#' + this._gradient.getAttribute('id') + ')');
		}
		else if (!this.options.fill) {
			this._path.setAttribute('fill', 'none');
		}
		
		if (this.options.dropShadow) {
			this._createDropShadow();

			this._path.setAttribute('filter', 'url(#' + this._dropShadow.getAttribute('id') + ')');
		}
		else {
			this._path.removeAttribute('filter');
		}
		
		this._applyCustomStyles();

	}

};

// Extend the TextFunctions above and change the __updatePath reference, since
// _updatePath for a line/polygon is different than for a regular path
var LineTextFunctions = $.extend(true, {}, TextFunctions);
LineTextFunctions.__updatePath = L.Polyline.prototype._updatePath;

// Pulled from the Leaflet discussion here:  https://github.com/Leaflet/Leaflet/pull/1586
// This is useful for getting a centroid/anchor point for centering text or other SVG markup
LineTextFunctions.getCenter = function () {
		var latlngs = this._latlngs,
				len = latlngs.length,
				i, j, p1, p2, f, center;

		for (i = 0, j = len - 1, area = 0, lat = 0, lng = 0; i < len; j = i++) {
				p1 = latlngs[i];
				p2 = latlngs[j];
				f = p1.lat * p2.lng - p2.lat * p1.lng;
				lat += (p1.lat + p2.lat) * f;
				lng += (p1.lng + p2.lng) * f;
				area += f / 2;
		}

		center = area ? new L.LatLng(lat / (6 * area), lng / (6 * area)) : latlngs[0];
		center.area = area;

		return center;
};

// Sets the text anchor to the centroid of a line/polygon
LineTextFunctions.getTextAnchor = function () {
	var center = this.getCenter();
	
	return this._map.latLngToLayerPoint(center);
};

L.Polyline.include(LineTextFunctions);
L.CircleMarker.include(TextFunctions);

L.Path.include(PathFunctions);
L.Polygon.include(PathFunctions);
L.Polyline.include(PathFunctions);
L.CircleMarker.include(PathFunctions);

/*
 * Rotates a point the provided number of degrees about another point.  Code inspired/borrowed from OpenLayers
 */
L.Point.prototype.rotate = function(angle, point) {
	var radius = this.distanceTo(point);
	var theta = (angle * L.LatLng.DEG_TO_RAD) + Math.atan2(this.y - point.y, this.x - point.x);
	this.x = point.x + (radius * Math.cos(theta));
	this.y = point.y + (radius * Math.sin(theta));
};

/*
 * Draws a Leaflet map marker using SVG rather than an icon, allowing the marker to be dynamically styled
 */
L.MapMarker = L.Path.extend({
	
	includes: TextFunctions,
	
	initialize: function (centerLatLng, options) {
		L.Path.prototype.initialize.call(this, options);
		this._latlng = centerLatLng;
	},

	options: {
		fill: true,
		fillOpacity: 1,
		opacity: 1,
		radius: 15,
		innerRadius: 5,
		position: {
			x: 0,
			y: 0
		},
		rotation: 0,
		numberOfSides: 50,
		color: '#000000',
		fillColor: '#0000FF',
		weight: 1,
		gradient: true,
		dropShadow: true,
		clickable: true
	},

	setLatLng: function (latlng) {
		this._latlng = latlng;
		return this.redraw();
	},
	
	projectLatlngs: function () {
		this._point = this._map.latLngToLayerPoint(this._latlng);
		this._points = this._getPoints();
		
		if (this.options.innerRadius > 0) {
			this._innerPoints = this._getPoints(true).reverse();
		}
	},

	getBounds: function () {
		var map = this._map,
			height = this.options.radius * 3,
			point = map.project(this._latlng),
			swPoint = new L.Point(point.x - this.options.radius, point.y),
			nePoint = new L.Point(point.x + this.options.radius, point.y - height),
			sw = map.unproject(swPoint),
			ne = map.unproject(nePoint);

		return new L.LatLngBounds(sw, ne);
	},

	getLatLng: function () {
		return this._latlng;
	},

	getPathString: function () {
		var anchorPoint = this.getTextAnchor();

		if (this._shape) {
			if (this._shape.tagName === 'circle') {
				this._shape.setAttribute('cx', anchorPoint.x);
				this._shape.setAttribute('cy', anchorPoint.y);
			}
			else {
				this._shape.setAttribute('x', anchorPoint.x);
				this._shape.setAttribute('y', anchorPoint.y);
			}
		}

		this._path.setAttribute('shape-rendering', 'geometricPrecision');
		return new L.SVGPathBuilder(this._points, this._innerPoints).build(6);
	},

	getTextAnchor: function () {
		return new L.Point(this._point.x, this._point.y - 2 * this.options.radius);
	},
	
	_getPoints: function (inner) {
		var maxDegrees = !inner ? 210 : 360;
		var angleSize = !inner ? maxDegrees / 50 : maxDegrees / Math.max(this.options.numberOfSides, 3);
		var degrees = !inner ? maxDegrees : maxDegrees + this.options.rotation;
		var angle = !inner ? -30 : this.options.rotation;
		var points = [];
		var newPoint;
		var angleRadians;
		var radius = this.options.radius;
		var multiplier = Math.sqrt(0.75);
		
		var toRad = function (number) {
			return number * L.LatLng.DEG_TO_RAD;
		};
		
		var startPoint = this._point;
		
		if (!inner) {
			points.push(startPoint);
			points.push(new L.Point(startPoint.x + multiplier * radius, startPoint.y - 1.5 * radius));
		}
		
		while (angle < degrees) {
			
			angleRadians = toRad(angle);
			
			// Calculate the point the radius pixels away from the center point at the
			// given angle;
			newPoint = this._getPoint(angleRadians, radius, inner);
			
			// Add the point to the latlngs array
			points.push(newPoint);
			
			// Increment the angle
			angle += angleSize;
		}
		
		if (!inner) {
			points.push(new L.Point(startPoint.x - multiplier * radius, startPoint.y - 1.5 * radius));
		}
		
		return points;
	},
	
	_getPoint: function (angle, radius, inner) {
		var markerRadius = radius;
		
		radius = !inner ? radius : this.options.innerRadius;
		
		return new L.Point(this._point.x + this.options.position.x + radius * Math.cos(angle), this._point.y - 2 * markerRadius + this.options.position.y - radius * Math.sin(angle));
	},
	
	_applyCustomStyles: function () {
		// Added for image circle
		if (this.options.shapeImage || this.options.imageCircleUrl) {
			this._createShapeImage(this.options.shapeImage);
		}
		else if (this.options.fillPattern) {
			this._createFillPattern(this.options.fillPattern);
		}
	}
});

L.mapMarker = function (centerLatLng, options) {
	return new L.MapMarker(centerLatLng, options);
};

/*
 * Draws a regular polygon marker on the map given a radius (or x and y radii) in pixels
 */
L.RegularPolygonMarker = L.Path.extend({
	includes: TextFunctions,
	
	initialize: function (centerLatLng, options) {
		L.Path.prototype.initialize.call(this, options);
		
		this._latlng = centerLatLng;

		this.options.numberOfSides = Math.max(this.options.numberOfSides, 3);
	},

	options: {
		fill: true,
		radiusX: 10,
		radiusY: 10,
		rotation: 0,
		numberOfSides: 3,
		position: {
			x: 0,
			y: 0
		},
		maxDegrees: 360,
		gradient: true,
		dropShadow: false,
		clickable: true
	},

	setLatLng: function (latlng) {
		this._latlng = latlng;
		return this.redraw();
	},
	
	projectLatlngs: function () {
		this._point = this._map.latLngToLayerPoint(this._latlng);
		this._points = this._getPoints();
		
		if (this.options.innerRadius || (this.options.innerRadiusX && this.options.innerRadiusY)) {
			this._innerPoints = this._getPoints(true).reverse();
		}
	},

	getBounds: function () {
		var map = this._map,
			radiusX = this.options.radius || this.options.radiusX,
			radiusY = this.options.radius || this.options.radiusY,
			deltaX = radiusX * Math.cos(Math.PI / 4),
			deltaY = radiusY * Math.sin(Math.PI / 4),
			point = map.project(this._latlng),
			swPoint = new L.Point(point.x - deltaX, point.y + deltaY),
			nePoint = new L.Point(point.x + deltaX, point.y - deltaY),
			sw = map.unproject(swPoint),
			ne = map.unproject(nePoint);

		return new L.LatLngBounds(sw, ne);
	},

	getLatLng: function () {
		return this._latlng;
	},

	getPathString: function () {
		this._path.setAttribute('shape-rendering', 'geometricPrecision');
		
		var anchorPoint = this.getTextAnchor();

		if (this._shape) {
			if (this._shape.tagName === 'circle') {
				this._shape.setAttribute('cx', anchorPoint.x);
				this._shape.setAttribute('cy', anchorPoint.y);
			}
			else {
				this._shape.setAttribute('x', anchorPoint.x);
				this._shape.setAttribute('y', anchorPoint.y);
			}
		}

		return new L.SVGPathBuilder(this._points, this._innerPoints).build(6);
	},

	_getPoints: function (inner) {
		var maxDegrees = this.options.maxDegrees || 360;
		var angleSize = maxDegrees / Math.max(this.options.numberOfSides, 3);
		var degrees = maxDegrees; //+ this.options.rotation;
		var angle = 0; //this.options.rotation;
		var points = [];
		var newPoint;
		var angleRadians;
		var radiusX = !inner ? this.options.radius || this.options.radiusX : this.options.innerRadius || this.options.innerRadiusX;
		var radiusY = !inner ? this.options.radius || this.options.radiusY : this.options.innerRadius || this.options.innerRadiusY;
		
		var toRad = function (number) {
			return number * L.LatLng.DEG_TO_RAD;
		};
		
		while (angle < degrees) {
			
			angleRadians = toRad(angle);
			
			// Calculate the point the radius pixels away from the center point at the
			// given angle;
			newPoint = this._getPoint(angleRadians, radiusX, radiusY);
			
			// Add the point to the latlngs array
			points.push(newPoint);
			
			// Increment the angle
			angle += angleSize;
		}

		return points;
	},
	
	_getPoint: function (angle, radiusX, radiusY) {
		var startPoint = this.options.position ? this._point.add(new L.Point(this.options.position.x, this.options.position.y)) : this._point;
		var point = new L.Point(startPoint.x + radiusX * Math.cos(angle), startPoint.y + radiusY * Math.sin(angle));
		
		point.rotate(this.options.rotation, startPoint);
		
		return point;
	},
	
	_getDefaultDiameter: function (radius) {
		var angle = Math.PI/this.options.numberOfSides;
		var minLength = radius * Math.cos(angle)
		
		return 1.75 * minLength;
	},
	
	_applyCustomStyles: function () {
		// Added for image circle
		if (this.options.shapeImage || this.options.imageCircleUrl) {
			this._createShapeImage(this.options.shapeImage);
		}
		else if (this.options.fillPattern) {
			this._createFillPattern(this.options.fillPattern);
		}
	}
});

L.regularPolygonMarker = function (centerLatLng, options) {
	return new L.RegularPolygonMarker(centerLatLng, options);
};

// Displays a star on the map
L.StarMarker = L.RegularPolygonMarker.extend({
	options: {
		numberOfPoints: 5,
		rotation: -15.0,
		maxDegrees: 360,
		gradient: true,
		dropShadow: true
	},
	
	_getPoints: function (inner) {
		var maxDegrees = this.options.maxDegrees || 360;
		var angleSize = maxDegrees / this.options.numberOfPoints;
		var degrees = maxDegrees; // + this.options.rotation;
		var angle = 0; //this.options.rotation;
		var points = [];
		var newPoint, newPointInner;
		var angleRadians;
		var radiusX = !inner ? this.options.radius || this.options.radiusX : this.options.innerRadius || this.options.innerRadiusX;
		var radiusY = !inner ? this.options.radius || this.options.radiusY : this.options.innerRadius || this.options.innerRadiusY;
		
		var toRad = function (number) {
			return number * L.LatLng.DEG_TO_RAD;
		};

		while (angle < degrees) {
			
			angleRadians = toRad(angle);
			
			// Calculate the point the radius meters away from the center point at the
			// given angle;
			newPoint = this._getPoint(angleRadians, radiusX, radiusY);
			newPointInner = this._getPoint(angleRadians + toRad(angleSize) / 2, radiusX / 2, radiusY / 2);
			
			// Add the point to the latlngs array
			points.push(newPoint);
			points.push(newPointInner);
			
			// Increment the angle
			angle += angleSize;
		}
		
		return points;
	}
});

L.starMarker = function (centerLatLng, options) {
	return new L.StarMarker(centerLatLng, options);
};

L.TriangleMarker = L.RegularPolygonMarker.extend({
	options: {
		numberOfSides: 3,
		rotation: 30.0,
		radius: 5
	}
});

L.triangleMarker = function (centerLatLng, options) {
	return new L.TriangleMarker(centerLatLng, options);
};

L.DiamondMarker = L.RegularPolygonMarker.extend({
	options: {
		numberOfSides: 4,
		radiusX: 5,
		radiusY: 10
	}
});

L.diamondMarker = function (centerLatLng, options) {
	return new L.DiamondMarker(centerLatLng, options);
};

L.SquareMarker = L.RegularPolygonMarker.extend({
	options: {
		numberOfSides: 4,
		rotation: 45.0,
		radius: 5
	}
});

L.squareMarker = function (centerLatLng, options) {
	return new L.SquareMarker(centerLatLng, options);
};

L.PentagonMarker = L.RegularPolygonMarker.extend({
	options: {
		numberOfSides: 5,
		rotation: -18.0,
		radius: 5
	}
});

L.pentagonMarker = function (centerLatLng, options) {
	return new L.PentagonMarker(centerLatLng, options);
};

L.HexagonMarker = L.RegularPolygonMarker.extend({
	options: {
		numberOfSides: 6,
		rotation: 30.0,
		radius: 5
	}
});

L.hexagonMarker = function (centerLatLng, options) {
	return new L.HexagonMarker(centerLatLng, options);
};

L.OctagonMarker = L.RegularPolygonMarker.extend({
	options: {
		numberOfSides: 8,
		rotation: 22.5,
		radius: 5
	}
});

L.octagonMarker = function (centerLatLng, options) {
	return new L.OctagonMarker(centerLatLng, options);
};

/*
 * Class for putting custom SVG on the map.  This is experimental and a little bit of a hack 
 */
L.SVGMarker = L.Path.extend({

	initialize: function (latlng, options) {
		L.Path.prototype.initialize.call(this, options);
		
		this._svg = options.svg;
		
		if (this._svg.indexOf('<') === 0) {
			this._data = this._svg;
		}
		
		this._latlng = latlng;
	},
	
	projectLatlngs: function () {
		this._point = this._map.latLngToLayerPoint(this._latlng);
	},
	
	getPathString: function () {
		var me = this;
		
		var addSVG = function () {
			var $g = $(me._path).parent('g');
			
			if (me.options.clickable) {
				$g.attr('class','leaflet-clickable');
			}
			
			var $data = $(me._data);
			var $svg;
			
			$svg = $data.prop('tagName') === 'svg' ? $data.clone(true) : $data.find('svg').clone(true);
			
			if (me.options.setStyle) {
				me.options.setStyle.call(me, $svg);
			}
			
			var elementWidth = $svg.attr('width');
			var elementHeight = $svg.attr('height');
			
			var width = elementWidth ? elementWidth.replace('px','') : '100%';
			var height = elementHeight ? elementHeight.replace('px','') : '100%';
			
			if (width === '100%') {
				width = me.options.size.x;
				height = me.options.size.y;
				
				$svg.attr('width', width);
				$svg.attr('height', height);
			}
			
			var size = me.options.size || new L.Point(width, height);
			
			var scaleSize = new L.Point(size.x/width, size.y/height);
			
			$g.find('svg').remove();
			$g.append($svg);

			var transforms = [];
			var anchor = me.options.anchor || new L.Point(-size.x/2, -size.y/2);
			var x = me._point.x + anchor.x;
			var y = me._point.y + anchor.y;
			
			transforms.push('translate(' + x + ' ' + y + ')');
			transforms.push('scale(' + scaleSize.x + ' ' + scaleSize.y + ')');
			
			
			if (me.options.rotation) {
				transforms.push('rotate(' + me.options.rotation + ' ' + (width/2) + ' ' + (height/2) + ')'); //' ' + -1 * anchor.x + ' ' + -1 * anchor.y + ')');
			}
			
			$g.attr('transform', transforms.join(' '));
		};
		
		if (!this._data) {
			$.get(this._svg, null, function (data) {
				me._data = data;
				addSVG();
			});
		}
		else {
			addSVG();
		}
	}
	
});