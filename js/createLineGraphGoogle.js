const addStatus = require('./addStatus')

module.exports = function createTargetLineGraphs (containerId, colour, w, h, data) {
  var options = {
      width: w
    , height: h
    , backgroundColor: colour
    , colors: [ 'black', 'white' ]
    , vAxis: {
        format: 'short'
      , textStyle: { color: '#FFF' }
    }
    , hAxis: {
      textStyle: { color: '#FFF' }
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
      , textStyle: { color: '#FFF' }
    }
  }

  var chart = new google.visualization.LineChart(document.getElementById(containerId))
  chart.draw(data, options)

  addStatus(`#${containerId}-status`, data)
}
