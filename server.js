require('dotenv').load()
var express = require('express')
  , port = process.env.PORT || 9001
  , app = express()
  , session = require('express-session')
  , passportConfig = require('./lib/passport-config')
  , cache = require('./lib/cache-helper')

app.use(session({
    secret: process.env.SECRET || 'snakes with hats'
  , resave: true
  , saveUninitialized: true
}))
app.set('view engine', 'pug')
app.use('/src', express.static(__dirname + '/src'))
app.use('/css', express.static(__dirname + '/css'))
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
  console.log('GET: show from IP', req.ip)
  res.render('index')
})

app.get('/data', isLoggedIn, function (req, res) {
  console.log('GET: data from IP', req.ip)
  cache.get('Data', req, res)
})

app.get('/targets', isLoggedIn, function (req, res) {
  console.log('GET: targets from IP', req.ip)
  cache.get('Targets', req, res)
})

app.get('/refresh', isLoggedIn, function (req, res) {
  cache.clear(req, res)
})

app.listen(port, function () {
  console.log('Listening on port %d', port)
})
