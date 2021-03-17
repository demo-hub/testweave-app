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
            sudo.exec("docker container ls | grep 'lucaarweave/arweave-node'", options, (error, stdout) => {
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
                exec("pwd", options, (error, pwd) => {
                    if (error) {
                        console.log("error pwd command", error.message);
                        this.running = false
                        this.isLoading = false
                        return;
                    }
                    if (pwd) {
                        sudo.exec("docker container ls --all | grep 'lucaarweave/arweave-node'", options, (error, stdout) => {
                            if (error) {
                                console.log("error", error.message);
                                this.running = false
                                this.isLoading = false;
                                return;
                            }
                            if (stdout) {
                                sudo.exec(`docker-compose -f ${pwd.trim()}/docker-compose.yml start`, options, (error, stdout) => {
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
                                    this.isLoading = false;
                                });
                            } else {
                                exec("pwd", options, (error, pwd) => {
                                    if (error) {
                                        console.log("error", error.message);
                                        this.running = false
                                        this.isLoading = false
                                        return;
                                    }
                                    if (pwd) {
                                        sudo.exec(`docker-compose -f ${pwd.trim()}/docker-compose.yml build && docker-compose -f ${pwd.trim()}/docker-compose.yml up -d`, options, (error, stdout) => {
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
                                });
                            }
                            // console.log("build", data);
                        });
                    }
                });
            } else{
                exec("pwd", options, (error, stdout) => {
                                    if (error) {
                                        console.log("error", error.message);
                                        this.running = false
                                        this.isLoading = false
                                        return;
                                    }
                                    if (stdout) {
                                        sudo.exec(`docker-compose -f ${stdout.trim()}/docker-compose.yml stop`, options, (error, stdout) => {
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
                                            this.isLoading = false;
                                        });
                                    }
                                });
                
            } 
        } 
    },

    mounted() {
        // TODO: check versions and upgrade if needed
        // for now installing docker and docker-compose is Unix OS only
        if (process.platform !== 'win32'){
            // check if docker is installed and, if not, install it
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

                                // check if docker-compose is installed and, if not, install it
                                sudo.exec("docker-compose -v && echo $?", options, (error, stdout) => {
                                    if (error) {
                                        console.log("error", error);
                                        return;
                                    }
                                    if (stdout) {
                                        if (!stdout.endsWith('0', stdout.length - 1)){
                                            sudo.exec("curl -L https://github.com/docker/compose/releases/download/1.28.5/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose && chmod +x /usr/local/bin/docker-compose", options, (error, stdout) => {
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
                        })
                    } else{

                        // check if docker-compose is installed and, if not, install it
                                sudo.exec("docker-compose -v && echo $?", options, (error, stdout) => {
                                    if (error) {
                                        console.log("error", error);
                                        return;
                                    }
                                    if (stdout) {
                                        if (!stdout.endsWith('0', stdout.length - 1)){
                                            sudo.exec("curl -L https://github.com/docker/compose/releases/download/1.28.5/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose && chmod +x /usr/local/bin/docker-compose", options, (error, stdout) => {
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
                    return;
                }
            });
        } 
    } 
  }
</script>
