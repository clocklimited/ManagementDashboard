var express = require('express')
  , port = process.env.PORT || 9001
  , app = express()
  , SheetsHelper = require('./lib/SheetsHelper')
  , spreadsheetId = '1vYkw_63Ak4tGoBvD1uT_hDxSMEWmgydyPLg2nHr9FPc' // Development Sheet
  // , spreadsheetId = '1Pt0CFzEwJx-AYT0H98OKwoDkmpPw6xvYujc04eo2e7o' // Live Sheet

app.set('view engine', 'pug')
app.use(express.static(__dirname))
app.enable('trust proxy')

app.get('/', function (req, res) {
  console.log('GET: / from IP', req.ip)
  res.render('index')
})

app.get('/data', function (req, res) {
  console.log('GET: /data from IP', req.ip)
  SheetsHelper.service.spreadsheets.values.get({
    spreadsheetId
    , range: 'Data'
  }, function sheetReady (err, sheet) {
    if (err) console.log(err)
    res.status(200).json(sheet)
    console.log('GET: /data from IP %s sent `data` sheet', req.ip)
  })
})

app.get('/targets', function (req, res) {
  console.log('GET: /targets from IP', req.ip)
  SheetsHelper.service.spreadsheets.values.get({
    spreadsheetId
    , range: 'Targets'
  }, function sheetReady (err, sheet) {
    if (err) console.log(err)
    res.status(200).json(sheet)
    console.log('GET: /targets from IP %s sent `targets` sheet', req.ip)
  })
})

app.listen(port, function () {
  console.log('Listening on port %d', port)
})
