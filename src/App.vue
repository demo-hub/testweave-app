<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://www.arweave.org/nav-logo.svg"
          transition="scale-transition"
          width="200"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://www.arweave.org/nav-logo.svg"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <v-switch
      v-model="running"
      :label="`Gateway is ${running ? 'up' : 'down'}`"
      color="black"
    ></v-switch>
    </v-main>
  </v-app>
</template>

<script>
const exec = require('child_process').exec;

export default {
  name: 'App',

  components: {

  },

  data() {
    return {
      running: false,
      switchChanges: 0
    }
  },

  watch:{
    running(value) {
      // called whenever the switch changes
      if (this.switchChanges > 0){
        if (value) {
          exec("docker-compose -f gateway/docker-compose.yml up --build -d", (error, data, getter) => {
              if (error) {
                  console.log("error", error.message);
                  this.running = false
                  return;
              }
              if (getter) {
                console.log(data)
                return;
              }
              console.log("compose up", data);
          });
        } else{
          exec("docker-compose -f gateway/docker-compose.yml down --rmi all", (error, data, getter) => {
              if (error) {
                  console.log("error", error.message);
                  this.running = true
                  return;
              }
              if (getter) {
                console.log(data)
                return;
              }
              console.log("compose down", data);
          });
        } 
      }  

      this.switchChanges++
    } 
  },

  methods: {
    checkDocker() {
      exec("docker ps -q -f name=gateway_server_1", (error, data, getter) => {
        if (error) {
            console.log("error", error.message);
            return;
        }
        if (getter) {
          if (data) {
            this.running = true
          } else {
            this.running = false
          } 
          return;
        }
        if (data) {
          this.running = true
        } else {
          this.running = false
        }
        // console.log("build", data);
      });
    } 
  },

  mounted() {
    this.checkDocker();
  } 
};
</script>
