var NodeCache = require('node-cache')
  , cache = new NodeCache({ stdTTL: (12 * 60 * 60) })
  , SheetsHelper = require('./sheets-helper')
  , spreadsheetId = process.env.SPREADSHEET_ID || ''

module.exports = {
  get: getFromCache
, clear: clearCache
}

function getFromCache (name, req, res) {
  cache.get(name, function (err, data) {
    if (err) return console.log(err)
    if (data) {
      // Use cached data
      res.status(200).json(data)
      console.log('GET: %s from IP %s sent cached `%s` sheet', name, req.ip, name)
    } else {
      // Cached data expired/missing, get new
      SheetsHelper.service.spreadsheets.values.get({
        spreadsheetId
        , range: name
      }, function sheetReady (err, sheet) {
        if (err) console.log(err)
        res.status(200).json(sheet)
        console.log('GET: %s from IP %s sent cached `%s` sheet', name, req.ip, name)
        cache.set(name, sheet, function (err, result) {
          if (err || !result) return console.log('Failed to cache `%s`, err:%s', name, err)
          else console.log('Cached `%s`', name)
        })
      })
    }
  })
}

function clearCache (req, res) {
  cache.del([ 'Data', 'Targets' ], function (err) {
    if (err) return console.log(err)
    else {
      console.log('GET: refresh from IP %s deleted cached sheets', req.ip)
      res.redirect('/show')
    }
  })
}
