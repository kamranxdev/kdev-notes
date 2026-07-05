const fs = require('fs');
const TurndownService = require('turndown');
const turndownPluginGfm = require('turndown-plugin-gfm');

const gfm = turndownPluginGfm.gfm;

const inputFile = process.argv[2];
const outputFile = process.argv[3] || inputFile.replace('.html', '.mdx');

if (!inputFile) {
  console.error("Usage: node html-to-mdx.js <input.html> [output.mdx]");
  process.exit(1);
}

const html = fs.readFileSync(inputFile, 'utf8');

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced'
});

const originalEscape = turndownService.escape;
turndownService.escape = function (string) {
  let escaped = originalEscape(string);
  // Escape { and } to prevent MDX expression evaluation errors outside code blocks
  escaped = escaped.replace(/\{/g, '\\{').replace(/\}/g, '\\}');
  // Escape < and > to prevent JSX parsing errors
  escaped = escaped.replace(/</g, '\\<').replace(/>/g, '\\>');
  return escaped;
};

// Enable GFM plugin (tables, strikethrough, taskListItems)
turndownService.use(gfm);

turndownService.addRule('pre', {
  filter: 'pre',
  replacement: function (content, node) {
    return '\n```java\n' + node.textContent + '\n```\n';
  }
});

turndownService.addRule('box', {
  filter: function (node, options) {
    return node.nodeName === 'DIV' && node.className.includes('box');
  },
  replacement: function (content, node, options) {
    let type = 'info';
    if (node.className.includes('box-exam')) type = 'warn';
    else if (node.className.includes('box-warn')) type = 'error';
    
    let title = '';
    const labelNode = node.querySelector('.label');
    if (labelNode) {
       title = labelNode.textContent.trim();
    }

    if (title) {
        return `\n<Callout type="${type}" title="${title}">\n${content}\n</Callout>\n\n`;
    }
    return `\n<Callout type="${type}">\n${content}\n</Callout>\n\n`;
  }
});

turndownService.addRule('label', {
  filter: function (node) {
    return node.nodeName === 'DIV' && node.className.includes('label');
  },
  replacement: function (content) {
    return '';
  }
});

let markdown = turndownService.turndown(html);

// Cleanup unwanted escaping
markdown = markdown.replace(/\\==/g, '==');
markdown = markdown.replace(/\\\*/g, '*');

// Attempt to extract title from the first heading
let titleMatch = markdown.match(/^## (.*)$/m);
let docTitle = titleMatch ? titleMatch[1] : 'Document';

let output = `---
title: ${docTitle}
description: Generated MDX Guide
---

import { Callout } from 'fumadocs-ui/components/callout';

${markdown}
`;

fs.writeFileSync(outputFile, output);
console.log(`Successfully converted ${inputFile} to ${outputFile}!`);
