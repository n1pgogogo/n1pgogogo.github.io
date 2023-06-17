<script setup>
import { range } from "d3-array";
import * as echart from "echarts";
import { inject, onMounted, reactive, watch } from "vue";

const isdark = inject("isdark");
const dataSets = reactive({ data: [], years: [], raw_data: [] });
import("@/assets/data/time.json")
    .then(r => r.default)
    .then(r => {
        dataSets.data = [];
        dataSets.raw_data = [];
        dataSets.years = Object.keys(r);
        dataSets.years.forEach((v, i) => {
            const sort = ['C', 'A', 'O', 'E', 'N'];
            const l = [], u = [], h = [];
            const lp = [], up = [], hp = [];
            for (let i = 0; i < sort.length; i++) {
                l.push(r[v][sort[i]][0]);
                u.push(r[v][sort[i]][1]);
                h.push(r[v][sort[i]][2]);

                lp.push(Math.round(r[v][sort[i]][0] / (r[v][sort[i]][0] + r[v][sort[i]][1] + r[v][sort[i]][2]) * 10000) / 100);
                up.push(Math.round(r[v][sort[i]][1] / (r[v][sort[i]][0] + r[v][sort[i]][1] + r[v][sort[i]][2]) * 10000) / 100);
                hp.push(Math.round(r[v][sort[i]][2] / (r[v][sort[i]][0] + r[v][sort[i]][1] + r[v][sort[i]][2]) * 10000) / 100);
            }
            dataSets.raw_data.push({
                title: {
                    text: `${v}年中国大五人格分布情况`
                },
                series: [
                    { data: l },
                    { data: u },
                    { data: h }
                ]
            });
            dataSets.data.push({
                title: {
                    text: `${v}年中国大五人格分布情况`
                },
                series: [
                    { data: lp },
                    { data: up },
                    { data: hp }
                ]
            });
        });
    });


onMounted(() => {
    const myChart = echart.init(document.getElementById("echart-main"), isdark ? "dark" : "light");
    watch(dataSets, (o, n) => {
        const option = {
            baseOption: {
                backgroundColor: isdark ? "#242424" : "#e3e3e3",
                timeline: {
                    axisType: 'category',
                    autoPlay: false,
                    playInterval: 750,
                    data: dataSets.years
                },
                tooltip: {
                    trigger: 'item',
                    formatter: (params) => {
                        return params.componentType == "series" ? `有${params.value}%人的${params.name}为${params.seriesName}` : `${params.name}年`;
                    }
                },
                legend: {
                    left: "right",
                    data: ["低", "未知", "高"]
                },
                calculable: true,
                grid: {
                    top: 80,
                    bottom: 100,
                    left: 60,
                    right: 60
                },
                xAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value} %'
                    },
                    min: 0,
                    max: 100,
                    interval: 20
                },
                yAxis: {
                    type: 'category',
                    data: ['尽责性', '宜人性', '开放性', '外倾性', '神经质']
                },
                series: [
                    { name: "低", type: "bar", stack: "y", itemStyle: { color: "rgb(0, 0, 124)" } },
                    { name: "未知", type: "bar", stack: "y", itemStyle: { color: "rgb(124, 124, 124)" } },
                    { name: "高", type: "bar", stack: "y", itemStyle: { color: "rgb(124, 0, 0)" } }
                ],
            },
            options: dataSets.data
        };
        myChart.setOption(option);
    });
});
</script>


<template>
    <div class="chart">
        <div id="echart-main"></div>
    </div>
</template>

<style scoped>
.chart {
    width: 100%;
    height: calc(100vh - 80px);
    position: relative;
}

#echart-main {
    width: 900px;
    height: 100%;
    margin: auto;
}

@media screen and (max-width: 900px) {
    #echart-main {
    width: 90%;
    height: 90%;
}
}
</style>