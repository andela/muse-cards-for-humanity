/**
 * Module dependencies.
 */
const mongoose = require('mongoose');

const Answer = mongoose.model('Answer');
// const _ = require('underscore');

// Find answer by id

exports.answer = function (req, res, next, id) {
  return Answer.load(id, (err, answer) => {
    if (err) return next(err);
    if (!answer) return next(new Error(`Failed to load answer ${id}`));
    req.answer = answer;
    next();
  });
};

// Show an answer
exports.show = function (req, res) {
  res.jsonp(req.answer);
};

// List of Answers
exports.all = function (req, res) {
  return Answer.find({ official: true }).select('-_id')
    .exec((err, answers) => {
      if (err) {
        res.render('error', {
          status: 500
        });
      } else {
        res.jsonp(answers);
      }
    });
};

// List of Answers (for Game class)
exports.allAnswersForGame = function (cb) {
  return Answer.find({ official: true }).select('-_id')
    .exec(function (err, answers) {
      if (err) {
        throw (err);
      } else {
        cb(answers);
      }
    });
};
