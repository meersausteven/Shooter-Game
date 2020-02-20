/*
// NEW CODE

// declare variables that are needed globally

var playerXP = 0, playerScore = 0;
var playerSpeed = 1, playerShotDamage = 1, playerShotType = 1, playerShotSpeed = 1;
var playerHealth = 10;
var playerUpgrades = [], playerShots = []
var playerSpeedLevel = 0, playerDamageLevel = 0, playerHealthLevel = 0, playerShotType = 0, playShotStyle = 0;

var gameWave = 0;
var enemies = [], enemyShots[];
var mousePos;

function startGame() {
	player = new PlayerObject(playerHealth, playerSpeed);
	gameArea.start();
}

var gameArea = {
	canvas : document.createElement("canvas"),
	start : function() {
		this.canvas.width = 1200;
		this.canvas.height = 600;
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.frameNo = 0;
		this.interval = setInterval(updateGameArea, 20);
		window.addEventListener('keydown', function (e) {
			e.preventDefault();
			myGameArea.keys = (myGameArea.keys || []);
			myGameArea.keys[e.keyCode] = (e.type == "keydown");
		})
		window.addEventListener('keyup', function (e) {
			myGameArea.keys[e.keyCode] = (e.type == "keydown");
		})
		this.canvas.addEventListener('mousemove', function (e) {
       			mousePos = getMousePos(this.canvas, e);
		}
	},
	stop : function() {
		clearInterval(this.interval);
	},    
	clear : function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}

class PlayerObject(health, damage, speed, shots) {
	this.width = 50;
	this.height = 50;
	this.speedX = 0;
	this.speedY = 0;   
	this.angle = 0;
	this.moveAngle = Math.asin( (mousePos.y - this.y) , Math.sqrt( Math.pow(mousePos.x - this.x, 2) + Math.pow(mousePos.y - this.y, 2) );
	this.x = gameArea.canvas.width / 2;
	this.y = gameArea.canvas.height / 2;
	this.acceleration = 0;
	this.friction = 0;
	this.accelerationSpeed = 0;
	
	this.update = function() {
		ctx = gameArea.context;
		ctx.rotate(this.angle);
		ctx.drawImage('images/playerShip.png', this.x, this.y);
		ctx.restore();
	}
	
	this.update = function() {
		ctx = myGameArea.context;
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.angle);
		ctx.fillStyle = color;
		ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
		ctx.restore();
	}
	
	this.newPos = function() {
		this.angle += this.moveAngle * Math.PI / 180;
		this.x += this.speed * Math.sin(this.angle);
		this.y -= this.speed * Math.cos(this.angle);
	}
}

function getMousePos(canvas, event) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: event.clientX - rect.left,
		y: event.clientY - rect.top
	};
}

// FOLLOWING CODE IS TAKE FROM w3schools.com's CANVAS GAME TUTORIAL
// i will use the code to learn how to use canvas for games

// ###
// flappy bird style game
// ###

var myGamePiece;
var myObstacles = [];
var myScore;

function startGame() {
    myGamePiece = new component(30, 30, "red", 10, 120);
    myGamePiece.gravity = 0.05;
    myScore = new component("30px", "Consolas", "black", 280, 40, "text");
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
	this.rect = this.canvas.getBoundingClientRect();
	this.mouseX = event.clientX - this.rect.left;
	this.mouseY = event.clientY - this.rect.top;
        this.interval = setInterval(updateGameArea, 20);
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
    }
    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            return;
        } 
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new component(10, height, "green", x, 0));
        myObstacles.push(new component(10, x - height - gap, "green", x, height + gap));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }
    myScore.text="SCORE: " + myGameArea.frameNo;
    myScore.update();
    myGamePiece.newPos();
    myGamePiece.update();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function accelerate(n) {
    myGamePiece.gravity = n;
}

<button onmousedown="accelerate(-0.2)" onmouseup="accelerate(0.05)">ACCELERATE</button>

// ###
// move canvas object with keyboard inputs across canvas
// altered: rotates in mouse direction and draws a line between mouse and object
// for now, this will be the basis i will work with
// ###

var myGamePiece;

function startGame() {
    myGamePiece = new component(30, 30, "red", 225, 225);
    myGameArea.start();
}

var mouse = {x:0,y:0};
var angle = 0;
var myGameArea = {
	canvas : document.createElement("canvas"),
	start : function() {
		this.canvas.width = 1200;
		this.canvas.height = 600;
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.frameNo = 0;
		this.interval = setInterval(updateGameArea, 5);
		
		window.addEventListener('keydown', function (e) {
			e.preventDefault();
			myGameArea.keys = (myGameArea.keys || []);
			myGameArea.keys[e.keyCode] = (e.type == "keydown");
		});
		
		window.addEventListener('keyup', function (e) {
			myGameArea.keys[e.keyCode] = (e.type == "keydown");
		});
		
		this.canvas.addEventListener('mousemove', function (e) {
			var rect = myGameArea.canvas.getBoundingClientRect();
			// subtract canvas width and height from mouse position to get mouse position inside canvas
			mouse.x = e.clientX - rect.left;
			mouse.y = e.clientY - rect.top;
			// angle in radians = ATan2( endY - startY, endX - startX)
			angle = Math.atan2(mouse.y - myGamePiece.y, mouse.x - myGamePiece.x);
			document.getElementById("lol").innerHTML = "x: " + mouse.x + "<br>y: " + mouse.y + "<br>Angle: " + angle * 180 / Math.PI;
		});
	},
	stop : function() {
		clearInterval(this.interval);
	},    
	clear : function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}

function component(width, height, color, x, y, type) {
	this.type = type;
	this.width = width;
	this.height = height;
	this.speed = 0;
	this.x = x;
	this.y = y;    
	this.update = function() {
        ctx = myGameArea.context;
	
	// draw line between mouse and object/player
        myGameArea.clear();
        ctx.strokeStyle="#ddd";
        ctx.beginPath();
        myGameArea.context.moveTo(myGamePiece.x, myGamePiece.y);
        myGameArea.context.lineTo(mouse.x, mouse.y);
        myGameArea.context.stroke();
	
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(angle);
        ctx.fillStyle = color;
        ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
        ctx.restore();
	}
	
	this.newPos = function() {
		this.x += this.speed * Math.sin(angle + (0.5 * Math.PI));
		this.y -= this.speed * Math.cos(angle + (0.5 * Math.PI));
	}
}

function updateGameArea() {
	myGameArea.clear();
	myGamePiece.speed = 0;
	
	// W key
	if (myGameArea.keys && myGameArea.keys[87]) {
		myGamePiece.speed= 1;
	}
	
	// S key
	if (myGameArea.keys && myGameArea.keys[83]) {
		myGamePiece.speed= -1;
	}
	myGamePiece.newPos();
	myGamePiece.update();
}
