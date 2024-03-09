const  { convertMarkdown } = require('../src/markdownConverter');

const runTestsForDifferentFormats = (format, tests) => {
  for (const [description, value] of Object.entries(tests)) {
    describe(description, () => {
      for (const [testName, testValue] of Object.entries(value)) {
        test(testName, () => {
          expect(convertMarkdown(testValue.inputText, format)).toBe(testValue.outputResult);
        });
      }
    });
  }

  describe('Errors', () => {
    test('Nested tags', () => {
        expect(() => convertMarkdown('_**testing**_', format)).toThrowError('\x1b[31mError:\x1b[0m Invalid Markdown nested tags.');
    });

    test('Unfinished tags', () => {
        expect(() => convertMarkdown('**testing string', format)).toThrowError('\x1b[31mError:\x1b[0m Invalid Markdown not finished tags.');
    });

    test('Unfinished tags with space', () => {
        expect(() => convertMarkdown('**testing string  **', format)).toThrowError('\x1b[31mError:\x1b[0m Invalid Markdown not finished tags.');
    });

    test('Unfinished tags and two strings', () => {
        const inputText = `**Testing this
        paragraph.**`;
        expect(() => convertMarkdown(inputText, format)).toThrowError('\x1b[31mError:\x1b[0m Invalid Markdown not finished tags.');
    });
  });
}

describe('HTML format', () => {
  const tests = {
    'paragraph': {
        'Wrap paragraph with one string': {inputText: 'It\'s testing words.', outputResult: '<p>It\'s testing words.</p>'},

        'Wrap paragraph with several strings': {inputText: `Testing this
        sentence.`, outputResult: `<p>Testing this
        sentence.</p>`},

        'Wrap several paragraphs': {inputText: `Testing this
        paragraph.

Also testing this too.

And this.`, outputResult: `<p>Testing this
        paragraph.</p>
<p>Also testing this too.</p>
<p>And this.</p>`},
    },
    '**bold**': {
        'Find **bold** part': {inputText: '**testing**', outputResult: '<p><b>testing</b></p>'},

        'Find **bold bold** part': {inputText: '**testing string**', outputResult: '<p><b>testing string</b></p>'},

        'Find ** single symbol': {inputText: 'testing ** string', outputResult: '<p>testing ** string</p>'},

        'Find ** single symbol in others patterns': {inputText: '_**_', outputResult: '<p><i>**</i></p>'},

        'Find ** symbol in word snake_case': {inputText: 'snake**case', outputResult: '<p>snake**case</p>'},
    },
    '_italic_': {
        'Find _italic_ part': {inputText: '_testing_', outputResult: '<p><i>testing</i></p>'},

        'Find _italic italic_ part': {inputText: '_testing string_', outputResult: '<p><i>testing string</i></p>'},

        'Find _ single symbol': {inputText: 'testing _ string', outputResult: '<p>testing _ string</p>'},

        'Find _ single symbol in others patterns': {inputText: '`_`', outputResult: '<p><tt>_</tt></p>'},

        'Find _ symbol in word snake_case': {inputText: 'snake_case', outputResult: '<p>snake_case</p>'},
    },
    '`monospaced`': {
        'Find `monospaced` part': {inputText: '`testing`', outputResult: '<p><tt>testing</tt></p>'},

        'Find `monospaced monospaced` part': {inputText: '`testing string`', outputResult: '<p><tt>testing string</tt></p>'},

        'Find ` single symbol': {inputText: 'testing ` string', outputResult: '<p>testing ` string</p>'},

        'Find ` single symbol in others patterns': {inputText: '**`**', outputResult: '<p><b>`</b></p>'},

        'Find ` symbol in word snake_case': {inputText: 'snake`case', outputResult: '<p>snake`case</p>'},
    },
    '```preformatted```': {
        'Find ```preformatted``` part': {inputText: '```\ntest\n```', outputResult: '<p>\n<pre>\ntest\n</pre>\n</p>'},

        'Find ```preformatted text``` part': {inputText: '```\ntest today\n```', outputResult: '<p>\n<pre>\ntest today\n</pre>\n</p>'},

        'Find ```preformatted strings``` part': {inputText: '```\ntest\n today all\nday\n```', outputResult: '<p>\n<pre>\ntest\n today all\nday\n</pre>\n</p>'},

        'Not interpret other tags inside': {inputText: '```\n**test**\n _today all`\n`day`\n```', outputResult: '<p>\n<pre>\n**test**\n _today all`\n`day`\n</pre>\n</p>'},
    }
  };
  runTestsForDifferentFormats('html', tests);
});

describe('ANSI format', () => {
    const tests = {
      'paragraph': {
          'Wrap paragraph with one string': {inputText: 'It\'s testing words.', outputResult: 'It\'s testing words.'},
  
          'Wrap paragraph with several strings': {inputText: `Testing this
          sentence.`, outputResult: `Testing this
          sentence.`},
  
          'Wrap several paragraphs': {inputText: `Testing this
        paragraph.

Also testing this too.

And this.`, outputResult: `Testing this
        paragraph.

Also testing this too.

And this.`},
      },
      '**bold**': {
          'Find **bold** part': {inputText: '**testing**', outputResult: '\x1B[1mtesting\x1B[22m'},
  
          'Find **bold bold** part': {inputText: '**testing string**', outputResult: '\x1B[1mtesting string\x1B[22m'},
  
          'Find ** single symbol': {inputText: 'testing ** string', outputResult: 'testing ** string'},
  
          'Find ** single symbol in others patterns': {inputText: '_**_', outputResult: '\x1B[3m**\x1B[23m'},
  
          'Find ** symbol in word snake_case': {inputText: 'snake**case', outputResult: 'snake**case'},
      },
      '_italic_': {
          'Find _italic_ part': {inputText: '_testing_', outputResult: '\x1B[3mtesting\x1B[23m'},
  
          'Find _italic italic_ part': {inputText: '_testing string_', outputResult: '\x1B[3mtesting string\x1B[23m'},
  
          'Find _ single symbol': {inputText: 'testing _ string', outputResult: 'testing _ string'},
  
          'Find _ single symbol in others patterns': {inputText: '`_`', outputResult: '\x1B[7m_\x1B[27m'},
  
          'Find _ symbol in word snake_case': {inputText: 'snake_case', outputResult: 'snake_case'},
      },
      '`monospaced`': {
          'Find `monospaced` part': {inputText: '`testing`', outputResult: '\x1B[7mtesting\x1B[27m'},
  
          'Find `monospaced monospaced` part': {inputText: '`testing string`', outputResult: '\x1B[7mtesting string\x1B[27m'},
  
          'Find ` single symbol': {inputText: 'testing ` string', outputResult: 'testing ` string'},
  
          'Find ` single symbol in others patterns': {inputText: '**`**', outputResult: '\x1B[1m`\x1B[22m'},
  
          'Find ` symbol in word snake_case': {inputText: 'snake`case', outputResult: 'snake`case'},
      },
      '```preformatted```': {
          'Find ```preformatted``` part': {inputText: '```\ntest\n```', outputResult: '\x1B[7m\ntest\n\x1B[27m'},
  
          'Find ```preformatted text``` part': {inputText: '```\ntest today\n```', outputResult: '\x1B[7m\ntest today\n\x1B[27m'},
  
          'Find ```preformatted strings``` part': {inputText: '```\ntest\n today all\nday\n```', outputResult: '\x1B[7m\ntest\n today all\nday\n\x1B[27m'},
  
          'Not interpret other tags inside': {inputText: '```\n**test**\n _today all`\n`day`\n```', outputResult: '\x1B[7m\n**test**\n _today all`\n`day`\n\x1B[27m'},
      }
    };
    runTestsForDifferentFormats('ansi', tests);
  });

  describe('Not right format', () => {
    test('Wrong format', () => {
        expect(() => convertMarkdown('It\'s testing words.', 'md')).toThrowError('\x1b[31mError:\x1b[0m Invalid format type: md.\nUse html or ansi format.');
    });
  });
