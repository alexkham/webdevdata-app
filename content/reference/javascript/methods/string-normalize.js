// content/reference/javascript/methods/string-normalize.js
//
// The demo lists CODE POINTS in hex rather than returning the string,
// because composed and decomposed forms render identically — showing the
// string itself would make the method look like a no-op.

export const meta = {
  slug:        'string-normalize',
  name:        'String.prototype.normalize',
  signature:   'string.normalize([form])',
  blurb:       'Why two identical-looking strings compare unequal — and the fix.',
  category:    'string',
  type:        'string',
  hasLiveDemo: true,
  version:     'ES2015',
  searchTerms: 'string normalize NFC NFD NFKC NFKD unicode combining accent diacritic equality compare canonical es2015 javascript',
};

export const method = {
  slug:      'string-normalize',
  name:      'String.prototype.normalize',
  signature: 'string.normalize([form])',
  returns:   { type: 'string', desc: 'The string converted to the requested Unicode normalization form. Default is NFC, the composed form most systems expect.' },

  category:    'String method',
  version:     'ES2015',
  hasLiveDemo: true,

  subtitle: 'The answer to "these two strings look the same but are not equal". An accented letter can be stored as one code point or as a base letter plus a combining mark, and === cannot tell you which you have.',

  cheat: {
    commonCall: "s.normalize('NFC')",
    returns:    'a new string in that normal form',
    replaces:   'nothing; there is no other way to do this',
    watchOut:   'NFKC is LOSSY — it rewrites characters, not just recomposes them',
  },

  parameters: [
    { name: 'form', type: 'string', required: false, default: "'NFC'", desc: "One of 'NFC', 'NFD', 'NFKC', 'NFKD'. The C forms compose, the D forms decompose; the K forms additionally fold compatibility characters, which loses information." },
  ],

  demoParams: [
    { name: 's',    type: 'string', hint: 'text with an accent', input: 'text' },
    { name: 'form', type: 'string', hint: 'NFC, NFD, NFKC, NFKD', input: 'text' },
  ],
  demoTemplate: '[...{s}.normalize({form})].map(c => c.codePointAt(0).toString(16))',
  cases: [
    { id: 'composed',   label: 'é composed → NFC',   values: { s: 'é', form: 'NFC' } },
    { id: 'decompose',  label: 'é → NFD (2 points)', values: { s: 'é', form: 'NFD' } },
    { id: 'ligature',   label: 'ﬁ ligature → NFKC',  values: { s: 'ﬁ', form: 'NFKC' } },
    { id: 'circled',    label: '① → NFKC (lossy!)',  values: { s: '①', form: 'NFKC' } },
    { id: 'plain',      label: 'plain ASCII',        values: { s: 'abc', form: 'NFC' } },
  ],
  demoExplainer: "The output lists the code points in hex, because that is the only way to see what happened — every form of 'é' renders identically on screen. NFC gives a single code point e9. NFD gives two: 65, a plain letter e, followed by 301, a combining acute accent. Both display as é and they are NOT ===. The last two cases show the K forms going further: the ﬁ ligature becomes two ordinary letters, and the circled digit ① becomes a plain 1. That is useful for search and destructive for display — NFKC discards the distinction permanently.",

  patterns: [
    {
      name: 'Normalise before comparing or storing',
      desc: 'NFC is what most systems and databases expect.',
      code: "const key = input.normalize('NFC');",
    },
    {
      name: 'Strip accents for search',
      desc: 'Decompose, then drop the combining marks.',
      code: "const bare = s.normalize('NFD').replace(/\\p{Diacritic}/gu, '');",
    },
    {
      name: 'Compare without normalising by hand',
      desc: 'localeCompare handles it and more.',
      code: "a.localeCompare(b, undefined, {sensitivity: 'base'}) === 0;",
    },
  ],

  examples: [
    { title: 'Composed length',   code: "'\\u00e9'.length",                    returns: '1' },
    { title: 'Decomposed length', code: "'e\\u0301'.length",                   returns: '2' },
    { title: 'They are not equal',code: "'\\u00e9' === 'e\\u0301'",            returns: 'false' },
    { title: 'Normalised, they are', code: "'e\\u0301'.normalize() === '\\u00e9'", returns: 'true' },
    { title: 'Ligature folded',   code: "'\\ufb01'.normalize('NFKC')",         returns: "'fi'" },
    { title: 'Circled digit',     code: "'\\u2460'.normalize('NFKC')",         returns: "'1'" },
  ],

  pitfalls: [
    {
      name: 'Two identical-looking strings are not equal',
      desc: 'The bug this method exists to fix. Text typed on a Mac often arrives decomposed while the same text from elsewhere is composed, so a username or filename matches visually and fails every comparison, lookup and uniqueness check.',
      wrong: { label: 'Looks equal, is not', code: "'\\u00e9' === 'e\\u0301'", output: 'false' },
      fix:   { label: 'Normalise both',      code: "'\\u00e9'.normalize() === 'e\\u0301'.normalize()", output: 'true' },
    },
    {
      name: 'NFKC and NFKD are lossy',
      desc: 'They fold compatibility characters — superscripts, ligatures, circled digits, full-width forms — into plain equivalents. Excellent for building a search key, destructive if you store the result, because the original characters cannot be recovered.',
      wrong: { label: 'Information gone', code: "'x\\u00b2'.normalize('NFKC')", output: "'x2'   // the superscript is lost" },
      fix:   { label: 'Store NFC',        code: "'x\\u00b2'.normalize('NFC')", output: "'x\\u00b2'" },
    },
    {
      name: 'It changes the length, so cached indices break',
      desc: 'NFD can double the length of accented text and NFC can shrink it. Any offset computed before normalising points somewhere else afterwards — normalise first, then index.',
      wrong: { label: 'Length changed', code: "'\\u00e9'.normalize('NFD').length", output: '2' },
      fix:   { label: 'Normalise first', code: "const t = s.normalize('NFC');\nt.indexOf(x);", output: 'consistent' },
    },
    {
      name: 'Normalising is not case folding or accent stripping',
      desc: 'NFC and NFD keep every accent — they only change how it is encoded. Removing accents needs NFD followed by an explicit strip of the combining marks, and case still needs toLowerCase on top.',
      wrong: { label: 'Accent kept', code: "'\\u00e9'.normalize('NFD') === 'e'", output: 'false' },
      fix:   { label: 'Strip marks', code: "'\\u00e9'.normalize('NFD').replace(/\\p{Diacritic}/gu, '') === 'e'", output: 'true' },
    },
  ],

  when: {
    use: [
      'Before comparing, hashing or storing text from users or files',
      'Deduplicating names, tags or filenames',
      'Building a search key, with the K forms',
      'As the first step of accent stripping',
    ],
    avoid: [
      'You only need a case-insensitive compare → toLowerCase',
      'You want proper linguistic comparison → localeCompare with sensitivity',
      'Storing display text → never store the K forms',
      'Pure ASCII data → normalisation is a no-op, skip it',
    ],
  },

  notes: {
    complexity: 'O(n), with a table lookup per character',
    return:     'A new string; the original is untouched',
    cpython:    'V8: Builtins-string-normalize / ICU',
    memory:     'Allocates the result; the length often differs from the input',
    threadSafe: 'Single-threaded; the string is only read',
  },

  related: [
    { name: 'String.prototype.localeCompare', slug: 'string-localecompare', when: 'Comparison that handles this for you' },
    { name: 'String.prototype.toLowerCase',   slug: 'string-tolowercase',   when: 'The case half of normalising input' },
    { name: 'String.prototype.codePointAt',   slug: 'string-codepointat',   when: 'Inspecting what the code points actually are' },
    { name: 'String.prototype.replace',       slug: 'string-replace',       when: 'Stripping the combining marks after NFD' },
  ],

  faq: [
    {
      q: 'Which form should I use?',
      a: 'NFC for anything you store or transmit — it is the web default, what most databases expect, and the shortest. NFD when you need to inspect or remove combining marks. The K forms only for building a comparison key you throw away afterwards.',
      code: "store(input.normalize('NFC'));\nsearchKey = input.normalize('NFKC').toLowerCase();",
    },
    {
      q: 'Why do Mac filenames cause this?',
      a: 'macOS has historically stored filenames in a decomposed form, so a file named "café" arrives as five code points rather than four. Compared against a composed string from anywhere else it simply does not match, which is why file-syncing tools normalise aggressively.',
    },
    {
      q: 'Do I need this if I only handle English?',
      a: 'For pure ASCII, normalisation is a no-op and costs only time. But "only English" rarely survives contact with real users — names, pasted quotes and copied text all bring in characters that normalise. Normalising at the boundary is cheap insurance.',
    },
    {
      q: 'Is normalize enough to compare names safely?',
      a: 'It handles the encoding question, not the linguistic one. Case, accents and locale-specific collation are separate concerns — localeCompare with a sensitivity option addresses all of them together and is the better tool for user-facing comparison.',
      code: "a.localeCompare(b, undefined, {sensitivity: 'base'}) === 0;",
    },
  ],

  history: [
    { version: 'ES2015', note: 'normalize added, exposing the Unicode normalization forms to JavaScript for the first time.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize',
    meta:  'String.prototype.normalize',
  },

  tryInTool: [],
};
