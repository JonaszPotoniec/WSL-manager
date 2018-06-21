const electron = require('electron');
const app = electron.app;
let tray = null;
const BrowserWindow = electron.BrowserWindow;
const manageDistros = require('./distrosManagementFunctions');

const path = require('path');
const url = require('url');

let iconpath = path.join(__dirname, '/../images/icon.ico');
let config = require(path.join(__dirname, '/../config.json'));

global.sharedObj = {distros: []};

let mainWindow;
let defaultWindowOpts = {width: 800, height: 600, fullscreen: false, titleBarStyle: 'hidden'};
let myOpts = Object.assign({}, defaultWindowOpts, {
    titleBarStyle: 'hidden',
    overlayScrollbars: false,
    icon: iconpath
});

function createTray(){
    tray = new electron.Tray(iconpath);

    manageDistros.refreshList(sharedObj, function() {
        tray.setContextMenu(trayContent());
    });
}

function trayContent(){
    var distrosOptions = [{
        label: "set default",
        submenu: []
    }];

    sharedObj.distros.forEach(function(element) {
        distrosOptions[0]["submenu"].push({
            label: String(element),
            click: function () {
                manageDistros.setDefault(String(element), function(){
                    manageDistros.refreshList(sharedObj, function(){
                        tray.setContextMenu(trayContent());
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
    mainWindow = new BrowserWindow(myOpts);
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

app.on('ready', function(){
    createWindow();
    createTray();
    if(config["searchInterval"])
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

