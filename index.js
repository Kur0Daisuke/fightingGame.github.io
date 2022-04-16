const canvas = document.querySelector("canvas");
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0,0,canvas.width, canvas.height)
const gravity = 0.7;

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png'
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 128
    },
    imageSrc: './img/shop.png',
    scale: 2.75,
    framesMax: 6
})

var player = new Fighter({
    position :{
        x: 50,
        y: 0
    },
    velocity :{
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0,
    },
    imageSrc: './img/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: './img/samuraiMack/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './img/samuraiMack/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/samuraiMack/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/samuraiMack/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './img/samuraiMack/Attack1.png',
            framesMax: 6
        },
        takeHit: {
            imageSrc: './img/samuraiMack/Take Hit - white silhouette.png',
            framesMax: 4
        },
        death: {
            imageSrc: './img/samuraiMack/Death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 160,
        height: 50,
    },
    damage: 4,
    dashCooldown: 3
})

var back = "";

var enemy = new Fighter({
    position :{
        x: 900,
        y: 100
    },
    velocity :{
        x: 0,
        y: 0
    },
    offset: {
        x: -50,
        y: 0,
    },
    imageSrc: './img/kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167
    },
    sprites: {
        idle: {
            imageSrc: `./img/kenji/Idle.png`,
            framesMax: 4
        },
        run: {
            imageSrc: `./img/kenji/Run.png`,
            framesMax: 8
        },
        jump: {
            imageSrc: `./img/kenji/Jump.png`,
            framesMax: 2
        },
        fall: {
            imageSrc: `./img/kenji/Fall.png`,
            framesMax: 2
        },
        attack1: {
            imageSrc: `./img/kenji/Attack1.png`,
            framesMax: 4
        },
        takeHit: {
            imageSrc: `./img/kenji/Take Hit.png`,
            framesMax: 3
        },
        death: {
            imageSrc: `./img/kenji/Death.png`,
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -170,
            y: 50
        },
        width: 170,
        height: 50,
    },
    damage: 4,
    dashCooldown: 3
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false 
    },
    ArrowRight: {
        pressed: false 
    },
    ArrowUp: {
        pressed: false 
    }
}

var coolingDownPlayer = false;
var coolingDownEnemy = false;

function animate() {
    requestAnimationFrame(animate);   
    cp();
    c.fillStyle = "black";
    c.fillRect(0,0,canvas.width, canvas.height) 
    background.update();
    shop.update();
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // player movement
    
    if(keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5;
        player.switchSprite('run')
    } else if(keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5;
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }
    //jumping

    if(player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if(player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    // enemy movement
    if(EnemyControllable && keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5;
        enemy.switchSprite('run')
    } else if(EnemyControllable && keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5;
        enemy.switchSprite('run')
    } else if(EnemyControllable) {
        enemy.switchSprite('idle')
    }

    //jumping

    if(EnemyControllable && enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if(EnemyControllable && enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    dash();
    var healthDecreasing = false;

    //detect for collision
    if(
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) && player.isAttacking && player.frameCurrent === 4
    ) {
        if(!enemy.dead) {
            crit(player)
        }
        enemy.takeHit(player.damage)
        player.isAttacking = true
        healthDecreasing = true;
        document.querySelector('#enemyHealth').style.width = enemy.health + '%';
        healthDecreasing = false;
    }
    //if player misses
    if(player.isAttacking && player.frameCurrent === 4) {
        player.isAttacking = false
    }

    //collision
    if(rectangularCollision({
        rectangle1: enemy,
        rectangle2: player,
    }) && enemy.isAttacking && enemy.frameCurrent === 1) {
        if(!player.dead) {
            crit(enemy)
        }
        player.takeHit(enemy.damage);
        enemy.isAttacking = false;
        healthDecreasing = true;
        document.querySelector('#playerHealth').style.width = player.health + '%';
        healthDecreasing = false;
    }
    //if enemy misses
    if(enemy.isAttacking && enemy.frameCurrent === 1) {
        enemy.isAttacking = false
    }

    // end game
    if(!healthDecreasing && enemy.health <= 0 || player.health <= 0) {
        determineWinner({player,enemy, timerId})
    }
}

function start(type) {
    if(type === 'pvp') {
        EnemyControllable = true;
    }else {
        EnemyControllable = false;
    }
    document.querySelector('.mainScreen').style.display = 'none'
    animate();
    decreaseTimer();
}

window.onload = () => {
    var buttonPvp = document.createElement('button');
    buttonPvp.innerHTML = 'PvP';
    buttonPvp.classList.add('pvpBut')
    document.querySelector('.mainScreen').appendChild(buttonPvp);

    buttonPvp.onclick = () => {
        start('pvp')
    }

    var buttonPva = document.createElement('button');
    buttonPva.innerHTML = 'PvA';
    buttonPva.classList.add('pvABut')
    document.querySelector('.mainScreen').appendChild(buttonPva);

    buttonPva.onclick = () => {
        start('pva')
    }
}

var EnemyControllable = true;

function keyCheck(key) {
    if(!player.dead) {
        switch(key) {
            case 'd':
            keys.d.pressed = true;
            player.lastKey = 'd'
            if(!addedRight) {
                TimesPressRight++;
                addedRight = true
            }
            break
            case 'a':
            keys.a.pressed = true;
            player.lastKey = 'a'
            if(!addedLeft) {
                TimesPressLeft++;
                addedLeft = true
            }
            break 
            case 'w':
            if(player.canJump) {
                player.velocity.y = -20;
                player.canJump = false;
            }
            break
            case ' ':
            player.attack();
            break 
        }
    }
    if(!enemy.dead && EnemyControllable) {
        switch(key) {
            case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            enemy.lastKey = 'ArrowRight'
            if(!addedRightEnemy) {
                TimesPressRightEnemy++;
                addedRightEnemy = true
            }
            break
            case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = 'ArrowLeft'
            if(!addedLeftEnemy) {
                TimesPressLeftEnemy++;
                addedLeftEnemy = true
            }
            break 
            case 'ArrowUp':
            if(enemy.canJump) {
                enemy.velocity.y = -20;
                enemy.canJump = false;
            }
            break 
            case 'ArrowDown':
            enemy.attack();
            break 
        }
    }
}

function keyCheckDown(key) {
    switch(key) {
        case 'd':
        keys.d.pressed = false;
        addedRight = false;
        setTimeout(() => {
            TimesPressRight = 0;
        }, 200)
            
        break
        case 'a':
        keys.a.pressed = false;
        addedLeft = false;
        setTimeout(() => {
            TimesPressLeft = 0;
        }, 200)
        break 
        case 'w':
        keys.w.pressed = false;
        break 
    }

    //Enemy Keys
    switch(key) {
        case 'ArrowRight':
        keys.ArrowRight.pressed = false;
        addedRightEnemy = false;
        setTimeout(() => {
            TimesPressRightEnemy = 0;
        }, 200)
        break
        case 'ArrowLeft':
        keys.ArrowLeft.pressed = false;
        addedLeftEnemy = false;
        setTimeout(() => {
            TimesPressLeftEnemy = 0;
        }, 200)
        break 
        case 'w':
        keys.ArrowUp.pressed = false;
        break 
    }
}


window.addEventListener('keydown', (event) => {
    keyCheck(event.key);
})

window.addEventListener('keyup', (event) => {
    keyCheckDown(event.key)
})

const controlButtons = ['topBut', 'leftBut', 'rightBut', 'botBut', 'fightBut'];

controlButtons.forEach((array) => {
    document.querySelector('.'+array).ontouchstart = () => {
        switch(array) {
            case 'topBut':
            keyCheck('w')
            break
            case 'leftBut':
            keyCheck('a')
            break
            case 'rightBut':
            keyCheck('d')
            break
            case 'botBut':
            keyCheck('s')
            break
            case 'fightBut':
            player.attack();
            break
        }
    }

    document.querySelector('.'+array).ontouchend = () => {
        switch(array) {
            case 'topBut':
            keyCheckDown('w')
            break
            case 'leftBut':
            keyCheckDown('a')
            break
            case 'rightBut':
            keyCheckDown('d')
            break
            case 'botBut':
            keyCheckDown('s')
            break
        }
    }
})


