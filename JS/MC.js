let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
canvas.width = 2150
canvas.height = 1100
context.imageSmoothingEnabled = false;

const rooms = [
    new Room(
        0, 0, 2450, 1200,
        [
            {x: 100, y: 800, w: 300, h: 200},
            {x: 1700, y: 300, w: 100, h: 50},
            {x: 1900, y: 700, w: 200, h: 100},
        ],
        [] // inimigos serão adicionados depois
    ),
    // Adicione mais salas aqui
];
const rooms2 = [
    new Room(
       0, 0, 2450, 1200,
        [
            {x: 400, y: 800, w: 400, h: 200},
            {x: 1200, y: 0, w: 100, h: 100},
            {x: 1600, y: 900, w: 500, h: 200},
        ],
        [] // inimigos serão adicionados depois
    ),
    // Adicione mais salas aqui
];

const rooms3 = [
    new Room(
        0, 0, 2450, 1200,
        [
            {x: 700, y: 100, w: 200, h: 300},
            {x: 2000, y: 600, w: 100, h: 500},
            {x: 1200, y: 700, w: 200, h: 100},
        ],
        [] // inimigos serão adicionados depois
    ),
  ]

const bossRoom = new Room(
        0, 0, 2450, 1200,
    [
        {x: 0, y: 1000, w: 2150, h: 300},
       
    ],
    [] // inimigos serão adicionados depois
);

const playerImage = new Image();
playerImage.src = "./IMG/SPRITESHEET.png"; // Path to your player image

const SwordImage = new Image();
SwordImage.src = "./IMG/spriteSheetSword.png"; // Path to your sword image

const spriteWidth = 50; // Width of each sprite frame
const spriteHeight = 50; // Height of each sprite frame
let spriteRow = 0; // Row of the sprite sheet to use
let spriteCol = 0; // Column of the sprite sheet to use

// Player location
let x = 500;
let y = 500;

let enemyStatMultiplier = 1;

// Player movement flags
let enemyVariant = "melee"; // Default enemy variant
let lastRoomTransition = 0;
let projectiles = []; // Array to store projectiles
let touching = false; // Flag to check if player is touching an enemy
let deltaTime = 0; // Time since last frame in milliseconds
let baseSpeed = 4;
let Pspeed = baseSpeed;
let cor = "blue"; // Player color
let attackX = 0;
let attackY = 0;
let attackActive = false; // Flag to track if the attack is active
let attackCooldown = false; // Flag to track if the attack is on cooldown
let attackSize = 150; // Attack size
let attackColor = "red"; // Attack color
let attackKeyHeld = false; // Flag to track if the attack key is being held down
let dashCooldown = false; // Flag to track if the dash is on cooldown
let health = 200; // Player health
let size = 128;
let enemyX = 0; // Enemy x position
let enemyY = 0; // Enemy y position
let canMoveRight = true; // Flag to check if player can move right
let canMoveLeft = true; // Flag to check if player can move left
let canMoveUp = true; // Flag to check if player can move up
let canMoveDown = true; // Flag to check if player can move down
let killCount = 0; // Counter for kills
let frenzy = false; // Flag to check if frenzy mode is active
let experience = 0; // Player experience
let level = 1; // Player level
let invulnerable = false; // Flag to check if player is invulnerable
let choosingStat = false;
let heroDamage = 30; // Player damage
let attackCooldownDuration = 700; // Attack cooldown duration in milliseconds
let attackDirection = "right"; // default direction
let Pdead = false; // Flag to check if player is dead
let maxHP = 200; // Maximum health points
let xpToNextLevel = 100; // Experience needed to level up
let activateShield = false; // Flag to check if shield is active
let bounce = false; // Flag to check if player can bounce off enemies
let gotSword = false; // Flag to check if player has a sword
let gotShield = false; // Flag to check if player has a shield
let swordX = 500; // Sword x position
let swordY = 300; // Sword y position
let swordSize = 90; // Sword size
let shieldX = 700; // Shield x position
let shieldY = 300; // Shield y position
let shieldSize = 120; // Shield size
let shieldCooldown = false; // Flag to check if shield is on cooldown
let shieldSpawn = false; // Flag to check if shield is spawned
let paused = false; // Flag to check if the game is paused
let tutorial = true; // Flag to check if tutorial is active
let canSpawn = false; // Flag to check if enemies can spawn
let enemiesLimit = 3; // Maximum number of enemies allowed on screen
let rotationAngle = 0; // Angle for sword rotation
let randomEnemy =1;
let enemiesSpawned =false;
let shooterEnemiesSpawned = false; // Flag to check if shooter enemies are spawned
let critChance = 0.1; // 10% chance to deal critical damage
let critMultiplier = 2; // Critical damage multiplier
let currentSpeed = Pspeed; // Current speed of the player
let currentRoom = rooms[0]; // Current room the player is in
let transitioning = false; // Flag to check if the player is transitioning between rooms
let damagePopups = [];



// W, A, S, D -> indices 0,1,2,3
let pressedKeys = [false, false, false, false];

// Array to store multiple enemies
let enemies = [];
let Bosses = [];
let shooterEnemies = []; // Array to store shooter enemies


// Spawn some enemies

function draw() {

  

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "black"; // Set player color
  context.fillRect(0, 0, canvas.width, canvas.height);
currentRoom.draw(context); // Draw the current room

  

  // Draw damage popups
for (let i = damagePopups.length - 1; i >= 0; i--) {
  let popup = damagePopups[i];
  context.save();
  context.globalAlpha = popup.alpha;
  context.fillStyle = "yellow";
  context.font = "32px Determination";
  context.fillText(popup.value, popup.x, popup.y);
  context.restore();
  popup.y += popup.dy;
  popup.alpha -= 0.02;
  popup.time += 1;
  if (popup.alpha <= 0 || popup.time > 50) {
    damagePopups.splice(i, 1);
  }
}
 


  // Draw the player
 playerSpritesheet.desenhar(x, y);

 //draw sword

 context.fillStyle = "yellow";
 const soulImage = new Image();
 soulImage.src = "./IMG/soul.webp"; // Path to your soul image
  context.drawImage(soulImage,swordX, swordY, swordSize, swordSize); // Draw the sword

  
  // Draw the attack if active
  if (attackActive) {
    context.save();
    context.fillStyle = attackColor;
    
     context.translate(attackX + attackSize / 2, attackY + attackSize / 2);
     context.rotate(rotationAngle); // Rotate the attack by 45 degrees
    
    swordSpritesheet.proximoQuadro(); // <-- Add this line
     swordSpritesheet.desenhar(-attackSize / 2 -55, -attackSize / 2-60 , attackSize, attackSize);
    
    context.restore();
    
  }else {
    if(swordSpritesheet) {
    swordSpritesheet.coluna = 0; // Reset to idle frame when not attacking
    }
  }



  // Draw all enemies
  currentRoom.enemies.forEach((enemy) => enemy.draw(context));
  // Draw shooter enemies

  // Draw Bosses
  Bosses.forEach((boss) => boss.draw(context));
  // Draw health bar

  // Draw shield status
  if (activateShield) {
    context.fillStyle = "cyan";
    context.strokeRect(x+5, y+5, size+10, size+10);



  }

  // Draw shield on the ground if not collected
if (!gotShield && shieldSpawn) {
const shieldImage = new Image();
shieldImage.src = "./IMG/shield.png"; // Path to your shield image
  context.drawImage(shieldImage, shieldX, shieldY, shieldSize, shieldSize); // Draw the shield
  context.fillStyle = "black";
  context.fillText("Shield", shieldX, shieldY - 5);
  
}




  // Update projectiles

// Draw projectiles
projectiles.forEach(p => p.draw(context));


  // 1. Desenhe tudo normalmente (player, inimigos, salas, etc.)

  // 2. Máscara de escuridão com gradiente radial
  context.save();
  // Cria gradiente radial centrado no player
  const lightRadius = 600; // raio da luz
  const gradient = context.createRadialGradient(
    x + size / 2, y + size / 2, lightRadius * 0.5, // centro, início do gradiente
    x + size / 2, y + size / 2, lightRadius        // centro, fim do gradiente
  );
  gradient.addColorStop(0, "rgba(0,0,0,0)");   // centro totalmente transparente
  gradient.addColorStop(1, "rgba(0,0,0,1)");   // borda totalmente preta

  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.restore();

  if(!gotSword){
  context.save();
  const swordLight = context.createRadialGradient(
    swordX + swordSize / 2, swordY + swordSize / 2, 10,
    swordX + swordSize / 2, swordY + swordSize / 2, 120 // raio da luz
  );
  swordLight.addColorStop(0, "rgba(255,255,180,0.4)"); // centro amarelo claro
  swordLight.addColorStop(1, "rgba(255,255,180,0)");
  context.globalAlpha = 1;
  context.fillStyle = swordLight;
  context.beginPath();
  context.arc(swordX + swordSize / 2, swordY + swordSize / 2, 120, 0, Math.PI * 2);
  context.fill();
  context.restore();

  }

  if(shieldSpawn && !gotShield) {
  context.save();
  const shieldLight = context.createRadialGradient(
    shieldX + shieldSize / 2, shieldY + shieldSize / 2, 10,
    shieldX + shieldSize / 2, shieldY + shieldSize / 2, 120 // raio da luz
  );
  shieldLight.addColorStop(0, "rgba(180,255,255,0.4)"); // centro azul claro
  shieldLight.addColorStop(1, "rgba(180,255,255,0)");
  context.globalAlpha = 1;
  context.fillStyle = shieldLight;
  context.beginPath();
  context.arc(shieldX + shieldSize / 2, shieldY + shieldSize / 2, 120, 0, Math.PI * 2);
  context.fill();
  context.restore();
  }
  context.fillStyle = "red";
  context.fillRect(10, 10, 200, 20); // Background
  context.fillStyle = "green";
  context.fillRect(10, 10, health * 2, 20); // Health bar

  // boss health bar
  if(Bosses.length > 0){
  context.fillStyle = "red";
  context.fillRect(10, 40, 1000, 20); // Background
  context.fillStyle = "purple";
  context.fillRect(10, 40, Bosses.health, 20); // Health bar
  }
  if (Bosses.length > 0) {
    let boss = Bosses[0];
    context.fillRect(10, 40, boss.BossHealth, 20); // Health bar width = health
  }
 
  // Draw experience bar
  context.fillStyle = "blue";
  context.fillRect(10, 70, 200, 20); // Background
  context.fillStyle = "yellow";
  context.fillRect(10, 70, experience * 2, 20); // Experience bar

  // Draw level
  context.fillStyle = "white";
  context.font = "20px Arial";
  context.fillText("Level: " + level, 10, 120);
  // Draw kill count
  context.fillText("Kill Count: " + killCount, 10, 150);
  // Draw frenzy mode
  if (frenzy) {
    context.fillText("Frenzy Mode Active!", 10, 180);
  }
  
}



let playerSpritesheet;
let swordSpritesheet; // Declare swordSpritesheet variable
let enemySpritesheet; // Declare enemySpritesheet variable

SwordImage.onload = function() {
  swordSpritesheet = new Spritesheet(context, SwordImage, 1, 10); // 4 rows, 4 columns (adjust if needed)
  swordSpritesheet.intervalo = 30;
  swordSpritesheet.linha = 0; // Set the row to 0 for the sword
  swordSpritesheet.coluna = 0; // Set the column to 0 for the sword
  swordSpritesheet.width =attackSize *2; // Set the size of the sword
  swordSpritesheet.height = attackSize *2; // Set the height of the sword
  update();

  
  };


playerImage.onload = function() {
  playerSpritesheet = new Spritesheet(context, playerImage, 4, 4); // 4 rows, 4 columns (adjust if needed)
  playerSpritesheet.linha = 0; // Set the row to 0 for the player
  playerSpritesheet.coluna = 0; // Set the column to 0 for the player
  playerSpritesheet.width = size; // Set the size of the player
  playerSpritesheet.height = size; // Set the height of the player
  playerSpritesheet.intervalo = 200;
  update();};

// Initialize enemy spritesheet

 

if (playerSpritesheet) {
  if (pressedKeys[0] || pressedKeys[1] || pressedKeys[2] || pressedKeys[3]) {
    playerSpritesheet.proximoQuadro();
  } else {
    playerSpritesheet.coluna = 0; // Idle frame
  }
}
function spawnEnemies() {
  if (transitioning) return; // Block spawning during transition
  if (!tutorial && canSpawn && currentRoom.enemies.length < enemiesLimit && !enemiesSpawned && Bosses.length === 0 && transitioning === false) {
    setTimeout(() => {
      currentRoom.enemies.push(new Enemy(Math.random()*canvas.width +200,Math.random()*canvas.height +200));
    }, 1000);
    if ( currentRoom.enemies.length >= enemiesLimit) {
      enemiesSpawned=true; 
    }
  }
}


function update() {

   if (paused) {
    draw(); // Optionally, still draw the paused screen
    context.fillStyle = "rgba(0,0,0,0.5)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "white";
    return;
  }
  if (transitioning) {
    draw(); // Optionally, still draw the transition screen
    return; // Stop updating game logic while transitioning
  }
  

  if ( currentRoom.enemies.length <= enemiesLimit && !tutorial) {
    canSpawn = true; // Allow spawning of new enemies
  } else {
    canSpawn = false; // Prevent spawning of new enemies
  }
spawnEnemies(); // Call the function to spawn enemies
 

  if (choosingStat) {
    return; // Don't update if in level-up menu
  }
 currentSpeed = Pspeed; // Reset current speed to base speed
  // Check if dash key (J) is pressed and not on cooldown
  if (pressedKeys[4] && !dashCooldown) {
    //vsfd

    currentSpeed = Pspeed * 5;
    canMoveRight = true; // Reset movement flags
  canMoveLeft = true;
  canMoveUp = true;
  canMoveDown = true; // Temporarily increase speed
  invulnerable = true; // Set invulnerable flag
    setTimeout(() => {
      invulnerable = false; // Reset invulnerable flag after 1 second
    }, 1000);
    setTimeout(() => {
    dashCooldown = true; // Start cooldown
    },100);
    setTimeout(() => {
      dashCooldown = false; // Reset cooldown after 1 second
      
    }, 1000);
  }
levelUp();


projectiles.forEach(p => p.update(x, y, size, health));
projectiles = projectiles.filter(p => !p.isOffScreen());


if (killCount % 20 == 0 && killCount > 0) {

  enemies = []; // Clear enemies array

}
Bosses.forEach((boss) => { 
  if( boss.BossHealth <= 0 && !boss.dead) {
    boss.onDeath(); // Call onDeath method to handle boss death
    Bosses = []; // Clear Bosses array
    enemies = []; // Clear enemies array
    killCount += 1; // Increment kill count
  }});


  // Check for collisions with enemies
  // Movement logic for the player
 
  let nextX = x;
let nextY = y;

if (pressedKeys[0] && y > 0 && canMoveUp == true){ nextY -= currentSpeed;playerSpritesheet.linha = 1;} // W
if (pressedKeys[1] && x > 0 && canMoveLeft == true){ nextX -= currentSpeed;playerSpritesheet.linha = 2;} // A
if (pressedKeys[2] && y < canvas.height - size && canMoveDown == true){ nextY += currentSpeed; playerSpritesheet.linha = 0;} // S
if (pressedKeys[3] && x < canvas.width - size && canMoveRight == true){ nextX += currentSpeed;playerSpritesheet.linha = 3;} // D

// Verifica colisão com obstáculos da sala atual
let blocked = currentRoom.update(nextX, nextY, size);
if (!blocked) {
    x = nextX;
    y = nextY;
}

Pspeed = baseSpeed; // Update base speed to current speed

if (pressedKeys[0] || pressedKeys[1] || pressedKeys[2] || pressedKeys[3]) {
  playerSpritesheet.proximoQuadro();
} else {
  playerSpritesheet.coluna = 0; // Idle frame
}

if (checkCollision(x, y, size, swordX, swordY, swordSize)) {
    gotSword = true; // Player has the sword
    swordX = -100; // Move sword off-screen
    swordY = -100;
    if(gotSword){
 currentRoom.enemies.push(new Enemy(300, 10,150,2)); // Enemy at (100, 100)
 currentRoom.enemies.push(new Enemy(2000, 100,150,2)); // Enemy at (100, 100)
 currentRoom.enemies.push(new Enemy(1000, 1000,150,2)); // Enemy at (100, 100)
}
  }

  // Check for collision with shield
  if (checkCollision(x, y, size, shieldX, shieldY, shieldSize) && shieldSpawn) {
    gotShield = true; // Player has the shield
    shieldX = -100; // Move shield off-screen
    shieldY = -100;
  }

  canMoveRight = true; // Reset movement flags
  canMoveLeft = true;
  canMoveUp = true;
  canMoveDown = true;
  // Update all enemies

currentRoom.update(x, y, size, attackY, attackSize, attackActive);
if (currentRoom.isCleared()) {
  currentRoom.cleared = true;
}
  
  if(killCount >= 20 && lastRoomTransition !== 1 && killCount < 40 && Bosses.length === 0) {
        lastRoomTransition = 1;
    transitioning = true;
setTimeout(() => {
  transitioning = false;
}, 5000); // 5 seconds
    enemiesLimit = 5;
    x = canvas.width / 2 - size / 2; // Center player in new room
    y = canvas.height / 2 - size / 2; // Center player in new room
    document.getElementById("roomTransition").style.display = "flex";
    setTimeout(() => {
  document.getElementById("roomTransition").style.display = "none";
  // Switch room here if you want
}, 5000);
    currentRoom = rooms2[0];
    currentRoom.enemies = [];
    enemiesSpawned = false;
    transitioning = false; // Resume the game
    for (let i = 0; i < enemiesLimit; i++) {
      setTimeout(() => {
        spawnEnemy();
      }, i * 300);
    } setTimeout(() => {
      update(); // Restart the game loop after transition
    }, 5000); // 5 seconds transition
    return; // Stop further update logic during transition

}
else if (killCount >= 40 && lastRoomTransition !== 2 && killCount <100 && Bosses.length === 0) {
 lastRoomTransition = 2;
  transitioning = true;
  enemiesLimit = 7;
  x = canvas.width / 2 - size / 2;
  y = canvas.height / 2 - size / 2;
  document.getElementById("roomTransition").style.display = "flex";
  setTimeout(() => {

    currentRoom = rooms3[0];
    currentRoom.enemies = [];
    enemiesSpawned = false;
    transitioning = false; // Resume the game
    for (let i = 0; i < enemiesLimit; i++) {
      setTimeout(() => {
        spawnEnemy();
      }, i * 2000);
    }
    update(); // Restart the game loop after transition
        document.getElementById("roomTransition").style.display = "none";
  }, 5000); // 5 seconds transition
  return; // Stop further update logic during transition
}
 
  currentRoom.enemies = currentRoom.enemies.filter(enemy => enemy.enemyHealth > 0 && enemy.size > 0);
  


  //shooter enemies attack logic
  // Remove shooterEnemies array and ShooterEnemy-specific variables

// Tutorial shield logic
if (!currentRoom.enemies.some(e => e.type === "shooter") && gotShield && tutorial) {
  currentRoom.enemies.push(new Enemy(
    200, 200, 120, 2, "purple", 300, 30, enemyBaseDamage, "./IMG/mage.png", "shooter"
  ));
  paused = true;
  tutorial = false;
  setTimeout(() => {
    paused = false;
    update();
  }, 4000);
  document.getElementById("shieldTutorial").style.display = "flex";
  document.getElementById("shieldTutorial").style.animation = "forwards grabSword 6s";
}

// In your draw() and update() functions, you no longer need to loop through shooterEnemies.
// All enemies (including shooters) are now in currentRoom.enemies and handled by the Enemy class.

  //update Bosses
  Bosses.forEach((boss) =>
    boss.update(x, y, attackX, attackY, attackSize, attackActive)
  );
 
  
  if(enemies.health <= 0) {
    room[0].enemies.splice(i, 1); // Remove the enemy from the array
  }

  switch (attackDirection) {
      case "upLeft":
        attackX = x - attackSize;
        attackY = y - attackSize;
        break;
      case "upRight":
        attackX = x + attackSize;
        attackY = y - attackSize;
        break;
      case "downLeft":
        attackX = x - attackSize;
        attackY = y + attackSize;
        break;
      case "downRight":
        attackX = x + attackSize;
        attackY = y + attackSize;
        break;
      case "up":
        attackX = x;
        attackY = y - attackSize;
        if(attackActive) {
        playerSpritesheet.linha = 1; // Reset to idle frame when not attacking
        rotationAngle = Math.PI * 1; // Rotate sword to face up
        }
        break;
      case "left":
        attackX = x - attackSize;
        attackY = y;
        if(attackActive) {
        playerSpritesheet.linha = 2; // Reset to idle frame when not attacking
        rotationAngle = Math.PI * 0.5; // Rotate sword to face left
        }
        break;
      case "down":
        attackX = x;
        attackY = y + size;
        if(attackActive) {
        playerSpritesheet.linha = 0; // Reset to idle frame when not attacking
        rotationAngle = 0; // Rotate sword to face left
        }
        break;
      case "right":
      default:
        attackX = x +size;
        attackY = y;
        if(attackActive) {
        playerSpritesheet.linha = 3; // Reset to idle frame when not attacking
        rotationAngle =Math.PI * -0.5; // Rotate sword to face right
        }
        break;
    }

    

  

  draw();
  requestAnimationFrame(update);


        // Calculate push direction from enemy to player
        

    touching = false; // Reset touching flag
    currentRoom.enemies.forEach(enemy => {
    enemy.update(x, y, attackX, attackY, attackSize, attackActive, currentRoom.obstacles);
    if (checkCollision(enemy.x, enemy.y, enemy.size, x, y, size)) {
        touching = true;
    }
});
for (let enemy of currentRoom.enemies) {
    enemy.avoidOtherEnemies(currentRoom.enemies);
}
   if (frenzy == true){
    Pspeed = baseSpeed * 1.2;}
    else if (touching && !invulnerable) {
    Pspeed = baseSpeed * 0.2; // Reduce speed when touching an enemy
    }else if (touching && invulnerable) {
      Pspeed = baseSpeed * 1.5; // Reduce speed when touching an enemy but invulnerable
    }
    else{
    Pspeed = baseSpeed; // Reset speed to default
    cor = "black";
    }
if (killCount >=3){
  if(tutorial){
  enemies =[];
  }
  document.getElementById("grabShield").style.display = "flex";
  shieldSpawn = true; // Set flag to true when shield is spawned

if (!currentRoom.enemies.some(e => e.type === "shooter") && gotShield && tutorial) {
  currentRoom.enemies.push(new Enemy(
  200, 200, 120, 2, "purple", 300, 30, enemyBaseDamage, "./IMG/mage.png", "shooter"
));
  paused = true; // Pause the game
  tutorial = false; // Disable tutorial after shield is grabbed
  setTimeout(() => {
    paused = false; // Resume the game after 5 seconds
    update(); // Restart the game loop
  }, 4000); // Pause for 5 seconds
  document.getElementById("shieldTutorial").style.display = "flex";
  document.getElementById("shieldTutorial").style.animation =" forwards grabSword 6s"// Hide the shield grab message
  }
}
}
function triggerAttack() {
  if (!attackCooldown && gotSword) {
    attackActive = true;

    // Determine direction based on pressedKeys (arrow keys)
   
      if (pressedKeys[5] && pressedKeys[6]) {
        attackDirection = "upLeft";
      } else if (pressedKeys[5] && pressedKeys[7]) {
        attackDirection = "upRight";
      } else if (pressedKeys[8] && pressedKeys[6]) {
        attackDirection = "downLeft";
      } else if (pressedKeys[8] && pressedKeys[7]) {
        attackDirection = "downRight";
      } else if (pressedKeys[5]) {
        attackDirection = "up";
      } else if (pressedKeys[6]) {
        attackDirection = "left";
      } else if (pressedKeys[8]) {
        attackDirection = "down";
      } else if (pressedKeys[7]) {
        attackDirection = "right";
      } else {
        attackDirection = "right"; // Default direction if nothing is pressed
      }
  
    // Always set attackX and attackY based on direction and current player position
    switch (attackDirection) {
      case "upLeft":
        attackX = x - attackSize;
        attackY = y - attackSize;
        break;
      case "upRight":
        attackX = x + attackSize;
        attackY = y - attackSize;
        break;
      case "downLeft":
        attackX = x - attackSize;
        attackY = y + attackSize;
        break;
      case "downRight":
        attackX = x + attackSize;
        attackY = y + attackSize;
        break;
      case "up":
        attackX = x;
        attackY = y;
        break;
      case "left":
        attackX = x;
        attackY = y;
        break;
      case "down":
        attackX = x;
        attackY = y;
        break;
      case "right":
      default:
        attackX = x;
        attackY = y;
        break;
    }

    setTimeout(() => {
      attackActive = false;
    }, 200);

    attackCooldown = true;
    setTimeout(() => {
      attackCooldown = false;
    }, attackCooldownDuration);
  }
}

document.addEventListener("keydown", function (e) {
  if (e.code === "KeyW") pressedKeys[0] = true;
  if (e.code === "KeyA") pressedKeys[1] = true;
  if (e.code === "KeyS") pressedKeys[2] = true;
  if (e.code === "KeyD") pressedKeys[3] = true;
  if (e.code === "ShiftLeft") pressedKeys[4] = true;
  if (e.code === "space") pressedKeys[9] = true;

  // Arrow keys for attack direction
  if (e.code === "ArrowUp") {
    pressedKeys[5] = true;
    triggerAttack(); // Trigger attack when ArrowUp is pressed
  }
  if (e.code === "ArrowLeft") {
    pressedKeys[6] = true;
    triggerAttack(); // Trigger attack when ArrowLeft is pressed
  }
  if (e.code === "ArrowRight") {
    pressedKeys[7] = true;
    triggerAttack(); // Trigger attack when ArrowRight is pressed
  }
  if (e.code === "ArrowDown") {
    pressedKeys[8] = true;
    triggerAttack(); // Trigger attack when ArrowDown is pressed
  }

  // Trigger attack when "K" is pressed, but only once per press
if (e.code === "Space" && !attackActive && gotShield && !shieldCooldown) {
  shield();
}
});

document.addEventListener("keyup", function (e) {
  if (e.code === "KeyW") pressedKeys[0] = false;
  if (e.code === "KeyA") pressedKeys[1] = false;
  if (e.code === "KeyS") pressedKeys[2] = false;
  if (e.code === "KeyD") pressedKeys[3] = false;
  if (e.code === "ShiftLeft") pressedKeys[4] = false;3
  if (e.code === "Space") pressedKeys[9] = false;

  // Arrow keys for attack direction
  if (e.code === "ArrowUp") pressedKeys[5] = false;
  if (e.code === "ArrowLeft") pressedKeys[6] = false;
  if (e.code === "ArrowRight") pressedKeys[7] = false;
  if (e.code === "ArrowDown") pressedKeys[8] = false;
});

if(x < canvas.width){
   
}

function shield() {
  activateShield = true;
  invulnerable = true;
  bounce = true;

  setTimeout(() => {
    activateShield = false;
    invulnerable = false;
    bounce = false;
    shieldCooldown = true;
    setTimeout(() => {
      shieldCooldown = false;
    }, 2000); // Cooldown duration
  }, 400); // Shield active duration
}

function checkCollision(ax, ay, asize, bx, by, bsize) {
  return (
    ax < bx + bsize &&
    ax + asize > bx &&
    ay < by + bsize &&
    ay + asize > by
  );
}
  let randomValues = getThreeRandomNumbers(); // Get three random numbers from the array
function levelUp() {
  if (experience >= xpToNextLevel && level % 5 != 0) {
    // Level up logic
      getThreeRandomNumbers(); // Call the function to get random values
    level++;
    experience = 0;
    choosingStat = true;
    xpToNextLevel += xpToNextLevel * 0.2; // Increase experience needed for next level
    showLevelUpMenu();
    randomValues = getThreeRandomNumbers(); // Get three random numbers from the array
    console.log("Level Up! New level: " + level);
    console.log(randomValues); // Log the random values
   
  }else if (experience >= xpToNextLevel && level % 5 == 0) {
      // Every 10 levels, increase health by 30
      experience = 0;
      level++;
      health += 30;
      showTransformationMenu();
      choosingStat = true;
      xpToNextLevel += xpToNextLevel * 0.2; // Increase experience needed for next level
      console.log("Level Up! Health increased! New health: " + health);
      console.log("Health increased! New health: " + health);
    } 



}


function getThreeRandomNumbers() {
  const numbers = Array.from({length: 6
  
  }, (_, i) => i); // [0,1,2,...,10]
  const shuffled = numbers.sort(() => 0.5 - Math.random());

  return shuffled.slice(3);
  
}

function showLevelUpMenu() {

  document.getElementById("levelUpMenu").style.display = "flex";
  document.getElementById("transformationMenu").style.display = "none";
  document.getElementById("healthBonus").style.display = "none";
  document.getElementById("speedBonus").style.display = "none";
  document.getElementById("damageBonus").style.display = "none";
  document.getElementById("attackSpeedBonus").style.display = "none";
  document.getElementById("attackSizeBonus").style.display = "none";
  document.getElementById("criticalChanceBonus").style.display = "none";
  document.getElementById("criticalDamageBonus").style.display = "none";


  if(randomValues[0] == 0 || randomValues[1] == 0 || randomValues[2] == 0) {
  document.getElementById("healthBonus").style.display = "flex";
  }
  if(randomValues[0] == 1 || randomValues[1] == 1 || randomValues[2] == 1) {
  document.getElementById("speedBonus").style.display = "flex";
  }
  if(randomValues[0] == 2 || randomValues[1] == 2 || randomValues[2] == 2) {
  document.getElementById("damageBonus").style.display = "flex";
  }
  if(randomValues[0] == 3 || randomValues[1] == 3 || randomValues[2] == 3) {
  document.getElementById("attackSpeedBonus").style.display = "flex";
  }
  if(randomValues[0] == 4 || randomValues[1] == 4 || randomValues[2] == 4) {
  document.getElementById("attackSizeBonus").style.display = "flex";
  }
  if(randomValues[0] == 5 || randomValues[1] == 5 || randomValues[2] == 5) {
  document.getElementById("criticalChanceBonus").style.display = "flex";
  }
  if(randomValues[0] == 6 || randomValues[1] == 6 || randomValues[2] == 6) {
  document.getElementById("criticalDamageBonus").style.display = "flex";
  }
}
function showTransformationMenu() {
  document.getElementById("transformationMenu").style.display = "flex";
  document.getElementById("levelUpMenu").style.display = "none";
}

function closeLevelUpMenu() {
  document.getElementById("levelUpMenu").style.display = "none";
  document.getElementById("transformationMenu").style.display = "none";
  choosingStat = false;
  update(); // <-- Restart the game loop
}

document.getElementById("btnAttackSize").onclick = function() {
  attackSize += 50; // Increase attack size
  attackX = x + size / 2 - attackSize / 2; // Center the attack
  attackY = y + size / 2 - attackSize / 2; // Center the attack
  closeLevelUpMenu();
};
document.getElementById("btnCriticalChance").onclick = function() {
  critChance += 0.05; // Increase critical chance by 5%
  closeLevelUpMenu();
};
document.getElementById("btnCriticalDamage").onclick = function() {
  critMultiplier += 0.5; // Increase critical damage multiplier by 0.5
  closeLevelUpMenu();
}
document.getElementById("btnAttackSpeed").onclick = function() {
  attackCooldownDuration -= attackCooldown * 0.1; // Decrease cooldown duration
  closeLevelUpMenu();
}
document.getElementById("btnHealth").onclick = function() {
  
  health += 30;
  closeLevelUpMenu();
};
document.getElementById("btnSpeed").onclick = function() {
 baseSpeed += baseSpeed * 0.1; // Increase base speed
 Pspeed = baseSpeed; // Update player speed
  attackCooldownDuration -= attackCooldown * 0.1; // Decrease cooldown duration
  closeLevelUpMenu();
};
document.getElementById("btnAttack").onclick = function() {
  heroDamage += 10;
  closeLevelUpMenu();
};

document.getElementById("SpeedPath").onclick = function() {
  // Increase speed
  baseSpeed += baseSpeed *0.3; // Increase base speed
  Pspeed = baseSpeed
  attackCooldownDuration -= attackCooldown * 0.3; // Decrease cooldown duration
  document.getElementById("DamagePath").style.display = "none";
  document.getElementById("Tank").style.display = "none";
  closeLevelUpMenu();
};
document.getElementById("DamagePath").onclick = function() {
  heroDamage += heroDamage * 0.2; // Increase damage
   document.getElementById("SpeedPath").style.display = "none";
  document.getElementById("Tank").style.display = "none";
  closeLevelUpMenu();
};
document.getElementById("Tank").onclick = function() {
  health += 30; // Increase health
  maxHP +=maxHP * 0.2; // Increase maximum health
   document.getElementById("DamagePath").style.display = "none";
  document.getElementById("SpeedPath").style.display = "none";
  closeLevelUpMenu();
};
function dead(health) {
    if (health <= 0) {
      console.log("Player is dead!");
      Pdead = true; // Set player dead flag
      cor = "black"; // Change player color to black on death
      alert("Game Over!"); // Display game over message
      window.location.reload(); // Reload the page to restart the game
    }
  }
function calcularDano() {
  // Sorteia um número entre 0 e 1
  if (Math.random() < critChance) {
    // Ataque crítico!
    return heroDamage * critMultiplier;
  } else {
    // Ataque normal
    return heroDamage;
  }
}
//currentRoom.enemies.push(new Enemy(...));

// MC.js

function spawnEnemy() {
  let RandomSize = Math.random() * (150 - 100) + 100;
  let RandomSpeed = Math.random() * (4 - 2) + 2;
  let enemyRandomizer = Math.random()* (2) +2;
  if (enemyRandomizer < 1) {
    enemyVariant = "melee"; // Define como inimigo corpo a corpo
  }else if (enemyRandomizer >= 1 && enemyRandomizer < 2) {
    enemyVariant = "shooter"; // Define como inimigo atirador
  }
  let randomX, randomY;
  let validPosition = false;

  // Tenta até achar uma posição válida
  while (!validPosition) {
    randomX = Math.random() * (canvas.width - RandomSize);
    randomY = Math.random() * (canvas.height - RandomSize);
    validPosition = !collidesWithObstacles(randomX, randomY, RandomSize, currentRoom.obstacles);
  }
  let type = Math.floor(Math.random() * 3) + 1;
  let imagePath = "./IMG/SpriteSheetRenan.png";
  if (type === 1) imagePath = "./IMG/knight.png";
  if (type === 2) imagePath = "./IMG/knight.png";
  if (type === 3) imagePath = "./IMG/knight2.png";

  if (killCount < 30 && killCount % 100 != 0) {
    const newEnemy = new Enemy(
      randomX,
      randomY,
      RandomSize,
      enemyBaseSpeed * enemyStatMultiplier,
      "red",
      130, // attackRange
      40,  // attackSize
      enemyBaseDamage * enemyStatMultiplier,
      imagePath,
      enemyVariant // <-- define as melee
    );
    currentRoom.enemies.push(newEnemy);
  } else if (killCount >= 100 && Bosses.length < 1 && killCount != 0) {
    currentRoom.enemies = [];
    currentRoom = bossRoom; // Set the current room to the boss room
const bossImage = new Image();
bossImage.src = "./IMG/MIKU.png";
bossImage.onload = () => {
    // Now it's safe to create the Boss
    const newBoss = new Boss(200, 300, 200, 4, "purple", 30, 30, 1000);
    Bosses.push(newBoss);
};
    console.log("Boss spawned!");
  } else if (killCount > 30 && killCount % 100 != 0 && currentRoom.enemies.length < enemiesLimit) {
    enemiesLimit = 4;
    RandomSize = Math.random() * (200 - 150) + 150;
    RandomSpeed = Math.random() * (4 - 2) + 2;
    while (!validPosition) {
      const obstacles = currentRoom.obstacles || [];
      randomX = Math.random() * (canvas.width - RandomSize);
      randomY = Math.random() * (canvas.height - RandomSize);
      validPosition = !collidesWithObstacles(randomX, randomY, RandomSize, currentRoom.obstacles);
    }
    let newEnemy1 = new Enemy(
      randomX,
      randomY,
      RandomSize,
      RandomSpeed * enemyStatMultiplier,
      "blue",
      150, // attackRange
      50,
      enemyBaseDamage + 10 * enemyStatMultiplier,
      imagePath,
      enemyVariant // <-- define as melee
    );
    currentRoom.enemies.push(newEnemy1);
  }
}

