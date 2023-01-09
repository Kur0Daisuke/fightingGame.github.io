const introDialogue = ["We meet again here huh?", "totally not surprised to see again", "enough wasting time talking\nlet's fight", "i got one thing to say tho,\nIts who?", "who what?", "WHO ASKED"]
class CutScene{
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
        
        this.dialogue = new Dialogues(introDialogue,this.p1,this.p2,this)
        this.setUp = false
        this.stop = false
    }
    positionPlayers() {
        let reposition = () => {
             if(this.p1.x < 100) {
                this.p1.sprite.changeSprite("Run")
                this.p1.x += this.p1.speed;
            }else if(this.p1.x == 100) {
                this.p1.sprite.changeSprite("Idle")
                this.setUp || this.dialogue.setUp()
                this.setUp = true
            }
            if(this.p2.x > 200) {
                this.p2.sprite.changeSprite("Run")
                this.p2.x -= this.p2.speed;
            }else {
                 this.p2.sprite.changeSprite("Idle")
            }
        }
        reposition()
        
    }
    main() {
        
        if(this.stop) return
        this.p1.cutSceneOnGoing = true;
        this.p2.cutSceneOnGoing = true;
        this.positionPlayers()
    }
    
}



class Dialogues{
    constructor(dialogues,p1,p2,self) {
        this.dialogues = dialogues;
        this.dialogueBoxp1 = document.createElement("div")
        this.dialogueBoxp2 = document.createElement("div")
        this.p1 = p1;
        this.p2 = p2;
        this.index = 0
        this.self = self
    }
    async setUp() {
        this.dialogueBoxp1.classList.add("dialogue")
        this.dialogueBoxp2.classList.add("dialogue")
        this.dialogueBoxp1.style.setProperty("--left", "10%")
        this.dialogueBoxp2.style.setProperty("--left", "60%")
        this.dialogueBoxp1.style.setProperty("--top", "20%")
        this.dialogueBoxp2.style.setProperty("--top", "20%")
        await this.place()
        this.p1.cutSceneOnGoing = false;
        this.p2.cutSceneOnGoing = false;

    }
    place() {
        return new Promise((resolve) => {
            const animate = (index=0) => {
                let indexCheck = index
                document.querySelector(".inGame_ui").innerHTML = ""
                if(indexCheck == this.dialogues.length) {
                    this.self.stop = true;
                    document.querySelector(".ready").classList.add("popin")
                    document.querySelector(".ready").addEventListener("animationend", () => {
                        document.querySelector(".ready").classList.remove("popin")
                    })
                    resolve()
                    return
                }
                let key
                window.addEventListener("keydown", (e) => {
                    key = e.key;
                })
                
                let box = indexCheck%2==0 ? this.dialogueBoxp1 : this.dialogueBoxp2
                document.querySelector(".inGame_ui").appendChild(box)
                let text = document.createElement("p");
                box.appendChild(text);
                const addtext = (count=0) => {
                    let wordCount = count
                    if(key == " ") {
                        box.innerHTML = ""
                        animate(indexCheck+=1)
                        return
                    }
                    if(wordCount < this.dialogues[indexCheck].length) {
                        text.innerHTML += this.dialogues[indexCheck][wordCount];
                        setTimeout(() => {
                            addtext(wordCount+=1)
                        }, 50)
                    }else {
                        setTimeout(() => {
                            box.innerHTML = ""
                            animate(indexCheck+=1)
                        }, 500)
                        
                    }
                    
                }
                addtext()
            }
            animate()
            
        })
        
    }
}