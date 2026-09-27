// content/reference/javascript/methods/string-match.js

export const meta = {
  slug:        'string-match',
  name:        'String.prototype.match',
  signature:   'string.match(regexp)',
  blurb:       'Regex matches — returning null when there are none, which breaks every .length check.',
  category:    'string',
  type:        'string',
  hasLiveDemo: true,
  version:     'ES3 (1999)',
  searchTerms: 'string match regex regexp capture groups global flag null index exec test javascript',
};

export const method = {
  slug:      'string-match',
  name:      'String.prototype.match',
  signature: 'string.match(regexp)',
  returns:   { type: 'string[] | null', desc: 'With /g, an array of the whole matches. Without it, an array-like holding the match plus its capture groups, index and input. NULL when nothing matches, either way.' },

  category:    'String method',
  version:     'ES3 (1999)',
  hasLiveDemo: true,

  subtitle: 'Two methods wearing one name: the g flag changes what you get back entirely. Both share the same trap — no match returns null, not an empty array.',

  cheat: {
    commonCall: 's.match(/\\d+/g)',
    returns:    'an array of matches, or NULL',
    replaces:   'a manual exec loop',
    watchOut:   'null on no match — guard before .length or .map',
  },

  parameters: [
    { name: 'regexp', type: 'RegExp', required: true, default: null, desc: 'The pattern. With the g flag you get every whole match and nothing else; without it you get one match with its capture groups, index and input attached.' },
  ],

  demoParams: [
    { name: 's', type: 'string', hint: 'text containing numbers', input: 'text' },
  ],
  demoTemplate: '{s}.match(/\\d+/g)',
  cases: [
    { id: 'several', label: 'several numbers',   values: { s: 'a1b22c333' } },
    { id: 'one',     label: 'a single number',   values: { s: 'order 42' } },
    { id: 'none',    label: 'no match → NULL (!)', values: { s: 'abc' } },
    { id: 'empty',   label: 'empty string → NULL', values: { s: '' } },
  ],
  demoExplainer: "With the g flag the result is a plain array of the whole matches — no index, no capture groups, just the text. The third case is the one that causes real bugs: when nothing matches you get null, NOT an empty array. Calling .length or .map on that throws, so every match call needs a guard or a ?? [] fallback. Without the g flag the shape changes completely: you would get a single match with its capture groups, its index and the original input attached as properties.",

  patterns: [
    {
      name: 'Always provide a fallback',
      desc: 'Turns the null case into an empty array.',
      code: 'const nums = s.match(/\\d+/g) ?? [];',
    },
    {
      name: 'Capture groups, without g',
      desc: 'Destructure the match and its groups.',
      code: 'const [, year, month] = s.match(/(\\d{4})-(\\d{2})/) ?? [];',
    },
    {
      name: 'Just testing? Use test',
      desc: 'No allocation, and a plain boolean.',
      code: 'if (/\\d/.test(s)) { }',
    },
  ],

  examples: [
    { title: 'Global: whole matches', code: "'a1b2'.match(/\\d/g)",      returns: "['1', '2']" },
    { title: 'No match is null',      code: "'abc'.match(/\\d/g)",       returns: 'null' },
    { title: 'Without g: one match',  code: "'a1b2'.match(/\\d/)",       returns: "['1']  // plus index, input" },
    { title: 'The index property',    code: "'abc'.match(/b/).index",    returns: '1' },
    { title: 'Capture groups',        code: "'a1'.match(/(\\w)(\\d)/)",  returns: "['a1', 'a', '1']" },
    { title: 'Groups lost with g',    code: "'a1'.match(/(\\w)(\\d)/g)", returns: "['a1']" },
  ],

  pitfalls: [
    {
      name: 'No match returns null, not an empty array',
      desc: 'The single most common match bug. Every array method you would reach for next — length, map, filter, forEach — throws on null, and the failure happens only for inputs that contain no match, which are exactly the ones nobody tests.',
      wrong: { label: 'Throws', code: "'abc'.match(/\\d/g).length", output: "TypeError: Cannot read properties of null (reading 'length')" },
      fix:   { label: 'Fallback', code: "('abc'.match(/\\d/g) ?? []).length", output: '0' },
    },
    {
      name: 'The g flag silently changes the return shape',
      desc: 'Without g you get capture groups, an index and the input. With g you get only the whole matches and none of that. Adding the flag to fix "it only found one" quietly deletes the groups your destructuring relied on.',
      wrong: { label: 'Groups gone', code: "'a1'.match(/(\\w)(\\d)/g)", output: "['a1']   // no groups" },
      fix:   { label: 'Drop g, or use matchAll', code: "'a1'.match(/(\\w)(\\d)/)", output: "['a1', 'a', '1']" },
    },
    {
      name: 'You cannot have groups AND every match',
      desc: 'That combination is precisely what match cannot do, and it is why matchAll was added in ES2020. Reaching for an exec loop to work around it is the old answer; matchAll is the current one.',
      wrong: { label: 'Only whole matches', code: "'a1 b2'.match(/(\\w)(\\d)/g)", output: "['a1', 'b2']" },
      fix:   { label: 'matchAll keeps groups', code: "[...'a1 b2'.matchAll(/(\\w)(\\d)/g)].map(m => m[1])", output: "['a', 'b']" },
    },
    {
      name: 'A shared /g regex carries lastIndex state',
      desc: 'match with g resets lastIndex, but test and exec on the same regex object do not — so a module-level /g regex used by several functions gives different answers depending on call order. Define the regex where it is used.',
      wrong: { label: 'Stateful', code: 'const RE = /a/g;\nRE.test("a");\nRE.test("a")', output: 'true, then false' },
      fix:   { label: 'No g for testing', code: 'const RE = /a/;\nRE.test("a");\nRE.test("a")', output: 'true, then true' },
    },
  ],

  when: {
    use: [
      'Extracting every occurrence of a pattern, with g',
      'Pulling capture groups out of a single match, without g',
      'Finding where a pattern matched, via the index property',
    ],
    avoid: [
      'You only need a yes/no answer → RegExp.test',
      'You need groups for every match → matchAll',
      'The pattern is literal text → includes or indexOf',
      'You want to substitute → replace or replaceAll',
    ],
  },

  notes: {
    complexity: 'Depends entirely on the pattern; a poorly written regex can backtrack exponentially',
    return:     'A new array or null; the string is untouched',
    cpython:    'V8: Builtins-string-match / regexp.cc',
    memory:     'Allocates the result array and every matched substring',
    threadSafe: 'Single-threaded; a /g regex object carries mutable lastIndex state',
  },

  related: [
    { name: 'String.prototype.matchAll', slug: 'string-matchall', when: 'Every match WITH its capture groups' },
    { name: 'String.prototype.replace',  slug: 'string-replace',  when: 'Substituting rather than extracting' },
    { name: 'String.prototype.includes', slug: 'string-includes', when: 'Literal text, no pattern needed' },
    { name: 'String.prototype.split',    slug: 'string-split',    when: 'Breaking on a pattern instead of extracting it' },
  ],

  faq: [
    {
      q: 'Why does it return null instead of an empty array?',
      a: 'A legacy decision from ES3 that the language cannot change now. It is genuinely inconsistent — matchAll returns an empty iterator, and filter returns an empty array — so treat every match call as returning a nullable and add ?? [] by reflex.',
      code: 'const found = s.match(re) ?? [];',
    },
    {
      q: 'match or matchAll?',
      a: 'matchAll whenever you want capture groups from multiple matches, which match simply cannot give you. match is still the shortest way to get a plain list of whole matches, and the only way to get the index of a single match without an exec loop.',
      code: "s.match(/\\d+/g);                        // ['1', '22']\n[...s.matchAll(/(\\d)(\\d)?/g)];         // full match objects",
    },
    {
      q: 'match or test?',
      a: 'test when you only need a boolean — it allocates nothing and reads clearly. match when you need the matched text. Using match purely as a truthiness check works but builds an array you throw away.',
      code: 'if (/\\d/.test(s)) { }        // clear\nif (s.match(/\\d/)) { }       // works, wasteful',
    },
  ],

  history: [
    { version: 'ES3',    note: 'match added with the null-on-failure behaviour.' },
    { version: 'ES2015', note: 'Symbol.match allowed custom matcher objects.' },
    { version: 'ES2020', note: 'matchAll added, finally allowing groups across every match.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match',
    meta:  'String.prototype.match',
  },

  tryInTool: [],
};
