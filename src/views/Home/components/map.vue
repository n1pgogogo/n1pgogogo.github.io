<script setup>
import * as d3 from "d3";
import * as topojson from "topojson";
import { onMounted, reactive, ref, watch } from "vue";

const regionBigFiveData = reactive({ data: {}, color: {} }); // 地区大五人格的信息
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
            console.log(document.body.offsetWidth)
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
                        context.strokeStyle = "red";
                        context.lineWidth = 0.5;
                        context.fillStyle = "blue";
                    } else {
                        if (regionBigFiveData.color[name]) {
                            // 有信息的区域
                            context.strokeStyle = "#ffffff";
                            context.fillStyle = `rgba(255, 0, 0, ${regionBigFiveData.color[name][selectBigFive.value]})`;
                            // context.globalAlpha = regionBigFiveData.color[name][selectBigFive.value];
                        } else {
                            // 没有信息的区域
                            // context.globalAlpha = 0.5;
                            context.strokeStyle = "#ffffff";
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
            <div :class="{ selected: selectBigFive == 'N', navButton: true }" style="--c: rgb(75, 121, 170);" @click="selectBigFive = 'N'">神经质
            </div>
            <div :class="{ selected: selectBigFive == 'E', navButton: true }" style="--c: rgb(236, 59, 85);" @click="selectBigFive = 'E'">外倾性</div>
            <div :class="{ selected: selectBigFive == 'O', navButton: true }" style="--c: rgb(242, 165, 47);" @click="selectBigFive = 'O'">开放性
            </div>
            <div :class="{ selected: selectBigFive == 'A', navButton: true }" style="--c: rgb(51, 188, 100);" @click="selectBigFive = 'A'">宜人性
            </div>
            <div :class="{ selected: selectBigFive == 'C', navButton: true }" style="--c: rgb(196, 74, 147);" @click="selectBigFive = 'C'">尽责性</div>
        </div>
        <canvas id="geoMap"></canvas>
    </div>
</template>

<style scoped>
#map {
    width: 100%;
    height: calc(100vh - 80px);
    position: relative;
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
}
</style>