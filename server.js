var express = require('express')
  , port = process.env.PORT || 9001
  , app = express()
  , SheetsHelper = require('./lib/sheets-helper')
  , spreadsheetId = '1vYkw_63Ak4tGoBvD1uT_hDxSMEWmgydyPLg2nHr9FPc' // Development Sheet
  // , spreadsheetId = '1Pt0CFzEwJx-AYT0H98OKwoDkmpPw6xvYujc04eo2e7o' // Live Sheet
  , session = require('express-session')
  , passportConfig = require('./lib/passport-config')
  , NodeCache = require('node-cache')
  , cache = new NodeCache({ stdTTL: (12 * 60 * 60) })

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
  cache.get('data', function (err, data) {
    if (err) return console.log(err)
    if (data) {
      // Use cached data
      res.status(200).json(data)
      console.log('GET: /data from IP %s sent cached `data` sheet', req.ip)
    } else {
      // Cached data expired/missing, get new
      SheetsHelper.service.spreadsheets.values.get({
        spreadsheetId
        , range: 'Data'
      }, function sheetReady (err, sheet) {
        if (err) console.log(err)
        res.status(200).json(sheet)
        console.log('GET: /data from IP %s sent `data` sheet', req.ip)
        cache.set('data', sheet, function (err, result) {
          if (err || !result) return console.log('Failed to cache `data`, err:', err)
          else console.log('Cached `data`')
        })
      })
    }
  })
})

app.get('/targets', isLoggedIn, function (req, res) {
  console.log('GET: /targets from IP', req.ip)
  cache.get('targets', function (err, data) {
    if (err) return console.log(err)
    if (data) {
      // Use cached data
      res.status(200).json(data)
      console.log('GET: /targets from IP %s sent cached `targets` sheet', req.ip)
    } else {
      SheetsHelper.service.spreadsheets.values.get({
        spreadsheetId
        , range: 'Targets'
      }, function sheetReady (err, sheet) {
        if (err) console.log(err)
        res.status(200).json(sheet)
        console.log('GET: /targets from IP %s sent `targets` sheet', req.ip)
        cache.set('targets', sheet, function (err, result) {
          if (err || !result) return console.log('Failed to cache `targets`, err:', err)
          else console.log('Cached `targets`')
        })
      })
    }
  })
})

app.get('/refresh', isLoggedIn, function (req, res) {
  cache.del([ 'data', 'targets' ], function (err) {
    if (err) return console.log(err)
    else {
      console.log('GET: /refresh from IP %s deleted cached sheets', req.ip)
      res.redirect('/show')
    }
  })
})

app.listen(port, function () {
  console.log('Listening on port %d', port)
})
