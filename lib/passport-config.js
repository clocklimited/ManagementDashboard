const passport = require('passport')
    , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

module.exports = function (app) {
  passport.use(new GoogleStrategy({
      clientID: process.env.CLIENT_ID
    , clientSecret: process.env.CLIENT_SECRET
    , callbackURL: process.env.REDIRECT_URI
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
