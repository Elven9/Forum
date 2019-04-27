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
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      article: null
    }
  },
  async mounted() {
    let rawData = await this.$db.collection('/articles').doc(this.$route.path.slice(9)).get();
    this.article = rawData.data();
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


