var User = require('../models/user');
var jwt = require('jsonwebtoken');

var config = require('../config');

exports.getToken = function (user) {
    return jwt.sign(user, config.SECRET_KEY, { expiresIn: 3600 });
};

exports.verifyUser = function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, config.SECRET_KEY, function (err, decoded) {
            if (err) {
                var err = new Error('You are not authenticated!');
                err.status = 401;
                return next(err);
            }
            else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        var err = new Error('No token provided!');
        err.status = 403;
        return next(err);
    }
};
