class Angler1 extends Enemy {
    constructor(game) {
        super(game);
        this.width = 228;
        this.height = 120;
        this.y = Math.random() * (this.game.height * 0.95 - this.height);
        this.color = 'red';
        this.lives = 5;
        this.score = this.lives;
        this.image = new Image();
        this.image.src = 'Assets/bombordir.png';
    }
}