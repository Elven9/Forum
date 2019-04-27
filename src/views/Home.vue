<template>
  <div class="home-container">
    <div class="home-grid-layout" v-for="b in messages" :key="b.id">
      <MessageBlock
        v-for="m in b"
        :key="m.id"
        :id="m.id"
        :size="m.size"
        :position="{
          rowStart: m.position.rowStart,
          rowEnd: m.position.rowEnd,
          columnStart: m.position.columnStart,
          columnEnd: m.position.columnEnd
        }"
        :title="m.title"
        :briefContent="m.subTitle"
        :author="m.userAccount"
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
  methods: {
    returnMapArea() {
      if (window.innerWidth > 768) {
        // 6x6
        let result = [];
        for (let i = 0; i < 6; i++) {
          result.push([]);
          for (let j = 0; j < 6; j++){
            result[i][j] = true;
          }
        }
        return result;
      } else if (window.innerWidth <= 768 && window.innerWidth > 414) {
        // 6x4
        let result = [];
        for (let i = 0; i < 6; i++) {
          result.push([]);
          for (let j = 0; j < 4; j++){
            result[i][j] = true;
          }
        }
        return result;
      } else if (window.innerWidth <= 414) {
        // 2x6
        let result = [];
        for (let i = 0; i < 6; i++) {
          result.push([]);
          for (let j = 0; j < 2; j++){
            result[i][j] = true;
          }
        }
        return result;
      }
    },
    async getData() {
      // 向 DB 拿資料
      let rawData = await this.$db.collection('articles').where('type', '==', this.$route.path.slice(10)).get();
      
      // Construct Message
      let queue = [];
      for (let q of rawData.docs) {
        let payload = { id: q.id };
        Object.assign(payload, q.data());
        queue.push(payload);
      }

      // 整理資料
      let result = [];
      let map = this.returnMapArea();
      let mapRowL = map.length;
      let mapColumnL = map[0].length;
      let singleBlock = [];
      
      for (let i = 0; i < queue.length; i++) {
        // 掃現在哪些地方還可以 Render
        let hasPosition = false;
        for (let r = 0; r < mapRowL; r++) {
          for (let c = 0; c < mapColumnL; c++) {
            if (map[r][c]) {
              // 有空位
              if (queue[i].size === '1x2') {
                if (c+1 < mapColumnL && map[r][c+1]) {
                  queue[i].position = {
                    rowStart: r+1,
                    rowEnd: r+2,
                    columnStart: c+1,
                    columnEnd: c+3
                  }
                  singleBlock.push(queue[i]);
                  map[r][c] = false;
                  map[r][c+1] = false;
                  hasPosition = true;
                  break;
                }
              } else if (queue[i].size === '2x2') {
                if (r+1 < mapRowL && c+1 < mapColumnL && map[r][c+1] && map[r+1][c] && map[r+1][c+1]) {
                  queue[i].position = {
                    rowStart: r+1,
                    rowEnd: r+3,
                    columnStart: c+1,
                    columnEnd: c+3
                  }
                  singleBlock.push(queue[i]);
                  map[r][c] = false;
                  map[r][c+1] = false;
                  map[r+1][c] = false;
                  map[r+1][c+1] = false;
                  hasPosition = true;
                  break;
                }
              } else if (queue[i].size === '1x1') {
                queue[i].position = {
                  rowStart: r+1,
                  rowEnd: r+2,
                  columnStart: c+1,
                  columnEnd: c+2
                }
                singleBlock.push(queue[i]);
                // Update Map
                map[r][c] = false;
                hasPosition = true;
                break;
              }
            }
          }
          if (hasPosition) break;
        }
        if (!hasPosition) {
          result.push(singleBlock);

          // rst
          singleBlock = [];
          map = this.returnMapArea();
          i--;
        } else {
          continue;
        }
      }
      result.push(singleBlock);

      this.messages = result;
    },
    clearData() {
      this.messages = [];
    }
  },
  watch: {
    $route() {
      this.clearData();
      this.getData();
    }
  },
  mounted() {
    this.clearData();
    this.getData();
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
  $grid-layout-height: 140px;
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

