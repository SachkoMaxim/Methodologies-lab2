'use strict';

const regExpes = [
  {
    regExp: /([^A-Za-z0-9\u0400-\u04FF]|^)```([^A-Za-z0-9\u0400-\u04FF]|$)(.+?)([^A-Za-z0-9\u0400-\u04FF]|^)```([^A-Za-z0-9\u0400-\u04FF]|$)/s,
    length: 3,
    symbol: '```',
    changeToStart: '<pre>',
    changeToEnd: '</pre>',
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
    changeToStart: '<b>',
    changeToEnd: '</b>',
    nestedTag: false
  },
  {
    regExp: /([^A-Za-z0-9\u0400-\u04FF]|^)_(\S(?:.*?\S)?)_([^A-Za-z0-9\u0400-\u04FF]|$)/u,
    symbol: '_',
    length: 1,
    changeToStart: '<i>',
    changeToEnd: '</i>',
    nestedTag: false
  },
  {
    regExp: /([^A-Za-z0-9\u0400-\u04FF]|^)`(\S(?:.*?\S)?)`([^A-Za-z0-9\u0400-\u04FF]|$)/u,
    symbol: '`',
    length: 1,
    changeToStart: '<tt>',
    changeToEnd: '</tt>',
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

const isNestedTag = (markdownText) => {
  const nestedTestText = markdownText
    .replace(/<b>/g, '**')
    .replace(/<\/b>/g, '**')
    .replace(/<i>/g, '_')
    .replace(/<\/i>/g, '_')
    .replace(/<tt>/g, '`')
    .replace(/<\/tt>/g, '`');
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

const convertMarkdownToHTML = (markdownText) => {
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
      if (!regExp.nestedTag && isNestedTag(' ' + formatedText)) {
        console.error(`\x1b[31mError:\x1b[0m Invalid Markdown nested tags.`);
        process.exit(406);
      }
      markdownText = markdownText.slice(0, midx) + regExp.changeToStart + formatedText + regExp.changeToEnd + markdownText.slice(endIdx + regExp.length * 2); 
    }
  }
  if (isInvalidTags(markdownText)) {
    console.error(`\x1b[31mError:\x1b[0m Invalid Markdown not finished tags.`);
    process.exit(406);
  }
  markdownText = processParagraphs(markdownText);
  markdownText = deleteInternalSymbols(markdownText, '~!!!~');
  return markdownText;
};

module.exports = { convertMarkdownToHTML };