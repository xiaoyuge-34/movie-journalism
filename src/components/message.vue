<template>
    <div>
        <router-link v-for="item in msg" :key="item.link" :to="{path:'/outLink',query:{ref:item.link}}">
            <div class="mui-content">
                <ul class="mui-table-view mui-table-view-striped mui-table-view-condensed">
                    <li class="mui-table-view-cell">
                        <div class="mui-table">
                            <div class="mui-table-cell mui-col-xs-10">
                                <h4 class="mui-ellipsis">{{item.title}}</h4>
                                <h5>源头：{{item.source}}</h5>
                                <p class="mui-h6 mui-ellipsis">{{item.digest}}</p>
                            </div>
                            <div class="mui-table-cell mui-col-xs-2 mui-text-right">
                                <span class="mui-h5">{{item.ptime}}</span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </router-link>
        <router-link v-for="item1 in dy" :key="item1.link" :to="{path:'/outLink',query:{ref:item1.link}}">
            <div class="mui-content">
                <ul class="mui-table-view mui-table-view-striped mui-table-view-condensed">
                    <li class="mui-table-view-cell">
                        <div class="mui-table">
                            <div class="mui-table-cell mui-col-xs-10">
                                <h4 class="mui-ellipsis">{{item1.title}}</h4>
                                <h5>源头：{{item1.source}}</h5>
                                <p class="mui-h6 mui-ellipsis">{{item1.digest}}</p>
                            </div>
                            <div class="mui-table-cell mui-col-xs-2 mui-text-right">
                                <span class="mui-h5">{{item1.ptime}}</span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </router-link>
        <router-link v-for="item2 in ent" :key="item2.link" :to="{path:'/outLink',query:{ref:item2.link}}">
            <div class="mui-content">
                <ul class="mui-table-view mui-table-view-striped mui-table-view-condensed">
                    <li class="mui-table-view-cell">
                        <div class="mui-table">
                            <div class="mui-table-cell mui-col-xs-10">
                                <h4 class="mui-ellipsis">{{item2.title}}</h4>
                                <h5>源头：{{item2.source}}</h5>
                                <p class="mui-h6 mui-ellipsis">{{item2.digest}}</p>
                            </div>
                            <div class="mui-table-cell mui-col-xs-2 mui-text-right">
                                <span class="mui-h5">{{item2.ptime}}</span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </router-link>
        <router-link v-for="item3 in money" :key="item3.link" :to="{path:'/outLink',query:{ref:item3.link}}">
            <div class="mui-content">
                <ul class="mui-table-view mui-table-view-striped mui-table-view-condensed">
                    <li class="mui-table-view-cell">
                        <div class="mui-table">
                            <div class="mui-table-cell mui-col-xs-10">
                                <h4 class="mui-ellipsis">{{item3.title}}</h4>
                                <h5>源头：{{item3.source}}</h5>
                                <p class="mui-h6 mui-ellipsis">{{item3.digest}}</p>
                            </div>
                            <div class="mui-table-cell mui-col-xs-2 mui-text-right">
                                <span class="mui-h5">{{item3.ptime}}</span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </router-link>
        <router-link v-for="item4 in sports" :key="item4.link" :to="{path:'/outLink',query:{ref:item4.link}}">
            <div class="mui-content">
                <ul class="mui-table-view mui-table-view-striped mui-table-view-condensed">
                    <li class="mui-table-view-cell">
                        <div class="mui-table">
                            <div class="mui-table-cell mui-col-xs-10">
                                <h4 class="mui-ellipsis">{{item4.title}}</h4>
                                <h5>源头：{{item4.source}}</h5>
                                <p class="mui-h6 mui-ellipsis">{{item4.digest}}</p>
                            </div>
                            <div class="mui-table-cell mui-col-xs-2 mui-text-right">
                                <span class="mui-h5">{{item4.ptime}}</span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </router-link>
        <router-link v-for="item5 in tech" :key="item5.link" :to="{path:'/outLink',query:{ref:item5.link}}">
            <div class="mui-content">
                <ul class="mui-table-view mui-table-view-striped mui-table-view-condensed">
                    <li class="mui-table-view-cell">
                        <div class="mui-table">
                            <div class="mui-table-cell mui-col-xs-10">
                                <h4 class="mui-ellipsis">{{item5.title}}</h4>
                                <h5>源头：{{item5.source}}</h5>
                                <p class="mui-h6 mui-ellipsis">{{item5.digest}}</p>
                            </div>
                            <div class="mui-table-cell mui-col-xs-2 mui-text-right">
                                <span class="mui-h5">{{item5.ptime}}</span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </router-link>
        <router-link v-for="item6 in toutiao" :key="item6.link" :to="{path:'/outLink',query:{ref:item6.link}}">
            <div class="mui-content">
                <ul class="mui-table-view mui-table-view-striped mui-table-view-condensed">
                    <li class="mui-table-view-cell">
                        <div class="mui-table">
                            <div class="mui-table-cell mui-col-xs-10">
                                <h4 class="mui-ellipsis">{{item6.title}}</h4>
                                <h5>源头：{{item6.source}}</h5>
                                <p class="mui-h6 mui-ellipsis">{{item6.digest}}</p>
                            </div>
                            <div class="mui-table-cell mui-col-xs-2 mui-text-right">
                                <span class="mui-h5">{{item6.ptime}}</span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </router-link>
        <router-link v-for="item7 in war" :key="item7.link" :to="{path:'/outLink',query:{ref:item7.link}}">
            <div class="mui-content">
                <ul class="mui-table-view mui-table-view-striped mui-table-view-condensed">
                    <li class="mui-table-view-cell">
                        <div class="mui-table">
                            <div class="mui-table-cell mui-col-xs-10">
                                <h4 class="mui-ellipsis">{{item7.title}}</h4>
                                <h5>源头：{{item7.source}}</h5>
                                <p class="mui-h6 mui-ellipsis">{{item7.digest}}</p>
                            </div>
                            <div class="mui-table-cell mui-col-xs-2 mui-text-right">
                                <span class="mui-h5">{{item7.ptime}}</span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </router-link>


    </div>

</template>

<script>
    import {Toast} from 'mint-ui'

    export default {
        data() {
            return {
                msg: [],
                dy: [],
                ent: [],
                money: [],
                sports: [],
                tech: [],
                toutiao: [],
                war: []
            }
        },
        created() {
            this.getMsg()
        },
        methods: {

            getMsg() {
                this.$http.get("https://www.apiopen.top/journalismApi").then(result => {
                    console.log(result.body);
                    if (result.body.code === 200) {
                        this.msg = result.body.data.auto;
                        this.dy = result.body.data.dy;
                        this.ent = result.body.data.ent;
                        this.money = result.body.data.end;
                        this.sports = result.body.data.sports;
                        this.tech = result.body.data.tech;
                        this.toutiao = result.body.data.toutiao;
                        this.war = result.body.data.war;


                        //digest  source title
                        // for (var i =0;i<this.msg.auto.length;i++){
                        //     console.log(this.msg.auto.title)
                        // }
                    } else {
                        Toast('接口api请求失败');
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .mui-ellipsis[data-v-032da2b2]{
        height: 55px;
        line-height: 55px;
        margin-top: 0;
    }
    .mui-h5, h5{
        margin-left: 4px;
        margin-top: 15px;
    }
</style>