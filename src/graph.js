const d3 = require('d3')

module.exports = function(dataSource, dock, labels) {

var width = 500
var height = 500
var padding = 1

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
              .attr('height', height/dataSource.length)
              .attr('y', function(d, i) {return i*(height/dataSource.length)})
              .attr('fill', function(d) {return colorScale(d)})

var labels = canvas.selectAll('text')
            .data(labels)
            .enter()
              .append('text')
              .attr('x', 10)
              .attr('y', function(d, i) {return i*(height/dataSource.length)+ 5})
              .text(function(d) {return d})
              .attr('font-family', 'sans-serif')
              .attr('font-size', '16px')
              .attr('fill', '#fff')

}