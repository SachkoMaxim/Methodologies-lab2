'use strict';

const { existsSync, readFileSync, writeFileSync } = require('node:fs');

const validateInputFilePath = (filePath) => {
    if (!existsSync(filePath)) {
        const err = new Error('\x1b[31mError:\x1b[0m File not found at path: ' + filePath);
        // exit code is 404, similar to HTTP Not Found status code
        err.code = 404;
        throw err;
    }

    if (!/\.(md|markdown)$/i.test(filePath)) {
        const err = new Error('\x1b[31mError:\x1b[0m Invalid input file type. Please provide a Markdown file.');
        // exit code is 415 as for Unsupported Media Type
        err.code = 415;
        throw err;
    }
};

const validateOutputFilePath = (filePath) => {
    if (!filePath) {
        const err = new Error('\x1b[31mError:\x1b[0m Output file path not provided.');
        // exit code is 400 as for Bad Request
        err.code = 400;
        throw err;
    }

    if (!/\.(html|txt)$/i.test(filePath)) {
        const err = new Error('\x1b[31mError:\x1b[0m Invalid output file type. Please provide an HTML or TXT file.');
        // exit code is 415 as for Unsupported Media Type
        err.code = 415;
        throw err;
    }

    // Check if the output file exists, create it if not
    const outputFile = filePath.substring(0, filePath.lastIndexOf('/'));
    if (outputFile && !existsSync(outputFile)) {
        try {
            // Creating the output directory
            writeFileSync(outputFile + '/.placeholder', '', 'utf-8');
        } catch (error) {
            const err = new Error('\x1b[31mError:\x1b[0m Unable to create output directory: ' + outputFile + '.\n' + error.message);
            // exit code is 500 as for internal server error
            err.code = 500;
            throw err;
        }
    }
};

const readMarkdownFile = (filePath) => {
    try {
        return readFileSync(filePath, 'utf-8');
    } catch (error) {
        const err = new Error('\x1b[31mError:\x1b[0m Unable to read file at path: ' + filePath + '.\n' + error.message);
        // exit code is 500 as for internal server error
        err.code = 500;
        throw err;
    }
};

module.exports = { validateInputFilePath, validateOutputFilePath, readMarkdownFile };