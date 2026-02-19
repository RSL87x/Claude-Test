const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const finalScoreElement = document.getElementById('finalScore');
const gameOverElement = document.getElementById('gameOver');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const fruitCountSlider = document.getElementById('fruitCount');
const fruitCountDisplay = document.getElementById('fruitCountDisplay');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let velocity = { x: 0, y: 0 };
let foods = [];
let maxFruits = 3;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameLoop;
let isGameRunning = false;
let isPaused = false;
let gameSpeed = 100;
let pulsePhase = 0;

const foodColors = [
    { fill: '#FF5722', shadow: '#FF5722', name: 'rojo' },
    { fill: '#FFC107', shadow: '#FFC107', name: 'amarillo' },
    { fill: '#4CAF50', shadow: '#4CAF50', name: 'verde' },
    { fill: '#2196F3', shadow: '#2196F3', name: 'azul' },
    { fill: '#9C27B0', shadow: '#9C27B0', name: 'morado' },
    { fill: '#FF4081', shadow: '#FF4081', name: 'rosa' },
    { fill: '#00BCD4', shadow: '#00BCD4', name: 'cian' },
    { fill: '#FF9800', shadow: '#FF9800', name: 'naranja' }
];
let currentFoodColorIndex = 0;

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

    // Incrementar fase de pulso para animación
    pulsePhase += 0.1;

    drawFoods();
    drawSnake();
}

function clearCanvas() {
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#1a1a1a';
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
            ctx.fillStyle = '#64ffda';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#64ffda';
        } else {
            ctx.fillStyle = '#00bfa5';
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#00bfa5';
        }

        ctx.fillRect(
            segment.x * gridSize + 1,
            segment.y * gridSize + 1,
            gridSize - 2,
            gridSize - 2
        );

        ctx.shadowBlur = 0;

        if (index === 0) {
            ctx.fillStyle = '#0a0a0a';
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

function drawFoods() {
    foods.forEach((food, index) => {
        const currentColor = foodColors[food.colorIndex];

        // Efecto de pulso: oscila entre 0.8 y 1.2
        const pulse = 1 + Math.sin(pulsePhase + index * 0.5) * 0.2;
        const baseRadius = gridSize / 2 - 2;
        const radius = baseRadius * pulse;

        // Brillo pulsante
        const glowIntensity = 15 + Math.sin(pulsePhase + index * 0.5) * 10;

        ctx.fillStyle = currentColor.fill;
        ctx.shadowBlur = glowIntensity;
        ctx.shadowColor = currentColor.shadow;

        const foodX = food.x * gridSize + gridSize / 2;
        const foodY = food.y * gridSize + gridSize / 2;

        ctx.beginPath();
        ctx.arc(foodX, foodY, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;

        // Reflejo con opacidad variable
        const reflectionOpacity = 0.2 + Math.sin(pulsePhase + index * 0.5) * 0.15;
        ctx.fillStyle = `rgba(255, 255, 255, ${reflectionOpacity})`;
        ctx.beginPath();
        ctx.arc(foodX - 2, foodY - 2, 2, 0, Math.PI * 2);
        ctx.fill();
    });
}

function updateSnake() {
    let head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };

    // Permitir atravesar paredes (wrapping)
    if (head.x < 0) {
        head.x = tileCount - 1;
    } else if (head.x >= tileCount) {
        head.x = 0;
    }

    if (head.y < 0) {
        head.y = tileCount - 1;
    } else if (head.y >= tileCount) {
        head.y = 0;
    }

    snake.unshift(head);

    // Verificar colisión con cualquier fruta
    let foodEatenIndex = -1;
    for (let i = 0; i < foods.length; i++) {
        if (head.x === foods[i].x && head.y === foods[i].y) {
            foodEatenIndex = i;
            break;
        }
    }

    if (foodEatenIndex !== -1) {
        score++;
        scoreElement.textContent = score;

        // Remover la fruta comida
        foods.splice(foodEatenIndex, 1);

        // Agregar una nueva fruta con el siguiente color
        currentFoodColorIndex = (currentFoodColorIndex + 1) % foodColors.length;
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

    // Solo verificar colisión con el cuerpo (no con paredes)
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    return false;
}

function checkFoodCollision() {
    const head = snake[0];
    for (let food of foods) {
        if (head.x === food.x && head.y === food.y) {
            return true;
        }
    }
    return false;
}

function generateFood() {
    let newFood;
    let validPosition;

    do {
        validPosition = true;
        newFood = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount),
            colorIndex: currentFoodColorIndex
        };

        // Verificar que no esté en la serpiente
        for (let segment of snake) {
            if (segment.x === newFood.x && segment.y === newFood.y) {
                validPosition = false;
                break;
            }
        }

        // Verificar que no esté en otra fruta
        if (validPosition) {
            for (let food of foods) {
                if (food.x === newFood.x && food.y === newFood.y) {
                    validPosition = false;
                    break;
                }
            }
        }
    } while (!validPosition);

    foods.push(newFood);
}

function initializeFoods() {
    foods = [];
    currentFoodColorIndex = 0;
    for (let i = 0; i < maxFruits; i++) {
        generateFood();
        currentFoodColorIndex = (currentFoodColorIndex + 1) % foodColors.length;
    }
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
    pulsePhase = 0;
    scoreElement.textContent = score;
    gameOverElement.classList.add('hidden');

    // Obtener cantidad de frutas del slider
    maxFruits = parseInt(fruitCountSlider.value);
    initializeFoods();

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

// Actualizar display del slider
fruitCountSlider.addEventListener('input', (e) => {
    fruitCountDisplay.textContent = e.target.value;
});

// Inicialización
clearCanvas();
drawSnake();
initializeFoods();
drawFoods();
