    let config = {
        type: Phaser.AUTO,
        width: 800,
        height: 640,
        physics: {
            default: 'arcade'
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        },
        autoCenter: true
    };
    var game = new Phaser.Game(config);
    var layer0, layer1, layer2, layer3;
    var heros;
    var herosWalk, walkRight;
    var ennemi1, ennemi2, ennemi3, ennemi4, ennemi5;
    var injections, injection;
    var viruses;
    var virus; 
    var next = -2000, prev = -500;
    let intro, start, end, shootkeys, arrows, text1, text2;
    let introSong, novideo;
    let recommencer = false;


    function preload() {
        this.load.image('intro','./assets/images/intro.png');
        this.load.image('start','./assets/images/start.png');
        this.load.image('zqsd','./assets/images/keys.png');
        this.load.image('arrows','./assets/images/arrows.png');
        this.load.image('tiles', './assets/images/city.png');
        this.load.tilemapTiledJSON('citymap', './assets/images/map.json');
        this.load.image('joueur', './assets/images/character/persoStart.png');
        this.load.image('mort', './assets/images/character/persoDead.png');
        this.load.image('ennemiDroite', './assets/images/character/ennemiDroite.png');
        this.load.image('ennemiGauche', './assets/images/character/ennemiGauche.png');
        this.load.image('ennemiFace', './assets/images/character/ennemiFace.png');
        this.load.image('ennemiMort', './assets/images/character/ennemiDead.png')
        this.load.image('antidote', './assets/images/weapon/antidote.png');
        this.load.image('virus', './assets/images/weapon/virus.png');
        this.load.audio('introSong','./assets/sound/sanandreas.mp3');
        this.load.audio('win','./assets/sound/winSound.mp3');
        this.load.audio('hit','./assets/sound/hitSound.mp3');
        this.load.video('dead','./assets/video/nono.mp4');
        this.load.image('fin','./assets/images/endMeme.jpg');
        this.load.image('endpoint','./assets/images/endPoint.png');
    }

    function create() {
        //Ecran d'introduction avec bouton interactif
        intro = this.add.image(0,0,'intro').setDepth(2);
        intro.setOrigin(0,0);
        start = this.add.image(650,550,'start').setInteractive().setDepth(2);
        start.setScale(0.1);
        start.on('pointerdown', startGame);
        shootkeys = this.add.image(680,420,'zqsd').setDepth(2);
        shootkeys.setScale(0.2);
        arrows = this.add.image(680,320,'arrows').setDepth(2);
        arrows.setScale(0.2);
        text1 = this.add.text(540, 310, "Move", {
            fontFamily: 'Arial',
            fontSize: 26,
            color: '#030303'
        }).setDepth(2);
        text2 = this.add.text(535, 410, "Shoot", {
            fontFamily: 'Arial',
            fontSize: 25,
            color: '#030303'
        }).setDepth(2);
        introSong = this.sound.add('introSong');
        introSong.play();

        //En cas de victoire
        endLine = this.physics.add.image(630, 140, 'endpoint');
        endLine.setVisible(false);
        end = this.add.image(400,300,'fin').setDepth(2);
        end.setVisible(false);
        winSong = this.sound.add('win');

        //En cas de mort
        novideo = this.add.video(400,300,'dead').setDepth(2);
        novideo.setVisible(false);
        
        //création du héros
        heros = this.physics.add.image(70, 420, 'joueur');
        heros.setVisible(false);
        herosMort = this.physics.add.image(0, 0, 'mort');
        herosMort.setVisible(false);
        herosMort.body.enable = false;

        //création des ennemis
        ennemi1 = this.physics.add.image(100, 260, 'ennemiDroite');
        ennemi1.setVisible(false);
        ennemi2 = this.physics.add.image(680, 550, 'ennemiGauche');
        ennemi2.setVisible(false);
        ennemi3 = this.physics.add.image(420, 370, 'ennemiFace');
        ennemi3.setVisible(false);
        ennemi4 = this.physics.add.image(150, 60, 'ennemiDroite');
        ennemi4.setVisible(false);
        ennemi5 = this.physics.add.image(680, 240, 'ennemiGauche');
        ennemi5.setVisible(false);
        ennemiMort = this.physics.add.group();

        //création des munitions
        injections = this.physics.add.group();
        viruses = this.physics.add.group();
        injectionHit = this.sound.add('hit');

        //entrée clavier
        this.cursors = this.input.keyboard.createCursorKeys();
        tirDroite = this.input.keyboard.addKey('D');
        tirHaut = this.input.keyboard.addKey('Z');
        tirGauche = this.input.keyboard.addKey('Q');
        tirBas = this.input.keyboard.addKey('S');

        //création de la map
        let map = this.add.tilemap('citymap');
        let mcity = map.addTilesetImage('city', 'tiles');
        layer0 = map.createStaticLayer(0, mcity, 0, 0).setDepth(-1);
        layer1 = map.createStaticLayer(1, mcity, 0, 0).setDepth(-1);
        layer2 = map.createStaticLayer(2, mcity, 0, 0).setDepth(-1);
        layer1.setCollisionByProperty({
            Collision: true
        });
        layer2.setCollisionByProperty({
            Collision: true
        });
        this.physics.add.collider(heros, layer1);
        this.physics.add.collider(heros, layer2);
        this.physics.add.collider(heros, endLine, victory);
        heros.body.collideWorldBounds = true;

        //collision des tirs
        this.physics.add.collider(injections, ennemi1, collisionTir);
        this.physics.add.collider(injections, ennemi2, collisionTir);
        this.physics.add.collider(injections, ennemi3, collisionTir);
        this.physics.add.collider(injections, ennemi4, collisionTir);
        this.physics.add.collider(injections, ennemi5, collisionTir);

        this.physics.add.collider(viruses, heros, collisionJoueurVirus);

        this.physics.add.collider(injections, layer1);
    }

    function update() {
        heros.setVelocity(0, 0);

        //mouvement joueur
        if (this.cursors.up.isDown) {
            heros.setVelocityY(-100);
        }
        if (this.cursors.down.isDown) {
            heros.setVelocityY(100);
        }
        if (this.cursors.left.isDown) {
            heros.setVelocityX(-100);
        }
        if (this.cursors.right.isDown) {
            heros.setVelocityX(100);
        }

        //delay entre chaque tir du joueur
        if (tirHaut.isDown && (this.time.now > prev+500)) {
            munition(heros, 0, -200, -90);
            prev = this.time.now;
        }
        if (tirDroite.isDown && (this.time.now > prev+500)) {
            munition(heros, 200, 0, 0);
            prev = this.time.now;
        }
        if (tirGauche.isDown && (this.time.now > prev+500)) {
            munition(heros, -200, 0, 180);
            prev = this.time.now;
        }
        if (tirBas.isDown && (this.time.now > prev+500)) {
            munition(heros, 0, 200, 90);
            prev = this.time.now;
        }

        //tir automatique des ennemis
        if(this.time.now > next+2000){
            tirEnnemi(ennemi1,200,0);
            tirEnnemi(ennemi2,-200,0);
            tirEnnemi(ennemi3,0,200);
            tirEnnemi(ennemi4,200,0);
            tirEnnemi(ennemi5,-200,0);
            next = this.time.now;
        }

        //cas des collisions avec les ennemis
        if (Phaser.Geom.Intersects.RectangleToRectangle(heros.getBounds(), ennemi1.getBounds())) {
            collisionJoueurEnnemi(heros, herosMort, ennemi1);
        }
        if (Phaser.Geom.Intersects.RectangleToRectangle(heros.getBounds(), ennemi2.getBounds())) {
            collisionJoueurEnnemi(heros, herosMort, ennemi2);
        }
        if (Phaser.Geom.Intersects.RectangleToRectangle(heros.getBounds(), ennemi3.getBounds())) {
            collisionJoueurEnnemi(heros, herosMort, ennemi3);
        }
        if (Phaser.Geom.Intersects.RectangleToRectangle(heros.getBounds(), ennemi4.getBounds())) {
            collisionJoueurEnnemi(heros, herosMort, ennemi4);
        }
        if (Phaser.Geom.Intersects.RectangleToRectangle(heros.getBounds(), ennemi5.getBounds())) {
            collisionJoueurEnnemi(heros, herosMort, ennemi5);
        }

        if(recommencer){
            recommencer = false;
            let timerRestart = this.time.addEvent({
                delay: 10000,
                callback: restartGame,
                callbackScope: this,
                repeat: 0
            });
        }
        
    }

    //ennemi touché par un tir
    function collisionTir(ennemi) {
        var mort = ennemiMort.create(ennemi.x, ennemi.y, 'ennemiMort');
        injectionHit.play();
        ennemi.body.enable = false;
        ennemi.y = 1000;
        injection.destroy();
        ennemiMort.setVisible(true).setDepth(-1);
    }

    //collision joueur-ennemi
    function collisionJoueurEnnemi(ennemi) {
        herosMort.x = heros.x;
        herosMort.y = heros.y;
        heros.body.enable = false;
        heros.setVisible(false);
        herosMort.setVisible(true);
        ennemi.setVelocity(0, 0);
        novideo.setVisible(true);
        novideo.play();
        recommencer = true;

    }

    //munition joueur
    function munition(joueur, x, y, angle) {
        injection = injections.create(joueur.x, joueur.y, 'antidote');
        injection.setVelocity(x, y);
        injection.setAngle(angle);
    }

    //munition ennemi
    function tirEnnemi(ennemi,a,b){
        virus = viruses.create(ennemi.x, ennemi.y, 'virus');
        virus.setVelocity(a,b);
    }

    //collision avec tir ennemi
    function collisionJoueurVirus() {
        herosMort.x = heros.x;
        herosMort.y = heros.y;
        heros.body.enable = false;
        heros.setVisible(false);
        herosMort.setVisible(true);
        novideo.setVisible(true);
        novideo.play();
        recommencer = true;
    }

    //action après appui sur bouton START
    function startGame() {
        intro.setVisible(false);
        start.setVisible(false);
        text1.setVisible(false);
        text2.setVisible(false);
        arrows.setVisible(false);
        shootkeys.setVisible(false);
        introSong.stop();
        heros.setVisible(true);
        ennemi1.setVisible(true);
        ennemi2.setVisible(true);
        ennemi3.setVisible(true);
        ennemi4.setVisible(true);
        ennemi5.setVisible(true);
    }

    function restartGame() {
        this.scene.restart();
    }

    //action en cas de victoire
    function victory(){
        winSong.play();
        end.setVisible(true);
        recommencer = true;
    }