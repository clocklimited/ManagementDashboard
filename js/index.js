const createPieChart = require('./create-pie-chart-google')
    , createBarGraph = require('./create-bar-graph-google')
    , createLineChart = require('./create-line-graph-google')
    , addDetails = require('./add-details')
    , moment = require('moment')
    , pos = require('../lib/positions.json')
    , createFormatter = require('./formatter')

let spreadSheetData = [ ]
  , data = {
      tickets: { }
    , costs: { }
    , target: { }
    , staffSatisfaction: { }
    , clientSatisfaction: { }
  }
  , spreadSheetTargets = [ ]
  , formatter

function getSpreadsheetData () {
  return $.ajax({
    url: '/data'
  , success: (body) => {
      console.log('Data', body.values)
      spreadSheetData = body.values
      let currentMonth = getUrlParameter('month') || moment().format('MMMM YYYY')
        , currentMonthIndex = spreadSheetData[pos.BOARDPACK_DATE].indexOf(currentMonth) + 1
        , range = 6
        // Prevents going out of bounds
        , start = currentMonthIndex <= range ? 1 : currentMonthIndex - range
        , end = currentMonthIndex

      data.dates = spreadSheetData[pos.MONTH].slice(start, end)
      data.dates = data.dates.map((date) => moment(date, 'MMMM YYYY').format('MMM YY'))
      formatter = createFormatter(data.dates)
      // FINANCE
      data.revenue = formatter.format({ Revenue: spreadSheetData[pos.REVENUE].slice(start, end) })
      data.profit = formatter.format({ Profit: spreadSheetData[pos.PROFIT].slice(start, end) })
      data.costs.Staff = spreadSheetData[pos.COSTS_STAFF].slice(start, end)
      data.costs.Total = spreadSheetData[pos.COSTS_TOTAL].slice(start, end)
      data.costs = formatter.format(data.costs)
      data.annuity = formatter.format({ Annuity: spreadSheetData[pos.ANNUITY].slice(start, end) })
      data.revenuePerHead = formatter.format({ RPH: spreadSheetData[pos.REVENUE_PER_HEAD].slice(start, end) })
      // SALES
      data.closedDeals = formatter.format({ ClosedDeals: spreadSheetData[pos.CLOSED_DEALS].slice(start, end) })
      data.pipeline = formatter.format({ Pipeline: spreadSheetData[pos.PIPELINE].slice(start, end) })
      // PRODUCTION
      data.tickets.Opened = spreadSheetData[pos.TICKETS_OPENED].slice(start, end)
      data.tickets.Closed = spreadSheetData[pos.TICKETS_CLOSED].slice(start, end)
      data.tickets = formatter.format(data.tickets)
      // HR
      data.headCount = formatter.format({ HeadCount: spreadSheetData[pos.HEAD_COUNT].slice(start, end) })
      data.sickDays = formatter.format({ SickDays: spreadSheetData[pos.SICK_DAYS].slice(start, end) })
      data.staffSatisfaction.value = spreadSheetData[pos.STAFF_SATISFACTION][end - 1]
      data.clientSatisfaction.value = spreadSheetData[pos.CLIENT_SATISFACTION][end - 1]

      console.log('Formatted Data', data)
      getSpreadsheetTargets()
    }
  })
}

function getSpreadsheetTargets () {
  return $.ajax({
    url: '/targets'
  , success: (body) => {
      console.log('Target', body.values)
      spreadSheetTargets = body.values
      data.target.revenue = spreadSheetTargets[pos.TARGETS.REVENUE][1]
      data.target.profit = spreadSheetTargets[pos.TARGETS.PROFIT][1]
      data.target.revenuePerHead = spreadSheetTargets[pos.TARGETS.REVENUE_PER_HEAD][1]
      data.staffSatisfaction.target = spreadSheetTargets[pos.TARGETS.STAFF_SATISFACTION][1]
      data.clientSatisfaction.target = spreadSheetTargets[pos.TARGETS.CLIENT_SATISFACTION][1]
      data.revenueVsTarget = formatter.formatItemVsTarget({ Target: data.target.revenue, Revenue: data.revenue })
      data.profitVsTarget = formatter.formatItemVsTarget({ Target: data.target.profit, Profit: data.profit })
      data.revenuePerHeadVsTarget = formatter.formatItemVsTarget({
        Target: data.target.revenuePerHead
      , RPH: data.revenuePerHead
      }, true)
      data.revenueVsTargetPie = formatter.formatPieChart(data.target.revenue, data.revenue)
      repopulate()
    }
  })
}

function repopulate () {
  let width = Math.floor(($(window).width() - 80) / 4) //480//320
    , height = width / 1.6 //300//200
    , colour = '#444444'

  // Finance
  createBarGraph('revenue', colour, width, height, data.revenue)
  createBarGraph('profit', colour, width, height, data.profit)
  createBarGraph('costs', colour, width, height, data.costs)
  createBarGraph('annuity', colour, width, height, data.annuity)
  createBarGraph('revenue-per-head', colour, width, height, data.revenuePerHead)
  createLineChart('revenue-vs-target', colour, width, height, data.revenueVsTarget)
  createLineChart('profit-vs-target', colour, width, height, data.profitVsTarget)
  createLineChart('rph-vs-target', colour, width, height, data.revenuePerHeadVsTarget)
  createPieChart('revenue-vs-target-pie', colour, width, height, data.revenueVsTargetPie)

  // Sales
  colour = '#3A539B'
  createBarGraph('closed-deals', colour, width, height, data.closedDeals)
  createBarGraph('pipeline', colour, width, height, data.pipeline)

  // Production
  colour = '#00B16A'
  createBarGraph('tickets', colour, width, height, data.tickets)

  // HR Stats
  colour = '#8E44AD'
  createBarGraph('head-count', colour, width, height, data.headCount)
  createBarGraph('sick-days', colour, width, height, data.sickDays)
  addDetails('#staff-satisfaction', width, height / 2, data.staffSatisfaction)
  addDetails('#client-satisfaction', width, height / 2, data.clientSatisfaction)
}

function getUrlParameter (name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(window.location.search)
    || [null, ''])[1].replace(/\+/g, '%20')) || null
}

google.charts.load('current', { packages: [ 'corechart' ] })
google.charts.setOnLoadCallback(getSpreadsheetData)
