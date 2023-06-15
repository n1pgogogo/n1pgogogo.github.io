<template>
  <router-view></router-view>
</template>

<script setup>
import { provide } from 'vue';

const dark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
provide("isdark", dark);
</script>