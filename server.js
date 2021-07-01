const express = require('express'),
    session = require('express-session'),
    app = express(),
    http = require('http').Server(app),
    path = require('path'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    passport = require('passport'),
    flash = require('connect-flash'),
    connection = require('./dbInit');

app.set('view engine', 'ejs')
    .use(cookieParser())
    .use(bodyParser.urlencoded({
        extended: true
    }))
    .use(session({
        secret: 'justasecret',
        resave: true,
        saveUninitialized: true
    }))
    .use('/src', express.static('src'))
    .use('/config', express.static('config'))
    .use('/assets', express.static('assets'))
    .use(passport.initialize())
    .use(passport.session())
    .use(flash())
    .use(express.static('src'));

require('./passport')(passport, connection);
require('./route')(app, passport, connection);

const port = process.env.PORT || 3000;
http.listen(port, () => {
    console.log("listening on port " + port);
});
