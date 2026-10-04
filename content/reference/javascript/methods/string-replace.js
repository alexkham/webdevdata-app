// content/reference/javascript/methods/string-replace.js

export const meta = {
  slug:        'string-replace',
  name:        'String.prototype.replace',
  signature:   'string.replace(pattern, replacement)',
  blurb:       'Replaces the FIRST match only when given a string — the single most common JavaScript surprise.',
  category:    'string',
  type:        'string',
  hasLiveDemo: true,
  version:     'ES3 (1999)',
  searchTerms: 'string replace substitute regex first occurrence global flag dollar capture group replacer function javascript',
};

export const method = {
  slug:      'string-replace',
  name:      'String.prototype.replace',
  signature: 'string.replace(pattern, replacement)',
  returns:   { type: 'string', desc: 'A NEW string. Strings are immutable, so the original is never modified — an unassigned replace call does nothing at all.' },

  category:    'String method',
  version:     'ES3 (1999)',
  hasLiveDemo: true,

  subtitle: 'With a string pattern it replaces one occurrence and stops. Replacing every occurrence needs either a /g regex or replaceAll — and the $ characters in your replacement are not literal.',

  cheat: {
    commonCall: "s.replace('a', 'b')",
    returns:    'a new string — assign it, the original never changes',
    replaces:   'nothing; it is the base substitution method',
    watchOut:   'a string pattern hits only the FIRST match',
  },

  parameters: [
    { name: 'pattern',     type: 'string | RegExp',   required: true, default: null, desc: 'A string matches literally and ONCE. A RegExp matches by pattern, and replaces every occurrence only if it carries the g flag.' },
    { name: 'replacement', type: 'string | Function', required: true, default: null, desc: 'A string, in which $& $1 $` $\' and $$ have special meanings. Or a function called with (match, ...groups, offset, string) whose return value is inserted literally.' },
  ],

  demoParams: [
    { name: 's',      type: 'string', hint: 'the source string',  input: 'text' },
    { name: 'search', type: 'string', hint: 'text to find',       input: 'text' },
    { name: 'repl',   type: 'string', hint: 'replacement text',   input: 'text' },
  ],
  demoTemplate: '{s}.replace({search}, {repl})',
  cases: [
    { id: 'first',   label: 'only the FIRST (!)', values: { s: 'a-b-c', search: '-', repl: '+' } },
    { id: 'word',    label: 'a whole word',       values: { s: 'cat dog cat', search: 'cat', repl: 'fox' } },
    { id: 'nomatch', label: 'no match at all',    values: { s: 'abc', search: 'x', repl: 'y' } },
    { id: 'dollar',  label: '$& is the match (!)',values: { s: 'wow', search: 'o', repl: '[$&]' } },
    { id: 'remove',  label: 'delete by replacing',values: { s: 'a-b-c', search: '-', repl: '' } },
  ],
  demoExplainer: "The first case is the one to internalise: 'a-b-c' with a string pattern becomes 'a+b-c'. One hyphen changed, the second untouched, and nothing warns you. The second case shows the same thing with a word — only the leading 'cat' becomes 'fox'. The fourth case demonstrates that the replacement string is not literal text: $& expands to whatever was matched, so '[$&]' wraps the match in brackets rather than inserting a literal dollar sign and ampersand.",

  patterns: [
    {
      name: 'Replace every occurrence',
      desc: 'Either form works; replaceAll reads better for plain text.',
      code: "s.replaceAll('-', '+');\ns.replace(/-/g, '+');",
    },
    {
      name: 'Reorder with capture groups',
      desc: '$1 and $2 refer to the captured parts.',
      code: "'2026-09-17'.replace(/(\\d+)-(\\d+)-(\\d+)/, '$3/$2/$1');",
    },
    {
      name: 'Compute the replacement',
      desc: 'A function replacer sidesteps all $ escaping.',
      code: 'text.replace(/\\d+/g, m => Number(m) * 2);',
    },
  ],

  examples: [
    { title: 'First match only',   code: "'a-b-c'.replace('-', '+')",       returns: "'a+b-c'" },
    { title: 'Global regex',       code: "'a-b-c'.replace(/-/g, '+')",      returns: "'a+b+c'" },
    { title: 'No match, no change',code: "'abc'.replace('x', 'y')",         returns: "'abc'" },
    { title: '$& is the match',    code: "'x'.replace('x', '$&$&')",        returns: "'xx'" },
    { title: '$$ is a literal $',  code: "'price: 5'.replace('5', '$$5')",  returns: "'price: $5'" },
    { title: 'Swap two groups',    code: "'ab'.replace(/(a)(b)/, '$2$1')",  returns: "'ba'" },
  ],

  pitfalls: [
    {
      name: 'A string pattern replaces only the first match',
      desc: 'By far the most common mistake with this method. There is no error, no warning, and the result looks right on any input that happens to contain a single occurrence — so it reaches production and fails on the first two-occurrence string.',
      wrong: { label: 'Second one survives', code: "'a-b-c'.replace('-', '+')", output: "'a+b-c'" },
      fix:   { label: 'replaceAll',          code: "'a-b-c'.replaceAll('-', '+')", output: "'a+b+c'" },
    },
    {
      name: 'It returns a new string and changes nothing',
      desc: 'Strings are immutable. Calling replace as a statement and expecting the variable to update is silent no-op — the result must be assigned or used.',
      wrong: { label: 'Discarded', code: "let s = 'a-b';\ns.replace('-', '+');\ns", output: "'a-b'" },
      fix:   { label: 'Assign it', code: "let s = 'a-b';\ns = s.replace('-', '+');\ns", output: "'a+b'" },
    },
    {
      name: '$ in the replacement is not literal',
      desc: 'A replacement string built from user input or a regex source can contain $&, $1 or $` and will expand unexpectedly. Double the dollar to get a literal one, or use a function replacer, whose return value is always inserted verbatim.',
      wrong: { label: 'Expands the match', code: "'x'.replace('x', '$&!')", output: "'x!'   // not '$&!'" },
      fix:   { label: 'Function is literal', code: "'x'.replace('x', () => '$&!')", output: "'$&!'" },
    },
    {
      name: 'A regex built from user input needs escaping',
      desc: 'Interpolating arbitrary text into new RegExp turns characters like . * ( into operators, which at best matches the wrong thing and at worst throws a SyntaxError. Use replaceAll with a plain string, or escape the input first.',
      wrong: { label: 'Dot matches anything', code: "'a.b axb'.replace(new RegExp('a.b', 'g'), '-')", output: "'- -'" },
      fix:   { label: 'Literal string',       code: "'a.b axb'.replaceAll('a.b', '-')", output: "'- axb'" },
    },
    {
      name: 'A non-global regex with replaceAll throws',
      desc: 'The reverse trap. replace accepts either, but replaceAll insists the regex carry the g flag so its name cannot lie about what it does.',
      wrong: { label: 'Throws', code: "'aa'.replaceAll(/a/, 'b')", output: 'TypeError: String.prototype.replaceAll called with a non-global RegExp argument' },
      fix:   { label: 'Add the flag', code: "'aa'.replaceAll(/a/g, 'b')", output: "'bb'" },
    },
  ],

  when: {
    use: [
      'Substituting the first occurrence deliberately',
      'Pattern-based substitution with a RegExp',
      'Reordering or reformatting with capture groups',
      'Computing each replacement with a function',
    ],
    avoid: [
      'Replacing every occurrence of plain text → replaceAll, which is clearer',
      'You only want to test for presence → includes',
      'You want the pieces, not a new string → split',
      'Building the pattern from user input → escape it, or use a string pattern',
    ],
  },

  notes: {
    complexity: 'O(n) for a string pattern; regex cost depends entirely on the pattern',
    return:     'A new string; the original is untouched',
    cpython:    'V8: Builtins-string-replace / regexp.cc',
    memory:     'Allocates the result string',
    threadSafe: 'Single-threaded, but a /g regex object carries lastIndex state — do not share one across calls',
  },

  related: [
    { name: 'String.prototype.replaceAll', slug: 'string-replaceall', when: 'Replace every occurrence without a regex' },
    { name: 'String.prototype.split',      slug: 'string-split',      when: 'Break apart rather than substitute' },
    { name: 'String.prototype.includes',   slug: 'string-includes',   when: 'Just test whether the text is there' },
    { name: 'String.prototype.indexOf',    slug: 'string-indexof',    when: 'Find the position to slice around' },
  ],

  faq: [
    {
      q: 'Why did only the first occurrence change?',
      a: 'Because a string pattern means exactly one replacement — that is the specified behaviour, not a bug. Use replaceAll for plain text, or a regex with the g flag. This has caught nearly everyone at least once.',
      code: "'a-b-c'.replace('-', '+');      // 'a+b-c'\n'a-b-c'.replaceAll('-', '+');   // 'a+b+c'",
    },
    {
      q: 'replace with /g or replaceAll?',
      a: 'They produce the same result. replaceAll is clearer for literal text and needs no escaping of regex metacharacters, which matters when the search text comes from a variable. Keep replace for genuine patterns.',
      code: "s.replaceAll(userText, '-');          // safe\ns.replace(new RegExp(userText, 'g'), '-'); // needs escaping",
    },
    {
      q: 'How do I insert a literal dollar sign?',
      a: 'Double it — $$ produces one $. Alternatively pass a function as the replacement, since a function return value is inserted with no interpretation at all.',
      code: "'5'.replace('5', '$$5');      // '$5'\n'5'.replace('5', () => '$5'); // '$5'",
    },
    {
      q: 'What arguments does a function replacer receive?',
      a: 'The whole match first, then each capture group, then the offset of the match, then the entire original string. Named groups arrive as a final object argument.',
      code: "s.replace(/(\\d)(\\w)/g, (match, d, w, offset, whole) => d + w.toUpperCase());",
    },
  ],

  history: [
    { version: 'ES3',    note: 'replace added with string and RegExp patterns and $-substitution.' },
    { version: 'ES2015', note: 'Symbol.replace made the behaviour customisable by pattern objects.' },
    { version: 'ES2018', note: 'Named capture groups added, usable as $<name> in the replacement.' },
    { version: 'ES2021', note: 'replaceAll added, removing the need for a /g regex on literal text.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace',
    meta:  'String.prototype.replace',
  },

};
