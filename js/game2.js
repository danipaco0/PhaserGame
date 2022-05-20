let config = {
     type: Phaser.AUTO,
     width: 800, height: 640,
     scene: { preload : preload, 
          create: create, update:update }
};
var game = new Phaser.Game(config);
var layer0 ;
var layer1;
var layer2 ;
var heros;


function preload(){
     this.load.spritesheet('perso','./assets/images/character/persoStart.png',{frameWidth:32,frameHeight:32});
     this.load.spritesheet('dead','./assets/images/character/persoDie.png',{frameWidth:32,frameHeight:32});
     this.load.spritesheet('avanceDroite','./assets/images/character/walkRight.png',{frameWidth:32,frameHeight:32});
     this.load.spritesheet('avanceGauche','./assets/images/character/walkLeft.png',{frameWidth:32,frameHeight:32});
}

function create (){
     var walkRight = this.anims.create({key:'walkRight',frames:this.anims.generateFrameNumbers('avanceDroite'),frameRate: 10});
     var walkLeft = this.anims.create({key:'walkLeft',frames:this.anims.generateFrameNumbers('avanceGauche'),frameRate: 10});
     var heros = this.add.sprite('avanceDroite');
     heros.play({key:'walkRight',repeat: 7});
     
     
     
     haut = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
     bas = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
     gauche = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
     droite = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
}

function update(){
     
}
