<template>
  <div class="article-container">
    <div v-if="article" class="article-inner-container">
      <span class="title">{{ article.title }}</span>
      <span class="author">By {{ article.userAccount.split('@')[0] }}</span>
      <div class="cover-container">
        <img :src="article.cover" alt="cover">
      </div>
      <span class="cover-text">Cover Photo</span>
      <div class="article-content-container" v-html="article.content"></div>
      <div v-if="comment" class="comment-container">
        <b-card v-for="c in comment" :key="c.id">
          <b-card-sub-title>{{ c.userName }}</b-card-sub-title>
          <b-card-text>
            {{ c.comment }}
          </b-card-text>
          <div slot="footer"><small class="text-muted">Created at {{ mapTime(c.created) }}</small></div>
        </b-card>
      </div>
      <div class="comment-container">
        <b-card>
          <b-form-input v-model="inputComment" placeholder="輸入留言"></b-form-input>
          <div class="button-c"><b-button :disabled="inputComment.length === 0" @click="leaveComment">輸入</b-button></div>
          <div slot="footer"><small class="text-muted">盡情揮灑的空間</small></div>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app';

export default {
  data() {
    return {
      article: null,
      inputComment: '',
      comment: null,
      commentSubscribe: null
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
    mapTime(timestamp) {
      return this.$moment(timestamp.toDate()).format("dddd, MMMM Do YYYY, h:mm:ss a")
    },
    async leaveComment() {
      if (this.inputComment.length === 0) {
        console.error('請輸入留言後再按輸入');
        return;
      }

      if (!this.user) {
        console.error('請登入後再留言');
        return;
      }

      // 上傳
      await this.$db.collection('/articles').doc(this.$route.path.slice(9)).collection('comments').add({
        userName: this.user.account.split('@')[0],
        userId: this.userId,
        comment: this.inputComment,
        created: firebase.firestore.FieldValue.serverTimestamp()
      });

      this.inputComment = '';
    },
    clearData() {
      if (this.commentSubscribe) this.commentSubscribe();
      this.article = null;
      this.comment = '';
      this.comment = null;
    },
    async getData() {
      let docRef = this.$db.collection('/articles').doc(this.$route.path.slice(9));
      let rawData = await docRef.get();
      this.article = rawData.data();

      let commentRaw = await docRef.collection('comments').orderBy('created', 'asc').limit(10).get();
      this.comment = commentRaw.docs.map(d => d.data());

      // Add Event
      this.commentSubscribe = docRef.collection('comments').onSnapshot((snapshot) => {
        snapshot.docChanges().forEach(c => {
          if (c.type == 'modified') this.comment.push(c.doc.data());
        })
      });
    }
  },
  watch: {
    $route() {
      this.clearData();
      this.getData();
    }
  },
  async mounted() {
    this.clearData();
    this.getData();
  },
  beforeDestroy() {
    this.commentSubscribe();
  }
}
</script>

<style lang="scss" scoped>
.article-container {
  width: 100%;
  height: 100%;
  background-color: rgb(28, 27, 30);
  overflow-y: scroll;
  overflow-x: hidden;

  .article-inner-container {
    width: 80%;
    margin: 20px 10% 0px 10%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    .title {
      color: white;
      font-size: 36px;
    }

    .author {
      color: white;
      opacity: 0.7;
      font-size: 20px;
      font-weight: 300;
    }

    .cover-container {
      width: 100%;
      height: 400px;
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      overflow: hidden;

      img {
        width: 100%;
        height: auto;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4), 0 6px 20px 0 rgba(0, 0, 0, 0.39);
      }
    }
    .cover-text {
      color: white;
      opacity: 0.5;
      font-size: 16px;
      font-weight: 300;
      width: 100%;
      text-align: center;
      border-bottom: solid rgba(128, 128, 128, 0.5) 2px;
      padding-bottom: 20px;
    }

    .comment-container {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-top: 20px;
      margin-bottom: 20px;

      .card {
        width: 100%;
        margin: 10px 0px 10px 0px;

        .card-body {
          .card-text {
            margin-top: 5px;
          }
        }

        .button-c {
          width: 100%;
          display: flex;
          justify-content: flex-end;
          align-items: center;

          button {
            margin: 10px 0px 10px 0px;
          }
        }
      }
    }
  }
}

@media (max-width: 414px) {
  .article-container {
    .article-inner-container {
      .cover-container {
        height: 260px;
      }
    }
  }
}
</style>

<style lang="scss">
.article-content-container {
  margin-top: 20px;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-bottom: solid rgba(128, 128, 128, 0.5) 2px;
  padding-bottom: 20px;

  p {
    width: 100%;
    font-size: 16px;
    color: white;
    text-align: left;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 5px 0px 5px 0px;

    img {
      width: 60% !important;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4), 0 6px 20px 0 rgba(0, 0, 0, 0.39);
    }
  }
}

@media (max-width: 414px) {
  .article-content-container {
    p {
      img {
        width: 100% !important;
      }
    }
  }
}
</style>


