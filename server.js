var express = require('express')
  , port = process.env.PORT || 9001
  , app = express()
  , SheetsHelper = require('./lib/SheetsHelper')

app.use(express.static(__dirname))

// var authClient = new google.auth.JWT(
//   '916233215878-rgv1hs8lb5d4bmq2gh7mip8eebu170kl@developer.gserviceaccount.com'
//   , __dirname + '/lib/binary/key.pem'
//   , null
//   , ['https://www.googleapis.com/auth/spreadsheets']
// )

app.get('/data', function (req, res) {
  SheetsHelper.service.spreadsheets.values.get({
    spreadsheetId: '1vYkw_63Ak4tGoBvD1uT_hDxSMEWmgydyPLg2nHr9FPc'
    , range: 'Data'
  }, function sheetReady (err, sheet) {
    console.log(err)

    res.status(200).json(sheet)
  })
})

app.listen(port, function () {
  console.log('listening on port %d', port)
})
