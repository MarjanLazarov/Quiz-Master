const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');

// CREATE quiz
router.post('/quizzes', async (req, res) => {
    try {
        const newQuiz = new Quiz(req.body);
        await newQuiz.save();
        res.status(201).json(newQuiz);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});

// READ all quizzes
router.get('/quizzes', async (req, res) => {
    try {
        const quizzes = await Quiz.find();
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});

// READ one quiz by ID
router.get('/quizzes/:id', async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if(!quiz) return res.status(404).json({ error: 'Quiz not found'});
        res.json(quiz);
    } catch {
        res.status(500).json({error: error.message});
    }
});

// UPDATE quiz
router.put('/quizzes/:id', async (req, res) => {
    try {
        const updateQuiz = await Quiz.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        );
        res.json(updateQuiz);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});

// DELETE quiz
router.delete('/quizzes/:id', async (req, res) => {
    try {
        await Quiz.findByIdAndDelete(req.params.id);
        res.json({ message: 'Quiz deleted'});
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});

module.exports = router;