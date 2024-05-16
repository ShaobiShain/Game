class Enemy {
    constructor(game) {
        this.game = game;
        this.x = 1400;
        this.speedX = Math.random() * -1.5 - 2.5;
        this.markedForDeletion = false;
    }

    update() {
        // Обновляем x-координату врага (уменьшаем ее на величину speedX)
        this.x += this.speedX;
        // Помечаем врага как удаленного, если он полностью пересечет левую границу игрового поля
        if (this.x + this.width < 0) this.markedForDeletion = true;
    }

    draw(context) {
        if (this.image.complete) {
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
            // Опционально: убедитесь, что изображение загружено
        }
            // Если изображение не загружено, рисуем просто прямоугольник из предыдущей реализации

   }

    
}