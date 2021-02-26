exports.setDefault = (distrName, callback) => {
    const nrc = require('node-run-cmd');
    nrc.run("wslconfig /setdefault " + distrName.replace(/(\(Default\))/g, "")).then(function(exitCodes) {
        callback()
    }, function(err) {
        console.log('Command failed to run with error: ', err);
    });
}

exports.refreshList = (obj, callback) => {
    const nrc = require('node-run-cmd');
    nrc.run('wslconfig /l', { onData: function(data) {
            var dataArr = data.split(/\r?\n/);
            dataArr.splice(0, 1);
            dataArr.splice(-1, 1);
            sharedObj.distros = [];

            dataArr.forEach(function(obj, index){
                console.log(obj);
                sharedObj.distros.push(obj.split("\u0000").join(""));
            })

        }}).then(function(){
        callback();
    });

};
