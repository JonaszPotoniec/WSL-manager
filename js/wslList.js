const nrc = require('node-run-cmd');
const remote = require('electron').remote;
const ipcRenderer = require('electron').ipcRenderer;

function refreshList(){
  return new Promise(function (fulfill, reject){
    nrc.run('wslconfig /l', { onData: function(data) {
      var dataArr = data.split(/\r?\n/);
      dataArr.splice(0, 1);
      dataArr.splice(-1, 1);
      dataArr.forEach(function(obj, index){
        Vue.set(wslListVue.distros, index, obj.replace(/[^a-zA-Z0-9_ /(/)/-]+/g, ""));
      })
      fulfill();
    }});
  })
}

function updateList() {
    refreshList().then(function(){
        if(wslListVue.distros.length === 0){
            document.getElementById("errHeader").innerHTML = "Couldn't find any WLS installed. Please install one from Windows Store"
        }
        remote.getGlobal('sharedObj').distros = wslListVue.distros;
        ipcRenderer.send("update", true)
    })
}

function refreshTrayIcon() {
    ipcRenderer.send("update", true);
}

function getDistroList() {
    return {
        "Renderer list": wslListVue.distros,
        "Main list": remote.getGlobal('sharedObj').distros
    };
}

let distroList = {
  props: ['name', 'id'],
  template: `
    <div class="box">
      <h1>{{name}}</h1> <button v-on:click="setDefault({name})" class="nice-btn green">set default</button> <button v-on:click="deleteDistr({name}, {id})" class="nice-btn red">delete</button>
    </div>
  `,
  methods: {
    setDefault: function(distrName){ console.log(distrName.name.replace(/(\(Default\))/g, ""))
      nrc.run("wslconfig /setdefault " + distrName.name.replace(/(\(Default\))/g, "")).then(function(exitCodes) {
        refreshList();
      }, function(err) {
        refreshList();
        console.log('Command failed to run with error: ', err);
      });
    },
    deleteDistr: function(distrName, id){
      if (confirm('Are you sure you want to delete ' + distrName.name + '?')) {
        nrc.run("wslconfig /unregister " + distrName.name.replace(/(\(Default\))/g, "")).then(function(exitCodes) {
          Vue.delete(wslListVue.distros, id.id);
          refreshList();
        }, function(err) {
          refreshList();
          console.log('Command failed to run with error: ', err);
        });
      }
    }
  }
};

Vue.component('distro-list', Vue.extend(distroList));

var wslListVue = new Vue({
  el: "#wslList",
  data: {
    distros: []
  },
  mounted: updateList()
});

ipcRenderer.on("update", function(){refreshList()})