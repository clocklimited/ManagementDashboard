module.exports = function addDetails (containerId, w, h, data) {
  $(containerId).css({ 'min-height': h, 'width': w })
  $(containerId + '-target').html(data.target)
  $(containerId + '-value').html(data.value)

  addStatus(containerId + '-status', data)
}

function addStatus (targetId, data) {
  var difference
    , arrow = '&#8212;' // Dash
    , colour = 'black'

  data = data || { value: 1, target: 1 }
  difference = (data.value / data.target) * 100 - 100

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
