<template>
  <div class="user-container">
  </div>
</template>

<script>
export default {
  
}
</script>

<style lang="scss" scoped>
$route-slider-width: 200px;

.user-container {
  height: 100%;
  width: $route-slider-width;
}

@media (max-width: 414px) {
  .user-container {
    width: 100vw;
  }
}
</style>
