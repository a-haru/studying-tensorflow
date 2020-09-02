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
            <capture-result ref="captureResult"></capture-result>
        </div>
    </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import WebcamCanvas from './WebcamCanvas.vue';
import CaptureResult from './CaptureResult.vue';
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

            const alert = <InstanceType<typeof CaptureResult>>this.$refs.captureResult;
            
            const idx = predition.indexOf(Math.max(...predition));
            if (idx === 0) {
                await alert.show('陰性です', true);
            } else if (idx === 1) {
                await alert.show('陽性です');
            } else {
                await alert.show('撮り直してください', true);
            }
        }
    },

    components: {
        'webcam-canvas': WebcamCanvas,
        'capture-result': CaptureResult
    }
});
</script>

<style>
</style>
