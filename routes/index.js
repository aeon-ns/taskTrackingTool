var express = require('express');
var router = express.Router();
var config = require('../config');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.sendFile(config.DIR + '/public/index.html');
});

module.exports = router;
