module.exports = function createBarGraph (containerId, colour, w, h, data) {
  var options = {
      width: w
    , height: h
    , backgroundColor: colour
    , colors: [ 'white' ]
    , vAxis: { format: 'short' }
    , chartArea: {
        left: '12.5%'
      , top: '12.5%'
      , width: '75%'
      , height: '75%'
    }
    , legend: {
        position: 'none'
    }
  }

  var chart = new google.visualization.ColumnChart(document.getElementById(containerId))
  chart.draw(data, options)
}
