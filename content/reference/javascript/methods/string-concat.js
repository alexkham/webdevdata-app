// content/reference/javascript/methods/string-concat.js

export const meta = {
  slug:        'string-concat',
  name:        'String.prototype.concat',
  signature:   'string.concat(...strings)',
  blurb:       'Join strings the long way — the + operator and template literals both beat it.',
  category:    'string',
  type:        'string',
  hasLiveDemo: true,
  version:     'ES3 (1999)',
  searchTerms: 'string concat concatenate join plus operator template literal append combine javascript',
};

export const method = {
  slug:      'string-concat',
  name:      'String.prototype.concat',
  signature: 'string.concat(...strings)',
  returns:   { type: 'string', desc: 'A new string with every argument appended in order. Non-string arguments are converted to strings first.' },

  category:    'String method',
  version:     'ES3 (1999)',
  hasLiveDemo: true,

  subtitle: 'Included for completeness rather than daily use. It does exactly what + does, more verbosely, and the array method of the same name behaves quite differently.',

  cheat: {
    commonCall: "a.concat(b)",
    returns:    'a new string',
    replaces:   'nothing — + and template literals replace IT',
    watchOut:   'Array.prototype.concat spreads arrays; this one does not',
  },

  parameters: [
    { name: '...strings', type: 'any', required: false, default: 'none', desc: 'Any number of values, each converted to a string and appended in order. With no arguments the original string is returned.' },
  ],

  demoParams: [
    { name: 'a', type: 'string', hint: 'first string',  input: 'text' },
    { name: 'b', type: 'string', hint: 'second string', input: 'text' },
  ],
  demoTemplate: '{a}.concat({b})',
  cases: [
    { id: 'words',  label: 'two words',      values: { a: 'Hello, ', b: 'world' } },
    { id: 'empty',  label: 'empty second',   values: { a: 'abc', b: '' } },
    { id: 'number', label: 'a numeric string',values: { a: 'v', b: '2' } },
    { id: 'both',   label: 'both empty',     values: { a: '', b: '' } },
  ],
  demoExplainer: "There is nothing surprising here, which is rather the point — concat appends, and that is all. Every one of these cases is written more clearly as a + b or as a template literal. The method is worth knowing mainly so that you recognise it in older code, and so that you do not confuse it with Array.prototype.concat, which flattens array arguments one level instead of appending them as text.",

  patterns: [
    {
      name: 'Use a template literal',
      desc: 'Clearest when mixing text and values.',
      code: 'const msg = `Hello, ${name}!`;',
    },
    {
      name: 'Use +',
      desc: 'Fine for two or three fragments.',
      code: "const path = base + '/' + file;",
    },
    {
      name: 'Use join for a list',
      desc: 'Better than reducing with concat.',
      code: "const csv = fields.join(',');",
    },
  ],

  examples: [
    { title: 'Two strings',     code: "'a'.concat('b')",          returns: "'ab'" },
    { title: 'Several at once', code: "'a'.concat('b', 'c')",     returns: "'abc'" },
    { title: 'Values coerced',  code: "'a'.concat(1, null)",      returns: "'a1null'" },
    { title: 'No arguments',    code: "'a'.concat()",             returns: "'a'" },
    { title: 'The + operator',  code: "'a' + 'b'",                returns: "'ab'" },
    { title: 'Array concat differs', code: "['a'].concat(['b'])", returns: "['a', 'b']" },
  ],

  pitfalls: [
    {
      name: 'It is not Array.prototype.concat',
      desc: 'Same name, different behaviour. The array version spreads array arguments one level deep; the string version converts everything to text and appends. Passing an array to the string method gives you its comma-joined form.',
      wrong: { label: 'Stringified', code: "'a'.concat([1, 2])", output: "'a1,2'" },
      fix:   { label: 'Array version', code: "['a'].concat([1, 2])", output: "['a', 1, 2]" },
    },
    {
      name: 'It throws on null or undefined receivers',
      desc: 'Calling it on a value that might be null fails, where a template literal would happily print "null". This is a general property of string methods, and concat is often reached for in exactly the string-building code where a value might be missing.',
      wrong: { label: 'Throws', code: 'let s = null;\ns.concat("x")', output: "TypeError: Cannot read properties of null (reading 'concat')" },
      fix:   { label: 'Template literal', code: 'let s = null;\n`${s}x`', output: "'nullx'" },
    },
    {
      name: 'Building a long string in a loop',
      desc: 'Repeated concatenation — with concat or with += — creates a new string each time. Modern engines optimise this well, but collecting the pieces in an array and joining once is both clearer and reliably linear.',
      wrong: { label: 'Grows quadratically in theory', code: "for (const x of xs) out = out.concat(x);", output: 'works, but noisy' },
      fix:   { label: 'Collect and join',              code: "const out = xs.join('');", output: 'one allocation' },
    },
  ],

  when: {
    use: [
      'Rarely — recognising it in existing code',
      'A functional style where a method reference is needed',
    ],
    avoid: [
      'Mixing text and values → a template literal',
      'Two or three fragments → the + operator',
      'Joining a list → Array.prototype.join',
      'The receiver may be null → a template literal, which coerces',
    ],
  },

  notes: {
    complexity: 'O(n) in the total length of the result',
    return:     'A new string; the original is untouched',
    cpython:    'V8: Builtins-string-concat',
    memory:     'Engines often build a rope rather than copying immediately',
    threadSafe: 'Single-threaded; the strings are only read',
  },

  related: [
    { name: 'Array.prototype.join',    slug: 'array-join',      when: 'Assembling a list into one string' },
    { name: 'Array.prototype.concat',  slug: 'array-concat',    when: 'The array method with the same name' },
    { name: 'String.prototype.repeat', slug: 'string-repeat',   when: 'Copies of one string rather than different ones' },
    { name: 'String.prototype.padEnd', slug: 'string-padend',   when: 'Appending to reach a width' },
  ],

  faq: [
    {
      q: 'Is concat faster than +?',
      a: 'No. Engines optimise + heavily and it is the form they expect, so concat is at best equal and often slightly worse. Choose on readability, which also favours + and template literals.',
    },
    {
      q: 'Why does it exist if + already does this?',
      a: 'It came from ES3, mirroring Array.prototype.concat for symmetry, in an era before template literals. It has simply been superseded — nothing was removed because nothing in the language ever is.',
    },
    {
      q: 'Should I use join instead?',
      a: 'For a list of pieces, yes. join allocates once and makes the separator explicit, which is exactly what a chain of concatenations obscures.',
      code: "parts.join('');",
    },
  ],

  history: [
    { version: 'ES3',    note: 'concat added for symmetry with the array method.' },
    { version: 'ES2015', note: 'Template literals arrived and became the idiomatic way to build strings.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/concat',
    meta:  'String.prototype.concat',
  },

  tryInTool: [],
};
