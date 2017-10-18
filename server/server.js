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
var JwtStrategy = require('passport-jwt').Strategy;  
var ExtractJwt = require('passport-jwt').ExtractJwt;  
var accounts = require('./models/accounts');

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
app.use(passport.initialize());

app.use(passport.session());
app.use(express.static(path.join(__dirname, '../client')));
app.use(function (err, req, res, next) { res.status(err.status || 500); });
app.use('/', routes);
app.use(function noCache(req, res, next) {
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);
    next();
});

// CONFIGURE PASSPORT //
var account = require('./models/accounts');

// Load JWT
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
opts.secretOrKey = 'secretkey4356567';
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    accounts.findOne({_id: jwt_payload._id}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user._id)
})
passport.deserializeUser(function(id, done) {
    account.findOne({ _id: id }, function (err, user) {
        done(err, user)
    })
})

module.exports = app;
