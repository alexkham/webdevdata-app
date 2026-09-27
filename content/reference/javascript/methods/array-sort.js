// content/reference/javascript/methods/array-sort.js

export const meta = {
  slug:        'array-sort',
  name:        'Array.prototype.sort',
  signature:   'array.sort([compareFn])',
  blurb:       'Sorts IN PLACE, and by default compares as STRINGS — so [10, 9, 1] becomes [1, 10, 9].',
  category:    'array',
  type:        'array',
  hasLiveDemo: true,
  version:     'ES1 (1997)',
  searchTerms: 'array sort order compare comparator mutate in place lexicographic numbers toSorted javascript',
};

export const method = {
  slug:      'array-sort',
  name:      'Array.prototype.sort',
  signature: 'array.sort([compareFn])',
  returns:   { type: 'Array', desc: 'The SAME array, sorted in place. The return value is a reference to the original, not a copy.' },

  category:    'Array method',
  version:     'ES1 (1997)',
  hasLiveDemo: true,

  subtitle: 'Two traps in one method: it mutates the array you gave it, and without a comparator it sorts numbers as strings. Both are visible in the demo below.',

  cheat: {
    commonCall: 'items.sort((a, b) => a - b)',
    returns:    'the same array, mutated — not a copy',
    replaces:   'nothing; but toSorted() is the non-mutating version',
    watchOut:   'the default comparator converts everything to a STRING',
  },

  parameters: [
    { name: 'compareFn', type: 'Function', required: false, default: 'string comparison', desc: 'Called as compareFn(a, b). Return a negative number to place a first, positive to place b first, 0 to treat them as equal. Omitted, elements are converted to strings and compared by UTF-16 code unit.' },
  ],

  demoParams: [
    { name: 'items', type: 'number[]', hint: 'numbers, comma separated', input: 'csv-num' },
  ],
  demoTemplate: '{items}.sort()',
  cases: [
    { id: 'classic',  label: 'the classic trap',   values: { items: '10,9,1' } },
    { id: 'single',   label: 'single digits — ok', values: { items: '3,1,2' } },
    { id: 'tens',     label: 'unchanged (!)',      values: { items: '1,10,2' } },
    { id: 'hundreds', label: 'also unchanged (!)', values: { items: '100,25,3' } },
    { id: 'empty',    label: 'empty array',        values: { items: '' } },
  ],
  demoExplainer: 'Look at the first case: [10, 9, 1] sorts to [1, 10, 9], not [1, 9, 10]. Without a comparator every element is converted to a STRING first, and "10" sorts before "9" because the character 1 comes before 9. Now look at the last two number cases — [1, 10, 2] and [100, 25, 3] come back completely UNCHANGED, because they were already in string order. And the single-digit case sorts perfectly, because for one digit string order and numeric order agree. That is why this bug survives testing so reliably: it is invisible on small numbers and silent on the rest. Pass (a, b) => a - b whenever the elements are numbers.',

  patterns: [
    {
      name: 'Sort numbers correctly',
      desc: 'The comparator every numeric sort needs.',
      code: 'items.sort((a, b) => a - b);',
    },
    {
      name: 'Sort without mutating',
      desc: 'Copy first, or use toSorted on modern runtimes.',
      code: 'const sorted = [...items].sort((a, b) => a - b);\nconst sorted2 = items.toSorted((a, b) => a - b);  // ES2023',
    },
    {
      name: 'Sort objects by a field',
      desc: 'localeCompare for strings, subtraction for numbers.',
      code: 'users.sort((a, b) => a.name.localeCompare(b.name));',
    },
  ],

  examples: [
    { title: 'The classic trap',   code: '[10, 9, 1].sort()',                  returns: '[1, 10, 9]' },
    { title: 'With a comparator',  code: '[10, 9, 1].sort((a, b) => a - b)',   returns: '[1, 9, 10]' },
    { title: 'Strings are fine',   code: "['b', 'a'].sort()",                  returns: "['a', 'b']" },
    { title: 'It mutates',         code: 'const a = [3, 1];\na.sort();\na',    returns: '[1, 3]' },
    { title: 'Returns the same array', code: 'const a = [3, 1];\na.sort() === a', returns: 'true' },
    { title: 'Non-mutating',       code: '[10, 9, 1].toSorted((a, b) => a - b)', returns: '[1, 9, 10]' },
  ],

  pitfalls: [
    {
      name: 'The default comparator sorts numbers as strings',
      desc: 'The most reported JavaScript surprise there is. Elements are converted to strings and compared character by character, so "10" < "9". Arrays of single digits sort correctly by coincidence, which lets the bug through review.',
      wrong: { label: 'String order', code: '[10, 9, 1].sort()', output: '[1, 10, 9]' },
      fix:   { label: 'Numeric comparator', code: '[10, 9, 1].sort((a, b) => a - b)', output: '[1, 9, 10]' },
    },
    {
      name: 'It mutates the array in place',
      desc: 'sort does not return a copy — it reorders the original and hands back the same reference. Sorting a prop, a cached array or anything shared changes it for every other holder.',
      wrong: { label: 'Source reordered', code: 'const a = [3, 1];\nconst b = a.sort();\na', output: '[1, 3]  // a changed too' },
      fix:   { label: 'Copy first',       code: 'const b = [...a].sort();', output: 'a is untouched' },
    },
    {
      name: 'A comparator returning a boolean is broken',
      desc: 'sort needs a NUMBER. A boolean coerces to 1 or 0 and never to a negative, so the comparator can never say "a comes first" — the result is subtly and inconsistently wrong rather than reversed.',
      wrong: { label: 'Boolean returned', code: '[3, 1, 2].sort((a, b) => a > b)', output: '[3, 1, 2]  // V8 leaves it untouched' },
      fix:   { label: 'Return a number',  code: '[3, 1, 2].sort((a, b) => a - b)', output: '[1, 2, 3]' },
    },
    {
      name: 'a - b breaks on strings',
      desc: 'Subtraction on non-numeric strings gives NaN, and a NaN comparator result is treated as 0 — so the array comes back in whatever order it started. Use localeCompare for text.',
      wrong: { label: 'NaN comparator', code: "['b', 'a'].sort((a, b) => a - b)", output: "['b', 'a']  // unchanged" },
      fix:   { label: 'localeCompare',  code: "['b', 'a'].sort((a, b) => a.localeCompare(b))", output: "['a', 'b']" },
    },
  ],

  when: {
    use: [
      'Ordering an array you own and are happy to mutate',
      'Any sort where you can supply an explicit comparator',
      'Sorting objects by a field with localeCompare or subtraction',
    ],
    avoid: [
      'The array is shared or a prop → copy first, or use toSorted',
      'You have not written a comparator and the elements are numbers',
      'You need a stable numeric sort of mixed types → normalise first',
    ],
  },

  notes: {
    complexity: 'O(n log n); stable since ES2019, so equal elements keep their relative order',
    return:     'The same array object, reordered — not a copy',
    cpython:    'V8: TimSort, in third_party/v8/builtins/array-sort.tq',
    memory:     'In place, aside from TimSort\'s temporary merge buffer',
    threadSafe: 'Single-threaded; a comparator that mutates the array gives undefined behaviour',
  },

  related: [
    { name: 'Array.prototype.slice',  slug: 'array-slice',  when: 'Copy before sorting to avoid mutating' },
    { name: 'Array.prototype.filter', slug: 'array-filter', when: 'Narrow the array before ordering it' },
    { name: 'Array.prototype.map',    slug: 'array-map',    when: 'Transform without changing order' },
    { name: 'Array.prototype.reduce', slug: 'array-reduce', when: 'Aggregate after ordering' },
  ],

  faq: [
    {
      q: 'Why does [10, 9, 1].sort() give [1, 10, 9]?',
      a: 'Because the default comparator converts every element to a string and compares UTF-16 code units. "10" begins with the character 1, which sorts before 9, so 10 lands before 9. Pass (a, b) => a - b for numbers.',
      code: '[10, 9, 1].sort((a, b) => a - b)\n// [1, 9, 10]',
    },
    {
      q: 'How do I sort without changing the original?',
      a: 'Copy first with a spread or slice, or use toSorted, which returns a new array and leaves the source alone. toSorted is ES2023, so check your runtime before relying on it.',
      code: 'const sorted = [...items].sort(cmp);\nconst sorted2 = items.toSorted(cmp);',
    },
    {
      q: 'Is sort stable?',
      a: 'Yes, since ES2019 it is required to be — elements the comparator calls equal keep their original relative order. Before that it varied by engine, so older code sometimes sorted twice to force a tie-break.',
    },
  ],

  history: [
    { version: 'ES1', note: 'sort has been present since the first standard in 1997, string comparator and all.' },
    { version: 'ES2019', note: 'Stability became a requirement rather than an engine detail.' },
    { version: 'ES2023', note: 'toSorted added — the non-mutating counterpart, alongside toReversed and toSpliced.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort',
    meta:  'Array.prototype.sort',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect array data before sorting' },
  ],
};
