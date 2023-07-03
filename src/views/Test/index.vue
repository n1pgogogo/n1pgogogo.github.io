<script setup>
import Tokenizator from "@/worker/token?worker";
import { Tensor, InferenceSession } from "onnxruntime-web";
import { onUnmounted, ref } from "vue";

const rr = ref("0");

let session_encode, session_pre, session_filter;
const token = new Tokenizator();
token.onmessage = e => {
    switch (e.data.action) {
        case 0:
            if (e.data.result == 1) {
                token.postMessage({ action: 1, data: "新闻联播结束" });
            }
            break;
        case 1:
            const inputs_r = e.data.result;
            const inputs = {
                input_ids: new Tensor("int64", inputs_r["input_ids"], [1, 512]),
                token_type_ids: new Tensor("int64", inputs_r["token_type_ids"], [1, 512]),
                attention_mask: new Tensor("int64", inputs_r["attention_mask"], [1, 512])
            };
            session_encode.run(inputs).then(r => {
                console.log(r.last_hidden_state.data.slice(0, 768));
                session_pre.run({
                    embedding: new Tensor("float32", r.last_hidden_state.data.slice(0, 768), [1, 768])
                }).then((o) => {
                    console.log(o)
                })
            });
            // token.postMessage({ action: 2, data: inputs, act: session });
            break;
    }
}

import("@/assets/data/vocab.txt?raw")
    .then(r => r.default)
    .then(r => {
        const vocabs = r.split("\r\n");
        InferenceSession.create("./model/albert.onnx").then(r => {
            session_encode = r;
            token.postMessage({ action: 0, data: vocabs });
        });
        InferenceSession.create("./model/filter.onnx").then(r => {
            session_filter = r;
        });
        InferenceSession.create("./model/pre_per.onnx").then(r => {
            session_pre = r;
        });
    })

onUnmounted(() => {
    token.terminate();
})
</script>

<template>
    <div class="test-container">
        <div class="layer">
            <div class="input-region">
                <textarea name="" id="" cols="30" rows="10"></textarea>
            </div>
            <div class="show-result">
                <div class="perN">神经质</div>
                <div class="perE">外向性</div>
                <div class="perO">开放性</div>
                <div class="perA">宜人性</div>
                <div class="perC">尽责性</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.test-container {
    display: block;
    width: 100%;
    height: calc(100vh - 80px);
}

.test-container .layer {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>