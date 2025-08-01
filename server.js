const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const Feedback = require('./models/Feedback');

const app = express();
const PORT = 3000;


const mongoURI = 'mongodb+srv://UdayKanchi:dKPXhGJ2RneG6t67@cluster0.h2g8sf2.mongodb.net/feedbackDB?retryWrites=true&w=majority';

// ✅ Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ✅ Serve frontend static files (HTML, CSS, JS from /public)
app.use(express.static(path.join(__dirname, 'public')));

// ✅ POST /submit-feedback — save form data to MongoDB
app.post('/submit-feedback', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: '⚠️ All fields are required.' });
  }

  try {
    const feedback = new Feedback({ name, email, message });
    await feedback.save();

    console.log('✅ Feedback saved:', feedback);

    res.status(200).json({ message: '✅ Feedback submitted!' });
  } catch (err) {
    console.error('❌ Error saving feedback:', err);
    res.status(500).json({ message: '❌ Server error. Try again later.' });
  }
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
