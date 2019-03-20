<template>
    <div class="app-container">
        <!--头部-->
        <header class="mui-bar mui-bar-nav">
            <span class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" @click="back" v-show="flag">返回</span>
            <h1 id="title" class="mui-title">Help Please</h1>
        </header>


        <!--中间router内容-->
        <transition>
            <router-view></router-view>
        </transition>


        <!--底部-->
        <nav class="mui-bar mui-bar-tab">
            <router-link class="mui-tab-item " to="/home">
                <span class="mui-icon mui-icon-home"></span>
                <span class="mui-tab-label">首页</span>
            </router-link>
            <router-link class="mui-tab-item" to="/video">
                <span class="mui-icon mui-icon-videocam"></span>
                <span class="mui-tab-label">视频</span>
            </router-link>
            <router-link class="mui-tab-item" to="/message">
                <span class="mui-icon mui-icon-weibo"></span>
                <span class="mui-tab-label">新闻</span>
            </router-link>
            <router-link class="mui-tab-item" to="/my">
                <span class="mui-icon mui-icon-map"></span>
                <span class="mui-tab-label">天气</span>
            </router-link>
        </nav>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                flag: false
            }
        },
        methods: {
            back() {
                this.$router.go(-1);
            },
        },
        created(){
            this.flag= this.$route.path === '/home' ? false:true;
        },
        watch: {
            "$route.path":function (newVal) {
                if(newVal==='/home'){
                    this.flag=false;
                }else {
                    this.flag=true;
                }
            }
        },
    }
</script>


<style>
    .mui-action-back {
        color: orangered;
    }

    .app-container {
        overflow: hidden;
        padding-top: 44px;
        padding-bottom: 50px;
    }

    .v-enter {
        opacity: 0;
        transform: translateX(100%);

    }

    .v-leave-to {
        opacity: 0;
        transform: translateX(-100%);
        position: absolute;
    }

    .v-enter-active,
    .v-leave-active {
        transition: all 0.5s ease;
    }

    .mui-bar-nav {
        background-color: mediumpurple;
    }
</style>
