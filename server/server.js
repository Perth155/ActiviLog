// LOAD PACKAGES //
var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');

// IMPORT ROUTER //
var routes = require('./router');

// LOAD MONGOOSE DATABASE //
mongoose.connect('mongodb://user_01:dbpass123@ds121171.mlab.com:21171/clinical_placements', { useMongoClient: true });

// PREPARE EXPRESS APP //
app.set('view engine', 'html');
app.engine('html', function (path, options, callbacks) { fs.readFile(path, 'utf-8', callback); });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'securesessionsecret', cookie: { secure: true }, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, '../client')));
app.use(function (err, req, res, next) { res.status(err.status || 500); });
app.use('/', routes);

// CONFIGURE PASSPORT //
var account = require('./models/accounts');
passport.use(new LocalStrategy(account.authenticate()));
passport.serializeUser(function(user, done) {
    done(null, user.id)
})
passport.deserializeUser(function(id, done) {
    account.findOne({ _id: id }, function (err, user) {
        done(err, user)
    })
})

module.exports = app;
