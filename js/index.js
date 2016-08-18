const createValueBarGraph = require('./createValueBarGraph')
    , createPercentageAreaGraph = require('./createPercentageAreaGraph')
    , createTargetLineGraph = require('./createTargetLineGraph')
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
  }
  , spreadSheetTargets = [ ]

function getSpreadsheetData () {
  return $.ajax({
    url: '/data'
  , success: function (body) {
      console.log('Data', body.values)
      spreadSheetData = body.values
      let currentMonth = moment().format('MMMM YYYY')
        , currentMonthIndex = spreadSheetData[0].indexOf(currentMonth)
        , range = 6
        // Prevents going out of bounds
        , start = currentMonthIndex <= range ? 1 : currentMonthIndex - range
        , end = currentMonthIndex

      data.dates = spreadSheetData[0].slice(start, end)
      data.dates = data.dates.map((date) => moment(date, 'MMMM YYYY').format('MMM YY'))
      // FINANCE
      data.revenue = format(data.dates, spreadSheetData[pos.REVENUE].slice(start, end))
      data.profit = format(data.dates, spreadSheetData[pos.PROFIT].slice(start, end))
      data.costs.staff = spreadSheetData[pos.COSTS_STAFF].slice(start, end)
      data.costs.total = spreadSheetData[pos.COSTS_TOTAL].slice(start, end)
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
      data.tickets.opened = spreadSheetData[pos.TICKETS_OPENED].slice(start, end)
      data.tickets.closed = spreadSheetData[pos.TICKETS_CLOSED].slice(start, end)
      data.tickets = formatDual(data.dates, data.tickets)
      // HR
      data.headCount = format(data.dates, spreadSheetData[pos.HEAD_COUNT].slice(start, end))
      data.sickDays = format(data.dates, spreadSheetData[pos.SICK_DAYS].slice(start, end))
      data.holiday = format(data.dates, spreadSheetData[pos.HOLIDAY].slice(start, end))
      data.staffSatisfaction = format(data.dates, spreadSheetData[pos.STAFF_SATISFACTION].slice(start, end))

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
      data.target.revenuePerHead = spreadSheetTargets[5][1]
      data.revenueVsTarget = formatItemVsTarget(data.dates, data.target.revenue, data.revenue)
      data.profitVsTarget = formatItemVsTarget(data.dates, data.target.profit, data.profit)
      data.revenuePerHeadVsTarget = formatItemVsTarget(data.dates, data.target.revenuePerHead, data.revenuePerHead)
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
  createValueBarGraph('#annuity', width, height, data.annuity)
  createValueBarGraph('#revenue-per-head', width, height, data.revenuePerHead)
  // createValueBarGraph('#staff-turnover', width, height, data.staffTurnover)
  createTargetLineGraph('#revenue-vs-target', width, height, data.revenueVsTarget)
  createTargetLineGraph('#profit-vs-target', width, height, data.profitVsTarget)
  createTargetLineGraph('#rph-vs-target', width, height, data.revenuePerHeadVsTarget)

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
  createPercentageAreaGraph('#staff-satisfaction', width, height, data.staffSatisfaction)
}

function calculateStatus () {
  // Revenue
  addStatus('#revenue-status', data.revenue, 'last month')

  // Profit
  addStatus('#profit-status', data.profit, 'last month')

  // Annuity
  addStatus('#annuity-status', data.annuity, 'last month')

  // Revenue Per Head
  addStatus('#revenue-per-head-status', data.revenuePerHead, 'last month')

  // Staff Turnover
  // addStatus('#staff-turnover-status', data.staffTurnover, 'last month')

  // Revenue vs Target
  addStatus('#revenue-vs-target-status', data.revenueVsTarget, 'target')

  // Profit vs Target
  addStatus('#profit-vs-target-status', data.profitVsTarget, 'target')

  // RPH vs Target
  addStatus('#rph-vs-target-status', data.revenuePerHeadVsTarget, 'target')

  // Closed Deals
  addStatus('#closed-deals-status', data.closedDeals, 'last month')

  // Leads
  addStatus('#leads-status', data.leads, 'last month')

  // Win Rate
  addStatus('#win-rate-status', data.winRate, 'last month')

  // Pipeline
  addStatus('#pipeline-status', data.pipeline, 'last month')
}

function addStatus (target, data, vs) {
  let length = data.length
    , current
    , previous
    , difference
    , arrow
    , colour

  if (vs !== 'target') {
    current = data[length - 1].value
    previous = data[length - 2].value
    difference = ((current - previous) / Math.abs(previous)) * 100
  } else {
    let currentMonthData = data[length - 1]
      , revenue = currentMonthData.value
      , target = currentMonthData.target
    difference = (revenue / target) * 100 - 100
  }

  if (difference === 0) {
    arrow = '&#8212;' // Dash
    colour = 'black'
  } else if (difference > 0) {
    arrow = '&#x25B2;' // Up arrow
    colour = 'rgb(10, 220, 10)'
  } else if (difference < 0) {
    arrow = '&#x25BC;' // Down arrow
    colour = 'rgb(160, 8, 8)'
  }
  $(target)
    .html(arrow + ' ' + difference.toFixed(2) + '%')//' on ' + vs)
    .css('color', colour)
}

function format (dates, data) {
  let formatted = [ ]

  data.forEach((item, index) => {
    item = item.replace(/£|,/g, '')
    formatted.push({
      date: dates[index]
    , value: item || '0'
    })
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
    obj[keys[1]] = +data[keys[1]][index] || 0
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
