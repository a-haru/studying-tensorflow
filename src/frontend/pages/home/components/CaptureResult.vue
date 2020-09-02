<template>
    <v-dialog
      v-model="dialog"
      width="500"
      overlay-opacity="0.1"
    >
        <div>
            <v-alert
                border="top"
                colored-border
                :type="correct ? 'info' : 'error'"
                class="mb-0"
            >
                {{ message }}
            </v-alert>
        </div>
    </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';

type VMData = {
    dialog: boolean;
    correct: boolean;
    message: string;
}

export default Vue.extend({
    data(): VMData
    {
        return {
            dialog: false,
            correct: false,
            message: ''
        }
    },

    methods: {
        async alert(message: string, correct: boolean = false, wait: number = 3000): Promise<void>
        {
            this.show(message, correct);
            await new Promise(r => setTimeout(r, wait));
            this.hide();
        },

        show(message: string, correct: boolean = false): void
        {
            this.dialog = true;
            this.message = message;
            this.correct = correct;
        },

        hide(): void
        {
            this.message = '';
            this.dialog = false;
        }
    }
})
</script>