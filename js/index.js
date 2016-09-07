const gpie = require('./createPieChartGoogle')
    , gchart = require('./createBarGraphGoogle')
    , gline = require('./createLineGraphGoogle')
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
          opened: [ ]
        , closed: [ ]
      }
    , costs: {
        staff: [ ]
      , total: [ ]
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
  , success: function (body) {
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
      data.revenue = formatGoogle(data.dates, spreadSheetData[pos.REVENUE].slice(start, end))
      data.profit = formatGoogle(data.dates, spreadSheetData[pos.PROFIT].slice(start, end))
      data.costs.staff = spreadSheetData[pos.COSTS_STAFF].slice(start, end)
      data.costs.total = spreadSheetData[pos.COSTS_TOTAL].slice(start, end)
      data.costs = formatDualGoogle(data.dates, data.costs)
      data.annuity = formatGoogle(data.dates, spreadSheetData[pos.ANNUITY].slice(start, end))
      data.revenuePerHead = formatGoogle(data.dates, spreadSheetData[pos.REVENUE_PER_HEAD].slice(start, end))
      // data.staffTurnover = format(data.dates, spreadSheetData[pos.STAFF_TURNOVER].slice(start, end))
      // SALES
      data.winRate = formatGoogle(data.dates, spreadSheetData[pos.WIN_RATE].slice(start, end))
      data.closedDeals = formatGoogle(data.dates, spreadSheetData[pos.CLOSED_DEALS].slice(start, end))
      data.leads = formatGoogle(data.dates, spreadSheetData[pos.LEADS].slice(start, end))
      data.pipeline = formatGoogle(data.dates, spreadSheetData[pos.PIPELINE].slice(start, end))
      // PRODUCTION
      data.tickets.opened = spreadSheetData[pos.TICKETS_OPENED].slice(start, end)
      data.tickets.closed = spreadSheetData[pos.TICKETS_CLOSED].slice(start, end)
      data.tickets = formatDualGoogle(data.dates, data.tickets)
      // HR
      data.headCount = formatGoogle(data.dates, spreadSheetData[pos.HEAD_COUNT].slice(start, end))
      data.sickDays = formatGoogle(data.dates, spreadSheetData[pos.SICK_DAYS].slice(start, end))
      data.holiday = formatGoogle(data.dates, spreadSheetData[pos.HOLIDAY].slice(start, end))
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
  , success: function (body) {
      console.log('Target', body.values)
      spreadSheetTargets = body.values
      data.target.revenue = spreadSheetTargets[pos.TARGETS.REVENUE][1]
      data.target.profit = spreadSheetTargets[pos.TARGETS.PROFIT][1]
      data.target.revenuePerHead = spreadSheetTargets[pos.TARGETS.REVENUE_PER_HEAD][1]
      data.staffSatisfaction.target = spreadSheetTargets[pos.TARGETS.STAFF_SATISFACTION][1]
      data.clientSatisfaction.target = spreadSheetTargets[pos.TARGETS.CLIENT_SATISFACTION][1]
      data.revenueVsTarget = formatItemVsTargetGoogle(data.dates, data.target.revenue, data.revenue)
      data.profitVsTarget = formatItemVsTargetGoogle(data.dates, data.target.profit, data.profit)
      data.revenuePerHeadVsTarget = formatItemVsTargetGoogle(data.dates, data.target.revenuePerHead, data.revenuePerHead, true)
      data.revenueVsTargetPie = formatPieChart(data.dates, data.target.revenue, data.revenue)
      data.profitVsTargetPie = formatPieChart(data.dates, data.target.profit, data.profit)
      repopulate()
      calculateStatus()
    }
  })
}

function repopulate () {
  let width = Math.floor(($(window).width() - 80) / 4) //480//320
    , height = width / 1.6 //300//200
    , colour = '#444444'

  // Finance
  gchart('revenue', colour, width, height, data.revenue)
  gchart('profit', colour, width, height, data.profit)
  gchart('costs', colour, width, height, data.costs)
  gchart('annuity', colour, width, height, data.annuity)
  gchart('revenue-per-head', colour, width, height, data.revenuePerHead)
  // createValueBarGraph('#staff-turnover', width, height, data.staffTurnover)
  gline('revenue-vs-target', colour, width, height, data.revenueVsTarget)
  gline('profit-vs-target', colour, width, height, data.profitVsTarget)
  gline('rph-vs-target', colour, width, height, data.revenuePerHeadVsTarget)
  gpie('revenue-vs-target-pie', '#444444', width, height, data.revenueVsTargetPie)
  // createPieChart('#profit-vs-target-pie', width, height, data.profitVsTargetPie)

  // Sales
  colour = '#3A539B'
  gchart('win-rate', colour, width, height, data.winRate)
  gchart('closed-deals', colour, width, height, data.closedDeals)
  gchart('leads', colour, width, height, data.leads)
  gchart('pipeline', colour, width, height, data.pipeline)

  // Production
  colour = '#00B16A'
  // createPercentageAreaGraph('#utilisation', width, height, 'data/utilisation.tsv')
  // createValueBarGraph('#active-projects', width, height, 'data/projects.tsv')
  gchart('tickets', colour, width, height, data.tickets)

  // HR Stats
  colour = '#8E44AD'
  gchart('head-count', colour, width, height, data.headCount)
  gchart('sick-days', colour, width, height, data.sickDays)
  gchart('holiday', colour, width, height, data.holiday)
  addDetails('#staff-satisfaction', width, height / 2, data.staffSatisfaction)
  addDetails('#client-satisfaction', width, height / 2, data.clientSatisfaction)
}

function calculateStatus () {
  // Revenue
  addStatusGoogle('#revenue-status', data.revenue, 'last month')

  // Profit
  addStatusGoogle('#profit-status', data.profit, 'last month')

  // Annuity
  addStatusGoogle('#annuity-status', data.annuity, 'last month')

  // Revenue Per Head
  addStatusGoogle('#revenue-per-head-status', data.revenuePerHead, 'last month')

  // Staff Turnover
  // addStatus('#staff-turnover-status', data.staffTurnover, 'last month')

  // Revenue vs Target
  addStatusGoogle('#revenue-vs-target-status', data.revenueVsTarget, 'target')

  // Profit vs Target
  addStatusGoogle('#profit-vs-target-status', data.profitVsTarget, 'target')

  // RPH vs Target
  addStatusGoogle('#rph-vs-target-status', data.revenuePerHeadVsTarget, 'target')

  // Revenue vs Target - Pie
  addPieStatus('#revenue-vs-target-pie-status', data.target.revenue, data.revenueVsTargetPie)

  // Closed Deals
  addStatusGoogle('#closed-deals-status', data.closedDeals, 'last month')

  // Leads
  addStatusGoogle('#leads-status', data.leads, 'last month')

  // Win Rate
  addStatus('#win-rate-status', data.winRate, 'last month')

  // Pipeline
  addStatusGoogle('#pipeline-status', data.pipeline, 'last month')

  // Staff Satisfaction
  addStatus('#staff-satisfaction-status', [ data.staffSatisfaction ])

  // Client Satisfaction
  addStatus('#client-satisfaction-status', [ data.clientSatisfaction ])
}

function addStatus (targetId, data) {
  let length = data.length
    , currentMonthData
    , value
    , target
    , difference
    , arrow = '&#8212;' // Dash
    , colour = 'black'
    , fallbackValue = { value: 1, target: 1 }

  currentMonthData = validate(data[length - 1], fallbackValue)
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

function addStatusGoogle (targetId, dataSet, vs) {
  let length = dataSet.getNumberOfRows()
    , current
    , value
    , target
    , previous
    , difference
    , arrow = '&#8212;' // Dash
    , colour = 'black'

  if (length === 0) {
    return
  }

  if (vs === 'target') {
    value = dataSet.getValue(length - 1, 2)
    target = dataSet.getValue(length - 1, 1)
    difference = (value / target) * 100 - 100
    console.log(value, target)
  } else { // Last month
    console.log(dataSet)
    current = dataSet.getValue(length - 1, 1)
    previous = dataSet.getValue(length - 2, 1)
    difference = ((current - previous) / Math.abs(previous)) * 100
    console.log(current, previous, difference)
  }

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
    .html(arrow + ' ' + difference.toFixed(1) + '%')
    .css('color', colour)
}

function addPieStatus (targetId, target, dataSet) {
  var currentValue = dataSet.getValue(1, 1)
    , difference
    , arrow = '&#8212;' // Dash
    , colour = 'black'

  target = +target.replace(/£|,/g, '')
  difference = (currentValue / target) * 100

  $(targetId)
    .html(arrow + ' ' + difference.toFixed(2) + '%')
    .css('color', colour)
}

function formatGoogle (dates, dataSet) {
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
  var dataTable = google.visualization.arrayToDataTable(formatted)
  return dataTable
}

function formatDualGoogle (dates, data) {
  let keys = Object.keys(data)
    , formatted = [ ['Date'].concat(keys) ]

  console.log(data)
  // data[keys[0]].forEach((item, index) => {
  //   formatted.push([ dates[index], +item, +validate(data[keys[1]][index], 0) ])
  // })

  dates.forEach((item, index) => {
    formatted.push([ item, +validate(data[keys[0]][index], 0), +validate(data[keys[1]][index], 0) ])
  })
  console.log(formatted)
  /*
  [ { date: 'Sep 16'
    , opened: 3
    , closed: 4
  } ]
  */
  var dataTable = google.visualization.arrayToDataTable(formatted)
  return dataTable
}

function formatItemVsTargetGoogle (dates, target, data, notCumulative) {
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
  dates.forEach(function (item, index) {
    runningTarget += oneMonthTarget
    runningRevenueTotal += data.getValue(index, 1)
    formatted.push([
        item
      , runningTarget
      , runningRevenueTotal
    ])
  })

  /*
  [ { date: date
    , target: target
    , revenue: revenue
  } ]
  */
  var dataTable = google.visualization.arrayToDataTable(formatted)
  return dataTable
}

function formatPieChart (dates, target, dataSet) {
  // Get cumulative total of data
  // Do target - total
  // Format data like:
  // [ { label: 'Target', value: 20 }
  //  ,{ label: 'Value',  value: 40 } ]
  var revenueTarget = validate(+target.replace(/£|,/g, ''), 0)
    , runningTotal = 0
    console.log(dataSet)
  dates.forEach(function (item, index) {
    runningTotal += dataSet.getValue(index, 1)
  })

  var dataTable = google.visualization.arrayToDataTable([
      [ 'Type', 'Value' ]
    , [ 'Target', revenueTarget - runningTotal ]
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
