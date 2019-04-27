import Vue from 'vue';
import Router from 'vue-router';
import Home from 'views/Home.vue';
import AddPost from 'views/AddPost';
import Article from 'views/Article';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/category/ThailandBoard'
    },
    {
      path: '/category/:type',
      name: 'Home 首頁',
      component: Home
    },
    {
      path: '/addPost',
      name: 'Add Post 新增文章',
      component: AddPost
    },
    {
      path: '/article/:id',
      name: 'Article 單頁文章',
      component: Article
    }
  ]
})
