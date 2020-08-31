<template>
  <v-container>
    <v-row>
      <v-col cols="auto">
        <v-dialog
          v-model="dialog"
          width="500"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on">
              Click Me
            </v-btn>
          </template>

          <v-card>

            <v-card-text>
                
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn outlined="true" color="primary" @click.prevent="stop">停止</v-btn>
                <v-btn color="primary" @click.prevent="start">開始</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { compare, comparePicture } from '../../shared/comparePictures';

@Component
export default class UserVerificationModal extends Vue {
    @Prop() webcam: comparePicture;

    dialog: boolean = false;

    modalOpen()
    {
        this.dialog = true;
    }

    modalClose()
    {
        this.dialog = false;
    }

    start()
    {
        this.$emit('ev', true);
    }

    stop()
    {
        this.$emit('ev', false);
    }
}
</script>
