var express = require('express');
var router = express.Router();
const name = 'eric';
const passwd = '123';
/* GET users listing. */
router.post('/', function(req, res, next) {
    const username = req.body.username;
    const password = req.body.password;
    if (username === name && password === passwd) {
        req.session.username = username;
        req.session.password = password;
        res.send('login success');
    } else {
        res.send('login failed');
    }
});

module.exports = router;
