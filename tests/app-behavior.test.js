const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function storage(seed = {}) {
  const values = new Map(Object.entries(seed));
  return {
    getItem: key => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key),
    snapshot: () => Object.fromEntries(values),
  };
}

function loadApp({ localSeed = {}, sessionSeed = {} } = {}) {
  const localStorage = storage(localSeed);
  const sessionStorage = storage(sessionSeed);
  const context = {
    window: {},
    document: {},
    localStorage,
    sessionStorage,
    console,
    Math,
    Date,
    JSON,
    URL,
    URLSearchParams,
  };
  vm.createContext(context);
  const code = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  vm.runInContext(code, context, { filename: 'app.js' });
  return { context, localStorage, sessionStorage };
}

test('legacy API key is removed from persistent storage', () => {
  const { context, localStorage } = loadApp({
    localSeed: { starlearn_api_key: 'must-not-persist' },
  });
  assert.equal(localStorage.getItem('starlearn_api_key'), null);
  assert.equal(vm.runInContext('state.apiKey', context), '');
});

test('result messages cover score boundaries', () => {
  const { context } = loadApp();
  const message = score => vm.runInContext(`getResultMessage(${score})`, context);
  assert.match(message(100), /Perfect score/);
  assert.match(message(80), /Amazing work/);
  assert.match(message(60), /Good job/);
  assert.match(message(40), /Nice try/);
  assert.match(message(39), /Keep practising/);
});

test('best score never regresses', () => {
  const { context, localStorage } = loadApp();
  vm.runInContext("saveScore('maths', 'maths_fractions', 80)", context);
  vm.runInContext("saveScore('maths', 'maths_fractions', 55)", context);
  const scores = JSON.parse(localStorage.getItem('starlearn_scores'));
  assert.equal(scores.maths.maths_fractions, 80);
});

test('attempt history is capped at 250 recent records', () => {
  const old = Array.from({ length: 20 }, (_, i) => ({
    subjectKey: 'maths', topicName: `old-${i}`, pct: 50, total: 10,
    date: new Date(0).toISOString(),
  }));
  const recent = Array.from({ length: 260 }, (_, i) => ({
    subjectKey: 'maths', topicName: `recent-${i}`, pct: 70, total: 10,
    date: new Date().toISOString(),
  }));
  const { context, localStorage } = loadApp({
    localSeed: { starlearn_attempts: JSON.stringify([...old, ...recent]) },
  });
  vm.runInContext("saveAttempt('science', 'plants', 90, 10)", context);
  const attempts = JSON.parse(localStorage.getItem('starlearn_attempts'));
  assert.equal(attempts.length, 250);
  assert.equal(attempts.at(-1).topicName, 'plants');
  assert.ok(attempts.every(item => !item.topicName.startsWith('old-')));
});

test('AI hint failures show a safe recovery message and restore the button', async () => {
  const { context } = loadApp();
  const elements = {
    'hint-btn': { disabled: false, textContent: '' },
    'hint-area': { innerHTML: '' },
  };
  context.document = { getElementById: id => elements[id] };
  context.fetch = async () => { throw new Error('offline'); };
  vm.runInContext(`
    state.apiKey = 'session-only-key';
    state.subject = 'english';
    state.questions = [{ q: 'Which word?', hint_topic: 'word choice' }];
    state.currentQ = 0;
  `, context);
  await vm.runInContext('getHint()', context);
  assert.match(elements['hint-area'].innerHTML, /Couldn't load hint/);
  assert.equal(elements['hint-btn'].disabled, false);
  assert.equal(elements['hint-btn'].textContent, '💡 Get a Hint');
});

test('service worker registration and lifecycle handlers remain wired', () => {
  const index = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const worker = fs.readFileSync(path.join(__dirname, '..', 'sw.js'), 'utf8');
  assert.match(index, /serviceWorker\.register\(['"]\/starlearn\/sw\.js['"]\)/);
  assert.match(worker, /addEventListener\(['"]install['"]/);
  assert.match(worker, /addEventListener\(['"]fetch['"]/);
});
