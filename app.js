const {searchBooks, getBookeDetails } = require('/.api');
const {saveKeyword, saveSelection, loadHistory} = require('./db');
const inquirer = require('inquirer');
const { get } = require('http');


/**
 * Handles book search, selection, and fetching details.
 * @param{string} keyword - the serch keyword
 */

const searchFunctionality = async (keyword) =>{
    const results = await searchBooks(keyword);
    saveKeyword(keyword);

    const choices = [
        ...results.google.map(b=>({name:'Google:${b.volimeInfo.title}',value:{id: b.id, source:'google'}})),
        ...results.openLibrary.map(b=>({name:'Open Library:${b.titile}',value:{id:b.key.replace('works/',''),source:'openLibrary'}}))
    ];

    if(choices.length ===0){
        console.log("No found anything.");
        return;
    }

    const{selectedBook} = await inquirer.createPromptModule({
        type:'list',
        name:'selectedBook',
        message:'Select a book:',
        choices
    });

    saveSelection(selectedBook);
    const details = await getBookeDetails(selectedBook.id, searchBooks,selectedBook.source);
    console.log(details);
}