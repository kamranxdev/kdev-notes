const fs = require('fs');
const path = require('path');

const inputFile = process.argv[2];
const outputFile = process.argv[3] || inputFile;

if (!inputFile) {
  console.log("Usage: node quiz-to-mdx.js <input.mdx> [output.mdx]");
  console.log("If output.mdx is omitted, the conversion is performed in-place.");
  process.exit(1);
}

if (!fs.existsSync(inputFile)) {
  console.error(`Error: File not found: ${inputFile}`);
  process.exit(1);
}

const content = fs.readFileSync(inputFile, 'utf8');
const lines = content.split(/\r?\n/);

function getOverlapScore(option, explanation) {
  const optClean = option.toLowerCase().replace(/[`*_\\]/g, '');
  const expClean = explanation.toLowerCase().replace(/[`*_\\]/g, '');
  const optWords = optClean.match(/\w+/g) || [];
  const expWords = new Set(expClean.match(/\w+/g) || []);
  if (optWords.length === 0) return 0;

  let overlapLength = 0;
  let optLength = 0;
  for (const word of optWords) {
    optLength += word.length;
    if (expWords.has(word)) {
      overlapLength += word.length;
    }
  }
  return overlapLength / optLength;
}

function parseFileQuestions(lines) {
  const anchors = [];
  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];
    const lStrip = line.trim();
    if (lStrip.includes('Show Answer') || lStrip.includes('Hide Answer')) {
      anchors.push({ idx, type: 'show_hide' });
    } else if (lStrip.startsWith('**Answer:') || lStrip.startsWith('Answer:')) {
      anchors.push({ idx, type: 'answer_prefix' });
    }
  }

  const questions = [];

  for (let idx = 0; idx < anchors.length; idx++) {
    const { idx: anchorIdx, type: anchorType } = anchors[idx];

    // Find 4 options above anchorIdx
    let currOptNum = 4;
    let k = anchorIdx - 1;
    const optionCandidates = [];
    let isNum = null;

    while (k >= 0 && optionCandidates.length < 4) {
      const l = lines[k].trim();
      if (!l) {
        k--;
        continue;
      }

      let matched = false;
      let val = "";

      const mNum = l.match(new RegExp(`^${currOptNum}\.\\s+(.*)$`));
      if (mNum) {
        if (isNum === false) break;
        isNum = true;
        val = mNum[1];
        matched = true;
      } else {
        const letter = String.fromCharCode(64 + currOptNum); // A, B, C, D
        const patterns = [
          new RegExp(`^\\*\\*${letter}\\)\\*\\*\\s*(.*)$`),
          new RegExp(`^\\*\\*${letter}\.?\\*\\*\\s*(.*)$`),
          new RegExp(`^${letter}\\)\\s*(.*)$`),
          new RegExp(`^${letter}\.\\s*(.*)$`),
          new RegExp(`^\\*\\*${letter}\\)\\s*(.*)$`),
        ];
        for (const p of patterns) {
          const m = l.match(p);
          if (m) {
            if (isNum === true) break;
            isNum = false;
            val = m[1];
            matched = true;
            break;
          }
        }
      }

      if (matched) {
        val = val.replace(/\\+$/, '').trim(); // strip trailing backslashes
        optionCandidates.unshift({ lineIdx: k, val });
        currOptNum--;
      } else {
        break;
      }
      k--;
    }

    const isMcq = optionCandidates.length === 4;
    if (!isMcq && anchorType === 'answer_prefix') {
      continue;
    }

    const firstOptIdx = isMcq ? optionCandidates[0].lineIdx : anchorIdx;
    const A_prev = idx > 0 ? anchors[idx - 1].idx : -1;

    // Find question text above firstOptIdx
    const qLines = [];
    let kScan = firstOptIdx - 1;
    let state = 0;
    let inCodeBlock = false;

    while (kScan > A_prev) {
      const l = lines[kScan];
      const lStrip = l.trim();

      if (lStrip.startsWith('###') || lStrip.startsWith('##') || lStrip.startsWith('<Callout') || lStrip.startsWith('</Callout')) {
        break;
      }

      if (lStrip.startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        qLines.unshift(l);
        state = 1;
        kScan--;
        continue;
      }

      if (inCodeBlock) {
        qLines.unshift(l);
        kScan--;
        continue;
      }

      if (!lStrip) {
        if (state === 1) {
          const prevLineStrip = lines[kScan + 1].trim();
          if (prevLineStrip && !prevLineStrip.startsWith('```') && !prevLineStrip.startsWith('`')) {
            break;
          }
        }
        qLines.unshift(l);
        kScan--;
        continue;
      }

      qLines.unshift(l);
      state = 1;
      kScan--;
    }

    while (qLines.length > 0 && !qLines[0].trim()) {
      qLines.shift();
    }
    while (qLines.length > 0 && !qLines[qLines.length - 1].trim()) {
      qLines.pop();
    }

    const questionText = qLines.join('\n').trim();
    const qStartLine = kScan + 1;

    questions.push({
      anchorIdx,
      anchorType,
      questionStart: qStartLine,
      isMcq,
      optionsData: optionCandidates,
      questionText,
    });
  }

  // Resolve explanations
  for (let idx = 0; idx < questions.length; idx++) {
    const q = questions[idx];
    const expStart = q.anchorIdx + 1;
    let limit = lines.length;
    if (idx + 1 < questions.length) {
      limit = questions[idx + 1].questionStart;
    }

    const expLines = [];
    let explanationEnd = expStart;
    for (let k = expStart; k < limit; k++) {
      const l = lines[k];
      const lStrip = l.trim();
      if (lStrip.startsWith('###') || lStrip.startsWith('##') || lStrip.startsWith('<Callout') || lStrip.startsWith('</Callout')) {
        explanationEnd = k;
        break;
      }
      expLines.push(l);
      explanationEnd = k + 1;
    }

    while (expLines.length > 0 && !expLines[0].trim()) {
      expLines.shift();
    }
    while (expLines.length > 0 && !expLines[expLines.length - 1].trim()) {
      expLines.pop();
    }

    const explanationText = expLines.join('\n').trim();
    q.explanationText = explanationText;
    q.explanationEnd = explanationEnd;

    if (q.isMcq) {
      let textToSearchForAns = "";
      if (q.anchorType === 'answer_prefix') {
        textToSearchForAns = lines[q.anchorIdx];
      } else {
        textToSearchForAns = expLines.slice(0, 3).join('\n');
      }

      let correctIdx = null;
      const mAns = textToSearchForAns.match(/(?:Answer|Ans):\s*\*?([A-D1-4])/i);
      if (mAns) {
        const ansChar = mAns[1].toUpperCase();
        if ('ABCD'.includes(ansChar)) {
          correctIdx = ansChar.charCodeAt(0) - 65;
        } else if ('1234'.includes(ansChar)) {
          correctIdx = parseInt(ansChar, 10) - 1;
        }
      }

      if (correctIdx === null) {
        const mLead = textToSearchForAns.trim().match(/^\**([A-D])\b/i);
        if (mLead) {
          correctIdx = mLead[1].toUpperCase().charCodeAt(0) - 65;
        }
      }

      if (correctIdx === null) {
        const firstLine = expLines.length > 0 ? expLines[0].trim() : "";
        const mOptChar = firstLine.match(/\b([A-D])\b(?:\s*is\s+correct|\s+option|\))/i);
        if (mOptChar) {
          correctIdx = mOptChar[1].toUpperCase().charCodeAt(0) - 65;
        }
      }

      // Fallback 1: Number match
      if (correctIdx === null) {
        const firstWord = explanationText.trim().match(/^\**(\d+)\b/);
        if (firstWord) {
          const numVal = firstWord[1];
          const matches = [];
          for (let oIdx = 0; oIdx < q.optionsData.length; oIdx++) {
            if (q.optionsData[oIdx].val.includes(numVal)) {
              matches.push(oIdx);
            }
          }
          if (matches.length === 1) {
            correctIdx = matches[0];
          }
        }
      }

      // Fallback 2: Overlap score
      if (correctIdx === null && explanationText) {
        const scores = [];
        for (let oIdx = 0; oIdx < q.optionsData.length; oIdx++) {
          const score = getOverlapScore(q.optionsData[oIdx].val, explanationText);
          scores.push({ score, idx: oIdx });
        }
        scores.sort((a, b) => b.score - a.score);
        if (scores[0].score > 0.25) {
          correctIdx = scores[0].idx;
        }
      }

      q.correctIdx = correctIdx;
    } else {
      q.correctIdx = null;
    }
  }

  return questions;
}

const questions = parseFileQuestions(lines);
if (questions.length === 0) {
  console.log(`No question blocks found in ${inputFile}.`);
  process.exit(0);
}

// Sort questions from bottom to top to handle string splicing offset issues
questions.sort((a, b) => b.questionStart - a.questionStart);

const newLines = [...lines];
for (const q of questions) {
  const repParts = [];
  if (q.isMcq) {
    const options = q.optionsData.map(o => o.val);
    const qProp = `question={${JSON.stringify(q.questionText)}}`;
    const optsProp = `options={${JSON.stringify(options)}}`;

    const ansVal = q.correctIdx !== null ? q.correctIdx : "null";
    const ansProp = `answerIndex={${ansVal}}`;

    repParts.push(`<Quiz ${qProp} ${optsProp} ${ansProp}>`);
  } else {
    const qProp = `question={${JSON.stringify(q.questionText)}}`;
    repParts.push(`<Quiz ${qProp}>`);
  }
  repParts.push(q.explanationText);
  repParts.push("</Quiz>");

  newLines.splice(q.questionStart, q.explanationEnd - q.questionStart, repParts.join('\n'));
}

const newContent = newLines.join('\n');
fs.writeFileSync(outputFile, newContent);

const isSame = (inputFile === outputFile);
console.log(`Successfully converted ${questions.length} questions in ${inputFile} ${isSame ? 'in-place!' : `and saved to ${outputFile}!`}`);
