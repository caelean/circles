// setup canvas

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;
var score = document.getElementById('score');
console.log(score);
// function to generate random number

function random(min,max) {
  var num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}

function Shape(x, y, velX, velY, exists) {
	this.x = x;
	this.y = y;
	this.velX = velX;
	this.velY = velY;
	this.exists = exists;
}

function Ball(x, y, velX, velY, exists, color, size) {
	Shape.call(this, x, y, velX, velY, exists);
	this.color = color;
	this.size = size;
}

Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;

Ball.prototype.draw = function() {
	ctx.beginPath()
	ctx.fillStyle = this.color;
	ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI);
	ctx.fill();
}

Ball.prototype.update = function() {
	if((this.x + this.size) >= width || (this.x - this.size) <= 0) {
		this.velX = -(this.velX);
	}
	if((this.y + this.size) >= height || (this.y - this.size) <= 0) {
		this.velY = -(this.velY);
	}
	this.x += this.velX;
	this.y += this.velY
}

Ball.prototype.collide = function() {
	for (let ball of balls) {
		if(!(this == ball)) {
			let xDist = Math.abs(this.x - ball.x);
			let yDist = Math.abs(this.y - ball.y);
			let dist = Math.sqrt(xDist * xDist + yDist * yDist);
			if (dist <= this.size + ball.size) {
				ball.color = this.color = 'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')';
			}
		}
	}
}

function EvilCircle(x, y, exists) {
	Shape.call(this, x, y, 10, 10, exists);
	this.color = 'white';
	this.size = 10;
}

EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;

EvilCircle.prototype.draw = function() {
	ctx.beginPath()
	ctx.strokeStyle = this.color;
	ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI);
	ctx.stroke();
	ctx.lineWidth = 1;
}

EvilCircle.prototype.updateBounds = function() {
	if((this.x + this.size) >= width) {
		this.x -= this.size;
	} else if ((this.x - this.size) <= 0) {
		this.x += this.size;
	}
	if((this.y + this.size) >= height) {
		this.y -= this.size;
	} else if ((this.y - this.size) <= 0) {
		this.y += this.size;
	}
}

EvilCircle.prototype.setControls = function() {
	var _this = this;
	window.onkeydown = function(e) {
    if (e.keyCode === 37) {
      _this.x -= _this.velX;
    } else if (e.keyCode === 39) {
      _this.x += _this.velX;
    } else if (e.keyCode === 38) {
      _this.y -= _this.velY;
    } else if (e.keyCode === 40) {
      _this.y += _this.velY;
    }
  }
}

EvilCircle.prototype.collide = function() {
	for (let ball of balls) {
		let xDist = Math.abs(this.x - ball.x);
		let yDist = Math.abs(this.y - ball.y);
		let dist = Math.sqrt(xDist * xDist + yDist * yDist);
		if (dist <= this.size + ball.size) {
			ball.exists = false;
		}
	}
}

let balls = [];
let evil = new EvilCircle(
	random(0,width),
	random(0,height),
);
evil.setControls();
function loop() {
	let count = 0;
	for(let ball of balls) {
		count += ball.exists ? 1 : 0;
	}
	score.innerHTML = 'Score: ' + (100 - count);
	if (window.innerWidth != width) {
		width = canvas.width = window.innerWidth;
	}
	if (window.innerHeight != height) {
		height = canvas.height = window.innerHeight;
	}
	ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
 	ctx.fillRect(0, 0, width, height);
	while (balls.length < 100) {
		var ball = new Ball(
			random(0,width),
      random(0,height),
      random(-7,7),
      random(-7,7),
			true,
      'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
      random(10,20)
    );
  	balls.push(ball);
	}
	for (let ball of balls) {
		if (ball.exists) {
			ball.draw();
			ball.update()
			ball.collide();
		}
		evil.draw();
		evil.updateBounds();
		evil.collide();
	}
	requestAnimationFrame(loop);
}

loop();
