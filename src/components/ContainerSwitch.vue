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
    // const exec = require('child_process').exec;
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
            sudo.exec("docker ps | grep 'testweave-docker_gateway", options, (error, stdout) => {
                if (error) {
                    console.log("error", error.message);
                    this.running = false
                    return;
                }
                if (stdout) {
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
                sudo.exec("docker container ls --all | grep 'testweave-docker_gateway", options, (error, stdout) => {
                    if (error) {
                        console.log("error", error.message);
                        this.running = false
                        this.isLoading = false;
                        return;
                    }
                    if (stdout) {
                        sudo.exec("docker-compose -f testweave-docker/docker-compose.yml start", options, (error, stdout) => {
                            if (error) {
                                console.log("error", error.message);
                                this.running = false
                                this.isLoading = false
                                return;
                            }
                            if (stdout) {
                                console.log(stdout)
                                this.isLoading = false
                                return;
                            }
                        });
                    } else {
                        sudo.exec("docker-compose -f testweave-docker/docker-compose.yml build && docker-compose -f testweave-docker/docker-compose.yml up -d", options, (error, stdout) => {
                            if (error) {
                                console.log("error", error.message);
                                this.running = false
                                this.isLoading = false
                                return;
                            }
                            if (stdout) {
                                console.log(stdout)
                                this.isLoading = false
                                return;
                            }
                        });
                    }
                    // console.log("build", data);
                });
            } else{
                sudo.exec("docker-compose -f testweave-docker/docker-compose.yml stop", options, (error, stdout) => {
                    if (error) {
                        console.log("error docker stop", error.message);
                        this.running = true
                        this.isLoading = false
                        return;
                    }
                    if (stdout) {
                        console.log(stdout)
                        this.isLoading = false
                        return;
                    }
                });
            } 
        } 
    },

    mounted() {
        if (process.platform !== 'win32'){
            sudo.exec("docker -v && echo $?", options, (error, stdout) => {
                if (error) {
                    console.log("error", error);
                    return;
                }
                if (stdout) {
                    if (!stdout.endsWith('0', stdout.length - 1)){
                        sudo.exec("apt update && apt install apt-transport-https ca-certificates curl software-properties-common && curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add - && add-apt-repository 'deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable' && apt update && apt-cache policy docker-ce && apt install docker-ce", options, (error, stdout) => {
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
  }
</script>
