// content/reference/javascript/methods/string-startswith.js

export const meta = {
  slug:        'string-startswith',
  name:        'String.prototype.startsWith',
  signature:   'string.startsWith(searchString[, position])',
  blurb:       'Test the beginning of a string without a regex or an indexOf comparison.',
  category:    'string',
  type:        'string',
  hasLiveDemo: true,
  version:     'ES2015',
  searchTerms: 'string startsWith begins with prefix test protocol http check position anchor es2015 javascript',
};

export const method = {
  slug:      'string-startswith',
  name:      'String.prototype.startsWith',
  signature: 'string.startsWith(searchString[, position])',
  returns:   { type: 'boolean', desc: 'True if the string begins with the search text — or begins with it at position, when one is given.' },

  category:    'String method',
  version:     'ES2015',
  hasLiveDemo: true,

  subtitle: 'A prefix test that says what it means. It replaces both indexOf(x) === 0 and the anchored regex, and unlike the regex it needs no escaping.',

  cheat: {
    commonCall: "url.startsWith('https://')",
    returns:    'boolean',
    replaces:   "s.indexOf(x) === 0 and /^x/.test(s)",
    watchOut:   'case sensitive; a RegExp argument throws',
  },

  parameters: [
    { name: 'searchString', type: 'string', required: true,  default: null, desc: 'The prefix to test for. A RegExp is a TypeError, as with includes and endsWith.' },
    { name: 'position',     type: 'number', required: false, default: '0',  desc: 'Treat the string as if it began here. startsWith("el", 1) tests the substring starting at index 1.' },
  ],

  demoParams: [
    { name: 's',      type: 'string', hint: 'the string to test', input: 'text' },
    { name: 'search', type: 'string', hint: 'the prefix',         input: 'text' },
  ],
  demoTemplate: '{s}.startsWith({search})',
  cases: [
    { id: 'yes',    label: 'matching prefix',   values: { s: 'https://x.com', search: 'https://' } },
    { id: 'no',     label: 'wrong prefix',      values: { s: 'http://x.com',  search: 'https://' } },
    { id: 'case',   label: 'case matters (!)',  values: { s: 'Hello',         search: 'hello' } },
    { id: 'middle', label: 'not at the start',  values: { s: 'hello',         search: 'ell' } },
    { id: 'empty',  label: 'empty prefix (!)',  values: { s: 'hello',         search: '' } },
  ],
  demoExplainer: "The first two cases are the everyday use — distinguishing https from http is a prefix test, and writing it this way is both clearer and safer than a regex where the slashes and dots would need escaping. The fourth case shows the difference from includes: 'ell' is present in 'hello' but not at the beginning, so this returns false where includes would return true. As with includes, an empty search string is always true.",

  patterns: [
    {
      name: 'Check a protocol or scheme',
      desc: 'The most common real use.',
      code: "if (!url.startsWith('https://')) throw new Error('insecure');",
    },
    {
      name: 'Match any of several prefixes',
      desc: 'some over a list beats a chain of ORs.',
      code: "const isInternal = PREFIXES.some(p => path.startsWith(p));",
    },
    {
      name: 'Strip a known prefix',
      desc: 'Test, then slice — or use replace for the modern form.',
      code: "const rest = s.startsWith(p) ? s.slice(p.length) : s;",
    },
  ],

  examples: [
    { title: 'Matching prefix',   code: "'hello'.startsWith('he')",     returns: 'true' },
    { title: 'Not a prefix',      code: "'hello'.startsWith('ell')",    returns: 'false' },
    { title: 'includes differs',  code: "'hello'.includes('ell')",      returns: 'true' },
    { title: 'From a position',   code: "'hello'.startsWith('el', 1)",  returns: 'true' },
    { title: 'Empty is true',     code: "'hello'.startsWith('')",       returns: 'true' },
    { title: 'RegExp throws',     code: "'abc'.startsWith(/a/)",        returns: 'TypeError: First argument to String.prototype.startsWith must not be a regular expression' },
  ],

  pitfalls: [
    {
      name: 'Case sensitive, with no option',
      desc: 'Same as includes — there is no flag. Protocol and header checks against text of unknown origin should lowercase first, since HTTP schemes and header names are case-insensitive by specification.',
      wrong: { label: 'Misses it', code: "'HTTPS://x'.startsWith('https://')", output: 'false' },
      fix:   { label: 'Fold first', code: "'HTTPS://x'.toLowerCase().startsWith('https://')", output: 'true' },
    },
    {
      name: 'A prefix test is not a URL check',
      desc: "startsWith('https://') says nothing about what follows. It is a reasonable guard against obviously wrong input and no defence at all against a crafted URL — parse with the URL constructor when the answer matters for security.",
      wrong: { label: 'Passes anything', code: "'https://evil.com/?x=bank.com'.startsWith('https://')", output: 'true' },
      fix:   { label: 'Parse it',        code: "new URL(u).protocol === 'https:'", output: 'checks the real scheme' },
    },
    {
      name: 'A RegExp argument throws',
      desc: 'Identical to includes and endsWith: these three refuse regexes rather than stringifying them. Use an anchored pattern with test if you need one.',
      wrong: { label: 'Throws',   code: "'abc'.startsWith(/a/)", output: 'TypeError: First argument to String.prototype.startsWith must not be a regular expression' },
      fix:   { label: 'Anchored test', code: "/^a/.test('abc')", output: 'true' },
    },
    {
      name: 'The position argument shifts the whole test',
      desc: 'It does not mean "search from here onwards" — it re-anchors the test at that index. startsWith(x, 3) is true only if x begins exactly at index 3, which is easy to misread as an offset search.',
      wrong: { label: 'Not a search', code: "'hello'.startsWith('lo', 1)", output: 'false' },
      fix:   { label: 'Anchored at 3', code: "'hello'.startsWith('lo', 3)", output: 'true' },
    },
  ],

  when: {
    use: [
      'Testing a protocol, scheme or known prefix',
      'Routing on a path prefix',
      'Detecting a marker at the beginning of a line',
      'Anywhere indexOf(x) === 0 appears',
    ],
    avoid: [
      'The match may be anywhere → includes',
      'You are testing the end → endsWith',
      'You need a real pattern → an anchored RegExp with test',
      'Security decisions about URLs → the URL constructor',
    ],
  },

  notes: {
    complexity: 'O(m) in the length of the prefix — it stops at the first mismatch',
    return:     'A boolean; nothing is allocated',
    cpython:    'V8: Builtins-string-startswith',
    memory:     'No allocation',
    threadSafe: 'Single-threaded; the string is only read',
  },

  related: [
    { name: 'String.prototype.endsWith',  slug: 'string-endswith',  when: 'The same test at the other end' },
    { name: 'String.prototype.includes',  slug: 'string-includes',  when: 'A match anywhere in the string' },
    { name: 'String.prototype.indexOf',   slug: 'string-indexof',   when: 'You need the position too' },
    { name: 'String.prototype.slice',     slug: 'string-slice',     when: 'Strip the prefix once you have confirmed it' },
  ],

  faq: [
    {
      q: 'startsWith or a regex?',
      a: 'startsWith for literal text. It needs no escaping, which matters when the prefix is a variable — a path or URL full of dots and slashes becomes a minefield inside a RegExp. Keep the anchored regex for genuine patterns.',
      code: "s.startsWith(prefix);                     // safe\nnew RegExp('^' + prefix).test(s);         // needs escaping",
    },
    {
      q: 'How do I strip a prefix if it is there?',
      a: 'Test then slice by the prefix length. There is no dedicated method — replace with an anchored regex works but reintroduces the escaping problem.',
      code: 'const rest = s.startsWith(p) ? s.slice(p.length) : s;',
    },
    {
      q: 'Why does it reject regular expressions?',
      a: 'The same reason includes does — the method is defined for literal text, and accepting a regex would either silently search for its source text or duplicate what an anchored test already does. All three of startsWith, endsWith and includes throw.',
    },
  ],

  history: [
    { version: 'ES2015', note: 'Added with includes and endsWith as part of the string-method additions.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith',
    meta:  'String.prototype.startsWith',
  },

  tryInTool: [],
};
