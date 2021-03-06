<template>
  <div class="user-info-c">
    <div v-if="isLogin" class="user-container-login">
      <span class="name-text">{{ `${user.account.split('@')[0]},` }}</span>
      <span class="name-text">歡迎光臨</span>
      <div class="avatar-container">
        <img v-if="user.avatar !== ''" :src="user.avatar" alt="avatar">
        <UploadImage v-else 
          promptMessage="請上傳大頭貼"
          @imageAdded="uploadAvatar">
        </UploadImage>
      </div>
      <dir class="detail-info">
        <span>{{ `登入中帳號：${user.account}` }}</span>
      </dir>
      <b-button v-if="user.avatar" @click.stop="changeAvatar">更換大頭貼</b-button>
      <b-button @click.stop="logout">登出</b-button>
      <dir class="detail-info">
        <span>使用者發布文章</span>
      </dir>
      <div class="user-article-container">
        <div v-for="m in articles" :key="m.id" class="user-article">
          <MessageBlock
            :id="m.id"
            size="2x2"
            :position="{
              rowStart: 1,
              rowEnd: 3,
              columnStart: 1,
              columnEnd: 3
            }"
            :title="m.title"
            :briefContent="m.subTitle"
            :author="m.userAccount"
            :background="m.cover"
          ></MessageBlock>
        </div>
      </div>
    </div>
    <div v-else class="user-container-logout">
      <img src="~assets/UserInfo/login.svg" alt="login">
      <span class="login-text">Login 登入</span>
      <b-button v-b-toggle.login-with-pass @click.stop>密碼登入 / 帳號註冊</b-button>
      <b-collapse id="login-with-pass">
        <b-card @click.stop>
          <b-form-group
            label="帳號："
            label-for="account-input"
            description="請輸入所註冊的帳號"
            >
            <b-form-input
              id="account-input"
              v-model="account"
              type="email"
              required
              placeholder="輸入帳號"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            label="密碼："
            label-for="pass-input"
            description="請輸入註冊密碼"
            >
            <b-form-input
              id="pass-input"
              v-model="pass"
              type="password"
              required
              placeholder="輸入密碼"
            ></b-form-input>
          </b-form-group>
          <b-form-checkbox
            v-model="isLoginPersistence"
          >
            記住我的資訊
          </b-form-checkbox>
          <b-row>
            <b-col cols="6"><b-button @click.stop="login">登入</b-button></b-col>
            <b-col cols="6"><b-button @click.stop="register">註冊</b-button></b-col>
            <b-col cols="12"><b-button @click.stop="loginWithGoogle">GOOGLE 登入</b-button></b-col>
          </b-row>
        </b-card>
      </b-collapse>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app';
import MessageBlock from 'components/MessageBlock/index';
import UploadImage from 'components/UploadImage/index';

export default {
  components: {
    MessageBlock,
    UploadImage
  },
  data() {
    return {
      account: '',
      pass: '',
      isLogin: false,
      articles: [],
      isLoginPersistence: false
    }
  },
  computed: {
    user() {
      return this.$store.state.userData;
    },
    userId() {
      return this.$store.state.userId;
    }
  },
  methods: {
    changeAvatar() {
      // Delete Current User Avatar
      let userUid = this.$firebase.auth().currentUser.uid;
      let avatarRef = this.$storage.ref(`/user/${userUid}`).child(this.user.avatarLocation);
      avatarRef.delete();

      // Update DB Data
      this.$db.collection('users').doc(this.userId).update({
        avatar: '',
        avatarLocation: ''
      })

      // 更新 User Info
      this.$store.commit('SETUSERDATA', { avatar: '', avatarLocation: '' });
      this.$message('大頭貼刪除成功！');
    },
    async uploadAvatar(event) {
      this.$message('開始上傳大頭貼');

      // 整理資料
      let userUid = this.$firebase.auth().currentUser.uid;
      let _fileSplit = event.info.name.split('.')
      let fileType = _fileSplit[_fileSplit.length - 1];

      // 上傳圖片
      let avatarRef = this.$storage.ref(`/user/${userUid}`).child(`avatar.${fileType}`);
      await avatarRef.put(event.cover);

      // 更新 DB 連結
      let avatarUrl = await avatarRef.getDownloadURL();
      await this.$db.collection('users').doc(this.userId).update({
        avatar: avatarUrl,
        avatarLocation: `avatar.${fileType}`
      });

      // 更新 User Info
      this.$store.commit('SETUSERDATA', { avatar: avatarUrl });
      this.$message('大頭貼上傳成功！');
    },
    getLoginUserData(user) {
      // Get User Content
      return new Promise(async (res, rej) => {
        try {
          await this.$store.dispatch('getCurrentUser', { vm: this, account: user.email });

          // Get Articles
          let rawData = await this.$db.collection('/articles').where('userId', '==', this.userId).get();
          this.articles = rawData.docs.map(q => Object.assign({ id: q.id }, q.data()));

          res();
        } catch (err) {
          rej(err);
        }
      })
    },
    async loginWithGoogle() {
      // Create Provider
      let googleProvider = new firebase.auth.GoogleAuthProvider();

      // Check If Persistence
      if (this.isLoginPersistence) await this.$firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      else await this.$firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
      
      // Login With Google Popup
      try {
        let user = await this.$firebase.auth().signInWithPopup(googleProvider);
        user = user.user;

        // Test If Have User Data
        let result = await this.$db.collection('/users').where('userUid', '==', user.uid).get();
        if (result.docs.length === 0) {
          // Add User Data to DB
          await this.$db.collection('/users').add({
            account: user.email,
            avatar: '',
            avatarLocation: '',
            userUid: user.uid
          });
        }

        // Get Data
        await this.getLoginUserData(this.$firebase.auth().currentUser);
        
        this.isLogin = true;
      } catch (err) {
        console.error(err);
      }
    },
    async logout() {
      await this.$firebase.auth().signOut();
      this.$store.commit('CLEARUSERDATA');
    },
    async login() {
      // 進行登入的動作
      try {
        // Check If Persistence
        if (this.isLoginPersistence) await this.$firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        else await this.$firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);

        // Login With Firebase
        await this.$firebase.auth().signInWithEmailAndPassword(this.account, this.pass);

        await this.getLoginUserData(this.$firebase.auth().currentUser);
      } catch (err) {
        if (err.code === 'auth/invalid-email') this.$message('帳號格式不符');
        else if (err.code === 'auth/wrong-password') this.$message('密碼不正確');
        else if (err.code === 'auth/user-not-found') this.$message('查無此使用者');
        else this.$message('系統錯誤，請聯絡開發者');
      }
    },
    async register() {
      // Registerd
      try {
        // Create Account
        await this.$firebase.auth().createUserWithEmailAndPassword(this.account, this.pass);

        // Add User Data to DB
        await this.$db.collection('/users').add({
          account: this.account,
          avatar: '',
          avatarLocation: '',
          userUid: this.$firebase.auth().currentUser.uid
        });

        // Check If Persistence
        if (this.isLoginPersistence) await this.$firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        else await this.$firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);

        // Get Data
        await this.getLoginUserData(this.$firebase.auth().currentUser);
        
        this.account = '';
        this.pass = '';
        this.isLogin = true;
      } catch (err) {
        if (err.code === 'auth/email-already-in-use') this.$message('Email 已被使用');
        else if (err.code === 'auth/weak-password') this.$message('密碼強度不足，請嘗試一組新密碼');
        else this.$message('註冊失敗，請聯絡管理員')
      }
    }
  },
  async mounted() {
    // 確認目前使用者有無登入
    this.$firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        // User is signed in.
        await this.getLoginUserData(user);
        this.isLogin = true;
      } else {
        // No user is signed in.
        this.isLogin = false;
      }
    });
  }
}
</script>

<style lang="scss" scoped>
$route-slider-width: 350px;
$main-color: #7c7780;
$background-color: rgba(28, 27, 30, 0.9);

// Container Common Property
@mixin user-container() {
  width: 100%;
  min-height: 100%;
  background-color: $background-color;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border-left: solid rgba(128, 128, 128, 0.5) 2px;
}

// Collapase Style
@mixin collapse-style() {
  width: 80%;

  .card {
    background-color: $background-color;
    border: none;

    .card-body {
      background-color: $background-color;
      color: $main-color;

      button {
        background-color: $background-color;
        color: $main-color;
        width: calc(100% - 20px);
        margin: 10px 10px 10px 10px;
      }
    }
  }
}

@mixin full-width-button-style() {
  button {
    background-color: $background-color;
    color: $main-color;
    width: 80%;
    margin: 10px 10% 10px 10%;
  }

  @media (max-width: 414px) {
    button {
      width: 90%;
      margin: 10px 5% 10px 5%;
    }
  }
}

.user-info-c {
  height: 100%;
  width: $route-slider-width;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;

  .user-container-logout {
    @include user-container();

    img {
      margin-top: 20px;
      width: 80px;
      height: auto;
    }

    .login-text {
      margin-top: 10px;
      font-size: 32px;
      color: $main-color;
    }

    @include full-width-button-style();

    #login-with-pass {
      @include collapse-style();
    }    
  }
  
  .user-container-login {
    @include user-container();

    .avatar-container {
      margin-top: 20px;
      height: 150px;
      width: 80%;
      border-radius: 5px;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 100%;
        height: auto;
      }
    }

    .name-text {
      margin-top: 20px;
      font-size: 32px;
      color: $main-color;
      width: 90%;
      text-overflow: ellipsis;
      text-align: center;
    }

    .detail-info {
      width: 80%;
      margin-top: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0px;

      span {
        color: $main-color;
        font-size: 20px;
        font-weight: 300;
      }
    }

    @include full-width-button-style();

    .user-article-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;

      .user-article {
        width: 100%;
        display: grid;

        // Home Panel Grid Layout
        grid-template-columns: repeat(2, 50%);
        grid-template-rows: repeat(2, 100px);

        grid-gap: 0px 0px;
        place-items: stretch stretch;
      }
    }
  }
}

@media (max-width: 414px) {
  .user-info-c {
    width: 100vw;
  }
}
</style>
