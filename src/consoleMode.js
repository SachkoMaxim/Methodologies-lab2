'use strict';

const { validateInputFilePath, readMarkdownFile } = require('./validations.js');
const { convertMarkdownToHTML } = require('./markdownConverter.js');

const startConsoleMode = () => {
    const filePath = process.argv[2];
    const formatOptionIndex = process.argv.findIndex(arg => arg.startsWith('--format='));
    
    validateInputFilePath(filePath);

    const markdownText = readMarkdownFile(filePath);

    let format = 'ansi';

    if (formatOptionIndex !== -1) {
        const formatOptionValue = process.argv[formatOptionIndex].split('=')[1];
        format = formatOptionValue !== '' ? formatOptionValue : 'ansi';
    }

    const consoleText = convertMarkdownToHTML(markdownText, format);
    console.log(`${consoleText}`);
}

module.exports = { startConsoleMode };
