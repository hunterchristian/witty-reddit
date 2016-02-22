var express = require('express');
var router = express.Router();
var wittyCalc = require('../scripts/wittyCalc.js');

/* GET home page. */
router.get('/wittyComments', function(req, res, next) {
  wittyCalc.getAskRedditWittyComments(function(wittyComments) {
    res.status(200).json(wittyComments);
  });
});

module.exports = router;
