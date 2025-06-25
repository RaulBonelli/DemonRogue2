let killTimestamps = [];
const FRENZY_KILLS = 10;
const FRENZY_WINDOW = 10000; // 10 seconds in milliseconds
let safada = "black";
let enemyBaseHealth = 100;
let enemyBaseDamage = 20;
let enemyBaseSpeed = 2;
class Enemy {
    constructor(x, y, size = 64, speed = 2, color = "red", attackRange = 180, attackSize = 140, damage = 20, imagePath = "./IMG/knight.png",type  ) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.color = color;
      this.speed = speed;
      this.attack = false;
      this.attackCooldown = false;
      this.attackRange = attackRange;
      this.attackSize = attackSize;
      this.enemyHealth = 100;
      this.hit = false;
      this.enemyDamage = damage;
      this.omegaEnemy = false;
      this.direction = 'right';
      this.enemyType = 1;
      this.up = false;
      this.down = false;
      this.left = false;
      this.right = false;
      this.currentSpeed = speed;
      this.knockbackVX = 0;
      this.knockbackVY = 0;
      this.knockbackTime = 0;
      this.beingPushed = false;
      this.beingPushedTimer = 0;
      this.attackWarning = false;
      this.type = type; // "melee" ou "shooter"
      this.shootTimer = 0; // só usado se for shooter

      // Create a unique image for this enemy
      this.enemyImage = new Image();
      this.enemyImage.src = imagePath;

      this.spritesheet = new Spritesheet(context, this.enemyImage, 2, 4, this.size, this.size);
      if(imagePath === "./IMG/mage.png") {
        this.spritesheet = new Spritesheet(context, this.enemyImage, 2, 3, this.size, this.size);}
      this.spritesheet.linha = 0;
      this.spritesheet.coluna = 0;
      this.spritesheet.intervalo = 200;
    }
    
    // Draw the enemy and its attack
    draw(context) {
      // Draw the enemy attack if active
      if (this.attack) {
        context.fillStyle = "yellow";
        context.fillRect(this.x, this.y, this.attackSize, this.attackSize);
      }
    


  

      //draw attack warning if active
      if( this.attackWarning) {
        context.save();
        context.globalAlpha = 0.5; // Semi-transparent warning
        context.fillStyle = "red"; // Warning color
        if (this.direction === 'right') {
          context.fillRect(this.x + this.size, this.y, this.size, this.size);
        } else if (this.direction === 'left') {
        context.fillRect(this.x - this.attackSize, this.y, this.size, this.size);
        }
        else if (this.direction === 'up') {
          context.fillRect(this.x, this.y - this.attackSize, this.size, this.size);
        } else if (this.direction === 'down') {
          context.fillRect(this.x, this.y + this.size, this.size, this.size);
        }
        context.restore();
      }
 
      // Draw the enemy
       if (this.spritesheet) {
        
    this.spritesheet.desenhar(this.x, this.y,this.size,this.size); // Draw the enemy using the spritesheet
    this.spritesheet.proximoQuadro(); // Animate
  } else {
    // fallback: draw a colored square if spritesheet not loaded
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.size, this.size);
  }
  context.fillStyle = this.color;
      // Draw the enemy attack if active
      if (this.attack) {
        context.fillStyle = "yellow";
        context.fillRect(x, y, this.attackSize, this.attackSize);
      }
    }
    // Update the enemy's movement and attack logic
    update(playerX, playerY, attackX, attackY, attackSize, attackActive, obstacles) {
      // Enemy follows the player

      if (this.knockbackTime > 0) {
    this.x += this.knockbackVX;
    this.y += this.knockbackVY;
    this.knockbackTime -= 16.67; // assuming ~60fps, adjust if needed
    // Optionally, stop knockback if colliding with wall, etc.
    }

    // Calculate desired movement direction
  const dx = playerX - this.x;
  const dy = playerY - this.y;

  let nextX = this.x;
  let nextY = this.y;

  // Prioritize axis with greatest distance
  let moved = false;
  if (Math.abs(dx) > Math.abs(dy)) {
    // Try horizontal first
    if (dx > 0) {
      this.direction = "right";
      this.spritesheet.linha = 1;
      if (!collidesWithObstacles(this.x + this.speed, this.y, this.size, obstacles)) {
        nextX += this.speed;
        moved = true;
      }
    } else {
      this.direction = "left";
      this.spritesheet.linha = 0;
      if (!collidesWithObstacles(this.x - this.speed, this.y, this.size, obstacles)) {
        nextX -= this.speed;
        moved = true;
      }
    }
    // If blocked horizontally, try vertical
    if (!moved) {
      if (dy > 0) {
        this.direction = "down";
        if (!collidesWithObstacles(this.x, this.y + this.speed, this.size, obstacles)) {
          nextY += this.speed;
          moved = true;
        }
      } else {
        this.direction = "up";
        if (!collidesWithObstacles(this.x, this.y - this.speed, this.size, obstacles)) {
          nextY -= this.speed;
          moved = true;
        }
      }
    }
  } else {
    // Try vertical first
    if (dy > 0) {
      this.direction = "down";
      if (!collidesWithObstacles(this.x, this.y + this.speed, this.size, obstacles)) {
        nextY += this.speed;
        moved = true;
      }
    } else {
      this.direction = "up";
      if (!collidesWithObstacles(this.x, this.y - this.speed, this.size, obstacles)) {
        nextY -= this.speed;
        moved = true;
      }
    }
    // If blocked vertically, try horizontal
    if (!moved) {
      if (dx > 0) {
        this.direction = "right";
        this.spritesheet.linha = 0;
        if (!collidesWithObstacles(this.x + this.speed, this.y, this.size, obstacles)) {
          nextX += this.speed;
          moved = true;
        }
      } else {
        this.direction = "left";
        this.spritesheet.linha = 1;
        if (!collidesWithObstacles(this.x - this.speed, this.y, this.size, obstacles)) {
          nextX -= this.speed;
          moved = true;
        }
      }
    }
  }

  // Only update position if not being knocked back
  if (this.knockbackTime <= 0 && moved) {
    this.x = nextX;
    this.y = nextY;
    this.stuckTime = 0;
  } else if (!moved) {
    // Optional: add stuck logic or random movement if totally blocked
    this.stuckTime = (this.stuckTime || 0) + 1;
    if (this.stuckTime > 30) {
      // Try a random direction to "unstick"
      const dirs = [
        [this.speed, 0], [-this.speed, 0], [0, this.speed], [0, -this.speed]
      ];
      const [dx, dy] = dirs[Math.floor(Math.random() * dirs.length)];
      if (!collidesWithObstacles(this.x + dx, this.y + dy, this.size, obstacles)) {
        this.x += dx;
        this.y += dy;
      }
      this.stuckTime = 0;
    }
  }

      if (this.left ==true && this.up == true){
        this.speed = this.currentSpeed * 0.5; // Reset speed to normal when moving diagonally
      }else{this.speed = this.currentSpeed;} // Reset speed to normal when not moving diagonally

      if (
        (this.left && this.up) ||
        (this.right && this.up) ||
        (this.left && this.down) ||
        (this.right && this.down)
      ) {
        this.speed = this.currentSpeed * 0.7; // or 0.707 for true diagonal
      } else {
        this.speed = this.currentSpeed;
      }

      if (frenzy == true){setTimeout(() => {
      frenzy = false; // Reset frenzy mode after 10 seconds
      console.log("Frenzy mode deactivated!");
      }, 10000);};

      if (this.x  > playerX +size &&
        this.x + this.size  < playerX
      ){ // <         {
          safada = "red";
          this.draw(context);
    }

    if(!collidesWithObstacles(nextX, nextY, this.size, obstacles)) {
        this.x = nextX;
        this.y = nextY;
        this.stuckTime = 0; // Reset stuck time when moving successfully
      }
    else if(!collidesWithObstacles(nextX, this.y, this.size, obstacles)) {
        this.x = nextX;
      }else if (!collidesWithObstacles(this.x, nextY, this.size, obstacles)) {
        this.y = nextY;

        
      }else {
         
        if (this.stuckTime <= 0) {
            // Tenta outro eixo
            let tried = false;
            if (this.direction === 'right' || this.direction === 'left') {
                // Tenta para cima
                if (!collidesWithObstacles(this.x, this.y - this.speed, this.size, obstacles)) {
                    this.direction = 'up';
                    tried = true;
                }
                // Tenta para baixo
                else if (!collidesWithObstacles(this.x, this.y + this.speed, this.size, obstacles)) {
                    this.direction = 'down';
                    tried = true;
                }
            } else if (this.direction === 'up' || this.direction === 'down') {
                // Tenta para a esquerda
                if (!collidesWithObstacles(this.x - this.speed, this.y, this.size, obstacles)) {
                    this.direction = 'left';
                    tried = true;
                }
                // Tenta para a direita
                else if (!collidesWithObstacles(this.x + this.speed, this.y, this.size, obstacles)) {
                    this.direction = 'right';
                    tried = true;
                }
            }
            if (!tried) {
                // Se não conseguiu, espera um pouco antes de tentar de novo
                this.stuckTime = 500; // ms
            }
        } else {
            this.stuckTime -= 16.67; // ~1 frame
        }
    }
    

if(checkCollision(this.x, this.y, this.size, playerX, playerY, size) && !invulnerable && !Pdead) {
  touching = true; // Set touching flag if colliding with player
  this.speed *= -1; // Stop enemy movement when colliding with player

}

    
        
          if(this.killCount % 2 ==0 && this.killCount != 0) {
            randomEnemy = Math.floor(Math.random() * 3) + 1; // Randomize enemy type between 1 and 3
          }
           if(currentRoom.enemies.length < enemiesLimit && !tutorial && Bosses.length == 0 && !Pdead && transitioning == false) {
          if(currentRoom.obstacles.length > 0 ) {
         spawnEnemy();
          }
        }

      if(this.speed > 10){
        this.speed = 10; // Ensure minimum speed
      }
     
     

      // Enemy attack logic
       if (this.type === "shooter") {
    // Shooter logic
    this.shootTimer -= 16.67;
    if (this.shootTimer <= 0) {
      this.shootAtPlayer(playerX, playerY);
      this.shootTimer = 1500; // ms entre tiros
    }
  } else if (
        Math.abs(nextX - playerX) <= this.attackRange && // Check horizontal distance
        Math.abs(nextY - playerY) <= this.attackRange && // Check vertical distance
        !this.attackCooldown &&
        !invulnerable &&
        !Pdead &&
        this.type === "melee" // Only melee enemies attack this way
      ) {
        if (!this.attackWarning) {
          this.attackWarning = true; // Activate attack warning
          setTimeout(() => {
             if (
        Math.abs(nextX - playerX) <= this.attackRange && // Check horizontal distance
        Math.abs(nextY - playerY) <= this.attackRange && // Check vertical distance
        !this.attackCooldown &&
        !invulnerable &&
        !Pdead // Ensure the enemy is not on cooldown
      ) {
            this.attackWarning = false; // Deactivate attack warning after 1 second
        this.attack = true; // Activate enemy attack
        console.log("Enemy is attacking!");
        health -= this.enemyDamage; // Decrease player's health on enemy attack
        dead(health); // Check if player is dead
 
        // Start cooldown for enemy attack
        this.attackCooldown = true;
        setTimeout(() => {
          this.attack = false; // Deactivate enemy attack after a short duration
        }, 200); // Attack lasts 200ms
 
        setTimeout(() => {
          this.attackCooldown = false; // Reset cooldown after 1 second
        }, 1000);
      }else {this.attackWarning = false; // Deactivate attack warning if conditions are not met
      }
      },500); // Warning lasts 500ms
      }
    }
      // Check for collision between player's attack and enemy
      if (
        attackActive &&
        checkCollision(attackX, attackY, attackSize, this.x, this.y, this.size) && this.hit == false
      ) {
        console.log("Enemy hit!");
        if (calcularDano() > heroDamage) {
  // Opcional: mostrar efeito visual de crítico
  console.log("CRÍTICO!");
}
// enemy.js (inside update(), where enemy takes damage)

  // ...existing code...
  let damage = calcularDano();
  this.enemyHealth -= damage;
  // Add damage popup
  damagePopups.push({
    x: this.x + this.size / 2,
    y: this.y,
    value: Math.round(damage),
    alpha: 1,
    dy: -1,
    time: 0
  });
  // ...rest of your code...

        if (frenzy == false) {
        this.color = "green"; // Change enemy color to green on hit
        this.enemyHealth -= calcularDano(); // Decrease enemy health on hit
        this.speed *= -1;
        setTimeout(() => {
            this.speed *=-1; // Reset cooldown after 1 second
          }, 100);
                // After confirming collision and before enemyDead()
        const knockbackDistance = 40; // total distance to move
        const knockbackDuration = 200; // ms
        const dx = this.x - attackX;
        const dy = this.y - attackY;
        const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist !== 0 && !collidesWithObstacles(this.x + (dx / dist) * knockbackDistance, this.y + (dy / dist) * knockbackDistance, this.size, obstacles)) {
        this.knockbackVX = (dx / dist) * (knockbackDistance / (knockbackDuration / 16.67)); // 16.67ms ≈ 1 frame at 60fps
        this.knockbackVY = (dy / dist) * (knockbackDistance / (knockbackDuration / 16.67));
        this.knockbackTime = knockbackDuration;
    }
        this.enemyDead(); // Check if enemy is dead
        this.hit = true; // Set hit flag to true
        setTimeout(() => {
          this.hit = false; // Reset hit flag after 1 second
        }, 200);}else if (frenzy == true) {
          this.enemyHealth -= heroDamage +10; // Decrease enemy health on hit
          this.enemyDead(); // Check if enemy is dead
          this.hit = true; // Set hit flag to true
          
          setTimeout(() => {
            this.hit = false; // Reset hit flag after 1 second
          }, 200);
        }
      }
      currentRoom.enemies = currentRoom.enemies.filter(enemy => enemy.enemyHealth > 0);


    }
     shootAtPlayer(playerX, playerY) {
    const dx = playerX - this.x;
    const dy = playerY - this.y;
    const angle = Math.atan2(dy, dx); // <-- angle in radians
    const speed = 23.1; // consistent speed
    projectiles.push(new EnemyProjectile(
        this.x + this.size / 2,
        this.y + this.size / 2,
        angle,
        speed // pass speed here
    ));
}
avoidOtherEnemies(enemies) {
  for (let other of enemies) {
    if (other !== this) {
      const dx = this.x - other.x;
      const dy = this.y - other.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const minDist = this.size;

      if (dist < minDist && dist !== 0 && !collidesWithObstacles(this.x + (dx / dist) * 10, this.y + (dy / dist) * 10, this.size, currentRoom.obstacles)) {
        // Empurra o inimigo levemente para longe do outro
        this.x += (dx / dist) * 0.5;
        this.y += (dy / dist) * 0.5;
      }
    }
  }
}
 
    // Handle enemy defeat
    enemyDead() {
      if (this.enemyHealth <= 0) {
        console.log("Enemy defeated!");
        this.color = "blue"; // Change enemy color to blue on defeat
        this.speed = 0; // Stop enemy movement
        this.attack = false; // Deactivate enemy attack
        this.attackCooldown = false; // Reset enemy attack cooldown
        this.attackRange = 0; // Disable enemy attack range
        this.attackSize = 0; // Disable enemy attack size
        this.x = -100; // Move enemy off-screen
        this.y = -100; // Move enemy off-screen
        this.enemyType = Math.floor(Math.random() * 3) + 1; // Randomize enemy type between 1 and 3
        // Troca de spritesheet conforme o tipo
        let newImage = new Image();
        if (this.enemyType == 1) {
          newImage.src = "./IMG/SpriteSheetRenan (1).png";
        } else if (this.enemyType == 2) {
          newImage.src = "./IMG/SpriteSheetRenan (2).png";
        } else if (this.enemyType == 3) {
          newImage.src = "./IMG/SpriteSheetRenan (3).png";
        }
        this.spritesheet.imagem = newImage;
    
        // Opcional: resetar animação
        this.spritesheet.coluna = 0;
        this.spritesheet.linha = 0;
        
        if(currentRoom.enemies.length < enemiesLimit && !tutorial && Bosses.length == 0 && !Pdead && transitioning == false) {
         // Spawn a new enemy
          if(currentRoom.obstacles.length > 0) {

         spawnEnemy();
          }
        }
        this.size = 0;
        health += Math.random() * (10-0) -0; // Increase player health
          experience += Math.random() * (30-10) +10 * enemyStatMultiplier; // Increase experience points
          console.log("Experience points: " + experience);
          if(this.omegaEnemy == true){
          experience += Math.random() * (80-50) +50; // Increase experience points
          }

          if(killCount< 30 && killCount % 3 ==0 && killCount != 0) {
            enemiesLimit ++; // Increase enemy limit every 3 kills
            enemyStatMultiplier*=1.1;
          }else if(killCount >= 30 && killCount % 5 ==0 && killCount != 0) {
            enemiesLimit ++; // Increase enemy limit every 5 kills
            enemyStatMultiplier*=1.05;
          }else if(killCount >= 50 && killCount % 10 ==0 && killCount != 0) {
            enemiesLimit ++; // Increase enemy limit every 10 kills
            enemyStatMultiplier*=1.02;
          }else if(killCount >= 100 && killCount % 20 ==0 &&
            killCount != 0) {
            enemiesLimit ++; // Increase enemy limit every 20 kills
            enemyStatMultiplier*=1.01;
          }
        
        killCount += 1;
        // --- Frenzy logic ---
        const now = Date.now();
        killTimestamps.push(now);
        // Keep only the last FRENZY_KILLS timestamps
        if (killTimestamps.length > FRENZY_KILLS) {
          killTimestamps.shift();
        }
        // Check if last 10 kills are within FRENZY_WINDOW ms
        if (
          killTimestamps.length === FRENZY_KILLS &&
          (killTimestamps[FRENZY_KILLS - 1] - killTimestamps[0]) <= FRENZY_WINDOW
        ) {
          frenzy = true;
          console.log("Frenzy mode activated!");
          // Optionally, reset timestamps so you can't instantly retrigger
          killTimestamps = [];
          setTimeout(() => {
            frenzy = false;
            console.log("Frenzy mode deactivated!");
          }, 10000); // Frenzy lasts 10 seconds
        }

        console.log("Kill count: " + killCount);
      }
    }
   

   
  }



class EnemyProjectile {
    constructor(x, y, angle, speed = 20 , size = 8, color = "red") {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = speed;
        this.size = size;
        this.color = color;
        this.damage = 40;
    }

    update(playerX, playerY, playerSize) {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        if(checkCollision(this.x, this.y, this.size, playerX, playerY, playerSize)) {
            // Handle collision with player
            if (activateShield) {
                this.speed *= -1;
            }else{
           health -= this.damage; // Example damage
           this.x = -100; // Move off-screen
           this.y = -100; // Move off-screen
            dead(health)
            }
        }
       
    }
    

    draw(context) {
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fill();
    }

    isOffScreen() {
        return (
            this.x < 0 || this.x > canvas.width ||
            this.y < 0 || this.y > canvas.height
        );
    }
}

