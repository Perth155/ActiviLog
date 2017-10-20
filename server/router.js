const bcrypt = require('bcrypt');
var mongoose = require('mongoose');
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

router.post('/api/edit_post', passport.authenticate('jwt', { session: false }), hasRole([ACCOUNT_TYPE.USER]), function(req, res) {
    const properties = {
        title: response.title,
		description: response.description,
		discipline: response.discipline,
		location: response.location,
		startTime: response.startTime,
		endTime: response.endTime,
		notes: response.notes,
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


router.get('/api/fetch_single_post', passport.authenticate('jwt', { session: false }), hasRole([ACCOUNT_TYPE.USER]), function(req, res) {
    const id = req.headers['postid'];
    posts.findOne({
        '_id': id,
        'organisationId': req.user.organisationId.toString(),
        'active': true,
    }).exec(function(err, response) {
        if (!err) {
            const data = {
				title: response.title,
				description: response.description,
				discipline: response.discipline,
				location: response.location,
				startTime: response.startTime,
				endTime: response.endTime,
				notes: response.notes,
            }
            res.json({ success: true, message: data });
        } else {
            res.json({ success: false, message: err });
        }
    });
});

router.post('/api/delete_post', passport.authenticate('jwt', { session: false }), hasRole([ACCOUNT_TYPE.USER]), function(req, res) {
    const properties = {
        'active': false
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

// Loads the posts for an individual user
router.get('/api/fetch_posts', passport.authenticate('jwt', { session: false }), hasRole([ACCOUNT_TYPE.USER]), function(req, res) {
    const id = req.user._id;
    const org = mongoose.Types.ObjectId(req.user.organisationId);
    const page = req.headers['page'] ? parseInt(req.headers['page']) : 1;
    const pageItems = req.headers['pageitems'] ? parseInt(req.headers['pageitems']) : 0;
    var data = [];
    var aggregate = posts.aggregate([
        {
            $lookup:{
                from: "activities",
                localField: "activity",
                foreignField: "_id",
                as: "activity_info"
            }
        },
        {   $unwind:"$activity_info" },
    
        {$match: { 
            "userId": id,
            "clientId": org,
            "active": true
        }},
        { $sort : { startTime : -1 } }
    ]);

   var options = { page : page, limit : pageItems}
    
   posts.aggregatePaginate(aggregate, options, function(err, results, pageCount, count) {
        if (!err) {
            for(var i=0; i < results.length; i++){
                var val = {
                    id: results[i]._id,
                    title: results[i].title,
                    desc: results[i].description,
                    startTime: results[i].startTime,
                    endTime: results[i].endTime,
                    color: results[i].activity_info.color
                }
                data[i]=val;
            }
            res.json({ success: true, posts: data, total: count, page: page });
        } else {
            res.json({ success: false, message: "Posts could not be loaded" });
        }
   })
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

router.get('/api/fetch_records', passport.authenticate('jwt', { session: false }), hasRole([ACCOUNT_TYPE.ADMINISTRATOR]), function(req, res) {
    const page = req.headers['page'] ? parseInt(req.headers['page']) : 1;
    const pageItems = req.headers['pageitems'] ? parseInt(req.headers['pageitems']) : 0;
    const org = mongoose.Types.ObjectId(req.user.organisationId);

    var aggregate = posts.aggregate([
            {
                $lookup:{
                    from: "activities",  
                    localField: "activity",
                    foreignField: "_id",
                    as: "activity_info"
                }
            },
            {   $unwind:"$activity_info" },
            {
                $lookup:{
                    from: "accounts", 
                    localField: "userId", 
                    foreignField: "_id",
                    as: "user_details"
                }
            },
            {$unwind:"$user_details" },
            {$match: { "active": true, "clientId": org }},
        ]);
    var options = { page : page, limit : pageItems}
     
    posts.aggregatePaginate(aggregate, options, function(err, results, pageCount, count) {
      if(err) {
        res.json({ success: false, message: 'Post Records could not be loaded' });
      }
      else { 
        res.json({ success: true, result: results, total: count, page: page });
      }
    })
});

router.get('/api/search_records', passport.authenticate('jwt', { session: false }), hasRole([ACCOUNT_TYPE.ADMINISTRATOR]), function(req, res) {
    const page = req.headers['page'] ? parseInt(req.headers['page']) : 1;
    const pageItems = req.headers['pageitems'] ? parseInt(req.headers['pageitems']) : 0;
	const search = req.headers['search']
    var aggregate = posts.aggregate([
            {
                $lookup:{
                    from: "activities",  
                    localField: "activity",
                    foreignField: "_id",
                    as: "activity_info"
                }
            },
            {   $unwind:"$activity_info" },
            {
                $lookup:{
                    from: "accounts", 
                    localField: "userId", 
                    foreignField: "_id",
                    as: "user_details"
                }
            },
            {$unwind:"$user_details" },
            {$match: { "active": true, $and: [ 
				{ $or: [{"location": search}, {"fullName": search}, {"email": search}]}] 
			}},
        ]);
    var options = { page : page, limit : pageItems}
     
    posts.aggregatePaginate(aggregate, options, function(err, results, pageCount, count) {
      if(err) {
        res.json({ success: false, message: 'Post Records could not be loaded' });
      }
      else { 
        res.json({ success: true, result: results, total: count, page: page });
      }
    })
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
                userType: response.userType
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


router.post('/api/reset_password', passport.authenticate('jwt', { session: false }), hasRole([ACCOUNT_TYPE.ADMINISTRATOR]), function(req, res) {
    var salt = bcrypt.genSaltSync(10);
    var hashpw = bcrypt.hashSync(req.body.password, salt);
    const properties = {
        password: hashpw,
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



router.post('/api/reset_self_password', passport.authenticate('jwt', { session: false }), hasRole([ACCOUNT_TYPE.USER, ACCOUNT_TYPE.ADMINISTRATOR]), function(req, res) {
    
    // Check if password matches
    console.log(req.body.password);
    console.log(req.body.newpassword);
    req.user.comparePassword(req.body.password, function(err, isMatch) {
        if (!isMatch || err) {
            res.json({ success: false, message: 'Authentication failed. Current password is incorrect.' });
        } else {
            var salt = bcrypt.genSaltSync(10);
            var hashpw = bcrypt.hashSync(req.body.newpassword, salt);
            const properties = {
                password: hashpw,
            }
            account.findOneAndUpdate({
                '_id': req.user.id,
                'organisationId': req.user.organisationId.toString(),
                active: true,
            }, properties).exec(function(err, response) {
                if (!err) {
                    res.json({ success: true, message: "User successfully modified" });
                } else {
                    res.json({ success: false, message: "User password could not be modified at this time." });
                }
            });
        }
    });
});



router.post('/api/reset_usertype', passport.authenticate('jwt', { session: false }), hasRole([ACCOUNT_TYPE.ADMINISTRATOR]), function(req, res) {
    const properties = {
        userType: req.body.userType,
    }
    console.log(req.body.userType);
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
