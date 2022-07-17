// Game scren size recommend between 1.1 to 2
const screen_s = 1.6;

//var for menu highlight
var xCursor, yCursor;

//var for state of the game
var estado = 1;
var selected = 1;
var perdeu = 0;

//state of the game
var inimigos = [];
var balas = [];
var powerups = [];

var pontos = 0;

var character_stats = [(life = 3), (firespeed = 8), (firerate = 10)];
//Variables for assets folder (images and sounds)
var menuLoading;
var characterSprite;
var heart;
var enemySprite;
var healthpowerup;
var speedpowerup;
var fireratepowerup;
var bg;
var projectile;

var mainsound;
var losesound;
var shootsound;

function preload() {
  characterSprite = loadImage("assets/maincharacter.png");
  heart = loadImage("assets/Heart.png");
  enemySprite = loadImage("assets/astroid.png");
  healthpowerup = loadImage("assets/Health.png");
  speedpowerup = loadImage("assets/Speed increaser.png");
  fireratepowerup = loadImage("assets/firerate increaser.png");
  bg = loadImage("assets/space1.png");
  projectile = loadImage("assets/laser_small.png");
  mainsound = loadSound("assets/battleThemeA.mp3");
  losesound = loadSound("assets/game_over_bad_chest.wav");
  shootsound = loadSound("assets/laserpew.ogg");
}

function setup() {
  createCanvas(400*screen_s, 400*screen_s);
  xCursor = 150*screen_s;
  yCursor = 120*screen_s;
  //puts the game music
  playsound(1);
}

// This fuction creates a button on the main menu
function botoes(xmenu, ymenu, textx) {
  textSize(14);
  stroke(0);
  strokeWeight(1);
  fill(68, 5, 15, 50);
  rect(xmenu*screen_s, ymenu*screen_s, 100, 60);
  fill(0);
  text(textx, xmenu*screen_s + 28, ymenu*screen_s + 30 + 6);
  fill(220);
  //desenho
}
// highlight for buttons
function buttonselect() {
  noFill();
  stroke(255, 0, 0);
  strokeWeight(4);
  rect(xCursor, yCursor, 100, 60);
}
// function for enemy generation
function enemyGenerator(amount) {
  for (i = 0; i < amount; i++) {
    var siz = parseInt(random(10, 60))
    let inimigo = {
      x: random(0, width - 25*screen_s),
      y: random(-600*screen_s, 0),
      size: siz,
      health: parseInt(random(0,(siz/10))),
      speed: parseInt(random(1,5)-((siz/10)/2))
    };
    inimigos.push(inimigo);
  }
}

function powerup_generate(amount) {
  for (i = 0; i < amount; i++) {
    let powerup = {
      x: random(0, width - 25*screen_s),
      y: random(-1100, 0),
      type: parseInt(random(1, 3)),
    };
    powerups.push(powerup);
  }
}

// fuction for playing diferent songs
function playsound(type) {
  if (type == 1) {
    losesound.stop();
    mainsound.play();
    mainsound.setVolume(0.02);
    mainsound.setLoop(true);
  } else {
    mainsound.stop();
    losesound.play();
    mainsound.setLoop(false);
    losesound.setVolume(0.2);
  }
}
function screen_heart_generation(xmenu, ymenu) {
  image(heart, xmenu*screen_s, ymenu*screen_s);
}
function draw() {
  if (estado == 1) {
    menu();
  }
  if (estado == 2) {
    jogar();
  }
  if (estado == 3) {
    instrucoes();
  }
  if (estado == 4) {
    creditos();
  }
  if (estado == 5) {
    story();
  }
}

// Keyboard Controls
function keyPressed() {
  //UP
  if (keyCode == UP_ARROW) {
    if (estado == 1) {
      //lower than last but higher than first button
      if (yCursor <= 280*screen_s && yCursor > 120*screen_s) {
        yCursor -= 80*screen_s;
        selected -= 1;
      }
    }
  }
  if (estado == 1) {
    //DOWN
    if (keyCode == DOWN_ARROW) {
      if (yCursor < 280*screen_s) {
        yCursor += 80*screen_s;
        selected += 1;
      }
    }
  }
  //Back to the menu
  if (keyCode == LEFT_ARROW) {
    if (estado != 1 && estado != 2) {
      estado = 1;
    }
  }
  // Enter for selecting a button menu
  if (estado == 1) {
    if (keyCode == ENTER) {
      //jogar
      if (selected == 1 && estado == 1) {
        estado = 5;
      }
      //instruções
      if (selected == 2 && estado == 1) {
        estado = 3;
      }
      //creditos
      if (selected == 3 && estado == 1) {
        estado = 4;
      }
    }
  }
  //if the player lose
  if (perdeu == 1 && estado == 2 && keyCode != ENTER) {
    estado = 1;
    perdeu = 0;
    // wipe enimies and projectiles
    inimigos = [];
    balas = [];
    //create new enemies and play the first song
    playsound(1);
    enemyGenerator(8);
    powerup_generate(1);
    // reset player stats
    character_stats[0] = 3;
    character_stats[1] = 8;
    character_stats[2] = 10;
    spawn = 0;
  }
}

//When a mouse click happens
function mousePressed() {
  //creates a projectile
  if (estado == 2 && perdeu == 0) {
    let bala = {
      x: mouseX,
      y: height - 50,
    };
    balas.push(bala);
    shootsound.play();
    shootsound.setVolume(0.02);
  }
}

//Main menu loop
function menu() {
  //background for the button
  stroke(0);
  strokeWeight(1);
  background(60);
  fill(170, 60, 70);
  rect(100*screen_s, 100*screen_s, 200*screen_s/1.2, 250*screen_s);

  //play button
  botoes(150, 120, "  Jogar");
  //instruction button
  botoes(150, 200, "Instruções");
  //credits button
  botoes(150, 280, "Creditos");
  // button highlight
  buttonselect();
}
gametime=0;
//Main play loop
function jogar() {
  image(bg, -150, -350);
  gametime+=1;
  // The player
  image(characterSprite, mouseX - 17, height - 50);
  //The player Health on the screen
  if (character_stats[0] > 0) {
    for (i = 0; i < character_stats[0] * 21; i += 21) {
      screen_heart_generation(10 + i, 35);
    }
  }
  for (let bala of balas) {
    image(projectile, bala.x - 5, bala.y);
    bala.y -= character_stats[1];
    // if the projectile goes out of screen it will remove it
    if(bala.y<=-110){balas.splice(balas.indexOf(bala), 1);}
  }
  //Enemy loop
  for (let inimigo of inimigos) {
    image(
      enemySprite,
      inimigo.x - 10,
      inimigo.y,
      25 + inimigo.size,
      25 + inimigo.size
    );
    //The enemy keeps moving until you lose
    if (perdeu == 0) {
      //gravity
      inimigo.y += 1.1+inimigo.speed;
    }
    //Lose condition
    if (inimigo.y > height) {
      if (character_stats[0] <= 0) {
        strokeWeight(2);
        textSize(16);
        text("Você perdeu, uma cidade foi destruida! Precione qualquer botão.", width/10*screen_s, height / 2);
        if (perdeu == 0) {
          playsound(2);
        }
        perdeu = 1;
      } else {
        character_stats[0] -= 1;
        inimigos.splice(inimigos.indexOf(inimigo), 1);
        enemyGenerator(1)
        if(gametime>2000){
            enemyGenerator(parseInt(random(0,1)));
          }
        if(gametime>15000){enemyGenerator(1);}
      }
    }
  }
  // Power up loop
  for (let powerup of powerups) {
    if (powerup.type == 1) {
      image(healthpowerup, powerup.x, powerup.y);
    }
    if (powerup.type == 2) {
      image(speedpowerup, powerup.x, powerup.y);
    }
    if (powerup.type == 3) {
      image(fireratepowerup, powerup.x, powerup.y);
    }
    if (perdeu == 0) {
      powerup.y += 1.5;
    }
    if (powerup.y > height) {
      powerups.splice(powerups.indexOf(powerup), 1);
      powerup_generate(1);
    }
  }
  //Collision detection Enemy x Projectile
  for (let inimigo of inimigos) {
    for (let bala of balas) {
      //se estiver no alcance
      if (dist(inimigo.x, inimigo.y, bala.x, bala.y) < inimigo.size) {
        // if lower or equal 1 health the enemy dies
        if(inimigo.health<=1){
          inimigos.splice(inimigos.indexOf(inimigo), 1);
          enemyGenerator(1);
          pontos += 1;
          if(gametime>1000){
            enemyGenerator(parseInt(random(0,1)));
          }
          if(gametime>15000){enemyGenerator(1);}
        }
        
        if(inimigo.health>0){inimigo.health-=1;}
        balas.splice(balas.indexOf(bala), 1);

      }
    }
  }
  for (let powerup of powerups) {
    if (dist(powerup.x, powerup.y, mouseX - 17, height - 50) < 45) {
      if (powerup.type == 1) {
        character_stats[0] += 1;
      }
      if (powerup.type == 2) {
        character_stats[1] += 3;
      }
      if (powerup.type == 3) {
        character_stats[2] += 3;
      }
      powerups.splice(powerups.indexOf(powerup), 1);
      powerup_generate(1);
    }
  }
  // text with your score
  text(pontos, 15, 25);
}

function instrucoes() {
  // As instruções
  background(150);
  fill(170);
  rect(50, 100*screen_s, 330*screen_s, 250*screen_s);
  fill(0, 255, 0);
  stroke(0, 200, 0);
  text("Instruções", width / 2 - 25, height / 2 - 50);
  text(
    "Utilize o mouse para controlar o personagem. Os cliques irão atirar",
    width / 3,
    height / 2 + 20
  );
  text(
    "Não deixe que os inimigos cheguem até em baixo da tela",
    width / 7,
    height / 2 + 40
  );
  //fim background
}
function creditos() {
  // Os creditos
  background(150);
  fill(170);
  rect(50, 100*screen_s, 330*screen_s, 250*screen_s);
  fill(0, 255, 0);
  stroke(0, 200, 0);
  text("Creditos", width / 2 - 25*screen_s, height / 2 - 50*screen_s);
  text(
    "Aluno: Rafael Sales de Almeida Cavalcanti Turma: 3C",
    width / 7,
    height / 2 + 20
  );
  text("Tema: EF03CI07", width / 7, height / 2 + 40);
}
var tempo = 570;
var spawn = 0
// story before play loop
function story(){
  textSize(32);
  strokeWeight(1);
  background(0);
  stroke(255, 255, 255);
  tempo -= 1
  if(tempo>100&&tempo<600){
    text("A terra está em perigo!", width/6*screen_s, height/10*screen_s);
    textSize(19);
    text("Vários asteroides entraram na orbita solar", width/6*screen_s, height/6*screen_s);
    textSize(22);
    text("Só você pode nos salvar", width/6*screen_s, height/2);
    text("'Use o mouse para jogar'", width/6*screen_s, height/1.3);
  }
  if(tempo>0&&tempo<70){
    var spawned = 0
    textSize(32);
    text("Prepare-se... 3 2 1", width/6*screen_s, height/3);
    if(!spawn){
    spawn = 1;
    enemyGenerator(8);
    powerup_generate(1);
    }
  }
  if(tempo<0){estado=2;tempo=600}
}
