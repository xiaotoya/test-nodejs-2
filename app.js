const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const csrf = require('csurf');
const fs = require('fs');
const path = require('path');
// const session = require('client-sessions');
const session = require('express-session');
const checkRole = require('./middleware/check-role');
const csrfProtection = csrf({cookie: { 
        secure: false, 
        httpOnly: true,
    }
});
const helmet = require('helmet');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
require('dotenv').config();
console.log(process.env);
const app = express();
// 防御性header
app.use(helmet());
// 解析cookie
app.use(cookieParser());
// 解析body 表单类型和json类型
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// 用于存储客户端的状态
// app.use(session({
//     cookieName: 'session',  
//     secret: 'random_string_goes_here', //一个随机字符串，因为客户端的数据都是不安全的，所以需要进行加密
//     duration: 30*60*1000, //session的过期时间，过期了就必须重新设置
//     activeDuration: 5* 60*1000, // 激活时间，比如设置为30分钟，那么只要30分钟内用户有服务器的交互，那么就会被重新激活。
// }));
app.use(session({
    name: 'sid', // client端的cookie的key
    secret: process.env.secret,// 用于加密的签名
    saveUninitialized: false,// 不用每一个请求都新建session
    resave: true,//每次请求后刷新session时间
    cookie: {
        httpOnly: true,//浏览器端不可访问
        secure: false, // 是否只适用于https协议
        maxAge: 1000 * 60, // 存活1min
    }
}))
app.use(logger(':method :url :status :res[content-length] - :response-time ms'));
app.use((req, res, next) => {
    if (req.url !== '/login' && req.url !== '/') {
        if (req.session.username) {
            next();
        } else {
            res.send('please login first');
        }
    } else {
        next();
    }
})
app.use(csrfProtection, (req, res, next) => {
    // res.cookie('XSRF-TOKEN', req.csrfToken(), {httpOnly: true});
    res.setHeader('X-XSRF-TOKEN', req.csrfToken());
    next();
});
app.use((req, res, next) => {
    const {url, ip} = req;
    fs.appendFileSync(path.resolve(__dirname, './router.log'), `${url}:=>${ip}`);
    next();
});
// 防盗链
app.use('/images', (req, res, next) => {
    const whiteList = ['localhost'];
    if (whiteList.includes(req.hostname)) {
        next();
    } else {
        res.status(404).send('404 not found!');
    }
});
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/login', loginRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);
module.exports = app;
