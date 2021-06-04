const { app, BrowserWindow } = require('electron');
const path = require('path');
const electron = require('electron');
const CoinGecko = require('coingecko-api');

const CoinGeckoClient = new CoinGecko();

let mainWindow = null;

function createWindow() {
    const width = 320;
    const height = 50;
    
    let screenWidth = 0;
    let displays = electron.screen.getAllDisplays();

    for(var index in displays){
        screenWidth += displays[index].bounds.width;
    }

    const win = new BrowserWindow({
        x: (screenWidth - width) - 10,
        y: 10,
        width,
        height,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, 'app/preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            devTools: true,
        }
    });

    win.loadFile('app/index.html');
    win.setResizable(false);

    return win;
}

app.whenReady().then(() =>{
    mainWindow = createWindow();

    app.on('activate', function() {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
})


const getCoinsData = exports.getCoinsData = async() => {
    const data = await CoinGeckoClient.coins.markets({
        ids: ['bitcoin']
    });
    mainWindow.webContents.send('coin-requested', data.data)  ;
}