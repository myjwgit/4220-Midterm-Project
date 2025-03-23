const fs = require('fs-extra');
const path = require('path');

// Define file paths
const keywordFile = path.join(__dirname, 'mock_database', 'search_history_keyword.json');
const selectionFile = path.join(__dirname, 'mock_database', 'search_history_selection.json');

// Ensure files exist
const ensureFileExists = async (filePath, defaultData = []) => {
    try {
        if (!(await fs.pathExists(filePath))) {
            await fs.outputJson(filePath, defaultData, { spaces: 2 });
        }
    } catch (error) {
        console.error(`Error ensuring file exists: ${filePath}`, error);
    }
};

// Load search history from JSON files
const loadHistory = async () => {
    await ensureFileExists(keywordFile);
    await ensureFileExists(selectionFile);

    try {
        const keywords = await fs.readJson(keywordFile);
        const selections = await fs.readJson(selectionFile);
        return { keywords, selections };
    } catch (error) {
        console.error('Error loading search history:', error);
        return { keywords: [], selections: [] };
    }
};

// Save a search keyword (ensuring uniqueness)
const saveKeyword = async (keyword) => {
    if (!keyword) return;
    await ensureFileExists(keywordFile);

    try {
        const keywords = await fs.readJson(keywordFile);
        if (!keywords.includes(keyword)) {
            keywords.push(keyword);
            await fs.writeJson(keywordFile, keywords, { spaces: 2 });
        }
    } catch (error) {
        console.error('Error saving keyword:', error);
    }
};

// Save a selected book (ensuring uniqueness)
const saveSelection = async (selection) => {
    if (!selection || !selection.id) return;
    await ensureFileExists(selectionFile);

    try {
        const selections = await fs.readJson(selectionFile);
        const exists = selections.some(s => s.id === selection.id);

        if (!exists) {
            selections.push(selection);
            await fs.writeJson(selectionFile, selections, { spaces: 2 });
        }
    } catch (error) {
        console.error('Error saving selection:', error);
    }
};

module.exports = { saveKeyword, saveSelection, loadHistory };