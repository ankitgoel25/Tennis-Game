var canvas;
var canvasContext;
var ballX = 50;         // x coordinate of centre of ball
var ballY = 300;        // y coordinate of centre of ball
var paddle1Y = 50;
var paddle2Y = 500;
const paddleHeight = 100;
const paddleThickness = 10;
var ballSpeedX = 10;
var ballSpeedY = 5;
var ballRadius = 10;
var framesPerSecond = 50;    // Frames per second
var player1Score = 0;
var player2Score = 0;
let winningScore = 3;
var showingWinScreen = false;
let newScreen = true;
let pauseScreen = false;
let playScreen = false;
let ballColor = "red";
var start;

var form = document.querySelector(".form1")
var inputScore = document.querySelector("#win-score");
var inputBallColor = document.querySelector("#ball-color");
var inputFps = document.querySelector("#fps");
var pause = document.querySelector("#pause");
var play = document.querySelector("#play-btn");

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

    form.addEventListener("submit", submitForm);

    pause.addEventListener("click", () => { pauseScreen = true; });
    play.addEventListener("click", () => {
        if (pauseScreen == true) {
            pauseScreen = false;
            playScreen = true;
            drawEverything();
            setTimeout(() => {
                init();
            }, 3000);
            playScreen = false;
        }
    });

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
    if (newScreen) {
        player1Score = 0;
        player2Score = 0;
        newScreen = false;
        init();
    }
}

function submitForm(event) {
    event.preventDefault();

    if (inputScore.value == "")
        winningScore = 3;
    else
        winningScore = parseInt(inputScore.value);

    ballColor = inputBallColor.value;

    framesPerSecond = parseInt(inputFps.value);
    if (showingWinScreen) {
        showingWinScreen = false;
    }
    newScreen = true;
    ballReset();
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
        paddle2Y += 7;
    } else if (paddle2YCenter > ballY + 35) {
        paddle2Y -= 7;
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
    if (ballX < ballRadius) {
        player2Score += 1;      // must be BEFORE ballReset()
        ballReset();
    } else if (ballX < ballRadius * 2) {
        if (ballY > paddle1Y - ballRadius && ballY < paddle1Y + paddleHeight + ballRadius) {
            ballSpeedX = -ballSpeedX;
            // Ball control    
            var deltaY = ballY - (paddle1Y + paddleHeight / 2);
            ballSpeedY = deltaY * 0.35;
        }
    } else if (ballX > canvas.width - (ballRadius * 2)) {
        if (ballY > paddle2Y - ballRadius && ballY < paddle2Y + paddleHeight + ballRadius) {
            ballSpeedX = -ballSpeedX;
            // Ball control
            var deltaY = ballY - (paddle2Y + paddleHeight / 2);
            ballSpeedY = deltaY * 0.35;
        }
    } if (ballX > canvas.width - ballRadius) {
        player1Score += 1;    // must be BEFORE ballReset()
        ballReset();
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
    if (newScreen) {
        canvasContext.fillStyle = 'white';
        canvasContext.font = "60px Comic Sans MS";
        canvasContext.fillText("Click to play !!", canvas.width * .31, 300);
        clearInterval(start)
        return;
    }
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
    colorCircle(ballX, ballY, ballRadius, ballColor);

    if (pauseScreen) {
        canvasContext.fillStyle = 'white';
        canvasContext.font = "60px Comic Sans MS";
        canvasContext.fillText("Paused !!", canvas.width * .38, 300);
        clearInterval(start)
        return;
    }
    if (playScreen) {
        canvasContext.fillStyle = 'white';
        canvasContext.font = "60px Comic Sans MS";
        setTimeout(() => {
            canvasContext.fillText("GO!", canvas.width * .56, 300);
        }, 3000);
        setTimeout(() => {
            canvasContext.fillText("1..", canvas.width * .48, 300);
        }, 2000);
        setTimeout(() => {
            canvasContext.fillText("2..", canvas.width * .40, 300);
        }, 1000);
        canvasContext.fillText("3..", canvas.width * .32, 300);
        return;
    }

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