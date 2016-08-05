module.exports = function createTargetLineGraph (containerId, w, h, data) {

  var margin = {top: 20, right: 20, bottom: 30, left: 40}
    , width = w - margin.left - margin.right
    , height = h - margin.top - margin.bottom

    , parseDate = d3.time.format('%b %Y').parse

    , x = d3.time.scale()
        .range([0, width])
    , y = d3.scale.linear()
        .range([height, 0])

    , xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom')
        .ticks(5)
        .tickFormat(d3.time.format('%b %y'))

    , yAxis = d3.svg.axis()
        .scale(y)
        .orient('left')
        .tickFormat(d3.format('.2s'))

    , targetLine = d3.svg.line()
        .x((d) => x(d.date))
        .y((d) => y(d.target))

    , valueLine = d3.svg.line()
        .x((d) => x(d.date))
        .y((d) => y(d.value))

    , svg = d3.select(containerId)
        .append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
        .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  data.forEach((d) => {
    d.date = parseDate(d.date)
    d.target = +d.target
    d.value = +d.value
  })

  console.log('Target Line Graph', data)
  // Scale the range of the data
  x.domain(d3.extent(data, (d) => d.date))
  y.domain([Math.min(0, d3.min(data, (d) => Math.min(d.target, d.value)))
      , d3.max(data, (d) => Math.max(d.target, d.value))
      ])
    .nice()

  svg.append('path')
    .attr('class', 'line')
    .style('stroke', 'black')
    .attr('d', targetLine(data))

  svg.append('path')
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
}
