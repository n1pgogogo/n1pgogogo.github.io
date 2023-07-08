<template>
    <section>
        <div class="loader">
        <span style="--i:1;"></span>
        <span style="--i:2;"></span>
        <span style="--i:3;"></span>
        <span style="--i:4;"></span>
        <span style="--i:5;"></span>
        <span style="--i:6;"></span>
        <span style="--i:7;"></span>
        <span style="--i:8;"></span>
        <span style="--i:9;"></span>
        <span style="--i:10;"></span>
    </div>
    </section>
</template>

<script>
export default {
    name: 'LoadingAni1'
}
</script>

<style scoped>
section {
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  animation: animateBg 10s linear infinite;
}

@keyframes animateBg {
    0% {
        filter: hue-rotate(0deg);
    }
    100% {
        filter: hue-rotate(360deg);
    }
}
.loader {
    position: relative;
    width: 168px;
    height: 48px;
}

.loader span {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform: rotate(calc(36deg * var(--i)));
}

.loader span::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #00ff0a;
    box-shadow: 0 0 10px #00ff0a,
                0 0 20px #00ff0a,
                0 0 40px #00ff0a,
                0 0 60px #00ff0a,
                0 0 80px #00ff0a,
                0 0 100px #00ff0a;
    animation: animate 2s linear infinite;
    animation-delay: calc(0.2s * var(--i));
}
@keyframes animate {
    0% {
        transform: scale(1);
    }
    80%,100% {
        transform: scale(0);
    }
}
</style>