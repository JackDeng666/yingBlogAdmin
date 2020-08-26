import Vue from 'vue'
import Router from 'vue-router'

import Index from '../pages/Index.vue'
import Login from '../pages/Login.vue'
import SiteInfo from '../pages/siteinfo/SiteInfo.vue'
import BlogList from '../pages/blog/BlogList.vue'
import EditBlog from '../pages/blog/EditBlog.vue'
import BlogTypeList from '../pages/blog/BlogTypeList.vue'
import UserList from '../pages/user/UserList.vue'
import MessageList from '../pages/message/MessageList.vue'
import CommentList from '../pages/comment/CommentList.vue'
import SongList from '../pages/song/SongList.vue'
import Song from '../pages/song/Song.vue'

Vue.use(Router)

const router =  new Router({
  routes: [
    {path: '/login', component: Login},
    {path: '/', redirect: '/index'},
    {path: '/index', component: Index,
      children:[
        {path: '', component: SiteInfo},
        {path: '/siteinfo', component: SiteInfo},
        {path: '/bloglist', component: BlogList},
        {path: '/editblog', component: EditBlog},
        {path: '/blogtypelist', component: BlogTypeList},
        {path: '/userlist', component: UserList},
        {path: '/messagelist', component: MessageList},
        {path: '/commentlist', component: CommentList},
        {path: '/songList', component: SongList},
        {path: '/song', component: Song}
      ]
    }
  ]
})
// 路由守卫
router.beforeEach((to,from,next) => {
  let isLogin = sessionStorage.jdAdminToken ? true : false
  if (to.path === '/login' || isLogin) return next()
  next('/login')
})

export default router