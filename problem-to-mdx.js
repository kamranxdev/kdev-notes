const fs = require('fs');
const path = require('path');

const inputFile = process.argv[2];
const outputFile = process.argv[3] || inputFile;

if (!inputFile) {
  console.log("Usage: node problem-to-mdx.js <input.mdx> [output.mdx]");
  console.log("If output.mdx is omitted, the conversion is performed in-place.");
  process.exit(1);
}

if (!fs.existsSync(inputFile)) {
  console.error(`Error: File not found: ${inputFile}`);
  process.exit(1);
}

const content = fs.readFileSync(inputFile, 'utf8');
const lines = content.split(/\r?\n/);

// Find headings of the form "### [digits]. Practice Question..."
const questionBlocks = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const match = line.match(/^###\s+(?:(\d+\.)\s+)?(Practice (?:Question|Walkthrough).*)$/i);
  if (match) {
    const headingPrefixNum = match[1] || ''; // e.g. "29."
    const headingTitleText = match[2].trim(); // e.g. "Practice Question — Full Walkthrough"
    
    // Find next ### heading or end of file
    let nextHeadingIdx = lines.length;
    for (let j = i + 1; j < lines.length; j++) {
      if (lines[j].startsWith('### ')) {
        nextHeadingIdx = j;
        break;
      }
    }

    // Look for Callout inside this range
    let calloutStartIdx = -1;
    let calloutEndIdx = -1;
    for (let j = i + 1; j < nextHeadingIdx; j++) {
      if (lines[j].includes('<Callout type="warn" title="Full Problem Statement">') || 
          lines[j].includes('<Callout type="warn" title="Problem:')) {
        calloutStartIdx = j;
      } else if (calloutStartIdx !== -1 && lines[j].includes('</Callout>')) {
        calloutEndIdx = j;
        break;
      }
    }

    if (calloutStartIdx !== -1 && calloutEndIdx !== -1) {
      questionBlocks.push({
        headingLineIdx: i,
        headingLine: line,
        cleanTitle: headingTitleText,
        calloutStartIdx,
        calloutEndIdx,
        nextHeadingIdx,
      });
    }
  }
}

if (questionBlocks.length === 0) {
  console.log(`No matching Practice Question blocks found in ${inputFile}.`);
  process.exit(0);
}

function convertHeadingsToBold(linesArray) {
  let inCodeBlock = false;
  return linesArray.map(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      return line;
    }
    if (inCodeBlock) {
      return line;
    }
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      const headingText = headingMatch[2].trim();
      return `**${headingText}**`;
    }
    return line;
  });
}

// Process question blocks from bottom to top to preserve index offsets
questionBlocks.sort((a, b) => b.headingLineIdx - a.headingLineIdx);

const newLines = [...lines];

for (const block of questionBlocks) {
  const introLines = lines.slice(block.headingLineIdx + 1, block.calloutStartIdx);
  const descLines = lines.slice(block.calloutStartIdx + 1, block.calloutEndIdx);
  const solnLines = lines.slice(block.calloutEndIdx + 1, block.nextHeadingIdx);

  const cleanedIntroLines = convertHeadingsToBold(introLines);
  const cleanedDescLines = convertHeadingsToBold(descLines);
  const cleanedSolnLines = convertHeadingsToBold(solnLines);

  // Clean up any extra empty lines at boundaries
  const introText = cleanedIntroLines.join('\n').trim();
  const descText = cleanedDescLines.join('\n').trim();
  const solnText = cleanedSolnLines.join('\n').trim();

  // Replace from headingLineIdx down to nextHeadingIdx with our single formatted string
  // Note: We keep the original heading outside the Problem block
  newLines.splice(
    block.headingLineIdx,
    block.nextHeadingIdx - block.headingLineIdx,
    block.headingLine + '\n\n' + [
      `<Problem title="${block.cleanTitle}">`,
      '<ProblemDescription>',
      introText ? introText : '',
      descText,
      '</ProblemDescription>',
      '<ProblemSolution>',
      solnText,
      '</ProblemSolution>',
      '</Problem>'
    ].filter(line => line !== '').join('\n')
  );
}

const newContent = newLines.join('\n');
fs.writeFileSync(outputFile, newContent);

const isSame = (inputFile === outputFile);
console.log(`Successfully converted ${questionBlocks.length} practice questions in ${inputFile} ${isSame ? 'in-place!' : `and saved to ${outputFile}!`}`);
