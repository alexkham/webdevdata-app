// content/reference/javascript/methods/string-matchall.js

export const meta = {
  slug:        'string-matchall',
  name:        'String.prototype.matchAll',
  signature:   'string.matchAll(regexp)',
  blurb:       'Every match WITH its capture groups — the one thing match cannot do.',
  category:    'string',
  type:        'string',
  hasLiveDemo: true,
  version:     'ES2020',
  searchTerms: 'string matchAll match all iterator capture groups named groups global regex exec loop spread es2020 javascript',
};

export const method = {
  slug:      'string-matchall',
  name:      'String.prototype.matchAll',
  signature: 'string.matchAll(regexp)',
  returns:   { type: 'Iterator', desc: 'An ITERATOR of full match objects, each with capture groups, index and input. Not an array — spread it or loop it. Empty rather than null when nothing matches.' },

  category:    'String method',
  version:     'ES2020',
  hasLiveDemo: true,

  subtitle: 'The method that closed the gap: match with /g gives every match but drops the groups, and without /g keeps the groups but finds only one. This gives you both.',

  cheat: {
    commonCall: '[...s.matchAll(re)]',
    returns:    'an iterator of match objects — spread it',
    replaces:   'a while loop over regex.exec',
    watchOut:   'the regex MUST have the g flag or it throws',
  },

  parameters: [
    { name: 'regexp', type: 'RegExp', required: true, default: null, desc: 'The pattern, which must carry the g flag — a non-global regex is a TypeError, exactly as with replaceAll.' },
  ],

  demoParams: [
    { name: 's', type: 'string', hint: 'text containing numbers', input: 'text' },
  ],
  demoTemplate: '[...{s}.matchAll(/\\d+/g)].map(m => m[0])',
  cases: [
    { id: 'several', label: 'several numbers',     values: { s: 'a1b22c333' } },
    { id: 'one',     label: 'a single number',     values: { s: 'order 42' } },
    { id: 'none',    label: 'no match → [] (!)',   values: { s: 'abc' } },
    { id: 'empty',   label: 'empty string → []',   values: { s: '' } },
  ],
  demoExplainer: "The demo spreads the iterator and takes m[0], the whole match, so the output is comparable with the match page — but each m is a full match object, so m[1] would be the first capture group and m.index its position. Compare the third case directly with match: where match returns NULL and throws on .length, matchAll returns an empty iterator that spreads to an empty array. That alone removes the most common regex bug in JavaScript.",

  patterns: [
    {
      name: 'Every match with its groups',
      desc: 'The reason the method exists.',
      code: 'const pairs = [...s.matchAll(/(\\w)=(\\d)/g)].map(m => [m[1], m[2]]);',
    },
    {
      name: 'Named groups read better',
      desc: 'm.groups is an object keyed by group name.',
      code: 'for (const m of s.matchAll(/(?<key>\\w+)=(?<value>\\d+)/g)) {\n  console.log(m.groups.key, m.groups.value);\n}',
    },
    {
      name: 'Positions of every match',
      desc: 'index is on each match object.',
      code: 'const positions = [...s.matchAll(re)].map(m => m.index);',
    },
  ],

  examples: [
    { title: 'Whole matches',    code: "[...'a1b2'.matchAll(/\\d/g)].map(m => m[0])", returns: "['1', '2']" },
    { title: 'No match is empty',code: "[...'abc'.matchAll(/\\d/g)]",                 returns: '[]' },
    { title: 'match gives null', code: "'abc'.match(/\\d/g)",                         returns: 'null' },
    { title: 'Groups preserved', code: "[...'a1'.matchAll(/(\\w)(\\d)/g)].map(m => m[1])", returns: "['a']" },
    { title: 'match loses them', code: "'a1'.match(/(\\w)(\\d)/g)",                   returns: "['a1']" },
    { title: 'Non-global throws',code: "[...'a1'.matchAll(/\\d/)]",                   returns: 'TypeError: String.prototype.matchAll called with a non-global RegExp argument' },
  ],

  pitfalls: [
    {
      name: 'It returns an iterator, not an array',
      desc: 'Array methods are not available on the result — .length, .map and .filter are all undefined. Spread it or use Array.from first, or loop it directly with for...of.',
      wrong: { label: 'Not an array', code: "'a1'.matchAll(/\\d/g).length", output: 'undefined' },
      fix:   { label: 'Spread it',    code: "[...'a1'.matchAll(/\\d/g)].length", output: '1' },
    },
    {
      name: 'The iterator is single-use',
      desc: 'Once consumed it is exhausted, so spreading it twice gives an array and then an empty one. If you need the matches more than once, materialise them into an array and reuse that.',
      wrong: { label: 'Second is empty', code: 'const it = s.matchAll(re);\n[...it].length;\n[...it].length', output: 'n, then 0' },
      fix:   { label: 'Store the array', code: 'const all = [...s.matchAll(re)];', output: 'reusable' },
    },
    {
      name: 'A non-global regex throws',
      desc: 'The same rule as replaceAll, for the same reason — the name promises every match, so a pattern that could only find one is rejected rather than silently misbehaving.',
      wrong: { label: 'Throws', code: "[...'a1'.matchAll(/\\d/)]", output: 'TypeError: String.prototype.matchAll called with a non-global RegExp argument' },
      fix:   { label: 'Add the flag', code: "[...'a1'.matchAll(/\\d/g)]", output: 'one match object' },
    },
    {
      name: 'A zero-length match needs care in hand-rolled loops',
      desc: 'matchAll advances lastIndex itself, so a pattern that can match an empty string is handled safely. The exec loop it replaces does not — forgetting to advance manually there spins forever, which is the other reason to stop writing them.',
      wrong: { label: 'Infinite exec loop', code: 'while ((m = /a*/g.exec(s)) !== null) { }', output: 'hangs' },
      fix:   { label: 'matchAll is safe',   code: 'for (const m of s.matchAll(/a*/g)) { }', output: 'terminates' },
    },
  ],

  when: {
    use: [
      'Every match together with its capture groups',
      'Named groups across multiple matches',
      'The index of each match in a single pass',
      'Anywhere a while-exec loop would otherwise appear',
    ],
    avoid: [
      'You only want the whole matches → match with g is shorter',
      'You only need a boolean → RegExp.test',
      'The pattern is literal text → includes, indexOf or split',
      'Targeting runtimes older than 2020 → an exec loop, carefully',
    ],
  },

  notes: {
    complexity: 'Depends on the pattern; lazy — matches are found as you iterate',
    return:     'An iterator of match arrays; the string is untouched',
    cpython:    'V8: Builtins-string-matchall / regexp.cc',
    memory:     'Lazy, so the whole result set need not be held at once unless you spread it',
    threadSafe: 'Single-threaded; matchAll clones the regex internally, so lastIndex on yours is not disturbed',
  },

  related: [
    { name: 'String.prototype.match',      slug: 'string-match',      when: 'Whole matches only, or a single match with groups' },
    { name: 'String.prototype.replace',    slug: 'string-replace',    when: 'A function replacer also sees every group' },
    { name: 'String.prototype.replaceAll', slug: 'string-replaceall', when: 'The same global-flag rule applies there' },
    { name: 'String.prototype.split',      slug: 'string-split',      when: 'A capturing separator also yields the groups' },
  ],

  faq: [
    {
      q: 'Why does it return an iterator rather than an array?',
      a: 'So it can be lazy. A pattern over a very large string need not build every match up front, and for...of can stop early. Spreading it into an array when you want one is a single extra character of syntax.',
      code: 'for (const m of s.matchAll(re)) { if (done) break; }',
    },
    {
      q: 'What is in each match object?',
      a: 'The same shape match gives you without the g flag: index 0 is the whole match, subsequent indices are the capture groups, and it carries index, input and groups properties. That is exactly what match with g throws away.',
      code: 'const [whole, first, second] = m;\nm.index;\nm.groups?.name;',
    },
    {
      q: 'Does it disturb my regex object?',
      a: 'No — it clones the regex internally, so the lastIndex of the one you passed is left alone. That is a genuine improvement over the exec loop, where a shared /g regex is a well-known source of order-dependent bugs.',
    },
    {
      q: 'How do I get just the matched text?',
      a: 'Map over the whole-match element. If that is all you ever need, match with the g flag is shorter — matchAll earns its keep when you want the groups too.',
      code: "[...s.matchAll(re)].map(m => m[0]);\ns.match(re) ?? [];   // simpler for this case",
    },
  ],

  history: [
    { version: 'ES2020', note: 'matchAll added, resolving the long-standing groups-versus-global tradeoff in match.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/matchAll',
    meta:  'String.prototype.matchAll',
  },

  tryInTool: [],
};
