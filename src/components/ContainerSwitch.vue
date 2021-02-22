<template>
    <v-switch
      v-model="running"
      v-on:change="changeRunning()" 
      :label="`Gateway is ${running ? 'up' : 'down'}`"
      color="black"
    ></v-switch>
</template>

<script>
    const exec = require('child_process').exec;

  export default {
    name: 'ContainerSwitch',

    data() {
        return {
            running: false
        }
    },

    watch:{
         
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
        },
        changeRunning() {
            // called whenever the switch changes
            if (this.running) {
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
    },

    mounted() {
        this.checkDocker();
    } 
  }
</script>
