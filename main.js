'use strict';

import { startConsoleMode } from './src/consoleMode.js';
import { startFileMode } from './src/fileMode.js';

if (process.argv.length < 3) {
    console.error('\x1b[31mError:\x1b[0m Please provide the path to the input Markdown file.');
    //exit code is 404, similar to HTTP Not Found status code
    process.exit(404);
} else {
    if (process.argv.length < 4) {
        startConsoleMode();
    } else {
        startFileMode();
    }
}
