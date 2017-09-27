const mongoose = require('mongoose');
const readline = require('readline');

const config = require('./config.json');

const dbURI = "mongodb://"+config["un"]+":"+config["pw"]+"@ds121171.mlab.com:21171/clinical_placements";
mongoose.connect(dbURI);

mongoose.connection.on('connected', function() {
  console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function(err) {
  console.log('Mongoose connection error: ' + err);
})
mongoose.connection.on('disconneted', function() {
  console.log('Mongoose disconneted');
});

var gracefulShutdown = function(msg, callback) {
  mongoose.connection.close(function() {
    console.log('Mongoose disconnected through ' + msg);
    callback();
  });
};

process.once('SIGUSR2', function() {
    gracefulShutdown('nodemon restart', function() {
        process.kill(process.pid, 'SIGUSR2');
    });
});

process.on('SIGINT', function() {
    gracefulShutdown('app termination', function() {
        process.exit(0);
    });
});

process.on('SIGTERM', function() {
    gracefulShutdown('Heroku app shutdown', function() {
        process.exit(0);
    });
});

// Windows SIGINT support
if(process.platform === 'win32')
{
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.on('SIGINT', function() {
    process.emit('SIGINT');
  });
}

require('./account_model.js');
require('./client_model.js');
require('./posts_model.js');
require('./semester_model.js');
