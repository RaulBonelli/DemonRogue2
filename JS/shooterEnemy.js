class ShooterEnemy {
    constructor(x, y, size = 24, speed = 1, color = "orange", shootInterval = 1500) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.speed = speed;
        this.shootInterval = shootInterval;
        this.lastShot = Date.now();
        this.projectiles = [];
        this.enemyHealth = 100;
        this.canShoot = true;
        this.hit = false; // Add hit flag like in Enemy
    }

    update(playerX, playerY, attackX, attackY, attackSize, attackActive) {
        // Move towards player (optional)
        if (this.x < playerX +150){ this.x += this.speed; this.canShoot = true;}
        if (this.x > playerX - 150) {this.x -= this.speed;this.canShoot = true;}
        if (this.y < playerY + 150) {this.y += this.speed;this.canShoot = true;}
        if (this.y > playerY -150) {this.y -= this.speed;this.canShoot = true;}

         if (this.x > playerX &&
          this.x - this.size -2 < playerX &&
          playerY > this.y - this.size  &&
          playerY < this.y + this.size  )
            {canMoveRight = false;}
      if (this.x < playerX &&
          this.x +this.size +2 > playerX &&
          playerY > this.y - this.size  &&
          playerY < this.y + this.size )
            {canMoveLeft = false;}
      if (this.x - this.size < playerX &&
          this.x + this.size > playerX &&
          playerY > this.y &&
          playerY < this.y + this.size +2){canMoveUp = false;}
      if (this.x - this.size < playerX &&
          this.x + this.size > playerX &&
          playerY > this.y - this.size -2 &&
          playerY < this.y){canMoveDown = false;}

        // Shoot at intervals
        if (Date.now() - this.lastShot > this.shootInterval && this.canShoot) {
            this.shoot(playerX, playerY);
            this.lastShot = Date.now();
        }

        // --- Collision with player attack ---
        if (
            attackActive &&
            checkCollision(attackX, attackY, attackSize, this.x, this.y, this.size) &&
            !this.hit
        ) {
            this.enemyHealth -= heroDamage; // Or whatever damage variable you use
            this.color = "green"; // Optional: feedback
            this.hit = true;
            setTimeout(() => { this.hit = false; }, 200);
            if (this.x > playerX && this.x <playerX + attackSize) {
                this.x -= 10; // Push away from attack
            }if (this.x < playerX + attackSize && this.x > playerX) {
                this.x += 10; // Push away from attack
            }
            if (this.y > attackY && this.y < attackY + attackSize) {
                this.y += 10; // Push away from attack
            }
            if (this.y < attackY + attackSize && this.y > attackY) {
                this.y -= 10; // Push away from attack
            }

            if (this.enemyHealth <= 0) {
                this.onDeath();
            }
        }

        // Update projectiles
        this.projectiles.forEach(p => p.update(playerX, playerY, this.size, this.enemyHealth));
        // Remove projectiles that are off-screen
        this.projectiles = this.projectiles.filter(p => !p.isOffScreen());
    }

    shoot(targetX, targetY) {
        const angle = Math.atan2(targetY - this.y, targetX - this.x);
        this.projectiles.push(new EnemyProjectile(this.x + this.size/2, this.y + this.size/2, angle));
    }

    draw(context) {
        // Draw the enemy
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.size, this.size);

        // Draw projectiles
        this.projectiles.forEach(p => p.draw(context));
    }

    onDeath() {
        // Handle shooter enemy death (remove from array, give XP, etc.)
        this.x = -100;
        this.y = -100;
        this.speed = 0; // Stop movement
        this.size = 0;
        this.projectiles = []; // Clear projectiles
        this.enemyHealth = 0; // Reset health
        this.canShoot = false; // Prevent further shooting
        this.hit = false; // Reset hit state
        killCount++; // Increment kill count or similar logic
        // Optionally: remove from shooterEnemies array in your main game loop
        // Give XP, play sound, etc.
    }
}

