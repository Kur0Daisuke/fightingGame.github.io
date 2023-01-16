const images = [
    "img/kenji/Attack1.png",
    "img/kenji/Attack2.png",
    "img/kenji/Death.png",
    "img/kenji/Fall.png",
    "img/kenji/Idle.png",
    "img/kenji/Jump.png",
    "img/kenji/Run.png",
    "img/kenji/Take hit.png",
    
    "img/samuraiMack/Attack1.png",
    "img/samuraiMack/Attack2.png",
    "img/samuraiMack/Death.png",
    "img/samuraiMack/Fall.png",
    "img/samuraiMack/Idle.png",
    "img/samuraiMack/Jump.png",
    "img/samuraiMack/Run.png",
    "img/samuraiMack/Take hit.png",

    "img/background.png"
]



function loadAllImages() {
    let image = [];
    let loadedImages = []
    for (let i = 0; i < images.length; i++) {
        let imageContainer = new Image();
        imageContainer.src = images[i]
        image.push(imageContainer)
    }
    return new Promise((resolve) => {
        const check = () => {
            if(loadedImages.length == image.length) {
                resolve()
                document.querySelector(".loading").style.display = "none"
            }
        }
        image.forEach((e,i) => {
            loadedImages.push(e)
            e.onload = () => {
                check()
            }
        })
    })
}

const audios = {
    slash: new Audio(),
    hit: new Audio(),
    jump: new Audio(),
}
audios.slash.src = "sfx/slash.mp3"
audios.hit.src = "sfx/hit.mp3"
audios.jump.src = "sfx/jump.mp3"