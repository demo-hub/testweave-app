<template>
    <div>
        <v-btn
            color="black white--text"
            elevation="2"
            @click="onClick"
        >Mine</v-btn>

        <!-- <loading :active.sync="isLoading" 
            :can-cancel="false"
            :is-full-page="false"></loading> -->
    </div>
</template>

<script>
    // Import loading component
    // import Loading from 'vue-loading-overlay';
    // Import loading stylesheet
    // import 'vue-loading-overlay/dist/vue-loading.css';

  export default {
    name: 'Mine',

    components: {
        // Loading
    },

    methods: {
        onClick() {
            console.log('ok');
        }
    },

    data() {
        return {
            running: false,
            isLoading: false
        }
    }
  }
</script>
