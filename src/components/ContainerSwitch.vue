<template>
    <div>
        <v-switch
        v-model="running"
        v-on:change="changeRunning()" 
        :label="`Gateway is ${running ? 'up' : 'down'}`"
        color="black"
        ></v-switch>

        <loading :active.sync="isLoading" 
            :can-cancel="false"
            :is-full-page="false"></loading>
    </div>
</template>

<script>
    const exec = require('child_process').exec;
    // Import loading component
    import Loading from 'vue-loading-overlay';
    // Import loading stylesheet
    import 'vue-loading-overlay/dist/vue-loading.css';

  export default {
    name: 'ContainerSwitch',

    components: {
        Loading
    },

    data() {
        return {
            running: false,
            isLoading: false
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
        },
        changeRunning() {
            // called whenever the switch changes
            this.isLoading = true
            if (this.running) {
                exec("docker-compose -f gateway/docker-compose.yml up --build -d", (error, data, getter) => {
                    if (error) {
                        console.log("error", error.message);
                        this.running = false
                        this.isLoading = false
                        return;
                    }
                    if (getter) {
                        console.log(data)
                        this.isLoading = false
                        return;
                    }
                    console.log("compose up", data);
                    this.isLoading = false
                });
            } else{
                exec("docker-compose -f gateway/docker-compose.yml down --rmi all", (error, data, getter) => {
                    if (error) {
                        console.log("error", error.message);
                        this.running = true
                        this.isLoading = false
                        return;
                    }
                    if (getter) {
                        console.log(data)
                        this.isLoading = false
                        return;
                    }
                    console.log("compose down", data);
                    this.isLoading = false
                });
            } 
        } 
    },

    mounted() {
        this.checkDocker();
    } 
  }
</script>
