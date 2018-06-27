const jsonfile = require('jsonfile');
let file = 'config.json';
let configElement = document.getElementById("settingsForm");

const defaultConfig = {
    "closeToTray": true,
    "debug": false,
    "searchInterval": "0"
};

jsonfile.readFile(file, function(err, obj) {
    if(err){
        console.error(err);
        console.log("Config file not found. Loading default settings");
        obj = defaultConfig;
    }

    configElement.closeToTray.checked = obj.closeToTray;
    configElement.debugMode.checked = obj.debug;
    configElement.searchInterval.value = obj.searchInterval;
});

function saveSettings () {
    jsonfile.writeFile(file, {
        closeToTray: configElement.closeToTray.checked,
        debug: configElement.debugMode.checked,
        searchInterval: configElement.searchInterval.value
    }, {spaces: 2}, function(err) {
        console.error(err)
    })
}