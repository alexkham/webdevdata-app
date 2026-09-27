// content/reference/javascript/methods/set-has.js

export const meta = {
  slug:        'set-has',
  name:        'Set.prototype.has',
  signature:   'set.has(value)',
  blurb:       'Constant-time membership — the reason to build a Set instead of scanning an array.',
  category:    'set',
  type:        'set',
  hasLiveDemo: true,
  version:     'ES2015',
  searchTerms: 'Set has includes membership contains lookup O(1) performance array includes indexOf es2015 javascript',
};

export const method = {
  slug:      'set-has',
  name:      'Set.prototype.has',
  signature: 'set.has(value)',
  returns:   { type: 'boolean', desc: 'True if the value is a member, compared by SameValueZero. Constant time on average, however large the Set.' },

  category:    'Set method',
  version:     'ES2015',
  hasLiveDemo: true,

  subtitle: 'The performance argument for Set in one method. Array.includes walks the whole array; this hashes once.',

  cheat: {
    commonCall: 'set.has(value)',
    returns:    'boolean',
    replaces:   'array.includes, inside a loop',
    watchOut:   'objects match by reference, as with add',
  },

  parameters: [
    { name: 'value', type: 'any', required: true, default: null, desc: 'The value to test, compared by SameValueZero — NaN is found, 0 and -0 are the same member, objects match only by reference.' },
  ],

  demoParams: [
    { name: 'json', type: 'string', hint: 'JSON array, e.g. [1,2,3]', input: 'text' },
    { name: 'v',    type: 'number', hint: 'value to test',            input: 'number' },
  ],
  demoTemplate: 'new Set(JSON.parse({json})).has({v})',
  cases: [
    { id: 'yes',    label: 'present',            values: { json: '[1,2,3]', v: 2 } },
    { id: 'no',     label: 'absent',             values: { json: '[1,2,3]', v: 9 } },
    { id: 'zero',   label: 'the value 0',        values: { json: '[0,1]', v: 0 } },
    { id: 'empty',  label: 'empty Set',          values: { json: '[]', v: 1 } },
  ],
  demoExplainer: "A plain boolean, computed in constant time. The zero case is worth noting because it is where a truthiness shortcut goes wrong: has returns true for a stored 0, whereas code written as `if (set.has(v) && v)` or one that relies on indexOf being truthy would treat it as absent. The real value of this method is what the demo cannot show — the timing. Testing membership a thousand times against a thousand-element collection is a thousand hash lookups here and a million comparisons with Array.includes.",

  patterns: [
    {
      name: 'Filter against an allow-list',
      desc: 'Build the Set once, test many times.',
      code: 'const allowed = new Set(list);\nconst kept = items.filter(i => allowed.has(i));',
    },
    {
      name: 'Skip what you have seen',
      desc: 'The dedupe-while-streaming idiom.',
      code: 'const seen = new Set();\nfor (const x of xs) {\n  if (seen.has(x)) continue;\n  seen.add(x);\n}',
    },
    {
      name: 'Array includes for a one-off',
      desc: 'Building a Set is not worth it for a single test.',
      code: 'if (list.includes(value)) { }',
    },
  ],

  examples: [
    { title: 'Present',        code: 'new Set([1, 2]).has(2)',   returns: 'true' },
    { title: 'Absent',         code: 'new Set([1, 2]).has(9)',   returns: 'false' },
    { title: 'NaN is found',   code: 'new Set([NaN]).has(NaN)',  returns: 'true' },
    { title: 'includes agrees on NaN', code: '[NaN].includes(NaN)', returns: 'true' },
    { title: 'indexOf does not', code: '[NaN].indexOf(NaN)',     returns: '-1' },
    { title: 'Objects by reference', code: 'new Set([{}]).has({})', returns: 'false' },
  ],

  pitfalls: [
    {
      name: 'Objects match only by reference',
      desc: 'Same rule as add. A Set of parsed objects cannot be queried with a freshly built equivalent — has returns false every time, and nothing indicates why.',
      wrong: { label: 'Never found', code: 'new Set([{id: 1}]).has({id: 1})', output: 'false' },
      fix:   { label: 'Store primitives', code: 'new Set([1]).has(1)', output: 'true' },
    },
    {
      name: 'Building a Set inside a loop defeats the point',
      desc: 'The saving comes from constructing once and querying many times. A Set built inside the filter callback is rebuilt on every element, turning a linear algorithm into a quadratic one — slower than the includes it replaced.',
      wrong: { label: 'Rebuilt each time', code: 'items.filter(i => new Set(list).has(i))', output: 'O(n × m)' },
      fix:   { label: 'Build once',        code: 'const s = new Set(list);\nitems.filter(i => s.has(i))', output: 'O(n + m)' },
    },
    {
      name: 'It is not Array.includes with a fromIndex',
      desc: 'There is no second argument and no notion of position — a Set is unordered for querying purposes even though it preserves insertion order for iteration. If you need "after index n", you want an array.',
      wrong: { label: 'Ignored', code: 'new Set([1, 2]).has(1, 5)', output: 'true   // the 5 does nothing' },
      fix:   { label: 'Use an array', code: '[1, 2].includes(1, 1)', output: 'false' },
    },
    {
      name: 'Case and whitespace are significant',
      desc: 'Membership is exact. A Set built from user input needs the same normalisation applied to the query, or lookups miss for reasons that look arbitrary.',
      wrong: { label: 'Misses', code: 'new Set(["Alice"]).has("alice")', output: 'false' },
      fix:   { label: 'Normalise both sides', code: 'new Set(["Alice"].map(s => s.toLowerCase())).has("alice")', output: 'true' },
    },
  ],

  when: {
    use: [
      'Repeated membership tests against the same collection',
      'Allow-lists, deny-lists, visited and seen tracking',
      'Replacing includes inside a loop',
    ],
    avoid: [
      'A single test against an existing array → includes',
      'You need the position → indexOf on an array',
      'Matching objects by contents → key on a primitive',
      'You need the value associated with the key → a Map',
    ],
  },

  notes: {
    complexity: 'O(1) average',
    return:     'A boolean; nothing is allocated',
    cpython:    'V8: Builtins-set-has',
    memory:     'No allocation',
    threadSafe: 'Single-threaded; the Set is only read',
  },

  related: [
    { name: 'Set.prototype.add',          slug: 'set-add',          when: 'Adding what you found missing' },
    { name: 'Set.prototype.delete',       slug: 'set-delete',       when: 'Removing a member' },
    { name: 'Set.prototype.isDisjointFrom', slug: 'set-predicates', when: 'Testing many values at once' },
    { name: 'Array.prototype.includes',   slug: 'array-includes',   when: 'The array equivalent, for a one-off' },
  ],

  faq: [
    {
      q: 'How much faster is this than Array.includes?',
      a: 'has is constant time; includes is linear. For one test on a short array the difference is noise and includes is simpler. For repeated tests — filtering one list against another — converting to a Set turns O(n × m) into O(n + m), which is the difference between instant and unusable at scale.',
    },
    {
      q: 'Does it handle NaN?',
      a: 'Yes. SameValueZero treats NaN as equal to itself, so a stored NaN can be found — unlike Array.indexOf, which uses strict equality and never finds it. Array.includes also uses SameValueZero and does find it.',
      code: 'new Set([NaN]).has(NaN);   // true\n[NaN].indexOf(NaN);        // -1\n[NaN].includes(NaN);       // true',
    },
    {
      q: 'Can I test several values at once?',
      a: 'Build a Set of the candidates and use isSubsetOf or isDisjointFrom — the ES2025 operations express "are all of these present" and "are none of these present" directly.',
      code: 'candidates.isSubsetOf(allowed);      // all present\ncandidates.isDisjointFrom(banned);   // none present',
    },
  ],

  history: [
    { version: 'ES2015', note: 'Set added with has, add and delete.' },
    { version: 'ES2016', note: 'Array.prototype.includes added, bringing the array equivalent up to SameValueZero.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/has',
    meta:  'Set.prototype.has',
  },

  tryInTool: [],
};
