<template>
    <div ref="chart" class="curve-tree" :style="chartStyle"></div>
</template>
<script>
    import CurveTree from './CurveTree.js'
    export default{
        props: [
            'options',
            'renderData'
        ],
        data(){
            return {
            }
        },
        mounted(){
            this.treeVm = new CurveTree({
                container: this.$refs.chart,
                sizeContainer: this.$refs.chart,
                startYFactor: 0,
                rootYFactor: 0,
                mode: this.options.mode || 'from'
            })
        },
        watch: {
            "options.mode"(newval){
                this.treeVm.setMode(newval)
            },
            renderData(newval){
                  if (newval) {
                      this.treeVm.setData(newval).render();
                  }
            }
        },
        computed: {
            chartStyle(){
                return {
                    width: this.options.width + 'px',
                    height: this.options.height + 'px'
                }
            }
        },
        components: {
            CurveTree
        },
        methods: {}
    }
</script>
<style >
    .curve-tree {
        position: absolute;
        opacity: 1;
        visibility: visible;
        background: rgba(0, 14, 69, .6);
        margin-top: -1.5rem;
        left: 96%;
        top:20%;
        z-index: 5;
        transition: opacity .2s ease-out, top .1s ease-out;
    }
    .curve-link {
        fill:none;
        stroke:#00a0e9;
        stroke-width:1px;
    }
    .curve-link .mdtree-dot-toright{
        stroke:#00a0e9;
        stroke-width:2px;
    }

    .mdplnode cicile{
        fill:#fff;
    }
    .mdplnode text{
        fill:#fff;
        font-size:12px
    }
    .mdplnode rect{
        fill:#00a0e9
    }

    .mdtree-dot-toright{
        animation: mdtree-dot-toright-anime 1s linear infinite;
    }
    .mdtree-dot-toleft{
        animation: mdtree-dot-toleft-anime 1s linear infinite;
    }
    .mdtree-dot-toright,.mdtree-dot-toleft{
        stroke:#1bb8ff;
        stroke-width:2;
    }

    @-webkit-keyframes mdtree-dot-toright-anime {
            0% {
                stroke-dashoffset:52;
            }
            to {
                stroke-dashoffset:0 ;
            }
    }
    @keyframes mdtree-dot-toright-anime {
        0% {
            stroke-dashoffset:0;
        }
        to {
            stroke-dashoffset:52 ;
        }
    }
    @keyframes mdtree-dot-toleft-anime {
        0% {
            stroke-dashoffset: 52;
        }
        to {
            stroke-dashoffset: 0;
        }
    }
    @-webkit-keyframes mdtree-dot-toleft-anime {
        0% {
            stroke-dashoffset: 52;
        }
        to {
            stroke-dashoffset: 0;
        }
    }
</style>
