import type { QuizQuestion, QuizCategory, Difficulty } from '@/types';
import { nanoid } from 'nanoid';

function qid(): string {
  return nanoid(10);
}

export const MOCK_QUESTIONS: Record<string, QuizQuestion[]> = {
  coding: [
    {
      id: qid(),
      question: 'What does the "O" in Big-O notation stand for?',
      options: ['Order', 'Operation', 'Ordinal', 'Output'],
      correctIndex: 0,
      explanation:
        'Big-O stands for "Big Order" — it describes the upper-bound growth rate of an algorithm\'s time or space complexity as input size increases.',
      category: 'coding',
      difficulty: 'easy',
    },
    {
      id: qid(),
      question: 'Which data structure uses LIFO (Last In, First Out) ordering?',
      options: ['Queue', 'Stack', 'Linked List', 'Hash Map'],
      correctIndex: 1,
      explanation:
        'A Stack follows LIFO ordering — the last element pushed onto the stack is the first one popped off.',
      category: 'coding',
      difficulty: 'easy',
    },
    {
      id: qid(),
      question: 'In TypeScript, what is the difference between `interface` and `type`?',
      options: [
        'Interfaces can be extended; types cannot',
        'Types can represent unions; interfaces cannot',
        'They are completely interchangeable',
        'Interfaces are runtime constructs',
      ],
      correctIndex: 1,
      explanation:
        'While both can describe object shapes, `type` aliases can represent unions, intersections, and mapped types that interfaces cannot express directly.',
      category: 'coding',
      difficulty: 'medium',
    },
    {
      id: qid(),
      question: 'What is the time complexity of binary search on a sorted array?',
      options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
      correctIndex: 1,
      explanation:
        'Binary search halves the search space at each step, giving it O(log n) time complexity.',
      category: 'coding',
      difficulty: 'easy',
    },
    {
      id: qid(),
      question: 'What does the `useEffect` cleanup function in React do?',
      options: [
        'Runs before the component mounts',
        'Runs when the component unmounts or before re-running the effect',
        'Prevents state updates',
        'Caches the effect result',
      ],
      correctIndex: 1,
      explanation:
        'The cleanup function returned from useEffect runs when the component unmounts and before the effect re-runs if dependencies change. It\'s used for unsubscribing, clearing timers, etc.',
      category: 'coding',
      difficulty: 'medium',
    },
    {
      id: qid(),
      question: 'Which sorting algorithm has the best average-case time complexity?',
      options: ['Bubble Sort – O(n²)', 'Merge Sort – O(n log n)', 'Selection Sort – O(n²)', 'Insertion Sort – O(n²)'],
      correctIndex: 1,
      explanation:
        'Merge Sort has an average (and worst) case time complexity of O(n log n), making it more efficient than the O(n²) alternatives listed.',
      category: 'coding',
      difficulty: 'medium',
    },
    {
      id: qid(),
      question: 'What is a closure in JavaScript?',
      options: [
        'A function that has been garbage collected',
        'A function that retains access to its outer scope variables',
        'A way to close a browser window',
        'A method to seal an object',
      ],
      correctIndex: 1,
      explanation:
        'A closure is a function bundled with references to its surrounding lexical scope, allowing it to access outer variables even after the outer function has returned.',
      category: 'coding',
      difficulty: 'medium',
    },
    {
      id: qid(),
      question: 'In Git, what does `git rebase` do compared to `git merge`?',
      options: [
        'Deletes the branch',
        'Replays commits on top of another base, creating a linear history',
        'Creates a merge commit',
        'Reverts all changes',
      ],
      correctIndex: 1,
      explanation:
        'Rebase moves (replays) commits onto a new base commit, resulting in a cleaner, linear history without merge commits.',
      category: 'coding',
      difficulty: 'hard',
    },
  ],

  science: [
    {
      id: qid(),
      question: 'What is the speed of light in a vacuum (approximately)?',
      options: ['300,000 km/s', '150,000 km/s', '1,000,000 km/s', '30,000 km/s'],
      correctIndex: 0,
      explanation:
        'The speed of light in a vacuum is approximately 299,792 km/s, commonly rounded to 300,000 km/s (or 3 × 10⁸ m/s).',
      category: 'science',
      difficulty: 'easy',
    },
    {
      id: qid(),
      question: 'What is the powerhouse of the cell?',
      options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi Apparatus'],
      correctIndex: 2,
      explanation:
        'Mitochondria generate most of the cell\'s ATP (energy currency) through oxidative phosphorylation, earning them the nickname "powerhouse of the cell."',
      category: 'science',
      difficulty: 'easy',
    },
    {
      id: qid(),
      question: 'What is the Heisenberg Uncertainty Principle?',
      options: [
        'Energy cannot be created or destroyed',
        'You cannot simultaneously know both position and momentum of a particle with precision',
        'Every action has an equal and opposite reaction',
        'The entropy of a system always increases',
      ],
      correctIndex: 1,
      explanation:
        'The Heisenberg Uncertainty Principle states that the more precisely you measure a particle\'s position, the less precisely you can know its momentum, and vice versa.',
      category: 'science',
      difficulty: 'hard',
    },
    {
      id: qid(),
      question: 'Which planet has the most moons in our solar system?',
      options: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'],
      correctIndex: 1,
      explanation:
        'As of recent discoveries, Saturn has surpassed Jupiter with over 140 confirmed moons, making it the planet with the most natural satellites.',
      category: 'science',
      difficulty: 'medium',
    },
    {
      id: qid(),
      question: 'What is CRISPR-Cas9 primarily used for?',
      options: [
        'Generating electricity',
        'Gene editing',
        'Carbon capture',
        'Quantum computing',
      ],
      correctIndex: 1,
      explanation:
        'CRISPR-Cas9 is a revolutionary gene-editing technology that allows scientists to precisely modify DNA sequences in living organisms.',
      category: 'science',
      difficulty: 'medium',
    },
    {
      id: qid(),
      question: 'What causes the Northern Lights (Aurora Borealis)?',
      options: [
        'Reflection of sunlight off polar ice',
        'Charged particles from the Sun interacting with Earth\'s atmosphere',
        'Lightning in the upper atmosphere',
        'Bioluminescent organisms in the clouds',
      ],
      correctIndex: 1,
      explanation:
        'Auroras are caused by charged particles from the solar wind colliding with atoms and molecules in Earth\'s upper atmosphere, causing them to emit light.',
      category: 'science',
      difficulty: 'medium',
    },
  ],

  movies: [
    {
      id: qid(),
      question: 'Which film won the first Academy Award for Best Picture?',
      options: ['Wings (1927)', 'The Jazz Singer (1927)', 'Sunrise (1927)', 'Ben-Hur (1925)'],
      correctIndex: 0,
      explanation:
        '"Wings" (1927) won the first Best Picture Oscar at the 1st Academy Awards ceremony in 1929.',
      category: 'movies',
      difficulty: 'hard',
    },
    {
      id: qid(),
      question: 'What is the highest-grossing film of all time (not adjusted for inflation)?',
      options: ['Avengers: Endgame', 'Avatar', 'Titanic', 'Star Wars: The Force Awakens'],
      correctIndex: 1,
      explanation:
        'Avatar (2009, re-released 2022) holds the record as the highest-grossing film of all time with over $2.9 billion worldwide.',
      category: 'movies',
      difficulty: 'easy',
    },
    {
      id: qid(),
      question: 'In "The Matrix," what color pill does Neo take?',
      options: ['Blue', 'Red', 'Green', 'Yellow'],
      correctIndex: 1,
      explanation:
        'Neo takes the red pill offered by Morpheus, choosing to learn the truth about the Matrix rather than remaining in blissful ignorance (blue pill).',
      category: 'movies',
      difficulty: 'easy',
    },
    {
      id: qid(),
      question: 'Who directed "Inception" (2010)?',
      options: ['Steven Spielberg', 'Christopher Nolan', 'Ridley Scott', 'Denis Villeneuve'],
      correctIndex: 1,
      explanation:
        'Christopher Nolan wrote and directed "Inception," a sci-fi thriller about dream infiltration starring Leonardo DiCaprio.',
      category: 'movies',
      difficulty: 'easy',
    },
    {
      id: qid(),
      question: 'Which Studio Ghibli film features a moving castle?',
      options: [
        'Spirited Away',
        'Howl\'s Moving Castle',
        'Princess Mononoke',
        'My Neighbor Totoro',
      ],
      correctIndex: 1,
      explanation:
        '"Howl\'s Moving Castle" (2004), directed by Hayao Miyazaki, is based on Diana Wynne Jones\' novel and features a wizard\'s walking castle.',
      category: 'movies',
      difficulty: 'easy',
    },
    {
      id: qid(),
      question: 'In "Interstellar," what is the name of the equation Prof. Brand is trying to solve?',
      options: [
        'The Drake Equation',
        'The Gravity Equation',
        'The Unified Field Theory',
        'The Lazarus Equation',
      ],
      correctIndex: 1,
      explanation:
        'Professor Brand spends decades trying to solve "the gravity equation" to allow massive space stations to lift off Earth and save humanity.',
      category: 'movies',
      difficulty: 'hard',
    },
  ],

  general: [
    {
      id: qid(),
      question: 'How many time zones does Russia span?',
      options: ['7', '9', '11', '13'],
      correctIndex: 2,
      explanation:
        'Russia spans 11 time zones — the most of any country — stretching from UTC+2 (Kaliningrad) to UTC+12 (Kamchatka).',
      category: 'general',
      difficulty: 'medium',
    },
    {
      id: qid(),
      question: 'What is the most spoken native language in the world?',
      options: ['English', 'Spanish', 'Mandarin Chinese', 'Hindi'],
      correctIndex: 2,
      explanation:
        'Mandarin Chinese has the most native speakers worldwide, with approximately 920 million people speaking it as their first language.',
      category: 'general',
      difficulty: 'easy',
    },
    {
      id: qid(),
      question: 'Which country has won the most FIFA World Cup titles?',
      options: ['Germany', 'Argentina', 'Italy', 'Brazil'],
      correctIndex: 3,
      explanation:
        'Brazil has won the FIFA World Cup a record 5 times (1958, 1962, 1970, 1994, 2002), more than any other nation.',
      category: 'general',
      difficulty: 'easy',
    },
    {
      id: qid(),
      question: 'What is the deepest point in the ocean?',
      options: [
        'Mariana Trench',
        'Tonga Trench',
        'Puerto Rico Trench',
        'Java Trench',
      ],
      correctIndex: 0,
      explanation:
        'The Challenger Deep in the Mariana Trench reaches approximately 10,935 meters (35,876 ft), making it the deepest known point in Earth\'s oceans.',
      category: 'general',
      difficulty: 'easy',
    },
    {
      id: qid(),
      question: 'What is the smallest country in the world by area?',
      options: ['Monaco', 'San Marino', 'Vatican City', 'Liechtenstein'],
      correctIndex: 2,
      explanation:
        'Vatican City is the smallest country in the world at just 0.44 square kilometers (0.17 sq mi), entirely surrounded by Rome, Italy.',
      category: 'general',
      difficulty: 'easy',
    },
    {
      id: qid(),
      question: 'The Great Wall of China is visible from space with the naked eye — true or false?',
      options: [
        'True, always visible',
        'False, it\'s a common myth',
        'Only from the International Space Station',
        'Only during winter',
      ],
      correctIndex: 1,
      explanation:
        'This is a common myth. The Great Wall is very long but narrow, making it nearly impossible to see from space with the naked eye. Astronauts have confirmed this.',
      category: 'general',
      difficulty: 'medium',
    },
  ],

  technology: [
    {
      id: qid(),
      question: 'What does GPU stand for?',
      options: [
        'General Processing Unit',
        'Graphics Processing Unit',
        'Global Performance Utility',
        'Graphical Pixel Unit',
      ],
      correctIndex: 1,
      explanation:
        'GPU stands for Graphics Processing Unit — a specialized processor designed to accelerate rendering graphics and, more recently, parallel computing workloads like AI training.',
      category: 'technology',
      difficulty: 'easy',
    },
    {
      id: qid(),
      question: 'What year was the first iPhone released?',
      options: ['2005', '2006', '2007', '2008'],
      correctIndex: 2,
      explanation:
        'Steve Jobs announced the first iPhone on January 9, 2007, and it went on sale on June 29, 2007, revolutionizing the smartphone industry.',
      category: 'technology',
      difficulty: 'easy',
    },
    {
      id: qid(),
      question: 'What is a "transformer" in the context of AI and machine learning?',
      options: [
        'A device that converts voltage levels',
        'A neural network architecture using self-attention mechanisms',
        'A type of data preprocessor',
        'A robot that changes shape',
      ],
      correctIndex: 1,
      explanation:
        'The Transformer is a neural network architecture introduced in the 2017 "Attention Is All You Need" paper. It uses self-attention to process sequences in parallel, powering models like GPT and BERT.',
      category: 'technology',
      difficulty: 'medium',
    },
    {
      id: qid(),
      question: 'What is WebAssembly (Wasm)?',
      options: [
        'A new JavaScript framework',
        'A binary instruction format for stack-based virtual machines',
        'A CSS preprocessor',
        'A server-side rendering technique',
      ],
      correctIndex: 1,
      explanation:
        'WebAssembly is a binary instruction format designed as a portable compilation target for programming languages, enabling near-native performance in web browsers.',
      category: 'technology',
      difficulty: 'hard',
    },
    {
      id: qid(),
      question: 'What does "LLM" stand for in AI?',
      options: [
        'Low Latency Memory',
        'Large Language Model',
        'Linear Learning Machine',
        'Logical Logic Module',
      ],
      correctIndex: 1,
      explanation:
        'LLM stands for Large Language Model — AI models trained on vast text data to understand and generate human-like text, such as GPT-4 and Gemini.',
      category: 'technology',
      difficulty: 'easy',
    },
    {
      id: qid(),
      question: 'What consensus mechanism does Bitcoin use?',
      options: [
        'Proof of Stake',
        'Proof of Work',
        'Delegated Proof of Stake',
        'Proof of Authority',
      ],
      correctIndex: 1,
      explanation:
        'Bitcoin uses Proof of Work (PoW), where miners compete to solve cryptographic puzzles to validate transactions and create new blocks.',
      category: 'technology',
      difficulty: 'medium',
    },
  ],
};

/**
 * Get mock questions for demo mode, filtered by category, count, and difficulty.
 * Falls back gracefully if not enough questions match the exact difficulty.
 */
export function getMockQuestions(
  category: QuizCategory,
  count: number,
  difficulty: Difficulty
): QuizQuestion[] {
  const categoryKey = category === 'custom' || category === 'history' || category === 'sports'
    ? 'general'
    : category;

  const pool = MOCK_QUESTIONS[categoryKey] ?? MOCK_QUESTIONS['general'];

  // Try exact difficulty match first
  const exactMatch = pool.filter((q) => q.difficulty === difficulty);

  // If not enough questions at the exact difficulty, use all from the category
  const source = exactMatch.length >= count ? exactMatch : pool;

  // Shuffle using Fisher-Yates
  const shuffled = [...source];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Take `count` questions, generating fresh IDs
  return shuffled.slice(0, count).map((q) => ({
    ...q,
    id: nanoid(10),
  }));
}
