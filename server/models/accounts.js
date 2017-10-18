const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const passportLocalValidator = require('passport-local-mongoose');
const bcrypt = require('bcrypt');
const mongoosePaginate = require('mongoose-paginate');

var Schema = mongoose.Schema;

var enumUserType = {
    values: [0, 1, 2, 3, 4],
    message: '{VALUE} is not a valid ActiviLog user type.'
};

var accountSchema = new Schema
({
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

    organisationId:{
      type:String,
      require: true
    },

    userType:{type:Number, require:true, enum:enumUserType},

    active:{type:Boolean, require:true},

    resetPasswordToken: String,
    
    resetPasswordExpires: Date
},{
  timestamps: true,
});


// generating a hash
accountSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash){
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});

accountSchema.plugin(mongoosePaginate);

// checking if password is valid
accountSchema.methods.comparePassword = function(pw, cb) {
  bcrypt.compare(pw, this.password, function(err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('Accounts', accountSchema);
