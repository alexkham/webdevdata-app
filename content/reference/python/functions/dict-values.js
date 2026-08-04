// content/reference/python/functions/dict-values.js
//
// Slug is type-prefixed: `values` is a dict method (also a view type).

export const meta = {
  slug:        'dict-values',
  name:        'dict.values',
  signature:   'dict.values()',
  blurb:       'A live view of the dict&apos;s values.',
  category:    'dict',
  type:        'dict',
  hasLiveDemo: true,
  version:     'Python 2.2+',
  searchTerms: 'values view dict iterate for loop payload data',
};

export const method = {
  slug:      'dict-values',
  name:      'dict.values',
  signature: 'dict.values()',
  returns:   { type: 'dict_values', desc: 'A view object over the dict&apos;s values. Live — reflects changes to the underlying dict. Iterable and sized. NOT set-like (values may be unhashable and may repeat).' },

  category:    'Dict method',
  version:     'Python 2.2+',
  hasLiveDemo: true,

  subtitle: 'Iterate the dict&apos;s values as a live view — not a copy. Insertion order preserved (3.7+).',

  cheat: {
    commonCall: 'for v in d.values():',
    returns:    'a dict_values view — live, not a list',
    replaces:   'the manual `[d[k] for k in d]` value-list',
    watchOut:   'not set-like (values may be unhashable); no direct membership hash speed-up',
  },

  parameters: [
    // values() takes no arguments — parameters array intentionally empty
  ],

  demoParams: [
    { name: 'dict', type: 'dict', hint: 'key: value pairs', input: 'kv' },
  ],
  cases: [
    { id: 'basic',      label: 'basic',            values: { dict: 'a: 1, b: 2, c: 3' } },
    { id: 'strings',    label: 'string values',    values: { dict: 'name: alice, role: admin' } },
    { id: 'duplicates', label: 'duplicate values', values: { dict: 'x: yes, y: no, z: yes' } },
    { id: 'one',        label: 'single pair',      values: { dict: 'only: 42' } },
    { id: 'empty',      label: 'empty dict',       values: { dict: '' } },
  ],
  demoExplainer: 'The demo materializes the view as a list so you can see the values at once. In real code you iterate directly: `for v in d.values():`. Since Python 3.7 the order matches insertion order of keys; earlier versions gave no guarantee. Duplicate values are preserved — values() is not a set.',

  patterns: [
    {
      name: 'Aggregate over values',
      desc: 'sum, max, min, average — all one call away.',
      code: 'total = sum(d.values())\navg   = sum(d.values()) / len(d)',
    },
    {
      name: 'Membership test on values',
      desc: '`x in d` tests KEYS; `x in d.values()` tests values.',
      code: 'if "admin" in d.values():\n    ...',
    },
    {
      name: 'Filter dict by value',
      desc: 'Comprehension over items keeps the key/value link — do not iterate values() alone if you need the key too.',
      code: 'active = {k: v for k, v in d.items() if v}',
    },
  ],

  examples: [
    { title: 'Iterate values',       code: 'list({"a": 1, "b": 2}.values())',        returns: '[1, 2]' },
    { title: 'Duplicates preserved', code: 'list({"a": 1, "b": 1}.values())',        returns: '[1, 1]  # unlike a set' },
    { title: 'Empty dict',           code: 'list({}.values())',                       returns: '[]' },
    { title: 'Insertion order',      code: 'list({"z": 1, "a": 2}.values())',        returns: '[1, 2]' },
    { title: 'Sum over values',      code: 'sum({"a": 10, "b": 20}.values())',       returns: '30' },
    { title: 'Membership test',      code: '"admin" in {"role": "admin"}.values()',   returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'It is a VIEW, not a list',
      desc: 'values() returns a live view. Type checks that expect list, or indexing, both fail. Wrap in list() when you need a snapshot or index access.',
      wrong: { label: 'Not indexable', code: 'd = {"a": 1, "b": 2}\nd.values()[0]', output: "TypeError: 'dict_values' object is not subscriptable" },
      fix:   { label: 'Materialize',   code: 'list(d.values())[0]', output: '1' },
    },
    {
      name: 'NOT set-like — unlike keys() and items()',
      desc: 'Values may be unhashable and may repeat, so `d.values()` does not support union/intersection/difference. Only keys() and items() are set-like.',
      wrong: { label: 'Type error', code: '{"a": 1}.values() &amp; {1, 2}', output: "TypeError: unsupported operand type(s) for &amp;: 'dict_values' and 'set'" },
      fix:   { label: 'Convert first', code: 'set({"a": 1}.values()) &amp; {1, 2}', output: '{1}' },
    },
    {
      name: '`x in d.values()` is O(n)',
      desc: 'Value membership walks the values one by one — no hash speed-up. Big dicts with heavy value-membership testing want a separate reverse-index structure.',
      wrong: { label: 'Slow on big dicts', code: 'if target in huge_dict.values():\n    ...    # scans every value', output: 'O(n) per check' },
      fix:   { label: 'Reverse-index once', code: 'value_set = set(huge_dict.values())\nif target in value_set: ...', output: 'O(1) per check after O(n) build' },
    },
    {
      name: 'Modifying the dict during iteration raises',
      desc: 'Changing the dict&apos;s size while iterating over its values view is a RuntimeError. Add/remove keys mid-loop — take a snapshot first.',
      wrong: { label: 'Runtime error', code: 'for v in d.values():\n    if v is None:\n        del d[find_key(d, v)]', output: 'RuntimeError: dictionary changed size during iteration' },
      fix:   { label: 'Snapshot first',code: 'for k in list(d):\n    if d[k] is None:\n        del d[k]', output: 'safe' },
    },
  ],

  when: {
    use: [
      'Aggregating values with sum / max / min / mean',
      'Membership testing (`x in d.values()`) on small dicts',
      'Feeding statistics / iteration pipelines with just the values',
      '&quot;What values appear anywhere?&quot; questions',
    ],
    avoid: [
      'Set-like operations → keys() or items() (values are not set-like)',
      'Heavy value membership on big dicts → build a set once',
      'Value → key lookup → build a reverse dict',
      'You also need the key → use d.items()',
    ],
  },

  notes: {
    complexity: 'O(1) to create the view; O(n) to iterate',
    return:     'dict_values view — live, sized, iterable, NOT set-like',
    cpython:    'Objects/dictobject.c :: dictvalues_new — no data copied',
    memory:     'O(1) — the view is a small wrapper over the dict',
    threadSafe: 'Iteration is not safe under concurrent mutation of the source dict',
  },

  related: [
    { name: 'dict.keys',       slug: 'dict-keys',  when: 'Just the keys — and set-like' },
    { name: 'dict.items',      slug: 'dict-items', when: 'Both key and value at once' },
    { name: 'dict.get',        slug: 'get',        when: 'Read a single value safely' },
    { name: 'dict.pop',        slug: 'dict-pop',   when: 'Remove while retrieving a value' },
    { name: 'sum',             slug: 'sum',        when: 'Aggregate numeric values' },
    { name: 'max',             slug: 'max',        when: 'Find the largest value' },
  ],

  faq: [
    {
      q: 'Why are keys() set-like but values() is not?',
      a: 'Keys in a dict are unique and hashable — that is what a set requires. Values may repeat and may be unhashable (lists, dicts, other unhashable types). So values cannot form a set without extra work.',
    },
    {
      q: 'Is there a fast way to check if a value exists?',
      a: 'Not directly — `x in d.values()` is O(n). If you check often, build a set of values once (O(n)) and reuse it (O(1) per check).',
      code: 'value_set = set(d.values())\n# repeated checks are now O(1) each',
    },
    {
      q: 'Does values() preserve insertion order?',
      a: 'Since Python 3.7, yes — it iterates in the same order the keys were inserted. Before 3.7 the order was implementation-defined.',
    },
  ],

  history: [
    { version: '2.2', note: 'values() introduced (originally as a list-building method).' },
    { version: '3.0', note: 'values() became a view instead of a list; itervalues() was removed.' },
    { version: '3.7', note: 'Insertion order preserved by dict — values() iterates in that order.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#dict.values',
    meta:  'dict.values',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect dict data' },
  ],
};