
function restart() {
    timer = 60;
    decreaseTimer();
    restarted = true;
    player.position.x = 50;
    player.position.y = 0;
    player.health = 100;

    enemy.position.x = 900;
    enemy.position.y = 0;
    enemy.health = 100;

    document.querySelector('#EndScreen').style.display = 'none'
    document.querySelector('#EndScreen-button').style.display = 'none'
    document.querySelector('#playerHealth').style.width = '100%'
    document.querySelector('#enemyHealth').style.width = '100%'
}