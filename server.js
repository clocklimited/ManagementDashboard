var express = require('express')
  , port = process.env.PORT || 9001
  , app = express()
  , SheetsHelper = require('./lib/SheetsHelper')
  , spreadsheetId = '1vYkw_63Ak4tGoBvD1uT_hDxSMEWmgydyPLg2nHr9FPc' // Development Sheet
  // , spreadsheetId = '1Pt0CFzEwJx-AYT0H98OKwoDkmpPw6xvYujc04eo2e7o' // Live Sheet
  , session = require('express-session')
  , passportConfig = require('./lib/passportConfig')

app.use(session({
    secret: process.env.SECRET || 'snakes with hats'
  , resave: true
  , saveUninitialized: true
}))
app.set('view engine', 'pug')
app.use(express.static(__dirname))
app.enable('trust proxy')

passportConfig(app)

function isLoggedIn (req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) {
    return next()
  }

  console.log('Redirecting unauthenticated user to login')
  res.redirect('/auth/google')
}

app.get('/', function (req, res) {
  if (req.isAuthenticated()) {
    res.redirect('show')
  } else {
    res.redirect('login')
  }
})

app.get('/login', function (req, res) {
  res.render('login')
})

app.get('/logout', function (req, res) {
  console.log('LOGOUT: email:', req.user.emails[0].value)
  req.logout()
  res.redirect('/')
})

app.get('/fail', function (req, res) {
  res.render('login', { error: true })
})

app.get('/show', isLoggedIn, function (req, res) {
  console.log('GET: /show from IP', req.ip)
  res.render('index')
})

app.get('/data', isLoggedIn, function (req, res) {
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

app.get('/targets', isLoggedIn, function (req, res) {
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
