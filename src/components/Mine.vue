<template>
    <div>
        <v-btn
            color="black white--text"
            elevation="2"
            @click="mine"
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

    import Arweave from 'arweave';
    import TestWeave from 'testweave-sdk';

    const arweave = Arweave.init({
    host: 'localhost',
    port: 1984,
    protocol: 'http',
    timeout: 20000,
    logging: false,
    }); 

  export default {
    name: 'Mine',

    components: {
        // Loading
    },

    methods: {
        async mine() {
            const testWeave = await TestWeave.init(arweave);
            await testWeave.mine();
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
