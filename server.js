'use strict'
require('dotenv').config();
const   session       =   require('koa-session'),
        Koa = require('koa'),
        favicon = require('koa-favicon'),
        { userAgent } = require('koa-useragent'),
        xml           = require('koa-xml-body-v2'),
        bodyParser    =   require('koa-parser'),
        helmet        =   require('koa-helmet'),
        winston       =   require('winston'),
        logger        =   require('koa-pino-logger'),
        flash         =   require('koa-better-flash'),
        config        =   require('./config/config.json'),
        koaviews      =   require('koa-ejs'),
        Port          =   process.env.PORT || 4111,
        app           =   new Koa(),
        router        =   require('./routes'),
        serve         =   require('koa-static'),
        _             =   require('lodash'),
        render        =   require('koa-ejs'),
        path          =   require('path'),
        db            =   require('./models')
//import cron service here
require('./services/cron.service')();
app.context.trade = db.trade;
app.context.ydDb = db.ydDb;
app.keys = [config.development.secret];
app.use(helmet())
app.use(session({
    httpOnly: true,
    signed: true
}, app));
app.use(xml());
app.use(bodyParser());
app.use(userAgent);
app.use(logger());
app.use(serve(__dirname + '/public'))
//app.use(favicon(__dirname + '/public/games/images/favicon.ico'));
render(app, {
    root: path.join(__dirname, 'view'),
    layout: 'layout',
    viewExt: 'html',
    cache: false,
    debug: false
})
app.use(flash())
app.use(router.routes())

app.listen(Port);
console.log(`Server running on ${Port}, visit http://localhost:${Port} to access the application`)