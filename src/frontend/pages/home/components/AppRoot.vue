<template>
    <v-app>
        <div id="main">
            <user-verification-modal ref="userVerification" v-on:ev="toggleRecording"></user-verification-modal>
            <webcam-canvas ref="webcamCanvas"></webcam-canvas>
        </div>
    </v-app>
</template>

<script lang="ts">
import WebcamCanvas from './WebcamCanvas.vue';
import UserVerficationModal from './UserVerficationModal.vue';
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import vuetify from '../../../plugin/vuetify'

@Component({
    vuetify,
    components: {
        'webcam-canvas': WebcamCanvas,
        'user-verification-modal': UserVerficationModal
    }
})
export default class AppRoot extends Vue {
    isModalOpen: boolean = false;

    async toggleRecording(isRecording: boolean = false) {
        const video = <WebcamCanvas>this.$refs.webcamCanvas
        const modal = <UserVerficationModal>this.$refs.userVerification;
        if (isRecording) {
            await video.start();
            modal.modalClose();
            await new Promise(resolve => window.setTimeout(resolve, 5000));
            const predition = await video.complete();
            alert(predition);
        } else {
            await video.pause();
            modal.modalClose()
        }
    }
}
</script>

<style>
</style>
