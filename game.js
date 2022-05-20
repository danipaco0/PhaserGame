let config = {
     type: Phaser.AUTO,
     width: 800, height: 640,
     physics: {default:'arcade'},
     scene: { preload : preload, 
          create: create, update:update },
     autoCenter: true
};
var game = new Phaser.Game(config);
var layer0 ;
var layer1;
var layer2 ;
var heros;
var ennemi1;
var ennemi2;
var ennemi3;
var ennemis = [ennemi1,ennemi2,ennemi3];
var injections;
var injection;
let timer;


function preload(){
     this.load.image('tiles','./assets/city.png');
     this.load.tilemapTiledJSON('citymap','./assets/images/map.json');
     this.load.image('joueur','./assets/images/character/persoStart.png');
     this.load.image('mort','./assets/images/character/persoDead.png');
     this.load.image('ennemiDroite','./assets/images/character/ennemiDroite.png');
     this.load.image('ennemiGauche','./assets/images/character/ennemiGauche.png');
     this.load.image('ennemiFace','./assets/images/character/ennemiFace.png');
     this.load.image('ennemiMort','./assets/images/character/ennemiDead.png')
     this.load.image('antidote','./assets/images/weapon/antidote.png');
     this.load.image('virus','./assets/images/weapon/virus.png');
}

function create (){
     heros = this.physics.add.image(70, 420, 'joueur');
     herosMort = this.physics.add.image(0, 0, 'mort');
     herosMort.setVisible(false);
     herosMort.body.enable = false;

     ennemi1 = this.physics.add.image(80,300,'ennemiDroite');
     ennemi2 = this.physics.add.image(680,550,'ennemiGauche');
     ennemi3 = this.physics.add.image(450,200,'ennemiFace');
     ennemiMort = this.physics.add.image(0,0,'ennemiMort');
     ennemiMort.setVisible(false);
     ennemiMort.body.enable = false;

     injections = this.physics.add.group({defaultKey: 'injection',maxSize:50});
//     injection = injections.get();
     

//     var viruses = this.physics.add.group({defaultKey: 'corona',maxSize: 100});

     
     
//     this.anims.create({key:'left',frames: this.anims.generateFrameNumbers('perso1',{start:131,end:133}),frameRate:10});
//     this.anims.create({key:'left',frames: this.anims.generateFrameNumbers('perso1',{start:157,end:160}),frameRate:10});
     
     
     haut = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
     bas = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
     gauche = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
     droite = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
     tir = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

     
     
     let map = this.add.tilemap('citymap');
     let mcity = map.addTilesetImage('city','tiles');
     layer0 = map.createStaticLayer(0,mcity,0,0).setDepth(-1);
     layer1 = map.createStaticLayer(1,mcity,0,0).setDepth(-1);
     layer2 = map.createStaticLayer(2,mcity,0,0).setDepth(-1);
     layer1.setCollisionByProperty({Collision: true});
     layer2.setCollisionByProperty({Collision: true});
     this.physics.add.collider(heros, layer1);
     this.physics.add.collider(heros, layer2);
     heros.body.collideWorldBounds = true;

     this.physics.add.collider(heros, ennemi1);
     this.physics.add.collider(heros, ennemi2);
     this.physics.add.collider(heros, ennemi3);

     this.physics.add.collider(injections,ennemi1,collisionTir);
     this.physics.add.collider(injections,ennemi2,collisionTir);
     this.physics.add.collider(injections,ennemi3,collisionTir);
}

function update(){
     heros.setVelocity(0,0);
     if (Phaser.Input.Keyboard.Down(haut)) {
          heros.setVelocityY(-100);
     }
     if (Phaser.Input.Keyboard.Down(bas)) {
          heros.setVelocityY(100);
     }
     if (Phaser.Input.Keyboard.Down(gauche)) {
          heros.setVelocityX(-100);        
     }
     if (Phaser.Input.Keyboard.Down(droite)) {
          heros.setVelocityX(100);   
     }
     
     if (Phaser.Input.Keyboard.JustDown(tir)){
          
          if(injection){
               injection.setPosition(heros.x, heros.y);
               injection.setVelocityX(200);
          }
     }
/*          if(Phaser.Input.Keyboard.JustDown(haut)){
               injection.setVelocityY(-200);
          }
   if(Phaser.Input.Keyboard.JustDown(tir) && Phaser.Input.Keyboard.JustDown(bas)){
          if(injection){
               injection.setPosition(heros.x, heros.y);
               injection.setVelocityY(200);
          }
     }
     if(Phaser.Input.Keyboard.JustDown(tir) && Phaser.Input.Keyboard.JustDown(gauche)){
          injection.setPosition(heros.x, heros.y);
          injection.setVelocityX(-200);
     }
*/

     if(Phaser.Geom.Intersects.RectangleToRectangle(injection.getBounds(),ennemi1.getBounds())){
          ennemiMort.x = ennemi1.x;
          ennemiMort.y = ennemi1.y;
          ennemi1.body.enable = false;
          ennemi1.setVisible(false);
          ennemiMort.setVisible(true);
          injection.setVisible(false);
     }
     if(Phaser.Geom.Intersects.RectangleToRectangle(injection.getBounds(),ennemi2.getBounds())){
          ennemiMort.x = ennemi2.x;
          ennemiMort.y = ennemi2.y;
          ennemi2.body.enable = false;
          ennemi2.setVisible(false);
          ennemiMort.setVisible(true);
          injection.setVisible(false);
     }
     if(Phaser.Geom.Intersects.RectangleToRectangle(injection.getBounds(),ennemi3.getBounds())){
          ennemiMort.x = ennemi3.x;
          ennemiMort.y = ennemi3.y;
          ennemi3.body.enable = false;
          ennemi3.setVisible(false);
          ennemiMort.setVisible(true);
          injection.setVisible(false);
     }

     if(Phaser.Geom.Intersects.RectangleToRectangle(heros.getBounds(),ennemi1.getBounds())){
          herosMort.x = heros.x;
          herosMort.y = heros.y;
          heros.body.enable = false;
          heros.setVisible(false);
          herosMort.setVisible(true);
          ennemi1.setVelocity(0,0);
     }
     if(Phaser.Geom.Intersects.RectangleToRectangle(heros.getBounds(),ennemi2.getBounds())){
          herosMort.x = heros.x;
          herosMort.y = heros.y;
          heros.body.enable = false;
          heros.setVisible(false);
          herosMort.setVisible(true);
          ennemi2.setVelocity(0,0);
     }
     if(Phaser.Geom.Intersects.RectangleToRectangle(heros.getBounds(),ennemi3.getBounds())){
          herosMort.x = heros.x;
          herosMort.y = heros.y;
          heros.body.enable = false;
          heros.setVisible(false);
          herosMort.setVisible(true);
          ennemi3.setVelocity(0,0);
     }



/*    if (Phaser.Geom.Intersects.RectangleToRectangle(this.heros.getBounds(), ennemi1.getBounds())) {
               herosMort.x = heros.x;
               herosMort.y = heros.y;
               heros.x = 0;
               heros.setVisible(false);
               heros.body.enable = false;
               herosMort.setVisible(true);

          
     }
*/
}

function collisionTir(ennemi, bullet){
     
     injection.destroy();

}
