var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var semesterSchema = new Schema
({
    _id:{Number},
    user: {
      type: String,
      unique: true,
      require: true
    },
    startDate: {Date},
    endDate: {Date}
  });

module.exports = mongoose.model('Semesters',  semesterSchema);
