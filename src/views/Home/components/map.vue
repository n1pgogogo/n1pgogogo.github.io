<script setup>
import * as d3 from "d3";
import * as topojson from "topojson";
import { inject, onMounted, provide, reactive, ref, watch } from "vue";

import barVue from "./bar.vue";

const regionBigFiveData = reactive({ data: {}, color: {} }); // 地区大五人格的信息
provide("regionBigFiveData", regionBigFiveData);
import("../../../assets/data/assume.json")
    .then(r => r.default)
    .then(r => {
        regionBigFiveData.data = r;
        const tmpObj = {};
        Object.keys(r).forEach((v, i) => {
            tmpObj[v] = {};
            Object.keys(r[v]).forEach((v1, i1) => {
                tmpObj[v][v1] = r[v][v1][2] / (r[v][v1][2] + r[v][v1][1] + r[v][v1][0])
            });
        });
        regionBigFiveData.color = tmpObj;
    });

const bigGiveColor = {
    N: [75, 121, 170],
    E: [236, 59, 85],
    O: [242, 165, 47],
    A: [51, 188, 100],
    C: [196, 74, 147]
};

const selectBigFive = ref("N"); // 选择了哪个特质。
const selectRegion = ref(""); // 选择了哪个地方
onMounted(() => {
    const canvas = document.getElementById("geoMap");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const context = canvas.getContext("2d");

    import("@/assets/china/100000.topo.json")
        .then(r => r.default)
        .then(r => {
            const geoData = topojson.feature(r, r.objects.default)
            // 定义地理投影函数
            const scale = document.body.offsetWidth <= 900 ? 350 : 700;
            const projection = d3.geoMercator().center([106, 36]).scale(scale);
            // 创建地理路径生成器
            const pathGenerator = d3.geoPath()
                .projection(projection)
                .context(context);

            let k = null, tx = null, ty = null;
            function drawMap(resize = false, mouse = null) {
                if (resize) {
                    projection.translate([
                        (canvas.width) / 2,
                        (canvas.height) / 2
                    ]);
                }
                context.clearRect(0, 0, canvas.width, canvas.height);
                if (k) {
                    context.save();
                    context.translate(tx, ty);
                    context.scale(k, k);
                }
                const features = geoData.features;
                let region = "";
                for (let i = 0; i < features.length; i++) {
                    const feature = features[i];
                    const name = feature.properties.name;
                    if (feature.properties.name == selectRegion.value) {
                        // 选中的区域
                        context.strokeStyle = "#000000";
                        context.lineWidth = 0.15;
                        context.fillStyle = "#FAD69D";
                    } else {
                        if (regionBigFiveData.color[name]) {
                            // 有信息的区域
                            context.strokeStyle = "#000000";
                            const regionColor = regionBigFiveData.color[name][selectBigFive.value];
                            // console.log(regionColor);
                            // const r = regionColor < 0.5 ? 200 * 2 * regionColor : 200;
                            // const g = 200 - 200 * Math.abs(1 - 2 * regionColor);
                            // const b = regionColor > 0.5 ? 200 * (2 - 2 * regionColor) : 200;
                            const bg = [200, 200, 200];
                            const rgb = bigGiveColor[selectBigFive.value];
                            const r = bg[0] + (rgb[0] - 200) * regionColor;
                            const g = bg[1] + (rgb[1] - 200) * regionColor;
                            const b = bg[2] + (rgb[2] - 200) * regionColor;
                            context.fillStyle = `rgb(${r}, ${g}, ${b})`;
                        } else {
                            // 没有信息的区域
                            context.strokeStyle = "#000000";
                            context.fillStyle = "rgb(0, 0, 0)";
                        }
                        context.lineWidth = 0.2;
                    }
                    context.beginPath();
                    pathGenerator(feature);
                    if (mouse && context.isPointInPath(mouse[0], mouse[1])) {
                        region = name;
                    }
                    context.fill();
                    context.stroke();
                }
                context.restore();
                return region
            }
            drawMap(true);

            function zoomed(event) {
                const transform = event.transform;
                k = transform.k;
                tx = transform.x;
                ty = transform.y;
                drawMap();
            }
            const d3Canvas = d3.select(canvas)
            const zoom = d3.zoom()
                .scaleExtent([1, 100])
                .translateExtent([[0, 0], [canvas.width, canvas.height]])
                .on("zoom", zoomed);
            d3Canvas.call(zoom);
            d3Canvas.on("click", (event) => {
                const [x, y] = d3.pointer(event);
                selectRegion.value = drawMap(false, [x, y]);
                drawMap();
            });

            watch(selectBigFive, (n, o) => {
                selectRegion.value = "";
                drawMap(true);
            });
        })
})
</script>

<template>
    <div id="map">
        <div class="silder">
            <div :class="{ selected: selectBigFive == 'N', navButton: true }" style="--c: rgb(75, 121, 170);"
                @click="selectBigFive = 'N'">神经质
            </div>
            <div :class="{ selected: selectBigFive == 'E', navButton: true }" style="--c: rgb(236, 59, 85);"
                @click="selectBigFive = 'E'">外向性</div>
            <div :class="{ selected: selectBigFive == 'O', navButton: true }" style="--c: rgb(242, 165, 47);"
                @click="selectBigFive = 'O'">开放性
            </div>
            <div :class="{ selected: selectBigFive == 'A', navButton: true }" style="--c: rgb(51, 188, 100);"
                @click="selectBigFive = 'A'">宜人性
            </div>
            <div :class="{ selected: selectBigFive == 'C', navButton: true }" style="--c: rgb(196, 74, 147);"
                @click="selectBigFive = 'C'">尽责性</div>
        </div>
        <canvas id="geoMap"></canvas>
        <div class="legend"
            :style="`--c: rgb(${bigGiveColor[selectBigFive][0]}, ${bigGiveColor[selectBigFive][1]}, ${bigGiveColor[selectBigFive][2]}); --f: ${0.299 * bigGiveColor[selectBigFive][0] + 0.587 * bigGiveColor[selectBigFive][1] + 0.114 * bigGiveColor[selectBigFive][2] > 128 ? 'rgb(24, 24, 24)' : 'rgb(200, 200, 200)'};`">
            <div></div>
        </div>
        <div class="bar" v-if="selectRegion != ''">
            <barVue :region="selectRegion"></barVue>
        </div>
    </div>
</template>

<style scoped>
#map {
    width: 100%;
    height: calc(100vh - 80px);
    position: relative;
}

#map .bar {
    width: 500px;
    position: absolute;
    top: 0;
    left: calc(50% - 250px);
}

#map .legend {
    display: block;
    width: 17px;
    height: 256px;
    position: absolute;
    bottom: 10%;
    right: 10%;
    background-image: linear-gradient(to bottom, var(--c), #d4d4d4);
    user-select: none;
    cursor: default;
    color: var(--f);
}

#map .legend>div {
    width: 100%;
    height: 100%;
    position: absolute;
}

#map .legend>div::before {
    content: "低";
    position: absolute;
    left: 0;
    bottom: 0;
    color: var(--color-black);
    font-size: 16px;
    line-height: 16px;
}

#map .legend>div::after {
    content: "高";
    position: absolute;
    left: 0;
    font-size: 16px;
    line-height: 16px;
}

#map .silder {
    display: flex;
    position: absolute;
    top: 30%;
    left: 0;
    flex-direction: column;
    justify-content: space-between;
    height: 40%;
}

#map .silder .navButton {
    width: 150px;
    height: 36px;
    font-size: 24px;
    text-indent: 1em;
    line-height: 36px;
    font-weight: 100;
    border: 1px solid var(--color-font);
    border-left: 0px;
    border-radius: 0px 50px 50px 0px;
    user-select: none;
    cursor: pointer;
    background-color: var(--color-bg);
    transition: 0.6s;
}

#map .silder div.selected {
    background-color: var(--c);
    color: var(--color-B);
}

#map canvas {
    width: 100%;
    height: calc(100% - 10px);
}

@media screen and (max-width: 900px) {
    #map>.silder {
        top: unset;
        bottom: 10%;
        height: 20%;
    }

    #map .silder .navButton {
        width: 75px;
        height: 24px;
        line-height: 24px;
        font-size: 16px;
    }

    #map .legend {
        height: 128px;
    }

    #map .bar {
        width: 50%;
        left: 25%;
    }
}</style>