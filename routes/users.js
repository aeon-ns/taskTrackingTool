var express = require('express');
var passport = require('passport');
var router = express.Router();
var User = require('../models/user');
var Verify = require('./verify');

router.post('/register', function (req, res, next) {
  User.register(new User({
    username: req.body.username
  }), req.body.password, function (err, user) {
    if (err) {
      console.log(err.message);
      console.log(err);
      if (err.name == 'UserExistsError') return res.status(409).json({ msg: err.message });
      return res.status(500).json({ msg: err.message });
    }
    user.save(function (err, user) {
      if (err) return next(err);
      passport.authenticate('local')(req, res, function () {
        return res.status(200).json({ status: 'Registration Successful!' });
      });
    });
  })
});

router.post('/signin', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ err: info });
    }
    req.logIn(user, function (err) {
      if (err) {
        return res.status(500).json({ err: 'Could not log in user' });
      }
      var token = Verify.getToken({ "username": user.username, "_id": user._id });
      res.status(200).json({
        status: 'Login Successful!',
        success: true,
        token: token
      });
    });
  })(req, res, next);
});

router.route('/signout')
  .get(Verify.verifyUser, function (req, res, next) {
    req.logOut();
  });

module.exports = router;