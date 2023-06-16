<script setup>
import { inject } from 'vue';

const props = defineProps({
    region: {
        type: String,
        default: ""
    }
});

const bigFive = ['N', 'E', 'O', 'A', 'C'];
const bigFiveName = ['神经质', '外倾性', '开放性', '宜人性', '尽责性'];

const bigFiveData = inject("regionBigFiveData");
console.log(bigFiveData.data[props.region][bigFive[0]]);
const LMH_color = ["rgb(0, 0, 124)", "rgb(124, 124, 124)", "rgb(124, 0, 0)"];
</script>

<template>
    <div class="v-bar">
        <h1>{{ region }}</h1>
        <div class="r-bar" v-for="i in [0, 1, 2, 3, 4]">
            <div class="title">{{ bigFiveName[i] }}</div>
            <div class="bar"
                :style="`--w: ${bigFiveData.data[props.region][bigFive[i]][j] / (bigFiveData.data[props.region][bigFive[i]][0] + bigFiveData.data[props.region][bigFive[i]][1] + bigFiveData.data[props.region][bigFive[i]][2])}; --c: ${LMH_color[j]};`" v-for="j in [0, 1, 2]">
                {{ bigFiveData.data[props.region][bigFive[i]][j] }}</div>
        </div>
    </div>
</template>

<style scoped>
h1 {
    text-align: center;
}

.r-bar .title {
    display: inline-block;
    font-size: 16px;
    line-height: 24px;
    margin: 0 20px 0 0;
    vertical-align: middle;
}

.r-bar .text {
    display: inline-block;
    text-align: center;
}

.r-bar .bar {
    display: inline-block;
    width: calc((100% - 70px - 48px) * var(--w) + 16px);
    height: 20px;
    font-size: 16px;
    line-height: 20px;
    background-color: var(--c);
    text-align: center;
    vertical-align: middle;
    color: var(--color-B);
}
</style>