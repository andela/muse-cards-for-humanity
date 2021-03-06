/**
 * Module dependencies.
 */
const mongoose = require('mongoose');
// const async = require('async'),
const Question = mongoose.model('Question');
// const _ = require('underscore');


// Find question by id
exports.question = function (req, res, next, id) {
  Question.load(id, function (err, question) {
    if (err) return next(err);
    if (!question) return next(new Error(`Failed to load question ${id}`));
    req.question = question;
    next();
  });
};

// Show an question
exports.show = function (req, res) {
  res.jsonp(req.question);
};

// List of Questions
exports.all = function (req, res) {
  Question.find({ official: true, numAnswers: { $lt: 3 } }).select('-_id').exec(function (err, questions) {
    if (err) {
      res.render('error', {
        status: 500
      });
    } else {
      res.jsonp(questions);
    }
  });
};

// List of Questions (for Game class)

exports.allQuestionsForGame = function (cb) {
  Question.find({ official: true, numAnswers: { $lt: 3 } }).select('-_id').exec(function (err, questions) {
    if (err) {
      throw (err);
    } else {
      cb(questions);
    }
  });
};
