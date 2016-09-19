const addStatus = require('./add-status')

module.exports = function (containerId, colour, w, h, data) {
  var options = {
      pieSliceText: 'value'
    , width: w
    , height: h
    , backgroundColor: colour
    , chartArea: {
        left: '25%'
      , top: '12.5%'
      , width: '75%'
      , height: '75%'
    }
    , legend: {
        position: 'right'
      , textStyle: {
          color: 'white'
        , fontSize: '1.5em'
      }
    }
    , slices: { 1: { offset: 0.1 } }
  }

  var chart = new google.visualization.PieChart(document.getElementById(containerId))
  chart.draw(data, options)

  addStatus(`#${containerId}-status`, data)
}
