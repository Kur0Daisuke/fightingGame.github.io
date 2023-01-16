const canvas = document.querySelector(".mainScreen");
const ctx = canvas.getContext("2d")


class ForeGround {
    constructor(src,ctx) {
        this.src = src
        this.ctx = ctx
        this.sprite1 = new Image();
        this.sprite1.src = `img/${this.src}.png`;

        this.sprite2 = new Image();
        this.sprite2.src = `img/${this.src}.png`;
        this.sprite3 = new Image();
        this.sprite3.src = `img/${this.src}.png`;
        this.flags = {image1Loaded:false,image2Loaded:false,image3Loaded:false}
    }
    draw() {
        this.sprite1.onload = () => {this.flags.image1Loaded = true}
        this.sprite2.onload = () => {this.flags.image2Loaded = true}
        this.sprite3.onload = () => {this.flags.image3Loaded = true}
        !this.flags.image1Loaded || this.ctx.drawImage(this.sprite1,
            0+cameraMultiplier.x,
            0+cameraMultiplier.y,
            canvas.clientWidth/5,
            canvas.clientHeight/5)

        !this.flags.image2Loaded || this.ctx.drawImage(this.sprite2,
            canvas.clientWidth/5+cameraMultiplier.x,
            0+cameraMultiplier.y,
            canvas.clientWidth/5,canvas.clientHeight/5)

        !this.flags.image2Loaded || this.ctx.drawImage(this.sprite3,(-canvas.clientWidth/5)+cameraMultiplier.x,0+cameraMultiplier.y,canvas.clientWidth/5,canvas.clientHeight/5)

        
            // console.log(this.sprite1.width)
    }
}

const players = [
    new Player(0,103,canvas,ctx,"p1"),
    new Player(300,100,canvas,ctx,"p2")
]
var foreGround = new ForeGround("background", ctx)
var extensions = new Extensions(canvas)
var cutscene = new CutScene(players[0],players[1])
const introDialogue = ["We meet again here huh?", "totally not surprised to see again", "enough wasting time talking\nlet's fight", "i got one thing to say tho,\nIts who?", "who what?", "WHO ASKED"]
cutscene.start([
    {
        type:"position",
        job:[
            {x:100},
            {x:250,delay:1000},
            {SceneDelay:600}
        ],
    },
    {
        type:"dialogue",
        job:{log:introDialogue,type:"onPlayers",lineDelay:1000}
    },
    {
        type:"position",
        job:[
            {x:50},{x:250},
            {SceneDelay: 500}
        ]
    },
    {
        type:"dialogue",
        job:{log:["Fight"],type:"Narrate",lineDelay:500}
    },
])

function main() {
    // cutscene.start(introDialogue, [{x:100,y:players[0].y},{x:250,y:players[1].y}])
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