<template>
    <div>
        <div class="mui-input-row mui-search">
            <span class="mui-placeholder"><span class="mui-icon mui-icon-search">
            </span><span></span></span>
            <input type="search" name="search" class="mui-input-clear" placeholder="请输入地点" v-model="sear">
        </div>
        <button type="button" class="mui-btn mui-btn-primary mui-btn-block" @click="search">查询</button>
        <div class="all">
        <h2><span class="title">{{this.city}}</span></h2>
        <h3>昨天天气：</h3>
        <section class="skyContent" v-for="item in yesterday">
            <p>日期：<span>{{item.date}}</span></p>
            <p>最高温度：<span>{{item.high}}</span></p>
            <p>最低温度：<span>{{item.low}}</span></p>
            <p>风力：<span>{{item.fl}}</span></p>
            <p>风向：<span>{{item.fx}}</span></p>
            <p>天气：<span>{{item.type}}</span></p>
        </section>
            <h3>未来天气建议：</h3>
            <p class="agg">{{this.agg.ganmao}}</p>
            <div class="days" v-for="item in skyList">
                <h4>日期：<span>{{item.date}}</span></h4>
                <p>最高温度：<span>{{item.high}}</span></p>
                <p>最低温度：<span>{{item.low}}</span></p>
                <p>风力：<span>{{item.fengli}}</span></p>
                <p>风向：<span>{{item.fengxiang}}</span></p>
                <p>天气：<span>{{item.type}}</span></p>
            </div>
        </div>
    </div>
</template>

<script>
    import {Toast} from 'mint-ui'

    export default {
        name: "my",
        data() {
            return {
                sear: '',
                city: '江门',
                skyList: [],
                yesterday:[],
                agg:[],
            }
        },
        created() {
            this.getJJsky(this.city)
        },
        methods: {
            search() {
                this.city = this.sear
                this.getJJsky(this.city)
            },
            getJJsky(city) {
                this.$http.get("https://www.apiopen.top/weatherApi?city=" + city).then(result => {
                    console.log(result.body);
                    if (result.body.msg === "成功!") {
                        this.agg=result.body.data;
                        this.skyList = result.body.data.forecast;
                        this.yesterday=[];
                        this.yesterday.push(result.body.data.yesterday);
                        console.log(this.skyList)

                    } else {
                        Toast('没有相关数据');
                    }
                })
            }
        },
    }
</script>

<style scoped>

    .mui-btn:active {
        background-color: orange;
    }

    .mui-input-row .mui-btn {
        border-radius: 15px;
        position: absolute;
        right: 0;
        top: 0;
    }

    .mui-search {
        height: 34px;
    }

    .mui-input-clear {
        padding-left: 30px
    }

    .mui-search .mui-placeholder {
        width: 40px;
    }

    .skyContent {
        margin: 0 10px;
    }

    p {
        margin-top: 7px;
        font-size: 20px;
    }

    h4 {
        margin-top: 15px;
        font-size: 25px;
    }
    .days span{
        color:darkorange;
    }
    .all{
        margin: 0 10px;
    }
    .agg{
        letter-spacing: 3px;
        color: orangered;
        font-size: 20px;
    }
    .skyContent span{
        color:darkred;
    }
    .title{
        color: mediumpurple;
    }
</style>