'use strict';

const { writeFileSync } = require('node:fs');
const { validateInputFilePath, validateOutputFilePath, readMarkdownFile } = require('./validations.js');
const { convertMarkdownToHTML } = require('./markdownConverter.js');

const startFileMode = () => {
    const inputFilePath = process.argv[2];
    const outOptionIndex = process.argv.findIndex(arg => arg === '--out');
    const outputFilePath = outOptionIndex !== -1 ? process.argv[outOptionIndex + 1] : null;
    const formatOptionIndex = process.argv.findIndex(arg => arg.startsWith('--format='));

    validateInputFilePath(inputFilePath);
    validateOutputFilePath(outputFilePath);

    const markdownText = readMarkdownFile(inputFilePath);

    let format = 'html';

    if (formatOptionIndex !== -1) {
        const formatOptionValue = process.argv[formatOptionIndex].split('=')[1];
        format = formatOptionValue !== '' ? formatOptionValue : 'html';
    }

    const fileText = convertMarkdownToHTML(markdownText, format);
    writeFileSync(outputFilePath, fileText, 'utf-8');

    console.log(`HTML successfully written to: ${outputFilePath}`);
}

module.exports = { startFileMode };
