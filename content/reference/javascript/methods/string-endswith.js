// content/reference/javascript/methods/string-endswith.js

export const meta = {
  slug:        'string-endswith',
  name:        'String.prototype.endsWith',
  signature:   'string.endsWith(searchString[, endPosition])',
  blurb:       'Test a suffix — file extensions, trailing slashes — without length arithmetic.',
  category:    'string',
  type:        'string',
  hasLiveDemo: true,
  version:     'ES2015',
  searchTerms: 'string endsWith ends with suffix extension file trailing slash test check es2015 javascript',
};

export const method = {
  slug:      'string-endswith',
  name:      'String.prototype.endsWith',
  signature: 'string.endsWith(searchString[, endPosition])',
  returns:   { type: 'boolean', desc: 'True if the string ends with the search text — or would, if it were truncated to endPosition characters.' },

  category:    'String method',
  version:     'ES2015',
  hasLiveDemo: true,

  subtitle: 'The suffix half of the startsWith pair. Its optional second argument is a LENGTH to pretend the string has, not an index to start from — the opposite convention from startsWith.',

  cheat: {
    commonCall: "name.endsWith('.json')",
    returns:    'boolean',
    replaces:   's.slice(-x.length) === x',
    watchOut:   'second argument is a length, not a start index',
  },

  parameters: [
    { name: 'searchString', type: 'string', required: true,  default: null,     desc: 'The suffix to test for. A RegExp is a TypeError, as with startsWith and includes.' },
    { name: 'endPosition',  type: 'number', required: false, default: 'length', desc: 'Treat the string as if it ended here — as if it had been truncated to this many characters. Not an index to search from.' },
  ],

  demoParams: [
    { name: 's',      type: 'string', hint: 'the string to test', input: 'text' },
    { name: 'search', type: 'string', hint: 'the suffix',         input: 'text' },
  ],
  demoTemplate: '{s}.endsWith({search})',
  cases: [
    { id: 'ext',    label: 'file extension',    values: { s: 'report.json', search: '.json' } },
    { id: 'wrong',  label: 'wrong extension',   values: { s: 'report.jsonx', search: '.json' } },
    { id: 'slash',  label: 'trailing slash',    values: { s: '/api/users/', search: '/' } },
    { id: 'case',   label: 'case matters (!)',  values: { s: 'REPORT.JSON', search: '.json' } },
    { id: 'empty',  label: 'empty suffix (!)',  values: { s: 'hello', search: '' } },
  ],
  demoExplainer: "Checking an extension is the canonical use, and the second case shows why it beats includes: 'report.jsonx' CONTAINS '.json' but does not end with it, so a contains-check would wrongly accept it. Uppercase filenames are a real-world hazard — extensions are conventionally case-insensitive, so lowercase before testing. And as with the other two membership methods, an empty suffix is always present.",

  patterns: [
    {
      name: 'Check a file extension',
      desc: 'Lowercase first; extensions are not case sensitive.',
      code: "const isJson = name.toLowerCase().endsWith('.json');",
    },
    {
      name: 'Normalise a trailing slash',
      desc: 'Reads better than comparing the last character.',
      code: "const base = url.endsWith('/') ? url.slice(0, -1) : url;",
    },
    {
      name: 'Match any of several suffixes',
      desc: 'A list plus some.',
      code: "const isImage = ['.png', '.jpg'].some(e => name.endsWith(e));",
    },
  ],

  examples: [
    { title: 'Matching suffix',   code: "'hello'.endsWith('lo')",      returns: 'true' },
    { title: 'Not a suffix',      code: "'hello'.endsWith('ell')",     returns: 'false' },
    { title: 'Truncated first',   code: "'hello'.endsWith('ell', 4)",  returns: 'true' },
    { title: 'Empty is true',     code: "'hello'.endsWith('')",        returns: 'true' },
    { title: 'Contains is looser',code: "'report.jsonx'.includes('.json')", returns: 'true' },
    { title: 'endsWith is not',   code: "'report.jsonx'.endsWith('.json')", returns: 'false' },
  ],

  pitfalls: [
    {
      name: 'The second argument is a length, not a start index',
      desc: 'startsWith takes a position to anchor AT; endsWith takes a length to pretend the string HAS. endsWith("ell", 4) asks whether "hell" ends with "ell" — true. Reading it as "search from index 4" gives exactly the wrong mental model.',
      wrong: { label: 'Misread as an offset', code: "'hello'.endsWith('ell', 4)", output: "true   // tests 'hell'" },
      fix:   { label: 'Plain call',           code: "'hello'.endsWith('ell')", output: 'false' },
    },
    {
      name: 'Case sensitive, and extensions usually are not',
      desc: 'A file called REPORT.JSON is a JSON file. Uploads from Windows and older cameras routinely arrive uppercase, so an extension check without lowercasing rejects valid files.',
      wrong: { label: 'Rejects it', code: "'REPORT.JSON'.endsWith('.json')", output: 'false' },
      fix:   { label: 'Fold first', code: "'REPORT.JSON'.toLowerCase().endsWith('.json')", output: 'true' },
    },
    {
      name: 'An extension check is not a content check',
      desc: 'The name says nothing about the bytes. For uploads this matters — a file called photo.png may contain anything at all, so validate the actual content type rather than trusting the suffix.',
      wrong: { label: 'Name only', code: "file.name.endsWith('.png')", output: 'true for any content' },
      fix:   { label: 'Check the type', code: "file.type === 'image/png'", output: 'reported MIME type' },
    },
    {
      name: 'A RegExp argument throws',
      desc: 'As with startsWith and includes. Use an anchored pattern with test when a real pattern is needed.',
      wrong: { label: 'Throws', code: "'abc'.endsWith(/c/)", output: 'TypeError: First argument to String.prototype.endsWith must not be a regular expression' },
      fix:   { label: 'Anchored test', code: "/c$/.test('abc')", output: 'true' },
    },
  ],

  when: {
    use: [
      'File extension checks, after lowercasing',
      'Trailing slash and delimiter normalisation',
      'Detecting a suffix marker on a key or identifier',
      'Anywhere slice(-n) === x appears',
    ],
    avoid: [
      'The match may be anywhere → includes',
      'You are testing the beginning → startsWith',
      'You need a pattern → an anchored RegExp with test',
      'Validating upload content → check the MIME type or the bytes',
    ],
  },

  notes: {
    complexity: 'O(m) in the length of the suffix',
    return:     'A boolean; nothing is allocated',
    cpython:    'V8: Builtins-string-endswith',
    memory:     'No allocation',
    threadSafe: 'Single-threaded; the string is only read',
  },

  related: [
    { name: 'String.prototype.startsWith', slug: 'string-startswith', when: 'The same test at the beginning' },
    { name: 'String.prototype.includes',   slug: 'string-includes',   when: 'A match anywhere in the string' },
    { name: 'String.prototype.at',         slug: 'string-at',         when: 'Read the final character instead of testing it' },
    { name: 'String.prototype.slice',      slug: 'string-slice',      when: 'Strip the suffix once confirmed' },
  ],

  faq: [
    {
      q: 'Why is the second argument a length rather than an index?',
      a: 'Because it is defined as "pretend the string ends here", which makes endsWith(x, n) equivalent to s.slice(0, n).endsWith(x). It mirrors startsWith in purpose but not in convention, which is a genuine wart — startsWith takes an index to anchor at.',
      code: "'hello'.endsWith('ell', 4);        // true\n'hello'.slice(0, 4).endsWith('ell'); // true — the same thing",
    },
    {
      q: 'How do I strip a suffix if it is present?',
      a: 'Test, then slice by the negative suffix length. Guard the empty-suffix case, since slice(-0) returns the whole string rather than nothing.',
      code: 'const base = s.endsWith(x) && x ? s.slice(0, -x.length) : s;',
    },
    {
      q: 'Is this reliable for checking file types?',
      a: 'For routing and display, yes. For anything security-relevant, no — the extension is part of a name the user chose. Check the MIME type the browser reports, or sniff the leading bytes on the server.',
    },
  ],

  history: [
    { version: 'ES2015', note: 'Added with includes and startsWith.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith',
    meta:  'String.prototype.endsWith',
  },

};
