const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var enumSubType = {
    values: ["PlusPlus", "Plus", "Free"],
    message: '{VALUE} is not a valid ActiviLog subscription type'
};

var clientSchema = new Schema
({
    _id: {type:Number},

    clientName: {type: String, unique:true, require:true},

    clientDesc: {type: String, require:false},

    clientAdminEmail: {type: String, require: true},

    clientSubDomain: {type: String},

    subscriptionStartDate: {type: Date, require:true},

    subscriptionType: {
      type: String,
      enum: enumSubType,
      required: true
    },


});

module.exports = mongoose.model('Clients', clientSchema);
