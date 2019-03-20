<template>
    <iframe :src="this.ref" frameborder="0"  height="736px" width="100%" ></iframe>
</template>

<script>

    export default {
        name: "outLink",
        data(){
            return{
                ref:this.$route.query.ref,
            }

        },
        methods:{

        },
        created(){

        }
    }

</script>

<style scoped>

</style>