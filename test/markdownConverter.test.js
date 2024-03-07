const  { convertMarkdownToHTML } = require('../src/markdownConverter');

describe('paragraph', () => {
    test('Wrap paragraph with one string', () => {
        expect(convertMarkdownToHTML('It\'s testing words.')).toBe('<p>It\'s testing words.</p>');
    });

    test('Wrap paragraph with several strings', () => {
        const inputText = `Testing this
        sentence.`;
        const outputResult = `<p>Testing this
        sentence.</p>`;
        expect(convertMarkdownToHTML(inputText)).toBe(outputResult);
    });

    test('Wrap several paragraphs', () => {
        const inputText = `Testing this
        paragraph.

Also testing this too.

And this.`;
        const outputResult = `<p>Testing this
        paragraph.</p>
<p>Also testing this too.</p>
<p>And this.</p>`;
        expect(convertMarkdownToHTML(inputText)).toBe(outputResult);
    });
});

describe('**bold**', () => {
    test('Find **bold** part', () => {
        expect(convertMarkdownToHTML('**testing**')).toBe('<p><b>testing</b></p>');
    });

    test('Find **bold bold** part', () => {
        expect(convertMarkdownToHTML('**testing string**')).toBe('<p><b>testing string</b></p>');
    });

    test('Find ** single symbol', () => {
        expect(convertMarkdownToHTML('testing ** string')).toBe('<p>testing ** string</p>');
    });

    test('Find ** single symbol in others patterns', () => {
        expect(convertMarkdownToHTML('_**_')).toBe('<p><i>**</i></p>');
    });

    test('Find ** symbol in word snake_case', () => {
        expect(convertMarkdownToHTML('snake**case')).toBe('<p>snake**case</p>');
    });
});

describe('_italic_', () => {
    test('Find _italic_ part', () => {
        expect(convertMarkdownToHTML('_testing_')).toBe('<p><i>testing</i></p>');
    });

    test('Find _italic italic_ part', () => {
        expect(convertMarkdownToHTML('_testing string_')).toBe('<p><i>testing string</i></p>');
    });

    test('Find _ single symbol', () => {
        expect(convertMarkdownToHTML('testing _ string')).toBe('<p>testing _ string</p>');
    });

    test('Find _ single symbol in others patterns', () => {
        expect(convertMarkdownToHTML('`_`')).toBe('<p><tt>_</tt></p>');
    });

    test('Find _ symbol in word snake_case', () => {
        expect(convertMarkdownToHTML('snake_case')).toBe('<p>snake_case</p>');
    });
});

describe('`monospaced`', () => {
    test('Find `monospaced` part', () => {
        expect(convertMarkdownToHTML('`testing`')).toBe('<p><tt>testing</tt></p>');
    });

    test('Find `monospaced monospaced` part', () => {
        expect(convertMarkdownToHTML('`testing string`')).toBe('<p><tt>testing string</tt></p>');
    });

    test('Find ` single symbol', () => {
        expect(convertMarkdownToHTML('testing ` string')).toBe('<p>testing ` string</p>');
    });

    test('Find ` single symbol in others patterns', () => {
        expect(convertMarkdownToHTML('**`**')).toBe('<p><b>`</b></p>');
    });

    test('Find ` symbol in word snake_case', () => {
        expect(convertMarkdownToHTML('snake`case')).toBe('<p>snake`case</p>');
    });
});

describe('```preformatted```', () => {
    test('Find ```preformatted``` part', () => {
        expect(convertMarkdownToHTML('```\ntest\n```')).toBe('<p>\n<pre>\ntest\n</pre>\n</p>');
    });

    test('Find ```preformatted text``` part', () => {
        expect(convertMarkdownToHTML('```\ntest today\n```')).toBe('<p>\n<pre>\ntest today\n</pre>\n</p>');
    });

    test('Find ```preformatted strings``` part', () => {
        expect(convertMarkdownToHTML('```\ntest\n today all\nday\n```')).toBe('<p>\n<pre>\ntest\n today all\nday\n</pre>\n</p>');
    });

    test('Not interpret other tags inside', () => {
        expect(convertMarkdownToHTML('```\n**test**\n _today all`\n`day`\n```')).toBe('<p>\n<pre>\n**test**\n _today all`\n`day`\n</pre>\n</p>');
    });
});

describe('Errors', () => {
    test('Nested tags', () => {
        expect(() => convertMarkdownToHTML('_**testing**_')).toThrowError('\x1b[31mError:\x1b[0m Invalid Markdown nested tags.');
    });

    test('Unfinished tags', () => {
        expect(() => convertMarkdownToHTML('**testing string')).toThrowError('\x1b[31mError:\x1b[0m Invalid Markdown not finished tags.');
    });

    test('Unfinished tags and two strings', () => {
        const inputText = `**Testing this
        paragraph.`;
        expect(() => convertMarkdownToHTML(inputText)).toThrowError('\x1b[31mError:\x1b[0m Invalid Markdown not finished tags.');
    });
});
