// 11+ Exam Practice questions — integrated into StarLearn
// Accessed via mode toggle in header
const QUESTIONS_11PLUS = {
  maths11: {
    label: "11+ Maths",
    icon: "🧮",
    color: "#D97706",
    topics: [
      {
        name: "Number & Algebra",
        questions: [
          { q: "What is 15% of 240?", options: ["30", "36", "42", "48"], answer: 1, hint_topic: "finding percentages of amounts" },
          { q: "Solve: 3x + 7 = 28. What is x?", options: ["5", "7", "9", "11"], answer: 1, hint_topic: "solving simple algebraic equations" },
          { q: "What is the next number: 3, 7, 15, 31, ?", options: ["47", "55", "63", "59"], answer: 2, hint_topic: "number sequences and patterns" },
          { q: "What is the mean of: 12, 18, 24, 30, 36?", options: ["22", "24", "26", "28"], answer: 1, hint_topic: "calculating the mean average" },
          { q: "If a = 4 and b = 7, what is 2a + 3b?", options: ["25", "29", "33", "35"], answer: 1, hint_topic: "substituting values into algebraic expressions" },
        ]
      },
      {
        name: "Fractions, Decimals & Percentages",
        questions: [
          { q: "What is 3/8 as a decimal?", options: ["0.325", "0.375", "0.425", "0.475"], answer: 1, hint_topic: "converting fractions to decimals" },
          { q: "What fraction of a day is 6 hours in simplest form?", options: ["1/6", "1/4", "1/3", "1/2"], answer: 1, hint_topic: "simplifying fractions in real contexts" },
          { q: "Increase £80 by 15%.", options: ["£88", "£92", "£95", "£98"], answer: 1, hint_topic: "percentage increase calculations" },
          { q: "Which is largest: 3/5, 0.58, 55%?", options: ["3/5", "0.58", "55%", "All equal"], answer: 0, hint_topic: "comparing fractions, decimals and percentages" },
          { q: "What is 0.125 as a fraction in simplest form?", options: ["1/5", "1/6", "1/8", "1/10"], answer: 2, hint_topic: "converting decimals to fractions" },
        ]
      },
      {
        name: "Geometry & Measurement",
        questions: [
          { q: "What is the area of a triangle with base 8cm and height 5cm?", options: ["13cm²", "20cm²", "26cm²", "40cm²"], answer: 1, hint_topic: "area of a triangle" },
          { q: "A circle has radius 7cm. What is its circumference? (π ≈ 3.14)", options: ["22cm", "44cm", "49cm", "154cm"], answer: 1, hint_topic: "circumference of a circle" },
          { q: "Two angles in a triangle are 45° and 65°. What is the third?", options: ["60°", "70°", "80°", "90°"], answer: 1, hint_topic: "angles in a triangle sum to 180°" },
          { q: "A cuboid measures 4cm × 3cm × 2cm. What is its volume?", options: ["9cm³", "18cm³", "24cm³", "36cm³"], answer: 2, hint_topic: "volume of a cuboid" },
          { q: "What is the perimeter of a regular hexagon with side 6cm?", options: ["24cm", "30cm", "36cm", "42cm"], answer: 2, hint_topic: "perimeter of regular polygons" },
        ]
      }
    ]
  },
  english11: {
    label: "11+ English",
    icon: "📖",
    color: "#7C3AED",
    topics: [
      {
        name: "Comprehension",
        questions: [
          { q: "A text written to persuade is called:", options: ["Narrative", "Descriptive", "Persuasive", "Informative"], answer: 2, hint_topic: "identifying text types and purposes" },
          { q: "What is a 'metaphor'?", options: ["A comparison using 'like' or 'as'", "Direct comparison saying one thing IS another", "Repetition of initial sounds", "An exaggerated statement"], answer: 1, hint_topic: "metaphors in English" },
          { q: "What does 'chronological order' mean?", options: ["By importance", "By time sequence", "Alphabetical", "By length"], answer: 1, hint_topic: "chronological sequencing in texts" },
          { q: "Read: 'The wind whispered through the trees.' This is an example of:", options: ["Metaphor", "Simile", "Personification", "Alliteration"], answer: 2, hint_topic: "personification in creative writing" },
          { q: "What is an 'antonym' of 'generous'?", options: ["Kind", "Wealthy", "Selfish", "Gentle"], answer: 2, hint_topic: "antonyms — opposite meanings" },
        ]
      },
      {
        name: "Grammar & Punctuation",
        questions: [
          { q: "Which sentence uses a semicolon correctly?", options: ["I like cats; and dogs.", "The rain fell; the wind howled.", "She; went to the shop.", "He likes; football and tennis."], answer: 1, hint_topic: "using semicolons between related clauses" },
          { q: "Identify the subordinate clause: 'Although it was raining, we went for a walk.'", options: ["we went for a walk", "Although it was raining", "raining, we went", "for a walk"], answer: 1, hint_topic: "subordinate clauses in complex sentences" },
          { q: "Which word is the subject: 'The old man walked slowly down the road.'", options: ["old", "man", "walked", "road"], answer: 1, hint_topic: "identifying the subject of a sentence" },
          { q: "Change to passive voice: 'The dog chased the cat.'", options: ["The cat was chased by the dog.", "The dog was chased by the cat.", "The cat chased the dog.", "The dog is chasing."], answer: 0, hint_topic: "converting active to passive voice" },
          { q: "Which uses a colon correctly?", options: ["I need: milk bread and eggs.", "There are three things: milk, bread, and eggs.", "She said: hello.", "Colons: are used: for lists."], answer: 1, hint_topic: "using colons to introduce lists" },
        ]
      }
    ]
  },
  verbal: {
    label: "Verbal Reasoning",
    icon: "🧠",
    color: "#0891B2",
    topics: [
      {
        name: "Word Patterns",
        questions: [
          { q: "Find the missing letter: CAT → DAT, DOG → ?", options: ["EOG", "EPG", "EOH", "EPH"], answer: 2, hint_topic: "letter patterns and codes in verbal reasoning" },
          { q: "Which word does NOT belong: happy, joyful, sad, cheerful?", options: ["happy", "joyful", "sad", "cheerful"], answer: 2, hint_topic: "odd one out — synonyms and antonyms" },
          { q: "If BIRD = 2-9-18-4, what is FISH?", options: ["6-9-19-8", "6-9-18-8", "5-9-19-8", "6-10-19-8"], answer: 0, hint_topic: "alphabet position codes" },
          { q: "KNIFE is to CUT as PEN is to:", options: ["INK", "WRITE", "PAPER", "DRAW"], answer: 1, hint_topic: "analogies and word relationships" },
          { q: "Rearrange to form a word: R A E P P →", options: ["PREAP", "PAPER", "REPAP", "PAREP"], answer: 1, hint_topic: "anagrams in verbal reasoning" },
        ]
      },
      {
        name: "Logic & Codes",
        questions: [
          { q: "In a code, RED = 18-5-4. How is BLUE written?", options: ["2-12-21-5", "2-12-22-5", "1-12-21-5", "2-13-21-5"], answer: 0, hint_topic: "alphabetical position coding" },
          { q: "If all cats are mammals, and some mammals are pets, which MUST be true?", options: ["All cats are pets", "Some cats are pets", "No cats are pets", "Cannot be determined from the information"], answer: 3, hint_topic: "logical deduction with categorical statements" },
          { q: "Complete: 2, 6, 12, 20, 30, ?", options: ["38", "40", "42", "44"], answer: 2, hint_topic: "number sequences in verbal reasoning" },
          { q: "If FRIEND is coded as GQJDOC, how is ENEMY coded?", options: ["FODNZ", "FODMX", "FODLZ", "FNDNZ"], answer: 0, hint_topic: "letter shift codes (+1 pattern)" },
          { q: "PEN is 16-5-14. Write the code for BOOK.", options: ["2-15-15-11", "2-15-15-10", "3-15-15-11", "2-14-15-11"], answer: 0, hint_topic: "letter-to-number coding" },
        ]
      }
    ]
  },
  nonverbal: {
    label: "Non-Verbal Reasoning",
    icon: "🔷",
    color: "#DC2626",
    topics: [
      {
        name: "Shape Patterns",
        questions: [
          { q: "A shape has 4 sides of equal length but NO right angles. What is it?", options: ["Square", "Rectangle", "Rhombus", "Trapezium"], answer: 2, hint_topic: "properties of quadrilaterals" },
          { q: "How many faces does a triangular prism have?", options: ["4", "5", "6", "7"], answer: 1, hint_topic: "faces of 3D shapes" },
          { q: "Which shape has exactly 1 line of symmetry?", options: ["Square", "Equilateral triangle", "Isosceles triangle", "Circle"], answer: 2, hint_topic: "lines of symmetry in triangles" },
          { q: "If a shape is rotated 90° clockwise, how many degrees has it turned?", options: ["45°", "90°", "180°", "360°"], answer: 1, hint_topic: "rotational symmetry and turns" },
          { q: "A net of a cube has how many squares?", options: ["4", "5", "6", "8"], answer: 2, hint_topic: "nets of 3D shapes" },
        ]
      },
      {
        name: "Pattern Recognition",
        questions: [
          { q: "What comes next: △ □ △ △ □ △ △ △ □ ?", options: ["△", "□", "△ △", "△ △ △"], answer: 0, hint_topic: "shape pattern sequences" },
          { q: "Which is the odd one out: ● ○ ◉ ◎?", options: ["● (filled circle)", "○ (empty circle)", "◉ (circle with dot)", "◎ (double circle)"], answer: 0, hint_topic: "identifying shape differences" },
          { q: "A shape reflected in a mirror line will be:", options: ["Rotated 90°", "Flipped and reversed", "Smaller", "The same"], answer: 1, hint_topic: "reflection symmetry" },
          { q: "How many small cubes are in a 3×3×3 cube?", options: ["9", "18", "27", "36"], answer: 2, hint_topic: "counting cubes in 3D arrangements" },
          { q: "Which completes the pattern: ⬜⬛⬜ ⬛⬜⬛ ?", options: ["⬜⬛⬜", "⬛⬜⬛", "⬜⬜⬛", "⬛⬛⬜"], answer: 0, hint_topic: "completing visual patterns" },
        ]
      }
    ]
  }
};

// Merge with existing QUESTIONS
Object.assign(QUESTIONS, QUESTIONS_11PLUS);
