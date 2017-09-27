const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var enumColor = {
  values: ['red', 'blue', 'green', 'magenta', 'yellow', 'black', 'cyan'],
  message: '{VALUE} is not a selectable color.'
}

var activitySchema = new Schema
({

    _id: {type: Number},

    organisationID: {
      type: Number,
      require:true
    },

    title: {
      type: String,
      require:true
    },

    postDesc:{type:String},

    decorColor:{type:String, enum:enumColor}
});

activitySchema.plugin(uniqueValidator);
module.exports = mongoose.model('Activities', activitySchema);
