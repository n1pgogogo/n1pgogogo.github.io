<template>
    <div>
        测试
    </div>
</template>

<script setup>
// import * as BertTokenizer from "../../utils/bert";

// async function tokenizeSentence(sentence) {
//   const tokenizer = new BertTokenizer({ vocabFile: '/assets/vocab.txt' });
//   // 增加特殊标记 '[CLS]' 和 '[SEP]'
//   const tokens = ['[CLS]', ...tokenizer.tokenize(sentence), '[SEP]'];
//   console.log('Tokens:', tokens);
//   // 将tokens映射为ids
//   const ids = tokens.map(token => tokenizer.vocab[token]);
//   console.log('Token IDs:', ids);
// }

// tokenizeSentence('这是一个使用 BERT 的例子。');


import Tokenizator from "../../worker/token?worker"

const token = new Tokenizator();
token.postMessage("这是一句话，我要看看你的输出")
token.onmessage = e => {
    //  console.log(e)
}

import { Tensor, InferenceSession } from "onnxruntime-web";

async function filter() {
    const session = await InferenceSession.create("./model/filter.onnx")
    const inputs_r = {
        input_ids: new BigInt64Array(512),
        token_type_ids: new BigInt64Array(512),
        attention_mask: new BigInt64Array(512)
    };
    inputs_r["input_ids"][0] = BigInt(101);
    inputs_r["input_ids"][1] = BigInt(2644);
    inputs_r["input_ids"][2] = BigInt(1962);
    inputs_r["input_ids"][3] = BigInt(102);

    inputs_r["attention_mask"][0] = BigInt(1);
    inputs_r["attention_mask"][1] = BigInt(1);
    inputs_r["attention_mask"][2] = BigInt(1);
    inputs_r["attention_mask"][3] = BigInt(1);

    const inputs = {
        input_ids: new Tensor("int64", inputs_r["input_ids"], [1, 512]),
        token_type_ids: new Tensor("int64", inputs_r["token_type_ids"], [1, 512]),
        attention_mask: new Tensor("int64", inputs_r["attention_mask"], [1, 512])
    };

    const results = await session.run(inputs)
    console.log(results)
}
// filter()
</script>