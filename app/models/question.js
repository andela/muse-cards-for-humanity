const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const QuestionSchema = new Schema({
  id: {
    type: Number
  },
  text: {
    type: String,
    default: '',
    trim: true
  },
  numAnswers: {
    type: Number
  },
  official: {
    type: Boolean
  },
  expansion: {
    type: String,
    default: '',
    trim: true
  }
});


// Statics

QuestionSchema.statics = {
  load(id, cb) {
    this.findOne({ id }).select('-_id').exec(cb);
  }
};

mongoose.model('Question', QuestionSchema);
