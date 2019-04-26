<template>
  <div class="add-post-container">
    <div class="main-container">
      <div class="editor-header">
        <span class="title">新增文章</span>
        <div class="submit-button"><b-button @click="submitPost">確認送出</b-button></div>
      </div>
      <div ref="froala" class="editor-container">
        <froala :tag="'textarea'" :config="config" v-model="content">Init text</froala>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      config: {
        placeholderText: '隨心所欲的揮灑空間',
        height: Math.floor(window.innerHeight * 0.6),
        fileAllowedTypes: [ 'image/jpeg', 'image/png' ],
        fileMaxSize: 1024 * 1024 * 10,
        events: {
          'froalaEditor.image.loaded': (e, editor, $img) => {
            this.imgSrcs.push($img.attr('src'));
          },
          'froalaEditor.image.removed': (e, editor, $img) => {
            this.imgSrcs.splice(this.imgSrcs.indexOf($img.attr('src')), 1);
          }
        }
      },
      content: '',
      imgSrcs: []
    }
  },
  methods: {
    async submitPost() {
      // 確認文章是否為空
      if (this.content.length === 0) {
        console.error("Can't Submit Empty Post To Server.");
        return;
      }
      // let newDoc = await this.$db.collection('articles').add({
      //   content:
      // });

      // // 處理 Image 文件，上傳到 Storage
      // for (let url of this.imgSrcs) {
        
      // }
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
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    .editor-header {
      width: 100%;
      display: flex;
      flex-direction: row;

      .title {
        flex-grow: 10;
        font-size: 36px;
      }
      
      .submit-button {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        button {
          background-color: rgb(28, 27, 30);
        }
      }
    }

    .editor-container {
      width: 100%;
      margin-top: 30px;
    }
  }
}
</style>
