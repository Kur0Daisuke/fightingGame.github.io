 function cp() {
	var destinationArrived = false;
	if(!EnemyControllable && !enemy.dead) {
		setTimeout(() => {
			if(!player.dead && player.position.x + 150 === enemy.position.x) {
				enemy.switchSprite('idle')
				enemy.attack()
				destinationArrived = true;
				return
			}
		}, 500)
		
		if(!EnemyControllable && keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
	        enemy.velocity.x = -5;
	        enemy.switchSprite('run')
	    } else if(!EnemyControllable && keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
	        enemy.velocity.x = 5;
	        enemy.switchSprite('run')
	    }

	    if(!EnemyControllable && enemy.velocity.y < 0) {
	        enemy.switchSprite('jump')
	    } else if(!EnemyControllable && enemy.velocity.y > 0) {
	        enemy.switchSprite('fall')
	    }

	    if(enemy.velocity.y === 0) {
	    	enemy.canJump = true;
	    }

		if(!player.dead && !destinationArrived && player.position.x + 150 < enemy.position.x) {
			setTimeout(() => {
				keys.ArrowLeft.pressed = true;
            	enemy.lastKey = 'ArrowLeft'
			}, 300)
			
		}
		if(!player.dead && !destinationArrived &&player.position.x + 150 > enemy.position.x) {
			setTimeout(() => {
				keys.ArrowRight.pressed = true;
	            enemy.lastKey = 'ArrowRight'
            }, 300)
		}

		if(!player.dead && player.position.y < enemy.position.y) {
			setTimeout(() => {
				if(enemy.canJump) {
                	enemy.velocity.y = -20;
                	enemy.canJump = false;
            	}
			}, 300)
		}
	}
}