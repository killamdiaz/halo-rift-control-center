const { app, BrowserWindow } = require('electron');
const path = require('path');

let splash, mainWindow;

function createWindow() {
  // Splash window
  splash = new BrowserWindow({
    width: 300,
    height: 300,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
  });
  splash.loadFile(path.join(__dirname, 'splash.html'));

  // Main window (hidden initially)
  mainWindow = new BrowserWindow({
    width: 945,
    height: 632,
    show: false,
    webPreferences: {
      nodeIntegration: false,
    }
  });

  mainWindow.loadURL('http://localhost:8080');

  // Once React is ready, show main & close splash
  mainWindow.webContents.on('did-finish-load', () => {
    setTimeout(() => { // optional delay to look cool
      splash.close();
      mainWindow.show();
    }, 1500);
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});