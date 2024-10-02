// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config(); // Load environment variables from .env file

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(bodyParser.json()); // Parse incoming request bodies as JSON

// MongoDB Connection using environment variables
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, // New URL string parser
  useUnifiedTopology: true // New connection management engine
})
.then(() => console.log('MongoDB Connected')) // Successful connection
.catch(err => console.log('MongoDB Connection Error: ', err)); // Error handling for connection issues

// Contact Schema Definition
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true }
});

// Mongoose Model for storing contact data in MongoDB
const Contact = mongoose.model('Contact', contactSchema);

// Route to handle form submission
app.post('/submit-form', (req, res) => {
  const { name, email, message } = req.body;

  // Validation to ensure fields are not empty
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Create a new contact document
  const newContact = new Contact({
    name,
    email,
    message
  });

  // Save the new contact to the database
  newContact.save()
    .then(() => res.status(200).json({ message: 'Form submitted successfully!' }))
    .catch((err) => res.status(500).json({ error: 'Failed to submit form', details: err }));
});

// Check if JWT_SECRET is set, log a warning if not (optional)
if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET is not set in the environment variables.');
}

// Start the server on the specified port from the .env file
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
