const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');

const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/project_management', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

app.use('/auth', authRoutes);
app.use('/projects', projectRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
