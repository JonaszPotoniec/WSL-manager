var nrc = require('node-run-cmd');

function refreshList(){
  //wslListVue.distros.forEach(function(obj, index){if(index != 1) Vue.delete(obj);})
  //wslListVue.distros = [];
  nrc.run('wslconfig /l', { onData: function(data) {
    var dataArr = data.split(/\r?\n/);
    dataArr.splice(0, 1);
    dataArr.splice(-1, 1);
    dataArr.forEach(function(obj, index){
      Vue.set(wslListVue.distros, index, obj.replace(/[^a-zA-Z0-9_ /(/)/-]+/g, ""));
    })
  }});
}

let distroList = {
  props: ['name', 'id'],
  template: `
    <div class="box">
      <h1>{{name}}</h1> <div v-on:click="setDefault({name})" class="button" style="background-color: rgb(79, 121, 84)">set default</div> <div v-on:click="deleteDistr({name}, {id})" class="button" style="background-color: rgb(121, 79, 79)">delete</div>
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
}

Vue.component('distro-list', Vue.extend(distroList));

var wslListVue = new Vue({
  el: "#wslList",
  data: {
    distros: [0, 3]
  },
  mounted: function(){refreshList()}
})

// v-for="wsl in wslList"
