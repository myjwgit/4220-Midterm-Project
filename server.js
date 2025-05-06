// server.js
import express from 'express';
import dotenv from 'dotenv';
import bookRoutes from './routes/books.js';
import historyRoutes from './routes/history.js';
import mongo from './services/db.js';

dotenv.config(); // Load .env file

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB Cloud Atlas
mongo.connect()
  .then(() => console.log('Connected to MongoDB Cloud Atlas'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit on DB failure
  });

// Register routes
app.use('/books', bookRoutes);
app.use('/history', historyRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
