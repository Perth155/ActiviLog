var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var semesterSchema = new Schema
({
    user: {
      type: String,
      unique: true,
      require: true
    },
    startDate: {Date},
    endDate: {Date}
  });

module.exports = mongoose.model('Semester',  semesterSchema);
