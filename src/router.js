import VueRouter from 'vue-router'

import home from './components/home.vue'
import video from './components/video.vue'
import message from './components/message.vue'
import my from './components/my.vue'
import videos1 from './video/videos1.vue'
import search from './video/search.vue'
import outLink from './components/outLink.vue'
// 3. 创建路由对象
var router = new VueRouter({
    routes: [
        {path: '/', redirect: '/home'},
        {path: '/home', component: home},
        {path: '/video', component: video},
        {path: '/message', component: message},
        {path: '/my', component: my},
        {path: '/home/videos1/:id', component: videos1},
        {path: '/home/search/:search', component: search},
        {path: '/video/search/:search', component: search},
        {path: '/outLink', component: outLink},

    ],
    linkActiveClass: 'mui-active'//设置默认高亮类
})

// 把路由对象暴露出去
export default router