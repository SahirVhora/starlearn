// Data smoke tests: every question bank entry must be well-formed,
// otherwise a quiz can render with no correct answer and silently break.
// Run with: node --test tests/
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// Top-level const in a vm script lives in the context's global lexical
// environment, not on the context object, so it must be exported explicitly.
function loadBank(files) {
  const context = {};
  vm.createContext(context);
  for (const file of files) {
    const code = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
    vm.runInContext(code, context, { filename: file });
  }
  const bank = vm.runInContext('QUESTIONS', context);
  assert.ok(bank, `${files.join(' + ')} must define QUESTIONS`);
  return bank;
}

function validateBank(bank, file) {
  for (const [subjectKey, subject] of Object.entries(bank)) {
    assert.ok(subject.label, `${file}: subject ${subjectKey} needs a label`);
    assert.ok(Array.isArray(subject.topics), `${file}: subject ${subjectKey} needs topics[]`);
    for (const topic of subject.topics) {
      assert.ok(topic.name, `${file}: topic in ${subjectKey} needs a name`);
      assert.ok(
        Array.isArray(topic.questions) && topic.questions.length > 0,
        `${file}: topic "${topic.name}" needs at least one question`
      );
      topic.questions.forEach((q, i) => {
        const where = `${file}: ${subjectKey} / ${topic.name} / question ${i + 1}`;
        assert.ok(typeof q.q === 'string' && q.q.trim(), `${where}: empty question text`);
        assert.ok(Array.isArray(q.options) && q.options.length >= 2, `${where}: needs 2+ options`);
        assert.ok(
          Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length,
          `${where}: answer index ${q.answer} out of range (0-${q.options.length - 1})`
        );
        const unique = new Set(q.options.map(o => String(o).trim()));
        assert.strictEqual(unique.size, q.options.length, `${where}: duplicate options`);
      });
    }
  }
}

test('questions.js bank is well-formed', () => {
  validateBank(loadBank(['questions.js']), 'questions.js');
});

// questions-11plus.js merges extra subjects into the QUESTIONS global from
// questions.js, so both files are loaded in page order into one context.
test('merged bank with questions-11plus.js is well-formed', () => {
  validateBank(
    loadBank(['questions.js', 'questions-11plus.js']),
    'questions.js + questions-11plus.js'
  );
});
