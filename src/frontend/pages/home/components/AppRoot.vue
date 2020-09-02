<template>
    <v-app>
        <div id="main">
            <v-container>
                <v-row>
                    <v-col col="12">
                        <v-btn @click="startRecoding">test</v-btn>
                    </v-col>
                </v-row>
                <webcam-canvas ref="webcamCanvas"></webcam-canvas>
            </v-container>
        </div>
    </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import WebcamCanvas from './WebcamCanvas.vue';
import UserVerficationModal from './UserVerficationModal.vue';
import vuetify from '../../../plugin/vuetify';

interface VMData {
    isModelLoading: boolean
}

export default Vue.extend({

    vuetify,

    data(): VMData
    {
        return {
            isModelLoading: false
        }
    },

    methods: {

        async startRecoding(): Promise<void>
        {
            if (this.isModelLoading) {
                // Interrupt the executation.
                return;
            }

            const video = <InstanceType<typeof WebcamCanvas>>this.$refs.webcamCanvas;

            this.isModelLoading = true;

            await video.start({
                model: './tm-my-image-model/model.json',
                metadata: './tm-my-image-model/metadata.json'
            });

            await new Promise(resolve => window.setTimeout(resolve, 3000));
            
            const predition = await video.complete();

            this.isModelLoading = false;
        }
    },

    components: {
        'webcam-canvas': WebcamCanvas,
        'user-verification-modal': UserVerficationModal
    }
});
</script>

<style>
</style>
