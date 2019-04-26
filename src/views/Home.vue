<template>
  <div class="home-container">
    <div class="home-grid-layout">
      <MessageBlock
        size="2x2"
        :position="{
          rowStart: 1,
          rowEnd: 3,
          columnStart: 1,
          columnEnd: 3
        }"
        title="泰式奶茶真好喝"
        briefContent="來去泰國一定要先喝這杯道地的泰式奶茶囉～"
        author="Retro"
        background="https://firebasestorage.googleapis.com/v0/b/software-studio-mid-project.appspot.com/o/architecture-buildings-cars-1095901.jpg?alt=media&token=cd3b74d0-632c-48ad-99e2-8f9b35502d3c"
      ></MessageBlock>
    </div>
  </div>
</template>

<script>
import MessageBlock from 'components/MessageBlock/index';

export default {
  name: 'home',
  data() {
    return {
      messages: []
    }
  },
  components: {
    MessageBlock
  },
  mounted() {
    
  }
}
</script>

<style lang="scss" scoped>
$grid-layout-height: 150px;

.home-container {
  width: 100%;
  height: 100%;
  background-color: rgb(28, 27, 30);
  overflow-y: scroll;
  overflow-x: hidden;

  .home-grid-layout {
    width: 100%;
    display: grid;

    // Home Panel Grid Layout
    grid-template-columns: repeat(6, calc(0.166 * 100%));
    grid-template-rows: repeat(6, $grid-layout-height);

    grid-gap: 0px 0px;
    place-items: stretch stretch;
  }
}

@media (max-width: 1024px) and (min-width: 769px) {
  $grid-layout-height: 130px;
  .home-container {
    .home-grid-layout {
      grid-template-rows: repeat(6, $grid-layout-height);
    }
  }
}

@media (max-width: 768px) and (min-width: 415px) {
  $grid-layout-height: 160px;
  .home-container {
    .home-grid-layout {
      grid-template-columns: repeat(4, 25%);
      grid-template-rows: repeat(6, $grid-layout-height);
    }
  }
}

@media (max-width: 414px) {
  $grid-layout-height: 160px;
  .home-container {
    .home-grid-layout {
      grid-template-columns: repeat(2, 50%);
      grid-template-rows: repeat(6, $grid-layout-height);
    }
  }
}
</style>

