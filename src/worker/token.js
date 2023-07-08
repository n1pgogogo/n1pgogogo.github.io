import SampleTokenizer from "@/utils/sample-tokenizer";
import { Tensor, InferenceSession } from "onnxruntime-web";

let token = null;
let session_pre, session_filter;

let loading_state = -2;
onmessage = function (event) {
  let res = 0;
  const { data } = event;
  switch (data.action) {
    case 0:
      // init 初始化
      token = new SampleTokenizer(data.data);
      res = 1;

      InferenceSession.create("../../model/filter.onnx", {
        graphOptimizationLevel: "disabled"
      }).then(r => {
        session_filter = r;
        loading_state += 1;
        if (loading_state == 0) this.postMessage({ action: data.action, result: res });
      });
      InferenceSession.create("../../model/pre.onnx", {
        graphOptimizationLevel: "disabled"
      }).then(r => {
        session_pre = r;
        loading_state += 1
        if (loading_state == 0) this.postMessage({ action: data.action, result: res });
      });
      break;
    case 1:
      const encoding = token.encode(data.data, 512);
      const inputs_r = {
        input_ids: encoding["inputIds"],
        token_type_ids: encoding["segmentIds"],
        attention_mask: encoding["attentionMask"]
      };

      const res_per = {
        N: 1,
        E: 1,
        O: 1,
        A: 1,
        C: 1
      };
      const inputs = {
        input_ids: new Tensor("int64", inputs_r["input_ids"], [1, 512]),
        token_type_ids: new Tensor("int64", inputs_r["token_type_ids"], [1, 512]),
        attention_mask: new Tensor("int64", inputs_r["attention_mask"], [1, 512])
      };
      session_filter.run(inputs).then(r => {
        if (r.pre.data[0] > 0.5) {
          session_pre.run(inputs).then((o) => {
            Object.keys(o).forEach((v, i) => {
                o[v].data.forEach((vc, ic) => {
                    if (vc > o[v].data[res_per[v.toUpperCase()]]) {
                        res_per[v.toUpperCase()] = ic
                    }
                })
            });
            this.postMessage({ action: data.action, result: res_per });
          });
        } else {
          this.postMessage({ action: data.action, result: res_per });
        }
      });
      break;
  }
}