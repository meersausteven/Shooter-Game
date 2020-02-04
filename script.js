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