const  { convertMarkdown } = require('../src/markdownConverter');

describe('paragraph', () => {
    test('Wrap paragraph with one string', () => {
        expect(convertMarkdown('It\'s testing words.', 'ansi')).toBe('It\'s testing words.');
    });

    test('Wrap paragraph with several strings', () => {
        const inputText = `Testing this
        sentence.`;
        const outputResult = `Testing this
        sentence.`;
        expect(convertMarkdown(inputText, 'ansi')).toBe(outputResult);
    });

    test('Wrap several paragraphs', () => {
        const inputText = `Testing this
        paragraph.

Also testing this too.

And this.`;
        const outputResult = `Testing this
        paragraph.

Also testing this too.

And this.`;
        expect(convertMarkdown(inputText, 'ansi')).toBe(outputResult);
    });
});

describe('**bold**', () => {
    test('Find **bold** part', () => {
        expect(convertMarkdown('**testing**', 'ansi')).toBe('\x1B[1mtesting\x1B[22m');
    });

    test('Find **bold bold** part', () => {
        expect(convertMarkdown('**testing string**', 'ansi')).toBe('\x1B[1mtesting string\x1B[22m');
    });

    test('Find ** single symbol', () => {
        expect(convertMarkdown('testing ** string', 'ansi')).toBe('testing ** string');
    });

    test('Find ** single symbol in others patterns', () => {
        expect(convertMarkdown('_**_', 'ansi')).toBe('\x1B[3m**\x1B[23m');
    });

    test('Find ** symbol in word snake_case', () => {
        expect(convertMarkdown('snake**case', 'ansi')).toBe('snake**case');
    });
});

describe('_italic_', () => {
    test('Find _italic_ part', () => {
        expect(convertMarkdown('_testing_', 'ansi')).toBe('\x1B[3mtesting\x1B[23m');
    });

    test('Find _italic italic_ part', () => {
        expect(convertMarkdown('_testing string_', 'ansi')).toBe('\x1B[3mtesting string\x1B[23m');
    });

    test('Find _ single symbol', () => {
        expect(convertMarkdown('testing _ string', 'ansi')).toBe('testing _ string');
    });

    test('Find _ single symbol in others patterns', () => {
        expect(convertMarkdown('`_`', 'ansi')).toBe('\x1B[7m_\x1B[27m');
    });

    test('Find _ symbol in word snake_case', () => {
        expect(convertMarkdown('snake_case', 'ansi')).toBe('snake_case');
    });
});

describe('`monospaced`', () => {
    test('Find `monospaced` part', () => {
        expect(convertMarkdown('`testing`', 'ansi')).toBe('\x1B[7mtesting\x1B[27m');
    });

    test('Find `monospaced monospaced` part', () => {
        expect(convertMarkdown('`testing string`', 'ansi')).toBe('\x1B[7mtesting string\x1B[27m');
    });

    test('Find ` single symbol', () => {
        expect(convertMarkdown('testing ` string', 'ansi')).toBe('testing ` string');
    });

    test('Find ` single symbol in others patterns', () => {
        expect(convertMarkdown('**`**', 'ansi')).toBe('\x1B[1m`\x1B[22m');
    });

    test('Find ` symbol in word snake_case', () => {
        expect(convertMarkdown('snake`case', 'ansi')).toBe('snake`case');
    });
});

describe('```preformatted```', () => {
    test('Find ```preformatted``` part', () => {
        expect(convertMarkdown('```\ntest\n```', 'ansi')).toBe('\x1B[7m\ntest\n\x1B[27m');
    });

    test('Find ```preformatted text``` part', () => {
        expect(convertMarkdown('```\ntest today\n```', 'ansi')).toBe('\x1B[7m\ntest today\n\x1B[27m');
    });

    test('Find ```preformatted strings``` part', () => {
        expect(convertMarkdown('```\ntest\n today all\nday\n```', 'ansi')).toBe('\x1B[7m\ntest\n today all\nday\n\x1B[27m');
    });

    test('Not interpret other tags inside', () => {
        expect(convertMarkdown('```\n**test**\n _today all`\n`day`\n```', 'ansi')).toBe('\x1B[7m\n**test**\n _today all`\n`day`\n\x1B[27m');
    });
});

describe('Errors', () => {
    test('Nested tags', () => {
        expect(() => convertMarkdown('_**testing**_', 'ansi')).toThrowError('\x1b[31mError:\x1b[0m Invalid Markdown nested tags.');
    });

    test('Unfinished tags', () => {
        expect(() => convertMarkdown('**testing string', 'ansi')).toThrowError('\x1b[31mError:\x1b[0m Invalid Markdown not finished tags.');
    });

    test('Unfinished tags and two strings', () => {
        const inputText = `**Testing this
        paragraph.`;
        expect(() => convertMarkdown(inputText, 'ansi')).toThrowError('\x1b[31mError:\x1b[0m Invalid Markdown not finished tags.');
    });
});

describe('HTML **bold**', () => {
    test('Find HTML **bold** part', () => {
        expect(convertMarkdown('**testing**', 'html')).toBe('<p><b>testing</b></p>');
    });
});
