var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('level1', 'assets/games/starstruck/level1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles-1', 'assets/games/starstruck/tiles-1.png');
    game.load.image('king2', 'assets/games/starstruck/king1.png');
    game.load.spritesheet('dude', 'assets/games/starstruck/dude_strip9.png', 32, 48);
    game.load.spritesheet('guy', 'assets/games/starstruck/guard_strip6.png', 32, 48);
    game.load.image('starSmall', 'assets/games/starstruck/star.png');
    game.load.image('starBig', 'assets/games/starstruck/star2.png');
    game.load.image('background', 'assets/games/starstruck/background2.png');

}

var map;
var tileset;
var guards;
var layer;
var player;
var facing = 'left';
var jumpTimer = 0;
var cursors;
var jumpButton;
var bg;
var stateText;
var king;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#000000';

    bg = game.add.tileSprite(0, 0, 800, 600, 'background');
    bg.fixedToCamera = true;

    map = game.add.tilemap('level1');

    map.addTilesetImage('tiles-1');

    map.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);

    layer = map.createLayer('Tile Layer 1');

    //  Un-comment this on to see the collision tiles
    // layer.debug = true;

    layer.resizeWorld();

    game.physics.arcade.gravity.y = 250;

    player = game.add.sprite(32, 32, 'dude');
    game.physics.enable(player, Phaser.Physics.ARCADE);

    player.body.bounce.y = 0.2;
    player.body.collideWorldBounds = true;
    player.body.setSize(20, 32, 5, 16);
    
    king = game.add.sprite(112, 894, 'king2');
    game.physics.enable(king, Phaser.Physics.ARCADE);

    king.body.bounce.y = 0.2;
    king.body.collideWorldBounds = true;
    king.body.setSize(20, 32, 5, 16);
    king.body.moves = false;

    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('turn', [4], 20, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
    
    guards = game.add.group();
    guards.enableBody = true;
    guards.physicsBodyType = Phaser.Physics.ARCADE;

    createGuards();
    
    stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;

    game.camera.follow(player);

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

}

function createGuards () {

            var guard = guards.create(64, 144, 'guy');
            var guard = guards.create(128, 144, 'guy');
            var guard = guards.create(92, 144, 'guy');
            var guard = guards.create(448, 144, 'guy');
            var guard = guards.create(384, 144, 'guy');
            guard.anchor.setTo(0.5, 0.5);
            guard.animations.add('patrolRight', [ 0, 1, 2], 10, true);
            guard.animations.add('patrolLeft', [3, 4, 5], 10, true);
            guard.play('patrolRight');
            //guard.body.moves = false;
            guard.body.bounce.y = 0.2;
            guard.body.collideWorldBounds = true;
            guard.body.setSize(20, 32, 5, 16);
            game.physics.enable(guard, Phaser.Physics.ARCADE);
    

    guards.x = 100;
    guards.y = 50;

    //  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
    var tween = game.add.tween(guards).to( { x: 150 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);

    //tween.onLoop.play(turnAround(), this);
}

/*function turnAround(){
    if (this.animations.isplaying('patrolLeft')){
     this.play('patrolRight');   
    }else{
     this.play('patrolLeft');   
    }
}*/

function update() {

    game.physics.arcade.collide(player, layer);
    //game.physics.arcade.collide(player, guard);

    player.body.velocity.x = 0;
    
    game.physics.arcade.collide(guards, layer);
    
    //guard.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -150;

        if (facing != 'left')
        {
            player.animations.play('left');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 150;

        if (facing != 'right')
        {
            player.animations.play('right');
            facing = 'right';
        }
    }
    else
    {
        if (facing != 'idle')
        {
            player.animations.stop();

            if (facing == 'left')
            {
                player.frame = 0;
            }
            else
            {
                player.frame = 5;
            }

            facing = 'idle';
        }
    }
    
    if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer)
    {
        player.body.velocity.y = -250;
        jumpTimer = game.time.now + 750;
    }
    
    game.physics.arcade.overlap(guards, player, enemyHitsPlayer, null, this);


}

function enemyHitsPlayer (player, guard) {
        //player.kill();

        stateText.text=" GAME OVER \n Click to restart";
        stateText.visible = true;

        //the "click to restart" handler
        //game.input.onTap.addOnce(restart,this);
        restart();

}

function enemyHitsPlayer (player, king) {
        king.kill();

        stateText.text=" GAME OVER \n Click to restart";
        stateText.visible = true;

        //the "click to restart" handler
        //game.input.onTap.addOnce(restart,this);
        //restart();

}

function render () {

    // game.debug.text(game.time.physicsElapsed, 32, 32);
    // game.debug.body(player);
    // game.debug.bodyInfo(player, 16, 24);

}
