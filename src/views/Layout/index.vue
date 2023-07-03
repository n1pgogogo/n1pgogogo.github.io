<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const menuList = [
    { title: "空间分布", path: "/layout/home" },
    { title: "时间分布", path: "/layout/time" },
    { title: "人格预测", path: "/layout/test" },
    { title: "关于我们", path: "/layout/about" }
];

const onGo = (path) => {
    router.push(path);
};
</script>

<template>
    <header>
        <div>
            <ul>
                <li class="nav-item" v-for="(item, index) in menuList" :key="index" @click="onGo(item.path)"
                    :class="route.path == item.path ? 'curr' : ''">
                    {{ item.title }}
                </li>
            </ul>
            <div class="tag" :style='`--l: ${menuList.length}; --p: ${menuList.map(i => i.path).indexOf(route.path)};`'></div>
        </div>
    </header>
    <router-view></router-view>
</template>

<style scoped>
header {
    display: flex;
    height: 80px;
}
header>div {
    width: 60vw;
    height: 60px;
    margin: auto;
    line-height: 60px;
    box-shadow: 0px 5px 15px var(--color-shadow);
    border-radius: 50px;
    position: relative;
}

header ul {
    list-style: none;
    padding: 0;
    display: flex;
    position: relative;
}

header ul li {
    flex: 1;
    width: 100%;
    cursor: pointer;
    text-align: center;
    color: var(--color-font);
}

header ul li.curr {
    color: white;
    transition: 0.6s;
}

header div .tag {
    width: calc(100% / var(--l));
    height: 100%;
    position: absolute;
    bottom: 0;
    left: calc(100% / var(--l) * var(--p));
    background-image: linear-gradient(to right, #f09819, #ff5858);
    z-index: -1;
    border-radius: 50px;
    transition: 0.6s cubic-bezier(0.68,-0.55,0.265,1.55);
}
</style>