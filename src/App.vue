<template>
    <div class="container">
        <p>
            <button @click="selectMode('to')">to</button>
            <button  @click="selectMode('from')">from</button>
        </p>
        <div class="main"  >
            <curveTree :options="opt" :renderData="renderData" ></curveTree>
            <div class="bg"></div>
        </div>
    </div>
</template>
<script>
    import curveTree from './components/CurveTree.vue'
    export default{
        data(){
            return {
                renderData: {},
                opt: {
                    width: 300,
                    height: 150,
                    mode : 'from'
                }
            }
        },
        mounted(){
            this.fetchData()
        },
        components: {
            curveTree
        },
        methods: {
            selectMode(v){
                this.opt.mode = v
            },
            fetchData(){
                let data = {
                    code: '525',
                    name: 'ss',
                    children: [
                        {name: 'A', value: 143},
                        {name: 'B', value: 71},
                        {name: 'C', value: 16},
                        {name: 'D', value: 26},
                        {name: 'E', value: 7},
                        {name: 'F', value: 23},
                    ]
                }
                this.renderData = data;

            },
        }
    }
</script>
<style >
    body, html {
        margin: 0;
        padding: 0;
    }

    .container {
        display: flex;
        justify-content: center;
    }

    .bg {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        z-index: -1;
        background: #03165a;
    }

    .main {
        position: absolute;
        background-color:rgba(0,14,69,.6);
        width: 10%;
        height: 300px;
        left : 5%;
        top:5%;
        padding:5px;
    }

    button {
        padding:  5px 2px;
        width : 80px;
        border:1px solid #ccc;
    }
</style>
