var google = require('googleapis')

function SheetsHelper () {
  var auth = new google.auth.JWT(
    '950884610797-adasoiteini2hoj5o4dfcekvsnosm46j@developer.gserviceaccount.com'
    , __dirname + '/binary/key.pem'
    , null
    , ['https://www.googleapis.com/auth/spreadsheets']
  )
  this.service = google.sheets({version: 'v4', auth: auth})
}

module.exports = new SheetsHelper()

