const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const passportLocalValidator = require('passport-local-mongoose');
const bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;

var enumUserType = {
    values: ["user", "supervisor", "admin"],
    message: '{VALUE} is not a valid ActiviLog user type.'
};

var accountSchema = new Schema
({
	
    _id:{Number},

    username: {
      type: String,
      unique:true,
      require:true
    },

    email: {
      type: String,
      require:true,
      unique:true,
      validate: {
        validator: function(v){
            return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
        },
        message: '{VALUE} is not a valid email address.'
      }
    },

    fullName: {
      type: String,
      require:true
    },

    password:{
      type:String,
      require:true
    },


    organisationID:{
      type:Number,
      require: true
    },

    userType:{type:String, require:true, enum:enumUserType},

    dateJoined:{
      type:Date,
      require: true
    }
});

accountSchema.plugin(passportLocalValidator);
accountSchema.plugin(uniqueValidator);

// generating a hash
accountSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
accountSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};


module.exports = mongoose.model('Accounts', accountSchema);
