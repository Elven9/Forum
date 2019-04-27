import Vue from 'vue';
import Router from 'vue-router';
import Home from 'views/Home.vue';
import AddPost from 'views/AddPost';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/ThailandBoard'
    },
    {
      path: '/:type',
      name: 'Home 首頁',
      component: Home
    },
    {
      path: '/addPost',
      name: 'Add Post 新增文章',
      component: AddPost
    }
  ]
})
