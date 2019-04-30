<template>
  <div class="add-post-container">
    <div class="main-container">
      <div class="editor-header">
        <span class="title">新增文章</span>
        <div class="submit-button"><b-button :disabled="!isSubmitable" @click="submitPost">確認送出</b-button></div>
      </div>
      <span class="title">封面圖片</span>
      <div class="drag-and-drop">
        <div class="drop-area">
          <UploadImage promptMessage="請放入圖片" @imageAdded="updateCover"></UploadImage>
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
      <span class="title">文章分類</span>
      <div class="button-group">
        <b-button @click="type = 'ThailandBoard'">泰國版</b-button>
        <b-button @click="type = 'FoodBoard'">美食版</b-button>
        <b-button @click="type = 'Gossip'">Gossip 版</b-button>
        <span>目前選擇：{{ mapType(type) }}</span>
      </div>
      <div ref="froala" class="editor-container">
        <froala :tag="'textarea'" :config="config" v-model="content">Init text</froala>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app';
import UploadImage from 'components/UploadImage/index';

export default {
  components: {
    UploadImage
  },
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
      isSubmitable: true,
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
      type: 'ThailandBoard'
    }
  },
  computed: {
    userData() {
      return this.$store.state.userData;
    },
    userId() {
      return this.$store.state.userId;
    }
  },
  methods: {
    updateCover(event) {
      this.cover = event.cover;
      Object.assign(this.coverInfo, event.info);
    },
    mapType(type) {
      let map = {
        ThailandBoard: '泰國版',
        TaiwanBoard: '台灣版',
        Gossip: 'Gossip 版'
      }
      return map[type];
    },
    async submitPost() {
      this.isSubmitable = false;
      // 確認使用者是否登入
      if (!this.userData) {
        this.$message("登入前不能發文喔～");
        this.isSubmitable = true;
        return;
      }
      // 確認文章是否為空
      if (this.content.length === 0) {
        this.$message("請輸入內容");
        this.isSubmitable = true;
        return;
      }

      // 確認文章標題是否寫入，跟是否填入 Cover
      if (!this.cover) {
        this.$message("請上傳封面相片");
        this.isSubmitable = true;
        return;
      }

      // 確認文章標題是否寫入，跟是否填入 Cover
      if (this.title === '') {
        this.$message("請輸入標題");
        this.isSubmitable = true;
        return;
      }
      // 開始上傳
      this.$message('文章上傳中...');

      // 使用者 UID
      let userUid = this.$firebase.auth().currentUser.uid;

      // 創建文章資料
      let newDoc = await this.$db.collection('articles').add({
        userUid,
        userId: this.userId,
        userAccount: this.userData.account,
        content: '',
        size: this.size,
        title: this.title,
        subTitle: this.subTitle,
        type: this.type,
        cover: '',
        created: firebase.firestore.FieldValue.serverTimestamp()
      });

      // 處理 Image 文件，上傳到 Storage
      let dirRef = this.$storage.ref(`articles/${userUid}/${newDoc.id}`);

      // 建立檔名
      let _tempSplit = this.coverInfo.name.split('.');
      let coverFileName = `cover.${_tempSplit[_tempSplit.length - 1]}`;

      // Upload Cover
      let coverRef = dirRef.child(coverFileName);
      await coverRef.put(this.cover);

      console.log('[Info]: Cover Upload Completed.');

      // Upload Img In Content
      // Get Blob Object and Original Url
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
            // Upload File and Get Real Url
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

      // Update Content And Cover Url
      await newDoc.update({
        content: this.content,
        cover: await coverRef.getDownloadURL()
      });

      // 結束上傳
      this.$message('文章上傳成功！');
      this.isSubmitable = true;
      console.log('[Info]: Upload Completed.');
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
  -webkit-overflow-scrolling: touch;

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
      margin-top: 10px;
    }

    .editor-header {
      width: 100%;
      margin: 15px 0px 20px 0px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;

      .title {
        flex-grow: 10;
        font-size: 36px;
        margin: 0px;
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
      margin: 10px 0px 0px 0px;
      width: 80%;

      .form-group {
        margin: 0px;
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

      .fr-box {
        .fr-wrapper {
          div {
            a {
              display: none !important;
            }
          }
        }
      }
    }
  }
}

@media (max-width: 414px) {
  .add-post-container {
    .main-container {
      margin: 20px 5% 30px 5%;
      width: 90%;

      .editor-header {
        margin: 0px 0px 10px 0px;
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
