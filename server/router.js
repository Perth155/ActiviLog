var path = require('path');
var express = require('express');
var passport = require('passport');
var account = require('./models/accounts');
var client = require('./models/clients');
var posts = require('./models/posts');
var activities = require('./models/activities');
var semester = require('./models/semesters');
var jwt = require('jsonwebtoken');

var router = express.Router();

const ACCOUNT_TYPE = {
    UNREGISTERED: 0,
    ADMINISTRATOR: 1,
    SUPERVISOR: 2,
    USER: 3,
};

// Check user Level
function hasRole(role) {
    return function (req, res, next) {
        if (role.indexOf(req.user.userType) !== -1) {
            next();
        } else {
            res.status(403).json({ success: false, message: "You are not authorized to make this request" })
        }
    }
}

function visitor() {
    return function (req, res, next) {
        if (req.user == null) {
            next();
        } else {
            res.status(403).json({ success: false, message: "You are not authorized to make this request" });
        }
    }
}

// Validate Characters for strange inputs
function validateCharacters(val) {
    if (/^[a-zA-Z()]+$/.test(val) && val != "") {
        return true;
    } else {
        return false;
    }
}

function validatePassword(val) {
    if (/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/.test(val) && val != "") {
        return true;
    } else {
        return false;
    }
}

// Return Server Status
router.get('/api/status', function(req, res){
    res.status(200).send("Server Running!");
});

// Check if Organization Exists
router.get('/api/check_organization', function(req, res){
    var org = req.headers['organization'];
    if (!validateCharacters(org)) {
        res.status(400).json({ valid: false, msg: "Please enter a valid organization name" });
        return;
    }
    client.findOne({ 'clientSubdomain': org }).exec(function(err, response) {
        if (response != null) {
            res.status(200).json({ valid: true});
        } else {
            res.status(200).json({ valid: false, msg: "Please enter a valid organization name" });
        }
    });
});

router.post('/api/login', visitor(), function(req, res) {
    client.findOne({ 'clientSubdomain': req.body.organization}).exec().then(function(organization) {
        if (organization != null) {
            const orgId = organization._id.toString();
            account.findOne({
                email: req.body.email,
                organisationId: orgId,
                active: true,
            }, function(err, user) {
            if (err) throw err;

            if (!user) {
                res.json({ success: false, message: 'Authentication failed. User not found.' });
            } else {
                // Check if password matches
                user.comparePassword(req.body.password, function(err, isMatch) {
                if (isMatch && !err) {
                    // Create token if the password matched and no error was thrown
                    var token = jwt.sign(user.toObject(), 'secretkey4356567', {
                        expiresIn: 100000 // in seconds
                    });
                    res.json({ success: true, token: 'JWT ' + token });
                } else {
                    res.json({ success: false, message: 'Authentication failed. Passwords did not match.' });
                }
                });
            }
            });
        } else {
            res.json({ success: false, message: 'Authentication failed. Organization Could not be found' });
        }
    });
});

router.get('/api/fetch_user', passport.authenticate('jwt', { session: false }), hasRole([ACCOUNT_TYPE.USER, ACCOUNT_TYPE.ADMINISTRATOR]), function(req, res) {
    const userData = {
        id: req.user._id,
        fullName: req.user.fullName,
        email: req.user.email,
        organizationId: req.user.organisationId.toString(),
        userType: req.user.userType,
    }
    res.json({ success: true, user: userData });
});

router.post('/api/register', visitor(), function(req, res) {
    client.findOne({ 'clientSubdomain': req.body.organization}).exec().then(function(organization) {
        if (organization != null) {
            const orgId = organization._id.toString();
            var userData = {
                fullName: req.body.fullName,
                email: req.body.email,
                password: req.body.password,
                organisationId: orgId,
                userType: 3,
                active: true,
              }
            if (!validatePassword(req.body.password)) {
                res.json({ success: false, message: 'Password does not meet the validation requirements' });
            } else {
                account.create(userData, function (err, user) {
                if (err) {
                    if (err.code == 11000) {
                        res.json({ success: false, code: 11000, message: 'An account with this email already exists' });
                    } else {
                    res.json({ success: false, message: 'User could not be created ' + err });
                    }
                } else {
                    res.json({ success: true, message: 'User account successfully created' });
                }});
            }
        } else {
            res.json({ success: false, message: 'Registration failed. Organization could not be found' });
        }
    });
});

router.post('/api/publish_post', passport.authenticate('jwt', { session: false }), hasRole([ACCOUNT_TYPE.USER]), function(req, res) {
    const properties = {
        title: req.body.title,
        description: req.body.description,
        activity: req.body.activity,
        discipline: req.body.discipline,
        location: req.body.location,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        notes: req.body.notes,
        userId: req.user._id.toString(),
        clientId: req.user.organisationId.toString(),
        active: true,
    }
    posts.create(properties, function (err, response) {
        if (err) {
            res.json({ success: false, message: 'Post could not be created' });
        } else {
            res.json({ success: true, message: 'Post successfully created' });
        }
    });
});

router.get('/api/fetch_posts', passport.authenticate('jwt', { session: false }), hasRole([ACCOUNT_TYPE.USER]), function(req, res) {
    const id = req.headers['userID'];
	var data = [];
    posts.find({
        $and:[{'userID': id},
			{'active': true}]
    }).exec(function(err, response) {
        if (!err) {
			for(var i=0; i < response.length; i++){
				var val = {
					title: response[i].title,
					desc: response[i].description,
					startTime: response[i].startTime,
					endTime: response[i].endTime,
				}
				data[i]=val;
			}

            res.json({ success: true, posts: data });
        } else {
            res.json({ success: false, message: "Posts could not be loaded" });
        }
    });
});

router.post('/api/create_account', passport.authenticate('jwt', { session: false }), hasRole([ACCOUNT_TYPE.ADMINISTRATOR]), function(req, res) {
            var userData = {
              fullName: req.body.fullName,
              email: req.body.email,
              password: req.body.password,
              organisationId: req.user.organisationId,
              userType: 3,
              active: true,
            }


            if (!validatePassword(req.body.password)) {
                res.json({ success: false, message: 'Password does not meet the validation requirements' });
            } else {
                account.create(userData, function (err, user) {
                if (err) {
                    console.log(err)
                    if (err.code == 11000) {
                        res.json({ success: false, code: 11000, message: 'An account with this email already exists' });
                    } else {
                    res.json({ success: false, message: 'User could not be created ' + err });
                    }
                } else {
                    res.json({ success: true, message: 'User account successfully created' });
                }});
            }
  });


router.post('/api/add_activity', passport.authenticate('jwt', { session: false }), hasRole([ACCOUNT_TYPE.ADMINISTRATOR]), function(req, res) {
    const properties = {
        title: req.body.title,
        description: req.body.description,
        color: req.body.color,
        organisationId: req.user.organisationId.toString(),
        active: true,
    }
    activities.create(properties, function (err, response) {
        if (err) {
            res.json({ success: false, message: 'Activity could not be created' });
        } else {
            res.json({ success: true, message: 'Activity successfully created' });
        }
    });
});

router.get('/api/fetch_activities', passport.authenticate('jwt', { session: false }), hasRole([ACCOUNT_TYPE.USER, ACCOUNT_TYPE.ADMINISTRATOR]), function(req, res) {
    const page = req.headers['page'] ? parseInt(req.headers['page']) : 1;
    const pageItems = req.headers['pageitems'] ? parseInt(req.headers['pageitems']) : 0;
    activities.paginate({
        organisationId: req.user.organisationId.toString(),
        active: true,
    }, { page: page, limit: pageItems, sort: { _id: 'desc'}}, function(err, result) {
        if (err) {
            res.json({ success: false, message: 'Activities could not be loaded' });
        } else {
            res.json({ success: true, result: result.docs, total: result.total, page: result.page, limit: result.limit });
        }
    });
});


router.get('/api/fetch_users', passport.authenticate('jwt', { session: false }), hasRole([ACCOUNT_TYPE.ADMINISTRATOR]), function(req, res) {
    const page = req.headers['page'] ? parseInt(req.headers['page']) : 1;
    const pageItems = req.headers['pageitems'] ? parseInt(req.headers['pageitems']) : 0;
    account.paginate({
        organisationId: req.user.organisationId.toString(),
        active: true,
    }, { page: page, limit: pageItems, sort: { _id: 'desc'}}, function(err, result) {
        if (err) {
            res.json({ success: false, message: 'Users could not be loaded' });
        } else {
            res.json({ success: true, result: result.docs, total: result.total, page: result.page, limit: result.limit });
        }
    });
});


router.get('/api/fetch_activity', passport.authenticate('jwt', { session: false }), hasRole([ACCOUNT_TYPE.ADMINISTRATOR]), function(req, res) {
    const id = req.headers['activityid'];
    activities.findOne({
        '_id': id,
        'organisationId': req.user.organisationId.toString(),
        active: true,
    }).exec(function(err, response) {
        if (!err) {
            const data = {
                id: response._id,
                title: response.title,
                description: response.description,
                color: response.color
            }
            res.json({ success: true, message: data });
        } else {
            res.json({ success: false, message: "Activity could not be loaded" });
        }
    });
});



router.get('/api/fetch_single_user', passport.authenticate('jwt', { session: false }), hasRole([ACCOUNT_TYPE.ADMINISTRATOR]), function(req, res) {
    const id = req.headers['userid'];
    account.findOne({
        '_id': id,
        'organisationId': req.user.organisationId.toString(),
        active: true,
    }).exec(function(err, response) {
        if (!err) {
            const data = {
                id: response._id,
                fullName: response.fullName,
                email: response.email,
            }
            res.json({ success: true, message: data });
        } else {
            res.json({ success: false, message: err });
        }
    });
});


router.post('/api/delete_activity', passport.authenticate('jwt', { session: false }), hasRole([ACCOUNT_TYPE.ADMINISTRATOR]), function(req, res) {
    const properties = {
        active: false
    }
    activities.findOneAndUpdate({
        '_id': req.body.id,
        'organisationId': req.user.organisationId.toString(),
        active: true,
    }, properties).exec(function(err, response) {
        if (!err) {
            res.json({ success: true, message: "Activity successfully deleted" });
        } else {
            res.json({ success: false, message: "Activity could not be deleted" });
        }
    });
});

router.post('/api/edit_activity', passport.authenticate('jwt', { session: false }), hasRole([ACCOUNT_TYPE.ADMINISTRATOR]), function(req, res) {
    const properties = {
        title: req.body.title,
        description: req.body.description,
        color: req.body.color,
    }
    activities.findOneAndUpdate({
        '_id': req.body.id,
        'organisationId': req.user.organisationId.toString(),
        active: true,
    }, properties).exec(function(err, response) {
        if (!err) {
            res.json({ success: true, message: "Activity successfully modified" });
        } else {
            res.json({ success: false, message: "Activity could not be modified" });
        }
    });
});



router.post('/api/edit_user', passport.authenticate('jwt', { session: false }), hasRole([ACCOUNT_TYPE.ADMINISTRATOR]), function(req, res) {
    const properties = {
        fullName: req.body.fullName,
        email: req.body.email,
    }
    account.findOneAndUpdate({
        '_id': req.body.id,
        'organisationId': req.user.organisationId.toString(),
        active: true,
    }, properties).exec(function(err, response) {
        if (!err) {
            res.json({ success: true, message: "User successfully modified" });
        } else {
            res.json({ success: false, message: "User could not be modified at this time. :/" });
        }
    });
});




router.post('/api/delete_user', passport.authenticate('jwt', { session: false }), hasRole([ACCOUNT_TYPE.ADMINISTRATOR]), function(req, res) {
    const properties = {
        active: false
    }
    account.findOneAndUpdate({
        '_id': req.body.id,
        'organisationId': req.user.organisationId.toString(),
        active: true,
    }, properties).exec(function(err, response) {
        if (!err) {
            res.json({ success: true, message: "User successfully deleted" });
        } else {
            res.json({ success: false, message: "User could not be deleted" });
        }
    });
});




router.get('/api/logout', function(req, res) {
    req.logout();
    res.status(200).send("Logged Out!");
});

router.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

module.exports = router;
