<script setup>
import Tokenizator from "@/worker/token?worker";
import { Tensor, InferenceSession } from "onnxruntime-web";
import { onMounted, onUnmounted, reactive, ref } from "vue";
import loading from "@/components/loading.vue";

let session_pre, session_filter;
const token = new Tokenizator();
token.onmessage = e => {
    switch (e.data.action) {
        case 0:
            if (e.data.result == 1) clickable.value = 1;
            break;
        case 1:
            Object.keys(res_per).forEach(v => {
                res_per[v] = e.data.result[v];
            });
            clickable.value = 1;
            break;
    }
}

onMounted(() => {
    import("@/assets/data/vocab.txt?raw")
    .then(r => r.default)
    .then(r => {
        const vocabs = r.split("\r\n");
        token.postMessage({ action: 0, data: vocabs });
    })
});

onUnmounted(() => {
    token.terminate();
});


const clickable = ref(-1);
const bigGiveColor = {
    N: [75, 121, 170],
    E: [236, 59, 85],
    O: [242, 165, 47],
    A: [51, 188, 100],
    C: [196, 74, 147]
};
const res_per = reactive({
    N: 1,
    E: 1,
    O: 1,
    A: 1,
    C: 1
});
const desc = ["低", "未知", "高"];
const word_content = ref("走走走走走，小手拉大手，向着阳光快乐走");
const pre_click = (e) => {
    clickable.value = 0;
    token.postMessage({ action: 1, data: word_content.value });
};
</script>

<template>
    <div class="test-container">
        <div class="layer">
            <div class="input-region">
                <div>请在下方输入框中输入您需要预测的文本</div>
                <div><textarea name="" id="" cols="50" rows="10" v-model="word_content" /></div>
                <div class="button" @click="pre_click" v-if="clickable == 1">开始预测</div>
                <div class="button" style="cursor: not-allowed;" v-if="clickable == -1">正在加载模型</div>
                <div class="button loading" v-if="clickable == 0">
                    <loading></loading>
                </div>
            </div>
            <div class="show-result">
                <div class="perN"
                    :style="`--r: ${bigGiveColor['N'][0]}; --g: ${bigGiveColor['N'][1]}; --b: ${bigGiveColor['N'][2]};`">
                    神经质<span>{{ desc[res_per["N"]] }}</span></div>
                <div class="perE"
                    :style="`--r: ${bigGiveColor['E'][0]}; --g: ${bigGiveColor['E'][1]}; --b: ${bigGiveColor['E'][2]};`">
                    外向性<span>{{ desc[res_per["E"]] }}</span></div>
                <div class="perO"
                    :style="`--r: ${bigGiveColor['O'][0]}; --g: ${bigGiveColor['O'][1]}; --b: ${bigGiveColor['O'][2]};`">
                    开放性<span>{{ desc[res_per["O"]] }}</span></div>
                <div class="perA"
                    :style="`--r: ${bigGiveColor['A'][0]}; --g: ${bigGiveColor['A'][1]}; --b: ${bigGiveColor['A'][2]};`">
                    宜人性<span>{{ desc[res_per["A"]] }}</span></div>
                <div class="perC"
                    :style="`--r: ${bigGiveColor['C'][0]}; --g: ${bigGiveColor['C'][1]}; --b: ${bigGiveColor['C'][2]};`">
                    尽责性<span>{{ desc[res_per["C"]] }}</span></div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.test-container {
    display: block;
    width: 100%;
    height: calc(100vh - 80px);
    user-select: none;
}

.test-container .layer {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.layer .input-region {
    margin: 0 0 40px 0;
    padding: 20px 0 0 0;
    text-align: center;
}

.layer .input-region .button {
    width: 168px;
    height: 48px;
    margin: auto;
    line-height: 48px;
    font-size: 24px;
    border: 1px solid var(--color-font);
    cursor: pointer;
}

.layer .input-region .button.loading {
    border: none;
}

.layer .input-region textarea {
    font-size: 24px;
    line-height: 32px;
    resize: none;
}

.layer .show-result {
    display: flex;
    justify-content: space-around;
    width: 600px;
}

.show-result>div {
    display: inline-block;
    padding: 20px;
    line-height: 48px;
    border: 1px solid rgb(var(--r), var(--g), var(--b));
    border-radius: 15px;
    box-sizing: content-box;
    color: rgb(var(--r), var(--g), var(--b));
    text-align: center;
}

.show-result>div>span {
    display: block;
}

@media screen and (max-width: 900px) {
    .layer .input-region textarea {
        max-width: 300px;
        font-size: 16px;
        line-height: 24px;
        resize: none;
    }

    .layer .show-result {
        width: 350px;
    }

    .show-result>div {
        padding: 5px;
    }
}
</style>