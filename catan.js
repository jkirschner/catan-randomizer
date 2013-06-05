var maincanvas;
var drawingContext;

// Initialize page.
function init() {
	
	maincanvas = $('#maincanvas')[0];
	drawingContext = maincanvas.getContext('2d');
	resizeCanvas();
	
	h1 = new HexTile();
	h1.setSize(100);
	h1.setCenter(100,100);
	h1.setResourceType("clay");
	h1.draw();
	
	h2 = new HexTile();
	h2.setSize(100);
	h2.setCenter(100,100+2*h2.getMinLength());
	h2.setResourceType("wool");
	h2.draw();
	
}

function HexTile() {
	this.size;
	this.xCenter;
	this.yCenter;
	this.resourceType = "none";
	this.fillStyle = "fff"
}
HexTile.prototype.strokeStyle = "#000000";
HexTile.prototype.lineWidth = 1;
HexTile.prototype.hexColorMap = {
	"ore": "000",
	"clay": "f00",
	"wool": "080",
	"wood": "0f0",
	"wheat": "550",
	"none": "fff"
}
HexTile.prototype.getMinLength = function() {
	// Interior angle of a hexagon: 720
	// For a regular hexagon: 720 / 6 = 120 deg
	// 120 deg -> 2*pi/3
	// Bisected -> 120/2 = 60 deg
	return this.size * Math.sin(2*Math.PI/3);
}
HexTile.prototype.setResourceType = function(resourceType) {
	if (this.hexColorMap[resourceType]) {
		this.resourceType = resourceType;
		this.fillStyle = this.hexColorMap[resourceType];
	} else {
		console.log("Unrecognize resource type.");
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
	
	drawingContext.strokeStyle = this.strokeStyle;
	drawingContext.lineWidth = this.lineWidth;
	drawingContext.fillStyle = this.fillStyle;
	drawingContext.fill();
	drawingContext.stroke();
	
}


function test() {
	
var cxt = drawingContext;
// hexagon
var numberOfSides = 6,
    size = 100,
    Xcenter = 100,
    Ycenter = 100;

cxt.beginPath();
cxt.moveTo (Xcenter + size * Math.sin(0), Ycenter - size * Math.cos(0));
//cxt.moveTo (Xcenter +  size * Math.cos(0), Ycenter +  size *  Math.sin(0));          

for (var i = 1; i <= numberOfSides;i += 1) {
    cxt.lineTo (Xcenter + size * Math.sin(i * 2 * Math.PI / numberOfSides), Ycenter - size * Math.cos(i * 2 * Math.PI / numberOfSides));
}

cxt.strokeStyle = "#000000";
cxt.lineWidth = 1;
cxt.fillStyle = '#f00';
cxt.fill();
cxt.stroke();

}


function resizeCanvas()
{
	$(maincanvas).attr("width", 600);
	$(maincanvas).attr("height", 400);
	//$(maincanvas).attr("width", $(window).width());
	//$(maincanvas).attr("height", $(window).height());
	centerY = maincanvas.height/2;
	centerX = maincanvas.width/2;
}
