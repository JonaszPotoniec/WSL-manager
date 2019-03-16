const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

let mainWindow;
var defaultWindowOpts = {width: 800, height: 600,  fullscreen: false, titleBarStyle: 'hidden'};
var myOpts = Object.assign({}, defaultWindowOpts, {
  titleBarStyle: 'hidden',
  overlayScrollbars: false
});

function createWindow () {
  mainWindow = new BrowserWindow(myOpts);
  mainWindow.setMenu(null);
  //mainWindow.openDevTools();
  mainWindow.loadURL(`file://${__dirname}/../html/index.html`);

  mainWindow.on('closed', function () {
    mainWindow = null
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  app.quit();
});
