class Angler2 extends Enemy {
    constructor(game) {
        super(game);
        this.width = 230 * 0.9;
        this.height = 165 * 0.9;
        this.y = Math.random() * (this.game.height * 0.95 - this.height);
        this.color = 'green';
        this.lives = 3;
        this.score = this.lives;
        this.image = new Image();
        this.image.src = 'Assets/fav.png';
    }
}