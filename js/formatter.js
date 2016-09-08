module.exports = function (dates) {
  function format (dataSet) {
    let keys = Object.keys(dataSet)
      , formatted = [ ['Date'].concat(keys) ]

    dates.forEach((date, index) => {
      var row = [ date ]
      keys.forEach((key) => {
        if (typeof dataSet[key][index] === 'string') {
          var item = dataSet[key][index].replace(/£|,/g, '')
        }
        // v: Numerical value, f: Formatted value
        // Eg: v: 20000, f: £20,000
        row.push({ v: +validate(item, 0), f: dataSet[key][index] })
      })
      formatted.push(row)
    })

    return google.visualization.arrayToDataTable(formatted)
  }

  function formatItemVsTarget (target, data, notCumulative) {
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

  function formatPieChart (target, dataSet) {
    var revenueTarget = validate(+target.replace(/£|,/g, ''), 0)
      , runningTotal = 0

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

  return {
      format: format
    , formatItemVsTarget: formatItemVsTarget
    , formatPieChart: formatPieChart
  }
}

function validate (data, fallbackValue) {
  if (data === '' || data === '?' || data === undefined || data === null) {
    return fallbackValue
  } else {
    return data
  }
}
