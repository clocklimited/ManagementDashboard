module.exports = function createTargetLineGraphs (containerId, colour, w, h, data) {
  var options = {
      width: w
    , height: h
    , backgroundColor: colour
    , colors: [ 'black', 'white' ]
    , vAxis: {
        format: 'short'
    }
    , fontSize: 12
    , chartArea: {
        left: '10%'
      , top: '12.5%'
      , width: '80%'
      , height: '75%'
    }
    , legend: {
        position: 'top'
      , alignment: 'end'
    }
  }

  var chart = new google.visualization.LineChart(document.getElementById(containerId))
  chart.draw(data, options)
}
