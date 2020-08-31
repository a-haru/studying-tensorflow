<template>
    <v-container>
        <v-row>
            <v-col cols="6">
                <div>
                    <canvas ref="canvas"></canvas>
                </div>
            </v-col>
            <v-col cols="6"></v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">  
import { compare, comparePicture } from '../../shared/comparePictures';
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';

@Component({})
export default class WebcamCanvas extends Vue
{
    webcam: comparePicture;
    animId: number = -1;

    tmpPrediction = [];

    async start(): Promise<void> {
        if (!this.webcam) {
            const canvas = <HTMLCanvasElement>this.$refs.canvas;
            const width = canvas.parentElement.clientWidth;
            const height = Math.ceil(width / (16 / 9));
            this.webcam = await compare(canvas, {
                model: './tm-my-image-model/model.json',
                metadata: './tm-my-image-model/metadata.json'
            }, width, height);
            await this.webcam.webcam.setup();
        }
        this.tmpPrediction = [];
        await this.webcam.webcam.play();
        await this.loop();
    }

    async pause(): Promise<void>
    {
        if (!this.webcam) {
            return;
        }
        await this.webcam.webcam.pause();
        window.cancelAnimationFrame(this.animId);
    }

    async predict()
    {
        const predict = await this.webcam.model.predict(this.webcam.webcam.canvas);
        this.tmpPrediction.push(predict);
    }

    loop(): void
    {
        if (!this.webcam) {
            return;
        }
        this.predict();
        this.webcam.webcam.update();
        this.animId = window.requestAnimationFrame(this.loop);
    }

    async complete()
    {
        await this.pause();
        const classesCount = this.webcam.model.getTotalClasses();
        const total = this.tmpPrediction.length;
        const tmpPrediction = this.tmpPrediction.map(item => {
            // 各クラスの予測値のみ返す
            return item.map(item => item.probability);
        }).reduce((prev, current) => {
            // 各クラスの予測値を足していく
            prev.forEach((val, idx) => {
                current[idx] += val;
            });
            return current;
        }, Array.from(Array(classesCount), () => 0))
        .map((item) => {
            // 各クラスの予測値の平均
            return item / total;
        });
        this.tmpPrediction = [];
        return tmpPrediction;
    }
}
</script>

<style>
</style>