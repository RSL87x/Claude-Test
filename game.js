const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const finalScoreElement = document.getElementById('finalScore');
const gameOverElement = document.getElementById('gameOver');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let velocity = { x: 0, y: 0 };
let food = { x: 15, y: 15 };
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameLoop;
let isGameRunning = false;
let isPaused = false;
let gameSpeed = 100;

highScoreElement.textContent = highScore;

function drawGame() {
    if (isPaused) return;

    updateSnake();

    if (checkCollision()) {
        gameOver();
        return;
    }

    checkFoodCollision();
    clearCanvas();
    drawFood();
    drawSnake();
}

function clearCanvas() {
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }
}

function drawSnake() {
    snake.forEach((segment, index) => {
        if (index === 0) {
            ctx.fillStyle = '#4CAF50';
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#4CAF50';
        } else {
            ctx.fillStyle = '#8BC34A';
            ctx.shadowBlur = 5;
            ctx.shadowColor = '#8BC34A';
        }

        ctx.fillRect(
            segment.x * gridSize + 1,
            segment.y * gridSize + 1,
            gridSize - 2,
            gridSize - 2
        );

        ctx.shadowBlur = 0;

        if (index === 0) {
            ctx.fillStyle = '#2E7D32';
            const eyeSize = 3;
            const eyeOffset = 5;

            if (velocity.x === 1) {
                ctx.fillRect(segment.x * gridSize + gridSize - eyeOffset, segment.y * gridSize + 5, eyeSize, eyeSize);
                ctx.fillRect(segment.x * gridSize + gridSize - eyeOffset, segment.y * gridSize + 12, eyeSize, eyeSize);
            } else if (velocity.x === -1) {
                ctx.fillRect(segment.x * gridSize + 2, segment.y * gridSize + 5, eyeSize, eyeSize);
                ctx.fillRect(segment.x * gridSize + 2, segment.y * gridSize + 12, eyeSize, eyeSize);
            } else if (velocity.y === 1) {
                ctx.fillRect(segment.x * gridSize + 5, segment.y * gridSize + gridSize - eyeOffset, eyeSize, eyeSize);
                ctx.fillRect(segment.x * gridSize + 12, segment.y * gridSize + gridSize - eyeOffset, eyeSize, eyeSize);
            } else if (velocity.y === -1) {
                ctx.fillRect(segment.x * gridSize + 5, segment.y * gridSize + 2, eyeSize, eyeSize);
                ctx.fillRect(segment.x * gridSize + 12, segment.y * gridSize + 2, eyeSize, eyeSize);
            }
        }
    });
}

function drawFood() {
    ctx.fillStyle = '#FF5722';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#FF5722';

    const foodX = food.x * gridSize + gridSize / 2;
    const foodY = food.y * gridSize + gridSize / 2;
    const radius = gridSize / 2 - 2;

    ctx.beginPath();
    ctx.arc(foodX, foodY, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;

    ctx.fillStyle = '#C41C00';
    ctx.beginPath();
    ctx.arc(foodX - 2, foodY - 2, 2, 0, Math.PI * 2);
    ctx.fill();
}

function updateSnake() {
    const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreElement.textContent = score;
        generateFood();

        if (score > highScore) {
            highScore = score;
            highScoreElement.textContent = highScore;
            localStorage.setItem('snakeHighScore', highScore);
        }

        if (score % 5 === 0 && gameSpeed > 50) {
            gameSpeed -= 5;
            clearInterval(gameLoop);
            gameLoop = setInterval(drawGame, gameSpeed);
        }
    } else {
        snake.pop();
    }
}

function checkCollision() {
    const head = snake[0];

    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return true;
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    return false;
}

function checkFoodCollision() {
    const head = snake[0];
    if (head.x === food.x && head.y === food.y) {
        return true;
    }
    return false;
}

function generateFood() {
    let newFood;
    let foodOnSnake;

    do {
        foodOnSnake = false;
        newFood = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };

        for (let segment of snake) {
            if (segment.x === newFood.x && segment.y === newFood.y) {
                foodOnSnake = true;
                break;
            }
        }
    } while (foodOnSnake);

    food = newFood;
}

function gameOver() {
    clearInterval(gameLoop);
    isGameRunning = false;
    finalScoreElement.textContent = score;
    gameOverElement.classList.remove('hidden');
}

function startGame() {
    snake = [{ x: 10, y: 10 }];
    velocity = { x: 1, y: 0 };
    score = 0;
    gameSpeed = 100;
    isPaused = false;
    scoreElement.textContent = score;
    gameOverElement.classList.add('hidden');
    generateFood();

    if (gameLoop) {
        clearInterval(gameLoop);
    }

    gameLoop = setInterval(drawGame, gameSpeed);
    isGameRunning = true;
    drawGame();
}

function togglePause() {
    if (isGameRunning) {
        isPaused = !isPaused;
    }
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        togglePause();
        return;
    }

    if (isPaused) return;

    switch (e.key) {
        case 'ArrowUp':
            if (velocity.y !== 1) {
                velocity = { x: 0, y: -1 };
            }
            break;
        case 'ArrowDown':
            if (velocity.y !== -1) {
                velocity = { x: 0, y: 1 };
            }
            break;
        case 'ArrowLeft':
            if (velocity.x !== 1) {
                velocity = { x: -1, y: 0 };
            }
            break;
        case 'ArrowRight':
            if (velocity.x !== -1) {
                velocity = { x: 1, y: 0 };
            }
            break;
    }
});

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

clearCanvas();
drawSnake();
drawFood();
