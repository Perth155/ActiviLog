const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var postSchema = new Schema
({
    posterID: {
      type: Number,
      require:true
    },

    title: {
      type: String,
      require:true
    },

    loc:{type:String, require:true},

    startTime:{type:Date, require:true},

    endTime:{type:Date, require:true},

    timePosted:{
      type:Date,
      require: true
    }
});

module.exports = mongoose.model('Posts', postSchema);
