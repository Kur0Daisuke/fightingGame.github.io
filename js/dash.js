var TimesPressLeft = 0;
var TimesPressRight = 0;

let addedRight = false
let addedLeft = false

var TimesPressLeftEnemy = 0;
var TimesPressRightEnemy = 0;

let addedRightEnemy = false
let addedLeftEnemy = false

function dash() {
    var dashAvailable = document.querySelector('.playereffect');
    var dashAvailableEnemy = document.querySelector('.enemyeffect');
    if(!coolingDownPlayer) {
        dashAvailable.src = './img/effects/Dash-available.png';
    }else {
        dashAvailable.src = './img/effects/Dash-unavailable.png';
    }

    if(!coolingDownEnemy) {
        dashAvailableEnemy.src = './img/effects/Dash-available.png';
    }else {
        dashAvailableEnemy.src = './img/effects/Dash-unavailable.png';
    }

    //dash player
    if(!coolingDownPlayer && TimesPressRight === 2) {
        player.velocity.x += 25;
        setTimeout(() => {
            coolingDownPlayer = true;
            setTimeout(() => {
                coolingDownPlayer = false;
            }, 700)
        }, 200)
        
    }

    if(!coolingDownPlayer && TimesPressLeft === 2) {
        player.velocity.x += -25;
        setTimeout(() => {
            coolingDownPlayer = true;
            setTimeout(() => {
                coolingDownPlayer = false;
            }, 700)
        }, 200)
    }
    //dash enemy
    if(!coolingDownEnemy && TimesPressRightEnemy === 2) {
        enemy.velocity.x += 25;
        setTimeout(() => {
            coolingDownEnemy = true;
            setTimeout(() => {
                coolingDownEnemy = false;
            }, 700)
        }, 200)
    }

    if(!coolingDownEnemy && TimesPressLeftEnemy === 2) {
        enemy.velocity.x += -25;
        setTimeout(() => {
            coolingDownEnemy = true;
            setTimeout(() => {
                coolingDownEnemy = false;
            }, 700)
        }, 200)
    }
}