const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{x: 10, y: 10}];
let food = {x: 15, y: 15};
let direction = {x: 1, y: 0};
let nextDirection = {x: 1, y: 0};
let score = 0;
let gameRunning = true;

// Event listeners for arrow keys and WASD
document.addEventListener('keydown', handleKeyPress);

function handleKeyPress(e) {
    const key = e.key.toLowerCase();
    
    // Arrow keys
    if (e.key === 'ArrowUp' && direction.y === 0) {
        nextDirection = {x: 0, y: -1};
    } else if (e.key === 'ArrowDown' && direction.y === 0) {
        nextDirection = {x: 0, y: 1};
    } else if (e.key === 'ArrowLeft' && direction.x === 0) {
        nextDirection = {x: -1, y: 0};
    } else if (e.key === 'ArrowRight' && direction.x === 0) {
        nextDirection = {x: 1, y: 0};
    }
    
    // WASD keys
    if (key === 'w' && direction.y === 0) {
        nextDirection = {x: 0, y: -1};
    } else if (key === 's' && direction.y === 0) {
        nextDirection = {x: 0, y: 1};
    } else if (key === 'a' && direction.x === 0) {
        nextDirection = {x: -1, y: 0};
    } else if (key === 'd' && direction.x === 0) {
        nextDirection = {x: 1, y: 0};
    }
}

function update() {
    if (!gameRunning) return;
    
    direction = nextDirection;
    
    // Move snake
    const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};
    
    // Check wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        endGame();
        return;
    }
    
    // Check self collision
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        endGame();
        return;
    }
    
    snake.unshift(head);
    
    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreDisplay.textContent = score;
        generateFood();
    } else {
        snake.pop();
    }
}

function generateFood() {
    let newFood;
    let foodOnSnake = true;
    
    while (foodOnSnake) {
        newFood = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        foodOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    }
    
    food = newFood;
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake
    ctx.fillStyle = '#00ff00';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
    });
    
    // Draw head with different color
    ctx.fillStyle = '#00cc00';
    ctx.fillRect(snake[0].x * gridSize, snake[0].y * gridSize, gridSize - 1, gridSize - 1);
    
    // Draw food
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 1, gridSize - 1);
}

function endGame() {
    gameRunning = false;
    alert(`Game Over! Final Score: ${score}`);
}

function resetGame() {
    snake = [{x: 10, y: 10}];
    direction = {x: 1, y: 0};
    nextDirection = {x: 1, y: 0};
    score = 0;
    scoreDisplay.textContent = score;
    gameRunning = true;
    generateFood();
}

function gameLoop() {
    update();
    draw();
}

// Start game
generateFood();
draw();
setInterval(gameLoop, 100);