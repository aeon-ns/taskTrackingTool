var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');

var Tasks = require('../models/task');

var router = express.Router();
router.use(bodyParser.json());

router.route('/')
    .get(Verify.verifyUser, function (req, res, next) {
        req.query.forUser = req.decoded._id;
        Tasks.find(req.query, function (err, tasks) {
            if (err) return next(err);
            res.json(tasks);
        });
    })
    .post(Verify.verifyUser, function (req, res, next) {
        req.body.forUser = req.decoded._id;
        Tasks.create(req.body, function (err, task) {
            if (err) return next(err);
            res.json({ status: true });
        });
    });

router.route('/public')
    .get(Verify.verifyUser, function(req, res, next) {
        if(!req.body.query) req.body.query = {};
        req.query.private = false;
        Tasks.find(req.query, function(err, tasks) {
            if(err) return next(err);
            res.json(tasks);
        });
    });

module.exports = router;

