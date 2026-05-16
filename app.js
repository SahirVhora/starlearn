// StarLearn App Logic
const GROK_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

let currentMode = localStorage.getItem('starlearn_mode') || 'starlearn';
const STARLEARN_SUBJECTS = ['maths', 'english', 'science'];
const ELEVENPLUS_SUBJECTS = ['maths11', 'english11', 'verbal', 'nonverbal'];

function setMode(mode) {
  currentMode = mode;
  localStorage.setItem('starlearn_mode', mode);
  document.getElementById('btn-starlearn').classList.toggle('active', mode === 'starlearn');
  document.getElementById('btn-11plus').classList.toggle('active', mode === '11plus');
  document.body.classList.toggle('mode-11plus', mode === '11plus');
  document.querySelector('.header-logo').innerHTML = mode === '11plus' ? '<span>🎓</span> 11+ Prep' : '<span>⭐</span> StarLearn';
  document.title = mode === '11plus' ? '11+ Prep - Free Grammar School Practice' : 'StarLearn ⭐ - Year 4-6 Learning Platform';
  goHome();
}

const FREE_MODELS = [
  { id: 'meta-llama/llama-3.1-8b-instruct:free',  label: 'Llama 3.1 8B - Fast & Free' },
  { id: 'meta-llama/llama-3.3-70b-instruct:free', label: 'Llama 3.3 70B - Smarter, Free' },
  { id: 'google/gemma-3-27b-it:free',             label: 'Google Gemma 3 27B - Free' },
  { id: 'mistralai/mistral-7b-instruct:free',      label: 'Mistral 7B - Fast & Free' },
  { id: 'deepseek/deepseek-r1-0528:free',          label: 'DeepSeek R1 - Reasoning, Free' },
  { id: 'qwen/qwen3-8b:free',                      label: 'Qwen 3 8B - Free' },
];

let state = {
  screen: 'home',
  subject: null,
  topic: null,
  questions: [],
  currentQ: 0,
  score: 0,
  answered: false,
  apiKey: localStorage.getItem('starlearn_api_key') || '',
  model: localStorage.getItem('starlearn_model') || FREE_MODELS[0].id
};

// ─── Navigation ───────────────────────────────────────────────────────────────

function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(`screen-${name}`).classList.add('active');
  state.screen = name;
}

function goHome() {
  state.subject = null;
  state.topic = null;
  showScreen('home');
  renderHome();
}

function selectSubject(key) {
  state.subject = key;
  showScreen('topics');
  renderTopics();
}

async function selectTopic(topicIndex) {
  const subjectData = QUESTIONS[state.subject];
  state.topic = subjectData.topics[topicIndex];
  state.topicIndex = topicIndex;

  // Show loading indicator on the clicked topic button
  const topicBtns = document.querySelectorAll('.topic-btn');
  const clickedBtn = topicBtns[topicIndex];
  const originalHTML = clickedBtn ? clickedBtn.innerHTML : null;
  if (clickedBtn) clickedBtn.textContent = '⏳ Loading...';

  let questions = null;
  try {
    questions = await fetchOTDBQuestions(state.topic.name, state.subject);
  } catch (e) {
    questions = null;
  }

  // Restore button text
  if (clickedBtn && originalHTML !== null) clickedBtn.innerHTML = originalHTML;

  if (questions && questions.length >= 5) {
    state.questions = shuffle(questions);
    state.questionsSource = 'otd';
  } else {
    state.questions = shuffle([...state.topic.questions]);
    state.questionsSource = 'builtin';
  }

  state.currentQ = 0;
  state.score = 0;
  state.answered = false;
  showScreen('quiz');
  renderQuestion();
}

// ─── Rendering ────────────────────────────────────────────────────────────────

function renderHome() {
  const container = document.getElementById('subject-cards');
  container.innerHTML = '';
  const activeSubjects = currentMode === '11plus' ? ELEVENPLUS_SUBJECTS : STARLEARN_SUBJECTS;
  Object.entries(QUESTIONS).filter(([key]) => activeSubjects.includes(key)).forEach(([key, subj]) => {
    const card = document.createElement('div');
    card.className = 'subject-card';
    card.style.background = subj.color;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('onkeydown', "if(event.key==='Enter'||event.key===' '){this.click()}");
    card.onclick = () => selectSubject(key);

    const best = getBestScore(key);
    const bestLabel = best !== null ? `<div class="best-score">Best: ${best}%</div>` : '';

    card.innerHTML = `
      <div class="subject-icon">${subj.icon}</div>
      <div class="subject-name">${subj.label}</div>
      ${bestLabel}
    `;
    container.appendChild(card);
  });
}

function renderTopics() {
  const subj = QUESTIONS[state.subject];
  document.getElementById('topics-title').textContent = `${subj.icon} ${subj.label}`;
  document.getElementById('topics-color').style.background = subj.color;

  const container = document.getElementById('topic-list');
  container.innerHTML = '';
  subj.topics.forEach((topic, i) => {
    const btn = document.createElement('button');
    btn.className = 'topic-btn';
    btn.style.borderColor = subj.color;
    btn.style.color = subj.color;
    const best = getTopicBest(state.subject, i);
    const badge = best !== null ? `<span class="topic-badge" style="background:${subj.color}">${best}%</span>` : '';
    btn.innerHTML = `${topic.name} ${badge}`;
    btn.onclick = () => selectTopic(i);
    container.appendChild(btn);
  });
}

function renderQuestion() {
  const subj = QUESTIONS[state.subject];
  const q = state.questions[state.currentQ];
  const total = state.questions.length;
  const progress = ((state.currentQ + 1) / total) * 100;

  document.getElementById('quiz-header-color').style.background = subj.color;
  document.getElementById('quiz-subject-label').textContent = `${subj.icon} ${subj.label} - ${state.topic.name}`;
  const progressBar = document.getElementById('quiz-progress-bar');
  progressBar.style.width = progress + '%';
  progressBar.setAttribute('aria-valuenow', Math.round(progress));
  progressBar.style.background = subj.color;
  document.getElementById('quiz-counter').textContent = `Question ${state.currentQ + 1} of ${total}`;
  document.getElementById('quiz-score').textContent = `Score: ${state.score}/${state.currentQ + 1}`;
  document.getElementById('quiz-source').textContent = state.questionsSource === 'otd' ? '✨ Fresh questions' : '📚 Practice set';
  document.getElementById('question-text').textContent = q.q;

  const optContainer = document.getElementById('options-container');
  optContainer.innerHTML = '';
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt;
    btn.onclick = () => answerQuestion(i, btn, subj.color);
    optContainer.appendChild(btn);
  });

  document.getElementById('hint-area').innerHTML = '';
  document.getElementById('hint-btn').style.display = 'none';
  document.getElementById('next-btn').style.display = 'none';
  document.getElementById('hint-btn').style.background = subj.color;
  document.getElementById('next-btn').style.background = subj.color;
  state.answered = false;
}

function answerQuestion(selected, btn, color) {
  if (state.answered) return;
  state.answered = true;

  const q = state.questions[state.currentQ];
  const allBtns = document.querySelectorAll('.option-btn');

  allBtns.forEach((b, i) => {
    b.disabled = true;
    if (i === q.answer) {
      b.classList.add('correct');
    } else if (i === selected && selected !== q.answer) {
      b.classList.add('wrong');
    }
  });

  if (selected === q.answer) {
    state.score++;
    showFeedback('✅ Correct! Well done!', true);
  } else {
    showFeedback(`❌ Not quite! The correct answer was: "${q.options[q.answer]}"`, false);
  }

  document.getElementById('next-btn').style.display = 'inline-flex';
  document.getElementById('hint-btn').style.display = 'inline-flex';
}

function showFeedback(msg, correct) {
  const fb = document.getElementById('feedback-msg');
  fb.textContent = msg;
  fb.className = 'feedback ' + (correct ? 'feedback-correct' : 'feedback-wrong');
}

function nextQuestion() {
  state.currentQ++;
  if (state.currentQ >= state.questions.length) {
    showResults();
  } else {
    document.getElementById('feedback-msg').textContent = '';
    document.getElementById('feedback-msg').className = 'feedback';
    renderQuestion();
  }
}

function showResults() {
  const subj = QUESTIONS[state.subject];
  const total = state.questions.length;
  const pct = Math.round((state.score / total) * 100);

  // Save score
  saveScore(state.subject, state.subject + '_' + state.topic.name, pct);

  document.getElementById('result-icon').textContent = subj.icon;
  document.getElementById('result-score').textContent = `${state.score} / ${total}`;
  document.getElementById('result-pct').textContent = `${pct}%`;
  document.getElementById('result-pct').style.color = subj.color;
  document.getElementById('result-msg').textContent = getResultMessage(pct);
  document.getElementById('result-retry').style.background = subj.color;
  document.getElementById('result-home').style.background = subj.color;
  showScreen('results');
}

function getResultMessage(pct) {
  if (pct === 100) return '🌟 Perfect score! You are a star!';
  if (pct >= 80) return '🎉 Amazing work! Keep it up!';
  if (pct >= 60) return '👍 Good job! A bit more practice and you\'ll ace it!';
  if (pct >= 40) return '💪 Nice try! Review the topic and try again!';
  return '📖 Keep practising - you\'ll get there!';
}

function retryTopic() {
  selectTopic(state.topicIndex);
}

// ─── AI Hint ─────────────────────────────────────────────────────────────────

// Helper: decode HTML entities from OTD API responses
function decodeHTML(str) {
  const ta = document.createElement('textarea');
  ta.innerHTML = str;
  return ta.textContent;
}

// Fetch questions from Open Trivia Database
async function fetchOTDBQuestions(topicName, subjectKey) {
  // OTD category IDs: 9=General Knowledge, 10=Books, 17=Science, 19=Maths
  const categoryMap = { maths: 19, science: 17, english: 9 };
  const catId = categoryMap[subjectKey];
  if (!catId) return null;

  const url = `https://opentdb.com/api.php?amount=8&type=multiple&category=${catId}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.results || data.results.length === 0) return null;

    return data.results.map(item => {
      const correct = decodeHTML(item.correct_answer);
      const allOptions = shuffle([correct, ...item.incorrect_answers.map(decodeHTML)]);
      return {
        q: decodeHTML(item.question),
        options: allOptions,
        answer: allOptions.indexOf(correct),
        hint_topic: topicName
      };
    });
  } catch (e) {
    console.warn('OTD fetch failed, using built-in questions:', e.message);
    return null;
  }
}

// Fetch a math number fact from Numbers API
async function fetchNumberFact(n) {
  // Try direct HTTPS first (numbersapi.com supports CORS on HTTPS)
  try {
    const res = await fetch(`https://numbersapi.com/${n}/math`);
    if (res.ok) return await res.text();
  } catch (e) { /* fall through to proxy */ }

  // Fallback CORS proxy for browsers that block the request
  try {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(`http://numbersapi.com/${n}/math`)}`;
    const res = await fetch(proxyUrl);
    if (res.ok) return await res.text();
  } catch (e) { /* fall through */ }

  return null;
}

async function getHint() {
  const q = state.questions[state.currentQ];
  const isMaths = state.subject === 'maths';
  const questionText = q.q;

  const btn = document.getElementById('hint-btn');
  btn.disabled = true;
  btn.textContent = '⏳ Thinking...';

  const hintArea = document.getElementById('hint-area');
  hintArea.innerHTML = '<div class="hint-loading">Your AI tutor is thinking...</div>';

  // For maths: fetch a number fact in parallel
  let numberFactPromise = null;
  if (isMaths) {
    const numMatch = /\d+/.exec(questionText);
    if (numMatch) {
      numberFactPromise = fetchNumberFact(numMatch[0]);
    }
  }

  // If no API key and it's maths, just show number fact
  if (!state.apiKey) {
    if (isMaths && numberFactPromise) {
      const fact = await numberFactPromise;
      if (fact) {
        hintArea.innerHTML = `<div class="hint-box">🔢 <strong>Fun fact:</strong> ${fact}</div>`;
      } else {
        hintArea.innerHTML = `<div class="hint-error">⚠️ No hint available. Add an API key in Settings for AI hints.</div>`;
      }
    } else {
      openSettings();
      btn.disabled = false;
      btn.textContent = '💡 Get a Hint';
      return;
    }
    btn.disabled = false;
    btn.textContent = '💡 Get a Hint';
    return;
  }

  try {
    const prompt = `You are a friendly, encouraging teacher for Year 4 UK primary school students (age 8-9).
Explain the concept of "${q.hint_topic}" in simple, easy words a child can understand.
Keep it to 3-4 short sentences. Use an example if helpful. Be warm and encouraging. Do not give the answer directly.`;

    const [res, numberFact] = await Promise.all([
      fetch(GROK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.apiKey}`,
          'HTTP-Referer': 'https://sahirvhora.github.io/starlearn',
          'X-Title': 'StarLearn'
        },
        body: JSON.stringify({
          model: state.model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 200
        })
      }),
      numberFactPromise || Promise.resolve(null)
    ]);

    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    const hint = data.choices[0].message.content;

    let hintHTML = '';
    if (isMaths && numberFact) {
      hintHTML += `<div class="hint-box">🔢 <strong>Fun fact:</strong> ${numberFact}</div>`;
    }
    hintHTML += `<div class="hint-box">💡 <strong>Hint from your tutor:</strong><br>${hint}</div>`;
    hintArea.innerHTML = hintHTML;
  } catch (e) {
    hintArea.innerHTML = `<div class="hint-error">⚠️ Couldn't load hint. Check your API key in Settings.</div>`;
  }

  btn.disabled = false;
  btn.textContent = '💡 Get a Hint';
}

// ─── Settings ────────────────────────────────────────────────────────────────

function openSettings() {
  document.getElementById('api-key-input').value = state.apiKey;
  // populate model dropdown
  const sel = document.getElementById('model-select');
  sel.innerHTML = '';
  FREE_MODELS.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m.id;
    opt.textContent = m.label;
    if (m.id === state.model) opt.selected = true;
    sel.appendChild(opt);
  });
  document.getElementById('settings-modal').classList.add('open');
  // Move focus to first focusable element
  const modal = document.querySelector('#settings-modal .modal');
  const firstFocusable = modal.querySelector('input, button, select, [tabindex]');
  if (firstFocusable) firstFocusable.focus();
  // Escape key listener
  document._settingsEscHandler = function(e) {
    if (e.key === 'Escape') closeSettings();
  };
  document.addEventListener('keydown', document._settingsEscHandler);
}

function closeSettings() {
  document.getElementById('settings-modal').classList.remove('open');
  // Remove escape listener
  if (document._settingsEscHandler) {
    document.removeEventListener('keydown', document._settingsEscHandler);
    document._settingsEscHandler = null;
  }
  // Return focus to settings trigger button
  const settingsBtn = document.querySelector('.header-btn[onclick="openSettings()"]');
  if (settingsBtn) settingsBtn.focus();
}

function saveSettings() {
  const key = document.getElementById('api-key-input').value.trim();
  const model = document.getElementById('model-select').value;
  state.apiKey = key;
  state.model = model;
  localStorage.setItem('starlearn_api_key', key);
  localStorage.setItem('starlearn_model', model);
  closeSettings();
}

// ─── Score Storage ────────────────────────────────────────────────────────────

function saveScore(subjectKey, topicKey, pct) {
  const scores = JSON.parse(localStorage.getItem('starlearn_scores') || '{}');
  if (!scores[subjectKey]) scores[subjectKey] = {};
  const prev = scores[subjectKey][topicKey] || 0;
  scores[subjectKey][topicKey] = Math.max(prev, pct);
  localStorage.setItem('starlearn_scores', JSON.stringify(scores));
}

function getBestScore(subjectKey) {
  const scores = JSON.parse(localStorage.getItem('starlearn_scores') || '{}');
  const subScores = scores[subjectKey];
  if (!subScores || Object.keys(subScores).length === 0) return null;
  const vals = Object.values(subScores);
  return Math.max(...vals);
}

function getTopicBest(subjectKey, topicIndex) {
  const scores = JSON.parse(localStorage.getItem('starlearn_scores') || '{}');
  const subScores = scores[subjectKey];
  if (!subScores) return null;
  const topic = QUESTIONS[subjectKey].topics[topicIndex];
  const key = subjectKey + '_' + topic.name;
  return subScores[key] !== undefined ? subScores[key] : null;
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ─── Init ────────────────────────────────────────────────────────────────────

window.onload = () => {
  // Restore saved mode
  if (currentMode === '11plus') {
    document.body.classList.add('mode-11plus');
    document.getElementById('btn-11plus').classList.add('active');
    document.getElementById('btn-starlearn').classList.remove('active');
    document.querySelector('.header-logo').innerHTML = '<span>🎓</span> 11+ Prep';
    document.title = '11+ Prep - Free Grammar School Practice';
  }
  renderHome();
  showScreen('home');
};
