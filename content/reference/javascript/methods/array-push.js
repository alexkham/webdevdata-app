// content/reference/javascript/methods/array-push.js

export const meta = {
  slug:        'array-push',
  name:        'Array.prototype.push',
  signature:   'array.push(...items)',
  blurb:       'Append to the end IN PLACE — and it returns the new LENGTH, not the array.',
  category:    'array',
  type:        'array',
  hasLiveDemo: true,
  version:     'ES3 (1999)',
  searchTerms: 'array push append add end mutate in place length return value stack javascript',
};

export const method = {
  slug:      'array-push',
  name:      'Array.prototype.push',
  signature: 'array.push(...items)',
  returns:   { type: 'number', desc: 'The NEW length of the array — not the array, and not the pushed element. The array is modified in place.' },

  category:    'Array method',
  version:     'ES3 (1999)',
  hasLiveDemo: true,

  subtitle: 'The workhorse for building an array. Two things catch people: it returns a number rather than the array, so it cannot be chained, and it mutates.',

  cheat: {
    commonCall: 'items.push(value)',
    returns:    'number — the new length',
    replaces:   'items[items.length] = value',
    watchOut:   'cannot be chained; the return value is a length, not an array',
  },

  parameters: [
    { name: '...items', type: 'any', required: false, default: 'none', desc: 'Any number of values, appended in order. Each is added as ONE element, even if it is itself an array.' },
  ],

  demoParams: [
    { name: 'items', type: 'number[]', hint: 'starting array, comma separated', input: 'csv-num' },
    { name: 'value', type: 'number',   hint: 'value to append',                 input: 'number' },
  ],
  demoTemplate: '{items}.push({value})',
  cases: [
    { id: 'three', label: 'three become four', values: { items: '1,2,3', value: 4 } },
    { id: 'one',   label: 'one becomes two',   values: { items: '1',     value: 2 } },
    { id: 'empty', label: 'onto empty',        values: { items: '',      value: 1 } },
  ],
  demoExplainer: 'Every output here is a NUMBER — the new length after the append, which is what push returns. Pushing onto a three-element array gives 4, not [1, 2, 3, 4]. That is the single most surprising thing about the method, and the reason `const arr = old.push(x)` leaves you holding an integer instead of an array.',

  patterns: [
    {
      name: 'Build an array in a loop',
      desc: 'The standard accumulation pattern.',
      code: 'const out = [];\nfor (const x of input) out.push(transform(x));',
    },
    {
      name: 'Append several at once',
      desc: 'Spread to push the contents of another array.',
      code: 'items.push(...more);',
    },
    {
      name: 'Non-mutating append',
      desc: 'When the original must survive — state, props, caches.',
      code: 'const next = [...items, value];',
    },
  ],

  examples: [
    { title: 'Returns the length', code: '[1, 2].push(3)',                  returns: '3' },
    { title: 'The array after',    code: 'const a = [1, 2];\na.push(3);\na', returns: '[1, 2, 3]' },
    { title: 'Several at once',    code: 'const a = [1];\na.push(2, 3)',    returns: '3  // the new length' },
    { title: 'Arrays nest',        code: 'const a = [1];\na.push([2, 3]);\na', returns: '[1, [2, 3]]' },
    { title: 'Spread to flatten',  code: 'const a = [1];\na.push(...[2, 3]);\na', returns: '[1, 2, 3]' },
    { title: 'Cannot chain',       code: '[1].push(2).push(3)',             returns: 'TypeError: [1].push(...).push is not a function' },
  ],

  pitfalls: [
    {
      name: 'It returns the new length, not the array',
      desc: 'Assigning the result gives you a number. Because a number is a perfectly valid value, nothing throws at the assignment — the failure appears later when something tries to iterate it.',
      wrong: { label: 'Got a number', code: 'const next = items.push(value);', output: '4' },
      fix:   { label: 'Push, then use', code: 'items.push(value);\nconst next = items;', output: 'the array' },
    },
    {
      name: 'Pushing an array nests it',
      desc: 'push adds each argument as one element, so push([1, 2]) appends a single nested array. Spread it when you meant to append its contents.',
      wrong: { label: 'Nested', code: 'const a = [1];\na.push([2, 3]);\na', output: '[1, [2, 3]]' },
      fix:   { label: 'Spread it', code: 'a.push(...[2, 3]);', output: '[1, 2, 3]' },
    },
    {
      name: 'It mutates — bad news for shared arrays',
      desc: 'Pushing to a prop, a cached array or a piece of state changes it for everyone holding a reference. In React that means the change is invisible to re-render logic comparing by identity.',
      wrong: { label: 'Mutates state', code: 'state.items.push(x);', output: 'same reference, no re-render' },
      fix:   { label: 'New array',    code: 'setItems([...state.items, x]);', output: 'new reference' },
    },
    {
      name: 'Spreading a huge array can overflow the stack',
      desc: 'push(...bigArray) passes every element as a separate argument, and engines cap the argument count somewhere around 100k. On large data it throws rather than degrading.',
      wrong: { label: 'Too many args', code: 'out.push(...hugeArray);', output: 'RangeError: Maximum call stack size exceeded' },
      fix:   { label: 'Loop or concat', code: 'for (const x of hugeArray) out.push(x);', output: 'safe at any size' },
    },
  ],

  when: {
    use: [
      'Building an array incrementally in a loop',
      'Appending to an array you own',
      'Stack behaviour, paired with pop',
    ],
    avoid: [
      'The array is shared or state → [...items, value]',
      'You want the array back for chaining → concat or a spread',
      'Adding to the FRONT → unshift, though it is O(n)',
    ],
  },

  notes: {
    complexity: 'O(1) amortised per element',
    return:     'A number — the new length; the array is modified in place',
    cpython:    'V8: Builtins-array-push.tq',
    memory:     'May reallocate the backing store as the array grows',
    threadSafe: 'Single-threaded; mutating a shared array is the hazard here',
  },

  related: [
    { name: 'Array.prototype.pop',     slug: 'array-pop',     when: 'Remove from the end — the other half of a stack' },
    { name: 'Array.prototype.unshift', slug: 'array-unshift', when: 'Add to the front instead' },
    { name: 'Array.prototype.concat',  slug: 'array-concat',  when: 'Append without mutating' },
    { name: 'Array.prototype.splice',  slug: 'array-splice',  when: 'Insert at a position rather than the end' },
  ],

  faq: [
    {
      q: 'Why does push return a number?',
      a: 'It returns the new length, which dates back to ES3 and is occasionally useful for bookkeeping. It does mean push cannot be chained, and that assigning its result gives you an integer rather than the array you probably wanted.',
      code: 'const len = items.push(x);   // a number',
    },
    {
      q: 'How do I append without mutating?',
      a: 'Spread into a new array, or use concat. Both leave the original untouched, which is what state management and anything comparing by reference needs.',
      code: 'const next = [...items, value];',
    },
    {
      q: 'Why did push(...arr) throw a RangeError?',
      a: 'Because spreading passes every element as a separate function argument, and engines limit how many arguments a call can take — roughly 100k. Loop, or build the array with concat, when the data is large.',
    },
  ],

  history: [
    { version: 'ES3', note: 'push standardised in 1999 along with pop, shift and unshift.' },
    { version: 'ES2015', note: 'Spread syntax made [...items, value] the idiomatic non-mutating append.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push',
    meta:  'Array.prototype.push',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect array data' },
  ],
};
