window.addEventListener('load', function () {
    // canvas setup
    const canvas = this.document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    resizeCanvas();

    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;

    const music = new Audio();
    music.src = "./Assets/music/Tetris.mp3";
    music.play();
        

    function animate(currentTime) {
        const deltaTime = currentTime - lastTime;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.draw(ctx);
        game.update(deltaTime);
        lastTime = currentTime;
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', function () {
        resizeCanvas();
        game.updateDimensions(canvas.width, canvas.height);
    });

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    animate(0);
});
