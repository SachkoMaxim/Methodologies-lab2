'use strict';

const regExpes = [
  {
    regExp: /([^A-Za-z0-9\u0400-\u04FF]|^)```([^A-Za-z0-9\u0400-\u04FF]|$)(.+?)([^A-Za-z0-9\u0400-\u04FF]|^)```([^A-Za-z0-9\u0400-\u04FF]|$)/s,
    length: 3,
    symbol: '```',
    changeToStart: { ansi: '\x1B[7m', html: '<pre>' },
    changeToEnd: { ansi: '\x1B[27m', html: '</pre>' },
    nestedTag: true,
    fn: (data) => {
      preData.push(data);
      return '~!!!~';
    }
  },
  {
    regExp: /([^A-Za-z0-9\u0400-\u04FF]|^)\*\*(\S(?:.*?\S)?)\*\*([^A-Za-z0-9\u0400-\u04FF]|$)/u,
    length: 2,
    symbol: '**',
    changeToStart: { ansi: '\x1B[1m', html: '<b>' },
    changeToEnd: { ansi: '\x1B[22m', html: '</b>' },
    nestedTag: false
  },
  {
    regExp: /([^A-Za-z0-9\u0400-\u04FF]|^)_(\S(?:.*?\S)?)_([^A-Za-z0-9\u0400-\u04FF]|$)/u,
    symbol: '_',
    length: 1,
    changeToStart: {ansi: '\x1B[3m', html: '<i>' },
    changeToEnd: { ansi: '\x1B[23m', html: '</i>' },
    nestedTag: false
  },
  {
    regExp: /([^A-Za-z0-9\u0400-\u04FF]|^)`(\S(?:.*?\S)?)`([^A-Za-z0-9\u0400-\u04FF]|$)/u,
    symbol: '`',
    length: 1,
    changeToStart: { ansi: '\x1B[7m', html: '<tt>' },
    changeToEnd: { ansi: '\x1B[27m', html: '</tt>' },
    nestedTag: false
  },
];

const regExpesError = [
  /(^|\s)\*\*[\w\u0400-\u04FF]+/,
  /(^|\s)_[\w\u0400-\u04FF]+/,
  /(^|\s)`[\w\u0400-\u04FF]+/
];

const preData = [];

const paragraphOpenedTag = '<p>';
const paragraphClosedTag = '</p>';

const processParagraphs = (markdownText) => {
  markdownText = markdownText.replace(/[\r]/g, '');
  markdownText = paragraphOpenedTag + markdownText;

  let idx;
  while ((idx = markdownText.indexOf('\n\n')) !== -1) {
      let nextNonEmptyIdx = idx + 2;

      while (nextNonEmptyIdx < markdownText.length && /^\s*$/.test(markdownText.charAt(nextNonEmptyIdx))) {
          nextNonEmptyIdx++;
      }

      markdownText = markdownText.slice(0, idx) + `${paragraphClosedTag}\n${paragraphOpenedTag}` + markdownText.slice(nextNonEmptyIdx);
  }

  markdownText = markdownText + paragraphClosedTag;
  markdownText = markdownText.replace(/<p><pre>/g, '<p>\n<pre>');
  markdownText = markdownText.replace(/<\/pre><\/p>/g, '</pre>\n</p>');
  return markdownText;
};

const isNestedTag = (markdownText, format) => {
  const nestedTestText = markdownText
    .replace(format === 'html' ? /<b>/g : /\x1B\[1m/g, '**')
    .replace(format === 'html' ? /<\/b>/g : /\x1B\[22m/g, '**')
    .replace(format === 'html' ? /<i>/g : /\x1B\[3m/g, '_')
    .replace(format === 'html' ? /<\/i>/g : /\x1B\[23m/g, '_')
    .replace(format === 'html' ? /<tt>/g : /\x1B\[7m/g, '`')
    .replace(format === 'html' ? /<\/tt>/g : /\x1B\[27m/g, '`');
  for (const regExp of regExpes) {
    if (nestedTestText.match(regExp.regExp) != null) return true;
  }
  return false;
};

const isInvalidTags = (markdownText) => {
  for (const regExp of regExpesError) {
    if (markdownText.match(regExp) != null) return true;
  }
  return false;
};

const deleteInternalSymbols = (data, symbols) => {
  while (preData.length) {
    data = data.replace(symbols, preData.shift());
  }
  return data;
};

const convertMarkdownToHTML = (markdownText, format) => {
  for (const regExp of regExpes) {
    let match;
    while ((match = markdownText.match(regExp.regExp)) != null) {
      const symbolIndexStart = match[0].indexOf(regExp.symbol);
      const midx = match.index + symbolIndexStart;
      let mlength = match[0].length - symbolIndexStart;
      let preformatedText = markdownText.slice(midx + regExp.length, midx + mlength);
      const symbolIndexEnd = preformatedText.lastIndexOf(regExp.symbol);
      const endIdx = midx + symbolIndexEnd;
      preformatedText = preformatedText.slice(0, symbolIndexEnd);
      const formatedText = regExp.fn ? regExp.fn(preformatedText) : preformatedText;
      if (!regExp.nestedTag && isNestedTag(' ' + formatedText, format)) {
        const err = new Error('\x1b[31mError:\x1b[0m Invalid Markdown nested tags.');
        err.code = 406;
        throw err;
      }
      markdownText = markdownText.slice(0, midx) + regExp.changeToStart[format] + formatedText + regExp.changeToEnd[format] + markdownText.slice(endIdx + regExp.length * 2); 
    }
  }
  if (isInvalidTags(markdownText)) {
    const err = new Error('\x1b[31mError:\x1b[0m Invalid Markdown not finished tags.');
    err.code = 406;
    throw err;
  }
  if(format === 'html'){
    markdownText = processParagraphs(markdownText);
  }
  markdownText = deleteInternalSymbols(markdownText, '~!!!~');
  return markdownText;
};

module.exports = { convertMarkdownToHTML };