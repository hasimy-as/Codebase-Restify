const passport = require('passport');
const { BasicStrategy } = require('passport-http');
const User = require('./authentication');

passport.use(
  new BasicStrategy((username, password, cb) => {
    User.findByUsername(username, (user) => {
      if (!user) {
        return cb(null, false);
      }
      if (!user.isValidPassword(password)) {
        return cb(null, false);
      }
      return cb(null, user);
    });
  }),
);

const isAuthenticated = passport.authenticate('basic', { session: false });
const init = () => passport.initialize();

module.exports = {
  isAuthenticated,
  init,
};
