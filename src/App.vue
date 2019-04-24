<template>
  <div id="app">
    <!-- Construct Layout -->
    <div class="most-outer-container">
      <div class="route-slider"><RouteSlider/></div>
      <div class="main-view"><router-view/></div>
      <div class="user-info"><UserInfo/></div>
    </div>
  </div>
</template>

<script>
import RouteSlider from 'components/Layout/RouteSlider';
import UserInfo from 'components/Layout/UserInfo';

export default {
  components: {
    RouteSlider,
    UserInfo
  }
}
</script>


<style lang="scss" scoped>
$route-slider-width: 260px;
$icon-width: 65px;
$icon-offset: 10px;

.most-outer-container {
  height: 100vh;
  display: flex;
  flex-direction: row;
  width: 100%;

  .route-slider {
    height: 100%;
    width: $route-slider-width;
    background-color: bisque;
  }

  .main-view {
    height: 100%;
    width: calc(100% - #{$route-slider-width} - #{$icon-width});
  }
  
  .user-info {
    height: $icon-width;
    width: $icon-width;
    background-color: antiquewhite;
    position: absolute;
    top: $icon-offset;
    right: $icon-offset;
    z-index: 1;
  }
}

@media (min-width: 415px) and (max-width: 1024px) {
  .most-outer-container {
    .route-slider {
      position: absolute;
      width: $icon-width;
      height: $icon-width;
      top: $icon-offset;
      left: $icon-offset;
      z-index: 1;
    }

    .main-view {
      width: 100%;
    }
  }
}

@media (max-width: 414px) {
  $icon-width: 50px;
  $icon-offset: 5px;

  .most-outer-container {
    .route-slider {
      position: absolute;
      width: $icon-width;
      height: $icon-width;
      top: $icon-offset;
      left: $icon-offset;
      z-index: 1;
    }

    .main-view {
      width: 100%;
    }

    .user-info {
      height: $icon-width;
      width: $icon-width;
      position: absolute;
      top: $icon-offset;
      right: $icon-offset;
      z-index: 1;
    }
  }
}
</style>
