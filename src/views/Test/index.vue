<template>
    <div>
        测试
    </div>
</template>

<script setup>
import Tokenizator from "../../worker/token?worker"

const token = new Tokenizator();
token.postMessage("what")
token.onmessage = e => {
  console.log(e)
}

import { Tensor, InferenceSession } from "onnxjs";

const session = new InferenceSession();
const loadingModelPromise = session.loadModel("./model/albert.onnx");

const inp = []
for (let i = 0; i < 768; i++) {
    inp.push(Math.random());
}

const inputs = new Tensor(new Float32Array(inp), "float32", [1, 768]);
loadingModelPromise.then(() => {
    session.run(inputs).then((r) => {console.log(r.values().next())});
});
</script>