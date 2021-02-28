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
      <ContainerSwitch/>

      <!-- <NodeSwitch/> -->
    </v-main>
  </v-app>
</template>

<script>
import ContainerSwitch from './components/ContainerSwitch.vue'
// import NodeSwitch from './components/NodeSwitch.vue'

export default {
  name: 'App',

  components: {
    ContainerSwitch
    // NodeSwitch
  } 
};
</script>
