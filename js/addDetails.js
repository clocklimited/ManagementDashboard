module.exports = function addDetails (containerId, w, h, data) {
  $(containerId).css({ 'min-height': h, 'width': w })
  $(containerId + '-target').html(data.target)
  $(containerId + '-value').html(data.value)

  addStatus(containerId + '-status', [ data ])
}

function addStatus (targetId, data) {
  let length = data.length
    , currentMonthData
    , value
    , target
    , difference
    , arrow = '&#8212;' // Dash
    , colour = 'black'

  currentMonthData = data[length - 1] || { value: 1, target: 1 }
  value = currentMonthData.value
  target = currentMonthData.target
  difference = (value / target) * 100 - 100

  if (difference === 0) {
    arrow = '&#8212;' // Dash
    colour = 'black'
  } else if (difference > 0) {
    arrow = '&#x25B2;' // Up arrow
    colour = 'rgb(10, 220, 10)'
  } else if (difference < 0) {
    arrow = '&#x25BC;' // Down arrow
    colour = 'rgb(210, 8, 8)'
  }
  $(targetId)
    .html(arrow + ' ' + difference.toFixed(2) + '%')
    .css('color', colour)
}
