const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', () => {
    resizeCanvas();
    // You might need to update other elements based on the new canvas size here
});

// Call resizeCanvas initially to set the canvas size based on the initial window size
resizeCanvas();

const music = new Audio();
music.src = "./audio/tetris.mp3";
music.play();

let ballX = canvas.width / 2.2;
let ballY = canvas.height - 50;
let ballRadius = 100;
let dx = 2;
let dy = -2;
let rightPressed = false;
let leftPressed = false;
let gameOver = false;
let startTime = Date.now();
let winTime = 700000; // 70 секунд
let triangles = [];

let ballX2 = canvas.width / 1.8;
let ballY2 = canvas.height - 50;
let ballRadius2 = 100;
let dx2 = 2;
let dy2 = -2;
let isFacingRight = true;
let isFacingRight2 = true;

const triangleWidth = 90;
const triangleHeight = 110;
let triangleSpeed = 5;
const maxTriangleSpeed = 15;
const speedDelta = 0.0005;
const maxTriangles = 10;
let triangleInterval = 30; // максисальное кол-во враждебных объектов
let ScoreID;

let counter = winTime / 1000;
const counterScore = document.getElementById("score");
let lastFrameTime = performance.now();

function updateCounter() {
    const now = performance.now();
    const dt = now - lastFrameTime;
    if (counter > 0) {
        counter -= dt / 1000;
        counterScore.innerText = "Time to win: " + Math.round(counter);
    } else {
        cancelAnimationFrame(animationId);
    }
    lastFrameTime = now;
    animationId = requestAnimationFrame(updateCounter);
}

let animationId = requestAnimationFrame(updateCounter);

function lerp(a, b, c) {
    return a * (1 - c) + b * c;
}

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

document.addEventListener('keydown', keyDownHandler_two);
document.addEventListener('keyup', keyUpHandler_two);

class TriangleImage {
    constructor(x, y, imageSrc) {
        this.x = x;
        this.y = y;
        this.image = new Image();
        this.image.src = imageSrc;
    }
}

const characterImage = new Image();
characterImage.src = './images/knight.png';

const characterImage_two = new Image();
characterImage_two.src = './images/knight_two.png';

function keyDownHandler(event) {
    if (event.key === 'd' || event.key === 'D' || event.key === "в" || event.key === "В") {
        rightPressed = true;
        isFacingRight = false;
    } else if (event.key === 'a' || event.key === 'A' || event.key === "Ф" || event.key === "ф") {
        leftPressed = true;
        isFacingRight = true;
    }
}

function keyUpHandler(event) {
    if (event.key === 'd' || event.key === 'D' || event.key === "в" || event.key === "В") {
        rightPressed = false;
    } else if (event.key === 'a' || event.key === 'A'  || event.key === "Ф" || event.key === "ф") {
        leftPressed = false;
    }
}

let rightPressed2 = false;
let leftPressed2 = false;

// Обновите функции keyDownHandler_two и keyUpHandler_two
function keyDownHandler_two(event) {
    if (event.key === 'ArrowRight') {
        rightPressed2 = true;
        isFacingRight2 = false;
    } else if (event.key === 'ArrowLeft') {
        leftPressed2 = true;
        isFacingRight2 = true;
    }
}

function keyUpHandler_two(event) {
    if (event.key === 'ArrowRight') {
        rightPressed2 = false;
    } else if (event.key === 'ArrowLeft') {
        leftPressed2 = false;
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
            return true;
        }
    }
    return false;
}

function createTriangle() {
    let newTriangle;
    const imageOptions = ['./images/crystal.png', './images/crystal2.png', './images/crystal3.png'];
    const randomImageSrc = imageOptions[Math.floor(Math.random() * imageOptions.length)];

    do {
        const x = Math.random() * (canvas.width - triangleWidth);
        const y = -10;
        newTriangle = new TriangleImage(x, y, randomImageSrc);
    } while (checkTriangleCollision(newTriangle));

    return newTriangle;
}

function drawBall_two() {
    if (isFacingRight2) {
        ctx.drawImage(characterImage_two, ballX2 - ballRadius2, ballY2 - ballRadius2, ballRadius2 * 2, ballRadius2 * 2);
    } else {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(characterImage_two, -(ballX2 + ballRadius2), ballY2 - ballRadius2, ballRadius2 * 2, ballRadius2 * 2);
        ctx.restore();
    }
}

function drawBall() {
    if (isFacingRight) {
        ctx.drawImage(characterImage, ballX - ballRadius, ballY - ballRadius, ballRadius * 2, ballRadius * 2);
    } else {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(characterImage, -(ballX + ballRadius), ballY - ballRadius, ballRadius * 2, ballRadius * 2);
        ctx.restore();
    }
}

let lives = 3;
let lives2 = 3;
const heartImage = new Image();
heartImage.src = './images/heartX.png';

function drawHearts() {
    for (let i = 0; i < lives; i++) {
        ctx.drawImage(heartImage, canvas.width - 30 * (i + 1), 25, 35, 35);
    }
}

function drawHearts2() {
    for (let i = 0; i < lives2; i++) {
        ctx.drawImage(heartImage, 30 * i, canvas.height - 35, 35, 35);
    }
}

function checkCollisions() {
    for (let i = 0; i < triangles.length; i++) {
        if (triangles[i] && triangles[i].x !== undefined && triangles[i].y !== undefined) {
            if (triangles[i] &&
                ballX > triangles[i].x &&
                ballX < triangles[i].x + triangleWidth &&
                ballY > triangles[i].y &&
                ballY < triangles[i].y + triangleHeight
            ) {
                triangles.splice(i, 1);
                if (lives > 0) {
                    lives--;
                }
                if (lives === 0) {
                    gameOver = true;
                }
            }

            if (triangles[i] &&
                ballX2 > triangles[i].x &&
                ballX2 < triangles[i].x + triangleWidth &&
                ballY2 > triangles[i].y &&
                ballY2 < triangles[i].y + triangleHeight
            ) {
                triangles.splice(i, 1);
                if (lives2 > 0) {
                    lives2--;
                }
                if (lives2 === 0) {
                    gameOver = true;
                }
            }
        }
    }
}

function draw() {
    if (!gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        drawBall_two();
        drawHearts();
        drawHearts2();

        if (rightPressed && ballX < canvas.width - ballRadius) {
            ballX += 8;
        } else if (leftPressed && ballX > ballRadius) {
            ballX -= 8;
        }

        if (rightPressed2 && ballX2 < canvas.width - ballRadius2) {
            ballX2 += 8;
        } else if (leftPressed2 && ballX2 > ballRadius2) {
            ballX2 -= 8;
        }
        checkCollisions();

        triangleInterval -= 12;

        triangleSpeed = lerp(triangleSpeed, maxTriangleSpeed, speedDelta);

        if (triangleInterval <= 0 && triangles.length < maxTriangles) {
            triangles.push(createTriangle());
            triangleInterval = 2000;
        }

        triangles.forEach((triangle) => {
            ctx.drawImage(triangle.image, triangle.x, triangle.y, triangleWidth, triangleHeight);

            if ((ballX > triangle.x && ballX < triangle.x + triangleWidth && ballY > triangle.y && ballY < triangle.y + triangleHeight) || 
            (ballX2 > triangle.x && ballX2 < triangle.x + triangleWidth && ballY2 > triangle.y && ballY2 < triangle.y + triangleHeight)) {
                // Проверка столкновений и изменение здровья первого персонажа
                lives--;
                if (lives === 0) {
                    gameOver = true;
                }
            }


            triangle.y += triangleSpeed;

            if (triangle.y > canvas.height) {
                triangle.y = 0;
                triangle.x = Math.random() * (canvas.width - triangleWidth);
            }
        });

        if (Date.now() - startTime > winTime) {
            alert('');
            gameOver = true;
        }

        requestAnimationFrame(draw);

    } else {
        window.location.replace("../menu2/menu_bar.html");
    }
}

draw(); 