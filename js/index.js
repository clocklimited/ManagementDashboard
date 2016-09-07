const createPieChart = require('./createPieChartGoogle')
    , createBarGraph = require('./createBarGraphGoogle')
    , createLineChart = require('./createLineGraphGoogle')
    , addDetails = require('./addDetails')
    , moment = require('moment')
    , pos = require('../lib/positions.json')

let spreadSheetData = [ ]
  , data = {
     revenueVsTarget: {
        date: [ ]
      , target: [ ]
      , value: [ ]
      }
    , profitVsTarget: {
        date: [ ]
      , target: [ ]
      , value: [ ]
    }
    , revenuePerHeadVsTarget: {
        date: [ ]
      , target: [ ]
      , value: [ ]
    }
    , tickets: {
          Opened: [ ]
        , Closed: [ ]
      }
    , costs: {
        Staff: [ ]
      , Total: [ ]
    }
    , target: {
        revenue: 0
      , profit: 0
      , revenuePerHead: 0
      }
    , staffSatisfaction: {
        target: 0
      , value: 0
    }
    , clientSatisfaction: {
        target: 0
      , value: 0
    }
  }
  , spreadSheetTargets = [ ]

function getSpreadsheetData () {
  return $.ajax({
    url: '/data'
  , success: (body) => {
      console.log('Data', body.values)
      spreadSheetData = body.values
      let currentMonth = validate(getUrlParameter('month'), moment().format('MMMM YYYY'))
        , currentMonthIndex = spreadSheetData[pos.BOARDPACK_DATE].indexOf(currentMonth) + 1
        , range = 6
        // Prevents going out of bounds
        , start = currentMonthIndex <= range ? 1 : currentMonthIndex - range
        , end = currentMonthIndex

      data.dates = spreadSheetData[pos.MONTH].slice(start, end)
      data.dates = data.dates.map((date) => moment(date, 'MMMM YYYY').format('MMM YY'))
      // FINANCE
      data.revenue = format(data.dates, spreadSheetData[pos.REVENUE].slice(start, end))
      data.profit = format(data.dates, spreadSheetData[pos.PROFIT].slice(start, end))
      data.costs.Staff = spreadSheetData[pos.COSTS_STAFF].slice(start, end)
      data.costs.Total = spreadSheetData[pos.COSTS_TOTAL].slice(start, end)
      data.costs = formatDual(data.dates, data.costs)
      data.annuity = format(data.dates, spreadSheetData[pos.ANNUITY].slice(start, end))
      data.revenuePerHead = format(data.dates, spreadSheetData[pos.REVENUE_PER_HEAD].slice(start, end))
      // data.staffTurnover = format(data.dates, spreadSheetData[pos.STAFF_TURNOVER].slice(start, end))
      // SALES
      data.winRate = format(data.dates, spreadSheetData[pos.WIN_RATE].slice(start, end))
      data.closedDeals = format(data.dates, spreadSheetData[pos.CLOSED_DEALS].slice(start, end))
      data.leads = format(data.dates, spreadSheetData[pos.LEADS].slice(start, end))
      data.pipeline = format(data.dates, spreadSheetData[pos.PIPELINE].slice(start, end))
      // PRODUCTION
      data.tickets.Opened = spreadSheetData[pos.TICKETS_OPENED].slice(start, end)
      data.tickets.Closed = spreadSheetData[pos.TICKETS_CLOSED].slice(start, end)
      data.tickets = formatDual(data.dates, data.tickets)
      // HR
      data.headCount = format(data.dates, spreadSheetData[pos.HEAD_COUNT].slice(start, end))
      data.sickDays = format(data.dates, spreadSheetData[pos.SICK_DAYS].slice(start, end))
      data.holiday = format(data.dates, spreadSheetData[pos.HOLIDAY].slice(start, end))
      data.staffSatisfaction.value = spreadSheetData[pos.STAFF_SATISFACTION][end - 1]
      data.clientSatisfaction.value = spreadSheetData[pos.CLIENT_SATISFACTION][end - 1]

      console.log('Formatted Data', data)
      console.log('Current Month', currentMonth, currentMonthIndex, start, end)
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
      data.revenueVsTarget = formatItemVsTarget(data.dates, data.target.revenue, data.revenue)
      data.profitVsTarget = formatItemVsTarget(data.dates, data.target.profit, data.profit)
      data.revenuePerHeadVsTarget = formatItemVsTarget(data.dates, data.target.revenuePerHead, data.revenuePerHead, true)
      data.revenueVsTargetPie = formatPieChart(data.dates, data.target.revenue, data.revenue)
      data.profitVsTargetPie = formatPieChart(data.dates, data.target.profit, data.profit)
      repopulate()
      // calculateStatus()
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
  // createValueBarGraph('#staff-turnover', width, height, data.staffTurnover)
  createLineChart('revenue-vs-target', colour, width, height, data.revenueVsTarget)
  createLineChart('profit-vs-target', colour, width, height, data.profitVsTarget)
  createLineChart('rph-vs-target', colour, width, height, data.revenuePerHeadVsTarget)
  createPieChart('revenue-vs-target-pie', colour, width, height, data.revenueVsTargetPie)
  // createPieChart('#profit-vs-target-pie', width, height, data.profitVsTargetPie)

  // Sales
  colour = '#3A539B'
  createBarGraph('win-rate', colour, width, height, data.winRate)
  createBarGraph('closed-deals', colour, width, height, data.closedDeals)
  createBarGraph('leads', colour, width, height, data.leads)
  createBarGraph('pipeline', colour, width, height, data.pipeline)

  // Production
  colour = '#00B16A'
  // createPercentageAreaGraph('#utilisation', width, height, 'data/utilisation.tsv')
  // createValueBarGraph('#active-projects', width, height, 'data/projects.tsv')
  createBarGraph('tickets', colour, width, height, data.tickets)

  // HR Stats
  colour = '#8E44AD'
  createBarGraph('head-count', colour, width, height, data.headCount)
  createBarGraph('sick-days', colour, width, height, data.sickDays)
  createBarGraph('holiday', colour, width, height, data.holiday)
  addDetails('#staff-satisfaction', width, height / 2, data.staffSatisfaction)
  addDetails('#client-satisfaction', width, height / 2, data.clientSatisfaction)
}

function format (dates, dataSet) {
  let formatted = [ [
      { label: 'Date', type: 'string' }
    , { label: 'Value', type: 'number' }
  ] ]

  dataSet.forEach((item, index) => {
    if (typeof item === 'string') {
      item = item.replace(/£|,/g, '')
    }
    formatted.push([ dates[index], +validate(item, 0) ])
  })

  return google.visualization.arrayToDataTable(formatted)
}

function formatDual (dates, data) {
  let keys = Object.keys(data)
    , formatted = [ ['Date'].concat(keys) ]

  dates.forEach((item, index) => {
    formatted.push([ item, +validate(data[keys[0]][index], 0), +validate(data[keys[1]][index], 0) ])
  })
  console.log(formatted)

  return google.visualization.arrayToDataTable(formatted)
}

function formatItemVsTarget (dates, target, data, notCumulative) {
  // Strip £ , and turn into monthly target
  let oneMonthTarget = validate(+target.replace(/£|,/g, ''), 0)
    , runningTarget = 0
    , runningRevenueTotal = 0
    , formatted = [ [ 'Date', 'Target', 'Value' ] ]

  if (notCumulative) {
    runningTarget = oneMonthTarget
    oneMonthTarget = 0
  } else {
    oneMonthTarget /= 12
  }
  dates.forEach((item, index) => {
    runningTarget += oneMonthTarget
    runningRevenueTotal += data.getValue(index, 1)
    formatted.push([
        item
      , runningTarget
      , runningRevenueTotal
    ])
  })
  return google.visualization.arrayToDataTable(formatted)
}

function formatPieChart (dates, target, dataSet) {
  var revenueTarget = validate(+target.replace(/£|,/g, ''), 0)
    , runningTotal = 0
    console.log(dataSet)
  dates.forEach((item, index) => {
    runningTotal += dataSet.getValue(index, 1)
  })


  var dataTable = google.visualization.arrayToDataTable([
      [ 'Type', 'Value' ]
    , [ 'Target', (revenueTarget - runningTotal) ]
    , [ 'Value', runningTotal ]
  ])
  return dataTable
}

function validate (data, fallbackValue) {
  if (data === '' || data === '?' || data === undefined || data === null) {
    return fallbackValue
  } else {
    return data
  }
}

function getUrlParameter (name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(window.location.search)
    || [null, ''])[1].replace(/\+/g, '%20')) || null
}

google.charts.load('current', { packages: [ 'corechart' ] })
google.charts.setOnLoadCallback(getSpreadsheetData)
