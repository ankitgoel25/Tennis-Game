var canvas;
var canvasContext;
var ballX = 50; // x coordinate of centre of ball
var ballY = 50; // y coordinate of centre of ball
var paddle1Y = 50;
var paddle2Y = 250;
const paddleHeight = 100;
const paddleThickness = 10;
var ballSpeedX = 10;
var ballSpeedY = 5;
var ballRadius = 10;

var framesPerSecond = 60;

var player1Score = 0;
var player2Score = 0;
const winningScore = 3;
var showingWinScreen = false;
var start;

function calculateMousePos(event) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = event.clientX - rect.left - root.scrollLeft;
    var mouseY = event.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY
    }
}

window.onload = function () {

    this.canvas = document.querySelector('#gameCanvas');
    this.canvasContext = canvas.getContext('2d');

    this.init();

    this.canvas.addEventListener('mousedown', handleMouseClick);

    // paddle movement wrt mouse
    this.canvas.addEventListener('mousemove', (event) => {
        var mousePos = this.calculateMousePos(event);
        this.paddle1Y = mousePos.y - (paddleHeight / 2);
    });

}

function init() {
    start = setInterval(function () {
        moveEverything();
        drawEverything();
    }, 1000 / framesPerSecond);
}

function handleMouseClick(event) {
    if (showingWinScreen) {
        player1Score = 0;
        player2Score = 0;
        showingWinScreen = false;
        init();
    }
}

function ballReset() {
    if (player1Score == winningScore || player2Score == winningScore) {
        showingWinScreen = true;
    }

    ballSpeedX = -ballSpeedX;
    ballSpeedY = 5;
    ballX = canvas.width / 2;
    // ballY = canvas.height / 2;
    ballY = Math.floor(Math.random() * canvas.height - 50) + 50;

}

function computerMovement() {
    var paddle2YCenter = paddle2Y + (paddleHeight / 2);
    if (paddle2YCenter < ballY - 35) {
        paddle2Y += 6;
    } else if (paddle2YCenter > ballY + 35) {
        paddle2Y -= 6;
    }
}

function moveEverything() {
    if (showingWinScreen) {
        return;
    }
    computerMovement();

    ballX += ballSpeedX;
    ballY += ballSpeedY;
    // For x-axis
    if (ballX < 0) {
        if (ballY > paddle1Y && ballY < paddle1Y + paddleHeight) {
            ballSpeedX = -ballSpeedX;
            // Ball control    
            var deltaY = ballY - (paddle1Y + paddleHeight / 2);
            ballSpeedY = deltaY * 0.35;
        } else {
            player2Score += 1;      // must be BEFORE ballReset()
            ballReset();
        }
    } else if (ballX > canvas.width - ballRadius) {
        if (ballY > paddle2Y && ballY < paddle2Y + paddleHeight) {
            ballSpeedX = -ballSpeedX;
            // Ball control
            var deltaY = ballY - (paddle2Y + paddleHeight / 2);
            ballSpeedY = deltaY * 0.35;
        } else {
            player1Score += 1;      // must be BEFORE ballReset()
            ballReset();
        }
    }
    // For y-axis
    if (ballY < ballRadius) {
        ballSpeedY = -ballSpeedY;
    } else if (ballY > canvas.height - ballRadius) {
        ballSpeedY = -ballSpeedY;
    }
}

function drawNet() {
    for (var i = 0; i < canvas.height; i += 40) {
        colorRect(canvas.width / 2 - 1, i, 2, 20, 'white');
    }
}

function drawEverything() {
    colorRect(0, 0, canvas.width, canvas.height, 'black');
    canvasContext.fillStyle = 'white';
    canvasContext.font = "30px Comic Sans MS";
    canvasContext.fillText("Score", canvas.width * .7, 50);
    canvasContext.fillText(player1Score, canvas.width * .83, 50);
    canvasContext.fillText(player2Score, canvas.width * .9, 50);

    if (showingWinScreen) {
        canvasContext.fillStyle = 'white';
        canvasContext.font = "60px Comic Sans MS";
        if (player1Score == winningScore) {
            canvasContext.fillText("You won !", canvas.width * .38, 290);
        } else {
            canvasContext.fillText("Computer won !", canvas.width * .3, 290);
        }
        canvasContext.font = "30px Comic Sans MS";
        canvasContext.fillText("Click to play again...", canvas.width * .37, 550);
        clearInterval(start)
        return;
    }

    drawNet();

    // left player paddle
    colorRect(0, paddle1Y, paddleThickness, paddleHeight, 'white');

    // right player paddle
    colorRect(canvas.width - paddleThickness, paddle2Y, paddleThickness, paddleHeight, 'white');

    // ball
    colorCircle(ballX, ballY, ballRadius, 'red');

}

function colorCircle(centreX, centreY, radius, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centreX, centreY, radius, 0, Math.PI * 2, true);
    canvasContext.fill();
}


function colorRect(leftX, topY, width, height, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
}