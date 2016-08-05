const createValueBarGraph = require('./createValueBarGraph')
    , createPercentageAreaGraph = require('./createPercentageAreaGraph')
    , createTargetLineGraph = require('./createTargetLineGraph')
    , moment = require('moment')
    , pos = require('../lib/positions.json')

let spreadSheetData = [ ]
  , data = {
      dates: [ ]
    , revenue: [ ]
    , profit: [ ]
    , revenueVsTarget: {
        date: [ ]
      , target: [ ]
      , value: [ ]
      }
    , profitVsTarget: {
        date: [ ]
      , target: [ ]
      , value: [ ]
    }
    , winRate: [ ]
    , closedDeals: [ ]
    , leads: [ ]
    , pipeline: [ ]
    , tickets: {
          opened: [ ]
        , closed: [ ]
      }
    , activeProjects: [ ]
    , headCount: [ ]
    , holiday: [ ]
    , sickDays: [ ]
    , costs: {
        staff: [ ]
      , total: [ ]
    }
    , target: {
        revenue: 0
      , profit: 0
      }
  }
  , spreadSheetTargets = [ ]

function getSpreadsheetData () {
  return $.ajax({
    url: '/data'
  , success: function (body) {
      console.log('Data', body.values)
      spreadSheetData = body.values
      let currentMonth = 'October 2016'//moment().format('MMMM YYYY')
        , currentMonthIndex = spreadSheetData[0].indexOf(currentMonth)
        , range = 6
        // Prevents going out of bounds
        , start = currentMonthIndex <= range ? 1 : currentMonthIndex - range
        , end = currentMonthIndex

      data.dates = spreadSheetData[0].slice(start, end)
      data.dates = data.dates.map((date) => moment(date, 'MMMM YYYY').format('MMM YY'))
      data.revenue = format(data.dates, spreadSheetData[pos.REVENUE].slice(start, end))
      data.profit = format(data.dates, spreadSheetData[pos.PROFIT].slice(start, end))
      data.headCount = format(data.dates, spreadSheetData[pos.HEAD_COUNT].slice(start, end))
      data.pipeline = format(data.dates, spreadSheetData[pos.PIPELINE].slice(start, end))
      data.closedDeals = format(data.dates, spreadSheetData[pos.CLOSED_DEALS].slice(start, end))
      data.sickDays = format(data.dates, spreadSheetData[pos.SICK_DAYS].slice(start, end))
      data.tickets.opened = spreadSheetData[pos.TICKETS_OPENED].slice(start, end)
      data.tickets.closed = spreadSheetData[pos.TICKETS_CLOSED].slice(start, end)
      data.tickets = formatDual(data.dates, data.tickets)
      data.winRate = format(data.dates, spreadSheetData[pos.WIN_RATE].slice(start, end))
      data.holiday = format(data.dates, spreadSheetData[pos.HOLIDAY].slice(start, end))
      data.costs.staff = spreadSheetData[pos.COSTS_STAFF].slice(start, end)
      data.costs.total = spreadSheetData[pos.COSTS_TOTAL].slice(start, end)
      data.costs = formatDual(data.dates, data.costs)
      data.leads = format(data.dates, spreadSheetData[pos.LEADS].slice(start, end))

      console.log('Formatted Data', data)
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
      data.target.revenue = spreadSheetTargets[1][1]
      data.target.profit = spreadSheetTargets[2][1]
      data.revenueVsTarget = formatItemVsTarget(data.dates, data.target.revenue, data.revenue)
      data.profitVsTarget = formatItemVsTarget(data.dates, data.target.profit, data.profit)
      repopulate()
      calculateStatus()
    }
  })
}

function repopulate () {
  let width = 480//320
    , height = 300//200

  // Finance
  createValueBarGraph('#revenue', width, height, data.revenue)
  createValueBarGraph('#profit', width, height, data.profit)
  createValueBarGraph('#costs', width, height, data.costs)
  createTargetLineGraph('#revenue-vs-target', width, height, data.revenueVsTarget)
  createTargetLineGraph('#profit-vs-target', width, height, data.profitVsTarget)

  // Sales
  createPercentageAreaGraph('#win-rate', width, height, data.winRate)
  createValueBarGraph('#closed-deals', width, height, data.closedDeals)
  createValueBarGraph('#leads', width, height, data.leads)
  createValueBarGraph('#pipeline', width, height, data.pipeline)

  // Production
  // createPercentageAreaGraph('#utilisation', width, height, 'data/utilisation.tsv')
  // createValueBarGraph('#active-projects', width, height, 'data/projects.tsv')
  createValueBarGraph('#tickets', width, height, data.tickets)

  // HR Stats
  createValueBarGraph('#head-count', width, height, data.headCount)
  createValueBarGraph('#sick-days', width, height, data.sickDays)
  createValueBarGraph('#holiday', width, height, data.holiday)
}

function calculateStatus () {
  let diffArrCol

  // [difference, arrow, colour] = diffArrowColourCalculate(data)

  // Revenue
  diffArrCol = diffArrowColourCalculate(data.revenue)
  $('#revenue-status')
    .html(diffArrCol[1] + ' ' + diffArrCol[0] + '% on last month')
    .css('color', diffArrCol[2])

  // Profit
  diffArrCol = diffArrowColourCalculate(data.profit)
  $('#profit-status')
    .html(diffArrCol[1] + ' ' + diffArrCol[0] + '% on last month')
    .css('color', diffArrCol[2])

  // Revenue vs Target
  diffArrCol = diffArrowColourCalculateTargets(data.revenueVsTarget)
  $('#revenue-vs-target-status')
    .html(diffArrCol[1] + ' ' + diffArrCol[0] + '% on target')
    .css('color', diffArrCol[2])

  // Profit vs Target
  diffArrCol = diffArrowColourCalculateTargets(data.profitVsTarget)
  $('#profit-vs-target-status')
    .html(diffArrCol[1] + ' ' + diffArrCol[0] + '% on target')
    .css('color', diffArrCol[2])

  // Closed Deals
  diffArrCol = diffArrowColourCalculate(data.closedDeals)
  $('#closed-deals-status')
    .html(diffArrCol[1] + ' ' + diffArrCol[0] + '% on last month')
    .css('color', diffArrCol[2])

  // Leads
  diffArrCol = diffArrowColourCalculate(data.leads)
  $('#leads-status')
    .html(diffArrCol[1] + ' ' + diffArrCol[0] + '% on last month')
    .css('color', diffArrCol[2])

  // Win Rate
  diffArrCol = diffArrowColourCalculate(data.winRate)
  $('#win-rate-status')
    .html(diffArrCol[1] + ' ' + diffArrCol[0] + '% on last month')
    .css('color', diffArrCol[2])

  // Pipeline
  diffArrCol = diffArrowColourCalculate(data.pipeline)
  $('#pipeline-status')
    .html(diffArrCol[1] + ' ' + diffArrCol[0] + '% on last month')
    .css('color', diffArrCol[2])
}

function diffArrowColourCalculate (data) {
  let length = data.length
    , current = data[length - 1].value
    , previous = data[length - 2].value
    , difference = ((previous - current) / previous) * 100
    , arrow
    , colour

    if (difference === 0) {
      arrow = '&#8212;' // Dash
      colour = 'black'
    } else if (difference > 0) {
      arrow = '&#8593;' // Up arrow
      colour = 'green'
    } else if (difference < 0) {
      arrow = '&#8595;' // Down arrow
      colour = 'red'
    }

    return [difference.toFixed(2), arrow, colour]
}

function diffArrowColourCalculateTargets (data) {
  let length = data.length
    , currentMonthData = data[length - 1]
    , revenue = currentMonthData.value
    , target = currentMonthData.target
    , difference = (revenue / target) * 100 - 100
    , arrow
    , colour

    if (difference === 0) {
      arrow = '&#8212;' // Dash
      colour = 'black'
    } else if (difference > 0) {
      arrow = '&#8593;' // Up arrow
      colour = 'green'
    } else if (difference < 0) {
      arrow = '&#8595;' // Down arrow
      colour = 'red'
    }

    return [difference.toFixed(2), arrow, colour]
}

function format (dates, data) {
  let formatted = [ ]

  data.forEach((item, index) => {
    item = item.replace(/£|,/g, '')
    formatted.push({ date: dates[index], value: item })
  })
  return formatted
}

function formatDual (dates, data) {
  let formatted = [ ]
    , keys = Object.keys(data)

  data[keys[0]].forEach((item, index) => {
    let obj = { }
    obj.date = dates[index]
    obj[keys[0]] = +item
    obj[keys[1]] = +data[keys[1]][index]
    formatted.push(obj)
  })
  /*
  [ { date: 'Sep 16'
    , opened: 3
    , closed: 4
  } ]
  */
  return formatted
}

function formatItemVsTarget (dates, target, data) {
  // Strip £ , and turn into monthly target
  let oneMonthTarget = (+target.replace(/£|,/g, '')) / 12
    , runningTarget = oneMonthTarget
    , runningRevenueTotal = 0
    , formatted = [ ]

  dates.forEach(function (item, index) {
    runningTarget += oneMonthTarget
    runningRevenueTotal += +data[index].value
    formatted.push({
        date: item
      , target: runningTarget
      , value: runningRevenueTotal
    })
  })

  /*
  [ { date: date
    , target: target
    , revenue: revenue
  } ]
  */
  return formatted
}

getSpreadsheetData()
