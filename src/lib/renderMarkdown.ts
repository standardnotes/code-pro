import React, { ReactNode } from 'react';
import unified from 'unified';
import parse from 'remark-parse';
import remark2rehype from 'remark-rehype';
import rehype2react from 'rehype-react';
import { debounce } from 'lodash';

// Remark
const breaks = require('remark-breaks');
const externalLinks = require('remark-external-links');
const footnotes = require('remark-footnotes');
const gfm = require('remark-gfm');
const gemoji = require('remark-gemoji');
const math = require('remark-math');
const slug = require('remark-slug');
const toc = require('remark-toc');

// Rehype
const highlight = require('rehype-highlight');
const rehypeKatex = require('rehype-katex');
const raw = require('rehype-raw');

const processor = unified()
  .use(parse)
  .use(gfm)
  .use(breaks)
  .use(slug)
  .use(toc, { maxDepth: 6 })
  .use(externalLinks)
  .use(footnotes, { inlineNotes: true })
  .use(gemoji)
  .use(remark2rehype, { allowDangerousHtml: true })
  .use(raw)
  .use(math)
  .use(rehypeKatex)
  .use(highlight, { ignoreMissing: true })
  .use(rehype2react, { createElement: React.createElement });

export const processMarkdown = (text: string) => {
  //console.log('processedMarkdown');
  const markdown = processor.processSync(text).result as ReactNode;
  return markdown;
};

/** Debounce the rendering of markdown to prevent lag
 * when rendering long notes or lots of Markdown or KaTeX */
export const renderMarkdown = debounce((text: string): React.ReactNode => {
  //console.log('renderMarkdown', text.substring(0, 10));
  const markdown = processMarkdown(text);
  return markdown;
}, 500);

export const getCodeText = (language: string, text: string): string => {
  if (language !== 'markdown' && language !== 'html' && text) {
    return '```' + language + '\n' + text + '\n```';
  } else {
    return text;
  }
};
