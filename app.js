const inquirer = require('inquirer');
const { searchBooks, getBookDetails } = require('./api');
const { saveKeyword, saveSelection, loadHistory } = require('./db');

const searchFunctionality = async (keyword) => {
  try {
    const results = await searchBooks(keyword);
    if (!results.length) {
      console.log("No results found.");
      return;
    }

    saveKeyword(keyword);

    const choices = results.map(book => ({
      name: `${book.title} by ${book.authors.join(', ')}`,
      value: book.id
    }));

    const { selectedBookId } = await inquirer.prompt({
      type: 'list',
      name: 'selectedBookId',
      message: 'Select a book:',
      choices
    });

    saveSelection({ id: selectedBookId });

    const details = await getBookDetails(selectedBookId);
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
    console.error(`Error: ${error.message}`);
  }
};

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
    : history.selections.map(s => ({ name: s.id, value: s.id }));

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
    try {
      const details = await getBookDetails(selectedItem);
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
      console.error(`Error fetching details: ${error.message}`);
    }
  }
};

module.exports = { searchFunctionality, historyFunctionality };
