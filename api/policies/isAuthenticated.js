/**
 * isAuthenticated
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {
  if (req.session.authenticated) {
    return next();
  } else {

    var needsLogin = ['You must be logged in to view that page'];
        req.session.flash = {
          err: needsLogin
        }
        res.redirect('/session/new');
        return;
  }
};
