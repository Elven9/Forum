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
      <span class="title">文章標題</span>
      <div class="form-input">
        <b-form-group
          label-for="title-input"
          description="放入文章標題，會顯示在文章列表裡面與文章開頭"
        >
          <b-form-input
            id="title-input"
            v-model="title"
            type="text"
            required
            placeholder="輸入標題"
          ></b-form-input>
        </b-form-group>
      </div>
      <span class="title">文章副標</span>
      <div class="form-input">
        <b-form-group
          label-for="title-input-sub"
          description="放入文章副標，會顯示在文章列表裡面與文章開頭"
        >
          <b-form-input
            id="title-input-sub"
            v-model="subTitle"
            type="text"
            required
            placeholder="輸入副標題"
          ></b-form-input>
        </b-form-group>
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
import firebase from 'firebase';

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
      cover: null,
      coverInfo: {
        name: '',
        size: '',
        type: '',
      },
      size: '1x1',
      title: '',
      subTitle: '',
    }
  },
  methods: {
    async submitPost() {
      // 確認文章是否為空
      if (this.content.length === 0) {
        console.error("Can't Submit Empty Post To Server.");
        return;
      }

      // 確認文章標題是否寫入，跟是否填入 Cover
      if (!this.cover) {
        console.error("Can't Submit Without Uploading Cover");
        return;
      }

      // 確認文章標題是否寫入，跟是否填入 Cover
      if (this.title === '') {
        console.error("Can't Submit Without Writing Title");
        return;
      }

      // 確認使用者是否登入中
      if (!this.$firebase.auth().currentUser) {
        console.error('You Have to Login Before You Submit the Article.');
        return;
      }

      // 創建文章資料
      let newDoc = await this.$db.collection('articles').add({
        content: this.content,
        size: this.size,
        title: this.title,
        subTitle: this.subTitle,
        cover: '',
        created: firebase.firestore.FieldValue.serverTimestamp()
      });

      // 處理 Image 文件，上傳到 Storage
      let dirRef = this.$storage.ref(`articles/${newDoc.id}`);

      // 建立檔名
      let _tempSplit = this.coverInfo.name.split('.');
      let coverFileName = `cover.${_tempSplit[_tempSplit.length - 1]}`;

      // Upload Cover
      let coverRef = dirRef.child(coverFileName);
      await coverRef.put(this.cover);

      // Change Doc Cover Link
      await newDoc.update({
        cover: await coverRef.getDownloadURL()
      });
      console.log('[Info]: Cover Upload Completed.');

      // Upload Img In Content
      let promises = [];
      for (let i = 0; i < this.imgSrcs.length; i++) {
        promises.push(new Promise(async (res, rej) => {
          try {
            let url = this.imgSrcs[i];
            let img = await fetch(url);
            let blob = await img.blob();
            res({ url, blob });
          } catch (err) {
            rej(err);
          }
        }));
      }

      // Process Promise.
      let result = await Promise.all(promises);

      // Upload All Image
      let processes = [];
      for (let i = 0; i < result.length; i++) {
        processes.push(new Promise(async (res, rej) => {
          try {
            // Upload File
            let type = result[i].blob.type === 'image/png' ? '.png' : '.jpg';
            let imgRef = dirRef.child(`${i}${type}`);
            await imgRef.put(result[i].blob);
            let toReplace = await imgRef.getDownloadURL();
            res({ url: result[i].url, toReplace });
          } catch (err) {
            rej(err);
          }
        }));
      }

      // Process promise
      let toReplace = await Promise.all(processes);
      console.log('[Info]: All Content Img Uploaded Completed.');

      // Replace
      for (let i = 0; i < toReplace.length; i++) {
        this.content = this.content.replace(toReplace[i].url, toReplace[i].toReplace);
      }

      // Update Content
      await newDoc.update({ content: this.content });
      console.log('[Info]: Upload Completed.');
    },
    uploadFile() {
      // If Have Previous Cover, delete it.
      if (this.cover) { 
        this.cover = null;
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

        // Add to cover
        this.cover = file;

        // Update File Info.
        let { name, size, type } = file;
        Object.assign(this.coverInfo, {name, size, type});

        reader.readAsDataURL(file);

        reader.addEventListener('load', () => {
          let fileUrl = reader.result;

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
      if (this.cover) { 
        this.cover = null;
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

          // Update to cover
          vm.cover = file;

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
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
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

    .form-input {
      margin-top: 15px;
      width: 80%;
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

      .form-input {
        margin-top: 15px;
        width: 100%;
      }
    }
  }
}
</style>
