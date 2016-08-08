var express = require('express')
  , port = process.env.PORT || 9001
  , app = express()
  , SheetsHelper = require('./lib/SheetsHelper')

app.set('view engine', 'pug')
app.use(express.static(__dirname))

// var authClient = new google.auth.JWT(
//   '916233215878-rgv1hs8lb5d4bmq2gh7mip8eebu170kl@developer.gserviceaccount.com'
//   , __dirname + '/lib/binary/key.pem'
//   , null
//   , ['https://www.googleapis.com/auth/spreadsheets']
// )

app.get('/', function (req, res) {
  res.render('index')
})

app.get('/data', function (req, res) {
  SheetsHelper.service.spreadsheets.values.get({
    spreadsheetId: '1Pt0CFzEwJx-AYT0H98OKwoDkmpPw6xvYujc04eo2e7o'
    // WORKING SHEET - '1vYkw_63Ak4tGoBvD1uT_hDxSMEWmgydyPLg2nHr9FPc'
    , range: 'Data'
  }, function sheetReady (err, sheet) {
    if (err) console.log(err)
    //console.log(sheet)
    res.status(200).json(sheet)
  })
})

app.get('/targets', function (req, res) {
  SheetsHelper.service.spreadsheets.values.get({
    spreadsheetId: '1Pt0CFzEwJx-AYT0H98OKwoDkmpPw6xvYujc04eo2e7o'
    // WORKING SHEET - '1vYkw_63Ak4tGoBvD1uT_hDxSMEWmgydyPLg2nHr9FPc'
    , range: 'Targets'
  }, function sheetReady (err, sheet) {
    if (err) console.log(err)
    //console.log(sheet)
    res.status(200).json(sheet)
  })
})

app.listen(port, function () {
  console.log('Listening on port %d', port)
})
