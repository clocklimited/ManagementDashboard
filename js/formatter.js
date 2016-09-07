module.exports = function (dates) {
  function format (dataSet) {
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

  function formatDual (data) {
    let keys = Object.keys(data)
      , formatted = [ ['Date'].concat(keys) ]

    dates.forEach((item, index) => {
      formatted.push([ item, +validate(data[keys[0]][index], 0), +validate(data[keys[1]][index], 0) ])
    })
    console.log(formatted)

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

  return {
      format: format
    , formatDual: formatDual
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
