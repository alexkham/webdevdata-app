// content/reference/python/stdlib/collections/chainmap-pop.js

export const meta = {
  slug:        'chainmap-pop',
  name:        'ChainMap pop / popitem / clear',
  signature:   'ChainMap.pop(key[, default])  ·  ChainMap.popitem()  ·  ChainMap.clear()',
  blurb:       'Removal on a ChainMap only ever touches the first mapping: pop, popitem, clear and del ignore every later map.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.3+',
  searchTerms: 'chainmap pop popitem clear delete del ChainMap.pop ChainMap.popitem ChainMap.clear key not found in the first mapping no keys found python collections',
};

export const method = {
  slug:      'chainmap-pop',
  name:      'ChainMap pop / popitem / clear',
  signature: 'ChainMap.pop(key[, default])',
  returns:   { type: 'value | tuple | None', desc: 'pop → the removed value; popitem → a (key, value) pair; clear → None.' },

  category:    'ChainMap methods',
  version:     'Python 3.3+',
  hasLiveDemo: true,

  subtitle: 'A key that is visible through the ChainMap may still be impossible to delete through it: if it lives in a later mapping, pop and del raise KeyError("Key not found in the first mapping: …").',

  covers: ['ChainMap.pop', 'ChainMap.popitem', 'ChainMap.clear'],

  cheat: {
    commonCall: "cm.pop('key') · cm.popitem() · cm.clear()",
    returns:    'value · (key, value) · None',
    replaces:   'cm.maps[0].pop(...) — which is what they call',
    watchOut:   'a key only in a later map cannot be popped',
  },

  parameters: [
    { name: 'key',     type: 'hashable', required: true,  default: null, desc: 'pop: the key to remove from maps[0].' },
    { name: 'default', type: 'object',   required: false, default: null, desc: 'pop: returned instead of raising when maps[0] lacks the key.' },
  ],

  modes: [
    {
      id: 'pop',
      label: 'pop',
      blurb: 'pop only looks in the first mapping.',
      params: [
        { name: 'a',   type: 'list[str]', hint: 'keys of maps[0] (value 1)', input: 'csv' },
        { name: 'b',   type: 'list[str]', hint: 'keys of maps[1] (value 2)', input: 'csv' },
        { name: 'key', type: 'str',       hint: 'key to pop',                input: 'text' },
      ],
      template: 'from collections import ChainMap\ncm = ChainMap(dict.fromkeys({$a}, 1), dict.fromkeys({$b}, 2))\n(cm.pop({$key}), cm)',
      cases: [
        { id: 'first',  label: 'in maps[0]',   values: { a: 'x, y', b: 'y, z', key: 'y' } },
        { id: 'second', label: 'in maps[1] only', values: { a: 'x', b: 'z', key: 'z' } },
      ],
    },
    {
      id: 'popitem',
      label: 'popitem',
      blurb: 'Removes the last pair of maps[0]; fails when maps[0] is empty even if other maps are not.',
      params: [
        { name: 'a', type: 'list[str]', hint: 'keys of maps[0]', input: 'csv' },
        { name: 'b', type: 'list[str]', hint: 'keys of maps[1]', input: 'csv' },
      ],
      template: 'from collections import ChainMap\ncm = ChainMap(dict.fromkeys({$a}, 1), dict.fromkeys({$b}, 2))\n(cm.popitem(), cm)',
      cases: [
        { id: 'ok',    label: 'maps[0] has keys', values: { a: 'x, y', b: 'z' } },
        { id: 'empty', label: 'maps[0] empty',    values: { a: '', b: 'z' } },
      ],
    },
    {
      id: 'clear',
      label: 'clear',
      blurb: 'clear() empties maps[0] only — the chain can still show keys afterwards.',
      params: [
        { name: 'a', type: 'list[str]', hint: 'keys of maps[0]', input: 'csv' },
        { name: 'b', type: 'list[str]', hint: 'keys of maps[1]', input: 'csv' },
      ],
      template: 'from collections import ChainMap\ncm = ChainMap(dict.fromkeys({$a}, 1), dict.fromkeys({$b}, 2))\ncm.clear()\n(cm, dict(cm))',
      cases: [
        { id: 'layers', label: 'two layers', values: { a: 'x, y', b: 'y, z' } },
      ],
    },
  ],
  demoExplainer: 'Popping y removes it from maps[0], after which the y in maps[1] shows through again. Popping z, which only exists in maps[1], raises KeyError: "Key not found in the first mapping: \'z\'". After clear() the chain still exposes the keys of the second mapping.',

  patterns: [
    {
      name: 'Remove a local override',
      desc: 'Revert to the lower layer by deleting from maps[0].',
      code: "settings.pop('color', None)",
    },
    {
      name: 'Delete from a specific layer',
      desc: 'Go through .maps.',
      code: "del cm.maps[1]['color']",
    },
  ],

  examples: [
    { title: 'pop from maps[0]',                  code: "from collections import ChainMap\ncm = ChainMap({'a': 1}, {'a': 2})\n(cm.pop('a'), cm['a'])", returns: '(1, 2)' },
    { title: 'pop with a default',                code: "from collections import ChainMap\nChainMap({}, {'a': 2}).pop('a', 'none')", returns: "'none'" },
    { title: 'A key in a later map cannot be popped', code: "from collections import ChainMap\nChainMap({}, {'a': 2}).pop('a')", returns: "KeyError: \"Key not found in the first mapping: 'a'\"" },
    { title: 'del follows the same rule',         code: "from collections import ChainMap\ncm = ChainMap({}, {'a': 2})\ndel cm['a']", returns: "KeyError: \"Key not found in the first mapping: 'a'\"" },
    { title: 'popitem',                           code: "from collections import ChainMap\nChainMap({'a': 1, 'b': 2}, {'c': 3}).popitem()", returns: "('b', 2)" },
    { title: 'popitem with an empty maps[0]',     code: "from collections import ChainMap\nChainMap({}, {'c': 3}).popitem()", returns: "KeyError: 'No keys found in the first mapping.'" },
    { title: 'clear only empties maps[0]',        code: "from collections import ChainMap\ncm = ChainMap({'a': 1}, {'b': 2})\ncm.clear()\ncm", returns: "ChainMap({}, {'b': 2})" },
  ],

  pitfalls: [
    {
      name: 'Deleting a key you can see',
      desc: '"key in cm" is True for keys in any mapping, but deletion needs the key in maps[0].',
      wrong: { label: 'check with in', code: "from collections import ChainMap\ncm = ChainMap({}, {'a': 1})\nif 'a' in cm:\n    del cm['a']", output: "KeyError: \"Key not found in the first mapping: 'a'\"" },
      fix:   { label: 'check maps[0]', code: "from collections import ChainMap\ncm = ChainMap({}, {'a': 1})\nif 'a' in cm.maps[0]:\n    del cm['a']\ncm", output: "ChainMap({}, {'a': 1})" },
    },
    {
      name: 'Expecting clear() to empty the chain',
      desc: 'Lower mappings are untouched. Clear each one via .maps if that is what you want.',
      wrong: { label: 'cm.clear()',       code: "from collections import ChainMap\ncm = ChainMap({'a': 1}, {'b': 2})\ncm.clear()\nlen(cm)", output: '1' },
      fix:   { label: 'clear every map', code: "from collections import ChainMap\ncm = ChainMap({'a': 1}, {'b': 2})\nfor m in cm.maps:\n    m.clear()\nlen(cm)", output: '0' },
    },
  ],

  when: {
    use: [
      'Removing local overrides so defaults show through again',
    ],
    avoid: [
      'Removing a key everywhere → loop over cm.maps',
    ],
  },

  notes: {
    cpython:   'Each wraps the same call on self.maps[0] and re-raises KeyError with a ChainMap-specific message',
    'Errors':  "pop/del: KeyError('Key not found in the first mapping: <repr>'); popitem: KeyError('No keys found in the first mapping.')",
  },

  related: [
    { name: 'ChainMap',              slug: 'chainmap',           when: 'Lookup and write rules' },
    { name: 'ChainMap.new_child',    slug: 'chainmap-new_child', when: 'Layers to pop from' },
    { name: 'dict.pop',              slug: 'dict-pop',           when: 'What maps[0].pop does', category: 'functions' },
    { name: 'dict.popitem',          slug: 'dict-popitem',       when: 'Last inserted pair', category: 'functions' },
    { name: 'dict.clear',            slug: 'dict-clear',         when: 'Empties one dict', category: 'functions' },
    { name: 'KeyError',              slug: 'keyerror',           when: 'Key not in maps[0]', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'Why does ChainMap raise "Key not found in the first mapping"?',
      a: 'Deletion (pop, del, popitem) only works on the first mapping. The key you are removing exists only in a later mapping, which ChainMap never modifies.',
    },
    {
      q: 'How do I remove a key from every layer of a ChainMap?',
      a: 'for m in cm.maps: m.pop(key, None)',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/collections.html#collections.ChainMap',
    meta:  'ChainMap objects',
  },
};
