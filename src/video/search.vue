<template>
    <div class="video">
        <h4>搜索{{this.q}}的结果：</h4>
        <div class="content">
            <ul class="mui-table-view mui-grid-view">
                <li class="mui-table-view-cell mui-media mui-col-xs-6" v-for="item in searchInfo" :key="item.id">
                    <router-link :to="'/home/videos1/'+item.id">
                        <img class="mui-media-object" :src="item.images.small">
                        <div class="mui-media-body">{{item.title}}</div>
                    </router-link></li>

            </ul>
        </div>
    </div>
</template>


<script>
    import {Toast} from 'mint-ui'
    export default {
        data() {
            return {
                q:this.$route.params.search,
                searchInfo: [ ]
            }
        },
        created() {

            // console.log(this.$route.params.search)
            this.getJJVideo();
        },
        methods: {
            getJJVideo() {
                this.$http.jsonp("https://api.douban.com/v2/movie/search?q="+this.q).then(result => {
                    console.log(result.body);
                    if (result.body.id=== this.id) {
                        this.searchInfo = result.body.subjects;
                    } else {

                        Toast('接口api请求失败');
                    }
                })
            }

        }

    }
</script>

<style scoped>
    .mui-icon-back:before, .mui-icon-left-nav:before {
        content: '\e471';
    }
h4{
    height: 20px;
    text-align: center;
}
    .mui-icon {
        position: absolute;
        top: 45px;

        font-size: 28px;}
</style>