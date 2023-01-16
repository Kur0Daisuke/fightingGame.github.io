const canvas = document.querySelector(".mainScreen");
canvas.width = Math.floor(innerWidth/5);
canvas.height = Math.floor(innerHeight/5);
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
    }
    draw() {
        this.ctx.drawImage(this.sprite1,
            0+cameraMultiplier.x,
            0+cameraMultiplier.y,
            canvas.clientWidth/5,
            canvas.clientHeight/5)

        this.ctx.drawImage(this.sprite2,
            canvas.clientWidth/5+cameraMultiplier.x,
            0+cameraMultiplier.y,
            canvas.clientWidth/5,canvas.clientHeight/5)

        this.ctx.drawImage(this.sprite3,(-canvas.clientWidth/5)+cameraMultiplier.x,0+cameraMultiplier.y,canvas.clientWidth/5,canvas.clientHeight/5)

        
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

const wait = async  () => {
    await loadAllImages()
    console.log("loaded")
    main()
}
wait()
function main() {
    ctx.imageSmoothingEnabled = false;
    foreGround.draw()
    players.forEach((e) => {
        e.render()
        e.move()
    })

    requestAnimationFrame(main)
}

window.addEventListener("keydown", (e) => {
    keys[e.key] = true
})

window.addEventListener("keyup", (e) => {
    keys[e.key] = false
})

window.addEventListener('resize', () => {
    canvas.width = Math.floor(innerWidth/5);
    canvas.height = Math.floor(innerHeight/5);
})

function rematch() {
    location.reload();
}