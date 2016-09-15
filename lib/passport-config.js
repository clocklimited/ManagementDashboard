const passport = require('passport')
    , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
    , oauth = require('./binary/oauth.json')

module.exports = function (app) {
  passport.use(new GoogleStrategy({
      clientID: oauth.web['client_id']
    , clientSecret: oauth.web['client_secret']
    , callbackURL: oauth.web['redirect_uris'][0]
    , passReqToCallback: true
    }
    , function (req, token, refreshToken, profile, done) {
      process.nextTick(function () {
        var email = profile.emails[0].value
          , inDomain = email.match(/.+?@clock\.co\.uk$/)

        if (!inDomain) {
          console.warn('Login attempt from "%s", denied access.', email)
          done(null, false)
        } else {
          done(null, profile)
        }
      })
  }))

  passport.serializeUser(function (user, cb) {
    cb(null, user)
  })

  passport.deserializeUser(function (obj, cb) {
    cb(null, obj)
  })

  app.use(passport.initialize())
  app.use(passport.session())

  // Passport routes
  app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

  app.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/show'
      , failureRedirect: '/fail'
    })
  )
}
