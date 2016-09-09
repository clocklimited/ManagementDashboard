const addStatus = require('./addStatus')

module.exports = function createBarGraph (containerId, colour, w, h, data) {
  var options = {
      width: w
    , height: h
    , backgroundColor: colour
    , colors: [ 'white', 'black' ]
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
        position: data.getNumberOfColumns() > 2 ? 'top' : 'none'
      , alignment: 'end'
      , textStyle: { color: '#FFF' }
    }
  }

  var chart = new google.visualization.ColumnChart(document.getElementById(containerId))
  chart.draw(data, options)

  addStatus(`#${containerId}-status`, data)
}

