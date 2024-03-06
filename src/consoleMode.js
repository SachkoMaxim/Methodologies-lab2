'use strict';

const { validateInputFilePath, readMarkdownFile } = require('./validations.js');
const { convertMarkdownToHTML } = require('./markdownConverter.js');

const startConsoleMode = () => {
    const filePath = process.argv[2];
    
    validateInputFilePath(filePath);

    const markdownText = readMarkdownFile(filePath);

    const consoleText = convertMarkdownToHTML(markdownText);
    console.log(`${consoleText}`);
}

module.exports = { startConsoleMode };
