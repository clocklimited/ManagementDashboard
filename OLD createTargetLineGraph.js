module.exports = function createTargetLineGraph (containerId, w, h, data) {

  var margin = {top: 20, right: 20, bottom: 30, left: 40}
    , width = w - margin.left - margin.right
    , height = h - margin.top - margin.bottom

  var x0 = d3.scale.ordinal()
      .rangeRoundBands([0, width], 0.2)

  var x1 = d3.scale.ordinal()

  var y = d3.scale.linear()
      .range([height, 0])

  var classScale = d3.scale.ordinal()
      .range(['line1', 'line2'])

  var xAxis = d3.svg.axis()
      .scale(x0)
      .orient('bottom')

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient('left')
      .tickFormat(d3.format('.2s'))

  

  var svg = d3.select(containerId).append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  // where the old load used to be
  console.log('cTLG', data)
  var labels = d3.keys(data[0]).filter(function (key) { return key !== 'date' })

  data.forEach(function (d) {
    d.counts = labels.map(function (name) { return {name: name, value: +d[name]} })
  })

  x0.domain(data.map(function (d) { return d.date }))
  x1.domain(labels).rangeRoundBands([0, x0.rangeBand()])
  var max = d3.max(data, function (d) { return d3.max(d.counts, function (d) { return Math.max(d.target, d.value) }) })
  var min = d3.min(data, function (d) { return d3.min(d.counts, function (d) { return Math.min(d.target, d.value) }) })

  y.domain([Math.min(0, min), max]).nice()

  var targetLine = d3.svg.line()
    .x(function (d) { return x0(d.date) })
    .y(function (d) { return y(d.target) })

  var valueLine = d3.svg.line()
    .x(function (d) { return x0(d.date) })
    .y(function (d) { return y(d.value) })

  // add lines
  svg.append('path')
    .attr('class', 'line1')
    .attr('d', targetLine(data))

  svg.append('path')
    .attr('class', 'line1')
    .attr('d', valueLine(data))


  // add axis
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

  

  if (labels.length > 1) {
    var legend = svg.selectAll('.legend')
        .data(labels.slice().reverse())
        .enter().append('g')
        .attr('class', 'legend')
        .attr('transform', function (d, i) { return 'translate(0,' + (-20 + i * 20) + ')' })

    legend.append('rect')
        .attr('x', width - 10)
        .attr('width', 10)
        .attr('height', 10)
        .attr('class', classScale)

    legend.append('text')
        .attr('x', width - 16)
        .attr('y', 5)
        .attr('dy', '.35em')
        .style('text-anchor', 'end')
        .text(function (d) { return d.charAt(0).toUpperCase() + d.slice(1) })
  }
  // vis.append('svg:path')
  //     .attr('d', lineGen(data))
  //     .attr('stroke', 'green')
  //     .attr('stroke-width', 2)
  //     .attr('fill', 'none')
  // vis.append('svg:path')
  //     .attr('d', lineGen(data))
  //     .attr('stroke', 'blue')
  //     .attr('stroke-width', 2)
  //     .attr('fill', 'none')
}
