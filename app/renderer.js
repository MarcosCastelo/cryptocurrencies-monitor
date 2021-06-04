const { remote, ipcRenderer } = require('electron');
const mainProcess = remote.require('./main.js');

const mainCoin = document.getElementById('current-price');
const mainPercent = document.getElementById('current-percent');

const loopRequest = () => {
    setTimeout(() => {
        mainProcess.getCoinsData();
        loopRequest();
    }, 1000)
}

const setMainCoin = (price, percent) => {
    mainCoin.innerHTML = '$' + price
    if (percent > 0) {
        mainPercent.classList.remove("negative")
        mainPercent.classList.add("positive")
    } else {
        mainPercent.classList.add("negative")
        mainPercent.classList.remove("positive")
    }
    mainPercent.innerHTML = percent + '%';
}

ipcRenderer.on('coin-requested', (event, data) => {
    const bitcoin = data[0];
    setMainCoin(bitcoin.current_price, bitcoin.price_change_percentage_24h);

});

loopRequest();