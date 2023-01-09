let lastKey

function rectangularCollision({rectangle1, rectangle2}) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= 
        rectangle2.position.x && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= 
        rectangle2.position.y && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
        )
}

function determineWinner({player, enemy, timerId}) {
    clearTimeout(timerId)
    document.querySelector('#EndScreen').style.display = 'flex'
    document.querySelector('#EndScreen-button').style.display = 'flex'
    if(player.health === enemy.health) {
        document.querySelector('#EndScreen').innerHTML = 'Tie'
    }else if(player.health > enemy.health) {
        enemy.switchSprite('death')
        document.querySelector('#enemyHealth').style.width = '0%';
        document.querySelector('#EndScreen').innerHTML = 'PLayer1 Won!'
    }else if(player.health < enemy.health) {
        player.switchSprite('death')
        document.querySelector('#playerHealth').style.width = '0%';
        document.querySelector('#EndScreen').innerHTML = 'PLayer2 Won!'
    }
}

let timer = 60;
let timerId;
function decreaseTimer() {

    if(timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000);
        timer--
        document.querySelector("#timer").innerHTML = timer;
    }

    if (timer === 0) {
        determineWinner({player,enemy,timerId})
    }
}

function timeout({todo, sec}) {
    setTimeout(() => {
        todo
        console.log('lol')
    }, sec)
}