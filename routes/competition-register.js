const express = require('express');
let router = express.Router();

router.use(function (req, res, next) {
  next();
});

router.route('/').get((req, res) => {
  res.render('competition-register');
});

module.exports = router;