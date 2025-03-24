// Import required modules and functions
import inquirer from 'inquirer'; // For CLI prompts
import { searchBooks, getBookDetails } from './api.js'; // API interaction functions
import { saveKeyword, saveSelection, loadHistory } from './db.js'; // History storage functions

// Helper function: Display nicely formatted book details in the terminal
const displayBookDetails = (details) => {
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
};

// Core functionality: Handle searching with a keyword
export const searchFunctionality = async (keyword) => {
  try {
    // Step 1: Search books using the API
    const results = await searchBooks(keyword);
    if (!results.length) {
      console.log("No results found.");
      return;
    }

    // Step 2: Save keyword to keyword history (if unique)
    await saveKeyword(keyword);

    // Step 3: Format the search results into a user-friendly list
    const choices = results.map(book => ({
      name: `${book.title} by ${book.authors.join(', ')}`, // shown in list
      value: book.id // used for selection
    }));

    // Step 4: Prompt user to choose a book from search results
    const { selectedBookId } = await inquirer.prompt({
      type: 'list',
      name: 'selectedBookId',
      message: 'Select a book:',
      choices
    });

    // Step 5: Save selected book ID to selection history (if unique)
    await saveSelection({ id: selectedBookId });

    // Step 6: Fetch and display the full book details
    const details = await getBookDetails(selectedBookId);
    displayBookDetails(details);

  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};

// Functionality to view and interact with keyword or selection history
export const historyFunctionality = async (typeFromCLI) => {
  // Step 1: Load both keyword and selection histories from local files
  const { keywords, selections } = await loadHistory();

  // Step 2: Determine which type of history user wants to see
  let historyType = typeFromCLI;
  if (!historyType) {
    // If no type was passed from CLI, ask user to choose from a prompt
    const response = await inquirer.prompt({
      type: 'list',
      name: 'historyType',
      message: 'View search history:',
      choices: ['Keywords', 'Selections', 'Exit']
    });
    historyType = response.historyType;
  }

  // Step 3: Exit early if user chooses to cancel
  if (historyType === 'Exit') return;

  // Step 4: Create a list of options based on the selected history type
  const choices = historyType === 'Keywords'
    ? keywords.map(k => ({ name: k, value: k }))
    : selections.map(s => ({ name: s.id, value: s.id }));

  // Step 5: Show message if there's no history to show
  if (choices.length === 0) {
    console.log("No history available.");
    return;
  }

  // Step 6: Prompt user to select an item from history
  const { selectedItem } = await inquirer.prompt({
    type: 'list',
    name: 'selectedItem',
    message: `Select a ${historyType.toLowerCase()}:`,
    choices
  });

  // Step 7: Perform action depending on whether it's a keyword or selection
  if (historyType === 'Keywords') {
    // Re-perform search if keyword is selected
    await searchFunctionality(selectedItem);
  } else {
    // Display full book details if selection is chosen
    const details = await getBookDetails(selectedItem);
    displayBookDetails(details);
  }
};
