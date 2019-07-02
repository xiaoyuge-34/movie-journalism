<template>
    <div>
        <!--//检索框-->

        <div class="mui-input-row mui-search">
            <span class="mui-placeholder"><span class="mui-icon mui-icon-search">
            </span><span></span></span>
            <input type="search" name="search" class="mui-input-clear" placeholder="请输入查询的视频" v-model="search">
            <router-link :to="'/home/search/'+this.search">
                <button type="button" class="mui-btn mui-btn-primary">
                    搜索
                </button>
            </router-link>
        </div>


        <!--轮播图-->
        <mt-swipe :auto="4000">
            <mt-swipe-item><img src="../images/01.jpg" alt=""></mt-swipe-item>
            <mt-swipe-item><img src="../images/02.jpg" alt=""></mt-swipe-item>
            <mt-swipe-item><img src="../images/03.jpg" alt=""></mt-swipe-item>
            <mt-swipe-item><img src="../images/04.jpg" alt=""></mt-swipe-item>
        </mt-swipe>
        <!--地区-->
        <div class="mui-content">
            <ul class="mui-table-view mui-grid-view mui-grid-9">
                <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-4" @click="change('广州')"><a>
                    <span class="mui-icon mui-icon-home"></span>
                    <div class="mui-media-body">广州热映</div>
                </a></li>
                <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-4" @click="change('江门')"><a>
                    <span class="mui-icon mui-icon-reload"></span>
                    <div class="mui-media-body">江门热映</div>
                </a></li>
                <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-4" @click="change('中山')"><a>
                    <span class="mui-icon mui-icon-reload"></span>
                    <div class="mui-media-body">中山热映</div>
                </a></li>
                <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-4" @click="change('深圳')"><a>
                    <span class="mui-icon mui-icon-reload"></span>
                    <div class="mui-media-body">深圳热映</div>
                </a></li>
                <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-4" @click="change('惠州')"><a>
                    <span class="mui-icon mui-icon-reload"></span>
                    <div class="mui-media-body">惠州热映</div>
                </a></li>
                <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-4" @click="change('北京')"><a>
                    <span class="mui-icon mui-icon-reload"></span>
                    <div class="mui-media-body">北京热映</div>
                </a></li>
            </ul>
        </div>
        <!--内容-->
        <div class="content">
            <ul class="mui-table-view mui-grid-view">
                <li class="mui-table-view-cell mui-media mui-col-xs-6" v-for="item in JJVideoList">
                    <router-link :to="'/home/videos1/'+item.id">
                        <img class="mui-media-object" :src="item.images.small">
                        <div class="mui-media-body">{{item.title}}</div>
                    </router-link>
                </li>

            </ul>
        </div>
        <!--按钮-->
        <button type="button" class="mui-btn mui-btn-primary mui-btn-block" @click="add">加载更多</button>
    </div>
</template>


<script>
    import {Toast} from 'mint-ui'
    import axios from 'axios'

    export default {
        data() {
            return {
                search: '',
                JJVideoList: [],
                star: 0,
                place: '广州',
            }
        },
        created() {

            this.getJJVideo();

        },
        methods: {
            change(val) {
                this.star = 0;
                this.place = val;
                this.getJJVideo(val);

            },
            add() {
                this.star += 10;
                this.getJJVideo();
            },
            getJJVideo(val) {
                this.$http.jsonp("http://api.douban.com/v2/movie/in_theaters?apikey=0df993c66c0c636e29ecbb5344252a4a&city=" + this.place + "&start=" + this.star + "&count=10").then(result => {
                    console.log(result.body);
                    if (val !== undefined) {
                        this.JJVideoList = result.body.subjects;
                    } else {
                        this.JJVideoList = this.JJVideoList.concat(result.body.subjects);
                    }

                })
            }

        }
    }
</script>

<style scoped>
    /*区域*/
    .mui-grid-view.mui-grid-9 .mui-media{
        color: orangered;
    }
    .mui-media-body{
        color: orange!important;
    }

    .mui-content > .mui-table-view:first-child {
        margin-top: 0;
    }
    .mui-table-view {
        background-color: mediumpurple;
    }
    /*区域*/
    /*加载按钮*/
    .mui-btn:active {
        background-color: orange;
    }

    /*加载按钮*/
    /*搜索按钮*/
    .mui-input-row .mui-btn {
        border-radius: 15px;
        position: absolute;
        right: 0;
        top: 0;
    }

    .mui-search {
        height: 34px;
    }

    /*搜索按钮*/


    .mint-swipe {
        height: 200px;
    }

    img {
        width: 100%;
        height: 100%;
    }

    .mui-input-clear {
        padding-left: 30px
    }

    .mui-search .mui-placeholder {
        width: 40px;
    }

</style>