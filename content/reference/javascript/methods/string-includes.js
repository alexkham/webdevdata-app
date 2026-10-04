// content/reference/javascript/methods/string-includes.js

export const meta = {
  slug:        'string-includes',
  name:        'String.prototype.includes',
  signature:   'string.includes(searchString[, position])',
  blurb:       'The readable substring test that replaced indexOf(x) !== -1.',
  category:    'string',
  type:        'string',
  hasLiveDemo: true,
  version:     'ES2015',
  searchTerms: 'string includes contains substring test search has indexOf minus one case sensitive es2015 javascript',
};

export const method = {
  slug:      'string-includes',
  name:      'String.prototype.includes',
  signature: 'string.includes(searchString[, position])',
  returns:   { type: 'boolean', desc: 'True if the search string occurs anywhere at or after position. Always a boolean — never an index.' },

  category:    'String method',
  version:     'ES2015',
  hasLiveDemo: true,

  subtitle: 'Exists purely for readability. It answers the question you actually asked, instead of making you compare an index against -1 and hope you got the operator right.',

  cheat: {
    commonCall: "s.includes('abc')",
    returns:    'boolean',
    replaces:   "s.indexOf('abc') !== -1",
    watchOut:   'case sensitive, and it rejects a RegExp argument',
  },

  parameters: [
    { name: 'searchString', type: 'string', required: true,  default: null, desc: 'The text to look for. A RegExp here is a TypeError — this method is for literal text only.' },
    { name: 'position',     type: 'number', required: false, default: '0',  desc: 'Index to start searching from. Anything before it is ignored entirely.' },
  ],

  demoParams: [
    { name: 's',      type: 'string', hint: 'the string to search', input: 'text' },
    { name: 'search', type: 'string', hint: 'text to look for',     input: 'text' },
  ],
  demoTemplate: '{s}.includes({search})',
  cases: [
    { id: 'yes',    label: 'present',           values: { s: 'hello world', search: 'world' } },
    { id: 'no',     label: 'absent',            values: { s: 'hello world', search: 'xyz' } },
    { id: 'case',   label: 'case matters (!)',  values: { s: 'hello', search: 'HELLO' } },
    { id: 'middle', label: 'mid-word match',    values: { s: 'hello', search: 'ell' } },
    { id: 'empty',  label: 'empty needle (!)',  values: { s: 'hello', search: '' } },
  ],
  demoExplainer: "A match anywhere counts, including in the middle of a word — 'ell' is found inside 'hello', which matters when testing against user input where a word boundary was intended. The comparison is case sensitive and does no normalisation whatsoever, so 'HELLO' is simply absent from 'hello'. The last case surprises people: an empty string is considered present in every string, including the empty string itself, because it trivially occurs at position 0.",

  patterns: [
    {
      name: 'Case-insensitive test',
      desc: 'Lowercase both sides; there is no flag for this.',
      code: 'const found = s.toLowerCase().includes(needle.toLowerCase());',
    },
    {
      name: 'Filter a list',
      desc: 'The everyday search-box implementation.',
      code: 'const hits = items.filter(i => i.name.toLowerCase().includes(term));',
    },
    {
      name: 'Match any of several',
      desc: 'some reads better than a chain of ORs.',
      code: 'const isImage = EXTS.some(e => name.endsWith(e));',
    },
  ],

  examples: [
    { title: 'Present',         code: "'hello'.includes('ell')",   returns: 'true' },
    { title: 'Absent',          code: "'hello'.includes('xyz')",   returns: 'false' },
    { title: 'Case sensitive',  code: "'hello'.includes('L')",     returns: 'false' },
    { title: 'Empty is always true', code: "'abc'.includes('')",   returns: 'true' },
    { title: 'From a position', code: "'hello'.includes('h', 1)",  returns: 'false' },
    { title: 'RegExp throws',   code: "'abc'.includes(/b/)",       returns: 'TypeError: First argument to String.prototype.includes must not be a regular expression' },
  ],

  pitfalls: [
    {
      name: 'It is case sensitive with no option to change that',
      desc: 'There is no flag and no locale-aware variant. Every case-insensitive search has to lowercase both operands, which is also where accented text quietly goes wrong — lowercasing does not strip diacritics.',
      wrong: { label: 'Misses it', code: "'Hello'.includes('hello')", output: 'false' },
      fix:   { label: 'Fold both sides', code: "'Hello'.toLowerCase().includes('hello')", output: 'true' },
    },
    {
      name: 'An empty search string is always true',
      desc: 'Every string contains the empty string, so a search box that has just been cleared reports a match against everything. Usually harmless in a filter, actively wrong when the result gates an action.',
      wrong: { label: 'Always true', code: "''.includes('')", output: 'true' },
      fix:   { label: 'Guard it',    code: 'const found = needle !== "" && s.includes(needle);', output: 'false' },
    },
    {
      name: 'A RegExp argument throws',
      desc: 'Deliberate — the method is defined for literal text, and silently stringifying a regex would produce nonsense like "/b/". Use search or test when you need a pattern.',
      wrong: { label: 'Throws', code: "'abc'.includes(/b/)", output: 'TypeError: First argument to String.prototype.includes must not be a regular expression' },
      fix:   { label: 'Use test', code: "/b/.test('abc')", output: 'true' },
    },
    {
      name: 'A substring match is not a word match',
      desc: 'Checking a role, a tag or a comma-joined list with includes matches fragments too — "admin" is found inside "non-admin". Split the list or use a word-boundary regex.',
      wrong: { label: 'False positive', code: "'non-admin'.includes('admin')", output: 'true' },
      fix:   { label: 'Compare items',  code: "roles.split(',').includes('admin')", output: 'false' },
    },
  ],

  when: {
    use: [
      'Testing whether text contains a fragment',
      'Search-box filtering, with both sides lowercased',
      'Anywhere indexOf was only ever compared against -1',
    ],
    avoid: [
      'You need the position → indexOf',
      'You need a pattern → RegExp.test or search',
      'You are checking the start or end → startsWith, endsWith',
      'You are checking membership in a list → split then Array.includes',
    ],
  },

  notes: {
    complexity: 'O(n × m) worst case, though engines use faster substring searches in practice',
    return:     'A boolean; nothing is allocated or modified',
    cpython:    'V8: Builtins-string-includes',
    memory:     'No allocation',
    threadSafe: 'Single-threaded; the string is only read',
  },

  related: [
    { name: 'String.prototype.indexOf',    slug: 'string-indexof',    when: 'You need where it is, not just whether' },
    { name: 'String.prototype.startsWith', slug: 'string-startswith', when: 'Only the beginning matters' },
    { name: 'String.prototype.endsWith',   slug: 'string-endswith',   when: 'Only the end matters' },
    { name: 'Array.prototype.includes',    slug: 'array-includes',    when: 'Membership in a list of values' },
  ],

  faq: [
    {
      q: 'How do I do a case-insensitive includes?',
      a: 'Lowercase both operands. For text with accents that is still not enough — normalising and stripping combining marks handles é versus e, and localeCompare with sensitivity options is the thorough answer.',
      code: "s.toLowerCase().includes(t.toLowerCase());\n// accent-insensitive:\ns.normalize('NFD').replace(/\\p{Diacritic}/gu, '')",
    },
    {
      q: 'includes or indexOf?',
      a: 'includes when you want a yes-or-no answer, which is most of the time — it says what it means and cannot be got wrong with a > 0 typo. indexOf when you need the position, typically to slice around it.',
      code: "if (s.includes(x)) { }            // clear\nif (s.indexOf(x) !== -1) { }      // same, noisier\nif (s.indexOf(x) > 0) { }         // BUG: misses position 0",
    },
    {
      q: 'Why does it reject a regular expression?',
      a: 'Because the method is specified for literal strings, and accepting a RegExp would either silently stringify it — searching for the literal text "/b/" — or duplicate what test already does. Throwing makes the mistake obvious.',
      code: "/b/.test('abc');       // true\n'abc'.search(/b/);     // 1",
    },
  ],

  history: [
    { version: 'ES2015', note: 'includes added alongside startsWith and endsWith, replacing the indexOf !== -1 idiom.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes',
    meta:  'String.prototype.includes',
  },

};
