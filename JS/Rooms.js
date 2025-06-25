class Room {
    constructor(x, y, width, height, obstacles = [], enemies = []) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.obstacles = obstacles; // [{x, y, w, h}]
        this.enemies = enemies; // array de Enemy
        this.cleared = false;
        this.obstaclesImage = new Image();
        this.obstaclesImage.src = "./IMG/brickWall.png"; // Imagem dos obstáculos
        this.roomFloorImage = new Image();
        this.roomFloorImage.src = "./IMG/floor.jpg" // Imagem do chão da sala
    }

    draw(context) {
        // Desenha a sala
      if (this.roomFloorImage.complete) {
        const floorPattern = context.createPattern(this.roomFloorImage, "repeat");
        context.save();
        context.fillStyle = floorPattern;
        context.fillRect(this.x, this.y, this.width, this.height);
        context.restore();
    } else {
        // fallback: solid color
        context.save();
        context.fillStyle = "#ccc";
        context.fillRect(this.x, this.y, this.width, this.height);
        context.restore();
    }

       this.obstacles.forEach(obs => {
        // Only draw pattern if image is loaded
        if (this.obstaclesImage.complete) {
            const pattern = context.createPattern(this.obstaclesImage, "repeat");
            context.save();
            context.fillStyle =  "rgba(0, 0, 0,0.5)"; // Optional: semi-transparent overlay
            context.fillRect(obs.x, obs.y , obs.w+25, obs.h+30);
            context.fillStyle =  "rgb(57, 48, 76)"; // Optional: semi-transparent overlay
            context.fillRect(obs.x, obs.y , obs.w+20, obs.h+20);

            context.fillStyle = pattern;
            context.fillRect(obs.x, obs.y, obs.w, obs.h);

            context.restore();
        } else {
            // fallback: solid color
            context.save();
            context.fillStyle = "brown";
            context.fillRect(obs.x, obs.y, obs.w, obs.h);
            context.restore();
        }
    });
}

    isCleared() {
        return this.enemies.every(e => e.enemyHealth <= 0);
    }
update(playerX, playerY, size) {
    if (collidesWithObstacles(playerX, playerY, size, this.obstacles)) {
        return true; // blocked
    }
    return false; // not blocked

        
      
        // Verifica se a sala está limpa
        this.cleared = this.isCleared();
    }
}

function collidesWithObstacles(x, y, size, obstacles) {
    return obstacles.some(obs =>
        x < obs.x + obs.w &&
        x + size > obs.x &&
        y < obs.y + obs.h &&
        y + size > obs.y
    );
}