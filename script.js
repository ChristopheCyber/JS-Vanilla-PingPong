// Canvas
const { body } = document;
const canvasBody = document.getElementById('canvas-body');
// const canvas = document.createElement('canvas');
const canvas = document.getElementById('canvas-container');
const context = canvas.getContext('2d');
// canvas dimensions settings:
const width = 500;
const height = 700;
// initial screen resolution:
var screenWidth = window.screen.width;
var canvasPosition = screenWidth / 2 - width / 2;
const isMobile = window.matchMedia('(max-width: 600px)');
const gameOverEl = document.createElement('div');


// Paddle
const paddleHeight = 10;
const paddleWidth = 50;
const paddleDiff = 25;
let paddleBottomX = 225;
let paddleTopX = 225;
let playerMoved = false;
let paddleContact = false;

// Ball
let ballX = 250;
let ballY = 350;
const ballRadius = 5;

// Speed
let speedY;
let speedX;
let trajectoryX;
let computerSpeed;

// Change Mobile Settings
if (isMobile.matches) {
  speedY = -2;
  speedX = speedY;
  computerSpeed = 4;
} else {
  speedY = -1;
  speedX = speedY;
  computerSpeed = 3;
}

// Score
let playerScore = 0;
let computerScore = 0;
// number of rounds:
const winningScore = 3;
let isGameOver = true;
let isNewGame = true;

// canvas Game background
const imageGame = document.getElementById('imgSourceGame');

// Render Everything on Canvas
function renderCanvas() {
  // Canvas Background color filling :
  context.fillRect(0, 0, width, height);
  context.fillStyle = 'rgb(0, 248, 255)';

  // canvas background Game image filling :
  context.drawImage(imageGame, 0, 0, 1618, 2158, -40, 0, 550, 765);

  /*
  window.onload = function() {
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");
  var img = document.getElementById("scream");
  ctx.drawImage(img, 10, 10);
  };
  */

  // Computer Paddle (Top)
  context.fillStyle = 'rgb(175, 11, 11)';
  context.fillRect(paddleTopX, 10, paddleWidth, paddleHeight);

  // Player Paddle (Bottom)
  context.fillStyle = 'rgb(7, 255, 19)';
  context.fillRect(paddleBottomX, height - 20, paddleWidth, paddleHeight);

  // Dashed Center Line
  context.beginPath();
  context.setLineDash([5]);
  context.moveTo(0, 350);
  context.lineTo(500, 350);
  context.strokeStyle = 'rgb(7, 255, 19)';
  context.stroke();

  // Ball
  context.beginPath();
  context.arc(ballX, ballY, ballRadius, 2 * Math.PI, false);
  context.fillStyle = 'rgb(7, 255, 19)';
  // context.fillStyle = 'red';
  context.fill();

  // Score
  context.fillStyle = 'rgb(7, 255, 19)';
  context.font = 'bold 33px Courier New';
  context.fillText(playerScore, 20, canvas.height / 2 + 50);
  context.fillStyle = 'red';
  context.fillText(computerScore, 20, canvas.height / 2 - 30);

}

// Create Canvas Element
function createCanvas() {
  canvas.width = width;
  canvas.height = height;

  // body.appendChild(canvas);
  canvasBody.appendChild(canvas);
  renderCanvas();
}

// Reset Ball to Center
function ballReset() {
  ballX = width / 2;
  ballY = height / 2;
  speedY = -3;
  paddleContact = false;
}

// Adjust Ball Movement
function ballMove() {
  // Vertical Speed
  ballY += -speedY;
  // Horizontal Speed
  if (playerMoved && paddleContact) {
    ballX += speedX;
  }
}

// Determine What Ball Bounces Off, Score Points, Reset Ball
function ballBoundaries() {
  // Bounce off Left Wall
  if (ballX < 0 && speedX < 0) {
    speedX = -speedX;
  }
  // Bounce off Right Wall
  if (ballX > width && speedX > 0) {
    speedX = -speedX;
  }
  // Bounce off player paddle (bottom)
  if (ballY > height - paddleDiff) {
    if (ballX > paddleBottomX && ballX < paddleBottomX + paddleWidth) {
      paddleContact = true;
      // Add Speed on Hit
      if (playerMoved) {
        speedY -= 1;
        // Max Speed
        if (speedY < -5) {
          speedY = -5;
          computerSpeed = 6;
        }
      }
      speedY = -speedY;
      trajectoryX = ballX - (paddleBottomX + paddleDiff);
      speedX = trajectoryX * 0.3;
    } else if (ballY > height) {
      // Reset Ball, add to Computer Score
      ballReset();
      computerScore++;
    }
  }
  // Bounce off computer paddle (top)
  if (ballY < paddleDiff) {
    if (ballX > paddleTopX && ballX < paddleTopX + paddleWidth) {
      // Add Speed on Hit
      if (playerMoved) {
        speedY += 1;
        // Max Speed
        if (speedY > 5) {
          speedY = 5;
        }
      }
      speedY = -speedY;
    } else if (ballY < 0) {
      // Reset Ball, add to Player Score
      ballReset();
      playerScore++;
    }
  }
}

// Computer Movement
function computerAI() {
  if (playerMoved) {
    if (paddleTopX + paddleDiff < ballX) {
      paddleTopX += computerSpeed;
    } else {
      paddleTopX -= computerSpeed;
    }
  }
}

function showGameOverEl(winner) {
  // Hide Canvas
  canvas.hidden = true;
  canvas.style.display="none";
  // Container
  gameOverEl.textContent = '';
  gameOverEl.classList.add('game-over-container');
  // Title
  const title = document.createElement('h1');
  title.textContent = `${winner} !`;
  // Button
  const playAgainBtn = document.createElement('button');
  playAgainBtn.setAttribute('onclick', 'startGame()');
  playAgainBtn.textContent = 'Play Another Round';
  // Append
  gameOverEl.append(title, playAgainBtn);
  body.appendChild(gameOverEl);
}

// Check If One Player Has Winning Score, If They Do, End Game
function gameOver() {
  if (playerScore === winningScore || computerScore === winningScore) {
    isGameOver = true;
    // Set Winner
    const winner = playerScore === winningScore ? 'You Win' : 'Computer Wins';
    showGameOverEl(winner);
  }
}

// Called Every Frame
function animate() {
  renderCanvas();
  ballMove();
  ballBoundaries();
  computerAI();
  gameOver();
  if (!isGameOver) {
    window.requestAnimationFrame(animate);
  }
}

// Start Game, Reset Everything
function startGame() {
  if (isGameOver && !isNewGame) {
    body.removeChild(gameOverEl);
    canvas.hidden = false;
    canvas.style.display="block";
  }
  isGameOver = false;
  isNewGame = false;
  playerScore = 0;
  computerScore = 0;
  ballReset();
  createCanvas();
  animate();

  /* console.log('window.screen.width=',window.screen.width);
  console.log('document.documentElement.clientWidth=',document.documentElement.clientWidth);
  console.log('document.documentElement.offsetWidth=',document.documentElement.offsetWidth);
  console.log('document.documentElement=',document.documentElement);
  console.log('document.body=\n',document.body); */
  canvas.addEventListener('mousemove', (e) => {
    // console.log('mousemove => document.documentElement.clientWidth=',document.documentElement.clientWidth);
    // in case of resizing Browser window => different ViewPort
    screenWidth = document.documentElement.clientWidth;
    canvasPosition = screenWidth / 2 - width / 2;

    playerMoved = true;
    // Compensate for canvas being centered
    paddleBottomX = e.clientX - canvasPosition - paddleDiff;
    if (paddleBottomX < paddleDiff) {
      paddleBottomX = 0;
    }
    if (paddleBottomX > width - paddleWidth) {
      paddleBottomX = width - paddleWidth;
    }
    // Hide Cursor
    canvas.style.cursor = 'none';
  });
}

// On Load
startGame();
