
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.atlas('breakout', 'assets/games/breakout/breakout.png', 'assets/games/breakout/breakout.json');
    game.load.image('wood', 'assets/misc/wood.png');
    game.load.image('trampolineh', 'assets/trampolineh.png');
    game.load.image('cat',  'assets/cat' + (Math.floor((Math.random() * 4) + 1)) +'.png');
    game.load.image('box',  'assets/box.png');
    game.load.audio('love', 'assets/catdupe.wav');
    game.load.audio('death', 'assets/catdie.wav');
    game.load.audio('pink', 'assets/ppanth2.mid');


}
var ball;
var paddle;
var bricks;
var box;
var counter = 0;

var ballOnPaddle = true;

var lives = 3;
var score = 0;

var scoreText;
var livesText;
var introText;

var s;

function create() {
    
    love = game.add.audio('love');
    death = game.add.audio('death');
    pink = game.add.audio('pink');
    pink.play();

    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  We check bounds collisions against all walls other than the bottom one
    game.physics.arcade.checkCollision.down = false;

    s = game.add.tileSprite(0, 0, 800, 600, 'wood');

    bricks = game.add.group();
    bricks.enableBody = true;
    bricks.physicsBodyType = Phaser.Physics.ARCADE;
    
    paddles = game.add.group();
    paddles.enableBody = true;
    paddles.physicsBodyType = Phaser.Physics.ARCADE;
    
    balls = game.add.group();
    balls.enableBody = true
    balls.physicsBodyType = Phaser.Physics.ARCADE;
    

    var brick;

//    for (var y = 0; y < 4; y++)
//    {
//        for (var x = 0; x < 15; x++)
//        {
//            brick = bricks.create(120 + (x * 36), 100 + (y * 52), 'breakout', 'brick_' + (y+1) + '_1.png');
//            brick.body.bounce.set(1);
//            brick.body.immovable = true;
//        }
//    }
    
    paddle = paddles.create(game.world.centerX-396, 584, 'trampolineh', 'trampolineh.png');
    paddle.body.collideWorldBounds = true;
    paddle.body.bounce.set(1);
    paddle.body.immovable = true;
    paddle.anchor.setTo(0.5, 0.5);

    paddle = paddles.create(game.world.centerX, 16, 'trampolineh', 'trampolineh.png');
    paddle.anchor.setTo(0.5, 0.5);

    //paddle = game.add.sprite(game.world.centerX, 584, 'trampolineh', 'trampolineh.png');
    //paddle = game.add.sprite(game.world.centerX, 16, 'trampolineh', 'trampolineh.png');
    //paddle.anchor.setTo(0.5, 0.5);

    //game.physics.enable(paddle, Phaser.Physics.ARCADE);

    paddle.body.collideWorldBounds = true;
    paddle.body.bounce.set(1);
    paddle.body.immovable = true;

    box = game.add.sprite(game.world.centerX, 300, 'box', 'box.png');
    box.anchor.set(0.5);

    ball = balls.create(game.world.centerX, 300, 'cat', 'cat' + (Math.floor((Math.random() * 4) + 1)) +'.png');
    ball.anchor.set(0.5, 0.5);
    ball.checkWorldBounds = true;

    game.physics.enable(ball, Phaser.Physics.ARCADE);

    ball.body.collideWorldBounds = true;
    ball.body.bounce.set(1);

    ball.animations.add('spin', [ 'cat' + (Math.floor((Math.random() * 4) + 1)) +'.png'], 50, true, false);

    ball.events.onOutOfBounds.add(ballLost, this);

    scoreText = game.add.text(32, 550, 'score: 0', { font: "20px Arial", fill: "#ffffff", align: "left" });
    //livesText = game.add.text(680, 550, 'lives: 3', { font: "20px Arial", fill: "#ffffff", align: "left" });
    introText = game.add.text(game.world.centerX, 400, '- click to start -', { font: "40px Arial", fill: "#ffffff", align: "center" });
    introText.anchor.setTo(0.5, 0.5);

    game.input.onDown.add(releaseBall, this);

}

function update () {

    //  Fun, but a little sea-sick inducing :) Uncomment if you like!
    // s.tilePosition.x += (game.input.speed.x / 2);
    counter++;
    
    if (counter > 100){
        score++;
        scoreText.text = 'score: ' + score
        counter = 0;
            ball = balls.create(game.world.centerX, 300, 'cat', 'cat' + (Math.floor((Math.random() * 4) + 1)) +'.png');
    ball.anchor.set(0.5, 0.5);
    ball.checkWorldBounds = true;

    game.physics.enable(ball, Phaser.Physics.ARCADE);

    ball.body.collideWorldBounds = true;
    ball.body.bounce.set(1);
    
    ballOnPaddle = false;
    ball.body.velocity.y = -300;
    ball.body.velocity.x = -75;
    ball.animations.play('spin');
    introText.visible = false;

    ball.animations.add('spin', [ 'cat' + (Math.floor((Math.random() * 4) + 1)) +'.png'], 50, true, false);

    ball.events.onOutOfBounds.add(ballLost, this);
    
    game.physics.arcade.collide(paddle, paddles, ballHitPaddle);
    }

    paddles.x = game.input.x;

    if (paddle.x < 24)
    {
        paddle.x = 24;
    }
    else if (paddle.x > game.width - 24)
    {
        paddle.x = game.width - 24;
    }

    if (ballOnPaddle)
    {
        ball.body.x = paddle.x;
    }
    else
    {
        game.physics.arcade.collide(ball, paddles, ballHitPaddle, null, this);
        game.physics.arcade.collide(ball, bricks, ballHitPaddle, null, this);
        game.physics.arcade.collide(balls, paddles, ballHitPaddle, null, this);
        game.physics.arcade.collide(ball, balls, ballHitPaddle, null, this);
        game.physics.arcade.collide(balls, paddle, ballHitPaddle, null, this);
    }

}

function releaseBall () {

    if (ballOnPaddle)
    {
        ballOnPaddle = false;
        ball.body.velocity.y = -300;
        ball.body.velocity.x = -75;
        ball.animations.play('spin');
        introText.visible = false;
    }

}

function ballLost () {
    death.play();
    score--;
    scoreText.text = 'score: ' + score
    //livesText.text = 'lives: ' + lives;

    if (lives === 0)
    {
        gameOver();
    }
    else
    {
        //ballOnPaddle = true;

        //ball.reset(paddle.body.x + 16, paddle.y - 16);
        //ball.reset(box.x, box.y);
        //ball.body.velocity.y = -300;
        //ball.body.velocity.x = -75;
        ball.animations.stop();
    }

}

function gameOver () {

    ball.body.velocity.setTo(0, 0);
    
    introText.text = 'Game Over!';
    introText.visible = true;

}

function ballHitBrick (_ball, _brick) {

    _brick.kill();

    score += 10;

    scoreText.text = 'score: ' + score;

    //  Are they any bricks left?
    if (bricks.countLiving() == 0)
    {
        //  New level starts
        score += 1000;
        scoreText.text = 'score: ' + score;
        introText.text = '- Next Level -';

        //  Let's move the ball back to the paddle
        ballOnPaddle = true;
        ball.body.velocity.set(0);
        ball.x = paddle.x + 16;
        ball.y = paddle.y - 16;
        ball.animations.stop();

        //  And bring the bricks back from the dead :)
        bricks.callAll('revive');
    }

}

function ballHitBall (_ball, _ball){
    love.play();
}

function ballHitPaddle (_ball, _paddle) {

    var diff = 0;

    if (_ball.x < _paddle.x)
    {
        //  Ball is on the left-hand side of the paddle
        diff = _paddle.x - _ball.x;
        _ball.body.velocity.x = (-1 * diff);
    }
    else if (_ball.x > _paddle.x)
    {
        //  Ball is on the right-hand side of the paddle
        diff = _ball.x -_paddle.x;
        _ball.body.velocity.x = (1 * diff);
    }
    else
    {
        //  Ball is perfectly in the middle
        //  Add a little random X to stop it bouncing straight up!
        _ball.body.velocity.x = 2 + Math.random() * 8;
    }

}
