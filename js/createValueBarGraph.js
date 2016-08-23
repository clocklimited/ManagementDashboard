module.exports = function createValueBarGraph (containerId, w, h, data) {

  let margin = {top: 20, right: 20, bottom: 30, left: 50}
    , width = w - margin.left - margin.right
    , height = h - margin.top - margin.bottom

    , formatNumber = d3.format('.2s')

    , x0 = d3.scale.ordinal()
        .rangeRoundBands([0, width], 0.2)

    , x1 = d3.scale.ordinal()

    , y = d3.scale.linear()
        .range([height, 0])

    , classScale = d3.scale
        .ordinal()
        .range(['bar1', 'bar2'])

    , xAxis = d3.svg.axis()
        .scale(x0)
        .orient('bottom')

    , yAxis = d3.svg.axis()
        .scale(y)
        .orient('left')
        .tickFormat(formatNumber)

    , svg = d3.select(containerId)
        .append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .attr('viewBox', '0 0 ' + w + ' ' + h)
        .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    , labels = d3.keys(data[0]).filter((key) => key !== 'date')
    , legend
    , state
    , min
    , max

  data.forEach((d) => {
    d.counts = labels.map((name) => { return { name: name, value: +d[name] } })
  })

  x0.domain(data.map((d) => d.date))
  x1.domain(labels).rangeRoundBands([0, x0.rangeBand()])
  max = d3.max(data, (d) => d3.max(d.counts, (d) => d.value))
  min = d3.min(data, (d) => d3.min(d.counts, (d) => d.value))

  y.domain([Math.min(0, min), max]).nice()

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

  state = svg.selectAll('.state')
      .data(data)
    .enter()
    .append('g')
      .attr('class', 'g')
      .attr('transform', (d) => 'translate(' + x0(d.date) + ',0)')

  state.selectAll('rect')
      .data((d) => d.counts)
    .enter()
    .append('rect')
      .attr('width', x1.rangeBand())
      .attr('x', (d) => x1(d.name))
      .attr('y', (d) => y(Math.max(0, d.value)))
      .attr('height', (d) => Math.abs(y(d.value) - y(0)))
      .attr('class', (d) => classScale(d.name))

  if (data.length === 0) {
    svg.append('g')
        .append('text')
          .text('ERROR: NO DATA')
          .attr('y', height / 2)
          .attr('dx', '.5em')
          .style('font-size', 20)
  }

  if (labels.length > 1) {
    legend = svg.selectAll('.legend')
        .data(labels.slice().reverse())
      .enter()
      .append('g')
        .attr('class', 'legend')
        .attr('transform', (d, i) => 'translate(0,' + (-20 + i * 20) + ')')

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
        .text((d) => d.charAt(0).toUpperCase() + d.slice(1))

    labels.forEach((e, i) => {
      state.append('text')
        .text((d) => d[e])
        .attr('class', 'valueText')
        .attr('y', (d) => y(Math.max(0, d[e])))
        .attr('dx', x1.rangeBand() * i)
        .attr('transform', 'translate(' + x1.rangeBand() / 2 + ', 0)')
        .style('fill', (i % 2 === 0 ? 'black' : 'white'))
    })

  } else {
    state.append('text')
      .text((d) => d3.format(',')(d.value))
      .attr('class', 'valueText')
      .attr('y', (d) => y(Math.max(0, d.value)))
      .attr('transform', 'translate(' + x1.rangeBand() / 2 + ', 0)')
  }
}
