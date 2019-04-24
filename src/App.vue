<template>
  <div id="app">
    <div class="header">
      <div class="header-left">
        <div v-if="windowWidth <= 1024" class="route-slider-openner">
          <img src="~/assets/Layout/open-menu-icon.svg" alt="">
        </div>
        <img src="~assets/Layout/main-icon.svg" alt="main-icon">
        <span class="header-tag-content">फोरम Forumas المنتدى</span>
      </div>
      <div class="header-right">
        <div class="route-slider-openner">
          <img src="~/assets/Layout/group.svg" alt="user">
        </div>
      </div>
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
  data() {
    return {
      windowWidth: window.innerWidth,

      // event listener
      _resizeHandler: null
    }
  },
  components: {
    RouteSlider,
    UserInfo
  },
  mounted() {
    // Add Handler to Data For Destroing.
    this._resizeHandler = () => { this.windowWidth = window.innerWidth; }
    window.addEventListener('resize', this._resizeHandler);
  },
  beforeDestroy() {
    window.removeEventListener(this._resizeHandler);
  }
}
</script>


<style lang="scss" scoped>
$slider-width: 160px;
$icon-width: 65px;
$icon-offset: 10px;
$header-height: 70px;

.header {
  width: 100%;
  height: $header-height;
  border-bottom: solid 1px rgba(128, 128, 128, 0.5);
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  .header-left {
    height: 100%;
    width: 50%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    .route-slider-openner {
      border-right: solid 1px rgba(128, 128, 128, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: $header-height;

      img {
        margin: 0;
        width: calc(#{$header-height} - 30px);
        height: auto;
      }
    }

    img {
      margin-left: 15px;
      width: 40px;
      height: auto;
    }

    span {
      margin-left: 15px;
      font-size: 20px;
      font-weight: 200;
      color: black;
    }
  }

  .header-right {
    height: 100%;
    width: 50%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;

    .route-slider-openner {
      border-left: solid 1px rgba(128, 128, 128, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: $header-height;

      img {
        margin: 0;
        width: calc(#{$header-height} - 30px);
        height: auto;
      }
    }
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
