# StarLearn

**Free UK primary school learning platform for Years 4-6. AI-powered hints, curriculum-aligned quizzes, and daily challenges — zero sign-up required.**

![Subjects](https://img.shields.io/badge/subjects-Maths%20%7C%20English%20%7C%20Science-blue) ![Questions](https://img.shields.io/badge/questions-60%2B-green) ![License](https://img.shields.io/badge/license-MIT-green)

Built for my daughter Misha (Year 4). StarLearn combines static curriculum questions with AI-generated hints and explanations via OpenRouter's free models. No accounts, no tracking, just learning.

👉 **[Launch StarLearn](https://sahirvhora.github.io/starlearn)**

## Features

| Feature | Detail |
|---|---|
| **3 Core Subjects** | Maths, English, Science — aligned to UK KS2 curriculum |
| **Topic-Based Quizzes** | Select a topic, answer 5 questions, get instant results |
| **AI-Powered Hints** | Stuck on a question? Get a step-by-step hint from a free LLM |
| **6 Free Models** | Choose from Llama 3.1, Llama 3.3, Gemma 3, Mistral 7B, DeepSeek R1, Qwen 3 |
| **Progress Tracking** | Per-topic scores saved to localStorage |
| **Daily Challenge** | "On This Day" category pulls from Numbers API for fresh English content |
| **No Sign-Up** | Everything runs in the browser — bring your own OpenRouter API key (free tier) |

## How It Works

1. Pick a subject → Maths, English, or Science
2. Choose a topic within that subject
3. Answer 5 curriculum-aligned questions
4. Get a score, see what you got right/wrong
5. Use the "Hint" button anytime to get an AI explanation

The AI hint system sends the question to OpenRouter's free tier. You'll need a free API key from [openrouter.ai/keys](https://openrouter.ai/keys) — paste it once and it's saved locally.

## Curriculum Coverage

**Maths** — Place Value, Multiplication & Division, Fractions, Geometry (more topics in development)

**English** — Grammar, Comprehension, Spelling, Punctuation, "On This Day" daily category

**Science** — Living Things, Materials, Physical Processes, Scientific Enquiry

## Quick Start

```bash
git clone https://github.com/SahirVhora/starlearn.git
cd starlearn
open index.html
```

No server, no build step. Just open the file in any browser.

## Tech Stack

- **HTML/CSS** — Clean, mobile-responsive design
- **Vanilla JavaScript** — Single `app.js` with all logic
- **OpenRouter API** — Free tier LLMs for hints (Llama, Gemma, DeepSeek, Qwen)
- **localStorage** — API key, model preference, and progress persistence

## License

MIT — see [LICENSE](LICENSE)
