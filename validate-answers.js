// Simple validator to check that each question's "Correct Answer: X)" matches
// one of the option letters (A-D) present in the same question block.
// No external dependencies. Run with: node validate-answers.js

const fs = require('fs');
const path = require('path');

function listHtmlFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name.toLowerCase() === 'archived') continue; // ignore archived backup
      files.push(...listHtmlFiles(p));
    } else if (e.isFile()) {
      const name = e.name.toLowerCase();
      if (name.startsWith('worksheet-') && name.endsWith('.html')) files.push(p);
      else if (name.startsWith('fault-scenario-') && name.endsWith('.html')) files.push(p);
    }
  }
  return files;
}

function extractQuestionBlocks(content) {
  const blocks = [];
  const re = /<div\s+class="question-item"[^>]*data-question="(\d+)"[^>]*>/gi;
  let match;
  const starts = [];
  while ((match = re.exec(content)) !== null) {
    starts.push({ index: match.index, qnum: match[1] });
  }
  for (let i = 0; i < starts.length; i++) {
    const start = starts[i].index;
    const end = i + 1 < starts.length ? starts[i + 1].index : content.length;
    const slice = content.slice(start, end);
    blocks.push({ qnum: starts[i].qnum, html: slice });
  }
  return blocks;
}

function extractOptionLetters(html) {
  // Look for visible letter prefix in option text like ">A) ..."
  const letters = new Set();
  const optionTextRegex = />\s*([A-D])\)\s*[^<]/g;
  let m;
  while ((m = optionTextRegex.exec(html)) !== null) {
    letters.add(m[1].toUpperCase());
  }
  // Also infer from radio values if they are letters A-D
  const valueLetterRegex = /name="question-\d+"\s+value="([A-D])"/gi;
  while ((m = valueLetterRegex.exec(html)) !== null) {
    letters.add(m[1].toUpperCase());
  }
  // If radios use 0/1/2/3, treat them as A/B/C/D
  const valueIndexRegex = /name="question-\d+"\s+value="([0-3])"/g;
  while ((m = valueIndexRegex.exec(html)) !== null) {
    const idx = parseInt(m[1], 10);
    const letter = String.fromCharCode('A'.charCodeAt(0) + idx);
    letters.add(letter);
  }
  return Array.from(letters);
}

function extractCorrectLetter(html) {
  const correctElRegex = /<div\s+class="correct-answer"[\s\S]*?<strong[^>]*>\s*Correct\s*Answer:\s*<\/strong>\s*([A-D])\)/i;
  const m = html.match(correctElRegex);
  if (m && m[1]) return m[1].toUpperCase();
  // Fallback: generic text parse
  const textRegex = /Correct\s*Answer:\s*([A-D])\)/i;
  const m2 = html.match(textRegex);
  return m2 && m2[1] ? m2[1].toUpperCase() : '';
}

function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const blocks = extractQuestionBlocks(content);
  const issues = [];
  for (const b of blocks) {
    const opts = extractOptionLetters(b.html);
    const correct = extractCorrectLetter(b.html);
    if (!correct) {
      issues.push({ q: b.qnum, type: 'missing-correct', detail: 'No correct letter found in block' });
      continue;
    }
    if (opts.length === 0) {
      issues.push({ q: b.qnum, type: 'no-options', detail: `Correct ${correct} but no options detected` });
      continue;
    }
    if (!opts.includes(correct)) {
      issues.push({ q: b.qnum, type: 'mismatch', detail: `Correct ${correct} not among options [${opts.join(', ')}]` });
    }
  }
  return issues;
}

function main() {
  const root = process.cwd();
  const files = listHtmlFiles(root);
  let totalIssues = 0;
  for (const f of files) {
    const issues = validateFile(f);
    if (issues.length > 0) {
      console.log(`\n${path.relative(root, f)}:`);
      for (const i of issues) {
        totalIssues++;
        console.log(`  Q${i.q}: ${i.type} - ${i.detail}`);
      }
    }
  }
  if (totalIssues === 0) {
    console.log('All questions validated: correct answers match available options.');
    process.exit(0);
  } else {
    console.log(`\nValidation completed with ${totalIssues} issue(s).`);
    process.exit(1);
  }
}

main();


