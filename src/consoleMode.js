'use strict';

import { validateInputFilePath, readMarkdownFile } from './validations.js';
import { convertMarkdownToHTML } from './markdownConverter.js';

const startConsoleMode = () => {
    const filePath = process.argv[2];
    
    validateInputFilePath(filePath);

    const markdownText = readMarkdownFile(filePath);

    const consoleText = convertMarkdownToHTML(markdownText);
    console.log(`${consoleText}`);
}

export { startConsoleMode };
