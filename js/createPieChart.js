module.exports = function (containerId, w, h, data) {

  let margin = {top: 20, right: 30, bottom: 30, left: 50}
    , width = w - margin.left - margin.right
    , height = h - margin.top - margin.bottom
    , radius = height / 2

    , formatNumber = d3.format('.2s')
    , pieColour = d3.scale.linear()
        .domain([0, 1])
        .range(['white', 'black'])

    , labels = [ ]

   // required data format:
   // [{'label':'one', 'value':20}, ...]

   data.forEach((item) => labels.push(item.label))

   var svg = d3.select(containerId)
      .append('svg:svg')
      .data([data])
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
      .append('svg:g')
        .attr('transform', 'translate(' + (radius + margin.left) + ',' + (radius + margin.top) + ')')
        .attr('width', width)

    var arc = d3.svg.arc()
        .outerRadius(radius)

    var pie = d3.layout.pie()
        .value((d) => d.value)

    var arcs = svg.selectAll('g.slice')
        .data(pie)
        .enter()
            .append('svg:g')
                .attr('class', 'slice')

        arcs.append('svg:path')
                .attr('fill', (d, i) => pieColour(i))
                .attr('d', arc)

        arcs.append('svg:text')
                .attr('transform', function (d) {
                d.innerRadius = 0
                d.outerRadius = radius
                return 'translate(' + arc.centroid(d) + ')'
            })
            .attr('text-anchor', 'middle')
            .text((d, i) => formatNumber(data[i].value))

  if (data.length === 0) {
    svg.append('g')
        .append('text')
          .text('ERROR NO DATA')
          .attr('y', height / 2)
          .attr('dx', '.5em')
          .style('font-size', 20)
  }

  if (labels.length > 1) {
    console.log(labels)
    var legend = svg.selectAll('.legend')
        .data(labels.slice().reverse())
      .enter()
      .append('g')
        .attr('class', 'legend')
        .attr('transform', (d, i) => 'translate(0,' + i * 20 + ')')

    legend.append('rect')
        .attr('x', width - radius)
        .attr('y', -radius - 5)
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', (d, i) => pieColour(i))

    legend.append('text')
        .attr('x', width - radius - 6)
        .attr('y', -radius)
        .attr('dy', '.35em')
        .style('text-anchor', 'end')
        .text((d) => d.charAt(0).toUpperCase() + d.slice(1))
  }
}
