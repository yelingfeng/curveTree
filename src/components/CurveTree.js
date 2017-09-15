/**
 * Created by ylf on 2017/9/12.
 * 曲线树形图
 * let data = {
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
 *
 */
import * as d3 from 'd3'
const rem = 50
class CurveTree {
    constructor(options) {
        this.container = options.container
        this.sizeContainer = options.sizeContainer
        this.d3container = d3.select(this.container)
        this.shouldShowRootNode = options.showRootNode
        this.duration = options.duration || 750
        this.startYFactor = options.startYFactor == undefined ? 0.5 : options.startYFactor
        this.rootYFactor = options.rootYFactor == undefined ? 0.2 : options.rootYFactor
        this.mode = options.mode
        this.data = {children: {}}
        this.renderToken = 0;
        this._resize = this.resize.bind(this)
    }

    setData(data) {
        this.data = data || {children: {}}
        return this
    }

    setMode(mode){
        this.mode = mode
        this.redraw()
    }

    setOptions(options) {
        for (var prop in options) {
            this[prop] = options[prop]
        }
        return this
    }

    findMaxValue() {
        let max = 0;
        this.data.children.forEach(it => {
            if (it.value > max) max = it.value
        })
        return max
    }

    calcDimensions() {
        this.w = this.sizeContainer.offsetWidth
        this.h = this.sizeContainer.offsetHeight
        this.itemInterval = 0.24 * rem;
        this.nameWidth = rem
        this.rootX = this.h * 0.5
        this.rootY = this.w * this.rootYFactor
        this.startX = this.h * 0.5
        this.startY = this.w * this.startYFactor
        this.treeWidth = this.w * 0.5
        this.svgHeight = Math.max((this.data.children.length + 1) * this.itemInterval, this.h)
        this.barMaxWidth = this.w * 0.2
        this.maxValue = this.findMaxValue()
    }

    resize() {
        this.calcDimensions()
        this.updateGraph()
    }

    clickHandler(d) {
        console.log(d)
    }

    appendElements() {
        let {data} = this;
        let treeMap = d3.tree().size([this.svgHeight, this.w]);
        let treeData = treeMap(d3.hierarchy(data))
        let nodes = treeData.descendants()
        let links = treeData.descendants().slice(1)
        this.linksData = links
        nodes.forEach(d => {
            d.y = d.depth * this.treeWidth
            if (d.children) {
                d.x = this.rootX
                d.y = this.rootY
            }
        })

        if (!this.shouldShowRootNode) {
            nodes = nodes.slice(1)
        }
        this.svg = this.d3container.append("svg")
            .attr('width', '100%')
            .attr('height', this.svgHeight)

        this.rootG = this.svg.append('g')

        this.nodesG = this.rootG.selectAll('.mdplnode')
            .data(nodes)
            .enter()
            .append('g')
            .attr('class', 'mdplnode')
            .attr('transform', `translate(${this.startY},${this.startX})`)
            .on('click', d => {
                this.clickHandler(d)
            })

        this.nodesG.append('circle')
            .attr('r', 2)
            .style('fill', '#00a0e9')

        this.names = this.nodesG.append('text')
            .attr('dy', '.35em')
            .attr('text-anchor', function (d) {
                return d.children ? 'end' : 'start'
            })
            .text(function (d) {
                return d.data.name
            })

        this.bars = this.nodesG.filter(function (d) {
                return !d.children
            })
            .append('rect')
            .attr('height', '18px')
            .attr('text-anchor', 'start')


        this.figures = this.nodesG.filter(function (d) {
            return !d.children
             })
            .append('text')
            .attr('dy', '.35em')
            .text(function (d) {
                return d.data.value
            })

        let o = {x: this.startX, y: this.startY}
        this.links = this.rootG.selectAll('.link')
            .data(links)
            .enter()
            .append('path')
            .attr('class', 'curve-link')
            .attr('d', this.diagonal(o, o))
        this.updateElements()
    }

    updateElements() {
        let {maxValue, barMaxWidth, nameWidth} = this;
        this.names.attr('x', function (d) {
            return d.children ? -0.1 * rem : 0.05 * rem
        })
        this.bars
            .attr('width', function (d) {
                return d.data.value / maxValue * barMaxWidth
            })
            .attr('y', '-10px')
            .attr('x', nameWidth)
        this.figures
            .attr('x', nameWidth + 0.1 * rem)
    }

    updateLayout() {
        let {data} = this;
        let treeMap = d3.tree().size([this.svgHeight, this.w])
        let treeData = treeMap(d3.hierarchy(data))
        let nodes = treeData.descendants();
        let links = treeData.descendants().slice(1)

        nodes.forEach(d => {
            d.y = d.depth * this.treeWidth
            if (d.children) {
                d.x = this.rootX
                d.y = this.rootY
            }
        })

        this.svg.attr('height', this.svgHeight)
        this.nodesG
            .data(nodes)
            .attr('transform', function (d) {
                return `translate(${d.y},${d.x})`
            })
        this.links.data(links)
            .attr('d', d => {
                return this.diagonal(d, d.parent)
            })
        this.dots.data(links)
            .attr('d', d => {
                return this.diagonal(d, d.parent)
            })
    }

    updateGraph() {
        this.updateElements()
        this.updateLayout()
    }

    diagonal(s, d) {
        let path = `M${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
            ${(s.y + d.y) / 2} ${d.x},
            ${d.y} ${d.x}`
        return path
    }

    render() {
        let token = this.renderToken
        this.calcDimensions()
        this.appendElements()
        this.nodesG.transition()
            .duration(this.duration)
            .attr('transform', function (d) {
                return `translate(${d.y},${d.x})`
            })
        this.links.transition()
            .duration(this.duration)
            .attr('d', d => {
                return this.diagonal(d, d.parent)
            })
            .on('end', (d, i) => {
                if (i) {
                    return
                }
                if (token !== this.renderToken) return

                this.dots = this.rootG.selectAll('.tree-dot')
                    .data(this.linksData)
                    .enter()
                    .append('path')
                    .attr('d', d => {
                        return this.diagonal(d, d.parent)
                    })
                    .attr('stroke-dasharray', '2,50')
                    .attr('class', 'curve-link' + (this.mode === 'to' ? ' mdtree-dot-toleft' : ' mdtree-dot-toright'))
            })
        return this;
    }

    clear() {
        this.renderToken++;
        if (this.links) {
            this.links.transition().duration(0)
        }
        if (this.svg) {
            this.svg.remove()
        }
    }

    redraw() {
        this.clear()
        this.render()
    }

    dispose() {
        this.clear()
    }

}

export default CurveTree
