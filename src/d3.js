const d3 = require('d3')
//const topojson = require('topojson')
var width = 400
var height = 400
var padding = 1

function makeGraph(dataSource, userData) {
  var dataScale = d3.scale.linear()
                  .domain([0, d3.max(dataSource)])
                  .range([0, width])

  var colorScale = d3.scale.ordinal()
                  .domain([0, 1, 2, 3])
                  .range(['tomato', 'yellow', 'blue', 'teal'])

  var canvas = d3.select('#graph')
                .append('svg')
                .attr('width', width)
                .attr('height', height)

  var bars = canvas.selectAll('rect')
              .data(dataSource)
              .enter()
                .append('rect')
                .attr('height', function(d) {return d*5})
                .attr('width', width/dataSource.length-5)
                .attr('x', function(d, i) {return i*(width/userData.length) + ((width/userData.length)/2) - 48})
                .attr('y', function(d) {return height - d*5})
                .attr('fill', function(d, i) {return colorScale(i)})

  var labels = canvas.selectAll('text')
              .data(userData)
              .enter()
                .append('text')
                .attr('x', function(d, i) {return i*(width/userData.length) + (width/userData.length - 5)/2})
                .attr('y', 390)
                .text(function(d) {return d})
                .attr('font-family', 'sans-serif')
                .attr('font-size', '20px')
                .attr('fill', '#fff')
                .attr('text-anchor', 'middle')
}


module.exports = {
  makeGraph: makeGraph,
}