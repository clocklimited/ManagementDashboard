var google = require('googleapis')
  , KEY_FILE = exists(process.env.KEY_FILE)
  , key = require(KEY_FILE)

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

function exists (file) {
  if (!file) {
    throw new Error('Missing KEY_FILE')
  } else {
    return file
  }
}

module.exports = new SheetsHelper()

