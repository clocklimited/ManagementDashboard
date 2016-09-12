var google = require('googleapis')
  , key = require('./binary/keyfile.json')

function SheetsHelper () {
  var auth = new google.auth.JWT(
    key.client_email
    , null
    , key.private_key
    , [
        'https://www.googleapis.com/auth/spreadsheets'
    ]
  )
  this.service = google.sheets({version: 'v4', auth: auth})
}


module.exports = new SheetsHelper()

