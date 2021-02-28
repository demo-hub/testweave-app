<template>
    <div>
        <v-switch
        v-model="running"
        v-on:change="changeRunning()" 
        :label="`Testweave is ${running ? 'up' : 'down'}`"
        color="black"
        data-testid="gatSwitch"
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

    var sudo = require('sudo-prompt');
    var options = {
        name: 'Testweave'
    };

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
            exec("docker ps -q -f name=stoic_mcnulty", (error, data, getter) => {
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
                exec("docker pull lucaarweave/arweave-node:0.0.1 && docker run lucaarweave/arweave-node:0.0.1", (error, data, getter) => {
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
                exec("docker stop stoic_mcnulty", (error, data, getter) => {
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
        sudo.exec("docker -v && echo $?", options, (error, stdout) => {
                if (error) {
                    console.log("error", error);
                    return;
                }
                if (stdout) {
                    if (!stdout.endsWith('0', stdout.length - 1)){
                        sudo.exec("apt update && apt install apt-transport-https ca-certificates curl software-properties-common && curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add - && add-apt-repository 'deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable' && apt update && apt-cache policy docker-ce && apt install docker-ce", (error, stdout) => {
                            if (error) {
                                console.log("error", error);
                                return;
                            }

                            if (stdout) {
                                console.log("stdout", stdout);

                                this.checkDocker();

                                return;
                            }
                        })
                    } else{
                        this.checkDocker();
                    } 
                    return;
                }
            });
    } 
  }
</script>
