// ----- Canvas globals -----

var maincanvas;
var drawingContext;

var canvasCenterX;
var canvasCenterY;

// ----- Hexagon drawing parameters -----

var mapStyle = "retro";

var size = 80;
var defaultFillStyle = "#ffffff";
var strokeStyle = "#000000";
var lineWidth = 3;
var resourceTypeToColor = {
	"ore": "#363636",
	"clay": "#E83200",
	"wool": "#98E82E",
	"wood": "#0A7300",
	"grain": "#E0E000",
	"desert": "#F2F0A0",
	"none": "#ffffff"
};
var resourceTypeToImageCanvas = {
	"ore": null,
	"clay": null,
	"wool": null,
	"wood": null,
	"grain": null,
	"desert": null
};

//var allImagesLoaded = false;

// ----- Grid layout globals -----

var dx = size * (1 + Math.cos(Math.PI/3)) / 2;
var dy = size * Math.sin(Math.PI/3);

function preloadImages(arr, callback){
	//http://www.javascriptkit.com/javatutors/preloadimagesplus.shtml
	
    var newimages=[], loadedimages=0;
    var postaction=function(){};
    var arr=(typeof arr!="object")? [arr] : arr;
    function imageloadpost(){
        loadedimages++;
        if (loadedimages==arr.length){
            callback(newimages); //call postaction and pass in newimages array as parameter
        }
    }
    for (var i=0; i<arr.length; i++){
        newimages[i]=new Image();
        newimages[i].src=arr[i];
        newimages[i].onload=function(){
            imageloadpost();
        }
        newimages[i].onerror=function(){
            imageloadpost();
        }
    }

}

function init_test() {

	var canvas = document.createElement("canvas");
	canvas.id = "map-canvas";
	document.getElementById('map-container').appendChild(canvas); 
	
}

function loadImages(callback) {

	var rTypes = [];
	var imgPaths = [];
	for (var key in resourceTypeToImageCanvas) {
		rTypes.push(key);
		imgPaths.push("images/"+key+".png");
	}
	
	preloadImages(imgPaths, function(images) {
		
		for (var i = 0; i < imgPaths.length; i += 1) {
			//resourceTypeToImage[ rTypes[i] ] = images[i];
			var img = images[i];
			var imgCanvas = document.createElement("canvas");
			var imgContext = imgCanvas.getContext("2d");
			
			imgCanvas.width = img.width;
			imgCanvas.height = img.height;
			imgContext.drawImage(img, 0, 0);
			
			resourceTypeToImageCanvas[ rTypes[i] ] = imgCanvas;
		}
		
		callback();
		
	});
	
}

// Initialize page.
function init() {
	
	// Load necessary image resources.
	loadImages(function() {
		// Get canvas context and re-size canvas.
		maincanvas = $('#map-canvas')[0];
		drawingContext = maincanvas.getContext('2d');
		//resizeCanvas();
		
		var cm = new CatanMap();
		cm.draw();
	});
	
}

function CatanMap() {
	
	this.hexTiles = [];
	this.coordToTile = {};
	
	var numTiles = 19;
	var tileCoordinates = [
		[-4,2],[-4,0],[-4,-2],
		[-2,3],[-2,1],[-2,-1],[-2,-3],
		[0,4],[0,2],[0,0],[0,-2],[0,-4],
		[2,3],[2,1],[2,-1],[2,-3],
		[4,2],[4,0],[4,-2]
	];
	var tileNumber = [2,3,3,4,4,5,5,6,6,8,8,9,9,10,10,11,11,12];
	var tileTypes = [
		"wood","wood","wood","wood",
		"clay","clay","clay",
		"wool","wool","wool","wool",
		"ore","ore","ore",
		"grain","grain","grain","grain",
	];
	
	// Handle desert(s)
	
	var desertHexTile = new HexTile();
	var newCoords = tileCoordinates.random(true);
	desertHexTile.setCoordinate.apply(
		desertHexTile,
		newCoords
	);
	desertHexTile.setResourceType("desert");
	this.hexTiles.push(desertHexTile);
	this.coordToTile[newCoords.toString()] = desertHexTile;
	
	// Move all highly productive tile number (6 and 8) to the front
	// of the tileNumber array
	var highlyProductiveIdx = [];
	highlyProductiveIdx = highlyProductiveIdx.concat(
		tileNumber.indexOfArray(6),
		tileNumber.indexOfArray(8)
	);
	for (var i = 0; i < highlyProductiveIdx.length; i += 1) {
		tileNumber.swap(i,highlyProductiveIdx[i]);
	}
	
	// Handle all other tiles
	for (var i = 0; i < (numTiles - 1); i += 1) {
		
		var newHexTile = new HexTile();
		newHexTile.setNumber(tileNumber[i]);
		newHexTile.setResourceType(tileTypes.random(true));
		
		var newCoords = [];
		var valid;
		
		if ( newHexTile.isHighlyProductive() ) {
			var tmpCoords = [];
			do {
				newCoords = tileCoordinates.random(true);
				newHexTile.setCoordinate.apply(
					newHexTile,
					newCoords
				);
				invalid = this.hasHighlyProductiveNeighbors(newHexTile);
				if (invalid) {
					tmpCoords.push(newCoords);
				}
			} while ( invalid );
			tileCoordinates = tileCoordinates.concat(tmpCoords);
		} else {
			newCoords = tileCoordinates.random(true);
			newHexTile.setCoordinate.apply(
				newHexTile,
				newCoords
			);
		}
		
		this.hexTiles.push(newHexTile);
		this.coordToTile[newCoords.toString()] = newHexTile;

	}
	
}
CatanMap.prototype.draw = function() {
	
	for (var i = 0; i < this.hexTiles.length; i += 1) {
		this.hexTiles[i].draw();
	}
	
}
CatanMap.prototype.getAdjacentTiles = function(tile) {
	
	var tileX = tile.gridX;
	var tileY = tile.gridY;
	
	var adjTiles = [];
	
	// (+0,+2), (+2,+1), (+2,-1), (+0,-2), (-2,-1), (-2,1)
	xshift = [0, 2, 2, 0, -2, -2];
	yshift = [2, 1, -1, -2, -1, 1];
	
	for (var i = 0; i < 6; i += 1) {
		var adjTile = this.coordToTile[
			[tileX + xshift[i], tileY + yshift[i]].toString()
		];
		// Will be null if no hex tile found at that coordinate
		if (adjTile) {
			adjTiles.push(adjTile);
		}
	}
	
	return adjTiles;
	
}
CatanMap.prototype.hasHighlyProductiveNeighbors = function(tile) {
	var adjacentTiles = this.getAdjacentTiles(tile);
	for (var i = 0; i < adjacentTiles.length; i += 1) {
		if ( adjacentTiles[i].isHighlyProductive() ) {
			return true;
		}
	}
	return false;
}

function HexTile() {
	this.gridX;
	this.gridY;
	this.xCenter;
	this.yCenter;
	this.resourceType = "none";
	this.fillStyle = defaultFillStyle;
	this.number;
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
HexTile.prototype.isHighlyProductive = function() {
	return ( (this.number == 6) || (this.number == 8) );
}
HexTile.prototype.setNumber = function(number) {
	this.number = number;
}
HexTile.prototype.setCoordinate = function(x,y) {
	this.xCenter = canvasCenterX + dx*x;
	this.yCenter = canvasCenterY + dy*y;
	this.gridX = x;
	this.gridY = y;
}
HexTile.prototype.draw = function() {
	this.drawBase();
	// Don't draw number if desert
	if (this.number) {
		this.drawNumber();
	}
}
HexTile.prototype.drawBase = function() {
	
	if (mapStyle == "retro") {
		drawingContext.lineWidth = 10;
		drawingContext.fillStyle = "rgba(255,255,255,0)";
		drawingContext.strokeStyle = "#FAEB96";
	} else {
		drawingContext.lineWidth = this.lineWidth;
		drawingContext.fillStyle = this.fillStyle;
		drawingContext.strokeStyle = this.strokeStyle;
	}
	
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
	
	if (mapStyle == "retro") {
		
		var imgCanvas = resourceTypeToImageCanvas[this.resourceType];
		
		drawingContext.drawImage(
			imgCanvas,
			0, 0, imgCanvas.width, imgCanvas.height, 
			this.xCenter - size,
			this.yCenter - dy,
			2*size,
			2*dy
		);
		
	}
	
	drawingContext.fill();
	drawingContext.stroke();
	
}
HexTile.prototype.drawNumber = function() {

	drawingContext.fillStyle = "#FFFFFF";
	drawingContext.strokeStyle = "#000000";
	drawingContext.lineWidth = 3;
	
	drawingContext.beginPath();
	drawingContext.arc(this.xCenter, this.yCenter, 0.375 * this.size,
		0, 2 * Math.PI, false);
	drawingContext.closePath();
	
	drawingContext.fill();
	drawingContext.stroke();
	
	var fontSizePt = Math.ceil(30/40*(.45*this.size-8)+6);
	
	drawingContext.font = "bold " + fontSizePt + "pt sans-serif";
	drawingContext.textAlign = "center";
	if ( this.isHighlyProductive() ) {
		drawingContext.fillStyle = "#FF0000";
	} else {
		drawingContext.fillStyle = "#000000";
	}
	drawingContext.fillText(
		this.number.toString(),
		this.xCenter,
		this.yCenter + Math.ceil( 0.85 * fontSizePt/2 )
	);
	
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
Array.prototype.indexOfArray = function(val) {
	var arr = [];
	var sIdx = 0;
	var tmpCopy = this.copy();
	do {
		var rIdx = tmpCopy.indexOf(val);
		var valid = (rIdx >= 0);
		if (valid) {
			tmpCopy.splice(0, rIdx + 1);
			arr.push(sIdx + rIdx);
			sIdx += rIdx + 1;
		}
	} while (valid);
	return arr;
}
Array.prototype.swap = function(idx1, idx2) {
	var tmp = this[idx1];
	this[idx1] = this[idx2];
	this[idx2] = tmp;
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
