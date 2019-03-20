<template>
    <div class="video">

        <!--//检索框-->

        <div class="mui-input-row mui-search">
            <span class="mui-placeholder"><span class="mui-icon mui-icon-search">
            </span><span></span></span>
            <input type="search" name="search" class="mui-input-clear" placeholder="请输入查询的视频" v-model="search">
            <router-link :to="'/video/search/'+this.search">
                <button type="button" class="mui-btn mui-btn-primary">
                    搜索
                </button>
            </router-link>
        </div>

       <!--正文-->
        <div class="content">
            <ul class="mui-table-view mui-grid-view">
                <li class="mui-table-view-cell mui-media mui-col-xs-6" v-for="item in JJVideoList" :key="item.id">
                    <router-link :to="'/home/videos1/'+item.id">
                        <img class="mui-media-object" :src="item.images.small">
                        <div class="mui-media-body">{{item.title}}</div>
                    </router-link></li>

            </ul>
        </div>
        <!--按钮-->
        <button type="button" class="mui-btn mui-btn-primary mui-btn-block" @click="add">加载更多</button>
    </div>
</template>

<script>
    import {Toast} from 'mint-ui'
    export default {
        data() {
            return {
                search:'',
                JJVideoList: [ ],
                count:10,
                star:0,
            }
        },
        created() {
            this.getJJVideo();
        },
        methods: {
            add(){
                this.star+=10;
                this.getJJVideo();
            },

            getJJVideo() {
                this.$http.jsonp("https://api.douban.com/v2/movie/top250?start="+this.star+"&count=10").then(result => {
                    console.log(result.body);
                    if (result.body.total === 250) {
                        this.JJVideoList = this.JJVideoList.concat(result.body.subjects);
                        console.log(this.JJVideoList);
                    } else {
                        Toast('接口api请求失败');
                    }
                })
            }

        }
    }
</script>

<style scoped>
    .mui-btn:active{
        background-color: orange;
    }
.video{
    text-align: center;
}
.mui-grid-view{
    background-color: mediumpurple;
}
    .mui-content{
        background-color: white;
    }



    /*区域*/
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

    .mui-input-clear {
        padding-left: 30px
    }

    .mui-search .mui-placeholder {
        width: 40px;
    }
</style>