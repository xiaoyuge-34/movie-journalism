// 入口文件
import Vue from 'vue'


//导入路由的包
import VueRouter from 'vue-router'
//导入vue-resource
import VueResource from 'vue-resource'
//安装resource
Vue.use(VueResource)
//导入mint-ui组件
import {Swipe,SwipeItem} from 'mint-ui'
Vue.component(Swipe.name,Swipe)
Vue.component(SwipeItem.name,SwipeItem)
//安装路由
Vue.use(VueRouter)
//导入自己的router.js模块
import router from './router.js'
import  app from './App.vue'
import  "./lib/mui/css/mui.min.css"
import './appback.js'
var vm = new Vue({
    el:'#app',
    render:c =>c(app),
    router  //挂载路由对象
})