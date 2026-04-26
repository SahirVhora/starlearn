// StarLearn App Logic
const GROK_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const GROK_MODEL = 'meta-llama/llama-3.1-8b-instruct:free';

let state = {
  screen: 'home',
  subject: null,
  topic: null,
  questions: [],
  currentQ: 0,
  score: 0,
  answered: false,
  apiKey: localStorage.getItem('starlearn_api_key') || ''
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

function selectTopic(topicIndex) {
  const subjectData = QUESTIONS[state.subject];
  state.topic = subjectData.topics[topicIndex];
  state.questions = shuffle([...state.topic.questions]);
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
  Object.entries(QUESTIONS).forEach(([key, subj]) => {
    const card = document.createElement('div');
    card.className = 'subject-card';
    card.style.background = subj.color;
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
  const progress = ((state.currentQ) / total) * 100;

  document.getElementById('quiz-header-color').style.background = subj.color;
  document.getElementById('quiz-subject-label').textContent = `${subj.icon} ${subj.label} — ${state.topic.name}`;
  document.getElementById('quiz-progress-bar').style.width = progress + '%';
  document.getElementById('quiz-progress-bar').style.background = subj.color;
  document.getElementById('quiz-counter').textContent = `Question ${state.currentQ + 1} of ${total}`;
  document.getElementById('quiz-score').textContent = `Score: ${state.score}`;
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
  document.getElementById('hint-btn').style.display = 'inline-flex';
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
  return '📖 Keep practising — you\'ll get there!';
}

function retryTopic() {
  const topicIndex = QUESTIONS[state.subject].topics.indexOf(state.topic);
  selectTopic(topicIndex);
}

// ─── AI Hint ─────────────────────────────────────────────────────────────────

async function getHint() {
  if (!state.apiKey) {
    openSettings();
    return;
  }
  const q = state.questions[state.currentQ];
  const btn = document.getElementById('hint-btn');
  btn.disabled = true;
  btn.textContent = '⏳ Thinking...';

  const hintArea = document.getElementById('hint-area');
  hintArea.innerHTML = '<div class="hint-loading">Your AI tutor is thinking...</div>';

  try {
    const prompt = `You are a friendly, encouraging teacher for Year 4 UK primary school students (age 8-9). 
Explain the concept of "${q.hint_topic}" in simple, easy words a child can understand. 
Keep it to 3-4 short sentences. Use an example if helpful. Be warm and encouraging. Do not give the answer directly.`;

    const res = await fetch(GROK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.apiKey}`,
        'HTTP-Referer': 'https://sahirvhora.github.io/starlearn',
        'X-Title': 'StarLearn'
      },
      body: JSON.stringify({
        model: GROK_MODEL,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200
      })
    });

    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    const hint = data.choices[0].message.content;
    hintArea.innerHTML = `<div class="hint-box">💡 <strong>Hint from your tutor:</strong><br>${hint}</div>`;
  } catch (e) {
    hintArea.innerHTML = `<div class="hint-error">⚠️ Couldn't load hint. Check your API key in Settings.</div>`;
  }

  btn.disabled = false;
  btn.textContent = '💡 Get a Hint';
}

// ─── Settings ────────────────────────────────────────────────────────────────

function openSettings() {
  document.getElementById('api-key-input').value = state.apiKey;
  document.getElementById('settings-modal').classList.add('open');
}

function closeSettings() {
  document.getElementById('settings-modal').classList.remove('open');
}

function saveSettings() {
  const key = document.getElementById('api-key-input').value.trim();
  state.apiKey = key;
  localStorage.setItem('starlearn_api_key', key);
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
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
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
  renderHome();
  showScreen('home');
};
