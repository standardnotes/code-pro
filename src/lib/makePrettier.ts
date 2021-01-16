/** Prettier */
import prettier from 'prettier';
import parserBabel from 'prettier/parser-babel';
import parserCss from 'prettier/parser-postcss';
import parserGraphql from 'prettier/parser-graphql';
import parserHtml from 'prettier/parser-html';
import parserMarkdown from 'prettier/parser-markdown';
import parserTypescript from 'prettier/parser-typescript';
import parserYaml from 'prettier/parser-yaml';

/** Make Prettier */
export const makePrettier = (language: string, text: string) => {
  try {
    if (language === 'css') {
      const formattedText = prettier.format(text, {
        parser: 'css',
        plugins: [parserCss],
      });
      return formattedText;
    } else if (language === 'graphql') {
      const formattedText = prettier.format(text, {
        parser: 'graphql',
        plugins: [parserGraphql],
      });
      return formattedText;
    } else if (language === 'markdown') {
      const formattedText = prettier.format(text, {
        parser: 'markdown',
        plugins: [parserMarkdown],
      });
      return formattedText;
    } else if (language === 'html') {
      const formattedText = prettier.format(text, {
        parser: 'html',
        plugins: [parserHtml],
      });
      return formattedText;
    } else if (language === 'javascript') {
      const formattedText = prettier.format(text, {
        parser: 'babel',
        plugins: [parserBabel],
      });
      return formattedText;
    } else if (language === 'less') {
      const formattedText = prettier.format(text, {
        parser: 'less',
        plugins: [parserCss],
      });
      return formattedText;
    } else if (language === 'typescript') {
      const formattedText = prettier.format(text, {
        parser: 'typescript',
        plugins: [parserTypescript],
      });
      return formattedText;
    } else if (language === 'scss') {
      const formattedText = prettier.format(text, {
        parser: 'scss',
        plugins: [parserCss],
      });
      return formattedText;
    } else if (language === 'yaml') {
      const formattedText = prettier.format(text, {
        parser: 'yaml',
        plugins: [parserYaml],
      });
      return formattedText;
    }
  } catch (error) {
    console.error('Error formatting code:', error);
  }
};
