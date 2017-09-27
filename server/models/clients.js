const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var enumSubType = {
    values: ["PlusPlus", "Plus", "Free"],
    message: '{VALUE} is not a valid ActiviLog subscription type'
};

var clientSchema = new Schema
({
    client_name: {type: String, unique:true, require:true},

    client_desc: {type: String, require:false},

    client_admin_email: {type: String, require: true},

    client_subdomain: {type: String},

    subscription_start_date: {type: Date, require:true},

    subscription_type: {
      type: String,
      enum: enumSubType,
      required: true
    },


});

module.exports = mongoose.model('Client', clientSchema);
