var express = require('express');
var router = express.Router();

// 请求信息头
router.get('/', function(req, res, next) {
  res.setHeader('X-XSRF-TOKEN', req.csrfToken());
  res.json({
    message: 'hello csrf'
  });
});
router.get('/:id', function(req, res, next) {
  res.json({
    message: req.params.id
  });
});
router.post('/', function(req, res, next) {
  res.json({
    message: 'hello post'
  });
});

module.exports = router;
