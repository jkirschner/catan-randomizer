// ----- Canvas globals -----

var maincanvas;
var drawingContext;

var canvasCenterX;
var canvasCenterY;

// ----- Hexagon drawing parameters -----

var size = 50;
var defaultFillStyle = "#ffffff";
var strokeStyle = "#000000";
var lineWidth = 3;
var resourceTypeToColor = {
	"ore": "#363636",
	"clay": "#E83200",
	"wool": "#98E82E",
	"wood": "#0A7300",
	"wheat": "#E0E000",
	"desert": "#F2F0A0",
	"none": "#ffffff"
};

// ----- Grid layout globals -----

var dx = size * (1 + Math.cos(Math.PI/3)) / 2;
var dy = size * Math.sin(Math.PI/3);

// Initialize page.
function init() {
	
	maincanvas = $('#maincanvas')[0];
	drawingContext = maincanvas.getContext('2d');
	resizeCanvas();
	
	/*
	h1 = new HexTile();
	h1.setCoordinate(0,0);
	h1.setResourceType("clay");
	h1.draw();
	
	h2 = new HexTile();
	h2.setCoordinate(0,2);
	h2.setResourceType("wool");
	h2.draw();
	
	h3 = new HexTile();
	h3.setCoordinate(2,1);
	h3.setResourceType("desert");
	h3.draw();
	*/
	
	var cm = new CatanMap();
	
}

function CatanMap() {
	
	this.hexTiles = [];
	
	var numTiles = 19;
	var tileCoordinates = [
		[-4,2],[-4,0],[-4,-2],
		[-2,3],[-2,1],[-2,-1],[-2,-3],
		[0,4],[0,2],[0,0],[0,-2],[0,-4],
		[2,3],[2,1],[2,-1],[2,-3],
		[4,2],[4,0],[4,-2]
	];
	var tileNumber = [2,3,3,4,4,5,5,6,6,7,8,8,9,9,10,10,11,11,12];
	var tileTypes = [
		"wood","wood","wood","wood",
		"clay","clay","clay",
		"wool","wool","wool","wool",
		"ore","ore","ore",
		"wheat","wheat","wheat","wheat",
		"desert"
	];
	
	for (var i = 0; i < numTiles; i += 1) {
		
		var newHexTile = new HexTile();
		
		newHexTile.setCoordinate.apply(
			newHexTile,
			tileCoordinates.shift()
		);
		
		newHexTile.setResourceType(tileTypes.random(true));
		var newTileNumber = tileNumber.random(true);
		
		newHexTile.draw();
		
		console.log(i,newHexTile.resourceType,newHexTile.fillStyle,newTileNumber);
		console.log(newHexTile.xCenter,newHexTile.yCenter);
	}
	
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
		console.log("Unrecognized resource type:",resourceType);
	}
}
HexTile.prototype.setSize = function(size) {
	this.size = size;
}
HexTile.prototype.setCoordinate = function(x,y) {
	this.xCenter = canvasCenterX + dx*x;
	this.yCenter = canvasCenterY + dy*y;
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
	//$(maincanvas).attr("width", 600);
	//$(maincanvas).attr("height", 400);
	$(maincanvas).attr("width", $(window).width());
	$(maincanvas).attr("height", $(window).height());
	canvasCenterY = maincanvas.height/2;
	canvasCenterX = maincanvas.width/2;
}
