module.exports = function createTargetLineGraph (containerId, w, h, data) {

  let margin = {
      top: (h / 100) * 10//6.956522 //20
    , right: (w / 100) * 10//15.217391 //70
    , bottom: (h / 100) * 10.434783 //30
    , left: (w / 100) * 12//8.695652 //40
    }

    , width = w - margin.left - margin.right
    , height = h - margin.top - margin.bottom

    , parseDate = d3.time.format('%b %Y').parse
    , formatDate = d3.bisector(function (d) { return d.date }).right
    , formatNumber = d3.format('.2s')

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
        .tickFormat(formatNumber)

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
          .attr('preserveAspectRatio', 'xMinYMin meet')
          .attr('viewBox', '0 0 ' + w + ' ' + h)
        .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    , focus
    , legend

  data.forEach((d) => {
    d.date = parseDate(d.date)
    d.target = +d.target
    d.value = +d.value
  })

  // console.log('Target Line Graph', data)
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

  // TOOLTIPs
  focus = svg.append('g')
        .style('display', 'none')
  // append the x line
  focus.append('line')
      .attr('class', 'x')
      .style('stroke', 'blue')
      .style('stroke-dasharray', '3,3')
      .style('opacity', 0.5)
      .attr('y1', 0)
      .attr('y2', height)

  // append the y line - target
  focus.append('line')
      .attr('class', 'y1')
      .style('stroke', 'blue')
      .style('stroke-dasharray', '3,3')
      .style('opacity', 0.5)
      .attr('x1', width)
      .attr('x2', width)

  // append the y line - value
  focus.append('line')
      .attr('class', 'y2')
      .style('stroke', 'blue')
      .style('stroke-dasharray', '3,3')
      .style('opacity', 0.5)
      .attr('x1', width)
      .attr('x2', width)

  // append the circle at the first intersection
  focus.append('circle')
      .attr('class', 'y1')
      .style('fill', 'none')
      .style('stroke', 'blue')
      .attr('r', 4)

  // append the circle at the second intersection
  focus.append('circle')
      .attr('class', 'y2')
      .style('fill', 'none')
      .style('stroke', 'blue')
      .attr('r', 4)

  // place the target at the intersection
  focus.append('text')
      .attr('class', 'y1')
      .style('font-size', '1.5em')
      .style('stroke', 'black')
      .style('stroke-width', '3.5px')
      .style('opacity', 0.8)
      // .attr('dx', 8)
      .attr('dy', '0.5em')
  focus.append('text')
      .attr('class', 'y2')
      .style('font-size', '1.5em')
      .style('color', 'black')
      // .attr('dx', 8)
      .attr('dy', '0.5em')

  // place the value at the intersection
  focus.append('text')
      .attr('class', 'y3')
      .style('font-size', '1.5em')
      .style('stroke', 'black')
      .style('stroke-width', '3.5px')
      .style('opacity', 0.8)
      .attr('dx', '1em')
      .attr('dy', '1.6em')
  focus.append('text')
      .attr('class', 'y4')
      .style('font-size', '1.5em')
      .style('color', 'black')
      .attr('dx', '1em')
      .attr('dy', '1.6em')

  // append the rectangle to capture mouse
  svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mouseover', function () { focus.style('display', null) })
      .on('mouseout', function () { focus.style('display', 'none') })
      .on('mousemove', mousemove)

  // Add legend
  legend = svg.selectAll('.legend')
      .data(['Target', containerId.match(/#(\w+)-/)[1]])
    .enter()
    .append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => 'translate(0,' + (-20 + i * 20) + ')')

  legend.append('rect')
      .attr('x', width + margin.right - 20)
      .attr('width', 10)
      .attr('height', 10)
      .style('fill', (d) => d === 'Target' ? 'black' : 'white')

  legend.append('text')
      .attr('x', width + margin.right - 30)
      .attr('y', 5)
      .attr('dx', '.55em')
      .attr('dy', '.35em')
      .style('text-anchor', 'end')
      .text((d) => d.charAt(0).toUpperCase() + d.slice(1))

  function mousemove () {
    var x0 = x.invert(d3.mouse(this)[0])
      , i = formatDate(data, x0, 1)
      , d0 = data[i - 1]
      , d1 = data[i] || { date: 0 }
      , d = x0 - d0.date > d1.date - x0 ? d1 : d0

    focus.select('circle.y1')
        .attr('transform',
              'translate(' + x(d.date) + ',' + y(d.target) + ')')

    focus.select('circle.y2')
        .attr('transform',
              'translate(' + x(d.date) + ',' + y(d.value) + ')')

    focus.select('text.y1')
        .attr('transform',
              'translate(' + x(d.date) + ',' + y(d.target) + ')')
        .text('T: £' + formatNumber(d.target))

    focus.select('text.y2')
        .attr('transform',
              'translate(' + x(d.date) + ',' + y(d.target) + ')')
        .text('T: £' + formatNumber(d.target))

    focus.select('text.y3')
        .attr('transform',
              'translate(' + x(d.date) + ',' + y(d.target) + ')')
        .text(formatNumberCurrency(d.value))

    focus.select('text.y4')
        .attr('transform',
              'translate(' + x(d.date) + ',' + y(d.target) + ')')
        .text(formatNumberCurrency(d.value))

    focus.select('.x')
        .attr('transform',
              'translate(' + x(d.date) + ',' + Math.min(y(d.target), y(d.value)) + ')')
        .attr('y2', height - Math.min(y(d.target), y(d.value)))

    focus.select('.y1')
        .attr('transform',
              'translate(' + width * -1 + ',' + y(d.target) + ')')
        .attr('x2', width + width)

    focus.select('.y2')
        .attr('transform',
              'translate(' + width * -1 + ',' + y(d.value) + ')')
        .attr('x2', width + width)
  }

  function formatNumberCurrency (number) {
    if (number < 0) {
      return '-£' + formatNumber(-number)
    } else {
      return '£' + formatNumber(number)
    }
  }
}
