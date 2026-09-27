// content/reference/javascript/methods/string-indexof.js
//
// lastIndexOf is consolidated here: same algorithm, opposite direction, and
// its only real distinction (the position argument means "start searching
// backwards from") is clearest explained side by side.

export const meta = {
  slug:        'string-indexof',
  name:        'String.prototype.indexOf',
  signature:   'string.indexOf(searchString[, position])',
  blurb:       'Where the text starts — or -1, the sentinel behind a whole family of bugs.',
  category:    'string',
  type:        'string',
  hasLiveDemo: true,
  version:     'ES1 (1997)',
  searchTerms: 'string indexOf lastIndexOf position find search first occurrence minus one sentinel locate javascript',
};

export const method = {
  slug:      'string-indexof',
  name:      'String.prototype.indexOf',
  signature: 'string.indexOf(searchString[, position])',
  returns:   { type: 'number', desc: 'The index of the first occurrence at or after position, or -1 if there is none. Zero is a valid result, which is what makes truthiness checks wrong.' },

  category:    'String method',
  version:     'ES1 (1997)',
  hasLiveDemo: true,

  subtitle: 'Use it when you need the position — to slice around it. When you only want to know whether the text is there, includes says so without the -1 ceremony.',

  cheat: {
    commonCall: "s.indexOf('/')",
    returns:    'a number, or -1 when absent',
    replaces:   'a manual character-by-character scan',
    watchOut:   '0 is falsy — never test the result for truthiness',
  },

  parameters: [
    { name: 'searchString', type: 'string', required: true,  default: null, desc: 'Text to find. Unlike includes, a RegExp is not rejected — it is stringified, which almost never does what you want.' },
    { name: 'position',     type: 'number', required: false, default: '0',  desc: 'Where to start searching. For lastIndexOf this instead means the highest index the match may START at, searching backwards.' },
  ],

  demoParams: [
    { name: 's',      type: 'string', hint: 'the string to search', input: 'text' },
    { name: 'search', type: 'string', hint: 'text to look for',     input: 'text' },
  ],
  demoTemplate: '{s}.indexOf({search})',
  cases: [
    { id: 'found',   label: 'found mid-string', values: { s: 'hello', search: 'l' } },
    { id: 'first',   label: 'at position 0 (!)', values: { s: 'hello', search: 'h' } },
    { id: 'missing', label: 'absent → -1',      values: { s: 'hello', search: 'z' } },
    { id: 'word',    label: 'a whole word',     values: { s: 'hello world', search: 'world' } },
    { id: 'empty',   label: 'empty needle (!)', values: { s: 'hello', search: '' } },
  ],
  demoExplainer: "Only the FIRST occurrence is reported — 'hello' has two l's and the answer is 2, not a list. The second case is the one that causes bugs: a match at the very start returns 0, which is falsy, so `if (s.indexOf(x))` treats a successful match at position 0 as a failure. That is why the correct comparison is against -1 explicitly, or better, why includes exists. An empty search string returns 0 for the same reason includes('') is true — it occurs trivially at the beginning.",

  patterns: [
    {
      name: 'Split around the first delimiter',
      desc: 'Where split with a limit would lose the tail.',
      code: "const i = s.indexOf(':');\nconst [k, v] = [s.slice(0, i), s.slice(i + 1)];",
    },
    {
      name: 'File extension',
      desc: 'lastIndexOf, because names may contain several dots.',
      code: "const ext = name.slice(name.lastIndexOf('.') + 1);",
    },
    {
      name: 'Every occurrence',
      desc: 'Loop with the position argument.',
      code: 'let i = -1;\nwhile ((i = s.indexOf(x, i + 1)) !== -1) hits.push(i);',
    },
  ],

  examples: [
    { title: 'First occurrence',  code: "'hello'.indexOf('l')",     returns: '2' },
    { title: 'Last occurrence',   code: "'hello'.lastIndexOf('l')", returns: '3' },
    { title: 'Absent',            code: "'hello'.indexOf('z')",     returns: '-1' },
    { title: 'Match at the start',code: "'hello'.indexOf('h')",     returns: '0' },
    { title: 'From a position',   code: "'hello'.indexOf('l', 3)",  returns: '3' },
    { title: 'Empty needle',      code: "'abc'.indexOf('')",        returns: '0' },
  ],

  pitfalls: [
    {
      name: 'A match at position 0 is falsy',
      desc: 'The classic. `if (s.indexOf(x))` is false both when the text is absent (-1 is truthy, so it is actually TRUE then) and when it matches at the very beginning. The condition is wrong in both directions, and it looks perfectly reasonable.',
      wrong: { label: 'Backwards', code: "if ('hello'.indexOf('h')) { /* never runs */ }", output: '0 is falsy' },
      fix:   { label: 'Be explicit', code: "if ('hello'.indexOf('h') !== -1) { }", output: 'runs' },
    },
    {
      name: '> 0 misses the first position',
      desc: 'A common attempt at a fix that introduces a subtler bug — it works for every match except one at index 0. Code reviewed this way passes tests that happen not to include a leading match.',
      wrong: { label: 'Off by one case', code: "'hello'.indexOf('h') > 0", output: 'false' },
      fix:   { label: 'Use includes',    code: "'hello'.includes('h')", output: 'true' },
    },
    {
      name: 'lastIndexOf takes its position argument backwards',
      desc: 'For indexOf, position is where to start looking forwards. For lastIndexOf it is the highest index at which a match may BEGIN, and the search runs backwards from there — so the same number means different things on the two methods.',
      wrong: { label: 'Not "from index 3 on"', code: "'hello'.lastIndexOf('l', 2)", output: '2' },
      fix:   { label: 'Plain call',            code: "'hello'.lastIndexOf('l')", output: '3' },
    },
    {
      name: 'It does not reject a RegExp',
      desc: 'Where includes throws, indexOf stringifies — so indexOf(/b/) searches for the literal four characters "/b/" and returns -1 on text that obviously contains a b. No error points at the mistake.',
      wrong: { label: 'Searches "/b/"', code: "'abc'.indexOf(/b/)", output: '-1' },
      fix:   { label: 'Use search',     code: "'abc'.search(/b/)", output: '1' },
    },
  ],

  when: {
    use: [
      'You need the position, usually to slice around it',
      'Finding the first or last delimiter in a path or key-value string',
      'Walking every occurrence with the position argument',
    ],
    avoid: [
      'You only want a yes/no answer → includes',
      'Checking the beginning or end → startsWith, endsWith',
      'You need a pattern → search, which returns an index too',
      'Membership in a list → split then Array.includes',
    ],
  },

  notes: {
    complexity: 'O(n × m) worst case; engines use faster substring searches in practice',
    return:     'A number; nothing is allocated or modified',
    cpython:    'V8: Builtins-string-indexof',
    memory:     'No allocation',
    threadSafe: 'Single-threaded; the string is only read',
  },

  related: [
    { name: 'String.prototype.includes',   slug: 'string-includes',   when: 'A boolean answer, without the -1 dance' },
    { name: 'String.prototype.slice',      slug: 'string-slice',      when: 'Extract around the index you just found' },
    { name: 'String.prototype.startsWith', slug: 'string-startswith', when: 'Testing position 0 specifically' },
    { name: 'String.prototype.split',      slug: 'string-split',      when: 'All the pieces at once' },
  ],

  faq: [
    {
      q: 'Why is -1 the "not found" value rather than null?',
      a: 'It dates to C, where returning an out-of-band integer was the convention, and JavaScript inherited it via Java. It is the reason every membership test needs an explicit comparison — the failure value is truthy while a perfectly good result, 0, is falsy. includes exists precisely to avoid it.',
      code: "s.indexOf(x) !== -1;   // correct\ns.includes(x);         // clearer",
    },
    {
      q: 'How do I find every occurrence?',
      a: 'Loop, passing the previous index plus one as the starting position. Remember to advance past the match, or an empty or overlapping needle loops forever.',
      code: 'const hits = [];\nlet i = -1;\nwhile ((i = s.indexOf(x, i + 1)) !== -1) hits.push(i);',
    },
    {
      q: 'What is the difference between indexOf and search?',
      a: 'search takes a RegExp and ignores any position argument; indexOf takes a literal string and accepts a starting position. Both return an index or -1. Use search only when you genuinely need a pattern.',
      code: "'abc'.indexOf('b');   // 1\n'abc'.search(/b/);    // 1",
    },
    {
      q: 'How does lastIndexOf handle its second argument?',
      a: 'As an upper bound on where the match may start, with the scan running backwards from there — not as a place to begin reading forwards. Omit it unless you specifically need to limit how far right a match may sit.',
      code: "'hello'.lastIndexOf('l');      // 3\n'hello'.lastIndexOf('l', 2);   // 2",
    },
  ],

  history: [
    { version: 'ES1',    note: 'indexOf and lastIndexOf present from the first version of the language.' },
    { version: 'ES2015', note: 'includes added, removing the need for the !== -1 comparison in the common case.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf',
    meta:  'String.prototype.indexOf',
  },

  tryInTool: [],
};
