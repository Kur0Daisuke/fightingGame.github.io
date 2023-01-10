
class CutScene{
    constructor(p1, p2) {
        this.players = [p1,p2]
        this.started = false
    }
    reposition(destination) {
        let array = destination
        return new Promise((resolve) => {
            const loop = (p1To = "all", p2To = "all") => {
                var dir1 = "";
                var dir2 = "";
                if(this.players[0].x >= array[0].x && p1To == "left" ||
                this.players[0].x >= array[0].x && p1To == "all") {
                    this.players[0].sprite.changeSprite("Run")
                    this.players[0].x -= this.players[0].speed
                    dir1 = "left"
                    
                }else if(this.players[0].x <= array[0].x && p1To == "right" ||
                this.players[0].x <= array[0].x && p1To == "all") {
                    this.players[0].sprite.changeSprite("Run")
                    this.players[0].x += this.players[0].speed
                    dir1 = "right"
                }else {
                    this.players[0].sprite.changeSprite("Idle")
                }
    
                if(this.players[1].x >= array[1].x && p2To == "left" ||
                this.players[1].x >= array[1].x && p2To == "all") {
                    this.players[1].sprite.changeSprite("Run")
                    this.players[1].x -= this.players[1].speed
                    dir2="left"
                    
                }else if(this.players[1].x <= array[1].x && p2To == "right" ||
                this.players[1].x <= array[1].x && p2To == "all") {
                    this.players[1].sprite.changeSprite("Run")
                    this.players[1].x += this.players[1].speed
                    dir2="right"
                }else {
                    this.players[1].sprite.changeSprite("Idle")
                    resolve()
                    return
                }
    
                requestAnimationFrame(() => {
                    loop(dir1,dir2)
                })
            }
            loop()
        })
        
    }
    async start(dialogue,repositioning = false) {
        if(this.started) { return }
        const dialogueClass = new Dialogues(dialogue,this.players[0],this.players[1])
        this.players.forEach((e) => {
            e.cutSceneOnGoing = true
        })
        this.started = true
        if(repositioning) {
            await this.reposition(repositioning)
            dialogueClass.start()
        }
    }
    
}



// class Dialogues{
//     constructor(dialogues,p1,p2) {
//         this.dialogues = dialogues;
//         this.dialogueBoxp1 = document.createElement("div")
//         this.dialogueBoxp2 = document.createElement("div")
//         this.p1 = p1;
//         this.p2 = p2;
//         this.index = 0
//     }
//     start() {
//         console.log(this.dialogues)
//     }
// }