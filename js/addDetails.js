module.exports = function addDetails (containerId, w, h, data) {
  $(containerId).css({ 'min-height': h, 'width': w })
  $(containerId + '-target').html(data.target)
  $(containerId + '-value').html(data.value)
}
