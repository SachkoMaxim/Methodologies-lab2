# Impoved Markdown-to-HTML|ANSI text Convertor

## Short description

This program was created by Maksym Sachko, group IM-22, FICE, KPI. This is a simple text converter from Markdown text to HTML or ANSI text. 
The program can convert some Markdown tags to HTML tags or ANSI escape codes, such as bold, italic, monospaced, preformat, and paragraph tags. 
It can also detect invalid markup and find nested tags, save the output data to a .html or .txt file, or output that data to stdout.

## How to run

> **NOTE:** Markdown-to-HTML|ANSI convertor is made with **node.js** you need install [Node.js](https://nodejs.org/en/download) to run the program
1. You need to clone this repository from GitHub before running the program. Select the folder you want to clone the repository to, then type the command:
   ```bash
   git clone https://github.com/SachkoMaxim/Methodologies-lab2.git
   ```

2. Then navigate to the cloned repository folder:
   ```bash
   cd ../Methodologies-lab2
   ```

3. Install dependencies:
   ```bash
   npm i
   ```

4. Run main.js file:
   ```bash
   node main.js <file.md>
   ```

## How to use

Markdown-to-HTML|ANSI convertor has two modes: console mode and file mode.
> **NOTE:** Only Markdown files can be used as an **input file** for the program. If you use other file types, you will see an ERROR

### Console mode

To run the program in the console mode, just type this command in your terminal in the project folder (don't forget to pass the input file path into the arguments of the command):

```bash
node main.js </path/to/markdown.md>
```

After that, the converted text with ANSI tags will be displayed in stdout (if there was no mistakes, of course).

### File mode

To run the program in the file mode, you need to add **--out** and pass the output file path into the arguments of the previous command:
> **NOTE:** if you didn't write **--out** the converted text will be redirected to stdout

> **NOTE:** Only HTML or TXT files can be used as an **output file** for the program. If you use other file types, you will see an ERROR

```bash
node main.js </path/to/markdown.md> --out </path/to/file.html|txt>
```

After that, the converted text with HTML tags will be saved to a .html or .txt file you choosed as an output file (if there was no mistakes, of course).

### Format

You can specify the output text format using **--format=**. You can use one of these commands:
> **NOTE:** you can specify only two formats: **html** and **ansi**

```bash
node main.js </path/to/markdown.md> --format=<format>
```

```bash
node main.js </path/to/markdown.md> --out </path/to/file.html|txt> --format=<format>
```

```bash
node main.js </path/to/markdown.md> --format=<format> --out </path/to/file.html|txt>
```

#### INFO

1. If you do not specify format and do not using **--out** the output text will be **ANSI** as default and directed to stdout.
2. If you specify **--out**, but do not specify format the output text will be **HTML** as default and directed to specified file.

___

There are six example files in the examples folder for you to comfortably test the program.

## Run tests

This project has tests and you can run it by:
```bash
npm run test
```

## Lab section


### [Failed tests link](https://github.com/SachkoMaxim/Methodologies-lab2/commit/96dde5280ed2750ad5b3b84b4acdd0f4b7893f01)
### [Revert-commit link](https://github.com/SachkoMaxim/Methodologies-lab2/commit/9908728989d09874fa6a7d38fa9ffefb0ab80b6f)

___

## Conclusion

Використання unit-тестів виявилося дуже ефективним та цікавим у даній лабораторній роботі, тому що мені не потрібно було кожен раз запускати проєкт з нуля і робити перевірку за допомогою великої кількості тексту, який треба було писати кожен раз, щоб розуміти, чи працює та чи інша функція (або помилка). Можна запустити тести після зміни логіки функції\функцій однією командою і покриються віддразу всі випадки. Це дуже економить час та не вимагає такої концентрації, як при ручному вводі даних.

Багато хто вважатиме, що на написання тестів іде багато часу і це не вигідно, але в майбутньому, при розробці проєкту, ці тести зекономлять вам багато часу, бо перевірку уже не треба створювати.