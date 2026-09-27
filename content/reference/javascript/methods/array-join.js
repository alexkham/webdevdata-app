// content/reference/javascript/methods/array-join.js

export const meta = {
  slug:        'array-join',
  name:        'Array.prototype.join',
  signature:   'array.join([separator])',
  blurb:       'Concatenate elements into a string — null and undefined become EMPTY, not "null".',
  category:    'array',
  type:        'array',
  hasLiveDemo: true,
  version:     'ES1 (1997)',
  searchTerms: 'array join concatenate string separator delimiter comma implode toString javascript',
};

export const method = {
  slug:      'array-join',
  name:      'Array.prototype.join',
  signature: 'array.join([separator])',
  returns:   { type: 'string', desc: 'All elements converted to strings and concatenated with the separator between them. An empty array gives an empty string.' },

  category:    'Array method',
  version:     'ES1 (1997)',
  hasLiveDemo: true,

  subtitle: 'Straightforward until a null sneaks in — nullish elements become empty strings rather than the text "null", producing doubled separators that are easy to misread as a data bug.',

  cheat: {
    commonCall: "items.join(', ')",
    returns:    'a string; empty array gives an empty string',
    replaces:   'a reduce that concatenates with a separator',
    watchOut:   'the DEFAULT separator is a comma, not an empty string',
  },

  parameters: [
    { name: 'separator', type: 'string', required: false, default: "','", desc: 'Placed between elements. Defaults to a comma — pass an empty string to concatenate with nothing between.' },
  ],

  demoParams: [
    { name: 'items',     type: 'string[]', hint: 'items, comma separated', input: 'csv' },
    { name: 'separator', type: 'string',   hint: 'separator',              input: 'text' },
  ],
  demoTemplate: '{items}.join({separator})',
  cases: [
    { id: 'dash',   label: 'dash separator',  values: { items: 'a,b,c', separator: '-' } },
    { id: 'space',  label: 'space separator', values: { items: 'a,b,c', separator: ' ' } },
    { id: 'none',   label: 'empty separator', values: { items: 'a,b,c', separator: '' } },
    { id: 'single', label: 'single element',  values: { items: 'only',  separator: '-' } },
    { id: 'empty',  label: 'empty array',     values: { items: '',      separator: '-' } },
  ],
  demoExplainer: 'The separator goes BETWEEN elements, never at the ends — so three elements produce two separators. A single element produces none at all, and an empty array gives an empty string rather than the separator or null. An empty separator concatenates the elements directly, which is the usual way to build a string from characters.',

  patterns: [
    {
      name: 'Build a human-readable list',
      desc: 'The most common use.',
      code: "const label = tags.join(', ');",
    },
    {
      name: 'Concatenate with nothing between',
      desc: 'An empty separator, not the default.',
      code: "const word = chars.join('');",
    },
    {
      name: 'Build a path or query',
      desc: 'Any delimiter-separated format.',
      code: "const path = segments.join('/');",
    },
  ],

  examples: [
    { title: 'Dash separated',   code: "[1, 2, 3].join('-')",       returns: "'1-2-3'" },
    { title: 'Default is comma', code: '[1, 2, 3].join()',          returns: "'1,2,3'" },
    { title: 'Empty separator',  code: "['a', 'b'].join('')",       returns: "'ab'" },
    { title: 'null becomes empty', code: "[1, null, 3].join('-')",  returns: "'1--3'" },
    { title: 'Empty array',      code: "[].join('-')",              returns: "''" },
    { title: 'Nested uses commas', code: "[1, [2, 3]].join('-')",   returns: "'1-2,3'" },
  ],

  pitfalls: [
    {
      name: 'null and undefined become empty strings',
      desc: 'Not the text "null" — nothing at all. The result is two separators in a row, which reads like a formatting bug rather than missing data and is easy to skim past.',
      wrong: { label: 'Doubled separator', code: "[1, null, 3].join('-')", output: "'1--3'" },
      fix:   { label: 'Filter first',      code: "[1, null, 3].filter(x => x != null).join('-')", output: "'1-3'" },
    },
    {
      name: 'The default separator is a comma, not empty',
      desc: 'join() with no argument inserts commas. Code expecting plain concatenation gets commas everywhere — pass an empty string explicitly.',
      wrong: { label: 'Commas appear', code: "['a', 'b', 'c'].join()", output: "'a,b,c'" },
      fix:   { label: 'Empty string',  code: "['a', 'b', 'c'].join('')", output: "'abc'" },
    },
    {
      name: 'Nested arrays use their own commas',
      desc: 'An inner array is converted with its own toString, which always uses commas regardless of the separator you passed. The output mixes two delimiters.',
      wrong: { label: 'Mixed delimiters', code: "[1, [2, 3]].join('-')", output: "'1-2,3'" },
      fix:   { label: 'Flatten first',    code: "[1, [2, 3]].flat().join('-')", output: "'1-2-3'" },
    },
    {
      name: 'Objects become [object Object]',
      desc: 'join calls String() on every element, and a plain object stringifies to [object Object]. Map to a field first if you wanted something readable.',
      wrong: { label: 'Useless output', code: "[{n: 1}, {n: 2}].join(', ')", output: "'[object Object], [object Object]'" },
      fix:   { label: 'Map to a field', code: "[{n: 1}, {n: 2}].map(o => o.n).join(', ')", output: "'1, 2'" },
    },
  ],

  when: {
    use: [
      'Turning an array into a human-readable string',
      'Building delimiter-separated formats like paths and CSV rows',
      'Concatenating characters with an empty separator',
    ],
    avoid: [
      'The array may hold null or undefined → filter first',
      'The elements are objects → map to a field first',
      'You need real CSV escaping → a CSV library, not join',
    ],
  },

  notes: {
    complexity: 'O(n) in the total output length',
    return:     'A new string; the array is never modified',
    cpython:    'V8: Builtins-array-join.tq, with a fast path for flat string arrays',
    memory:     'Allocates the result string',
    threadSafe: 'Single-threaded; the source is only read',
  },

  related: [
    { name: 'Array.prototype.map',    slug: 'array-map',    when: 'Convert elements to strings before joining' },
    { name: 'Array.prototype.filter', slug: 'array-filter', when: 'Drop nullish elements before joining' },
    { name: 'Array.prototype.flat',   slug: 'array-flat',   when: 'Flatten so nested arrays do not add commas' },
    { name: 'Array.prototype.toString', slug: 'array-tostring', when: 'The implicit comma-join that runs on string coercion' },
  ],

  faq: [
    {
      q: 'Why do I get two separators together?',
      a: 'Because an element was null or undefined, and join converts both to an empty string rather than to text. The separators on either side end up adjacent. Filter the array first if nullish values are possible.',
      code: "[1, null, 3].join('-')   // '1--3'",
    },
    {
      q: 'How do I concatenate with nothing between?',
      a: "Pass an empty string. join() with no argument uses a comma, which catches people expecting plain concatenation.",
      code: "chars.join('')",
    },
    {
      q: 'Why does a nested array use commas?',
      a: 'Because join stringifies each element, and an array stringifies via its own toString, which is always comma-separated. Flatten the array first so every element is a scalar.',
      code: "[1, [2, 3]].flat().join('-')   // '1-2-3'",
    },
  ],

  history: [
    { version: 'ES1', note: 'join has been present since the first standard in 1997.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join',
    meta:  'Array.prototype.join',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect array data before joining' },
  ],
};
