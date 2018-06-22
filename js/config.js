const jsonfile = require('jsonfile');
let file = 'config.json';
let configElement = document.getElementById("settingsForm");

jsonfile.readFile(file, function(err, obj) {
    configElement.closeToTray.checked = obj.closeToTray;
    configElement.debugMode.checked = obj.debug;
    configElement.searchInterval.value = obj.searchInterval;
    console.dir(obj)
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