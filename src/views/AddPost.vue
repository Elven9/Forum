<template>
  <div class="add-post-container">
    <div class="main-container">
      <froala :tag="'textarea'" :config="config" v-model="test">Init text</froala>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      config: {
        placeholderText: 'Edit Your Content Here!',
        charCounterCount: false
      },
      test: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.add-post-container {
  background-color: rgb(28, 27, 30);
  width: 100%;
  height: 100%;

  // Global Font Color
  color: white;

  .main-container {
    width: 80%;
    height: 100%;
    margin: 0px 10% 0px 10%;
  }
}
</style>
