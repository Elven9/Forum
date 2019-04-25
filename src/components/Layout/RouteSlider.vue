<template>
  <div class="slider-container">
  </div>
</template>

<script>
export default {
  
}
</script>

<style lang="scss" scoped>
$route-slider-width: 160px;

.slider-container {
  height: 100%;
  width: $route-slider-width;
}

@media (max-width: 414px) {
  .slider-container {
    width: 100vw;
  }
}
</style>
