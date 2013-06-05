// ----- Canvas globals -----

var maincanvas;
var drawingContext;

var canvasCenterX;
var canvasCenterY;

// ----- Hexagon drawing parameters -----

var size = 100;
var defaultFillStyle = "#ffffff";
var strokeStyle = "#000000";
var lineWidth = 3;
var resourceTypeToColor = {
	"ore": "#000000",
	"clay": "#ff0000",
	"wool": "#008800",
	"wood": "#00ff00",
	"wheat": "#555500",
	"none": "#ffffff"
};

// ----- Grid layout globals -----

var dx = size * Math.cos(Math.PI/3);
var dy = size * Math.sin(Math.PI/3);

// Initialize page.
function init() {
	
	maincanvas = $('#maincanvas')[0];
	drawingContext = maincanvas.getContext('2d');
	resizeCanvas();
	
	h1 = new HexTile();
	h1.setCenter(100,100);
	h1.setResourceType("clay");
	h1.draw();
	
	h2 = new HexTile();
	h2.setCenter(100,100+2*dy);
	h2.setResourceType("wool");
	h2.draw();
	
	h3 = new HexTile();
	h3.setCenter(200+dx,100+dy);
	h3.setResourceType("wheat");
	h3.draw();
	
}

function HexTile() {
	this.xCenter;
	this.yCenter;
	this.resourceType = "none";
	this.fillStyle = defaultFillStyle;
}
HexTile.prototype.strokeStyle = strokeStyle;
HexTile.prototype.lineWidth = lineWidth;
HexTile.prototype.hexColorMap = resourceTypeToColor;
HexTile.prototype.size = size;
HexTile.prototype.setResourceType = function(resourceType) {
	if (this.hexColorMap[resourceType]) {
		this.resourceType = resourceType;
		this.fillStyle = this.hexColorMap[resourceType];
	} else {
		console.log("Unrecognized resource type.");
	}
}
HexTile.prototype.setSize = function(size) {
	this.size = size;
}
HexTile.prototype.setCenter = function(x,y) {
	this.xCenter = x;
	this.yCenter = y;
}
HexTile.prototype.draw = function() {
	
	drawingContext.strokeStyle = this.strokeStyle;
	drawingContext.lineWidth = this.lineWidth;
	drawingContext.fillStyle = this.fillStyle;
	
	var angleOffset = Math.PI / 6;
	
	// Begin Path and start at top of hexagon
	drawingContext.beginPath();
	drawingContext.moveTo (
		this.xCenter + this.size * Math.sin(angleOffset),
		this.yCenter - this.size * Math.cos(angleOffset)
	);
	// Move clockwise and draw hexagon
	var newAngle;
	for (var i = 1; i <= 6; i += 1) {
		newAngle = i * Math.PI / 3;
		drawingContext.lineTo (
			this.xCenter + this.size * Math.sin(newAngle + angleOffset),
			this.yCenter - this.size * Math.cos(newAngle + angleOffset)
		);
	}
	drawingContext.closePath();
	
	drawingContext.fill();
	drawingContext.stroke();
	
}

Array.prototype.random = function(removeElem) {
	var idx = Math.floor(Math.random() * this.length);
	var val = this[idx];
	if (removeElem) {
		this.splice(idx,1);
	}
	return val;
}
Array.prototype.copy = function() {
	return this.slice();
}

function resizeCanvas()
{
	$(maincanvas).attr("width", 600);
	$(maincanvas).attr("height", 400);
	//$(maincanvas).attr("width", $(window).width());
	//$(maincanvas).attr("height", $(window).height());
	canvasCenterY = maincanvas.height/2;
	canvasCenterX = maincanvas.width/2;
}
