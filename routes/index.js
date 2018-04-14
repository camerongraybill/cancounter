const express = require('express');
const router = new express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.user);
  res.render("index.html");
});

module.exports = router;
