const canvas = document.querySelector(".mainScreen");
const ctx = canvas.getContext("2d")


class ForeGround {
    constructor(src,ctx) {
        this.src = src
        this.ctx = ctx
        this.sprite1 = new Image();
        this.sprite1.src = `/img/${this.src}.png`;
        this.sprite2 = new Image();
        this.sprite2.src = `/img/${this.src}.png`;
        this.sprite3 = new Image();
        this.sprite3.src = `/img/${this.src}.png`;
    }
    draw() {
        this.sprite1.onload = () => {
            this.ctx.drawImage(this.sprite1,
                0+cameraMultiplier.x,
                0+cameraMultiplier.y,
                canvas.clientWidth/5,
                canvas.clientHeight/5)
        }
        this.sprite2.onload = () => {
            this.ctx.drawImage(this.sprite2,
                canvas.clientWidth/5+cameraMultiplier.x,
                0+cameraMultiplier.y,
                canvas.clientWidth/5,canvas.clientHeight/5)
        }
        this.sprite3.onload = () => {
            this.ctx.drawImage(this.sprite3,(-canvas.clientWidth/5)+cameraMultiplier.x,0+cameraMultiplier.y,canvas.clientWidth/5,canvas.clientHeight/5)
        }
        
            // console.log(this.sprite1.width)
    }
}

const players = [
    new Player(-50,103,canvas,ctx,"p1"),
    new Player(250,100,canvas,ctx,"p2")
]
var foreGround = new ForeGround("background", ctx)
var extensions = new Extensions(canvas)
var cutscene = new CutScene(players[0],players[1])

function main() {
    cutscene.main()
    ctx.imageSmoothingEnabled = false;
    foreGround.draw()
    players.forEach((e) => {
        e.render()
        e.move()
    })

    requestAnimationFrame(main)
}
main()
window.addEventListener("keydown", (e) => {
    keys[e.key] = true
})

window.addEventListener("keyup", (e) => {
    keys[e.key] = false
})

function rematch() {
    location.reload();
}