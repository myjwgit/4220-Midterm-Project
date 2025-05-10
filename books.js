// routes/books.js

import express from 'express';
import { searchBooks, getBookDetails } from '../services/api.js';
import db from '../services/db.js';

const booksRouter = express.Router();

// GET /books?keyword=harry
booksRouter.get('/', async (req, res) => {
  const searchKeyword = req.query.keyword;

  if (!searchKeyword) {
    return res.status(400).json({ error: 'Missing keyword in query' });
  }

  try {
    const searchResults = await searchBooks(searchKeyword);

    const formattedResults = searchResults.map(book => ({
      display: book.title,
      identifier: book.id,
    }));

    await db.insert('SearchHistoryKeyword', { keyword: searchKeyword });

    res.json(formattedResults);
  } catch (error) {
    console.error('Error in GET /books:', error.message);
    res.status(500).json({ error: 'Failed to search books' });
  }
});

// GET /books/:id
booksRouter.get('/:id', async (req, res) => {
  const bookId = req.params.id;

  try {
    const bookInfo = await getBookDetails(bookId);

    await db.insert('SearchHistorySelection', bookInfo);

    res.json(bookInfo);
  } catch (error) {
    console.error('Error in GET /books/:id:', error.message);
    res.status(500).json({ error: 'Failed to fetch book details' });
  }
});

export default booksRouter;
