// db.js
// This module handles loading and saving search history to local JSON files using fs-extra

// Import necessary modules
import fs from 'fs-extra';                // For working with the filesystem (read/write JSON)
import path from 'path';                 // To construct file paths
import { fileURLToPath } from 'url';     // Helps resolve __dirname in ES modules
import { dirname } from 'path';          // Used with fileURLToPath to get directory name

// Setup for __dirname in ES modules (Node doesn't support __dirname directly in ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// File paths to the JSON history files in mock_database/
const keywordFile = path.join(__dirname, 'mock_database', 'search_history_keyword.json');
const selectionFile = path.join(__dirname, 'mock_database', 'search_history_selection.json');

// Helper function: Ensure the file exists, if not, create it with default data (empty array)
const ensureFileExists = async (filePath, defaultData = []) => {
  try {
    const exists = await fs.pathExists(filePath);
    if (!exists) {
      await fs.outputJson(filePath, defaultData, { spaces: 2 }); // create with pretty formatting
    }
  } catch (error) {
    console.error(`Error ensuring file exists: ${filePath}`, error);
  }
};

// Function: Load keyword and selection history from JSON files
export const loadHistory = async () => {
  // Ensure both files exist
  await ensureFileExists(keywordFile);
  await ensureFileExists(selectionFile);

  try {
    // Read and return the history as JavaScript objects
    const keywords = await fs.readJson(keywordFile);
    const selections = await fs.readJson(selectionFile);
    return { keywords, selections };
  } catch (error) {
    console.error('Error loading search history:', error);
    return { keywords: [], selections: [] }; // Return empty if anything goes wrong
  }
};

// Function: Save a keyword to search history (only if it's unique)
export const saveKeyword = async (keyword) => {
  if (!keyword) return;
  await ensureFileExists(keywordFile);

  try {
    const keywords = await fs.readJson(keywordFile);
    if (!keywords.includes(keyword)) {
      keywords.push(keyword); // Add new keyword
      await fs.writeJson(keywordFile, keywords, { spaces: 2 }); // Save with formatting
    }
  } catch (error) {
    console.error('Error saving keyword:', error);
  }
};

// Function: Save a selected book object (e.g. { id: 'abc123' }) to selection history (if unique)
export const saveSelection = async (selection) => {
  if (!selection || !selection.id) return; // Ensure valid input
  await ensureFileExists(selectionFile);

  try {
    const selections = await fs.readJson(selectionFile);
    const exists = selections.some(s => s.id === selection.id); // Check for duplicates
    if (!exists) {
      selections.push(selection); // Add the new selection
      await fs.writeJson(selectionFile, selections, { spaces: 2 });
    }
  } catch (error) {
    console.error('Error saving selection:', error);
  }
};
