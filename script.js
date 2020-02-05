window.addEventListener("load", startInvasion);

var player;
var enemies = [];
var score;

function startInvasion() {
	player = new player();
	//score = new scoreBoard();
	bugInvasion.start();
}

function bugInvasion() {
	canvas : document.getElementById("game-canvas");
	
	start : function() {
		this.canvas.width = 1200;
        this.canvas.height = 600;
		this.context = this.canvas.getContext("2d");
		this.frameNo = 0;
		this.interval = setInterval(updateCanvas, 20);
	}
	
	clear : function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
	
	stop : function() {
        clearInterval(this.interval);
    }
}

/*
document.body.appendChild(game);
gameContext = game.getContext("2d");
game.enemies = [];

game.width = "1200";
game.height = "600";
game.background = "#000000";
gameContext.fillStyle = "#000000";
gameContext.fillRect(0, 0, game.width, game.height);

game.player = new player();
game.player.Image.onload = function(){
	gameContext.rotate(game.player.rotation);
	gameContext.drawImage(game.player.Image, game.player.xPos, game.player.yPos);
}

game.enemyS = new enemyS();
game.enemyS.Image.onload = function() {
	gameContext.drawImage(game.enemyS.Image, game.enemyS.xStart, game.enemyS.yStart);
}

game.enemyM = new enemyM();
game.enemyM.Image = new Image();
game.enemyM.Image.src = 'images/enemyM.png';
game.enemyM.Image.onload = function() {
	gameContext.drawImage(game.enemyM.Image, game.enemyM.xStart, game.enemyM.yStart);
}

game.enemyL = new enemyL();
game.enemyL.Image = new Image();
game.enemyL.Image.src = 'images/enemyL.png';
game.enemyL.Image.onload = function() {
	gameContext.drawImage(game.enemyL.Image, game.enemyL.xStart, game.enemyL.yStart);
}

game.enemyB = new enemyB();
game.enemyB.Image = new Image();
game.enemyB.Image.src = 'images/enemyB.png';
game.enemyB.Image.onload = function() {
	gameContext.drawImage(game.enemyB.Image, game.enemyB.xStart, game.enemyB.yStart);
}

game.addEventListener('mousemove', function(e) {
	let mouseX = e.clientX - game.offsetLeft;
	let mouseY = e.clientY - game.offsetTop;
	let player = game.player;
	player.rotation = Math.atan2(mouseY - player.yPos, mouseX - player.xPos) * 180 / Math.PI;
	console.log(player.rotation);
	gameContext.rotate(player.rotation);
	draw();
	//gameContext.clearRect(0, 0, game.width, game.height);
	gameContext.drawImage(game.player.Image, game.player.xPos, game.player.yPos);
});

*/
function spawnEnemy(type) {
	
	
	switch (type) {
		case "s":
			game.enemies.push(new enemyS());
			
			break;
		case "m":
			game.enemies.push(new enemyM());
			
			break;		
		case "l":
			game.enemies.push(new enemyL());
			
			break;
		case "b":
			game.enemies.push(new enemyB());
			
			break;
	}
	
	
}

function draw(){
	gameContext.fillStyle = game.background;
	gameContext.fillRect(0, 0, game.width, game.height);
	//update();
	//render();
}

function loop(){
	window.setTimeout(loop, 15);
	draw();
}

function randomCoordinates() {
	let coords = [];
	let xOrY = Math.round(Math.random());
	
	if (xOrY) {
		coords[0] = Math.random() * game.width;
		coords[1] = -50;
	} else {
		coords[0] = -50;
		coords[1] = Math.random() * game.height;
	}
	
	return coords;
}

class player {
	constructor() {
		this.health = 5;
		this.width = 30;
		this.height = 30;
		this.rotation = 90;
		this.xPos = (game.width / 2) - (this.width / 2);
		this.yPos = (game.height / 2) - (this.height / 2);
		this.Image = new Image();
		this.Image.src = 'images/playerShip.png';
	}
	move() {
		
	}
	shoot() {
		
	}
}

class enemyBase {
	constructor() {
		this.health;
		this.speed;
		this.Image = new Image();
		
		let startCoords = randomCoordinates();
		this.xStart = startCoords[0];
		this.yStart = startCoords[1];
	}
	move() {
		this.xPos += Math.floor((game.player.xPos - this.xPos) / 100 * this.speed);
		this.yPos += Math.floor((game.player.yPos - this.yPos) / 100 * this.speed);
	}
}

class enemyS extends enemyBase {
	constructor() {
		super();
		this.health = 5;
		this.speed = 3;
		this.Image.src = 'images/enemyS.png';
		
	}
}

class enemyM extends enemyBase {
	constructor() {
		super();
		
		this.health = 10;
		this.speed = 7;
		this.Image.src = 'images/enemyM.png';
	}
}

class enemyL extends enemyBase {
	constructor() {
		super();
		
		this.health = 35;
		this.speed = 1;
		this.Image.src = 'images/enemyL.png';
	}
}

class enemyB extends enemyBase {
	constructor() {
		super();
		
		this.health = 150;
		this.speed = 2;
		this.Image.src = 'images/enemyB.png';
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
// ###

var myGamePiece;

function startGame() {
    myGamePiece = new component(30, 30, "red", 225, 225);
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
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            e.preventDefault();
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
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
    this.angle = 0;
    this.moveAngle = 0;
    this.x = x;
    this.y = y;    
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

function updateGameArea() {
    myGameArea.clear();
    myGamePiece.moveAngle = 0;
    myGamePiece.speed = 0;
    if (myGameArea.keys && myGameArea.keys[37]) {myGamePiece.moveAngle = -1; }
    if (myGameArea.keys && myGameArea.keys[39]) {myGamePiece.moveAngle = 1; }
    if (myGameArea.keys && myGameArea.keys[38]) {myGamePiece.speed= 1; }
    if (myGameArea.keys && myGameArea.keys[40]) {myGamePiece.speed= -1; }
    myGamePiece.newPos();
    myGamePiece.update();
}
