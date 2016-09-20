module.exports = function () {
  zoomToggle()
  rowToggle()
}

function rowToggle () {
  $('.finance').on('click', function () {
    $('.js-toggle-finance').slideToggle('slow')
  })

  $('.sales-section').on('click', function () {
    $('.js-toggle-sales').slideToggle('slow')
  })

  $('.production').on('click', function () {
    $('.js-toggle-production').slideToggle('slow')
  })

  $('.human-resources').on('click', function () {
    $('.js-toggle-hr').slideToggle('slow')
  })
}

function zoomToggle () {
  $('.js-zoom-toggle').on('click', function () {
    var events = $._data($('.graph')[0], 'events')
    if (events && events.click) {
      $('.graph').off('click')
    } else {
      $('.graph').on('click', function () {
        var zoomLevel = $(this).css('zoom')

        if (zoomLevel === '1.5') {
          $(this).animate({ zoom: '100%' }, 200)
        } else {
          unZoomAll()
          $(this).animate({ zoom: '150%' }, 200)
        }
     })
    }
  })
}

function unZoomAll (current) {
  $('.graph').each(function () {
    var zoomLevel = $(this).css('zoom')
    if (this === current) {
      return
    } else if (zoomLevel !== 1) {
      $(this).animate({ zoom: '100%' }, 200)
    }
  })
}
