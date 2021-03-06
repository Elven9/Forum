<template>
  <div ref="app" id="app">
    <div class="header">
      <div class="header-left">
        <div @click.stop="toggleSlider" v-if="windowWidth <= 1024" class="route-slider-openner">
          <img src="~/assets/Layout/open-menu-icon.svg" alt="">
        </div>
        <span class="header-tag-content">Forumas</span>
      </div>
      <div class="header-right">
        <div @click.stop="toggleUser" class="route-slider-openner">
          <img src="~/assets/Layout/group.svg" alt="user">
        </div>
      </div>
    </div>
    <!-- Construct Layout -->
    <div class="outer-container">
      <div ref="slider" @click="closeSlider" class="route-slider"><RouteSlider/></div>
      <div class="main-view"><router-view/></div>
      <div ref="user-info" @click="closeUser"  class="user-info"><UserInfo/></div>
    </div>
  </div>
</template>

<script>
import RouteSlider from 'components/Layout/RouteSlider';
import UserInfo from 'components/Layout/UserInfo';

import * as firebase from 'firebase/app'

export default {
  data() {
    return {
      windowWidth: window.innerWidth,

      // event listener
      resizeHandler: null,
      closeAllSidebar: null
    }
  },
  methods: {
    toggleSlider() {
      // Close user if open
      if (window.innerWidth <= 414 && this.$refs['user-info'].style.right === '0px') this.closeUser();
      // Change Left Value
      this.$refs.slider.style.left = this.$refs.slider.style.left !== '0px' ? '0px' : window.innerWidth > 414 ? '-160px' : '-100vw';
    },
    closeSlider() {
      // Disable Click if Width > 1024
      if (window.innerWidth > 1024) return;
      // Change Left Value
      this.$refs.slider.style.left = window.innerWidth > 414 ? '-160px' : '-100vw';
    },
    toggleUser() {
      // Close Route If Open
      if (window.innerWidth <= 414 && this.$refs.slider.style.left === '0px') this.closeSlider();
      // Change Right Value
      this.$refs['user-info'].style.right = this.$refs['user-info'].style.right !== '0px' ? '0px' : window.innerWidth > 414 ? '-350px' : '-100vw';
    },
    closeUser() {
      this.$refs['user-info'].style.right = window.innerWidth > 414 ? '-350px' : '-100vw';
    }
  },
  components: {
    RouteSlider,
    UserInfo
  },
  mounted() {
    // Add Handler to Data For Destroing.
    this.resizeHandler = () => { this.windowWidth = window.innerWidth; }
    window.addEventListener('resize', this.resizeHandler);

    // Cloud Messaging
    // Add Push Notification
    if (this.$isSupportMessaging) {
      firebase.messaging().onMessage(payload => {
        const { body } = payload.data;
        const data = JSON.parse(body);
        
        // Create Notification
        let notification = new Notification(`${data.author} 發佈了 ${data.title}！`, {
          icon: '/social-media.png',
          body: data.subTitle
        });

        // Close After three seconds
        window.setTimeout(() => { notification.close() }, 3000);
      })
    
      this.$firebase.messaging().requestPermission().then(async () => {
        console.log('Get Permission');
        
        // Get Token
        let token;
        try {
          token = await this.$firebase.messaging().getToken();
        } catch (err) {
          console.error('Error When Retrieving Token', err);
          return;
        }
        // Send Token Back To Server
        try {
          await this.$functions.httpsCallable('registedToken')({
            token
          })
        } catch (err) {
          console.error(err);
        }

        // Add Fore Ground Message Request

      }).catch((err) => {
        console.error('Unable to get permission to notify.', err);
      })
    }

    // Add Window Click Event To Close Side Bar
    this.closeAllSidebar = () => {
      this.closeSlider();
      this.closeUser();
    }
    window.addEventListener('click', this.closeAllSidebar);
  },
  beforeDestroy() {
    window.removeEventListener(this.resizeHandler);
    window.removeEventListener(this.closeAllSidebar);
  }
}
</script>

<style lang="scss">
$message-box-height: 50px;

#app {
  background-color: rgb(28, 27, 30);

  .message-box {
    position: absolute;
    top: -$message-box-height - 10px;
    height: $message-box-height;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
    animation-duration: 3s;

    &.start-animation {
      animation: show-message 3s 1;
    }

    div {
      width: 300px;
      height: 100%;
      background-color: rgb(28, 27, 30);
      border-radius: 5px;
      box-shadow: 0 4px 8px 0 rgba(255, 255, 255, 0.3), 0 6px 20px 0 rgba(255, 255, 255, 0.29);
      display: flex;
      justify-content: center;
      align-items: center;

      p {
        color: white;
        margin: 0px;
      }
    }
  }
}

// Message Animation
@keyframes show-message {
  0% {
    top: -$message-box-height - 10px;
  }
  20% {
    top: 20px;
  }
  80% {
    top: 20px;
  }
  100% {
    top: -$message-box-height - 10px;
  }
}
</style>


<style lang="scss" scoped>
$slider-width: 160px;
$icon-width: 65px;
$icon-offset: 10px;
$header-height: 70px;
$user-info-width: 350px;
$main-color: white;

#app {
  height: 100vh;
  width: 100%;
  position: relative;

  .header {
    width: 100%;
    height: $header-height;
    border-bottom: solid 1px rgba(128, 128, 128, 0.5);
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    background-color: rgb(28, 27, 30);

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
        min-width: $header-height;

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
        font-weight: 300;
        color: $main-color;
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
        min-width: $header-height;

        img {
          margin: 0;
          width: calc(#{$header-height} - 30px);
          height: auto;
        }
      }
    }
  }

  .outer-container {
    position: relative;
    height: calc(100vh - #{$header-height});
    width: 100%;
    overflow: hidden;

    .route-slider {
      height: 100%;
      position: absolute;
      left: 0px;
      z-index: 10;
      transition: all 0.8s;
      transition-timing-function: ease;
      border-right: solid 1px rgba(128, 128, 128, 0.5);
    }

    .main-view {
      height: 100%;
      position: absolute;
      left: $slider-width;
      width: calc(100% - #{$slider-width});
    }

    .user-info {
      height: 100%;
      position: absolute;
      right: -1 * $user-info-width;
      z-index: 10;
      transition: all 0.8s;
      transition-timing-function: ease;
    }
  }
}

@media (max-width: 1024px) and (min-width: 415px) {
  #app {
    .outer-container {
      .route-slider {
        left: -1 * $slider-width;
      }

      .main-view {
        width: 100%;
        left: 0px;
      }
    }
  }
}

@media (max-width: 414px) {
  $slider-width: 100vw;

  #app {
    .header {
      .header-left {
        width: 80%;
      }
      .header-right {
        width: 20%;
      }
    }

    .outer-container {
      .route-slider {
        top: 0px;
        left: -1 * $slider-width;
      }

      .main-view {
        width: 100%;
        left: 0px;
      }

      .user-info {
        height: 100vh;
        position: absolute;
        top: 0px;
        right: -1 * 100vw;
      }
    }
  }
}
</style>
