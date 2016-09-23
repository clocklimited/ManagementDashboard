require('dotenv').load()
var express = require('express')
  , port = process.env.PORT || 9001
  , app = express()
  , session = require('express-session')
  , passportConfig = require('./lib/passport-config')
  , cache = require('./lib/cache-helper')
  , auth = require('./lib/auth-middleware')

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

app.get('/', function (req, res) {
  if (req.isAuthenticated()) {
    res.redirect('show')
  } else {
    res.redirect('login')
  }
})

app.get('/login', function (req, res) {
  log(req)
  res.render('login')
})

app.get('/logout', function (req, res) {
  log(req)
  req.logout()
  res.redirect('/')
})

app.get('/fail', function (req, res) {
  log(req)
  res.render('login', { error: true })
})

app.get('/show', auth, function (req, res) {
  log(req)
  res.render('index')
})

app.get('/data', auth, function (req, res) {
  log(req)
  cache.get('Data', req, res)
})

app.get('/targets', auth, function (req, res) {
  log(req)
  cache.get('Targets', req, res)
})

app.get('/refresh', auth, function (req, res) {
  log(req)
  cache.clear(req, res)
})

function log (req) {
  console.log('Req for `%s` from IP `%s`', req.path, req.ip)
  console.log('User: %s', (req.user ? req.user.emails[0].value : 'N/A'))
}

app.listen(port, function () {
  console.log('Listening on port %d', port)
})
