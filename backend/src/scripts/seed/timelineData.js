/** 60-day placement sprint roadmap — stored in MongoDB via seed */
const YT = {
  striver: (id) => `https://www.youtube.com/watch?v=${id}`,
  striverPlaylist: (list) => `https://www.youtube.com/playlist?list=${list}`,
  kunal: (id) => `https://www.youtube.com/watch?v=${id}`,
  apna: (id) => `https://www.youtube.com/watch?v=${id}`,
  codehelp: (id) => `https://www.youtube.com/watch?v=${id}`,
};

export const timelineDays = [
  // WEEK 1 JAVA
  { dayNumber: 1, week: 1, category: 'JAVA', title: 'Java Setup & Syntax', topics: ['JDK', 'IDE', 'Hello World', 'Syntax'], hours: 5, videos: [{ title: 'Java Introduction - Kunal Kushwaha', url: YT.kunal('yRpLlJmSvXI'), source: 'Kunal Kushwaha' }], questions: [{ title: 'Java Basics GFG', url: 'https://www.geeksforgeeks.org/java/', difficulty: 'Easy', platform: 'GFG' }], revision: 'Revise syntax rules and naming conventions.' },
  { dayNumber: 2, week: 1, category: 'JAVA', title: 'Variables & Data Types', topics: ['Variables', 'Primitives', 'Type casting'], hours: 5, videos: [{ title: 'Variables in Java - Apna College', url: YT.apna('D0-XtVwJ_ts'), source: 'Apna College' }], questions: [{ title: 'Data Types Practice', url: 'https://practice.geeksforgeeks.org/problems/data-types-1587115620/1', difficulty: 'Easy', platform: 'GFG' }], revision: 'Practice int, double, char, boolean.' },
  { dayNumber: 3, week: 1, category: 'JAVA', title: 'Input/Output', topics: ['Scanner', 'BufferedReader', 'printf'], hours: 5, videos: [{ title: 'Taking Input in Java', url: YT.apna('5TRFpFBccQM'), source: 'Apna College' }], questions: [{ title: 'Print Z Pattern', url: 'https://www.naukri.com/code360/problems/print-z_5922040', difficulty: 'Easy', platform: 'CodeStudio' }], revision: 'Master Scanner and formatting.' },
  { dayNumber: 4, week: 1, category: 'JAVA', title: 'Operators', topics: ['Arithmetic', 'Relational', 'Logical', 'Bitwise'], hours: 5, videos: [{ title: 'Operators - CodeHelp', url: YT.codehelp('x0AnCE9SE4A'), source: 'CodeHelp' }], questions: [{ title: 'Sum of Two Numbers LC', url: 'https://leetcode.com/problems/add-two-numbers/', difficulty: 'Medium', platform: 'LeetCode' }], revision: 'Operator precedence table.' },
  { dayNumber: 5, week: 1, category: 'JAVA', title: 'Conditionals', topics: ['if-else', 'switch', 'ternary'], hours: 5, videos: [{ title: 'Conditional Statements', url: YT.apna('S0QvyHv6ueE'), source: 'Apna College' }], questions: [{ title: 'Largest of Three', url: 'https://practice.geeksforgeeks.org/problems/largest-of-three-numbers/1', difficulty: 'Easy', platform: 'GFG' }], revision: 'Dry-run 5 conditional problems.' },
  { dayNumber: 6, week: 1, category: 'JAVA', title: 'Loops', topics: ['for', 'while', 'do-while', 'nested loops'], hours: 5, videos: [{ title: 'Loops in Java', url: YT.apna('lAmLvTiQn78'), source: 'Apna College' }], questions: [{ title: 'FizzBuzz', url: 'https://leetcode.com/problems/fizz-buzz/', difficulty: 'Easy', platform: 'LeetCode' }], revision: 'Pattern printing basics.' },
  { dayNumber: 7, week: 1, category: 'JAVA', title: 'Functions & Methods', topics: ['Methods', 'Parameters', 'Return', 'Scope'], hours: 5, videos: [{ title: 'Methods in Java', url: YT.apna('Oe3E4mSlNdM'), source: 'Apna College' }], questions: [{ title: 'Factorial', url: 'https://practice.geeksforgeeks.org/problems/factorial5739/1', difficulty: 'Easy', platform: 'GFG' }], revision: 'Week 1 Java revision — all topics.' },
  // WEEK 2 JAVA
  { dayNumber: 8, week: 2, category: 'JAVA', title: 'Arrays', topics: ['1D arrays', '2D arrays', 'ArrayList intro'], hours: 5, videos: [{ title: 'Arrays - Kunal', url: YT.kunal('ZJ8XWCuK4JU'), source: 'Kunal Kushwaha' }], questions: [{ title: 'Two Sum', url: 'https://leetcode.com/problems/two-sum/', difficulty: 'Easy', platform: 'LeetCode' }], revision: 'Array traversal patterns.' },
  { dayNumber: 9, week: 2, category: 'JAVA', title: 'Strings', topics: ['String', 'StringBuilder', 'String methods'], hours: 5, videos: [{ title: 'Strings in Java', url: YT.apna('ODGDLQjoorU'), source: 'Apna College' }], questions: [{ title: 'Valid Palindrome', url: 'https://leetcode.com/problems/valid-palindrome/', difficulty: 'Easy', platform: 'LeetCode' }], revision: 'Immutable vs mutable strings.' },
  { dayNumber: 10, week: 2, category: 'JAVA', title: 'OOP — Classes & Objects', topics: ['Class', 'Object', 'Constructor'], hours: 5, videos: [{ title: 'OOP Introduction', url: YT.kunal('TsdxmPMVNNA'), source: 'Kunal Kushwaha' }], questions: [{ title: 'Class Object GFG', url: 'https://www.geeksforgeeks.org/classes-objects-java/', difficulty: 'Easy', platform: 'GFG' }], revision: 'Draw UML for a simple class.' },
  { dayNumber: 11, week: 2, category: 'JAVA', title: 'OOP — Inheritance & Polymorphism', topics: ['extends', 'super', 'overriding'], hours: 5, videos: [{ title: 'Inheritance', url: YT.kunal('6s0yqbWi45A'), source: 'Kunal Kushwaha' }], questions: [{ title: 'Inheritance GFG Quiz', url: 'https://www.geeksforgeeks.org/inheritance-in-java/', difficulty: 'Easy', platform: 'GFG' }], revision: 'IS-A vs HAS-A.' },
  { dayNumber: 12, week: 2, category: 'JAVA', title: 'Abstraction & Interfaces', topics: ['abstract', 'interface', 'implements'], hours: 5, videos: [{ title: 'Interfaces', url: YT.kunal('BrXXWzIYnC4'), source: 'Kunal Kushwaha' }], questions: [{ title: 'Interface practice', url: 'https://www.geeksforgeeks.org/interfaces-in-java/', difficulty: 'Easy', platform: 'GFG' }], revision: 'Abstract class vs interface.' },
  { dayNumber: 13, week: 2, category: 'JAVA', title: 'Encapsulation & Packages', topics: ['private', 'getters/setters', 'packages'], hours: 5, videos: [{ title: 'Encapsulation', url: YT.kunal('v0Ru7YvcO0M'), source: 'Kunal Kushwaha' }], questions: [{ title: 'Bank Account OOP', url: 'https://practice.geeksforgeeks.org/problems/bank-account/1', difficulty: 'Easy', platform: 'GFG' }], revision: 'Access modifiers chart.' },
  { dayNumber: 14, week: 2, category: 'JAVA', title: 'Collections Framework', topics: ['ArrayList', 'HashMap', 'HashSet', 'Iterator'], hours: 5, videos: [{ title: 'Collections in Java', url: YT.kunal('rUU9mK7J7yM'), source: 'Kunal Kushwaha' }], questions: [{ title: 'Group Anagrams', url: 'https://leetcode.com/problems/group-anagrams/', difficulty: 'Medium', platform: 'LeetCode' }], revision: 'Week 2 Java revision.' },
  // WEEK 3 JAVA
  { dayNumber: 15, week: 3, category: 'JAVA', title: 'Exception Handling', topics: ['try-catch', 'finally', 'throws', 'custom exceptions'], hours: 5, videos: [{ title: 'Exception Handling', url: YT.kunal('WNe7RUaIU7I'), source: 'Kunal Kushwaha' }], questions: [{ title: 'Exception GFG', url: 'https://www.geeksforgeeks.org/exceptions-in-java/', difficulty: 'Easy', platform: 'GFG' }], revision: 'Checked vs unchecked.' },
  { dayNumber: 16, week: 3, category: 'JAVA', title: 'File I/O & Serialization', topics: ['FileReader', 'FileWriter', 'Serializable'], hours: 5, videos: [{ title: 'File Handling Java', url: YT.apna('x0AnCE9SE4A'), source: 'Apna College' }], questions: [{ title: 'Read N Characters', url: 'https://leetcode.com/problems/read-n-characters-given-read4/', difficulty: 'Easy', platform: 'LeetCode' }], revision: 'Try-catch with files.' },
  { dayNumber: 17, week: 3, category: 'JAVA', title: 'Streams API', topics: ['map', 'filter', 'reduce', 'collectors'], hours: 5, videos: [{ title: 'Java Streams', url: YT.kunal('yRpLlJmSvXI'), source: 'Kunal Kushwaha' }], questions: [{ title: 'Stream practice GFG', url: 'https://www.geeksforgeeks.org/stream-in-java/', difficulty: 'Medium', platform: 'GFG' }], revision: 'Functional programming in Java.' },
  { dayNumber: 18, week: 3, category: 'JAVA', title: 'Multithreading Basics', topics: ['Thread', 'Runnable', 'synchronized'], hours: 5, videos: [{ title: 'Multithreading', url: YT.kunal('5TRFpFBccQM'), source: 'Kunal Kushwaha' }], questions: [{ title: 'Print in Order', url: 'https://leetcode.com/problems/print-in-order/', difficulty: 'Easy', platform: 'LeetCode' }], revision: 'Thread lifecycle diagram.' },
  { dayNumber: 19, week: 3, category: 'JAVA', title: 'Concurrency & Executor', topics: ['ExecutorService', 'Callable', 'Future'], hours: 5, videos: [{ title: 'Concurrency Advanced', url: YT.kunal('D0-XtVwJ_ts'), source: 'Kunal Kushwaha' }], questions: [{ title: 'Print FooBar', url: 'https://leetcode.com/problems/print-foobar-alternately/', difficulty: 'Medium', platform: 'LeetCode' }], revision: 'Race conditions & deadlocks.' },
  { dayNumber: 20, week: 3, category: 'JAVA', title: 'Java Revision Sprint', topics: ['All Java topics'], hours: 5, videos: [{ title: 'Java One Shot - Apna College', url: 'https://www.youtube.com/watch?v=ldYlPM0Y0q8', source: 'Apna College' }], questions: [{ title: 'Java Quiz GFG', url: 'https://www.geeksforgeeks.org/java/', difficulty: 'Medium', platform: 'GFG' }], revision: 'Complete Java notes consolidation.' },
  { dayNumber: 21, week: 3, category: 'JAVA', title: 'Java Mock & Assessment', topics: ['Mock test', 'Weak areas'], hours: 5, videos: [{ title: 'Java Interview Questions', url: YT.kunal('yRpLlJmSvXI'), source: 'Kunal Kushwaha' }], questions: [{ title: 'Contains Duplicate', url: 'https://leetcode.com/problems/contains-duplicate/', difficulty: 'Easy', platform: 'LeetCode' }], revision: 'Java section complete — move to DSA.' },
];

// DSA days 22-45
const dsaTopics = [
  ['Arrays', 'Two Pointers', 'Sliding Window'],
  ['Hashing', 'HashMap', 'Frequency count'],
  ['Binary Search', 'Search space'],
  ['Linked List', 'Fast-slow pointers'],
  ['Stack', 'Monotonic stack'],
  ['Queue', 'Deque', 'BFS intro'],
  ['Trees', 'DFS', 'BFS'],
  ['BST', 'Traversal'],
  ['Heap', 'Priority Queue'],
  ['Graph', 'BFS', 'DFS'],
  ['Graph', 'Dijkstra', 'Topo sort'],
  ['DP', '1D DP'],
  ['DP', '2D DP'],
  ['DP', 'Knapsack'],
  ['Revision', 'Mixed DSA'],
];

const striverPlaylist = 'PLZjZj07V7eJ8JKn9n6u4l6v6l6v6l6v6';
for (let i = 0; i < 24; i++) {
  const day = 22 + i;
  const topicSet = dsaTopics[Math.min(i, dsaTopics.length - 1)];
  timelineDays.push({
    dayNumber: day,
    week: Math.ceil((day - 21) / 7) + 3,
    category: 'DSA',
    title: `DSA: ${topicSet[0]}`,
    topics: topicSet,
    hours: 5,
    videos: [
      {
        title: `Striver DSA — ${topicSet[0]}`,
        url: YT.striverPlaylist('PLZjZj07V7eJ8MNz8q8q8q8q8q8q8q8q8'),
        source: 'Striver',
      },
      {
        title: `Kunal DSA — ${topicSet[0]}`,
        url: 'https://www.youtube.com/playlist?list=PLZUvNoYYSzpBJochimA1PTcnKwu7lUTjO',
        source: 'Kunal Kushwaha',
      },
    ],
    questions: [
      {
        title: `${topicSet[0]} — LeetCode`,
        url: `https://leetcode.com/problem-list/${topicSet[0].toLowerCase().replace(/\s/g, '-')}/`,
        difficulty: i < 8 ? 'Easy' : 'Medium',
        platform: 'LeetCode',
      },
    ],
    revision: `Revise ${topicSet.join(', ')} patterns and templates.`,
    unlockDay: day,
  });
}

// CORE 46-55
const coreBlocks = [
  { cat: 'CORE', title: 'DBMS — Introduction & ER', topics: ['DBMS', 'ER Model', 'Keys'] },
  { cat: 'CORE', title: 'DBMS — SQL & Normalization', topics: ['SQL', 'Normal Forms', 'Joins'] },
  { cat: 'CORE', title: 'DBMS — Transactions & Indexing', topics: ['ACID', 'Indexing', 'B+ Tree'] },
  { cat: 'CORE', title: 'DBMS — Revision', topics: ['DBMS revision', 'Practice questions'] },
  { cat: 'CORE', title: 'OS — Processes & Threads', topics: ['Process', 'Thread', 'Scheduling'] },
  { cat: 'CORE', title: 'OS — Memory & Deadlock', topics: ['Paging', 'Deadlock', 'Synchronization'] },
  { cat: 'CORE', title: 'OS — Revision', topics: ['OS revision'] },
  { cat: 'CORE', title: 'CN — Layers & Protocols', topics: ['OSI', 'TCP/IP', 'HTTP'] },
  { cat: 'CORE', title: 'CN — IP, DNS, Security', topics: ['IP', 'DNS', 'TLS'] },
  { cat: 'CORE', title: 'Core Mock Interview', topics: ['DBMS', 'OS', 'CN', 'mixed'] },
];

coreBlocks.forEach((block, i) => {
  timelineDays.push({
    dayNumber: 46 + i,
    week: 7 + Math.floor(i / 3),
    category: block.cat,
    title: block.title,
    topics: block.topics,
    hours: 5,
    videos: [
      {
        title: block.title,
        url: 'https://www.youtube.com/playlist?list=PLyD1XCIRA3gS8n4x0xgV8J_2_2_2_2_2',
        source: 'Apna College',
      },
    ],
    questions: [
      {
        title: `${block.topics[0]} GFG`,
        url: 'https://www.geeksforgeeks.org/dbms/',
        difficulty: 'Medium',
        platform: 'GFG',
      },
    ],
    revision: block.title + ' summary notes.',
    unlockDay: 46 + i,
  });
});

// PLACEMENT 56-60
const placementDays = [
  { title: 'Resume Building', topics: ['Resume', 'ATS', 'Projects'] },
  { title: 'OA Preparation', topics: ['OA patterns', 'Timed practice'] },
  { title: 'Mock Interview 1', topics: ['DSA mock', 'Java mock'] },
  { title: 'Mock Interview 2', topics: ['Core mock', 'HR prep'] },
  { title: 'Final Sprint Review', topics: ['Full revision', 'Weak areas', 'Applications'] },
];

placementDays.forEach((p, i) => {
  timelineDays.push({
    dayNumber: 56 + i,
    week: 9,
    category: 'PLACEMENT',
    title: p.title,
    topics: p.topics,
    hours: 5,
    videos: [
      {
        title: 'Placement Preparation',
        url: 'https://www.youtube.com/watch?v=ZSPZha40v8s',
        source: 'Striver',
      },
    ],
    questions: [
      {
        title: 'Interview Preparation',
        url: 'https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/',
        difficulty: 'Medium',
        platform: 'Striver',
      },
    ],
    revision: p.title + ' checklist complete.',
    unlockDay: 56 + i,
  });
});

timelineDays.forEach((d) => {
  d.unlockDay = d.dayNumber;
});

export default timelineDays;
