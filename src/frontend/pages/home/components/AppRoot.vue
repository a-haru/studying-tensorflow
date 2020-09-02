<template>
    <v-app>
        <div id="main">
            <v-container>
                <v-row>
                    <v-col col="12">
                        <v-btn @click="toggleRecording(true)">test</v-btn>
                    </v-col>
                </v-row>
            </v-container>
            <webcam-canvas ref="webcamCanvas"></webcam-canvas>
        </div>
    </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import WebcamCanvas from './WebcamCanvas.vue';
import UserVerficationModal from './UserVerficationModal.vue';
import vuetify from '../../../plugin/vuetify';

interface VMData {}

export default Vue.extend({

    vuetify,

    data(): VMData
    {
        return {}
    },

    methods: {
        async toggleRecording(isRecording: boolean = false): Promise<void>
        {
            const video = <InstanceType<typeof WebcamCanvas>>this.$refs.webcamCanvas;
            if (isRecording) {
                await video.start({
                    model: './tm-my-image-model/model.json',
                    metadata: './tm-my-image-model/metadata.json'
                });
                await new Promise(resolve => window.setTimeout(resolve, 3000));
                const predition = await video.complete();
            } else {
                await video.pause();
            }
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
