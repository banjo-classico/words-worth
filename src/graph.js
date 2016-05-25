const d3 = require('d3')

module.exports = function(dataSource, dock, labels) {

var width = 500
var height = dataSource.length*30
var padding = 1

var labelScale = d3.scale.linear()
                .domain([50, 1])
                .range([6, 20])

var dataScale = d3.scale.linear()
                .domain([0, d3.max(dataSource)])
                .range([0, width])

var colorScale = d3.scale.linear()
                .domain([0, d3.max(dataSource)])
                .range(['red', 'blue'])

var canvas = d3.select(dock)
              .append('svg')
              .attr('width', width)
              .attr('height', height)

var bars = canvas.selectAll('rect')
            .data(dataSource)
            .enter()
              .append('rect')
              .attr('width', function(d) {return dataScale(d)})
              .attr('height', 30)
              .attr('y', function(d, i) {return i*31})
              .attr('fill', function(d) {return colorScale(d)})

var labels = canvas.selectAll('text')
            .data(labels)
            .enter()
              .append('text')
              .attr('x', 10)
              .attr('y', function(d, i) {return (i*31) + 20})
              .text(function(d) {return d})
              .attr('font-family', 'sans-serif')
              .attr('font-size', '12px')
              .attr('fill', '#fff')

}