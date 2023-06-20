<template>
    <div>
        测试
    </div>
</template>

<script setup>
import { Tensor, InferenceSession } from "onnxjs";

const session = new InferenceSession();
const loadingModelPromise = session.loadModel("./model/pre.onnx");

const inp = []
for (let i = 0; i < 768; i++) {
    inp.push(Math.random());
}

console.log(inp)
const inputs = [
  new Tensor(new Float32Array(inp), "float32", [1, 768]),
];

loadingModelPromise.then(() => {
    session.run(inputs).then((r) => {console.log(r)});
    // const outputTensor = outputMap.values().next().value;
});
</script>