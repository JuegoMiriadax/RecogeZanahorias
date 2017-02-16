var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

function preload() {

    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.minWidth = 240;//Ancho minimo
    this.scale.minHeight = 170;//Altura minimo
    this.scale.maxWidth = 800;//Ancho maximo
    this.scale.maxHeight = 600;//Altura maxima
    //Alinear el juego horizontalmente
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = false;
    //Se escala de manera automatica
    this.scale.setScreenSize(true);

    //Cargar las imagenes
    game.load.image('fondo', 'img/background.png');
    game.load.image('plataforma', 'img/plataforma.png');
    game.load.image('carrot', 'img/carrot.png');
    game.load.image('bandeja','img/bandeja.png');
    game.load.spritesheet('personaje', 'img/rabbit.png', 34, 28);
    game.load.image('bandejallena', 'img/bandejallena.png');
    game.load.audio('punto', 'img/carrot.mp3', 'img/carrot.wav','img/carrot.ogg');
    game.load.audio('musica', 'img/Cancion.mp3', 'img/Cancion.ogg');
    game.load.spritesheet('button', 'img/button.png', 120, 40);


}


var plataforma;
var suelo;
var personaje;
var carrots;
var bandeja;
 
var txtPuntos;
var txtVidas;
var txtNivel;
var Reiniciar;
 
var sndPunto;
 
function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    music = game.sound.play('musica');
    game.add.sprite(0, 0, 'fondo');
     
    plataforma = game.add.sprite(0, 100, 'plataforma');
    plataforma.width = 800;
    game.physics.arcade.enable(plataforma);
    plataforma.body.immovable = true;
     
    suelo = game.add.sprite(0, game.world.height - 28, 'plataforma');
    suelo.width = 800;
    suelo.height = 50;
    game.physics.arcade.enable(suelo);
     
    bandeja = game.add.sprite(50, game.world.height - 70, 'bandeja');
    bandeja.width = 75;
    game.physics.arcade.enable(bandeja);
     
    personaje = game.add.sprite(34, 0, 'personaje');
    game.physics.arcade.enable(personaje);
    personaje.body.gravity.y = 300;
    personaje.body.velocity.x = 250;
     
    personaje.animations.add('right', [0, 1, 2, 3, 4, 5, 6], 30, true);
    personaje.animations.add('left', [8, 9, 10, 11, 12, 13, 14], 30, true);
    personaje.animations.play('right');
 
    carrots = game.add.group();
     
    //Variables del juego
    game.giro = 250;
    game.velocidadcarrots = 500;
    game.gravedadcarrots = 150;
    game.vidas = 3;
    game.puntaje = 0;
    game.nivel = 1;
     
    //Loops y eventos
    game.subirNivel = game.time.events.loop(10000, subirNivel, this);
     
    //Indicadores de puntaje y vidas
    txtPuntos = game.add.text(25, 16, 'Tus Puntos: 0', { font: '24px Arial', fill: '#000' });
    txtNivel = game.add.text(325, 16, 'Nivel: 1', {font: '24px Arial', fill: '#000'});
    txtVidas = game.add.text(625, 16, 'Vidas: 3', {font: '24px Arial', fill: '#000'});
     
    //Sonidos
    sndPunto = game.add.audio('punto');
    //this.teclas = this.game.input.keyboard.createCursorKeys();
    this.cursors = this.game.input.keyboard.createCursorKeys();

}
 
function update() {
    
    game.physics.arcade.collide(personaje, plataforma);
    game.physics.arcade.overlap(carrots, suelo, perderVida, null, this);
    game.physics.arcade.overlap(bandeja, carrots, recogercarrot, null, this); 


    if(personaje.body.velocity.x > 0 && personaje.x > game.giro){
        personaje.body.velocity.x *= -1;
        game.giro = game.rnd.integerInRange(100, personaje.x-1);
        personaje.animations.play('left');
        soltarcarrot();
    }
     
    if(personaje.body.velocity.x < 0 && personaje.x < game.giro){
        personaje.body.velocity.x *= -1;
        game.giro = game.rnd.integerInRange(personaje.x+1, 688);
        personaje.animations.play('right');
        soltarcarrot();
    }
     
    //bandeja.body.x = game.input.mousePointer.x - bandeja.width / 2;

    
    bandeja.body.x = game.input.x - bandeja.width/2;

}
 
function soltarcarrot() {
    var carrot = carrots.create(personaje.x, 100, 'carrot');
    game.physics.arcade.enable(carrot);
    carrot.body.gravity.y = game.gravedadcarrots;
}
 
function subirNivel(){
    game.gravedadcarrots *= 1.2;
    personaje.body.velocity.x *= 1.2;
    game.nivel += 1;
    txtNivel.setText('Nivel: '+game.nivel);

    if (game.nivel >= 2) 
    {
            bandeja.width = 100;
            if (game.nivel >= 4) 
            {
                bandeja.width = 75;
            }
    }
}
 
function recogercarrot(bandeja, carrot){
    carrot.kill();
    game.puntaje += 5;
    txtPuntos.setText('Puntos: '+game.puntaje);
    sndPunto.play();
}
 
function perderVida(suelo, carrot){
    carrot.kill();
    game.vidas -= 1;
    txtVidas.setText('Vidas: '+game.vidas);
     
    if(game.vidas == 0){
        suelo.kill();
        bandeja.kill();
        game.add.text(game.world.width/2-150, 150, 'Perdiste', {font:'80px Arial', fill: '#000'});
        game.add.sprite(game.world.width/2-140, 260, 'bandejallena');
        game.add.text(game.world.width/2-50, 250, 'Nivel: '+game.nivel, {font:'30px Arial', fill: '#000'});
        game.add.text(game.world.width/2-50, 300, 'Puntos: '+game.puntaje, {font:'30px Arial', fill: '#000'});
        Reiniciar = game.add.button(game.world.width/2, game.world.height*0.62, 'button', startGame, this, 1, 0, 2);
        Reiniciar.anchor.set(0.5);
    }

function startGame() {
    location.reload();
}
}