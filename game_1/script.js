window.addEventListener('load', function () {
    // canvas setup
    const canvas = this.document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1600;
    canvas.height = 800;    

    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;

    function animate(currentTime) {
        const deltaTime = currentTime - lastTime;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.draw(ctx);
        game.update(deltaTime);
        lastTime = currentTime;
        requestAnimationFrame(animate)
    }
    
    animate(0);
})

