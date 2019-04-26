<template>
  <div class="user-info-c">
    <div v-if="!isLogin" class="user-container-logout">
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
    <div v-else class="user-container-login"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      account: '',
      pass: '',
      isLogin: false
    }
  },
  methods: {
    async login() {
      // 進行登入的動作
      try {
        await this.$firebase.auth().signInWithEmailAndPassword(this.account, this.pass);
        this.isLogin = true;
        this.account = '';
        this.pass = '';
      } catch (err) {
        console.error('Login Failed.');
      }
    },
    async register() {
      // Registerd
      try {
        await this.$firebase.auth().createUserWithEmailAndPassword(this.account, this.pass);
        this.login();
        this.isLogin = true;
        this.account = '';
        this.pass = '';
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

// Container Common Property
@mixin user-container() {
  height: 100%;
  width: 100%;
  background-color: rgba(28, 27, 30, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border-left: solid $main-color 2px;
}

// Collapase Style
@mixin collapse-style() {
  width: 80%;

  .card {
    background-color: rgba(28, 27, 30, 0.9);
    border: none;

    .card-body {
      background-color: rgba(28, 27, 30, 0.9);
      color: $main-color;

      button {
        background-color: rgba(28, 27, 30, 0.9);
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
      background-color: rgba(28, 27, 30, 0.9);
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
  }
}

@media (max-width: 414px) {
  .user-info-c {
    width: 100vw;
  }
}
</style>
