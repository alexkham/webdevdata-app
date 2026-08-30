// content/reference/python/functions/filter.js

export const meta = {
  slug:        'filter',
  name:        'filter',
  signature:   'filter(predicate, iterable)',
  blurb:       'Keep items where the predicate returns truthy — lazily.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: false,
  version:     'Python 1.0+',
  searchTerms: 'filter predicate keep items iterator lazy functional truthy false none',
};

export const method = {
  slug:      'filter',
  name:      'filter',
  signature: 'filter(predicate, iterable)',
  returns:   { type: 'filter', desc: 'A lazy iterator yielding items where predicate(item) is truthy. If predicate is None, keeps items that are TRUTHY themselves.' },

  category:    'Built-in function',
  version:     'Python 1.0+',
  hasLiveDemo: false,

  subtitle: 'Keep items where a predicate returns truthy — lazily. The functional cousin of a filtered comprehension.',

  cheat: {
    commonCall: 'list(filter(None, items))',
    returns:    'a lazy filter iterator — wrap in list() to materialize',
    replaces:   'a comprehension: `[x for x in items if pred(x)]`',
    watchOut:   'None as predicate means \"keep truthy items\"; iterator is consumed on first pass',
  },

  parameters: [
    { name: 'predicate', type: 'callable | None', required: true, default: null, desc: 'A function returning True/False (or truthy/falsy) per item. Special case: None means \"keep items that are themselves truthy\".' },
    { name: 'iterable',  type: 'iterable',        required: true, default: null, desc: 'The source items. Any iterable works.' },
  ],

  demoParams: [
    { name: 'items', type: 'list', hint: 'comma-separated numbers', input: 'csv-num' },
  ],
  cases: [
    { id: 'mixed',    label: 'mixed sign',      values: { items: '-3,-1,0,1,2,4' } },
    { id: 'all-pos',  label: 'all positive',    values: { items: '1,2,3,4,5' } },
    { id: 'all-neg',  label: 'all negative',    values: { items: '-5,-4,-3,-2,-1' } },
    { id: 'zeros',    label: 'zeros dropped',   values: { items: '0,1,0,2,0,3' } },
    { id: 'empty',    label: 'empty',           values: { items: '' } },
    { id: 'decimals', label: 'decimals',        values: { items: '-1.5,0,1.5' } },
  ],
  demoExplainer: 'The demo uses a fixed predicate — KEEP POSITIVE items (x > 0) — because the demo cannot accept a callable through a text input. In real code you pass any callable: `filter(str.isdigit, tokens)`, `filter(lambda x: x.startswith("_"), names)`, or `filter(None, items)` to keep only truthy values. Result is a lazy iterator — wrap in list() to see values.',

  patterns: [
    {
      name: 'Keep truthy items only',
      desc: 'The special-case `filter(None, iterable)` — the idiomatic drop-falsy pattern.',
      code: 'active = list(filter(None, items))    # drops 0, "", [], None, False',
    },
    {
      name: 'Named predicate',
      desc: 'Use the unbound method — same result as a comprehension with a call.',
      code: 'digits = list(filter(str.isdigit, tokens))',
    },
    {
      name: 'Chain with map for a pipeline',
      desc: 'Lazy: no intermediate list is built.',
      code: 'result = list(map(int, filter(str.isdigit, tokens)))',
    },
    {
      name: 'When a comprehension reads better',
      desc: 'For non-trivial predicates, a comprehension is often clearer.',
      code: '# instead of: filter(lambda x: x % 2 == 0 and x > 0, xs)\npositives_even = [x for x in xs if x % 2 == 0 and x > 0]',
    },
  ],

  examples: [
    { title: 'Keep positive',       code: 'list(filter(lambda x: x > 0, [-1, 0, 1, 2]))', returns: '[1, 2]' },
    { title: 'Predicate is None',   code: 'list(filter(None, [0, 1, "", "hi", None]))',   returns: '[1, "hi"]  # truthy only' },
    { title: 'String method as pred',code: 'list(filter(str.isdigit, ["a", "1", "b", "2"]))', returns: '["1", "2"]' },
    { title: 'Empty gives empty',   code: 'list(filter(None, []))',                      returns: '[]' },
    { title: 'All match',           code: 'list(filter(lambda x: x > 0, [1, 2, 3]))',    returns: '[1, 2, 3]' },
    { title: 'None match',          code: 'list(filter(lambda x: x > 100, [1, 2, 3]))',  returns: '[]' },
  ],

  pitfalls: [
    {
      name: 'filter() returns an ITERATOR, not a list',
      desc: 'In Python 2 it returned a list; Python 3 made it lazy. Printing a filter object shows `<filter object at ...>` — call list() to materialize.',
      wrong: { label: 'Printed iterator', code: 'print(filter(None, [1, 0, 2]))', output: '<filter object at 0x...>' },
      fix:   { label: 'Wrap in list',     code: 'print(list(filter(None, [1, 0, 2])))', output: '[1, 2]' },
    },
    {
      name: 'Iterator is CONSUMED on first pass',
      desc: 'Once iterated, a filter iterator is exhausted. Trying to reuse it gives an empty iterator.',
      wrong: { label: 'Empty second time', code: 'f = filter(None, items)\nlist(f)  # results\nlist(f)  # []', output: 'exhausted' },
      fix:   { label: 'Materialize once',  code: 'result = list(filter(None, items))', output: 'reusable' },
    },
    {
      name: 'predicate=None means \"keep truthy\", NOT \"keep everything\"',
      desc: 'Newcomer trap. `filter(None, items)` does NOT return items untouched — it drops every falsy item (0, "", [], None, False). If you truly want \"keep everything\", you did not need filter at all.',
      wrong: { label: 'Assumed identity', code: 'list(filter(None, [0, 1, 2]))', output: '[1, 2]  # 0 dropped' },
      fix:   { label: 'Use lambda',       code: 'list(filter(lambda x: True, [0, 1, 2]))', output: '[0, 1, 2]  # actually keep all' },
    },
    {
      name: 'A comprehension usually reads better than filter+lambda',
      desc: 'filter(lambda x: pred, items) is functionally identical to [x for x in items if pred] but the comprehension is more Pythonic. Reach for filter when the predicate is already named.',
      wrong: { label: 'filter + lambda', code: 'list(filter(lambda x: x > 0, xs))', output: 'works, but stiff' },
      fix:   { label: 'Comprehension',   code: '[x for x in xs if x > 0]', output: 'idiomatic' },
    },
  ],

  when: {
    use: [
      'Applying a NAMED predicate — `filter(str.isdigit, ...)`',
      'The special `filter(None, iterable)` to drop falsy items',
      'Lazy pipelines chained with map()',
      'Interop with functional-style libraries expecting iterators',
    ],
    avoid: [
      '`filter(lambda x: ...` — use a comprehension instead',
      'Need to iterate multiple times → wrap in list()',
      'Rich filtering (multiple predicates) → comprehension with `and`',
      'Filter AND modify → chain with map, or use a comprehension',
    ],
  },

  notes: {
    complexity: 'O(1) to construct; O(n) to iterate; per-item cost is predicate()',
    return:     'A filter iterator — lazy',
    cpython:    'Python/bltinmodule.c :: builtin_filter',
    memory:     'O(1) — no intermediate list is built',
    threadSafe: 'Depends on predicate and the underlying iterable',
  },

  related: [
    { name: 'map',       slug: 'map',       when: 'Transform every item instead of keeping some' },
    { name: 'any',       slug: 'any',       when: 'Just check whether any item passes the predicate' },
    { name: 'all',       slug: 'all',       when: 'Check whether every item passes' },
  ],

  faq: [
    {
      q: 'What is the difference between filter and a comprehension?',
      a: 'Behaviorally almost identical, but filter is LAZY (returns an iterator) while a comprehension with `if` is EAGER (returns a list). For a named predicate, filter is compact. For an inline test, the comprehension reads better.',
    },
    {
      q: 'Why does filter(None, items) drop zeros?',
      a: 'Because 0 is falsy in Python — the None predicate is defined as \"keep truthy items\". If you want to keep zeros but drop None, filter with `lambda x: x is not None` instead.',
    },
    {
      q: 'When would I use filter over a comprehension?',
      a: 'When the predicate is already a named callable (str.isdigit, str.startswith, etc.) — filter avoids the visual noise of writing `(x for x in items if pred(x))`. For inline predicates, the comprehension is usually clearer.',
    },
  ],

  history: [
    { version: '1.0', note: 'filter() has been a builtin since Python 1.0 — returned a list.' },
    { version: '3.0', note: 'Return type changed from list to lazy iterator.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#filter',
    meta:  'filter',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect the filtered output' },
  ],
};