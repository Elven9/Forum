<template>
  <div ref="block" class="message-single-block">
    <!-- 1x1 Block Style -->
    <div v-if="size === '1x1'" class="block-content-1x1">
      <div class="background-mask">
        <span class="title-1x1">{{ title }}</span>
        <div class="author">
          <p>{{ author }}</p>
        </div>
      </div>
    </div>
    <!-- 1x2 Block Style -->
    <div v-if="size === '1x2'" class="block-content-1x2">
      <div class="background-mask">
        <span class="title-1x2">{{ title }}</span>
        <span class="brief-content-1x2">{{ briefContent }}</span>
        <div class="author">
          <p>{{ author }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    size: {
      type: String,
      required: true
    },
    position: {
      // rowStart, rowEnd, columnStart, columnEnd
      type: Object,
      required: true
    },
    title: String,
    briefContent: String,
    like: Number,
    author: String,
    background: String
  },
  mounted() {
    // Update Grid Position
    this.$refs.block.style['grid-area'] = `${this.position.rowStart} / ${this.position.columnStart} / ${this.position.rowEnd} / ${this.position.columnEnd}`
    
    // Update Background / Avatar
    this.$refs.block.style['background-image'] = `url(${this.background})`;
    this.$refs.block.style['background-blend-mode'] = 'multiply';
    this.$refs.block.style['background-size'] = this.size === '1x1' ? 'auto 100%' : '100% auto';
    this.$refs.block.style['background-repeat'] = 'no-repeat';
    this.$refs.block.style['background-position'] = 'center';
  }
}
</script>

<style lang="scss" scoped>
// Mixin for background mask, and flex inside it.
@mixin background-mask-and-flex {
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

// Message Block Span Default CSS
@mixin span-default-property() {
  color: white;
  margin: 10px 5px 0px 5px;
  width: calc(100% - 10px);
  overflow: hidden;
  text-overflow: ellipsis;
}

// Message Block Author Default CSS
@mixin author-default-property() {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  width: calc(100% - 10px);
  margin: 0px 5px 0px 5px;
  width: calc(100% - 10px);

  p {
    color: white;
    height: 100%;
    margin: 0px;
    opacity: 0.8;
  }
}

.message-single-block {
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  margin: 10px;
  border-radius: 6px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4), 0 6px 20px 0 rgba(0, 0, 0, 0.39);

  .block-content-1x1 {
    width: 100%;
    height: 100%;

    .background-mask {
      @include background-mask-and-flex();
    
      span {
        @include span-default-property();

        &.title-1x1 {
          font-size: 20px;
          height: calc(70% - 10px);
        }
      }

      .author {
        @include author-default-property();
        height: 30%;

        p {
          font-size: 16px;
        }
      }
    }
  }

  .block-content-1x2 {
    width: 100%;
    height: 100%;

    .background-mask {
      @include background-mask-and-flex();

      span {
        @include span-default-property();

        &.title-1x2 {
          font-size: 20px;
          height: calc(30% - 10px);
        }

        &.brief-content-1x2 {
          font-size: 14px;
          height: calc(40% - 10px);
        }
      }

      .author {
        @include author-default-property();
        height: 30%;

        p {
          font-size: 16px;
        }
      }
    }
  }
}
</style>
