<template>
  <div class="user-info-c">
    <div v-if="isLogin" class="user-container-login">
      <div v-if="user.avatar !== ''" class="avatar-container"><img :src="user.avatar" alt="avatar"></div>
      <span class="name-text">{{ `${user.account.split('@')[0]}, 歡迎光臨` }}</span>
      <dir class="detail-info">
        <span>{{ `登入中帳號：${user.account}` }}</span>
      </dir>
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
        <b-card>
          <b-form-group
            label="帳號："
            label-for="account-input"
            description="請輸入所註冊的帳號"
            >
            <b-form-input
              @click.stop
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
              @click.stop
              id="pass-input"
              v-model="pass"
              type="password"
              required
              placeholder="輸入密碼"
            ></b-form-input>
          </b-form-group>
          <b-row>
            <b-col cols="6"><b-button @click.stop="login">登入</b-button></b-col>
            <b-col cols="6"><b-button @click.stop="register">註冊</b-button></b-col>
          </b-row>
        </b-card>
      </b-collapse>
    </div>
  </div>
</template>

<script>
import MessageBlock from 'components/MessageBlock/index';

export default {
  components: {
    MessageBlock
  },
  data() {
    return {
      account: '',
      pass: '',
      isLogin: false,
      articles: []
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
    async login() {
      // 進行登入的動作
      try {
        // Login With Firebase
        await this.$firebase.auth().signInWithEmailAndPassword(this.account, this.pass);

        // Get User Content
        await this.$store.dispatch('getCurrentUser', { vm: this, account: this.account });

        this.account = '';
        this.pass = '';

        // Get Articles
        let rawData = await this.$db.collection('/articles').where('userId', '==', this.userId).get();
        this.articles = rawData.docs.map(q => Object.assign({ id: q.id }, q.data()));
        this.isLogin = true;
      } catch (err) {
        console.error(err);
        console.error('Login Failed.');
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
          avatar: ''
        })

        // Login
        this.login();
      } catch (err) {
        console.error('Register Failed.');
      }
    }
  },
  mounted() {
    // 確認目前使用者有無登入
    if (this.$firebase.auth().currentUser) this.isLogin = true;
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

.user-info-c {
  height: 100%;
  width: $route-slider-width;
  overflow-y: scroll;

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

    button {
      background-color: $background-color;
      color: $main-color;
      width: 80%;
      margin: 10px 0px 10px 0px;
    }

    #login-with-pass {
      @include collapse-style();
    }    
  }
  
  .user-container-login {
    @include user-container();

    .avatar-container {
      margin-top: 30px;
      width: 80%;
      border-radius: 10px;
      overflow: hidden;

      img {
        width: 100%;
        height: auto;
      }
    }

    .name-text {
      margin-top: 10px;
      font-size: 32px;
      color: $main-color;
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

    .user-article-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

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
