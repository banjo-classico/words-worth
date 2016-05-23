const d3 = require('d3')

module.exports = function(dataSource, dock) {

var width = 500
var height = 500

var dataScale = d3.scale.linear()
                .domain([0, d3.max(dataSource)])
                .range([0, width])

var colorScale = d3.scale.linear()
                .domain([0, d3.max(dataSource)])
                .range('red', 'blue')

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
              .attr('y', function(d, i) {return i*50})
}