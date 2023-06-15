<template>
    <div>
        <div id="markdown"></div>
    </div>
</template>

<script setup>
import VditorPreview from "vditor/dist/method.min";
import { inject, onMounted } from "vue";
import "vditor/src/assets/less/index.less";

const theme = inject("isdark");
onMounted(() => {
    import("./index.md?raw")
        .then(r => r.default)
        .then(r => {
            // const vditor = new Vditor("markdown", {});
            VditorPreview.preview(document.querySelector("#markdown"), r, {
                speech: {
                    enable: true
                },
                theme: {
                    current: theme ? "dark" : "light"
                }
            })
        });
});
</script>

<style scoped>
#markdown {
    width: 80%;
    margin: auto;
}
</style>