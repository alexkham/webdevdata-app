// content/reference/javascript/methods/string-search.js

export const meta = {
  slug:        'string-search',
  name:        'String.prototype.search',
  signature:   'string.search(regexp)',
  blurb:       'indexOf for patterns — and it turns a plain string argument into a regex.',
  category:    'string',
  type:        'string',
  hasLiveDemo: true,
  version:     'ES3 (1999)',
  searchTerms: 'string search regex regexp index position find pattern indexOf match lastIndex minus one javascript',
};

export const method = {
  slug:      'string-search',
  name:      'String.prototype.search',
  signature: 'string.search(regexp)',
  returns:   { type: 'number', desc: 'The index where the pattern first matches, or -1 if it never does. The same sentinel as indexOf, with the same truthiness hazard.' },

  category:    'String method',
  version:     'ES3 (1999)',
  hasLiveDemo: true,

  subtitle: 'The position-finding counterpart to indexOf, for patterns instead of literal text. It takes no starting offset and it ignores a regex lastIndex entirely.',

  cheat: {
    commonCall: 's.search(/\\d/)',
    returns:    'an index, or -1',
    replaces:   'match(...).index, with its null check',
    watchOut:   "a STRING argument is compiled as a regex — search('.') is not a dot",
  },

  parameters: [
    { name: 'regexp', type: 'RegExp', required: true, default: null, desc: 'The pattern to find. A non-RegExp argument is passed to the RegExp constructor, so a plain string is interpreted as a PATTERN rather than literal text. Omitted entirely, an empty regex matches at 0.' },
  ],

  demoParams: [
    { name: 's', type: 'string', hint: 'text that may contain a digit', input: 'text' },
  ],
  demoTemplate: '{s}.search(/\\d/)',
  cases: [
    { id: 'middle',  label: 'digit in the middle', values: { s: 'abc123' } },
    { id: 'start',   label: 'digit at the start',  values: { s: '1abc' } },
    { id: 'none',    label: 'no digit → -1',       values: { s: 'abc' } },
    { id: 'empty',   label: 'empty string → -1',   values: { s: '' } },
  ],
  demoExplainer: "The result is an index, exactly like indexOf, so the same -1 sentinel applies and the same truthiness trap comes with it: a match at position 0 is falsy. The difference from indexOf is that the argument is a PATTERN — here /\\d/ finds whichever character happens to be a digit, which no literal-text search could do. What search cannot do is start from an offset; there is no second argument.",

  patterns: [
    {
      name: 'Find where a pattern starts',
      desc: 'Then slice around it.',
      code: 'const i = s.search(/\\d/);\nconst rest = i === -1 ? s : s.slice(i);',
    },
    {
      name: 'Detect a character class',
      desc: 'Where the thing you seek is a kind, not a value.',
      code: 'const hasUpper = s.search(/[A-Z]/) !== -1;',
    },
    {
      name: 'Just testing? Use test',
      desc: 'Clearer when the position is irrelevant.',
      code: 'if (/[A-Z]/.test(s)) { }',
    },
  ],

  examples: [
    { title: 'Finds a digit',      code: "'abc123'.search(/\\d/)",  returns: '3' },
    { title: 'No match',           code: "'abc'.search(/\\d/)",     returns: '-1' },
    { title: 'Match at zero',      code: "'abc'.search(/a/)",       returns: '0' },
    { title: 'A string becomes a regex', code: "'a.c'.search('.')", returns: '0' },
    { title: 'indexOf is literal', code: "'a.c'.indexOf('.')",      returns: '1' },
    { title: 'No arguments',       code: "'abc'.search()",          returns: '0' },
  ],

  pitfalls: [
    {
      name: 'A string argument is compiled as a regular expression',
      desc: 'The worst trap on this method. search(".") does not look for a dot — the string is handed to the RegExp constructor, where a dot means any character, so it matches at position 0. Anything containing regex metacharacters silently searches for the wrong thing.',
      wrong: { label: 'Dot is a wildcard', code: "'a.c'.search('.')", output: '0' },
      fix:   { label: 'indexOf for literals', code: "'a.c'.indexOf('.')", output: '1' },
    },
    {
      name: 'A match at position 0 is falsy',
      desc: 'Identical to indexOf, and identically dangerous. The -1 failure value is truthy while a successful match at the start is falsy, so a bare if on the result is wrong in both directions.',
      wrong: { label: 'Backwards', code: "if ('abc'.search(/a/)) { /* never runs */ }", output: '0 is falsy' },
      fix:   { label: 'Compare explicitly', code: "if ('abc'.search(/a/) !== -1) { }", output: 'runs' },
    },
    {
      name: 'There is no starting position argument',
      desc: 'indexOf takes one; search does not. Searching onwards from an offset means slicing first and then adding the offset back, which is easy to get off by one.',
      wrong: { label: 'No second argument', code: "'hello'.search(/l/, 3)", output: '2   // the 3 is ignored' },
      fix:   { label: 'Slice and re-add',   code: "const i = 'hello'.slice(3).search(/l/);\ni === -1 ? -1 : i + 3", output: '3' },
    },
    {
      name: 'It ignores the g flag and lastIndex',
      desc: 'Unlike exec and test, search always scans from the beginning and never updates lastIndex. That makes it safe to use with a shared global regex — and means adding /g to it accomplishes nothing at all.',
      wrong: { label: 'lastIndex ignored', code: 'const r = /a/g;\nr.lastIndex = 5;\n"aaa".search(r)', output: '0' },
      fix:   { label: 'Use exec for stateful scanning', code: 'r.exec(s)', output: 'respects lastIndex' },
    },
  ],

  when: {
    use: [
      'Finding the position of a pattern rather than literal text',
      'Locating the first character of a given class',
      'Replacing a match(...).index that needs a null guard',
    ],
    avoid: [
      'The target is literal text → indexOf, which will not reinterpret it',
      'You only need a boolean → RegExp.test',
      'You need the matched text → match or matchAll',
      'You need to search from an offset → indexOf, or slice first',
    ],
  },

  notes: {
    complexity: 'Depends on the pattern; scans from the start every time',
    return:     'A number; nothing is allocated or modified',
    cpython:    'V8: Builtins-string-search / regexp.cc',
    memory:     'No allocation for the result',
    threadSafe: 'Single-threaded; lastIndex is neither read nor written, so a shared regex is safe here',
  },

  related: [
    { name: 'String.prototype.indexOf',  slug: 'string-indexof',  when: 'Literal text, and a starting offset' },
    { name: 'String.prototype.match',    slug: 'string-match',    when: 'You want the matched text, not just where' },
    { name: 'String.prototype.matchAll', slug: 'string-matchall', when: 'Every match and its position' },
    { name: 'String.prototype.slice',    slug: 'string-slice',    when: 'Extracting around the index you found' },
  ],

  faq: [
    {
      q: 'search or indexOf?',
      a: 'indexOf for literal text — it is faster and, crucially, it will not reinterpret your argument as a pattern. search only when you genuinely need a regex. The fact that search accepts a string at all is a trap rather than a convenience.',
      code: "'a.c'.indexOf('.');   // 1 — the literal dot\n'a.c'.search('.');    // 0 — any character",
    },
    {
      q: 'search or test?',
      a: 'test when you only want to know whether the pattern is there; it returns a boolean and cannot be misread. search when you need the position too. Using search purely as a presence check works but invites the falsy-zero bug.',
      code: '/\\d/.test(s);            // boolean\ns.search(/\\d/) !== -1;   // same answer, more to get wrong',
    },
    {
      q: 'Why does search ignore the g flag?',
      a: 'Because it is specified to find only the first match, scanning from index 0 regardless of the regex state. That makes it stateless and safe with a shared regex object, unlike test and exec, whose behaviour with /g depends on how many times they have been called.',
    },
  ],

  history: [
    { version: 'ES3',    note: 'search added alongside match and replace as part of the RegExp integration.' },
    { version: 'ES2015', note: 'Symbol.search allowed custom objects to define their own search behaviour.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/search',
    meta:  'String.prototype.search',
  },

};
