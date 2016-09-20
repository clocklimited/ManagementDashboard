module.exports = function () {
  var modal = document.getElementById('selectModal')

  var btn = document.getElementById('selectButton')

  var span = document.getElementsByClassName('close')[0]

  btn.onclick = function () {
    modal.style.display = 'block'
  }

  span.onclick = function () {
    closeAction()
  }

  window.onclick = function (event) {
    if (event.target === modal) {
      closeAction()
    }
  }

  function closeAction () {
    modal.style.display = 'none'

    $('.modal td').each(function () {
      var button = $('input', this)
        , id = button.attr('id')
        , graphId = '#' + id.slice(0, -6)
      if (button.is(':checked')) {
        // Show
        $(graphId).parent().slideDown('slow')
      } else {
        // Hide
        $(graphId).parent().slideUp('slow')
      }
    })
  }
}
