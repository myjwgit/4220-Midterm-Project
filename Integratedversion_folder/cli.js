// cli.js

// Make sure all dependencies are installed:
// npm install yargs inquirer axios fs-extra

// Import yargs for parsing CLI commands
import yargs from 'yargs';
// hideBin helps ignore the first two default Node arguments (node + filename)
import { hideBin } from 'yargs/helpers';

// Import your app logic (search & history functionality)
import { searchFunctionality, historyFunctionality } from './app.js';

// CLI CONFIGURATION

// Start yargs CLI configuration
yargs(hideBin(process.argv))
  // Set a usage guide that appears in help
  .usage('Usage: node cli.js <command> [options]')

  // Add help menu support
  .help('help')
  .alias('help', 'h')

  // SEARCH COMMAND
  // Usage: node cli.js search <keyword>
  .command(
    'search <keyword>',
    'Search for books using a keyword', // Description
    (yargs) => {
      // Define expected argument: <keyword>
      yargs.positional('keyword', {
        describe: 'The keyword to search for',
        type: 'string',
      });
    },
    (args) => {
      // When this command is run, call your app's search logic
      searchFunctionality(args.keyword);
    }
  )

  // HISTORY COMMAND
  // Usage: node cli.js history <keywords|selections>
  .command(
    'history <type>',
    'View search or selection history',
    (yargs) => {
      // <type> must be either 'keywords' or 'selections'
      yargs.positional('type', {
        describe: 'Type of history to view (keywords or selections)',
        type: 'string',
        choices: ['keywords', 'selections'], // enforce valid input
      });
    },
    (args) => {
      // Pass user's choice into app's history logic
      historyFunctionality(args.type);
    }
  )


  // Enforce at least one command
  .demandCommand(1, '！ Please enter a valid command to continue.')

  // Disallow unknown commands or arguments
  .strict()

  // Trigger yargs to parse the input and run the matching command
  .argv;
