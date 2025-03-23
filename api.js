import axios from 'axios';

const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

export const searchBooks = async (query, maxResults = 10, startIndex = 0) => {
    try {
        // 🔹 You forgot to make the API request! Add this:
        const response = await axios.get(`${BASE_URL}?q=${query}&maxResults=${maxResults}&startIndex=${startIndex}`);

        // Formatting the response
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

        return [];
    } catch (error) {
        throw new Error(`Failed to search books: ${error.message}`);
    }
};

export const getBookDetails = async (bookId) => {
    try {
        const detailsURL = `${BASE_URL}/${bookId}`;

        const response = await axios.get(detailsURL);
        const book = response.data;

        // book info
        return {
            id: book.id,
            title: book.volumeInfo.title,
            subtitle: book.volumeInfo.subtitle,
            authors: book.volumeInfo.authors || ['Unknown'],
            publisher: book.volumeInfo.publisher,
            publishedDate: book.volumeInfo.publishedDate,
            description: book.volumeInfo.description,
            industryIdentifiers: book.volumeInfo.industryIdentifiers, // ISBN numbers
            pageCount: book.volumeInfo.pageCount,
            categories: book.volumeInfo.categories,
            averageRating: book.volumeInfo.averageRating,
            ratingsCount: book.volumeInfo.ratingsCount,
            images: book.volumeInfo.imageLinks,
            language: book.volumeInfo.language,
            previewLink: book.volumeInfo.previewLink,
            infoLink: book.volumeInfo.infoLink,
            saleInfo: book.saleInfo
        };
    } catch (error) {
        throw new Error(`Failed to get book details: ${error.message}`);
    }
};


