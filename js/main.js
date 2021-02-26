const jsonfile = require('jsonfile');
const electron = require('electron');
const app = electron.app;
let tray = null;
const BrowserWindow = electron.BrowserWindow;
const manageDistros = require('./distrosManagementFunctions');

const path = require('path');
const url = require('url');

let iconpath = path.join(__dirname, '/../images/icon.ico');

const configPath = 'config.json';
const defaultConfig = {
    "closeToTray": true,
    "debug": false,
    "searchInterval": "0"
};
let config = [];

global.sharedObj = {distros: []};

let mainWindow;
let windowOpts = {
  width: 800,
  height: 600,
  fullscreen: false,
  titleBarStyle: 'hidden',
  titleBarStyle: 'hidden',
  overlayScrollbars: false,
  icon: iconpath,
  webPreferences: {
      nodeIntegration: true
  }
};

function createTray(){
    tray = new electron.Tray(iconpath);

    updateTray()
}

function updateTray(){
    manageDistros.refreshList(sharedObj, function() {
        tray.setContextMenu(trayContent());
    });
}

function trayContent(){
    var distrosOptions = [{
        label: "Set default",
        submenu: []
    }];

    sharedObj.distros.forEach(function(element) {
        distrosOptions[0]["submenu"].push({
            label: String(element),
            click: function () {
                manageDistros.setDefault(String(element), function(){
                    manageDistros.refreshList(sharedObj, function(){
                        tray.setContextMenu(trayContent());
                        mainWindow.webContents.send("update", true);
                })});
            }
        });
    });

    var alwaysVisibleOptions = [
        {
          label: 'Refresh list',
          click: function() {
              manageDistros.refreshList(sharedObj, function() {
                  tray.setContextMenu(trayContent());
              });
          }
        },
        {
          type: "separator"
        },
        {
            label: 'Show App',
            click: function () {
                mainWindow.show();
                appIcon = null;
            }
        },
        {
            label: 'Quit',
            click: function () {
                app.isQuiting = true;
                app.quit()
            }
        }];

    return electron.Menu.buildFromTemplate(distrosOptions.concat(alwaysVisibleOptions));
}

function createWindow() {
    mainWindow = new BrowserWindow(windowOpts);
    mainWindow.setMenu(null);

    if(config["debug"])
        mainWindow.openDevTools();

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, '/../html/index.html'),
    }));

    mainWindow.on('close', function (event) {
        if (config["closeToTray"]) {
            if (!app.isQuiting) {
                event.preventDefault();
                mainWindow.hide();
            }

            return false;
        } else {
            mainWindow = null
        }
    });

}

try {
    throw jsonfile.readFileSync(configPath);
} catch (response) {
    if(response["code"] === "ENOENT") {
        console.log("Config file not found. Loading default settings");
        config = defaultConfig;
    }else{
        config = response;
    }
}


app.on('ready', function(){
    createWindow();
    createTray();
    if(config["searchInterval"] != 0)
        setInterval(function(){
            tray.setContextMenu(trayContent())
        }, config["searchInterval"]);
});

app.on('minimize', function (event) {
    event.preventDefault();
    mainWindow.hide();
});

app.on('window-all-closed', function () {
    app.quit()
});

electron.ipcMain.on("update", function(){updateTray()})
