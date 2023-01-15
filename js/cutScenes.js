class Dialogues{
    constructor(dialogues, pos,delay,type) {
        this.dialogues = dialogues;
        this.dialogueBoxp1 = document.createElement("div")
        this.dialogueBoxp2 = document.createElement("div")
        this.pos = pos
        this.delay = delay
        this.ui = document.querySelector(".inGame_ui");
        this.type = type;
    }
    popups () {
        
    }
    render() {
        console.log()
        this.dialogueBoxp1.classList.add("dialogue")
        this.dialogueBoxp2.classList.add("dialogue")
        
        if(this.type == "onPlayers") {
            this.dialogueBoxp1.style.setProperty("--top",`${this.pos[0].y}px`)
            this.dialogueBoxp1.style.setProperty("--left",`${parseInt((this.pos[0].x/canvas.clientWidth)*100)}%`)

            this.dialogueBoxp2.style.setProperty("--top",`${this.pos[1].y}px`)
            this.dialogueBoxp2.style.setProperty("--left",`${parseInt((this.pos[1].x/canvas.clientWidth)*400)}%`)
        }else {
            this.dialogueBoxp1.classList.add("narrate")
        }
        
        return new Promise((resolve) => {
            const dialogueShow = (currentIndex=0) => {
                let time = 0;
                this.ui.innerHTML = "";
                if(currentIndex == this.dialogues.length) {
                    resolve()
                    return;
                }
                
                let index = currentIndex
                let boxToShow = this.type == "onPlayers" ? (currentIndex%2==0? this.dialogueBoxp1:this.dialogueBoxp2) : this.dialogueBoxp1
                this.ui.appendChild(boxToShow);
                boxToShow.appendChild(document.createElement("p"))
                
                const animateText = () => {
                    return new Promise((resolve) => {
                        boxToShow.querySelector("p").innerHTML = ""
                        let timeout;
                        const end = () => {
                            boxToShow.querySelector("p").innerHTML = this.dialogues[index];
                            resolve()
                            clearInterval(timeout)
                            time = this.delay/2
                            return
                        }
                        const animate = (i=0) => {
                            if(i == this.dialogues[index].length) {resolve(); return}
                            boxToShow.querySelector("p").innerHTML += `${this.dialogues[index][i]}`
                            
                            timeout = setTimeout(() => {
                                animate(i+=1)
                            }, 50)
                        }
                        window.addEventListener('click',() => {
                            end()
                        })
                        window.addEventListener('keydown', (e) => {
                            if(e.key == " ") {
                                end()
                            }
                        })
                        animate()
                    })
                }
                const finish = async () => {
                    await animateText()
                    setTimeout(() => {
                        dialogueShow(index+=1)
                    },time == 0 ? this.delay : time)
                }
                finish()
            }
            dialogueShow()
        })
        console.log(this.dialogues,this.pos,this.delay)
    }
}

class CutScene{
    constructor(p1, p2) {
        this.players = [p1,p2]
        this.started = false
        this.currentJob = 0
    }
    Dialogues(dialogues) {
        return new Promise((resolve) => {
            if(dialogues.type == "onPlayers") {
                const dialogue = new Dialogues(dialogues.log,[
                    {x:this.players[0].x, y:this.players[0].y},
                    {x:this.players[1].x, y:this.players[1].y}],
                    dialogues.lineDelay,dialogues.type
                )
                const wait = async () => {
                    await dialogue.render()
                    resolve()
                }
                wait()
            }else if(dialogues.type == "Narrate") {
                const dialogue = new Dialogues(dialogues.log,null,
                    dialogues.lineDelay,dialogues.type
                )
                const wait = async () => {
                    await dialogue.render()
                    resolve()
                }
                wait()
            }
            // resolve()
        })
       
    }
    rePosition(pos) {
        return new Promise((resolve) => {
            const loop = (index) => {
                return new Promise((resolve) => {
                    const animate = (i=index,ope="all") => {
                        let operator = ope
                        
                        if(this.players[i].x > pos[i].x && ope == "greater" ||
                        this.players[i].x > pos[i].x && ope == "all") {
                           this.players[i].x -= this.players[i].speed;
                            operator = "greater"
                            
                            }else if(this.players[i].x == pos[i].x){
                            this.players[i].sprite.changeSprite("Idle")
                            resolve()
                            return
                        }
                        if(this.players[i].x < pos[i].x && ope == "lesser" ||
                            this.players[i].x < pos[i].x && ope == "all") {
                            this.players[i].x += this.players[i].speed;
                            operator = "lesser"
                        }else if(this.players[i].x == pos[i].x){
                            this.players[i].sprite.changeSprite("Idle")
                            resolve()
                             return
                        }
                        requestAnimationFrame(() => {
                            animate(i,operator)
                        })
                    }
                    setTimeout(() => {
                        this.players[index].sprite.changeSprite("Run")
                        animate()
                    }, !pos[index].delay ? 0 : pos[index].delay)
                })
            }
            const delay = () => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve()
                    },pos[pos.length-1].SceneDelay)
                })
                
            }
            const wait = async () => {
                await Promise.all([loop(0), loop(1)])
                await delay()
                resolve()
            }
            wait()
            
        })
    }
    async JobHandler(jobs) {
        if(this.currentJob == jobs.length) { 
            this.players.forEach((e) => {
                e.cutSceneOnGoing = false
            })
            return 
        }
        const jobType = jobs[this.currentJob].type;
        jobType == "position" ? await this.rePosition(jobs[this.currentJob].job) : await this.Dialogues(jobs[this.currentJob].job)
        
        this.currentJob++;
        this.JobHandler(jobs)
    }
    async start(serialJob) {
        if(this.started) { return }
        this.players.forEach((e) => {
            e.cutSceneOnGoing = true
        })
        this.JobHandler(serialJob)
    }
    
}


