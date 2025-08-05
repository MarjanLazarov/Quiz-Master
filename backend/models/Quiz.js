// backend/models/Quiz.js

const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: String,
    options: [String],
    correctAnswer: Number,
});

const quizSchema = new mongoose.Schema({
    title: String,
    question: [questionSchema],
});

module.exports = mongoose.model('Quiz', quizSchema);