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

var character_stats=[life=3,firespeed=8,firerate=10]
//Variables for assets folder (images and sounds)
var menuLoading;
var characterSprite;
var heart;
var enemySprite;
var healthpowerup;
var speedpowerup;
var fireratepowerup;
var bg;
var arrow;

var mainsound;
var losesound;

function preload(){
  characterSprite = loadImage('assets/maincharacter.png');
  heart = loadImage('assets/Heart.png');
  enemySprite = loadImage('assets/sprite_rotmg_enemy0.png');
  healthpowerup=loadImage('assets/Health.png');
  speedpowerup=loadImage('assets/Speed increaser.png');
  fireratepowerup=loadImage('assets/firerate increaser.png');
  bg = loadImage('assets/space1.png')
  arrow = loadImage('assets/Arrow.png')
  mainsound = loadSound('assets/battleThemeA.mp3');
  losesound = loadSound('assets/game_over_bad_chest.wav');
}

function setup() {
  createCanvas(400, 400);
  xCursor = 150;
  yCursor = 120;
  //generate the enemy
  enemyGenerator(8)
  powerup_generate(1)
  playsound(1)
}


// This fuction creates a button on the main menu
function botoes(xmenu, ymenu, textx) {
  stroke(0);
  strokeWeight(1);
  fill(68, 5, 15, 50);
  rect(xmenu, ymenu, 100, 60);
  fill(0);
  text(textx, xmenu + 28, ymenu + 30 + 6);
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
function enemyGenerator(amount){
    for (i = 0; i < amount; i++) {
    let inimigo = {
      x: random(0, width-25),
      y: random(-800, 0),
      size: random(10,60)
    };
    inimigos.push(inimigo);
  }
}

function powerup_generate(amount){
    let powerup = {
      x: random(0, width-25),
      y: random(-1800, 0),
      type: parseInt(random(1,3))
    };
    powerups.push(powerup);
}

// fuction for playing diferent songs
function playsound(type){
  if(type==1){
      losesound.stop()
      mainsound.play()
      mainsound.setVolume(0.02);
      mainsound.setLoop(true)
  }
  else {
      mainsound.stop();
      losesound.play();
      mainsound.setLoop(false)
      losesound.setVolume(0.2);
  }
}
function screen_heart_generation(xmenu, ymenu){
  image(heart,xmenu, ymenu)
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
}

// Keyboard Controls
function keyPressed() {
  //UP
  if (keyCode == UP_ARROW) {
    if (estado == 1) {
      //lower than last but higher than first button
      if (yCursor <= 280 && yCursor > 120) {
        yCursor -= 80;
        selected -= 1;
      }
    }
  }
  if (estado == 1) {
    //DOWN
    if (keyCode == DOWN_ARROW) {
      if (yCursor < 280) {
        yCursor += 80;
        selected += 1;
      }
    }
  }
  //Back to the menu
  if (keyCode == LEFT_ARROW) {
    if (estado != 1&&estado!=2) {
      estado = 1;
    }
  }
  // Enter for selecting a button menu
  if (estado == 1) {
    if (keyCode == ENTER) {
      //jogar
      if (selected == 1 && estado == 1) {
        estado = 2;
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
  if (perdeu == 1 && estado == 2&&keyCode != ENTER) {
        estado = 1;
        perdeu = 0;
        // wipe enimies and projectiles
        inimigos = [];
        balas = [];
        //create new enemies and play the first song
        playsound(1)
        enemyGenerator(8);
        powerup_generate(1);
      }
}

//When a mouse click happens
function mousePressed() {
  //creates a projectile
  if (estado == 2&&perdeu==0) {
    let bala = {
      x: mouseX,
      y: height - 50,
    };
    balas.push(bala);
  }
}

//Main menu loop
function menu() {
  //background for the button
  stroke(0);
  strokeWeight(1);
  background(60);
  fill(170, 60, 70);
  rect(100, 100, 200, 250);

  //play button
  botoes(150, 120, "  Play");
  //instruction button
  botoes(150, 200, "Instruction");
  //credits button
  botoes(150, 280, "Credits");
  // button highlight
  buttonselect();
}

//Main play loop
function jogar() {
  image(bg,-280,-380);
  // The player
  image(characterSprite,mouseX-17, height - 50)
  //The player Health on the screen
  if(character_stats[0]>0){
    for(i=0;i<character_stats[0]*21;i+=21){
      screen_heart_generation(10+i,35)
    }}
  for (let bala of balas) {
    image(arrow,bala.x-15, bala.y)
    bala.y -= character_stats[1];
  }
  //Enemy loop
  for (let inimigo of inimigos) {
    image(enemySprite,inimigo.x-10, inimigo.y,25+inimigo.size,25+inimigo.size)
    //The enemy keeps moving until you lose
    if(perdeu==0) {inimigo.y += 1.5;}
    //Lose condition
    if(inimigo.y>height){
      if(character_stats[0]<=0){
      strokeWeight(2)
      text("You losed! Press any button.",width/2-75,height/2);
      if(perdeu==0){playsound(2)}
      perdeu=1;}
      else {
        character_stats[0]-=1;
        inimigos.splice(inimigos.indexOf(inimigo), 1);
      }
    }
  }
  // Power up loop
  for (let powerup of powerups) {
    if(powerup.type==1){image(healthpowerup,powerup.x, powerup.y)}
    if(powerup.type==2){image(speedpowerup,powerup.x, powerup.y)}
    if(powerup.type==3){image(fireratepowerup,powerup.x, powerup.y)}
    if(perdeu==0) {powerup.y += 1.5;}
    if(powerup.y>height){powerups.splice(powerups.indexOf(powerup), 1);powerup_generate(1);}
  }
  //Collision detection Enemy x Projectile
  for (let inimigo of inimigos) {
    for (let bala of balas) {
      //se estiver no alcance
      if (dist(inimigo.x, inimigo.y, bala.x, bala.y) < inimigo.size) {
        inimigos.splice(inimigos.indexOf(inimigo), 1);
        balas.splice(balas.indexOf(bala), 1);
        // new enemy after the death
        pontos+=1;
        enemyGenerator(1)
        if(pontos>=10){
          let t = random(0,5)
          if(t==4){enemyGenerator(parseInt(random(0,pontos)))}}
      }
    }
  }
  for (let powerup of powerups){
    if (dist(powerup.x, powerup.y, mouseX-17, height - 50) < 45){
      if(powerup.type==1){character_stats[0]+=1}
      if(powerup.type==2){character_stats[1]+=3}
      if(powerup.type==3){character_stats[2]+=3}
      powerups.splice(powerups.indexOf(powerup), 1);
      powerup_generate(1);
    }
  }
  // text with your score
  text(pontos,15,25)
}

function instrucoes() {
  // As instruções
  background(150);
  fill(170);
  rect(50, 100, 330, 250);
  fill(0,255,0);
  stroke(0,200,0)
  text("Instruções", width / 2 - 25, height / 2 - 50);
  text("Utilize o mouse para controlar o personagem. Os cliques irão atirar", width/3, height / 2 + 20);
  text("Não deixe que os inimigos cheguem até em baixo da tela", width/7, height / 2+40);
  //fim background
}
function creditos() {
  // Os creditos
  background(150);
  fill(170);
  rect(50, 100, 330, 250);
  fill(0,255,0);
  stroke(0,200,0)
  text("Creditos", width / 2 - 25, height / 2 - 50);
  text("Aluno: Rafael Sales de Almeida Cavalcanti Turma: 3C", width/7, height / 2 + 20);
  text("Tema: Não definido", width/7, height / 2+40);
}
