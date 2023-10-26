// Definição de constantes para os estados do jogo
let PLAY = 1; // Constante para o estado de jogo "jogando"
let END = 0; // Constante para o estado de jogo "fim"
let gameState = PLAY; // Estado inicial do jogo

// Variáveis para os elementos do jogo
let trex, trex_running, trex_collided; // Variáveis para o dinossauro e suas animações
let ground, invisibleGround, groundImage, gameOverImg, restartImg; // Variáveis para o solo, suas imagens, tela de fim de jogo e botão de reinício
let cloudsGroup, cloudImage; // Grupo de nuvens e a imagem da nuvem
let obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6; // Grupo de obstáculos e suas imagens
let gameOver; // Sprite para a tela de fim de jogo
let restart; // Sprite para o botão de reinício

let score; // Pontuação do jogador

let jumpSound, checkPointSound, dieSound;
let isJumping;
// Pré-carregamento de imagens e animações
function preload() {
  // Carregamento das animações e imagens necessárias
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  trex_collided = loadAnimation("trex_collided.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");

  // Carregamento de imagens para os obstáculos
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
}

// Configuração inicial do jogo
function setup() {
  createCanvas(windowWidth, windowHeight); // Cria o canvas de 600x200 pixels

  // Criação de sprites e ajustes iniciais
  trex = createSprite(50, height -70, 20, 50); // Cria o sprite do dinossauro
  trex.addAnimation("correndo", trex_running); // Adiciona a animação de corrida
  trex.addAnimation("collided", trex_collided); // Adiciona a animação de colisão
  edges = createEdgeSprites(); // Cria as bordas do cenário

  trex.scale = 0.5; // Ajusta a escala do dinossauro
  trex.x = 50; // Posiciona o dinossauro na coordenada x 50

  ground = createSprite(width/2, height -20, width, 20); // Cria o sprite do solo
  ground.addImage(groundImage); // Adiciona a imagem ao sprite do solo
  ground.x = ground.width / 2; // Posiciona o solo no centro horizontal

  gameOver = createSprite(width/2, height/2); // Cria o sprite para a tela de fim de jogo
  gameOver.addImage(gameOverImg); // Adiciona a imagem à tela de fim de jogo
  gameOver.scale = 0.5; // Ajusta a escala da tela de fim de jogo

  restart = createSprite(width/2, height/2 + 50); // Cria o sprite para o botão de reinício
  restart.addImage(restartImg); // Adiciona a imagem ao botão de reinício
  restart.scale = 0.5; // Ajusta a escala do botão de reinício

  invisibleGround = createSprite(width/2, height -20, width, 10); // Cria o sprite do solo invisível
  invisibleGround.visible = false; // Torna o solo invisível

  obstaclesGroup = new Group(); // Cria um novo grupo para os obstáculos
  cloudsGroup = new Group(); // Cria um novo grupo para as nuvens

  score = 0; // Inicializa a pontuação
  

}

// Atualização contínua do jogo
function draw() {
  background("black"); // Define o fundo como preto
  text("Pontuação: " + score, 500, 20); // Exibe a pontuação


  // Lógica para o estado de jogo PLAY
  if (gameState === PLAY) {
    gameOver.visible = false; // Esconde a tela de fim de jogo
    restart.visible = false; // Esconde o botão de reinício

    ground.velocityX = -(4 + 3 *score/100); // Define a velocidade do solo

    // Atualiza a pontuação com base no tempo de jogo
    score = score + Math.round(getFrameRate() / 60);

    if (score > 0 && score % 100 === 0) {
      checkPointSound.play();
    }

    if (ground.x < 0) {
      ground.x = ground.width / 2; // Reposiciona o solo quando ele se move para fora da tela
    }

    if ((keyDown("space")||(touches.length >0 )) && !isJumping){
      trex.velocityY = -15; // Faz o dinossauro pular quando a tecla espaço é pressionada
      jumpSound.play();
      touches = []
      isJumping = true;
    }

    trex.velocityY = trex.velocityY + 0.8; // Adiciona gravidade ao dinossauro
    spawnClouds(); // Chama a função para criar nuvens
    spawnObstacles(); // Chama a função para criar obstáculos

    // Muda para o estado de jogo END se houver colisão com os obstáculos
    if (obstaclesGroup.isTouching(trex)) {
      //trex.velocity.y = -12;
      //jumpSound.play();
      gameState = END;
      dieSound.play();
    }
  }
  // Lógica para o estado de jogo END
  else if (gameState === END) {
    gameOver.visible = true; // Mostra a tela de fim de jogo
    restart.visible = true; // Mostra o botão de reinício

    ground.velocityX = 0; // Para o movimento do solo

    trex.velocityY = 0; // Para o movimento vertical do dinossauro
    trex.changeAnimation("collided", trex_collided); // Muda a animação do dinossauro para a de colisão

    // Define o tempo de vida dos objetos para que não desapareçam
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    obstaclesGroup.setVelocityXEach(0); // Para o movimento dos obstáculos
    cloudsGroup.setVelocityXEach(0); // Para o movimento das nuvens

    if (mousePressedOver(restart) || touches.length >0) {
      reset();
      touches = []
      score = 0; // Redefine o placar para zero
    }
  }
   
  if(trex.collide(invisibleGround)){
    isJumping = false;
  }
  

 
  drawSprites(); // Desenha todos os sprites na tela
}

function reset() {
  // Restabelece o estado do jogo para o estado PLAY (assumindo que PLAY é uma variável ou constante definida anteriormente).
  gameState = PLAY;

  // Torna o elemento "gameOver" invisível.
  gameOver.visible = false;

  // Torna o elemento "restart" invisível.
  restart.visible = false;

  // Remove (destroi) todos os objetos no grupo "obstaclesGroup".
  obstaclesGroup.destroyEach();

  // Remove (destroi) todos os objetos no grupo "cloudsGroup".
  cloudsGroup.destroyEach();
  trex.changeAnimation("correndo", trex_running);
}



// Função para criar obstáculos
function spawnObstacles() {
  if (frameCount % 80 === 0) {
    let obstacle = createSprite(1000, height -45, 10, 40); // Cria um obstáculo
    obstacle.velocityX = -(4 + 3* score/100); // Define a velocidade do obstáculo
   

    let rand = Math.round(random(1, 6)); // Gera um número aleatório entre 1 e 6
    switch (rand) {
      case 1: obstacle.addImage(obstacle1); // Adiciona uma imagem de obstáculo
        break;

      case 2: obstacle.addImage(obstacle2); // Adiciona uma imagem de obstáculo
        break;

      case 3: obstacle.addImage(obstacle3); // Adiciona uma imagem de obstáculo
        break;

      case 4: obstacle.addImage(obstacle4); // Adiciona uma imagem de obstáculo
        break;

      case 5: obstacle.addImage(obstacle5); // Adiciona uma imagem de obstáculo
        break;

      case 6: obstacle.addImage(obstacle6); // Adiciona uma imagem de obstáculo
        break;

      default: break;
    }

    obstacle.scale = 0.5; // Ajusta a escala do obstáculo
    obstacle.lifetime = 450; // Define o tempo de vida do obstáculo
    obstaclesGroup.add(obstacle); // Adiciona o obstáculo ao grupo de obstáculos
  }
}

// Função para criar nuvens
function spawnClouds() {
  if (frameCount % 60 === 0) {
    cloud = createSprite(width +50, height/2, 40, 10); // Cria uma nuvem
    cloud.y = Math.round(random(height -100, height -300)); // Define a posição y da nuvem aleatoriamente
    cloud.velocityX = -3; // Define a velocidade da nuvem

    cloud.addImage(cloudImage); // Adiciona a imagem à nuvem
    cloud.scale = 0.4; // Ajusta a escala da nuvem
    cloud.lifetime = 450; // Define o tempo de vida da nuvem

    cloud.depth = trex.depth; // Define a profundidade da nuvem
    trex.depth = trex.depth + 1; // Ajusta a profundidade do dinossauro
  }
}
