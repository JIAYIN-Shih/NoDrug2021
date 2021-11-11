var config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var platforms; //平台群組
var player; //玩家
var cursors; //鍵盤
var badfoods; //壞食物群組
var goodfoods; //好食物群組
var hearttime = 3; //剩餘次數
let jump = true;
var loopfood;
var gameOver = false;
var _this;
var groundmusic;

var loadtime = 0

var bg//初始化背景
var loadimg

function preload() {
    loadtime = 0;
    // ===========================顯示設定===========================
    window.addEventListener('resize', resize);
    resize();
    //內建背景
    bg = this.add.graphics(0, 0);
    bg.fillStyle(0xF3B977, 1);
    bg.fillRect(0, 0, 1920, 1080);

    //LOAD
    this.load.image('load', 'img/load.gif');
    this.load.spritesheet('loads', 'img/loads.png', { frameWidth: 1186, frameHeight: 588 });

    this.load.on('progress', function (value) {
        console.log(value);
    });


    this.load.on('complete', function () {
        if (loadtime == 1) {
            start();
        }
        if (loadimg == 2) {
            bg.destroy();
            loadimg.destroy();
        }
        loadtime++
        console.log('complete');
    });

}

function start() {
    // 背景音樂
    groundmusic = _this.sound.add('groundmusic', {
        volume: 0.2
    });
    groundmusic.play();

    //背景        
    sky1 = _this.physics.add.sprite(0, 0, 'sky').setOrigin(0, 0).refreshBody();
    sky2 = _this.physics.add.sprite(3840, 0, 'sky').setOrigin(0, 0).refreshBody();

    // 房子
    house1 = _this.physics.add.sprite(0, 0, 'house1').setOrigin(0, 0);
    house2 = _this.physics.add.sprite(3500, 0, 'house2').setOrigin(0, 0);

    // 時鐘
    clock = _this.add.image(1740, 26, 'clock').setOrigin(0, 0).setScale(0.7);

    //愛心
    hurtHeart1 = _this.add.image(30, 30, 'hurtHeart').setOrigin(0, 0).setScale(0.8);
    hurtHeart2 = _this.add.image(150, 30, 'hurtHeart').setOrigin(0, 0).setScale(0.8);
    hurtHeart3 = _this.add.image(270, 30, 'hurtHeart').setOrigin(0, 0).setScale(0.8);
    healthyHeart1 = _this.add.image(30, 30, 'healthyHeart').setOrigin(0, 0).setScale(0.8);
    healthyHeart2 = _this.add.image(150, 30, 'healthyHeart').setOrigin(0, 0).setScale(0.8);
    healthyHeart3 = _this.add.image(270, 30, 'healthyHeart').setOrigin(0, 0).setScale(0.8);

    // 計時器
    _this.initialTime = 60;
    text = _this.add.text(1782, 96, _this.initialTime.toString().padStart(2, '0'), {
        color: '#000',
        fontSize: '50px',
        fontFamily: '微軟正黑體'
    });
    // 想要顯示幾分幾秒可以用下面這個
    // text = this.add.text(1600, 50, formatTime(this.initialTime), { color: '#000' ,fontSize: '40px'});
    _this.countdownTime = 3;
    countdown = _this.add.text(650, 250, _this.countdownTime.toString().padStart(2, '0'), {
        color: '#fff',
        fontSize: '500px',
        fontFamily: '微軟正黑體'
    });
    // 想要顯示幾分幾秒可以用下面這個
    // countdown = this.add.text(1600, 50, formatTime(this.countdownTime), { color: '#fff' ,fontSize: '40px'});

    // 每秒呼叫一次
    timedEvent = _this.time.addEvent({
        delay: 1000,
        callback: onEvent,
        callbackScope: _this,
        loop: true
    });
    CountTimedEvent = _this.time.addEvent({
        delay: 1000,
        callback: CountdownEvent,
        callbackScope: _this,
        loop: true
    });

    // 創造平台
    platforms = _this.physics.add.staticGroup();
    platforms.create(0, 900, 'ground').setOrigin(0, 0).refreshBody();

    //人物
    player = _this.physics.add.sprite(300, 470, 'runningMan').setOrigin(0, 0).setScale(0.45).refreshBody();
    player.setGravityY(3500);
    player.setCollideWorldBounds(true);

    //壞食物
    badfoods = _this.physics.add.group();
    //好食物
    goodfoods = _this.physics.add.group();
    // 調整食物生成間隔
    loopfood = _this.time.addEvent({
        delay: 1500,
        callback: createfood,
        callbackScope: _this,
        loop: true
    });

    //===========================動畫===========================
    // 人物動畫
    _this.anims.create({
        key: 'run',
        frames: _this.anims.generateFrameNumbers('runningMan', {
            start: 0,
            end: 8
        }),
        frameRate: 15,
        //-1代表會重複loop
        repeat: -1
    });
    _this.anims.create({
        key: 'stop',
        frames: [{
            key: 'runningMan',
            frame: 0
        }],
        frameRate: 1
    });

    //===========================動畫啟動===========================
    player.anims.play('run', true);

    //===========================碰撞事件===========================
    // 人跟地板
    _this.physics.add.collider(player, platforms);

    // 人跟食物
    _this.physics.add.overlap(player, badfoods, collectbadfood, null, _this);
    _this.physics.add.overlap(player, goodfoods, collectgoodfood, null, _this);

    //===========================鍵盤設定===========================
    cursors = _this.input.keyboard.createCursorKeys();


    _this.physics.pause();
    timedEvent.paused = true;
    loopfood.paused = true;
    player.anims.play('stop');
}




// ===========================自訂 Function Start===========================    
function resize() {
    var canvas = game.canvas,
        width = window.innerWidth,
        height = window.innerHeight;
    var wratio = width / height,
        ratio = canvas.width / canvas.height;

    if (wratio < ratio) {
        canvas.style.width = width + "px";
        canvas.style.height = (width / ratio) + "px";
    } else {
        canvas.style.width = (height * ratio) + "px";
        canvas.style.height = height + "px";
    }
}

var speed = -650; //隨著時間會越來越快
function createOnefood(foodgroup, foodlist) {
    getfoodkey = Math.floor(Math.random() * foodlist.length);
    heights = [75, 100];
    food = foodgroup.create(2100, 700 + heights[Math.floor(Math.random() * heights.length)], foodlist[getfoodkey]).setScale(0.3);
    food.body.setSize(200, 200, true);
    food.setVelocityX(speed);
}

function createfood() {
    badfoodlist = ["badfood1", "badfood2", "badfood3", "badfood4", "badfood5"];
    goodfoodlist = ["goodfood1", "goodfood2", "goodfood3", "goodfood4", "goodfood5"];

    random = Math.floor(Math.random() * 2); //0跟1
    random ? createOnefood(goodfoods, goodfoodlist) : createOnefood(badfoods, badfoodlist);

    speed -= 10; //往x的速度變快
}

function foodOverBorders() {
    try {
        badfoods.children.iterate(function (child) {
            if (child.body.x < -667) {
                child.destroy();
            }
        });
    } catch (error) {

    }
    try {
        goodfoods.children.iterate(function (child) {
            if (child.body.x < -667) {
                child.destroy();
            }
        });
    } catch (error) {

    }
}

// collect
function collectgoodfood(player, goodfood) {
    goodfood.disableBody(true, true);
    goodfood.destroy(true, true);
    this.sound.add('eatgood', {
        volume: 0.5
    }).play();
}

function collectbadfood(player, badfood) {
    badfood.disableBody(true, true);
    badfood.destroy(true, true);
    this.sound.add('eatbad', {
        volume: 0.7
    }).play();

    //減少愛心
    getHurt();
}

function getHurt() {
    hearttime -= 1;
    // console.log(hearttime);
    switch (hearttime) {
        case 2:
            healthyHeart3.visible = false;
            break;
        case 1:
            healthyHeart2.visible = false;
            break;
        case 0:
            // 遊戲結束
            healthyHeart1.visible = false;
            this.gameOver = true;
            finish();
            break;
    }
}

// 計時器
function formatTime(seconds) {
    // 分鐘
    var minutes = Math.floor(seconds / 60);
    // 秒數
    var partInSeconds = seconds % 60;
    // 補零
    partInSeconds = partInSeconds.toString().padStart(2, '0');
    // 回傳格式
    return `${minutes}:${partInSeconds}`;
}

function onEvent() {
    this.initialTime -= 1; // 一秒鐘
    if (this.initialTime <= 0) {
        finish();
    }
    text.setText(this.initialTime.toString().padStart(2, '0'));

    // 想要顯示幾分幾秒可以用下面這個
    // text.setText(formatTime(this.initialTime));
}

function CountdownEvent() {
    this.countdownTime -= 1; // 一秒鐘
    if (this.countdownTime <= 0) {
        this.physics.resume();
        timedEvent.paused = false;
        loopfood.paused = false;
        CountTimedEvent.paused = true;
        player.anims.play('run');
        countdown.visible = false;
    }
    countdown.setText(this.countdownTime.toString().padStart(2, '0'));

    // 想要顯示幾分幾秒可以用下面這個
    // countdown.setText(formatTime(this.countdownTime));
}

// 遊戲結束
function finish() {
    this.timedEvent.paused = true;
    _this.physics.pause();
    groundmusic.stop();
    player.anims.play('stop');

    if (gameOver) {
        _this.sound.add('fail', {
            volume: 0.5
        }).play();
        document.getElementById("fail").style.display = "block";
    } else {
        _this.sound.add('pass', {
            volume: 0.5
        }).play();
        document.getElementById("pass").style.display = "block";
    }

}

function renew() {
    _this.scene.restart();
    hearttime = 3
    gameOver = false;
    document.getElementById("fail").style.display = "none";
    document.getElementById("pass").style.display = "none";
}
// ===========================自訂 Function End===========================

function create() {
    _this = this;

    loadimg = this.physics.add.sprite(300, 180, 'load').setOrigin(0, 0);

    this.anims.create({
        key: 'startload',
        frames: this.anims.generateFrameNumbers('loads', { start: 0, end: 47 }),
        frameRate: 10,
        repeat: -1
    });
    loadimg.anims.play('startload', true);

    // 起始暫停

    // ===========================載入素材===========================
    this.load.image('sky', 'img/sky.jpg');
    this.load.image('ground', 'img/ground.png');
    this.load.image('house1', 'img/house1.png');
    this.load.image('house2', 'img/house2.png');
    this.load.image('clock', 'img/clock.png');
    this.load.image('healthyHeart', 'img/Heart_1.png');
    this.load.image('hurtHeart', 'img/Heart_2.png');

    this.load.spritesheet('runningMan',
        'img/run/run_sprites.png', {
        frameWidth: 534,
        frameHeight: 960
    }
    );

    this.load.image('goodfood1', 'img/food/good/sweety1.png');
    this.load.image('goodfood2', 'img/food/good/sweety2.png');
    this.load.image('goodfood3', 'img/food/good/sweety3.png');
    this.load.image('goodfood4', 'img/food/good/sweety4.png');
    this.load.image('goodfood5', 'img/food/good/sweety5.png');
    this.load.image('badfood1', 'img/food/bad/poison1.png');
    this.load.image('badfood2', 'img/food/bad/poison2.png');
    this.load.image('badfood3', 'img/food/bad/poison3.png');
    this.load.image('badfood4', 'img/food/bad/poison4.png');
    this.load.image('badfood5', 'img/food/bad/poison5.png');

    // ===========================載入音樂===========================
    this.load.audio("groundmusic", 'audio/groundmusic.mp3');
    this.load.audio("eatbad", 'audio/eatbad.mp3');
    this.load.audio("eatgood", 'audio/eatgood.mp3');
    this.load.audio("fail", 'audio/fail.mp3');
    this.load.audio("pass", 'audio/pass.mp3');



    // load start
    this.load.on('progress', function (value) {
        console.log(value);
    });

    this.load.on('fileprogress', function (file) {
        if (file.src == "img/LODING1.gif") {
            // const loadimg = game.physics.add.sprite(0, 0, 'load').setOrigin(0, 0);
            console.log("okkook")
        }
        console.log(file.src);
    });


    this.load.on('complete', function () {
        console.log('complete');
    });


    this.load.start();



}

function update() {

    if (loadtime >= 2) {

        // 檢查食物超出邊界

        foodOverBorders()

        // 背景移動
        house1.setVelocityX(-800);
        house2.setVelocityX(-800);
        if (house1.body.x <= -3840) {
            house1.body.x = 3840;
        }
        if (house2.body.x <= -3840) {
            house2.body.x = 3840;
        }

        sky1.setVelocityX(-600);
        sky2.setVelocityX(-600);
        if (sky1.body.x <= -3840) {
            sky1.body.x = 3840;
        }
        if (sky2.body.x <= -3840) {
            sky2.body.x = 3840;
        }

        // 人物屬性更新
        player.setVelocityX(0);

        // 鍵盤移動
        if (cursors.up.isDown && player.body.touching.down && jump) {
            player.setVelocityY(-1550);
            jump = false;
            setTimeout(() => jump = true, 800);
        }
    }

    // 測試用
    // if (cursors.right.isDown) {
    //     finish();
    // }
    // if (cursors.left.isDown) {
    //     gameOver = true; 
    //     finish();
    // }

}