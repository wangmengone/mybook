var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// http://127.0.0.1:3000/users/demo
router.get('/demo', function(req, res, next) {
  res.send('respond with a resource demo');
});

// http://127.0.0.1:3000/users/112123
router.get('/:id', function(req, res, next) {
  res.send('respond with a ' + req.params.id);
});

//  post get put delete
//  C    R   u   d     restful API 接口规范。

module.exports = router;
