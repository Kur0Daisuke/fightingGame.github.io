function crit(critOn) {
    var critText = document.querySelector('.text');
    var critTextContainer = document.querySelector('.textShower');
    var RandomChance = Math.floor(Math.random() * 10);
    if(RandomChance === 5) {
        if(critOn === player) {
            critTextContainer.classList.add("player")
        }else {
            critTextContainer.classList.add("enemy")
        }
        critOn.damage += 14
        critText.innerHTML = 'CRIT!'
        critText.classList.add('crited')

        setTimeout(() => {
            critText.innerHTML = ''
            critOn.damage = 5;
            critText.classList.remove('crited')
            critTextContainer.classList.remove("player")
            critTextContainer.classList.remove("enemy")
        }, 700)
    }
    console.log(RandomChance)
}