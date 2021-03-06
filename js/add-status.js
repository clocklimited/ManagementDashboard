module.exports = function add (targetId, dataSet) {
  if (targetId.indexOf('pie') !== -1) {
    addPieStatus(targetId, dataSet)
  } else {
    addStatus(targetId, dataSet)
  }
}

function addPieStatus (targetId, dataSet) {
  var currentValue = dataSet.getValue(1, 1)
    , colour = 'black'
    , target = dataSet.getValue(0, 1)
    , difference = (currentValue / target) * 100

  $(targetId)
    .html(difference.toFixed(2) + '%')
    .css('color', colour)
}

function addStatus (targetId, dataSet) {
  let length = dataSet.getNumberOfRows()
    , current
    , value
    , target
    , previous
    , difference
    , arrow = '<i class="fa fa-minus"></i>'
    , colour = 'black'

  if (dataSet.getFilteredRows([{ column: 1, minValue: 1 }]).length === 0) {
    return
  }

  if (targetId.indexOf('target') !== -1) {
    value = dataSet.getValue(length - 1, 2)
    target = dataSet.getValue(length - 1, 1)
    difference = (value / target) * 100 - 100
  } else { // Last month
    current = dataSet.getValue(length - 1, 1)
    previous = dataSet.getValue(length - 2, 1)
    difference = ((current - previous) / Math.abs(previous)) * 100
  }

  if (difference === 0) {
    arrow = '<i class="fa fa-minus"></i>'
    colour = 'black'
  } else if (difference > 0) {
    arrow = '<i class="fa fa-caret-up"></i>'
    colour = 'rgb(10, 220, 10)'
  } else if (difference < 0) {
    arrow = '<i class="fa fa-caret-down"></i>'
    colour = 'rgb(210, 8, 8)'
  }
  $(targetId)
    .html(arrow + ' ' + difference.toFixed(1) + '%')
    .css('color', colour)
}
