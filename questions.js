const QUESTIONS = {
  maths: {
    label: "Maths",
    icon: "🔢",
    color: "#4F46E5",
    topics: [
      {
        name: "Place Value",
        questions: [
          { q: "What is the value of the digit 7 in the number 3,742?", options: ["7", "70", "700", "7,000"], answer: 2, hint_topic: "place value of digits in 4-digit numbers" },
          { q: "Write 4,506 in words.", options: ["Four thousand five hundred and six", "Four thousand and fifty six", "Forty five hundred and six", "Four hundred and fifty six"], answer: 0, hint_topic: "writing numbers in words" },
          { q: "What is 1,000 more than 6,349?", options: ["6,449", "7,349", "6,350", "16,349"], answer: 1, hint_topic: "adding 1000 to a number" },
          { q: "Which number is the largest?", options: ["4,289", "4,928", "4,298", "4,892"], answer: 1, hint_topic: "comparing 4-digit numbers" },
          { q: "Round 3,472 to the nearest 1,000.", options: ["3,000", "4,000", "3,500", "3,400"], answer: 0, hint_topic: "rounding to nearest 1000" },
        ]
      },
      {
        name: "Multiplication & Division",
        questions: [
          { q: "What is 7 × 8?", options: ["54", "56", "48", "64"], answer: 1, hint_topic: "7 times table" },
          { q: "What is 63 ÷ 9?", options: ["6", "8", "7", "9"], answer: 2, hint_topic: "division using 9 times table" },
          { q: "What is 12 × 6?", options: ["62", "72", "82", "66"], answer: 1, hint_topic: "12 times table" },
          { q: "What is 144 ÷ 12?", options: ["11", "12", "13", "14"], answer: 1, hint_topic: "dividing by 12" },
          { q: "A pack has 8 crayons. How many crayons in 9 packs?", options: ["72", "63", "81", "64"], answer: 0, hint_topic: "multiplication word problems" },
        ]
      },
      {
        name: "Fractions",
        questions: [
          { q: "What is ½ of 48?", options: ["22", "24", "26", "28"], answer: 1, hint_topic: "finding half of a number" },
          { q: "Which fraction is equivalent to ½?", options: ["2/5", "3/4", "4/8", "3/5"], answer: 2, hint_topic: "equivalent fractions" },
          { q: "What is ¾ of 20?", options: ["12", "15", "16", "10"], answer: 1, hint_topic: "finding three quarters of a number" },
          { q: "Which is bigger: ⅔ or ¾?", options: ["⅔", "¾", "They are equal", "Can't tell"], answer: 1, hint_topic: "comparing fractions with different denominators" },
          { q: "What is 1/4 + 2/4?", options: ["3/8", "3/4", "1/2", "2/8"], answer: 1, hint_topic: "adding fractions with the same denominator" },
        ]
      },
      {
        name: "Geometry",
        questions: [
          { q: "How many sides does a hexagon have?", options: ["5", "6", "7", "8"], answer: 1, hint_topic: "properties of 2D shapes" },
          { q: "What do angles in a triangle add up to?", options: ["90°", "180°", "270°", "360°"], answer: 1, hint_topic: "angles in a triangle" },
          { q: "What type of angle is 120°?", options: ["Acute", "Right angle", "Obtuse", "Reflex"], answer: 2, hint_topic: "types of angles" },
          { q: "How many lines of symmetry does a square have?", options: ["2", "4", "1", "0"], answer: 1, hint_topic: "lines of symmetry in regular shapes" },
          { q: "What is the perimeter of a square with sides of 5cm?", options: ["10cm", "20cm", "25cm", "15cm"], answer: 1, hint_topic: "calculating perimeter of a square" },
        ]
      },
    ]
  },
  english: {
    label: "English",
    icon: "📚",
    color: "#059669",
    topics: [
      {
        name: "Grammar",
        questions: [
          { q: "Which word is a noun in this sentence: 'The happy dog ran quickly.'", options: ["happy", "dog", "ran", "quickly"], answer: 1, hint_topic: "identifying nouns in a sentence" },
          { q: "Which sentence uses the correct verb tense?", options: ["Yesterday I go to the park.", "Yesterday I gone to the park.", "Yesterday I went to the park.", "Yesterday I goes to the park."], answer: 2, hint_topic: "past tense verbs" },
          { q: "What type of word is 'quickly'?", options: ["Noun", "Verb", "Adjective", "Adverb"], answer: 3, hint_topic: "identifying adverbs" },
          { q: "Which is a conjunction?", options: ["run", "but", "blue", "slowly"], answer: 1, hint_topic: "conjunctions in English grammar" },
          { q: "Which sentence is in the passive voice?", options: ["The cat chased the mouse.", "The mouse was chased by the cat.", "The cat is chasing.", "A cat chases mice."], answer: 1, hint_topic: "active and passive voice" },
        ]
      },
      {
        name: "Punctuation",
        questions: [
          { q: "Where does an apostrophe go in 'the dogs bone' (one dog)?", options: ["dog's bone", "dogs' bone", "dogs bone'", "dog's' bone"], answer: 0, hint_topic: "apostrophes for possession" },
          { q: "Which sentence uses commas correctly?", options: ["I like cats dogs and rabbits.", "I like cats, dogs and rabbits.", "I like, cats dogs, and rabbits.", "I, like cats dogs and rabbits."], answer: 1, hint_topic: "using commas in a list" },
          { q: "What punctuation ends an exclamatory sentence?", options: [".", ",", "!", "?"], answer: 2, hint_topic: "exclamation marks" },
          { q: "Which word needs a capital letter?", options: ["the", "and", "monday", "big"], answer: 2, hint_topic: "capital letters for days of the week" },
          { q: "What are inverted commas used for?", options: ["Lists", "Speech", "Possessives", "Abbreviations"], answer: 1, hint_topic: "inverted commas for direct speech" },
        ]
      },
      {
        name: "Spellings",
        questions: [
          { q: "Which spelling is correct?", options: ["beleive", "believe", "beleeve", "belive"], answer: 1, hint_topic: "i before e spelling rule" },
          { q: "Choose the correct spelling:", options: ["necessary", "neccesary", "neccessary", "necesary"], answer: 0, hint_topic: "spelling the word necessary" },
          { q: "Which is correct?", options: ["recieve", "receive", "receve", "reciive"], answer: 1, hint_topic: "ei/ie spelling patterns" },
          { q: "Correct spelling of the opposite of patient:", options: ["inpatient", "impatient", "unpatient", "dispatient"], answer: 1, hint_topic: "prefixes: im-, in-, un-" },
          { q: "Which word means 'not possible' and is spelled correctly?", options: ["imposible", "impossable", "impossible", "immpossible"], answer: 2, hint_topic: "spelling words with silent letters and prefixes" },
        ]
      },
      {
        name: "Comprehension",
        questions: [
          { q: "In a story, what is the 'setting'?", options: ["The main character", "When and where the story takes place", "The problem in the story", "How the story ends"], answer: 1, hint_topic: "story setting in comprehension" },
          { q: "What does the word 'ancient' mean?", options: ["Very new", "Very old", "Very large", "Very small"], answer: 1, hint_topic: "meaning of the word ancient" },
          { q: "A story with a moral lesson is called a:", options: ["Poem", "Fable", "Biography", "Report"], answer: 1, hint_topic: "types of texts - fables" },
          { q: "What is an author's 'point of view'?", options: ["The title of the book", "How illustrations look", "The perspective from which a story is told", "The ending of the story"], answer: 2, hint_topic: "author's point of view in reading" },
          { q: "What is an inference?", options: ["What is directly written", "A conclusion based on clues and evidence", "A made-up fact", "The first sentence"], answer: 1, hint_topic: "making inferences in reading" },
        ]
      },
    ]
  },
  science: {
    label: "Science",
    icon: "🔬",
    color: "#DC2626",
    topics: [
      {
        name: "Living Things",
        questions: [
          { q: "What do plants need to make their own food?", options: ["Darkness and water", "Sunlight, water and carbon dioxide", "Soil and warmth only", "Oxygen and sugar"], answer: 1, hint_topic: "photosynthesis for KS2" },
          { q: "Which of these is an invertebrate?", options: ["Dog", "Frog", "Earthworm", "Sparrow"], answer: 2, hint_topic: "vertebrates and invertebrates" },
          { q: "What is the process plants use to make food called?", options: ["Respiration", "Photosynthesis", "Digestion", "Germination"], answer: 1, hint_topic: "photosynthesis" },
          { q: "Which part of a flower makes pollen?", options: ["Petal", "Sepal", "Stamen", "Pistil"], answer: 2, hint_topic: "parts of a flower" },
          { q: "What is a food chain?", options: ["A list of foods you eat", "The order in which organisms eat each other", "A type of supermarket", "How farmers grow food"], answer: 1, hint_topic: "food chains in science" },
        ]
      },
      {
        name: "States of Matter",
        questions: [
          { q: "What happens to water when it is heated to 100°C?", options: ["It freezes", "It evaporates/boils", "It melts", "It condenses"], answer: 1, hint_topic: "boiling point of water" },
          { q: "What state of matter has no fixed shape or volume?", options: ["Solid", "Liquid", "Gas", "Plasma"], answer: 2, hint_topic: "properties of gases" },
          { q: "What is it called when a liquid turns into a solid?", options: ["Melting", "Evaporation", "Freezing", "Condensation"], answer: 2, hint_topic: "freezing - changing states of matter" },
          { q: "At what temperature does water freeze?", options: ["100°C", "50°C", "0°C", "-10°C"], answer: 2, hint_topic: "freezing point of water" },
          { q: "When gas turns to liquid, what is the process called?", options: ["Freezing", "Melting", "Evaporation", "Condensation"], answer: 3, hint_topic: "condensation - states of matter" },
        ]
      },
      {
        name: "Electricity",
        questions: [
          { q: "What do you need to make a simple circuit work?", options: ["Just a battery", "A battery and a bulb only", "A complete loop with a power source", "Only wires"], answer: 2, hint_topic: "simple electrical circuits" },
          { q: "Which of these is a good conductor of electricity?", options: ["Wood", "Plastic", "Copper wire", "Rubber"], answer: 2, hint_topic: "conductors and insulators" },
          { q: "What happens if there is a gap in a circuit?", options: ["It works faster", "The bulb glows brighter", "The circuit stops working", "Nothing changes"], answer: 2, hint_topic: "complete and incomplete circuits" },
          { q: "What does a switch do in a circuit?", options: ["Makes it brighter", "Opens and closes the circuit", "Adds more power", "Changes direction"], answer: 1, hint_topic: "the role of a switch in a circuit" },
          { q: "Which symbol represents a battery in a circuit diagram?", options: ["A circle", "Two long and short parallel lines", "A zigzag line", "A cross"], answer: 1, hint_topic: "circuit diagram symbols" },
        ]
      },
      {
        name: "Food Chains",
        questions: [
          { q: "What is a producer in a food chain?", options: ["An animal that eats meat", "A plant that makes its own food", "An animal that eats plants", "A decomposer"], answer: 1, hint_topic: "producers in food chains" },
          { q: "What is a predator?", options: ["An animal that is eaten", "A plant in a food chain", "An animal that hunts and eats other animals", "A type of bacteria"], answer: 2, hint_topic: "predators and prey in food chains" },
          { q: "In the chain: grass → rabbit → fox. What is the rabbit?", options: ["Producer", "Top predator", "Primary consumer", "Decomposer"], answer: 2, hint_topic: "consumers in food chains" },
          { q: "What do arrows in a food chain show?", options: ["Where animals live", "The direction energy flows", "Which animals are friends", "How fast animals move"], answer: 1, hint_topic: "reading food chain diagrams" },
          { q: "What would happen if all the rabbits disappeared in: grass → rabbit → fox?", options: ["Grass would die", "Foxes would have more food", "Fox population would decrease", "Nothing would change"], answer: 2, hint_topic: "impact of changes in a food chain" },
        ]
      },
    ]
  }
};
