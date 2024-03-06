'use strict';

const { writeFileSync } = require('node:fs');
const { validateInputFilePath, validateOutputFilePath, readMarkdownFile } = require('./validations.js');
const { convertMarkdownToHTML } = require('./markdownConverter.js');

const startFileMode = () => {
    const inputFilePath = process.argv[2];
    const outputFilePath = process.argv[4];

    validateInputFilePath(inputFilePath);
    validateOutputFilePath(outputFilePath);

    const markdownText = readMarkdownFile(inputFilePath);

    const fileText = convertMarkdownToHTML(markdownText);
    writeFileSync(outputFilePath, fileText, 'utf-8');

    console.log(`HTML successfully written to: ${outputFilePath}`);
}

module.exports = { startFileMode };
