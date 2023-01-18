var keys = []

class Player{
    constructor(x,y,canvas,ctx,type) {
        this.x = x
        this.y = type == "p1" ? y : y-3
        this.canvas = canvas
        this.ctx = ctx
        this.type = type
        this.src = this.type == "p1" ? "img/samuraiMack" : "img/kenji" 
        this.sprite = new Sprite(
            this.src,this.ctx,this.type
        )
        this.speed = 2 / this.sprite.animSpeedMultiply;
        this.velocity = 0;
        this.actionBlock = false
        this.canAttack = true
        this.canJump = true
        this.combo = 0;
        this.hitBox = {
            width: 30,
            height: 50,
            Modifier: {
                x: -15,
                y: -25
            }
        }
        this.attackRange = {
            width: 50,
            height: 30,
            Modifier: {
                x: this.type == "p1" ? 30 : -80,
                y: -20
            }
        }
        this.inputToCheck=this.type == "p1" ? ["a","d","g", "w"] : ["ArrowLeft","ArrowRight","Enter", "ArrowUp"];
        this.damage = this.type == "p1" ? 10 : 5
        this.index = this.type == "p1" ? 1 : 0;
        this.velocity = 0;
        this.isJumping = false
        this.acceleration = 1;
        this.health = 100;
        this.death = false
        this.cutSceneOnGoing = false
        this.AmountToDash = {direction:"none", amount:0}
        this.dir = "right";
        this.dashAvailableLeft = 0
        this.dashClicked = false
        this.dashDelay = false
        this.dashAvailableRight = 0
        this.dashstarting= false;
    }
    collisionDetect() {
        let oponentBox = players[this.index]
        //collision detection
        if((this.x+this.attackRange.Modifier.x) < (oponentBox.x+oponentBox.hitBox.Modifier.x) + oponentBox.hitBox.width &&
        (this.x+this.attackRange.Modifier.x) + this.attackRange.width > (oponentBox.x+oponentBox.hitBox.Modifier.x) &&
        (this.y+this.attackRange.Modifier.y) < (oponentBox.y+oponentBox.hitBox.Modifier.y) + oponentBox.hitBox.height &&
        this.attackRange.height + (this.y+this.attackRange.Modifier.y) > (oponentBox.y+oponentBox.hitBox.Modifier.y) && !oponentBox.death) {
            return true
        }else {
            return false
        }
    }
    async attack() {
        
        this.canAttack = false
        this.actionBlock = true
        let spritechoose = this.combo == 0 ? "Attack1" : "Attack2" 
        audios.slash.pause();
        audios.slash.currentTime = 0;
        audios.slash.play()
        console.log(this.sprite.sprite)
        this.sprite.changeSprite(spritechoose)
        
        await this.sprite.waitToResolve(spritechoose)
        if(this.collisionDetect() && !players[this.index].death && !this.death) {
            console.log("attack")
            players[this.index].getHit(this.damage)
            players[this.index].sprite.hitMark()
            extensions.shake(600)
            if(players[this.index].health <= 0) {
                players.forEach((e) => {
                    e.sprite.animSpeedMultiply += 3
                })
            }
            
        }
        // console.log(this.sprite.sprite)
        this.canAttack = true
        this.actionBlock = false
        //double slicing algorithm
        
        if(this.combo == 1) {
            this.combo = 0
            console.log(this.combo)
        }else {
            this.combo++
            setTimeout(() => {
                this.combo = 0
            }, 1000)
        }
        
    }
    async getHit(dmg) {
        audios.hit.pause();
        audios.hit.currentTime = 0;
        audios.hit.play()
        this.health -= dmg
        document.querySelector(`.${this.type}`).querySelector(".health").style.width = `${this.health}%`
        !this.canAttack || (this.actionBlock = true);

        !this.canAttack || await this.sprite.waitToResolve("Take Hit")
        if(this.health <= 0) {
            this.death = true;
            this.sprite.death = true;
            window.winner = this.type == "p1" ? {name:"player 2", target:players[0]} : {name:"player 1", target:players[0]}
            return
        }
        !this.canAttack || (this.actionBlock = false)
        !this.canAttack || this.sprite.changeSprite("Idle")
        
    }

    async Jump() {
        audios.jump.pause();
        audios.jump.currentTime = 0;
        audios.jump.play()
        const addUp = () => {
            return new Promise((resolve) => {
                this.acceleration = 0
                let add = (vecolity) => {
                    if(30 <= this.y) {
                        this.y -= 1;
                        setTimeout(() => {
                            add()
                        }, 3)
                    }else {
                        this.velocity = 0
                        this.acceleration = 1
                        resolve()
                    }
                }
                add(1)
            })
        }
        addUp()
        !this.canAttack || (this.sprite.changeSprite("Jump"))
        !this.canAttack || (this.actionBlock = true);
        !this.canAttack || (this.sprite.actionBlock = true)
        await addUp();
        !this.canAttack || (this.sprite.actionBlock = false);
        !this.canAttack || this.sprite.changeSprite("Idle")  
        !this.canAttack || (this.actionBlock = false)
    }
    Dash(){
        if(this.dashstarting == true) {return}
        this.dashDelay = true;
        
        this.dashstarting = true
        const incrementX = (time=0) => {
            this.sprite.changeSprite("Run")
            this.actionBlock = true
            let timeCheck = time
            if(timeCheck == 10) {
                this.actionBlock = false
                this.dashstarting=false
                setTimeout(() => {
                    this.dashDelay = false
                }, 2000)
                return
            }
            if(this.dir == "right") {
                this.x+=this.speed+2;
            }else if(this.dir == "left") {
                this.x-=this.speed+2;
            }
            
            requestAnimationFrame(() => {incrementX(timeCheck+=1)});
        }
        incrementX()
        console.log("dash")
    }

    render() {
        // this.ctx.fillRect((this.x+this.attackRange.Modifier.x),(this.y+this.attackRange.Modifier.y),this.attackRange.width,this.attackRange.height)
        if(this.dashstarting) {
            this.ctx.globalAlpha = 0.5
            if(this.dir == "right") {
                this.sprite.draw(this.x-10,this.y,200,200)
                this.sprite.draw(this.x-20,this.y,200,200)
            }else if(this.dir == "right") {
                this.sprite.draw(this.x+20,this.y,200,200)
                this.sprite.draw(this.x+30,this.y,200,200)
            }
            
        }
        this.ctx.globalAlpha = 1
        this.sprite.draw(this.x,this.y,200,200)
        
    }
    move() {
        if(this.cutSceneOnGoing) return
        if(this.dashAvailableRight >= 2) {
            this.Dash()
        }if(this.dashAvailableLeft >= 2) {
            this.Dash()
        }else if(keys[this.inputToCheck[2]] && this.canAttack && !this.death && !players[this.index].death) {
            this.attack()
        }else if(keys[this.inputToCheck[1]] && !this.death && !players[this.index].death) {
            
            this.x += this.speed
            this.dir = "right"
            this.sprite.changeSprite("Run")
            if(!this.dashClicked && !this.dashDelay) {
                this.dashAvailableRight += 1;
                this.dashClicked = true
                setTimeout(() => {this.dashAvailableRight=0},500)
            }
        }else if(keys[this.inputToCheck[0]] && !this.death && !players[this.index].death) {
            this.x -= this.speed
            this.dir = "left"
            if(!this.dashClicked && !this.dashDelay) {
                this.dashAvailableLeft += 1;
                this.dashClicked = true
                setTimeout(() => {this.dashAvailableLeft=0},500)
            }
            this.sprite.changeSprite("Run")
        }else if(!this.actionBlock && !this.death) {
            this.dashClicked = false
            this.sprite.changeSprite("Idle")
        }
        if(keys[this.inputToCheck[3]] && this.canJump && !this.death && !players[this.index].death) {
            this.Jump()
        }
        //gravity
        if(this.type == "p1" ? this.y < yLimit : this.y < yLimit-3) {
            this.sprite.changeSprite("Fall")
            this.y += this.velocity;
            this.velocity += this.acceleration;
            this.canJump = false
        }else if(!this.isJumping) {
            this.y = this.type == "p1" ? yLimit : yLimit-3
            this.velocity = 0
            this.canJump = true
        }
    }

}

