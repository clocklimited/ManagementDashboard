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

  function formatItemVsTarget (data, notCumulative) {
    // Strip £ , and turn into monthly target
    let oneMonthTarget = validate(+data.Target.replace(/£|,/g, ''), 0)
      , runningTarget = 0
      , runningRevenueTotal = 0
      , keys = Object.keys(data)
      , formatted = [ [ 'Date' ].concat(keys) ]

    if (notCumulative) {
      runningTarget = oneMonthTarget
      oneMonthTarget = 0
    } else {
      oneMonthTarget /= 12
      oneMonthTarget = +oneMonthTarget.toFixed(0)
    }
    dates.forEach((date, index) => {
      runningTarget += oneMonthTarget
      runningRevenueTotal += data[keys[1]].getValue(index, 1)
      formatted.push([
          date
        , { v: runningTarget, f: formatCurrency(runningTarget) }
        , { v: runningRevenueTotal, f: formatCurrency(runningRevenueTotal) }
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
    var amountToTarget = revenueTarget - runningTotal
    var dataTable = google.visualization.arrayToDataTable([
        [ 'Type', 'Value' ]
      , [ 'Target', { v: amountToTarget, f: formatCurrency(amountToTarget) } ]
      , [ 'Value', { v: runningTotal, f: formatCurrency(runningTotal) } ]
    ])
    return dataTable
  }

  function formatCurrency (x) {
    var parts = x.toString().split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return '£' + parts.join('.')
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
