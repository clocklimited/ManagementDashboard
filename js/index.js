const createValueBarGraph = require('./createValueBarGraph')
    , createPercentageAreaGraph = require('./createPercentageAreaGraph')
    , createTargetLineGraph = require('./createTargetLineGraph')
    , moment = require('moment')

let spreadSheetData = [ ]
  , data = {
      dates: [ ]
    , revenue: [ ]
    , costs: [ ]
    , revenueVsTarget: {
        date: [ ]
      , target: [ ]
      , revenue: [ ]
      }
    , winRate: [ ]
    , closedDeals: [ ]
    , leads: [ ]
    , pipeline: [ ]
    , utilisation: [ ]
    , tickets: {
          opened: [ ]
        , closed: [ ]
      }
    , activeProjects: [ ]
    , headCount: [ ]
    , holiday: [ ]
    , sickDays: [ ]
    , target: {
        revenue: 0
      }
  }
  , spreadSheetTargets = [ ]

function getSpreadsheetData () {
  return $.ajax({
    url: '/data'
  , success: function (body) {
      console.log(body.values)
      spreadSheetData = body.values
      let currentMonth = 'October 2016'//moment().format('MMMM YYYY')
        , currentMonthIndex = spreadSheetData[0].indexOf(currentMonth)
        , range = 6
        // Prevents going out of bounds
        , start = currentMonthIndex <= range ? 1 : currentMonthIndex - range
        , end = currentMonthIndex

      console.log(start, end)
      data.dates = spreadSheetData[0].slice(start, end).map((x) => moment(x, 'MMMM YYYY').format('MMM YY'))
      // ASSUMPTION: turnover = revenue
      data.revenue = formatDataD3(data.dates, spreadSheetData[1].slice(start, end))
      data.headCount = formatDataD3(data.dates, spreadSheetData[4].slice(start, end))
      data.pipeline = formatDataD3(data.dates, spreadSheetData[5].slice(start, end))
      data.closedDeals = formatDataD3(data.dates, spreadSheetData[6].slice(start, end))
      data.sickDays = formatDataD3(data.dates, spreadSheetData[11].slice(start, end))
      data.tickets.opened = spreadSheetData[12].slice(start, end)
      data.tickets.closed = spreadSheetData[13].slice(start, end)
      data.tickets = formatTicketDataD3(data.dates, data.tickets)
      data.leads = formatDataD3(data.dates, spreadSheetData[16].slice(start, end))
      console.log(data)
      getSpreadsheetTargets()
    }
  })
}

function getSpreadsheetTargets () {
  return $.ajax({
    url: '/targets'
  , success: function (body) {
      console.log(body.values)
      spreadSheetTargets = body.values
      data.target.revenue = spreadSheetTargets[1][1]
      data.revenueVsTarget = formatItemVsTarget(data.dates, data.target.revenue, data.revenue)
      repopulate()
      calculateStatus()
    }
  })
}

function repopulate () {
  var width = 480//320
    , height = 300//200

  // Finance
  createValueBarGraph('#revenue', width, height, '', data.revenue)
  createValueBarGraph('#costs', width, height, 'data/costs.tsv')
  createTargetLineGraph('#revenue-vs-target', width, height, data.revenueVsTarget)

  // Sales
  createPercentageAreaGraph('#win-rate', width, height, 'data/win-rate.tsv')
  createValueBarGraph('#closed-deals', width, height, '', data.closedDeals)
  createValueBarGraph('#leads', width, height, '', data.leads)
  createValueBarGraph('#pipeline', width, height, '', data.pipeline)

  // Production
  // createPercentageAreaGraph('#utilisation', width, height, 'data/utilisation.tsv')
  // createValueBarGraph('#active-projects', width, height, 'data/projects.tsv')
  createValueBarGraph('#tickets', width, height, '', data.tickets)

  // HR Stats
  createValueBarGraph('#head-count', width, height, '', data.headCount)
  createValueBarGraph('#sick-days', width, height, '', data.sickDays)
  createValueBarGraph('#holiday', width, height, 'data/holiday.tsv')
}

function calculateStatus () {
  let diffArrCol

  // Revenue
  diffArrCol = diffArrowColourCalculate(data.revenue)
  let differenceRevenue = diffArrCol[0]
    , arrowRevenue = diffArrCol[1]
    , colourRevenue = diffArrCol[2]

  $('#revenue-status')
    .html(arrowRevenue + ' ' + differenceRevenue + '% on last month')
    .css('color', colourRevenue)

  // Revenue vs Target
  diffArrCol = diffArrowColourCalculateTargets(data.revenueVsTarget)
  let differenceRvT = diffArrCol[0]
    , arrowRvT = diffArrCol[1]
    , colourRvT = diffArrCol[2]

  $('#revenue-vs-target-status')
    .html(arrowRvT + ' ' + differenceRvT + '%')
    .css('color', colourRvT)

  // Closed Deals
  diffArrCol = diffArrowColourCalculate(data.closedDeals)
  let differenceClosedDeals = diffArrCol[0]
    , arrowClosedDeals = diffArrCol[1]
    , colourClosedDeals = diffArrCol[2]

  $('#closed-deals-status')
    .html(arrowClosedDeals + ' ' + differenceClosedDeals + '% on last month')
    .css('color', colourClosedDeals)

  // Leads
  diffArrCol = diffArrowColourCalculate(data.leads)
  let differenceLeads = diffArrCol[0]
    , arrowLeads = diffArrCol[1]
    , colourLeads = diffArrCol[2]

  $('#leads-status')
    .html(arrowLeads + ' ' + differenceLeads + '% on last month')
    .css('color', colourLeads)

  // Pipeline

  diffArrCol = diffArrowColourCalculate(data.pipeline)
  let differencePipeline = diffArrCol[0]
    , arrowPipeline = diffArrCol[1]
    , colourPipeline = diffArrCol[2]

  $('#pipeline-status')
    .html(arrowPipeline + ' ' + differencePipeline + '% on last month')
    .css('color', colourPipeline)
}

function diffArrowColourCalculate (data) {
  let length = data.length
    , current = data[length - 1].value
    , previous = data[length - 2].value
    , difference = (current / previous) * 100 - 100
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

function formatDataD3 (dates, data) {
  let formatted = [ ]

  data.forEach((item, index) => {
    item = item.replace(/£|,/g, '')
    formatted.push({ date: dates[index], value: item })
  })
  return formatted
}

function formatTicketDataD3 (dates, data) {
  let formatted = [ ]

  data.opened.forEach((item, index) => {
    formatted.push({
        date: dates[index]
      , opened: +item
      , closed: +data.closed[index]
    })
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
