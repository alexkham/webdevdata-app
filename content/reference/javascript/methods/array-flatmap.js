// content/reference/javascript/methods/array-flatmap.js

export const meta = {
  slug:        'array-flatmap',
  name:        'Array.prototype.flatMap',
  signature:   'array.flatMap(callback[, thisArg])',
  blurb:       'map then flatten ONE level — and returning [] drops the element entirely.',
  category:    'array',
  type:        'array',
  hasLiveDemo: true,
  version:     'ES2019',
  searchTerms: 'array flatMap map flatten one level expand filter map combined es2019 javascript',
};

export const method = {
  slug:      'array-flatmap',
  name:      'Array.prototype.flatMap',
  signature: 'array.flatMap(callback[, thisArg])',
  returns:   { type: 'Array', desc: 'A NEW array of the callback results, flattened by exactly one level. There is no depth argument.' },

  category:    'Array method',
  version:     'ES2019',
  hasLiveDemo: true,

  subtitle: 'map and flat(1) in one pass. Its quiet superpower is that returning an empty array removes the element — so it can filter and map at the same time.',

  cheat: {
    commonCall: 'items.flatMap(x => x.children)',
    returns:    'a new array, flattened one level',
    replaces:   'map(...).flat(), which allocates twice',
    watchOut:   'always exactly one level — there is no depth argument',
  },

  parameters: [
    { name: 'callback', type: 'Function', required: true,  default: null, desc: 'Called as callback(element, index, array). Returning an array splices its elements in; returning a non-array appends it as one element.' },
    { name: 'thisArg',  type: 'any',      required: false, default: 'undefined', desc: 'Value of `this` inside the callback. Ignored for arrow functions.' },
  ],

  demoParams: [
    { name: 'items',  type: 'number[]', hint: 'numbers, comma separated', input: 'csv-num' },
    { name: 'factor', type: 'number',   hint: 'multiplier for the pair',  input: 'number' },
  ],
  demoTemplate: '{items}.flatMap(x => [x, x * {factor}])',
  cases: [
    { id: 'pairs',  label: 'each becomes a pair', values: { items: '1,2,3', factor: 2 } },
    { id: 'triple', label: 'multiplied by 3',     values: { items: '1,2',   factor: 3 } },
    { id: 'zero',   label: 'paired with zero',    values: { items: '1,2',   factor: 0 } },
    { id: 'empty',  label: 'empty array',         values: { items: '',      factor: 2 } },
  ],
  demoExplainer: 'Each element becomes a two-element array, and those arrays are spliced into the result rather than nested inside it — so three inputs give six outputs. That flattening is exactly one level deep and is not configurable. Returning an empty array from the callback would contribute nothing at all, which is how flatMap doubles as a filter.',

  patterns: [
    {
      name: 'Expand each element into several',
      desc: 'Splitting, exploding, one-to-many.',
      code: "const words = lines.flatMap(l => l.split(' '));",
    },
    {
      name: 'Filter and map in one pass',
      desc: 'An empty array drops the element.',
      code: 'const valid = items.flatMap(x => x.ok ? [transform(x)] : []);',
    },
    {
      name: 'Collect nested children',
      desc: 'One level of nesting is exactly what flatMap handles.',
      code: 'const allChildren = nodes.flatMap(n => n.children);',
    },
  ],

  examples: [
    { title: 'Each becomes a pair', code: '[1, 2].flatMap(x => [x, x * 2])',  returns: '[1, 2, 2, 4]' },
    { title: 'Non-array appended',  code: '[1, 2].flatMap(x => x)',           returns: '[1, 2]' },
    { title: 'Empty drops it',      code: '[1, 2, 3].flatMap(x => x > 1 ? [x] : [])', returns: '[2, 3]' },
    { title: 'Only one level',      code: '[1, 2].flatMap(x => [[x]])',       returns: '[[1], [2]]' },
    { title: 'Same as map().flat()',code: "['a b'].flatMap(s => s.split(' '))", returns: "['a', 'b']" },
    { title: 'Empty array',         code: '[].flatMap(x => [x])',             returns: '[]' },
  ],

  pitfalls: [
    {
      name: 'It flattens exactly one level, always',
      desc: 'Unlike flat there is no depth argument. A callback returning nested arrays leaves the inner ones intact, and no argument will change that — you have to chain flat afterwards.',
      wrong: { label: 'Still nested', code: '[1, 2].flatMap(x => [[x]])', output: '[[1], [2]]' },
      fix:   { label: 'Chain flat',   code: '[1, 2].flatMap(x => [[x]]).flat()', output: '[1, 2]' },
    },
    {
      name: 'Forgetting to return an array',
      desc: 'A non-array return is appended as a single element, so flatMap silently behaves like map. That is legal and occasionally intended, but it means a forgotten wrapper produces no error.',
      wrong: { label: 'Behaves like map', code: '[1, 2].flatMap(x => x * 2)', output: '[2, 4]  // no flattening happened' },
      fix:   { label: 'Return an array',  code: '[1, 2].flatMap(x => [x, x * 2])', output: '[1, 2, 2, 4]' },
    },
    {
      name: 'ES2019 and newer only',
      desc: 'Missing from older runtimes and Internet Explorer. The equivalent is map followed by flat, or the older concat-spread idiom.',
      wrong: { label: 'Missing method', code: 'items.flatMap(fn)', output: 'TypeError: items.flatMap is not a function' },
      fix:   { label: 'map then flat',  code: 'items.map(fn).flat()', output: 'same result' },
    },
  ],

  when: {
    use: [
      'One element expanding into several — splitting, exploding',
      'Filtering and mapping in a single pass with [] as the drop signal',
      'Collecting one level of nested children',
    ],
    avoid: [
      'One value out per value in → map is clearer',
      'You only need to drop elements → filter',
      'Nesting deeper than one level → flat with a depth',
    ],
  },

  notes: {
    complexity: 'O(n + m) where m is the total length of the returned arrays',
    return:     'A new array; the original is never modified',
    cpython:    'V8: Builtins-array-flatmap.tq',
    memory:     'Allocates the result once, rather than the two arrays map().flat() would',
    threadSafe: 'Single-threaded; mutating the source inside the callback is undefined behaviour for unvisited indices',
  },

  related: [
    { name: 'Array.prototype.map',    slug: 'array-map',    when: 'One result per element, no flattening' },
    { name: 'Array.prototype.flat',   slug: 'array-flat',   when: 'Flattening with a configurable depth' },
    { name: 'Array.prototype.filter', slug: 'array-filter', when: 'Only dropping elements, not transforming' },
    { name: 'Array.prototype.reduce', slug: 'array-reduce', when: 'What this replaced for one-to-many expansion' },
  ],

  faq: [
    {
      q: 'Can flatMap flatten more than one level?',
      a: 'No — the depth is fixed at one and there is no argument to change it. Chain .flat() afterwards, or use map followed by flat with an explicit depth.',
      code: 'items.flatMap(fn).flat(Infinity)',
    },
    {
      q: 'How does flatMap filter?',
      a: 'Return an empty array for elements you want to drop. Because the result is flattened, an empty array contributes nothing at all — so one pass both transforms and removes.',
      code: 'items.flatMap(x => x.ok ? [f(x)] : [])',
    },
    {
      q: 'flatMap or map().flat()?',
      a: 'flatMap when both are wanted: it is one pass and one allocation instead of two, and it names the intent. map().flat() is the fallback on pre-2019 runtimes, and the only option when you need a depth other than one.',
    },
  ],

  history: [
    { version: 'ES2019', note: 'flatMap added alongside flat.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap',
    meta:  'Array.prototype.flatMap',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect nested array data' },
  ],
};
