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
                <v-btn outlined color="primary" @click.prevent="stop">停止</v-btn>
                <v-btn color="primary" @click.prevent="start">開始</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { makeTmImageApp, ImageModel } from '../../shared/comparePictures';

type VMData = {
    imageModel: ImageModel;
    dialog: boolean;
}

export default Vue.extend({
    data(): VMData
    {
        return {
            imageModel: undefined,
            dialog: false
        }
    },
    
    methods: {
        modalOpen(): void
        {
            this.dialog = true;
        },
        modalClose(): void
        {
            this.dialog = false;
        },
        start(): void
        {
            this.$emit('ev', true);
        },
        stop(): void
        {
            this.$emit('ev', false);
        }
    }
});
</script>
