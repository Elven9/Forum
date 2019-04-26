<template>
  <div class="home-container">
    <div class="home-grid-layout"></div>
  </div>
</template>

<script>

export default {
  name: 'home'
}
</script>

<style lang="scss" scoped>
$grid-layout-height: 150px;

.home-container {
  width: calc(101% + 5px);
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
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
  $grid-layout-height: 190px;
  .home-container {
    .home-grid-layout {
      grid-template-columns: repeat(4, 25%);
      grid-template-rows: repeat(6, $grid-layout-height);
    }
  }
}

@media (max-width: 414px) {
  $grid-layout-height: 200px;
  .home-container {
    .home-grid-layout {
      grid-template-columns: repeat(2, 50%);
      grid-template-rows: repeat(6, $grid-layout-height);
    }
  }
}
</style>

