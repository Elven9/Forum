<template>
  <div id="app">
    <div class="header">
      <div id="route-slider-openner"></div>
      <img src="~assets/Layout/main-icon-64x64.svg" alt="main-icon">
      <span class="header-tag-content">Forum</span>
    </div>
    <!-- Construct Layout -->
    <div class="outer-container">
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
$slider-width: 160px;
$icon-width: 65px;
$icon-offset: 10px;
$header-height: 60px;

.header {
  height: $header-height;
  border-bottom: solid 1px rgba(128, 128, 128, 0.5);
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  img {
    margin-left: 15px;
    width: 40px;
    height: 40px;
  }

  span {
    margin-left: 15px;
    font-size: 20px;
    font-weight: 200;
    color: black;
  }
}

.outer-container {
  height: calc(100vh - #{$header-height});
  display: flex;
  flex-direction: row;
  width: 100%;

  .route-slider {
    height: calc(100vh - #{$header-height});
    position: absolute;
    top: $header-height;
    left: 0px;
    z-index: 2;
  }

  .main-view {
    height: 100%;
    width: calc(100% - #{$slider-width});
    margin-left: $slider-width;
  }

  .user-info {
    position: absolute;
    top: $header-height;
    right: -1 * $slider-width;
    z-index: 2;
  }
}

@media (max-width: 1024px) and (min-width: 415px) {
  .outer-container {
    .route-slider {
      left: -1 * $slider-width;
    }

    .main-view {
      width: 100%;
      margin-left: 0px;
    }
  }
}

@media (max-width: 414px) {
  $slider-width: 100%;

  .outer-container {
    .route-slider {
      left: -1 * $slider-width;
    }

    .main-view {
      width: 100%;
      margin-left: 0px;
    }

    .user-info {
      position: absolute;
      top: $header-height;
      right: -1 * $slider-width;
      z-index: 2;
    }
  }
}
</style>
