<template>
    <v-row justify="center">
        <v-col cols="12" xl="6" lg="8" md="10">
            <div>
                <canvas ref="canvas"></canvas>
            </div>
        </v-col>
    </v-row>
</template>

<script lang="ts">  
import Vue, {PropType} from 'vue';
import { makeTmImageApp, ImageModel, TmImageSrc } from '../../shared/comparePictures';

type PredictItem = {
    className: string;
    probability: number;
}

type VMData = {
    imageModel: ImageModel;
    animId: number;
    tmpPrediction: PredictItem[];
}

export default Vue.extend({

    data(): VMData
    {
        return {
            imageModel: undefined,
            animId: -1,
            tmpPrediction: []
        }
    },

    methods: {
        async start(tmImageSrc: TmImageSrc): Promise<void>
        {
            if (!this.imageModel) {
                const canvas = <HTMLCanvasElement>this.$refs.canvas;
                const width = canvas.parentElement.clientWidth;
                const height = Math.ceil(width / (16 / 9));
                this.imageModel = await makeTmImageApp(tmImageSrc, canvas, width, height);
                await this.imageModel.webcam.setup();
            }
            this.tmpPrediction = [];
            await this.imageModel.webcam.play();
            await this.loop();
        },

        async pause(): Promise<void>
        {
            if (!this.imageModel) {
                return;
            }
            await this.imageModel.webcam.pause();
            window.cancelAnimationFrame(this.animId);
        },

        async predict(): Promise<void>
        {
            const predict = await this.imageModel.model.predict(this.imageModel.webcam.canvas);
            this.tmpPrediction.push(predict);
        },

        loop(): void
        {
            if (!this.imageModel) {
                return;
            }
            this.predict();
            this.imageModel.webcam.update();
            this.animId = window.requestAnimationFrame(this.loop);
        },

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
                return total === 0 ? 0 : item / total;
            });
            this.tmpPrediction = [];
            return tmpPrediction;
        }
    }
});
</script>

<style>
</style>