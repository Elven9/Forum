<template>
  <div class="slider-container">
    <div class="route-container" v-for="route in routeList" :key="route.id">
      <router-link :to="route.link">
        <div class="route-inner-container">
          <img :src="route.icon" :alt="route.name">
          <span>{{ route.name }}</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
// Import Icon Image
import home from 'assets/Route/home.svg'

export default {
  data() {
    return {
      routeList: [
        { name: 'home 首頁', icon: home, link: '/' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
$route-slider-width: 160px;
$main-color: #FFD76B;
$main-hover-color: #FFE8A8;
$route-link-height: 100px;
$route-link-height-414: 80px;
$icon-size: 25px;
$link-font-size: 20px;
$link-font-size-414: 26px;
$link-font-family: 'Quicksand', sans-serif;

.slider-container {
  height: 100%;
  width: $route-slider-width;
  background-color: rgba(0, 0, 0, 0.7);
  
  .route-container {
    width: 80%;
    height: $route-link-height;
    border-bottom: solid $main-color 2px;
    margin: 0px 10% 0px 10%;
    transition: all 0.5s;

    &:hover {
      a {
        .route-inner-container {
          span {
            color: $main-hover-color;
          }
        }
      }
    }

    a {
      text-decoration: none;

      .route-inner-container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        img {
          margin-top: 20px;
          width: $icon-size;
          height: $icon-size;
        }

        span {
          margin-top: 5px;
          font-family: $link-font-family;
          font-size: $link-font-size;
          color: $main-color;
        }
      }
    }
  }
}

@media (max-width: 414px) {
  .slider-container {
    width: 100vw;

    .route-container {
      height: $route-link-height-414;
      width: 90%;
      margin: 0px 5% 0px 5%;

      a {
        .route-inner-container {
          flex-direction: row;
          justify-content: flex-start;

          img {
            margin-top: 0px;
            margin-left: 20px;
          }

          span {
            font-size: $link-font-size-414;
            margin-left: 30px;
          }
        }
      }
    }
  }
}
</style>
