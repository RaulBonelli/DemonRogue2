class Boss {
  constructor(
    x,
    y,
    size = 40,
    speed = 1,
    color = "purple",
    attackRange = 30,
    attackSize = 30,
    health = 1000
  ) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.speed = speed;
    this.attack = false;
    this.attackCooldown = false;
    this.attackRange = attackRange;
    this.attackSize = attackSize;
    this.BossHealth = health;
    this.hit = false;
    this.dead = false;
    this.bossImage = new Image();
this.bossImage.src = "./IMG/MIKU.png"; // Use your boss spritesheet path

this.spritesheet = new Spritesheet(context, this.bossImage, 4, 4, this.size, this.size); // Adjust rows/cols as needed
this.spritesheet.linha = 0;
this.spritesheet.coluna = 0;
this.spritesheet.intervalo = 200;

    // State management
    this.state = "following";
    this.stateTimer = Date.now() + 3000;

    // Multi random attacks (for teleporting)
    this.randomAttacks = [];
    this.attackCount = 3;
    this.warningDuration = 700; // ms
    this.attackDuration = 300; // ms
    this.randomAttackSize = 400;
    this.randomWarningColor = "red"; // Color for warning phase
  }

  draw(context) {
    // Draw boss
     if (this.spritesheet && this.bossImage.complete && this.bossImage.naturalWidth > 0) {
        this.spritesheet.desenhar(this.x, this.y, this.size, this.size);
        this.spritesheet.proximoQuadro();
    } else {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.size, this.size);
    }
    // Draw split attacks (two halves)
if (this.state === "splitAttack" && this.splitAttacks) {
    for (const atk of this.splitAttacks) {
        const now = Date.now();
        // Warning phase
        if (now < atk.start + this.warningDuration) {
            context.save();
            context.globalAlpha = 0.5;
            context.fillStyle = atk.color;
            context.fillRect(atk.x, atk.y, atk.w, atk.h);
            context.restore();
        }
        // Attack phase
        else if (now < atk.start + this.warningDuration + this.attackDuration) {
            context.save();
            context.globalAlpha = 0.8;
            context.fillStyle = "red";
            context.fillRect(atk.x, atk.y, atk.w, atk.h);
            context.restore();
        }
    }
}

    // Draw normal attack (when following)
    if (this.attack && this.state === "following") {
      context.fillStyle = "yellow";
      context.fillRect(this.x, this.y, this.attackSize, this.attackSize);
    }

    // Draw warnings and attacks (when teleporting)
    if (this.state === "teleporting") {
      for (const atk of this.randomAttacks) {
        const now = Date.now();
        // Warning phase
        if (now < atk.start + this.warningDuration) {
          context.save();
          context.globalAlpha = 0.5;
          context.strokeStyle = atk.color;
          context.lineWidth = 10;
          context.strokeRect(
            atk.x,
            atk.y,
            this.randomAttackSize,
            this.randomAttackSize
          );
          context.font = "bold 100px Arial";
          context.fillStyle = atk.color;
          context.fillRect(
            atk.x,
            atk.y,
            this.randomAttackSize,
            this.randomAttackSize
          );
          context.fillStyle = "white";
          context.fillText(
            atk.number + 1,
            atk.x + this.randomAttackSize / 2,
            atk.y + this.randomAttackSize / 2,
            2000
          );

          context.restore();
        }
        // Attack phase
        else if (now < atk.start + this.warningDuration + this.attackDuration) {
          context.fillStyle = "orange";
          context.fillRect(
            atk.x,
            atk.y,
            this.randomAttackSize,
            this.randomAttackSize
          );
        }
      }
    }
  }

  update(playerX, playerY, attackX, attackY, attackSize, attackActive) {
    const now = Date.now();

    // --- State transitions ---
    if (this.state === "following" && now > this.stateTimer) {
      this.state = "teleporting";
      this.stateTimer =
        now +
        this.attackCount * (this.warningDuration + this.attackDuration) +
        200; // total teleport time
      // Teleport to random position
      this.x = Math.random() * (canvas.width - this.size);
      this.y = Math.random() * (canvas.height - this.size);
      // Prepare three random attacks
      this.randomAttacks = [];
      for (let i = 0; i < this.attackCount; i++) {
        for (let i = 0; i < 3; i++) {
          const warningColors = ["red", "green", "blue", "yellow", "purple"];
          this.randomAttacks.push({
            x: Math.random() * (canvas.width - this.randomAttackSize),
            y: Math.random() * (canvas.height - this.randomAttackSize),
            start: now + i * (this.warningDuration + this.attackDuration),
            color: warningColors[i % warningColors.length],
            number: i, // Assign a random color
          });
        }
      }
    } else if (this.state === "teleporting" && now > this.stateTimer) {
      this.state = "splitAttack";
      // Each attack: warning + attack, so total duration for one = warningDuration + attackDuration
      // Second attack starts after the first finishes
      this.stateTimer =
        now + 2 * (this.warningDuration + this.attackDuration) + 200;
      this.splitAttacks = [
        {
          x: 0,
          y: 0,
          w: canvas.width / 2,
          h: canvas.height,
          start: now,
          color: "red",
        },
        {
          x: canvas.width / 2,
          y: 0,
          w: canvas.width / 2,
          h: canvas.height,
          start: now + this.warningDuration + this.attackDuration, // <-- starts after the first finishes
          color: "blue",
        },
      ];
    } else if (this.state === "splitAttack" && now > this.stateTimer) {
      this.state = "following";
      this.stateTimer = now + 3000;
      this.splitAttacks = [];
    }
    // --- Following form ---
    if (this.state === "following") {
      // Move toward player
      if (this.x < playerX - this.attackRange) this.x += this.speed;
      if (this.x > playerX + this.attackRange) this.x -= this.speed;
      if (this.y < playerY - this.attackRange) this.y += this.speed;
      if (this.y > playerY + this.attackRange) this.y -= this.speed;

      // Normal attack
      if (
        Math.abs(this.x - playerX) <= this.attackRange &&
        Math.abs(this.y - playerY) <= this.attackRange &&
        !this.attackCooldown &&
        !invulnerable
      ) {
        this.attack = true;
        health -= 20;
        dead(health);
        this.attackCooldown = true;
        setTimeout(() => {
          this.attack = false;
        }, 200);
        setTimeout(() => {
          this.attackCooldown = false;
        }, 1000);
      }
    }

    // --- Teleporting form: check for attack hits ---
    if (this.state === "teleporting" && this.dead === false) {
      for (const atk of this.randomAttacks) {
        // Only active during attack phase (not warning)
        if (
          now >= atk.start + this.warningDuration &&
          now < atk.start + this.warningDuration + this.attackDuration &&
          checkCollision(
            playerX,
            playerY,
            20,
            atk.x,
            atk.y,
            this.randomAttackSize
          ) &&
          !invulnerable
        ) {
          health -= 20;
          dead(health);
        }
      }
    }
    // --- Split attack: check for attack hits ---
if (this.state === "splitAttack" && this.dead === false && this.splitAttacks) {
    for (const atk of this.splitAttacks) {
        if (
            now >= atk.start + this.warningDuration &&
            now < atk.start + this.warningDuration + this.attackDuration &&
            playerX + 20 > atk.x && playerX < atk.x + atk.w &&
            playerY + 20 > atk.y && playerY < atk.y + atk.h &&
            !invulnerable
        ) {
            health -= 20;
            dead(health);
        }
    }
}

    // --- Player attacks boss ---
    if (
      attackActive &&
      checkCollision(attackX, attackY, attackSize, this.x, this.y, this.size) &&
      !this.hit
    ) {
      this.color = "green";
      this.BossHealth -= calcularDano();
      this.hit = true;
      setTimeout(() => {
        this.hit = false;
      }, 200);
      this.BossDead();
      this.rage();
    }
  }
  rage() {
    if (this.BossHealth <= this.BossHealth * 0.75 && !this.dead) {
      this.speed = 2;
      this.attackCount = 4;
      this.warningDuration = 600;
      this.attackDuration = 400;
      this.randomAttackSize = 500;

      console.log("Boss is enraged!");
    } else if (this.BossHealth <= this.BossHealth * 0.5 && !this.dead) {
      this.speed = 4;
      this.attackCount = 5;
      this.warningDuration = 500;
      this.attackDuration = 300;
      console.log("Boss is enraged!");
    }
  }
  BossDead() {
    if (this.BossHealth <= 0) {
      console.log("Boss defeated!");
      this.color = "blue";
      this.speed = 0;
      this.attack = false;
      this.attackCooldown = false;
      this.attackRange = 0;
      this.attackSize = 0;
      this.x = -100;
      this.y = -100;
      this.size = 0;
      this.dead = true;
      killCount += 1;
      // You can spawn a new boss here if you want
    }
  }
}

function dead(health) {
  if (health <= 0) {
    console.log("Player is dead!");
    cor = "black"; // Change player color to black on death
    alert("Game Over!"); // Display game over message
    window.location.reload(); // Reload the page to restart the game
  }
}
