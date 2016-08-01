window.createPercentageAreaGraph = function(containerId, w, h, dataSrc, domain) {

  if (!domain) {
    domain = [0, 1]
  }
  var margin = {top: 20, right: 30, bottom: 30, left: 50}
    , width = w - margin.left - margin.right
    , height = h - margin.top - margin.bottom
    , parseDate = d3.time.format('%b %Y').parse
    , classScale = d3.scale.ordinal()
      .range(['area1', 'area2'])
    , x = d3.time.scale()
      .range([0, width])
    , y = d3.scale.linear()
      .range([height, 0])
    , xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')
      .ticks(d3.time.months, 1)
      .tickFormat(d3.time.format('%b %Y'))
    , yAxis = d3.svg.axis()
      .scale(y)
      .orient('left')
      .tickFormat(d3.format('.0%'))
    , area = d3.svg.area()
      .x(function(d) { return x(d.date) })
      .y0(height)
      .y1(function(d) { return y(d.value) })
    , svg = d3.select(containerId).append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  d3.tsv(dataSrc, function(error, data) {

      var labels = d3.keys(data[0]).filter(function(key) { return key !== 'date' })

      data.forEach(function(d) {
        d.date = parseDate(d.date)
      })

      var md = labels.map(function(name) {
        return {
          name: name,
          values: data.map(function(d) { return { date: d.date, value: +d[name] }})
        }
      })

      x.domain(d3.extent(data, function(d) { return d.date }))
      y.domain(domain)
      console.log(md)
      var values = svg.selectAll('.values')
        .data(md)
        .enter().append('g')

      values.append('path')
          .attr('class', function(d) { return classScale(d.name) })
          .attr('d', function(d) { return area(d.values) })

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
          .attr('transform', function(d, i) { return 'translate(0,' + i * 20 + ')' })

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
          .text(function(d) { return d.charAt(0).toUpperCase() + d.slice(1) })
    }
  })
}