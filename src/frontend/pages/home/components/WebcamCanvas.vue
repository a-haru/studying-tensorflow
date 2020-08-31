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
import { makeTmImageApp, imageModel } from '../../shared/comparePictures';
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';

@Component({})
export default class WebcamCanvas extends Vue
{
    imageModel: imageModel;
    animId: number = -1;

    tmpPrediction: {className: string, probability: number}[][] = [];

    async start(): Promise<void> {
        if (!this.imageModel) {
            const canvas = <HTMLCanvasElement>this.$refs.canvas;
            const width = canvas.parentElement.clientWidth;
            const height = Math.ceil(width / (16 / 9));
            this.imageModel = await makeTmImageApp(canvas, {
                model: './tm-my-image-model/model.json',
                metadata: './tm-my-image-model/metadata.json'
            }, width, height);
            await this.imageModel.webcam.setup();
        }
        this.tmpPrediction = [];
        await this.imageModel.webcam.play();
        await this.loop();
    }

    async pause(): Promise<void>
    {
        if (!this.imageModel) {
            return;
        }
        await this.imageModel.webcam.pause();
        window.cancelAnimationFrame(this.animId);
    }

    async predict(): Promise<void>
    {
        const predict = await this.imageModel.model.predict(this.imageModel.webcam.canvas);
        this.tmpPrediction.push(predict);
    }

    loop(): void
    {
        if (!this.imageModel) {
            return;
        }
        this.predict();
        this.imageModel.webcam.update();
        this.animId = window.requestAnimationFrame(this.loop);
    }

    async complete(): Promise<number[]>
    {
        await this.pause();
        const classesCount = this.imageModel.model.getTotalClasses();
        const total = this.tmpPrediction.length;
        const tmpPrediction = this.tmpPrediction.map(item => {
            // 各クラスの確率値のみ返す
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