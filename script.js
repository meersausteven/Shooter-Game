
// declare variables that are needed globally

var mouse = {x: 400, y: 300};
var distance = 0;
var angle = 0;

var playerXP = 0, playerScore = 0;
var playerShotDamage = 1, playerShotType = 1;
var playerHealth = 10;
var playerShots = {};
var playerUpgrades = {};

var waveLevel = 0;
var enemies = {}, enemyShots = {};

function startGame() {
    myGameArea.start();
    myGamePiece = new Player();
}

var autofire;

var myGameArea = {
	canvas : document.createElement("canvas"),
	start : function() {
		this.canvas.width = 1600;
		this.canvas.height = 900;
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.frameNo = 0;
		this.interval = window.requestAnimationFrame(updateGameArea);
		
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
			mouse.x = e.clientX - rect.left;
			mouse.y = e.clientY - rect.top;
		});
		this.canvas.addEventListener('mousedown', function (e) {
			myGamePiece.shoot();
			autofire = setInterval(myGamePiece.shoot, 300);
		});
		this.canvas.addEventListener('mouseup', function (e) {
			clearInterval(autofire);
		});
	},
	
	stop : function() {
		window.cancelAnimationFrame(interval);
	},
	
	clear : function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}

class GameObject {
	constructor(width, height, image) {
		this.width = width;
		this.height = height;
		var spawn = enemySpawnPoint();
		this.x = spawn.x;
		this.y = spawn.y;
		this.health;
		this.damage;
		this.destructionPoints;
		this.objectSpeed = 1;
		this.angle = 0;
		this.speedX = 0;
		this.speedY = 0;
		// this.image = image;
	
		this.draw = function() {
			var ctx = myGameArea.context;
			ctx.save();
			ctx.translate(this.x, this.y);
			ctx.rotate(this.angle);
			ctx.drawImage(this.image, -this.width / 2, -this.height / 2 );
			ctx.restore();
			
			this.drawHealth();
		}
		
		this.drawHealth = function() {
			var ctx = myGameArea.context;
			ctx.save();
			ctx.translate(this.x, this.y);
			ctx.font = "20px Arial";
			ctx.fillStyle = "#fff";
			ctx.fillText(this.health, -5, 7.5);
			ctx.restore();
		}
		
		this.move = function() {
			this.speedX = this.objectSpeed * Math.sin(this.angle + (0.5 * Math.PI));
			this.speedY = this.objectSpeed * Math.cos(this.angle + (0.5 * Math.PI));
		}
		
		this.hitByShot = function() {
			for (var shot in playerShots) {
				shot = playerShots[shot];
				if (shot != null) {
					if (thingHitThat(shot, this)) {
						this.health -= shot.damage;
						if (shot.type != 2) {
							delete playerShots[shot.shotId];
						}
						console.log("Enemy hit.");
					}
				}
			}
			if (this.health == 0) {
				playerScore += this.destructionPoints;
				delete enemies[this.enemyId];
				
				console.log("Enemy destroyed.");
			}
		}
	}
}

class SquareEnemy extends GameObject {
	constructor(index) {
		super(30, 30, "");
		this.enemyId = index;
		this.health = 3;
		this.damage = 1;
		this.destructionPoints = 100;
		this.objectSpeed = 1.5;
		
		this.draw = function() {
			var ctx = myGameArea.context;
			ctx.save();
			ctx.translate(this.x, this.y);
			ctx.rotate(this.angle);
			ctx.fillStyle= "#f00";
			ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
			ctx.restore();
			
			this.drawHealth();
		}
		
		this.newPos = function() {
			this.x += this.speedX;
			this.y -= this.speedY;
			this.angle = Math.atan2(myGamePiece.y - this.y, myGamePiece.x - this.x);
			
			this.hitByShot();
		}
	}
}

class CircleEnemy extends GameObject {
	constructor(index) {
		super(15, 15, "");
		this.enemyId = index;
		this.health = 1;
		this.damage = 1;
		this.destructionPoints = 300;
		this.objectSpeed = 2.5;
		
		this.newPos = function() {
			this.x += this.speedX;
			this.y -= this.speedY;
			this.angle = Math.atan2(myGamePiece.y - this.y, myGamePiece.x - this.x);
			
			this.hitByShot();
		}
		
		this.draw = function() {
			var ctx = myGameArea.context;
			ctx.save();
			ctx.beginPath();
			ctx.fillStyle= "#00f";
			//ctx.drawImage(this.image, -this.width / 2, -this.height / 2 );
			
			ctx.arc(this.x, this.y, this.width, 0, 2 * Math.PI);
			ctx.fill();
			ctx.restore();
			this.drawHealth();
		}
	}
}

function startNextWave() {
	spawnEnemyWaves(enemyWaves[waveLevel]);
	waveLevel++;
}
	
var enemyId = 1;

function spawnSingleEnemy(enemyType) {
	var index = "enemy" + enemyId;
	switch (enemyType) {
		case 1:
			enemies[index] = new SquareEnemy(index);
			break;
		case 2:
			enemies[index] = new CircleEnemy(index);
			break;
		default:
			break;
	}
	enemyId++;
}

function spawnEnemyWaves(waveLevel) {
	setTimeout(function() {
		for (wave of enemyWaves[waveLevel]) {
			console.log(wave);
			if (typeof(wave) == "object") {
				for(enemy of wave) {
					spawnSingleEnemy(enemy);
				}
			} else {
				spawnSingleEnemy(wave);
			}
		}
	}, 5000);
}

var enemyWaves = [
	[1, 1, [1, 2], [1, 1, 1, 1, 1], [2, 2, 2]],
	[],
	[],
	[],
	[],
	[],
	[],
	[]
];

class Shot {
	constructor(angle, shotId) {
		this.shotId = shotId;
		this.type = playerShotType;
		this.damage = playerShotDamage;
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
			
			switch (this.type) {
				case 1: // normal bullet
					ctx.translate(this.x, this.y);
					ctx.fillStyle = "#ff6";
					ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
					ctx.rotate(angle);
					break;
				case 2: // big penetrating bullet
					
					break;
				case 3: // magic missile
					
					break;
			}
			
			ctx.restore();
		}
	
		this.newPos = function() {
			
			switch (this.type) {
				case 1: // normal bullet
					this.x += this.speedX * 1 * Math.sin(this.angle + (0.5 * Math.PI));
					this.y += this.speedY * -1 * Math.cos(this.angle + (0.5 * Math.PI));
					break;
				case 2: // big penetrating bullet
					
					break;
				case 3: // magic missile
					
					break;
			}
			
			var playerDistance = Math.sqrt( Math.pow( myGamePiece.x - this.x, 2 ) + Math.pow( myGamePiece.y - this.y, 2 ) );
			
			if (playerDistance > 100) {
				if ( (this.x < -50) || (this.x > myGameArea.canvas.width + 50)
				    || (this.y < - 50) || (this.y > myGameArea.canvas.height + 50) ) {
					delete playerShots[this.shotId];
				}
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
		this.x = (myGameArea.canvas.width / 2);
		this.y = (myGameArea.canvas.height / 2);
		this.health = playerHealth;
		this.playerImage = new Image();
		this.playerImage.src = "/images/playerShip.png";
		this.mouseImage = new Image();
		this.mouseImage.src ="/images/mouseCursor.png";
		
		this.draw = function() {
			distance = Math.sqrt( Math.pow( mouse.x - this.x, 2 ) + Math.pow( mouse.y - this.y, 2 ) );
			angle = Math.atan2(mouse.y - this.y, mouse.x - this.x);
			
			// debugging output
			document.getElementById("test").innerHTML =
				"Mouse: " + mouse.x + " | " + mouse.y +
				"<br>Player: " + myGamePiece.x + " | " + myGamePiece.y +
				"<br>Angle: " + angle * 180 / Math.PI + "<br>Distance: " + distance +
				"<br>Speed: " + myGamePiece.speedX + " | " +  myGamePiece.speedY +
				"<br>Acceleration: " + myGamePiece.accelerationX + " | " + myGamePiece.accelerationY +
				"<br>Enemies alive: " + (Object.keys(enemies)).length +
				"<br>Score: " + playerScore +
				"<br>Active bullets: " + (Object.keys(playerShots)).length;
			;
			
			var ctx = myGameArea.context;
			ctx.drawImage( this.mouseImage, mouse.x - 10, mouse.y - 10);
			ctx.save();
			ctx.translate(this.x, this.y);
			ctx.rotate(angle + (90 * Math.PI / 180));
			ctx.drawImage( this.playerImage, -this.width / 2, -this.height / 2 );
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
			
			if (this.x < -50) {
				this.x = myGameArea.canvas.width + 50;
			} else if (this.x > myGameArea.canvas.width + 50) {
				this.x = -50;
			}
			
			if (this.y < -50) {
				this.y = myGameArea.canvas.height + 50;
			} else if (this.y > myGameArea.canvas.height + 50) {
				this.y = -50;
			}
		}
		
		this.move = "";
		this.drawHealth = "";
		this.hitByShot = "";
		
		this.shoot = function() {
			var index = "shot" + shotId;
			playerShots[index] = new Shot(angle, index);
			shotId++;
		}
	}
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
	
	window.requestAnimationFrame(updateGameArea);
}

function thingHitThat(thing, that) {
	if ( (thing.x >= that.x - (that.width / 2)) &&
	     (thing.x <= that.x + (that.width / 2)) &&
	     (thing.y >= that.y - (that.height / 2)) &&
	     (thing.y <= that.y + (that.height / 2)) ) {
		return true;
	} else {
		return false;
	}
}

function enemySpawnPoint() {
	var coords;
	var x, y;
	var coin = Math.floor(Math.random() * 101);
	
	if (coin >= 50) {
		x = Math.floor(Math.random() * (myGameArea.canvas.width + 101)) - 50;
		
		do {
			y = Math.floor(Math.random() * (myGameArea.canvas.height + 101)) - 50;
		} while ( (y >= -20) && (x <= myGameArea.canvas.height + 20) );
	} else {
		y = Math.floor(Math.random() * (myGameArea.canvas.height + 101)) - 50;
		
		do {
			x = Math.floor(Math.random() * (myGameArea.canvas.width + 101)) - 50;
		} while ( (x >= -20) && (x <= myGameArea.canvas.width + 20) );
	}
	
	return coords = {x: x, y: y};
}
