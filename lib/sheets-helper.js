var google = require('googleapis')

function SheetsHelper () {
  var auth = new google.auth.JWT(
      process.env.CLIENT_EMAIL
    , null
    , process.env.PRIVATE_KEY
    , [
        'https://www.googleapis.com/auth/spreadsheets'
    ]
  )
  this.service = google.sheets({version: 'v4', auth: auth})
}

module.exports = new SheetsHelper()
