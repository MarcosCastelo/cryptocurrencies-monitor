const { app, BrowserWindow } = require('electron');
const path = require('path');
const electron = require('electron');

function createWindow() {
    const width = 300;
    const height = 75;
    
    let screenWidth = 0;
    let displays = electron.screen.getAllDisplays();

    for(var index in displays){
        screenWidth += displays[index].bounds.width;
    }

    const win = new BrowserWindow({
        x: (screenWidth - width),
        y: 0,
        width,
        height,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, 'app/preload.js'),
            nodeIntegration: true,
            enableRemoteModule: true,
        }
    });

    win.loadFile('app/index.html');
    win.setResizable(false);
}

app.whenReady().then(() =>{
    createWindow();

    app.on('activate', function() {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
})