const { searchBooks, getBookDetails } = require('./api');
const { saveKeyword, saveSelection, loadHistory } = require('./db');
const inquirer = require('inquirer');

/**
 * Handles book search, selection, and fetching details.
 * @param {string} keyword - The search keyword.
 */
const searchFunctionality = async (keyword) => {
  const results = await searchBooks(keyword);
  saveKeyword(keyword);

  const choices = [
    ...results.google.map(b => ({ name: `Google: ${b.volumeInfo.title}`, value: { id: b.id, source: 'google' } })),
    ...results.openLibrary.map(b => ({ name: `Open Library: ${b.title}`, value: { id: b.key.replace('/works/', ''), source: 'openLibrary' } }))
  ];

  if (choices.length === 0) {
    console.log("No results found.");
    return;
  }

  const { selectedBook } = await inquirer.prompt({
    type: 'list',
    name: 'selectedBook',
    message: 'Select a book:',
    choices
  });

  saveSelection(selectedBook);
  const details = await getBookDetails(selectedBook.id, selectedBook.source);
  console.log(details);
};

/**
 * Handles displaying search history.
 */
const historyFunctionality = async () => {
  const history = loadHistory();

  const { historyType } = await inquirer.prompt({
    type: 'list',
    name: 'historyType',
    message: 'View search history:',
    choices: ['Keywords', 'Selections', 'Exit']
  });

  if (historyType === 'Exit') return;

  const choices = historyType === 'Keywords'
    ? history.keywords.map(k => ({ name: k, value: k }))
    : history.selections.map(s => ({ name: s.id, value: s }));

  if (choices.length === 0) {
    console.log("No history available.");
    return;
  }

  const { selectedItem } = await inquirer.prompt({
    type: 'list',
    name: 'selectedItem',
    message: `Select a ${historyType.toLowerCase()}:`,
    choices
  });

  if (historyType === 'Keywords') {
    await searchFunctionality(selectedItem);
  } else {
    const details = await getBookDetails(selectedItem.id, selectedItem.source);
    console.log(details);
  }
};

module.exports = { searchFunctionality, historyFunctionality };
