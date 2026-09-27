// content/reference/javascript/methods/string-replaceall.js

export const meta = {
  slug:        'string-replaceall',
  name:        'String.prototype.replaceAll',
  signature:   'string.replaceAll(pattern, replacement)',
  blurb:       'What everyone expected replace to do — every occurrence, no regex required.',
  category:    'string',
  type:        'string',
  hasLiveDemo: true,
  version:     'ES2021',
  searchTerms: 'string replaceAll replace all global every occurrence substitute escape regex es2021 javascript',
};

export const method = {
  slug:      'string-replaceall',
  name:      'String.prototype.replaceAll',
  signature: 'string.replaceAll(pattern, replacement)',
  returns:   { type: 'string', desc: 'A NEW string with every occurrence replaced. The original is unchanged, as always with strings.' },

  category:    'String method',
  version:     'ES2021',
  hasLiveDemo: true,

  subtitle: 'Added in 2021 to close a twenty-year-old papercut. Its real advantage over a /g regex is that the search text needs no escaping — which matters whenever that text is a variable.',

  cheat: {
    commonCall: "s.replaceAll('-', '+')",
    returns:    'a new string — assign it',
    replaces:   "s.replace(/-/g, '+') and split().join() hacks",
    watchOut:   'a RegExp argument MUST have the g flag or it throws',
  },

  parameters: [
    { name: 'pattern',     type: 'string | RegExp',   required: true, default: null, desc: 'A string matches literally, every time, with no regex interpretation. A RegExp is allowed but must carry the g flag.' },
    { name: 'replacement', type: 'string | Function', required: true, default: null, desc: 'Same rules as replace: $& $1 $$ are special in a string, while a function replacer inserts its return value verbatim.' },
  ],

  demoParams: [
    { name: 's',      type: 'string', hint: 'the source string', input: 'text' },
    { name: 'search', type: 'string', hint: 'text to find',      input: 'text' },
    { name: 'repl',   type: 'string', hint: 'replacement text',  input: 'text' },
  ],
  demoTemplate: '{s}.replaceAll({search}, {repl})',
  cases: [
    { id: 'all',      label: 'every occurrence',     values: { s: 'a-b-c', search: '-', repl: '+' } },
    { id: 'word',     label: 'a repeated word',      values: { s: 'cat dog cat', search: 'cat', repl: 'fox' } },
    { id: 'strip',    label: 'delete all of them',   values: { s: 'a-b-c', search: '-', repl: '' } },
    { id: 'literal',  label: 'dots stay literal',    values: { s: 'a.b axb', search: 'a.b', repl: '-' } },
    { id: 'emptysep', label: 'empty search (!)',     values: { s: 'aaa', search: '', repl: '-' } },
  ],
  demoExplainer: "Compare the first case with the same call on the replace page: here both hyphens change. The fourth case is the quiet advantage — 'a.b' is treated as three literal characters, so 'axb' is left alone. Build the same thing as a regex and the dot becomes a wildcard that matches it. The last case is the one genuine oddity: an empty search string matches at every boundary including both ends, so 'aaa' becomes '-a-a-a-'.",

  patterns: [
    {
      name: 'Substitute user-supplied text',
      desc: 'The main reason to prefer it over a regex.',
      code: 'const out = text.replaceAll(needle, replacement);',
    },
    {
      name: 'Normalise separators',
      desc: 'Chained calls read clearly enough.',
      code: "const slug = title.trim().toLowerCase().replaceAll(' ', '-');",
    },
    {
      name: 'Strip a character entirely',
      desc: 'An empty replacement deletes.',
      code: "const digits = phone.replaceAll('-', '');",
    },
  ],

  examples: [
    { title: 'Every occurrence',   code: "'a-b-c'.replaceAll('-', '+')",        returns: "'a+b+c'" },
    { title: 'replace differs',    code: "'a-b-c'.replace('-', '+')",           returns: "'a+b-c'" },
    { title: 'Dots are literal',   code: "'a.b axb'.replaceAll('a.b', '-')",    returns: "'- axb'" },
    { title: 'Regex would not be', code: "'a.b axb'.replace(/a.b/g, '-')",      returns: "'- -'" },
    { title: 'Empty search',       code: "'aaa'.replaceAll('', '-')",           returns: "'-a-a-a-'" },
    { title: 'Non-global throws',  code: "'aa'.replaceAll(/a/, 'b')",           returns: 'TypeError: String.prototype.replaceAll called with a non-global RegExp argument' },
  ],

  pitfalls: [
    {
      name: 'A RegExp without the g flag throws',
      desc: 'Deliberate: the method is named replaceAll, so it refuses a pattern that could only replace one. This is the opposite of replace, which quietly accepts either — and it is the one way replaceAll can fail where replace would not.',
      wrong: { label: 'Throws', code: "'aa'.replaceAll(/a/, 'b')", output: 'TypeError: String.prototype.replaceAll called with a non-global RegExp argument' },
      fix:   { label: 'Add the flag', code: "'aa'.replaceAll(/a/g, 'b')", output: "'bb'" },
    },
    {
      name: 'It still returns a new string',
      desc: 'Same immutability rule as every other string method. Calling it as a bare statement changes nothing, which is easy to miss when converting a loop that used to mutate an array.',
      wrong: { label: 'Discarded', code: "let s = 'a-b';\ns.replaceAll('-', '+');\ns", output: "'a-b'" },
      fix:   { label: 'Assign it', code: "let s = 'a-b';\ns = s.replaceAll('-', '+');\ns", output: "'a+b'" },
    },
    {
      name: '$ in the replacement is still special',
      desc: 'Switching from replace to replaceAll does not make the replacement string literal. A replacement containing $& or $1 — often one built from user input — expands exactly as it would with replace.',
      wrong: { label: 'Expands', code: "'x'.replaceAll('x', '$&$&')", output: "'xx'" },
      fix:   { label: 'Function replacer', code: "'x'.replaceAll('x', () => '$&$&')", output: "'$&$&'" },
    },
    {
      name: 'An empty search string inserts everywhere',
      desc: 'It matches at every position between characters plus both ends, so the replacement is sprinkled throughout. Guard against an empty needle when the search text comes from an input box, or a single stray keystroke mangles the whole string.',
      wrong: { label: 'Sprinkled', code: "'aaa'.replaceAll('', '-')", output: "'-a-a-a-'" },
      fix:   { label: 'Guard it',  code: 'const out = needle ? s.replaceAll(needle, r) : s;', output: 'unchanged' },
    },
    {
      name: 'ES2021 — not in older runtimes',
      desc: 'Node 15+ and 2020-era browsers. Older targets need the /g regex form, with the search text escaped if it is not a literal.',
      wrong: { label: 'Missing', code: "s.replaceAll('-', '+')", output: 'TypeError: s.replaceAll is not a function' },
      fix:   { label: 'Regex form', code: "s.replace(/-/g, '+')", output: 'same result' },
    },
  ],

  when: {
    use: [
      'Replacing every occurrence of literal text',
      'The search text is a variable that may contain regex metacharacters',
      'Stripping a character out of a string entirely',
      'Anywhere a /g regex existed only to get global behaviour',
    ],
    avoid: [
      'You genuinely want one replacement → replace',
      'The pattern is a real pattern → replace with a RegExp',
      'You need the pieces → split',
      'Targeting runtimes older than 2021 → the /g regex form',
    ],
  },

  notes: {
    complexity: 'O(n) over the string for a literal pattern',
    return:     'A new string; the original is untouched',
    cpython:    'V8: Builtins-string-replaceall',
    memory:     'Allocates the result string',
    threadSafe: 'Single-threaded; a literal pattern carries no lastIndex state, unlike a shared /g regex',
  },

  related: [
    { name: 'String.prototype.replace',  slug: 'string-replace',  when: 'One occurrence, or a genuine pattern' },
    { name: 'String.prototype.split',    slug: 'string-split',    when: 'Break apart rather than substitute' },
    { name: 'String.prototype.trim',     slug: 'string-trim',     when: 'Removing whitespace only at the ends' },
    { name: 'String.prototype.includes', slug: 'string-includes', when: 'Test before bothering to replace' },
  ],

  faq: [
    {
      q: 'Is replaceAll slower than a /g regex?',
      a: 'No — for literal text it is generally the same or faster, because the engine can use a plain substring search instead of running the regex machinery. Correctness is the better argument anyway: no escaping, no lastIndex state.',
    },
    {
      q: 'Why does it throw on a non-global regex when replace does not?',
      a: 'Because the name would be a lie. replace(/a/, x) legitimately replaces one match; replaceAll(/a/, x) would have to either replace one — contradicting its name — or silently ignore the missing flag. The committee chose to throw.',
      code: "'aa'.replaceAll(/a/g, 'b');   // 'bb'",
    },
    {
      q: 'What about the old split-join trick?',
      a: "s.split(x).join(y) was the standard workaround before 2021 and still works identically for literal text. replaceAll expresses the intent directly and allocates less, so there is no reason to keep the old idiom in new code.",
      code: "'a-b-c'.split('-').join('+');   // 'a+b+c'",
    },
    {
      q: 'How do I replace text that might contain regex characters?',
      a: 'This method, with a plain string — that is exactly what it is for. If you must build a RegExp instead, escape the input first with RegExp.escape where available, or a manual character-class replacement.',
      code: 'text.replaceAll(needle, replacement);   // no escaping needed',
    },
  ],

  history: [
    { version: 'ES2021', note: 'replaceAll added, closing a long-standing gap — replace had been first-match-only for string patterns since ES3.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replaceAll',
    meta:  'String.prototype.replaceAll',
  },

  tryInTool: [],
};
