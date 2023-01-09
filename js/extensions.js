class Extensions{
    constructor(canvas) {
        this.canvas = canvas;
        this.minimax = {
            x: 0.5,
            y: 0.5
        }
        this.multiply = 1;
    }
    shake(time) {
        let inititalValueX = cameraMultiplier.x
        let inititalValueY = cameraMultiplier.y
        let shake = setInterval(() => {
            let randomX = Math.ceil(Math.random() * this.minimax.x) * (Math.round(Math.random()) ? 1 : -1)
            let randomY = Math.ceil(Math.random() * this.minimax.y) * (Math.round(Math.random()) ? 1 : -1)
            cameraMultiplier.x = randomX;
            cameraMultiplier.y = randomY;
            
        }, 100)
        setTimeout(() => {
            cameraMultiplier.x = inititalValueX;
            cameraMultiplier.y = inititalValueY;
            clearInterval(shake)
        }, time)
    }
}