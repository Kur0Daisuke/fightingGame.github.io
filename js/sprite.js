var cameraMultiplier = {
    x: 0,
    y: 0,
}

class Sprite {
    constructor(src,ctx,type) {
        this.type = type;
        this.sprite = new Image();
        this.src = src;
        this.ctx = ctx;
        this.cellX = 0;
        this.loaded = false
        this.Currentsprite = "Idle"
        this.animationStarted = false
        this.actionBlock = false;
        this.animSpeedMultiply = 1;
        this.hitSprite = new Image();
        this.hitSprite.src = "img/effects/slash.png"
        this.x,this.y
        this.hitSpriteX = 0
        this.hitstarted = false
        this.death = false
        this.flags = {spriteLoaded:false,hitmarkLoaded:false}
    }
    draw(x,y,width,height) {
        this.sprite.onload = () => {this.flags.spriteLoaded = true}
        this.hitSprite.onload = () => {this.flags.hitmarkLoaded = true}

        this.sprite.src = `${this.src}/${this.Currentsprite}.png`
        this.x = x + cameraMultiplier.x;
        this.y = y + cameraMultiplier.y;
        !this.flags.spriteLoaded || this.ctx.drawImage(
            this.sprite, 
            this.cellX*200,0,
            200, 200,
            this.x-100, this.y-100,
            width,height
        )
        !this.flags.hitSprite && !this.hitstarted || this.ctx.drawImage(
            this.hitSprite, 
            this.hitSpriteX,0,
            100, 100,
            this.x-35,this.y-35,
            64,64
        )
        this.animationStarted || this.animate()
        
    }
    die() {
        this.changeSprite("Death")
        this.resetCell(0)
        var animateSelf = () => {
            if(this.cellX < (this.sprite.width/200)-1) {
                this.cellX++;
                setTimeout(() => {
                    animateSelf()
                }, (this.sprite.width/10) * this.animSpeedMultiply)
            }else {
                let endscene = new CutScene(players[0], players[1])
                endscene.start([
                    {
                        type: "dialogue",
                        job: {log:[`${this.type == "p1" ? "player2" : "player1"} : Told ya not to mess with me`],type: "Narrate",lineDelay: 1000}
                    }
                ])
                console.log(window.winner.target.sprite.x)
                var move = (flag="all") => {
                    if(window.winner.target.sprite.x < 150 && flag == "less" || window.winner.target.sprite.x < 150 &&  flag == "all") {
                        cameraMultiplier.x += 1;
                        setTimeout(() => {
                            move("less")
                        }, 1)
                    }if(window.winner.target.sprite.x > 150 && flag == "great" || window.winner.target.sprite.x > 150 &&  flag == "all") {
                        cameraMultiplier.x -= 1;
                        setTimeout(() => {
                            move("great")
                        }, 1)
                    }
                }
                move()
                document.querySelector(".endScreen").classList.add("pop")
                document.querySelector(".WinnerAnnouce").innerHTML = `${window.winner.name} wins`
                players.forEach((e) => {
                    e.sprite.animSpeedMultiply = 1;
                })
            }
        }
        animateSelf()
    }
    hitMark() {
        this.hitstarted = true
        const animate = (x) => {
            let cellX = x
            if(cellX == 288) {
                this.hitstarted = false;
                return
            }
            this.hitSpriteX = cellX
            setTimeout(() => {
                animate(cellX+96)
            }, 50 * this.animSpeedMultiply)
        }
        animate(0,0)
        
    }
    animate() {
        if(this.death) {
            this.die()
            return
        }
        this.animationStarted = true
        this.ctx.clearRect(0,0,window.innerWidth,window.innerHeight)
        if(this.cellX < (this.sprite.width/200)-1 && !this.RewindAnimation) {
            this.cellX += 1
        }else {
            this.cellX = 0
        }
        this.draw()
        setTimeout(() => {
            this.animate()
        }, (this.sprite.width/10) * this.animSpeedMultiply)
    }
    waitToResolve(spriteRef) {
        return new Promise((resolve) => {
            this.changeSprite(spriteRef)
            this.resetCell(0)
            this.actionBlock = true;

            var check = () => {
                if(this.cellX == (this.sprite.width/200)-1) {
                    this.actionBlock = false
                    resolve()
                }else {
                    setTimeout(() => {
                        check()
                    }, 0.5)
                }
            }
            check()
        })
        
    }
    changeSprite(sprite) {
        if(!this.actionBlock || this.death) {
            this.Currentsprite = sprite
            this.flags.spriteLoaded = false
        }else {
            return
        } 
    }
    resetCell(amount) {
        this.cellX = amount
    }
}