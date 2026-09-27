// content/reference/javascript/methods/string-localecompare.js

export const meta = {
  slug:        'string-localecompare',
  name:        'String.prototype.localeCompare',
  signature:   'string.localeCompare(other[, locales[, options]])',
  blurb:       'Sort text the way humans read it — because < compares UTF-16 numbers, not letters.',
  category:    'string',
  type:        'string',
  hasLiveDemo: true,
  version:     'ES3 (1999)',
  searchTerms: 'string localeCompare sort alphabetical collation locale accent case sensitivity numeric natural sort intl javascript',
};

export const method = {
  slug:      'string-localecompare',
  name:      'String.prototype.localeCompare',
  signature: 'string.localeCompare(other[, locales[, options]])',
  returns:   { type: 'number', desc: 'Negative if this string sorts before the other, positive if after, 0 if they compare equal. The exact magnitude is unspecified — only the sign is meaningful.' },

  category:    'String method',
  version:     'ES3 (1999)',
  hasLiveDemo: true,

  subtitle: 'The only correct way to sort text for people. Comparing strings with < orders them by UTF-16 code unit, which puts every capital before every lowercase letter and every accent after z.',

  cheat: {
    commonCall: 'items.sort((a, b) => a.localeCompare(b))',
    returns:    'a negative number, zero, or a positive number',
    replaces:   'a < b comparison, which is wrong for text',
    watchOut:   'only the SIGN is specified — never compare against -1',
  },

  parameters: [
    { name: 'other',   type: 'string', required: true,  default: null,        desc: 'The string to compare against.' },
    { name: 'locales', type: 'string | string[]', required: false, default: 'host default', desc: 'A BCP 47 language tag such as "de" or "sv". The ordering genuinely differs between languages.' },
    { name: 'options', type: 'object', required: false, default: '{}',        desc: 'Intl.Collator options — sensitivity, numeric, caseFirst, ignorePunctuation. sensitivity "base" makes the comparison ignore case and accents.' },
  ],

  demoParams: [
    { name: 'a', type: 'string', hint: 'first string',  input: 'text' },
    { name: 'b', type: 'string', hint: 'second string', input: 'text' },
  ],
  demoTemplate: '{a}.localeCompare({b})',
  cases: [
    { id: 'before',  label: 'a before b',          values: { a: 'a', b: 'b' } },
    { id: 'after',   label: 'b after a',           values: { a: 'b', b: 'a' } },
    { id: 'equal',   label: 'identical',           values: { a: 'a', b: 'a' } },
    { id: 'case',    label: 'a vs B (!)',          values: { a: 'a', b: 'B' } },
    { id: 'accent',  label: 'accented letter',     values: { a: 'é', b: 'e' } },
  ],
  demoExplainer: "The sign is the whole answer: negative means the first string sorts first. The fourth case is the one that matters — 'a'.localeCompare('B') is negative, because collation understands that a comes before b regardless of case. Compare that with the < operator, where 'a' < 'B' is FALSE, because the code unit for B is 66 and for a is 97. That single difference is why a plain sort() puts Zebra before apple.",

  patterns: [
    {
      name: 'Sort an array of strings',
      desc: 'The correct default for any user-visible list.',
      code: 'names.sort((a, b) => a.localeCompare(b));',
    },
    {
      name: 'Natural sort for numbered items',
      desc: 'So item10 comes after item9.',
      code: "files.sort((a, b) => a.localeCompare(b, undefined, {numeric: true}));",
    },
    {
      name: 'Reuse a collator when sorting a lot',
      desc: 'Intl.Collator is much faster across many comparisons.',
      code: 'const c = new Intl.Collator();\nnames.sort(c.compare);',
    },
  ],

  examples: [
    { title: 'a before b',        code: "'a'.localeCompare('b')",   returns: '-1' },
    { title: 'Case handled',      code: "'a'.localeCompare('B')",   returns: '-1' },
    { title: 'The < operator is not', code: "'a' < 'B'",            returns: 'false' },
    { title: 'German ä near a',   code: "'ä'.localeCompare('z', 'de')", returns: '-1' },
    { title: 'Swedish ä after z', code: "'ä'.localeCompare('z', 'sv')", returns: '1' },
    { title: 'Numeric collation', code: "'10'.localeCompare('9', undefined, {numeric: true})", returns: '1' },
  ],

  pitfalls: [
    {
      name: 'Plain sort() is lexicographic, not alphabetical',
      desc: 'Array.prototype.sort with no comparator converts to strings and compares code units, so every capital letter sorts before every lowercase one and accented letters land after z. Any list a person will read needs a comparator.',
      wrong: { label: 'Accents land after z', code: "['zebra', 'äpfel', 'apple'].sort()", output: "['apple', 'zebra', 'äpfel']" },
      fix:   { label: 'Collated',             code: "['zebra', 'äpfel', 'apple'].sort((a, b) => a.localeCompare(b))", output: "['äpfel', 'apple', 'zebra']" },
    },
    {
      name: 'Only the sign is specified',
      desc: 'Implementations may return any negative or positive number, not just -1 and 1. Code that compares the result against -1 exactly will work in one engine and silently fail in another.',
      wrong: { label: 'Assumes -1', code: "if (a.localeCompare(b) === -1) { }", output: 'engine-dependent' },
      fix:   { label: 'Test the sign', code: 'if (a.localeCompare(b) < 0) { }', output: 'always correct' },
    },
    {
      name: 'It is slow in a sort loop',
      desc: 'Each call may construct a fresh collator. Sorting a few thousand strings this way is noticeably slower than building one Intl.Collator and reusing its compare method, which is the same algorithm without the setup.',
      wrong: { label: 'Rebuilds each time', code: 'items.sort((a, b) => a.localeCompare(b))', output: 'fine for short lists' },
      fix:   { label: 'Reuse a collator',   code: 'const c = new Intl.Collator();\nitems.sort(c.compare);', output: 'much faster' },
    },
    {
      name: 'The order depends on the locale, by design',
      desc: 'Swedish sorts ä after z; German sorts it with a. That is correct behaviour, not a bug — but it means the same array sorts differently for different users, so never store a locale-sorted order as if it were canonical.',
      wrong: { label: 'Locale-dependent', code: "'ä'.localeCompare('z', 'sv')", output: '1' },
      fix:   { label: 'Fixed locale for storage', code: "'ä'.localeCompare('z', 'de')", output: '-1' },
    },
  ],

  when: {
    use: [
      'Sorting any list a person will read',
      'Case- and accent-insensitive comparison, via sensitivity options',
      'Natural sorting of names containing numbers',
      'Comparing text where the user locale should decide the order',
    ],
    avoid: [
      'Sorting many thousands of items → Intl.Collator, reused',
      'You only need equality of identical bytes → === after normalize',
      'Sorting identifiers or keys → a plain comparison is fine and stable',
      'You need a stable order across locales → pin the locale explicitly',
    ],
  },

  notes: {
    complexity: 'O(n) per comparison, with substantial constant cost from collation',
    return:     'A number whose SIGN is meaningful; magnitude is unspecified',
    cpython:    'V8: Builtins-string-localecompare / ICU collator',
    memory:     'May allocate a collator per call unless one is reused',
    threadSafe: 'Single-threaded; the strings are only read',
  },

  related: [
    { name: 'String.prototype.normalize',   slug: 'string-normalize',   when: 'Encoding differences, which collation also handles' },
    { name: 'String.prototype.toLowerCase', slug: 'string-tolowercase', when: 'A crude case-insensitive compare' },
    { name: 'Array.prototype.sort',         slug: 'array-sort',         when: 'The method that needs this as its comparator' },
    { name: 'Array.prototype.toSorted',     slug: 'array-tosorted',     when: 'Sorting without mutating the array' },
  ],

  faq: [
    {
      q: 'Why not just use a < b?',
      a: 'Because that compares UTF-16 code units. Every capital letter has a lower number than every lowercase letter, so "Zebra" sorts before "apple", and accented characters sit above z entirely — a plain sort puts "äpfel" after "zebra". It is fast and correct for machine keys, and wrong for anything a human reads.',
      code: "'a' < 'B';                  // false — B is code unit 66\n'a'.localeCompare('B') < 0; // true — a comes first\n['zebra', 'äpfel'].sort();  // ['zebra', 'äpfel']",
    },
    {
      q: 'How do I sort case- and accent-insensitively?',
      a: 'Pass a sensitivity option. "base" ignores both case and accents; "accent" ignores case but keeps accents distinct. This is also how you test equality in a locale-aware way — a result of 0 means they compare equal.',
      code: "a.localeCompare(b, undefined, {sensitivity: 'base'});",
    },
    {
      q: 'How do I get item2 to sort before item10?',
      a: 'The numeric option makes runs of digits compare as numbers rather than text. Without it, string comparison puts "10" before "9" because 1 comes before 9.',
      code: "a.localeCompare(b, undefined, {numeric: true});",
    },
    {
      q: 'localeCompare or Intl.Collator?',
      a: 'They do the same work. localeCompare is convenient for a one-off comparison; Intl.Collator is the right choice inside a sort, because it builds the collation data once instead of potentially rebuilding it for every pair.',
      code: 'const collator = new Intl.Collator(undefined, {numeric: true});\nitems.sort(collator.compare);',
    },
  ],

  history: [
    { version: 'ES3',    note: 'localeCompare added with implementation-defined behaviour.' },
    { version: 'ES2012', note: 'ECMA-402 gave it the locales and options arguments, tying it to Intl.Collator.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare',
    meta:  'String.prototype.localeCompare',
  },

  tryInTool: [],
};
