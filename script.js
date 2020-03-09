/*
// NEW CODE
// declare variables that are needed globally

var playerXP = 0, playerScore = 0;
var playerSpeed = 1, playerShotDamage = 1, playerShotType = 1, playerShotSpeed = 1;
var playerHealth = 10;
var playerUpgrades = [], playerShots = []
var playerSpeedLevel = 0, playerDamageLevel = 0, playerHealthLevel = 0, playerShotType = 0, playShotStyle = 0;
*/
function startGame() {
    myGamePiece = new Player();
    myGameArea.start();
}

var mouse = {x: 400, y: 300};
var distance;
var angle = 0;
var playerShots = {};

var gameWave = 0;
var enemies = {}, enemyShots = {};

var myGameArea = {
	canvas : document.createElement("canvas"),
	start : function() {
		this.canvas.width = 1200;
		this.canvas.height = 700;
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.frameNo = 0;
		this.interval = setInterval(updateGameArea, 5);

		window.addEventListener('keydown', function (e) {
			e.preventDefault();
			myGameArea.keys = (myGameArea.keys || []);
			myGameArea.keys[e.keyCode] = (e.type == "keydown");
		})
		window.addEventListener('keyup', function (e) {
			myGameArea.keys[e.keyCode] = (e.type == "keydown");
		})
		this.canvas.addEventListener('mousemove', function (e) {
			var rect = myGameArea.canvas.getBoundingClientRect();
			mouse.x = e.clientX - rect.left;
			mouse.y = e.clientY - rect.top;
		})
		this.canvas.addEventListener('mousedown', function (e) {
			myGamePiece.shoot();
		})
	},
	
	stop : function() {
		clearInterval(this.interval);
	},
	
	clear : function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}

class GameObject {
	constructor(width, height, image) {
		this.width = width;
		this.height = height;
		this.x = Math.floor(Math.random() * myGameArea.canvas.width + 50);
		this.y = Math.floor(Math.random() * myGameArea.canvas.height + 50);
		this.angle = 0;
		this.speedX = 0;
		this.speedY = 0;
		// this.image = image;
	
		this.draw = function() {
			var ctx = myGameArea.context;
			ctx.save();
			ctx.translate(this.x, this.y);
			ctx.rotate(this.angle);
			ctx.fillStyle= "#f00";
			ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
			//ctx.drawImage(this.image, -this.width / 2, -this.height / 2 );
			ctx.restore();
			
			ctx.strokeStyle="#ddd";
			ctx.beginPath();
			ctx.moveTo(this.x, this.y);
			ctx.lineTo(myGamePiece.x, myGamePiece.y);
			ctx.stroke();
		}
		
		this.move = function() {
			if (this.speedX < 1.5) {
				this.speedX += 1 * Math.sin(this.angle + (0.5 * Math.PI));
			}
			if (this.speedY < 1.5) {
				this.speedY += 1 * Math.cos(this.angle + (0.5 * Math.PI));
			}
		}
	}
}

class SquareEnemy extends GameObject {
	constructor(index) {
		super(30, 30, "");
		this.enemyId = index;
		
		this.newPos = function() {
			this.x += this.speedX;
			this.y -= this.speedY;
			this.angle = Math.atan2(myGamePiece.y - this.y, myGamePiece.x - this.x);
			
			for (var shot in playerShots) {
				shot = playerShots[shot];
				if (shot != null) {
					console.log("shot found");
					if ( (this.x + 15 == shot.x) || (this.x + 15 == shot.x) ||
					     (this.y + 15 == shot.y) || (this.y + 15 == shot.y) ) {
						console.log("fetus deletus");
						delete enemies[this.enemyId];
					}
				}
			}
		}
	}
}
	
class Shot {
	constructor(angle, shotId) {
		this.shotId = shotId;
		this.speedX = 7;
		this.speedY = 7;
		this.angle = angle;
		this.x = myGamePiece.x;
		this.y = myGamePiece.y;
		this.width = 5;
		this.height = 5;
	
		this.draw = function() {
			var ctx = myGameArea.context;
			ctx.save();
			ctx.translate(this.x, this.y);
			ctx.fillStyle = "#ff6";
			ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
			ctx.rotate(angle);
			ctx.restore();
		}
	
		this.newPos = function() {
			this.x += this.speedX * 1 * Math.sin(this.angle + (0.5 * Math.PI));
			this.y += this.speedY * -1 * Math.cos(this.angle + (0.5 * Math.PI));

			if ( (this.x < -20) || (this.x > myGameArea.canvas.width + 20)
			    || (this.y < - 20) || (this.y > myGameArea.canvas.height + 20) ) {
				delete playerShots[this.shotId];
			}
		}
	}
}

var shotId = 1;

class Player extends GameObject {
	constructor() {
		super(0, 0, "");
		
		this.width = 30;
		this.height = 30;
		this.speedX = 0;
		this.speedY = 0;
		this.friction = 0.99;
		this.accelerationX = 0;
		this.accelerationY = 0;
		this.x = 400;
		this.y = 300;
		
		this.draw = function() {
			distance = Math.sqrt( Math.pow( mouse.x - this.x, 2 ) + Math.pow( mouse.y - this.y, 2 ) );
			angle = Math.atan2(mouse.y - this.y, mouse.x - this.x);

			document.getElementById("test").innerHTML =
				"Mouse: " + mouse.x + " | " + mouse.y +
				"<br>Player: " + myGamePiece.x + " | " + myGamePiece.y +
				"<br>Angle: " + angle * 180 / Math.PI + "<br>Distance: " + distance +
				"<br>Speed: " + myGamePiece.speedX + " | " +  myGamePiece.speedY +
				"<br>Acceleration: " + myGamePiece.accelerationX + " | " + myGamePiece.accelerationY
			;
			
			var ctx = myGameArea.context;
			myGameArea.clear();
			ctx.save();
			ctx.translate(this.x, this.y);
			ctx.rotate(angle + (90 * Math.PI / 180));
			ctx.drawImage( document.getElementById("player"), -this.width / 2, -this.height / 2 );
			ctx.restore();

			ctx.strokeStyle="#abf";
			ctx.beginPath();
			ctx.arc(mouse.x, mouse.y, distance, 0, 2 * Math.PI);
			ctx.stroke();
			
			ctx.strokeStyle="#ddd";
			ctx.beginPath();
			ctx.moveTo(myGamePiece.x, myGamePiece.y);
			ctx.lineTo(mouse.x, mouse.y);
			ctx.stroke();
		}

		this.newPos = function() {
			this.x += this.speedX + this.accelerationX;
			this.y -= this.speedY + this.accelerationY;
		}
		
		this.move = "";
		
		this.shoot = function() {
			var index = "shot" + shotId;
			playerShots[index] = new Shot(angle, index);
			shotId++;
		}
	}
}
	
var enemyId = 1;
	
function spawnSquareEnemy() {
	var index = "enemy" + enemyId;
	enemies[index] = new SquareEnemy(index);
	enemyId++;
}
	
function updateGameArea() {
	myGameArea.clear();
	myGamePiece.speedX = 0;
	myGamePiece.speedY = 0;
	
	myGamePiece.accelerationX *= myGamePiece.friction;
	myGamePiece.accelerationY *= myGamePiece.friction;
	
	if ( (myGamePiece.accelerationX < 0.01) && (myGamePiece.accelerationX > -0.01) ) {
		myGamePiece.accelerationX = 0;
	}
	if ( (myGamePiece.accelerationY < 0.01) && (myGamePiece.accelerationY > -0.01) ) {
		myGamePiece.accelerationY = 0;
	}
	
	if (myGameArea.keys && myGameArea.keys[87]) {
		if (distance > 10) {
			myGamePiece.speedX += 1 * Math.sin(angle + (0.5 * Math.PI));
			myGamePiece.speedY += 1 * Math.cos(angle + (0.5 * Math.PI));
			
			myGamePiece.accelerationX += 0.1 * Math.sin(angle + (0.5 * Math.PI));
			myGamePiece.accelerationY += 0.1 * Math.cos(angle + (0.5 * Math.PI));
		}
	}

	if (myGameArea.keys && myGameArea.keys[83]) {
		myGamePiece.speedX += -1 * Math.sin(angle + (0.5 * Math.PI));
		myGamePiece.speedY += -1 * Math.cos(angle + (0.5 * Math.PI));
		
		myGamePiece.accelerationX += -0.1 * Math.sin(angle + (0.5 * Math.PI));
		myGamePiece.accelerationY += -0.1 * Math.cos(angle + (0.5 * Math.PI));
	}

	if (myGameArea.keys && myGameArea.keys[65]) {
		if (distance > 10) {
			angle += Math.acos(1 - Math.pow(1 / distance,2) / 2);
			myGamePiece.speedX += 1 * Math.sin(angle + (2 * Math.PI));
			myGamePiece.speedY += 1 * Math.cos(angle + (2 * Math.PI));
			
			myGamePiece.accelerationX += 0.05 * Math.sin(angle + (2 * Math.PI)) + 0.025 * Math.sin(angle + (0.5 * Math.PI));
			myGamePiece.accelerationY += 0.05 * Math.cos(angle + (2 * Math.PI)) + 0.025 * Math.cos(angle + (0.5 * Math.PI));
		}
	}

	if (myGameArea.keys && myGameArea.keys[68]) {
		if (distance > 10) {
			angle -= Math.acos(1 - Math.pow(1 / distance,2) / 2);
			myGamePiece.speedX += -1 * Math.sin(angle + (2 * Math.PI));
			myGamePiece.speedY += -1 * Math.cos(angle + (2 * Math.PI));
			
			myGamePiece.accelerationX += -0.05 * Math.sin(angle + (2 * Math.PI)) + 0.025 * Math.sin(angle + (0.5 * Math.PI));
			myGamePiece.accelerationY += -0.05 * Math.cos(angle + (2 * Math.PI)) + 0.025 * Math.cos(angle + (0.5 * Math.PI));
		}
	}

	myGamePiece.newPos();
	myGamePiece.draw();
			
	for (var shot in playerShots) {
		shot = playerShots[shot];
		if (shot != null) {
			shot.newPos();
			shot.draw();
		}
	}
	
	for (var enemy in enemies) {
		enemy = enemies[enemy];
		if (enemy != null) {
			enemy.move();
			enemy.newPos();
			enemy.draw();
		}
	}
}

/*
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
*/
