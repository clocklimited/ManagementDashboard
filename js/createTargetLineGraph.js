const moment = require('moment')

module.exports = function createTargetLineGraph (containerId, w, h, data) {

  var margin = {top: 20, right: 20, bottom: 30, left: 40}
    , width = w - margin.left - margin.right
    , height = h - margin.top - margin.bottom

  var parseDate = d3.time.format('%b %Y').parse

  var x = d3.time.scale()
      .range([0, width])
  var y = d3.scale.linear()
      .range([height, 0])

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')
      .ticks(5)
      .tickFormat(d3.time.format('%b %y'))

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient('left')
      .tickFormat(d3.format('.2s'))

  var targetLine = d3.svg.line()
      .x(function (d) { return x(d.date) })
      .y(function (d) { return y(d.target) })

  var valueLine = d3.svg.line()
      .x(function (d) { return x(d.date) })
      .y(function (d) { return y(d.value) })

  var svg = d3.select(containerId)
      .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  // Get the data
  // close = target
  // open = value
  data.forEach(function (d) {
    d.date = parseDate(d.date)
    d.target = +d.target
    d.value = +d.value
  })

  console.log(data)
  // Scale the range of the data
  x.domain(d3.extent(data, function (d) { return d.date }))
  y.domain([0, d3.max(data, function (d) { return Math.max(d.target, d.value) })])

  svg.append('path')    // Add the targetLine path.
    .attr('class', 'line')
    .style('stroke', 'black')
    .attr('d', targetLine(data))

  svg.append('path')    // Add the valueLine path.
    .attr('class', 'line')
    .style('stroke', 'white')
    .attr('d', valueLine(data))

  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
    .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')

  // svg.append('text')
  //   .attr('transform', 'translate(' + (width + 3) + ',' + y(data[0].value) + ')')
  //   .attr('dy', '.35em')
  //   .attr('text-anchor', 'start')
  //   .style('fill', 'red')
  //   .text('Open')

  // svg.append('text')
  //   .attr('transform', 'translate(' + (width + 3) + ',' + y(data[0].target) + ')')
  //   .attr('dy', '.35em')
  //   .attr('text-anchor', 'start')
  //   .style('fill', 'steelblue')
  //   .text('Close')
}
