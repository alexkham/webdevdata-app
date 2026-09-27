// content/reference/javascript/methods/array-from.js

export const meta = {
  slug:        'array-from',
  name:        'Array.from',
  signature:   'Array.from(source[, mapFn[, thisArg]])',
  blurb:       'Build a real array from anything iterable or array-like — with an optional map built in.',
  category:    'array',
  type:        'array',
  hasLiveDemo: true,
  version:     'ES2015',
  searchTerms: 'Array.from convert iterable array-like NodeList Set Map arguments static length factory es2015 javascript',
};

export const method = {
  slug:      'array-from',
  name:      'Array.from',
  signature: 'Array.from(source[, mapFn[, thisArg]])',
  returns:   { type: 'Array', desc: 'A new real array. Accepts anything iterable (Set, Map, string, generator) and anything array-like (an object with a length).' },

  category:    'Array static method',
  version:     'ES2015',
  hasLiveDemo: true,

  subtitle: 'A static on Array, not a method on an array. Its two superpowers: it handles array-LIKE objects that spread cannot, and its second argument maps as it builds.',

  cheat: {
    commonCall: 'Array.from(nodeList)',
    returns:    'a new array',
    replaces:   '[].slice.call(arrayLike) from the ES5 era',
    watchOut:   'a non-iterable without a length gives an EMPTY array, not an error',
  },

  parameters: [
    { name: 'source',  type: 'iterable | array-like', required: true,  default: null, desc: 'Anything iterable, or any object with a numeric length property. A plain object without length yields an empty array.' },
    { name: 'mapFn',   type: 'Function',              required: false, default: 'none', desc: 'Called as mapFn(element, index) while building. Avoids the intermediate array that Array.from(x).map(f) would create.' },
    { name: 'thisArg', type: 'any',                   required: false, default: 'undefined', desc: 'Value of `this` inside mapFn.' },
  ],

  demoParams: [
    { name: 's', type: 'string', hint: 'a string to expand', input: 'text' },
  ],
  demoTemplate: 'Array.from({s})',
  cases: [
    { id: 'word',     label: 'a word',        values: { s: 'abc' } },
    { id: 'longer',   label: 'longer string', values: { s: 'hello' } },
    { id: 'repeats',  label: 'repeats kept',  values: { s: 'aab' } },
    { id: 'empty',    label: 'empty string',  values: { s: '' } },
  ],
  demoExplainer: 'A string is iterable, so it expands to one element per character — the same as spreading it. What the demo cannot show is the case that makes Array.from genuinely necessary: array-LIKE objects such as a DOM NodeList or the old arguments object have a length but no iterator, and a spread cannot handle them while Array.from can.',

  patterns: [
    {
      name: 'Convert a NodeList or Set',
      desc: 'The most common real use.',
      code: 'const els = Array.from(document.querySelectorAll("li"));\nconst unique = Array.from(new Set(values));',
    },
    {
      name: 'Build a range',
      desc: 'The length-object trick, with the index as the value.',
      code: 'const range = Array.from({length: 5}, (_, i) => i);',
    },
    {
      name: 'Build a grid with independent rows',
      desc: 'The factory runs per element — unlike fill, which shares one reference.',
      code: 'const grid = Array.from({length: 3}, () => new Array(3).fill(0));',
    },
  ],

  examples: [
    { title: 'From a string',      code: "Array.from('abc')",                     returns: "['a', 'b', 'c']" },
    { title: 'With a map',         code: 'Array.from([1, 2], x => x * 2)',        returns: '[2, 4]' },
    { title: 'A range',            code: 'Array.from({length: 3}, (_, i) => i)',  returns: '[0, 1, 2]' },
    { title: 'Length only',        code: 'Array.from({length: 3})',               returns: '[undefined, undefined, undefined]' },
    { title: 'Deduplicate',        code: 'Array.from(new Set([1, 1, 2]))',        returns: '[1, 2]' },
    { title: 'Non-iterable is empty', code: 'Array.from(123)',                    returns: '[]' },
  ],

  pitfalls: [
    {
      name: 'A non-iterable gives an empty array, not an error',
      desc: 'Passing a number, or a plain object with no length, returns [] silently. Nothing throws, so the mistake surfaces later as a loop that never runs.',
      wrong: { label: 'Silently empty', code: 'Array.from({a: 1})', output: '[]' },
      fix:   { label: 'Use the values', code: 'Object.values({a: 1})', output: '[1]' },
    },
    {
      name: 'Array.from({length: n}) gives undefined, not holes',
      desc: 'A useful difference from new Array(n). These are real undefined values, so map and forEach DO visit them — which is why the length-object idiom works where new Array(n).map does not.',
      wrong: { label: 'Holes are skipped', code: 'new Array(3).map((_, i) => i)', output: '[ <3 empty items> ]' },
      fix:   { label: 'Real undefined',    code: 'Array.from({length: 3}, (_, i) => i)', output: '[0, 1, 2]' },
    },
    {
      name: 'It is a static, not an instance method',
      desc: 'Array.from(x), never x.from(). Calling it on an array instance is a TypeError, which is a common slip when converting from a chained style.',
      wrong: { label: 'Not on instances', code: '[1, 2].from()', output: 'TypeError: [1,2].from is not a function' },
      fix:   { label: 'Call on Array',    code: 'Array.from([1, 2])', output: '[1, 2]' },
    },
    {
      name: 'The map argument beats chaining',
      desc: 'Array.from(x).map(f) builds an intermediate array and throws it away. The second argument maps during construction — one pass, one allocation.',
      wrong: { label: 'Two arrays', code: 'Array.from(set).map(f)', output: 'works, allocates twice' },
      fix:   { label: 'One pass',   code: 'Array.from(set, f)', output: 'same result' },
    },
  ],

  when: {
    use: [
      'Converting a NodeList, Set, Map or arguments object to a real array',
      'Array-like objects that a spread cannot handle',
      'Building a range or a grid with a per-element factory',
      'Mapping while converting, in a single pass',
    ],
    avoid: [
      'The source is already an iterable and you want the shortest form → [...source]',
      'You want the same value in every slot → fill, though watch the shared reference',
      'The source is a plain object → Object.values or Object.entries',
    ],
  },

  notes: {
    complexity: 'O(n) — every element is copied, plus mapFn if supplied',
    return:     'A new array; the source is not modified',
    cpython:    'V8: Builtins-array-from.tq',
    memory:     'Allocates one array; the mapFn form avoids a second',
    threadSafe: 'Single-threaded; the source is only read',
  },

  related: [
    { name: 'Array.of',              slug: 'array-of',      when: 'Build from explicit arguments instead of a source' },
    { name: 'Array.isArray',         slug: 'array-isarray', when: 'Test whether something is already an array' },
    { name: 'Array.prototype.fill',  slug: 'array-fill',    when: 'The shared-reference alternative for initialising' },
    { name: 'Array.prototype.map',   slug: 'array-map',     when: 'Mapping an array you already have' },
  ],

  faq: [
    {
      q: 'Array.from or spread?',
      a: 'Spread is shorter for anything iterable. Array.from is required for array-LIKE objects that have a length but no iterator — older DOM collections and the arguments object — and it is better when you also want to map, since the second argument avoids an intermediate array.',
      code: 'Array.from(nodeList);     // works\n[...nodeList];            // only if iterable',
    },
    {
      q: 'Why does Array.from({length: 3}) work at all?',
      a: 'Because an object with a numeric length counts as array-like. Array.from reads indices 0 to length-1, finds nothing, and produces real undefined values — which makes it the reliable way to build a range, unlike new Array(3) whose holes get skipped.',
      code: 'Array.from({length: 3}, (_, i) => i)   // [0, 1, 2]',
    },
    {
      q: 'How do I build a grid without shared rows?',
      a: 'Use Array.from with a factory, which runs once per element. fill would store a single row reference in every slot, so mutating one row would appear to change them all.',
      code: 'Array.from({length: 3}, () => new Array(3).fill(0));',
    },
  ],

  history: [
    { version: 'ES2015', note: 'Array.from added alongside Array.of, replacing the [].slice.call idiom.' },
    { version: 'ES2024', note: 'Array.fromAsync added for async iterables.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from',
    meta:  'Array.from',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect the data you are converting' },
  ],
};
