import SampleTokenizer from "@/utils/sample-tokenizer";

let token = null;
onmessage = function (event) {
  let res = 0;
  const { data } = event;
  switch (data.action) {
    case 0:
      token = new SampleTokenizer(data.data);
      res = 1;
      break;
    case 1:
      const encoding = token.encode(data.data, 512);
      const inputs_r = {
        input_ids: encoding["inputIds"],
        token_type_ids: encoding["segmentIds"],
        attention_mask: encoding["attentionMask"]
      };
      res = inputs_r;
      break;
  }
  this.postMessage({ action: data.action, result: res });
}