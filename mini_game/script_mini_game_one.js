const quality_easy = document.getElementById("easy");
const quality_medium = document.getElementById("medium");
const quality_hard = document.getElementById("hard");

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', () => {
    resizeCanvas();

});
resizeCanvas();


let ballX = canvas.width / 2;
let ballY = canvas.height -50;
let ballRadius = 100;
let dx = 2;
let dy = -2;
let rightPressed = false;
let leftPressed = false;
let gameOver = false;
let startTime = Date.now();
let winTime = 0; // 70 секунд
let triangles = [];

let lives = 10;
let triangleWidth = 90;
let triangleHeight = 110;
let triangleSpeed = 5;
let maxTriangleSpeed = 15;
const speedDelta = 0.0005;
let maxTriangles = 10;
let triangleInterval = 30; // максисальное кол-во враждебных объектов  
let ScoreID;



const music = new Audio();
music.src = "./audio/sans_music.mp3";
music.play();



function updateCounter() {
    // текущее время
    const now = performance.now();
    // Вычисляем разницу времени с предыдущего кадра
    const dt = now - lastFrameTime;
    // Уменьшаем счетчик в зависимости от времени, прошедшего с прошлого кадра
    if (counter > 0) {
        
        counter -= dt / 1000; // Уменьшаем на единицу в секунду
        
        counterScore.innerText = "Time to win: " + Math.round(counter);
    } else {
        // Останавливка когда счетчик достигнет или превысит 0
        cancelAnimationFrame(animationId);
    }
    // Обновляем время последнего кадра
    lastFrameTime = now;
    // Запрашиваем следующий кадр анимации
    animationId = requestAnimationFrame(updateCounter);
}
// Запускаем анимацию путем запроса первого кадра
let animationId = requestAnimationFrame(updateCounter);


function lerp(a, b, c) {
    return a * (1 - c) + b * c;
}


document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

class TriangleImage {
    constructor(x, y, imageSrc) {
        this.x = x;
        this.y = y;
        this.image = new Image();
        this.image.src = imageSrc;
    }
}

const characterImage = new Image();
characterImage.src = './images/knight.png'; // Путь к изображению персонажа


function keyDownHandler(event) {
    if (event.key === 'Right' || event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D' || event.key === 'в' || event.key === 'В') {
        rightPressed = true;
        isFacingRight = false; // Персонаж смотрит вправо
    } else if (event.key === 'Left' || event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A' || event.key === 'ф' || event.key === 'Ф') {
        leftPressed = true;
        isFacingRight = true; // Персонаж смотрит влево
    }
}

function keyUpHandler(event) {
    if (event.key === 'Right' || event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D'  || event.key === 'в' || event.key === 'В') {
        rightPressed = false;
    } else if (event.key === 'Left' || event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A' || event.key === 'ф' || event.key === 'Ф') {
        leftPressed = false;
    }
}




function checkTriangleCollision(newTriangle) {
    for (let i = 0; i < triangles.length; i++) {
        if (
            newTriangle.x < triangles[i].x + triangleWidth &&
            newTriangle.x + triangleWidth > triangles[i].x &&
            newTriangle.y < triangles[i].y + triangleHeight &&
            newTriangle.y + triangleHeight > triangles[i].y
        ) {
            return true; // Коллизия обнаружена
        }
    }
    return false; // Коллизия не обнаружена
}

function createTriangle() {
    let newTriangle;
    const imageOptions = ['./images/crystal.png', './images/crystal2.png', './images/crystal3.png'];
    const randomImageSrc = imageOptions[Math.floor(Math.random() * imageOptions.length)]; // Случайный выбор из трех путей к изображениям

    do {
        const x = Math.random() * (canvas.width - triangleWidth);
        const y = -10;
        newTriangle = new TriangleImage(x, y, randomImageSrc);
    } while (checkTriangleCollision(newTriangle)); // Проверяем коллизию с другими треугольниками

    return newTriangle;
}

let isFacingRight = true; // Начальное направление персонажа

function drawBall() {
    if (isFacingRight) {
        ctx.drawImage(characterImage, ballX - ballRadius, ballY - ballRadius, ballRadius * 2, ballRadius * 2);
    } else {
        // Отражаем изображение по вертикали
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(characterImage, -(ballX + ballRadius), ballY - ballRadius, ballRadius * 2, ballRadius * 2);
        ctx.restore();
    }
}

// жизни персонажа 
const heartImage = new Image();
heartImage.src = './images/heartX.png'; // путь у исображеню hp

function drawHearts() {
    for (let i = 0; i < lives; i++) {
        ctx.drawImage(heartImage, canvas.width - 35 * (i + 3), 25, 35, 35);
    }
}

function checkCollisions() {
    for (let i = 0; i < triangles.length; i++) {
        if (
            ballX > triangles[i].x &&
            ballX < triangles[i].x + triangleWidth &&
            ballY > triangles[i].y &&
            ballY < triangles[i].y + triangleHeight
        ) {
            triangles.splice(i, 1); // Удаляем треугольник при коллизии

            if (lives > 0) {
                lives--; // Уменьшаем кол-во жизней при коллизии
            }

            if (lives === 0) {
                gameOver = true; // Конец игры при потере всех жизней
            }
        }
    }
}


// Основные переменные вашей игры
let playerScore = 0;
let playerLives = 3;

function setupGame(level) {
    setLevel(level);
    draw();
    document.getElementById("quality").style.display = "none";


    counter = currentLevel.winTime / 1000;

}

quality_easy.addEventListener("click", () => {
    setupGame('easy');
});

quality_medium.addEventListener('click', () => {
    setupGame('medium');
});

quality_hard.addEventListener('click', () => {
    setupGame('hard');
});

function lerp(a, b, c) {
    return a * (1 - c) + b * c;
}

function draw() {
    if (!gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        drawHearts();

        if (rightPressed && ballX < canvas.width - ballRadius) {
            ballX += 12;
        } else if (leftPressed && ballX > ballRadius) {
            ballX -= 12;
        }

        checkCollisions();

        triangleInterval -= 12; // уменьшить временной интервал с учетом времени кадра
        
        triangleSpeed = lerp(triangleSpeed, maxTriangleSpeed, speedDelta);

        if (triangleInterval <= 0 && triangles.length < maxTriangles) {
            triangles.push(createTriangle());
            triangleInterval = 2000; 
        }

        triangles.forEach((triangle) => {
            ctx.drawImage(triangle.image, triangle.x, triangle.y, triangleWidth, triangleHeight);

            if (ballX > triangle.x && ballX < triangle.x + triangleWidth && ballY > triangle.y && ballY < triangle.y + triangleHeight) {
                gameOver = true;
            }

            triangle.y += lerp(triangleSpeed, maxTriangleSpeed, speedDelta);

            if (triangle.y > canvas.height) {
                triangle.y = 0;
                triangle.x = Math.random() * (canvas.width - triangleWidth);
            }
        });

        if (Date.now() - startTime > winTime) {
            alert('You win!');
            gameOver = true;
        }

        requestAnimationFrame(draw);

    } else {
        window.location.replace("../menu2/menu_bar.html");
    }
}



// Уровни сложности
const levels = {
    easy: {
        ballY: canvas.height -60,
        ballRadius: 100,
        winTime: 70000,
        lives: 5,
        triangleSpeed: 5,
        maxTriangleSpeed: 10,
        maxTriangles: 5,
    },
    medium: {
        ballY: canvas.height -60,
        ballRadius: 100,
        winTime: 100000,
        lives: 3,
        triangleSpeed: 8,
        maxTriangleSpeed: 12,
        maxTriangles: 8,
    },
    hard: {
        ballY: canvas.height -100,
        ballRadius: 180,
        winTime: 120000,
        lives: 1,
        triangleSpeed: 12,
        maxTriangleSpeed: 15,
        maxTriangles: 10,
    }
};

let currentLevel = levels.hard;

function setLevel(level) {
    currentLevel = levels[level];
    winTime = currentLevel.winTime; // Теперь устанавливаем winTime в соответствии с выбранным уровнем
    ballY = currentLevel.ballY;
    ballRadius = currentLevel.ballRadius;
    lives = currentLevel.lives;
    triangleSpeed = currentLevel.triangleSpeed;
    maxTriangleSpeed = currentLevel.maxTriangleSpeed;
    maxTriangles = currentLevel.maxTriangles;
    winTime = currentLevel.winTime; // Обновляем время победы при изменении уровня
}

let counter = (winTime / 1000) ;
const counterScore = document.getElementById("score")
let lastFrameTime = performance.now();

