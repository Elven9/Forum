<template>
  <div class="home-container">
    <div class="home-grid-layout">
      <MessageBlock
        v-for="m in messages"
        :key="m.id"
        :size="m.size"
        :position="{
          rowStart: 1,
          rowEnd: 2,
          columnStart: 1,
          columnEnd: 3
        }"
        :title="m.title"
        :briefContent="m.subTitle"
        :author="m.author"
        :background="m.cover"
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
  async mounted() {
    // 向 DB 拿資料
    let rawData = await this.$db.collection('articles').where('type', '==', this.$route.path.slice(10)).get();
    
    // Construct Message
    for (let q of rawData.docs) {
      let payload = { id: q.id };
      Object.assign(payload, q.data());
      this.messages.push(payload);
    }
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

