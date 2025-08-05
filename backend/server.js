// backend/server.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const quizRoutes = require('./routes/quizRoutes');
const { applyDefaults } = require('./models/Quiz');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=> {
    console.log('MongoDB connected');
}).catch((err) => {
    console.error('MongoDB error:', err.message);
});

// Routes
app.get('/', (req, res) => {
    res.send('Quiz Master Backend Running');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

app.use('/api', quizRoutes);