// Importing inquirer to prompt the user via the command line
import inquirer from 'inquirer';

// Import functions for interacting with the Google Books API
import { searchBooks, getBookDetails } from './api.js';

// Import functions for saving and loading search history
import { saveKeyword, saveSelection, loadHistory } from './db.js';


/**
 * Handles book search, selection, and fetching details.
 */
export const searchFunctionality = async (keyword) => {
    try {
      // Use the keyword to fetch book results from the API
      const results = await searchBooks(keyword);
  
      // If no books were found, notify the user and exit
      if (!results.length) {
        console.log("No results found.");
        return;
      }
  
      // Save the keyword in search history (if unique)
      saveKeyword(keyword);
  
      // Create a list of book choices formatted for inquirer
      const choices = results.map(book => ({
        name: `${book.title} by ${book.authors.join(', ')}`,  // What the user sees
        value: book.id  // The book ID used to fetch details
      }));
  
      // Prompt the user to select one of the search results
      const { selectedBookId } = await inquirer.prompt({
        type: 'list',
        name: 'selectedBookId',
        message: 'Select a book:',
        choices
      });
  
      // Save the selected book ID in selection history (if unique)
      saveSelection({ id: selectedBookId });
  
      // Get full book details from the API using the selected ID
      const details = await getBookDetails(selectedBookId);
  
      // Print formatted book details
      console.log('\n--- Book Details ---');
      console.log(`Title: ${details.title}`);
      console.log(`Authors: ${details.authors.join(', ')}`);
      console.log(`Publisher: ${details.publisher}`);
      console.log(`Published Date: ${details.publishedDate}`);
      console.log(`Page Count: ${details.pageCount}`);
      console.log(`Categories: ${details.categories?.join(', ')}`);
      console.log(`Language: ${details.language}`);
      console.log(`Preview Link: ${details.previewLink}`);
      console.log(`Description: ${details.description}`);
      console.log('--------------------\n');
  
    } catch (error) {
      // Handle any unexpected errors
      console.error(`Error: ${error.message}`);
    }
  };
  

/**
 * Handles displaying search history.
 */
export const historyFunctionality = async () => {
    // Load saved keyword and selection history
    const history = loadHistory();
  
    // Prompt the user to choose whether to view keyword or selection history
    const { historyType } = await inquirer.prompt({
      type: 'list',
      name: 'historyType',
      message: 'View search history:',
      choices: ['Keywords', 'Selections', 'Exit']
    });
  
    // Exit immediately if user chooses "Exit"
    if (historyType === 'Exit') return;
  
    // Build a list of choices from either keywords or selected book IDs
    const choices = historyType === 'Keywords'
      ? history.keywords.map(k => ({ name: k, value: k }))  // Keyword list
      : history.selections.map(s => ({ name: s.id, value: s.id }));  // Book ID list
  
    // If history is empty, notify user and return
    if (choices.length === 0) {
      console.log("No history available.");
      return;
    }
  
    // Prompt the user to choose a history entry
    const { selectedItem } = await inquirer.prompt({
      type: 'list',
      name: 'selectedItem',
      message: `Select a ${historyType.toLowerCase()}:`,
      choices
    });
  
    // If user chose a keyword, repeat the search process
    if (historyType === 'Keywords') {
      await searchFunctionality(selectedItem);
  
    // If user chose a past selection, fetch and show its details
    } else {
      try {
        const details = await getBookDetails(selectedItem);
  
        // Display book details again
        console.log('\n--- Book Details ---');
        console.log(`Title: ${details.title}`);
        console.log(`Authors: ${details.authors.join(', ')}`);
        console.log(`Publisher: ${details.publisher}`);
        console.log(`Published Date: ${details.publishedDate}`);
        console.log(`Page Count: ${details.pageCount}`);
        console.log(`Categories: ${details.categories?.join(', ')}`);
        console.log(`Language: ${details.language}`);
        console.log(`Preview Link: ${details.previewLink}`);
        console.log(`Description: ${details.description}`);
        console.log('--------------------\n');
      } catch (error) {
        // Handle case where book details could not be fetched
        console.error(`Error fetching details: ${error.message}`);
      }
    }
  };
  