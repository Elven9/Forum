<template>
  <div class="add-post-container">
    <div class="main-container">
      <div class="editor-header">
        <span class="title">新增文章</span>
        <div class="submit-button"><b-button @click="submitPost">確認送出</b-button></div>
      </div>
      <span class="title">封面圖片</span>
      <div class="drag-and-drop">
        <div ref="drop-area" class="drop-area"
          @drop.prevent="initialDrop"
          @dragover.prevent
          @click="uploadFile">
          請放入圖片
        </div>
        <div class="info-area">
          <div>
            <span>圖片名稱：</span>
            <span>{{ coverInfo.name }}</span>
          </div>
          <div>
            <span>圖片大小：</span>
            <span>{{ coverInfo.size }}</span>
          </div>
          <div>
            <span>檔案類別：</span>
            <span>{{ coverInfo.type }}</span>
          </div>
        </div>
      </div>
      <span class="title">顯示樣式</span>
      <div class="button-group">
        <b-button @click="size = '1x1'">1x1</b-button>
        <b-button @click="size = '1x2'">1x2</b-button>
        <b-button @click="size = '2x2'">2x2</b-button>
        <span>目前選擇：{{ size }}</span>
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
      imgSrcs: [],
      cover: '',
      coverInfo: {
        name: '',
        size: '',
        type: '',
      },
      size: '1x1'
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
    },
    uploadFile() {
      // If Have Previous Cover, delete it.
      if (this.cover.length !== 0) { 
        window.URL.revokeObjectURL(this.cover);
        this.cover = '';
      }

      // Input 設定
      let newInput = document.createElement('input');
      newInput.type = 'file';
      newInput.accept = 'image/*';
      newInput.size = 1;

      // Add Event
      newInput.addEventListener('change', () => {
        let reader = new FileReader();
        let file = newInput.files[0];

        // Update File Info.
        let { name, size, type } = file;
        Object.assign(this.coverInfo, {name, size, type});

        reader.readAsDataURL(file);

        reader.addEventListener('load', () => {
          let fileUrl = reader.result;

          // Add to cover
          this.cover = fileUrl;

          // Render Image
          this.$refs['drop-area'].innerHTML = "";   // Clear Previous Text.
          let image = new Image();                  // Create New Image.
          image.src = fileUrl;                      // Load Image
          image.style.width = '100%';
          image.style.height = 'auto';
          image.onload = () => {
            // Add Element to Father
            this.$refs['drop-area'].appendChild(image);
          }
        })
      })
      newInput.click();
    },
    async initialDrop(dragEvent) {
      // If Have Previous Cover, delete it.
      if (this.cover.length !== 0) { 
        window.URL.revokeObjectURL(this.cover);
        this.cover = '';
      }

      // Get Data Transfer Object
      let { dataTransfer } = dragEvent;
      let { items } = dataTransfer;

      // Referenct
      let vm = this;

      // Read File
      function readFile() {
        return new Promise((res, rej) => {
          let reader = new FileReader();
          let file = items[0].getAsFile();

          if (!file) rej('Drag Item Is Not A File');

          // Update File Info.
          let { name, size, type } = file;
          Object.assign(vm.coverInfo, {name, size, type});

          reader.onload = () => {
            res(reader.result);
          }
          reader.readAsDataURL(file);
        })
      }

      // Get URL
      let fileUrl = await readFile();

      // Update to cover
      this.cover = fileUrl;

      // Render Image
      this.$refs['drop-area'].innerHTML = "";   // Clear Previous Text.
      let image = new Image();                  // Create New Image.
      image.src = fileUrl;                      // Load Image
      image.style.width = '100%';
      image.style.height = 'auto';
      image.onload = () => {
        // Add Element to Father
        this.$refs['drop-area'].appendChild(image);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$main-color: #7c7780;

.add-post-container {
  background-color: rgb(28, 27, 30);
  width: 100%;
  height: 100%;
  overflow-y: scroll;

  // Global Font Color
  color: white;

  .main-container {
    width: 80%;
    margin: 0px 10% 30px 10%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    .title {
      font-size: 24px;
      margin-top: 20px;
    }

    .editor-header {
      width: 100%;
      margin: 20px 0px 20px 0px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;

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

    .drag-and-drop {
      width: 100%;
      height: 300px;
      margin-top: 20px;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;

      .drop-area {
        width: 50%;
        height: 300px;
        border: solid $main-color 2px;
        text-align: center;
        vertical-align: middle;
        line-height: 300px;
      }

      .info-area {
        width: 50%;
        height: 300px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;

        div {
          display: flex;
          flex-direction: column;
          margin-left: 20px;
          
          span {
            font-size: 18px;
            font-weight: 300;
            color: white;
          }
        }
      }
    }

    .button-group {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      margin-top: 10px;

      button {
        margin-right: 10px;
        background-color: rgb(28, 27, 30);
      }
    }

    .editor-container {
      width: 100%;
      margin-top: 20px;
    }
  }
}

@media (max-width: 414px) {
  .add-post-container {
    .main-container {
      margin-top: 20px;

      .editor-header {
        margin: 0px 0px 20px 0px;
      }

      .drag-and-drop {
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 600px;

        .drop-area {
          width: 100%;
          height: 300px;
        }

        .info-area {
          width: 100%;
          margin: 20px 0px 20px 0px;
        }
      }
    }
  }
}
</style>
