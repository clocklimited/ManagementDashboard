const createValueBarGraph = require('./createValueBarGraph')
    , createPercentageAreaGraph = require('./createPercentageAreaGraph')
    , moment = require('moment')
let spreadSheetData = [ ]
  , formattedData = { }

function getData () {
  $.ajax({
    url: '/data'
  , success: function (body) {
      console.log(body.values)
      spreadSheetData = body.values
      let currentMonth = 'December 2016'//moment().format('MMMM YYYY')
        , currentMonthIndex = spreadSheetData[0].indexOf(currentMonth)
        , range = 6

      // Prevents going out of bounds
      if (currentMonthIndex < range) range = currentMonthIndex
      console.log(currentMonthIndex)
      console.log(spreadSheetData[0].slice(1, range))
      //console.log(moment('August 2016').format('MMM YY'))
    }
  })
  repopulate()
}

getData()

function repopulate () {
  var width = 320
    , height = 200

  // Finance
  createValueBarGraph('#revenue', width, height, 'data/revenue.tsv')
  createValueBarGraph('#costs', width, height, 'data/costs.tsv')
  createValueBarGraph('#sales-vs-target', width, height, 'data/sales-vs-target.tsv', [-1, 1])

  // Sales
  createPercentageAreaGraph('#win-rate', width, height, 'data/win-rate.tsv')
  createValueBarGraph('#sales', width, height, 'data/sales.tsv')
  createValueBarGraph('#leads', width, height, 'data/leads.tsv')
  createValueBarGraph('#pipeline', width, height, 'data/pipeline.tsv')

  // Production
  createPercentageAreaGraph('#utilisation', width, height, 'data/utilisation.tsv')
  createValueBarGraph('#active-projects', width, height, 'data/projects.tsv')
  createValueBarGraph('#tickets', width, height, 'data/tickets.tsv')

  // HR Stats
  createValueBarGraph('#head-count', width, height, 'data/head-count.tsv')
  createValueBarGraph('#sick-days', width, height, 'data/sick.tsv')
  createValueBarGraph('#holiday', width, height, 'data/holiday.tsv')
}

// $.ajax({
//   url: '/employees'
// , success: function (body) {
//     console.log(body)
//   }
// })
