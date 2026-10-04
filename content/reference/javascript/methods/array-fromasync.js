// content/reference/javascript/methods/array-fromasync.js
//
// Live async demo (demoAsync): the page shows `await <expr>` and renders
// the settled value. Every case is checked by audit-emulators-js.mjs.

export const meta = {
  slug:        'array-fromasync',
  name:        'Array.fromAsync',
  signature:   'Array.fromAsync(source[, mapFn[, thisArg]])',
  blurb:       'Array.from for async iterables — and the await-in-order counterpart to Promise.all.',
  category:    'array',
  type:        'array',
  hasLiveDemo: true,
  version:     'ES2024',
  searchTerms: 'Array.fromAsync async iterable await for await promise all collect stream sequential es2024 javascript',
};

export const method = {
  slug:      'array-fromasync',
  name:      'Array.fromAsync',
  signature: 'Array.fromAsync(source[, mapFn[, thisArg]])',
  returns:   { type: 'Promise<Array>', desc: 'A Promise resolving to a new array. Rejects with the first error thrown by the source, the mapFn, or any element that rejects.' },

  category:    'Array static method',
  version:     'ES2024',
  hasLiveDemo: true,

  subtitle: 'The async sibling of Array.from. It accepts async iterables, awaits every element, and — unlike Promise.all — pulls them strictly in order.',

  cheat: {
    commonCall: 'const rows = await Array.fromAsync(stream)',
    returns:    'a Promise for an array — always awaited',
    replaces:   'const out = []; for await (const x of src) out.push(x);',
    watchOut:   'it awaits IN ORDER; Promise.all does not',
  },

  parameters: [
    { name: 'source',  type: 'async iterable | iterable | array-like', required: true,  default: null, desc: 'An async iterable, a sync iterable, or an array-like. Sync sources still have each element awaited.' },
    { name: 'mapFn',   type: 'Function', required: false, default: 'none',      desc: 'Called as mapFn(element, index) after the element is awaited. May itself be async — its result is awaited too.' },
    { name: 'thisArg', type: 'any',      required: false, default: 'undefined', desc: 'Value of `this` inside mapFn.' },
  ],

  demoAsync: true,
  demoParams: [
    { name: 'json', type: 'string', hint: 'JSON list of [outcome, value, ms]', input: 'text' },
  ],
  demoTemplate: "Array.fromAsync(JSON.parse({json}).map(([k, v, ms]) => new Promise((res, rej) => setTimeout(() => k === 'ok' ? res(v) : rej(new Error(v)), ms))))",
  cases: [
    { id: 'order',  label: 'values, in input order',  values: { json: '[["ok",1,30],["ok",2,10]]' } },
    { id: 'reject', label: 'a rejection propagates',   values: { json: '[["ok",1,10],["err","boom",20]]' } },
    { id: 'empty',  label: 'empty list',               values: { json: '[]' } },
  ],
  demoExplainer: "Each input is [outcome, value, delay in ms]: 'ok' fulfils with the value, anything else rejects with an Error carrying it. Every element is awaited and the resolved values are collected in input order — where plain Array.from would hand back the promises themselves, unawaited. A rejection anywhere rejects the whole call. Because these promises were all created up front they run concurrently; with a lazy source such as an async generator, fromAsync would pull them strictly one at a time.",

  patterns: [
    {
      name: 'Collect an async stream',
      desc: 'The main reason the method exists.',
      code: 'const chunks = await Array.fromAsync(readable);',
    },
    {
      name: 'Await an array of promises in order',
      desc: 'Where Promise.all would resolve them in any order.',
      code: 'const results = await Array.fromAsync(promises);',
    },
    {
      name: 'Map asynchronously while collecting',
      desc: 'The mapFn may be async; its result is awaited.',
      code: 'const bodies = await Array.fromAsync(urls, u => fetch(u).then(r => r.text()));',
    },
  ],

  examples: [
    { title: 'From an async generator', code: 'await Array.fromAsync(gen())',                      returns: '[1, 2]' },
    { title: 'Awaits sync promises too',code: 'await Array.fromAsync([Promise.resolve(1)])',       returns: '[1]' },
    { title: 'Array.from does not',     code: 'Array.from([Promise.resolve(1)])',                  returns: '[Promise]' },
    { title: 'With an async mapFn',     code: 'await Array.fromAsync([1, 2], async x => x * 2)',   returns: '[2, 4]' },
    { title: 'Array-like still works',  code: 'await Array.fromAsync({length: 2})',                returns: '[undefined, undefined]' },
    { title: 'It returns a Promise',    code: 'Array.fromAsync([1]) instanceof Promise',           returns: 'true' },
  ],

  pitfalls: [
    {
      name: 'Forgetting to await it',
      desc: 'The return value is a Promise, never an array. Without await you get a Promise object whose length is undefined and whose array methods do not exist — and nothing throws at the point of the mistake.',
      wrong: { label: 'A Promise, not an array', code: 'const a = Array.fromAsync(src);\na.length', output: 'undefined' },
      fix:   { label: 'Await it',                code: 'const a = await Array.fromAsync(src);',     output: 'a real array' },
    },
    {
      name: 'It is not a faster Promise.all',
      desc: 'fromAsync awaits elements one at a time, in order. For an array of promises that were already created this costs nothing — they are all in flight already — but for a lazy source such as an async generator, each element is only requested after the previous one settles, so the total time is the SUM of the waits rather than the longest.',
      wrong: { label: 'Serial over a lazy source', code: 'await Array.fromAsync(slowGenerator())', output: 'sum of every delay' },
      fix:   { label: 'Concurrent',                code: 'await Promise.all(urls.map(fetch))',      output: 'as slow as the slowest' },
    },
    {
      name: 'One rejection abandons the rest',
      desc: 'Like Promise.all, the first rejection rejects the whole thing, and with a lazy source the remaining elements are never even requested. There is no allSettled equivalent — map to a settled wrapper yourself if you need every result.',
      wrong: { label: 'Loses the successes', code: 'await Array.fromAsync(mixed)', output: 'rejects on the first failure' },
      fix:   { label: 'Capture each outcome', code: 'await Array.fromAsync(src, p =>\n  p.then(v => ({ok: true, v}), e => ({ok: false, e})));', output: 'every result kept' },
    },
    {
      name: 'An infinite async source never resolves',
      desc: 'It collects everything into memory before resolving, so an endless stream — a websocket, a tailed log, a polling generator — hangs forever and grows without bound. Bound it with a take-style helper or a plain for await with a break.',
      wrong: { label: 'Never settles', code: 'await Array.fromAsync(endlessStream)', output: 'hangs, memory grows' },
      fix:   { label: 'Stop yourself',  code: 'for await (const x of endlessStream) {\n  if (done(x)) break;\n}', output: 'bounded' },
    },
    {
      name: 'ES2024 — check your runtime',
      desc: 'Node 22+ and recent browsers. It is trivially polyfilled by a for-await loop, which is also what to write if you need to support anything older.',
      wrong: { label: 'Missing', code: 'Array.fromAsync(src)', output: 'TypeError: Array.fromAsync is not a function' },
      fix:   { label: 'Write the loop', code: 'const out = [];\nfor await (const x of src) out.push(x);', output: 'same result' },
    },
  ],

  when: {
    use: [
      'Draining a finite async iterable into an array',
      'Collecting the output of an async generator',
      'Awaiting a list of values where order of resolution matters',
      'Mapping asynchronously while collecting, in one pass',
    ],
    avoid: [
      'You want maximum concurrency → Promise.all over a mapped array',
      'You need every outcome including failures → Promise.allSettled',
      'The source is synchronous and holds no promises → Array.from',
      'The stream is infinite or huge → for await with a break, and process as you go',
    ],
  },

  notes: {
    complexity: 'O(n), plus the awaited time of every element',
    return:     'A Promise for a new array; the source is only consumed, never modified',
    cpython:    'V8: Builtins-array-fromasync.tq',
    memory:     'The entire result is buffered in memory before the Promise resolves',
    threadSafe: 'Single-threaded; consuming an async iterator twice concurrently is a mistake',
  },

  related: [
    { name: 'Array.from',           slug: 'array-from',    when: 'The synchronous original, for iterables and array-likes' },
    { name: 'Array.of',             slug: 'array-of',      when: 'Build an array from explicit values' },
    { name: 'Array.isArray',        slug: 'array-isarray', when: 'Check what you actually got back' },
    { name: 'Array.prototype.map',  slug: 'array-map',     when: 'Mapping to promises to hand to Promise.all' },
  ],

  faq: [
    {
      q: 'How is this different from Promise.all?',
      a: 'Promise.all takes an array of promises that are already running and waits for all of them concurrently. Array.fromAsync pulls from an iterable one element at a time and awaits each before asking for the next. Over an array of existing promises the two finish together; over a lazy async generator, fromAsync is genuinely serial because nothing starts until it is requested.',
      code: 'await Promise.all(promises);       // concurrent\nawait Array.fromAsync(promises);   // in order, same elapsed time here\nawait Array.fromAsync(gen());      // strictly one at a time',
    },
    {
      q: 'Why does it await elements of a plain array?',
      a: 'Because it awaits every value it collects, regardless of where it came from. That is the one behaviour separating it from Array.from, which would hand back the Promise objects untouched.',
      code: 'Array.from([Promise.resolve(1)]);         // [Promise]\nawait Array.fromAsync([Promise.resolve(1)]); // [1]',
    },
    {
      q: 'Can I polyfill it?',
      a: 'Yes, and the polyfill is the reason the method is a convenience rather than a necessity — a for-await loop pushing into an array does the same job in three lines. The static exists mainly to make the common case an expression instead of a statement.',
      code: 'async function fromAsync(src, fn) {\n  const out = [];\n  let i = 0;\n  for await (const x of src) out.push(fn ? await fn(x, i++) : x);\n  return out;\n}',
    },
  ],

  history: [
    { version: 'ES2015', note: 'Array.from added for sync iterables and array-likes.' },
    { version: 'ES2024', note: 'Array.fromAsync added, completing the pair for async iterables.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fromAsync',
    meta:  'Array.fromAsync',
  },

};
