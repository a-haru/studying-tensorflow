<template>
    <v-app>
        <div id="main">
            <v-container>
                <v-row>
                    <v-col col="12">
                        <v-btn @click="startRecoding">START</v-btn>
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
    executing: boolean
}

export default Vue.extend({

    vuetify,

    data(): VMData
    {
        return {
            executing: false
        }
    },

    methods: {

        async startRecoding(): Promise<void>
        {
            if (this.executing) {
                // Interrupt the executation.
                return;
            }

            const video = <InstanceType<typeof WebcamCanvas>>this.$refs.webcamCanvas;

            this.executing = true;

            await video.start({
                model: './tm-my-image-model/model.json',
                metadata: './tm-my-image-model/metadata.json'
            });

            await new Promise(resolve => window.setTimeout(resolve, 3000));
            
            const predition = await video.complete();

            this.executing = false;

            const modal = <InstanceType<typeof CaptureResult>>this.$refs.captureResult;
            const idx = predition.indexOf(Math.max(...predition));
            if (idx === 0) {
                await modal.alert('陰性です', true);
            } else if (idx === 1) {
                await modal.alert('陽性です');
            } else {
                await modal.alert('撮り直してください', true);
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
