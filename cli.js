// cli.js

// NOTE: Make sure to install yargs before running this file:
// Run: npm install yargs

const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
const { searchFunctionality, historyFunctionality } = require('./app'); // functions from app.js

// Configure CLI using yargs
yargs(hideBin(process.argv))
  .usage('Usage: node cli.js <command> [options]')

  // Help menu (shows when user types --help or -h)
  .help('help')
  .alias('help', 'h')

  // Search command: run with "node cli.js search <keyword>"
  .command(
    'search <keyword>',
    'Search for books using a keyword',
    (yargs) => {
      yargs.positional('keyword', {
        describe: 'The keyword to search for',
        type: 'string',
      });
    },
    (args) => {
      searchFunctionality(args.keyword); // Call the function from app.js with user's keyword
    }
  )

  // History command: run with "node cli.js history <keywords|selections>"
  .command(
    'history <type>',
    'View search or selection history',
    (yargs) => {
      yargs.positional('type', {
        describe: 'Type of history to view (keywords or selections)',
        type: 'string',
        choices: ['keywords', 'selections'], // Only allow valid input
      });
    },
    () => {
      historyFunctionality(); // This will prompt user to choose from keyword/selection history
    }
  )

  // Make sure at least one command is provided
  .demandCommand(1, 'Please enter a valid command to continue.')
  .strict()
  .argv;
