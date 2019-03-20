<template>
<div>
    <div class="img"><img :src="videoInfo.images.medium" alt=""></div>
<div class="tro">
  <router-link :to="{path:'/outLink',query:{ref:videoInfo.mobile_url}}">详情播放</router-link>
    <p>电影名：{{videoInfo.title}}&nbsp;&nbsp;&nbsp;&nbsp;({{videoInfo.countries[0]}})</p>
    <p>类型： {{videoInfo.genres[0]}}&nbsp;&nbsp;{{videoInfo.genres[1]}}&nbsp;&nbsp;{{videoInfo.genres[2]}}</p>
    <p>年份： {{videoInfo.year}}</p>
    <p>评分：{{videoInfo.rating.average}}</p>
    <p>导演：{{videoInfo.directors[0].name}}</p>
    <p>主演：{{videoInfo.casts[0].name}}</p>
    <p>电影简介：{{videoInfo.summary}}</p>

</div>
</div>
</template>

<script>

    import {Toast} from 'mint-ui'
    export default {
        data() {
            return {

                id:this.$route.params.id,
                videoInfo: [ ]
            }
        },
        created() {

            this.getJJVideo();
        },
        methods: {

            getJJVideo() {
                this.$http.jsonp("https://api.douban.com/v2/movie/subject/"+this.id).then(result => {
                    console.log(result.body);
                    if (result.body.id=== this.id) {
                        this.videoInfo = result.body;
                    } else {

                        Toast('接口api请求失败');
                    }
                })
            }

        }

    }

</script>

<style scoped>
    .tro >a{  text-decoration: underline;
        color: #6641e2;
       float: right;
    }
    .mui-icon {
        position: fixed;
        left: 5px;
        z-index: 5001;
        top: 8px;
        font-size: 28px;
    }
    .img{
        margin-left: 25%;
        height: 300px;
    }
    .img img{

        height: 100%;
    }
    .tro{
        margin-top:20px;
        margin-left: 30px;
        margin-right: 30px;
    }
</style>