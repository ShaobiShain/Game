class Player {
    constructor(game) {
        this.game = game;
        this.width = 190;
        this.height = 130;
        this.x = 20;
        this.y = 400;
        this.speedY = 0.3;
        this.maxSpeed = 8;
        this.projectiles = [];
        this.image = new Image();
        this.image.src = 'Assets/arm_hel.png';
    }

    update() {
        this.projectiles.forEach(pr => { pr.update(); });
        this.projectiles = this.projectiles.filter(pr => !pr.markedForDeletion);
        if (this.game.keys.includes('ArrowUp')) this.speedY = -this.maxSpeed
        else if (this.game.keys.includes('ArrowDown')) this.speedY = this.maxSpeed
        else this.speedY = 0;
        this.y += this.speedY;
        // vertical boundaries
        if (this.y > this.game.height - this.height * 0.5) this.y = this.game.height - this.height * 0.5;
        else if (this.y < -this.height * 0.5) this.y = -this.height * 0.5;
    }

    draw(context) {
        this.projectiles.forEach(pr => { pr.draw(context); });
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    shootTop() {
        if (this.game.ammo > 0) {
            this.projectiles.push(new Projectile(this.game, this.x + 90, this.y + 60));
            this.game.ammo--;
        }
    }
}