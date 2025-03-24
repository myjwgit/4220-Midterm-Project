// Import axios for making HTTP requests
import axios from 'axios';

// Base URL for Google Books API
const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

/**
 * Search for books using a keyword
 * 
 * @param {string} query - The keyword to search for
 * @param {number} maxResults - (Optional) Number of results to return (default: 10)
 * @param {number} startIndex - (Optional) Start index for pagination (default: 0)
 * @returns {Array<Object>} Array of simplified book objects
 */
export const searchBooks = async (query, maxResults = 10, startIndex = 0) => {
  try {
    // Make an HTTP GET request to the search endpoint with the user's query
    const response = await axios.get(`${BASE_URL}?q=${query}&maxResults=${maxResults}&startIndex=${startIndex}`);

    // If books are found, map and format each result to a simplified object
    if (response.data.items) {
      return response.data.items.map(book => ({
        id: book.id,
        title: book.volumeInfo.title,
        authors: book.volumeInfo.authors || ['Unknown'],
        publisher: book.volumeInfo.publisher,
        publishedDate: book.volumeInfo.publishedDate,
        description: book.volumeInfo.description,
        pageCount: book.volumeInfo.pageCount,
        categories: book.volumeInfo.categories,
        thumbnail: book.volumeInfo.imageLinks?.thumbnail,
        language: book.volumeInfo.language,
        previewLink: book.volumeInfo.previewLink
      }));
    }

    // If no results found, return an empty array
    return [];
  } catch (error) {
    // If the API request fails, throw a formatted error
    throw new Error(`Failed to search books: ${error.message}`);
  }
};

/**
 * Get full book details by book ID
 * 
 * @param {string} bookId - The unique ID of the book
 * @returns {Object} Detailed information about the book
 */
export const getBookDetails = async (bookId) => {
  try {
    // Make a GET request to retrieve a specific book by ID
    const response = await axios.get(`${BASE_URL}/${bookId}`);
    const book = response.data;

    // Return a formatted book detail object
    return {
      id: book.id,
      title: book.volumeInfo.title,
      subtitle: book.volumeInfo.subtitle,
      authors: book.volumeInfo.authors || ['Unknown'],
      publisher: book.volumeInfo.publisher,
      publishedDate: book.volumeInfo.publishedDate,
      description: book.volumeInfo.description,
      industryIdentifiers: book.volumeInfo.industryIdentifiers, // ISBN, etc.
      pageCount: book.volumeInfo.pageCount,
      categories: book.volumeInfo.categories,
      averageRating: book.volumeInfo.averageRating,
      ratingsCount: book.volumeInfo.ratingsCount,
      images: book.volumeInfo.imageLinks,
      language: book.volumeInfo.language,
      previewLink: book.volumeInfo.previewLink,
      infoLink: book.volumeInfo.infoLink,
      saleInfo: book.saleInfo // pricing and availability info
    };
  } catch (error) {
    // Handle any errors from the API
    throw new Error(`Failed to get book details: ${error.message}`);
  }
};
