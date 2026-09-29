// content/reference/python/stdlib/collections/chainmap.js

export const meta = {
  slug:        'chainmap',
  name:        'collections.ChainMap',
  signature:   'collections.ChainMap(*maps)',
  blurb:       'Search several dicts as one: lookups try each mapping in order, while writes and deletes go only to the first.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 3.3+',
  searchTerms: 'chainmap python collections.ChainMap layered config defaults override multiple dicts lookup order maps ChainMap.get ChainMap.copy ChainMap.fromkeys scopes',
};

export const method = {
  slug:      'chainmap',
  name:      'collections.ChainMap',
  signature: 'collections.ChainMap(*maps)',
  returns:   { type: 'ChainMap', desc: 'A view over the given mappings (not a copy); with no arguments, over one new empty dict.' },

  category:    'collections class',
  version:     'Python 3.3+',
  hasLiveDemo: true,

  subtitle: 'The classic use is layered settings — command line over environment over defaults — without merging anything. The mappings are kept by reference in .maps, so later changes to them show through.',

  covers: ['ChainMap', 'ChainMap.get', 'ChainMap.copy', 'ChainMap.fromkeys'],

  cheat: {
    commonCall: 'ChainMap(user_settings, defaults)',
    returns:    'the first value found for each key',
    replaces:   '{**defaults, **user_settings} when you need live updates',
    watchOut:   'cm[key] = v always writes into maps[0]',
  },

  parameters: [
    { name: '*maps', type: 'mappings', required: false, default: null, desc: 'Searched first to last. The first one receives all writes and deletions.' },
  ],

  attributes: [
    { name: 'maps',    type: 'list', meaning: 'The underlying mappings, first searched first. Public and mutable.' },
    { name: 'get(key, default=None)', type: 'method', meaning: 'Lookup through all maps with a default instead of KeyError.' },
    { name: 'copy()',  type: 'method', meaning: 'New ChainMap with a shallow copy of maps[0] and the same other maps.' },
    { name: 'fromkeys(iterable, value=None)', type: 'classmethod', meaning: 'ChainMap over one new dict built by dict.fromkeys.' },
  ],

  modes: [
    {
      id: 'lookup',
      label: 'lookup order',
      blurb: 'Keys in the first mapping win. len() counts each distinct key once.',
      params: [
        { name: 'user',     type: 'list[str]', hint: 'keys set by the user', input: 'csv' },
        { name: 'defaults', type: 'list[str]', hint: 'keys with defaults',   input: 'csv' },
      ],
      template: "from collections import ChainMap\nsettings = ChainMap(dict.fromkeys({$user}, 'user'), dict.fromkeys({$defaults}, 'default'))\n(dict(settings), len(settings))",
      cases: [
        { id: 'override', label: 'override', values: { user: 'color', defaults: 'color, size, font' } },
        { id: 'nouser',   label: 'no user keys', values: { user: '', defaults: 'color, size' } },
      ],
    },
    {
      id: 'write',
      label: 'writes',
      blurb: 'Assignment always lands in the first mapping, even when the key lives in a later one.',
      params: [
        { name: 'base', type: 'list[str]', hint: 'keys in the second map', input: 'csv' },
        { name: 'key',  type: 'str',       hint: 'key to assign',          input: 'text' },
      ],
      template: 'from collections import ChainMap\ncm = ChainMap({}, dict.fromkeys({$base}, 0))\ncm[{$key}] = 1\ncm.maps',
      cases: [
        { id: 'shadow', label: 'existing key', values: { base: 'a, b', key: 'a' } },
        { id: 'new',    label: 'new key',      values: { base: 'a', key: 'z' } },
      ],
    },
    {
      id: 'get',
      label: 'get vs []',
      blurb: 'get() returns None for a key in no mapping; square brackets raise KeyError.',
      params: [
        { name: 'a',   type: 'list[str]', hint: 'keys of map 1 (value 1)', input: 'csv' },
        { name: 'b',   type: 'list[str]', hint: 'keys of map 2 (value 2)', input: 'csv' },
        { name: 'key', type: 'str',       hint: 'key to look up',          input: 'text' },
      ],
      template: 'from collections import ChainMap\ncm = ChainMap(dict.fromkeys({$a}, 1), dict.fromkeys({$b}, 2))\n(cm.get({$key}), cm[{$key}])',
      cases: [
        { id: 'second', label: 'in map 2 only', values: { a: 'x', b: 'y', key: 'y' } },
        { id: 'both',   label: 'in both',       values: { a: 'x', b: 'x', key: 'x' } },
        { id: 'none',   label: 'in neither',    values: { a: 'x', b: 'y', key: 'q' } },
      ],
    },
  ],
  demoExplainer: 'dict(settings) lists keys in the order of the LAST mapping first (defaults) with later-added keys after — but every value comes from the first mapping that has the key, so color is "user". In the writes tab the key a exists in the second map, yet the assignment creates a new a in maps[0] and leaves the old one untouched.',

  patterns: [
    {
      name: 'Command line over environment over defaults',
      desc: 'The docs recipe for layered configuration.',
      code: 'import os\nfrom collections import ChainMap\nconfig = ChainMap(cli_args, os.environ, defaults)',
    },
    {
      name: 'Nested scopes',
      desc: 'new_child() pushes a scope, .parents pops it.',
      code: 'from collections import ChainMap\nscope = ChainMap()\nscope = scope.new_child({"x": 1})\nscope = scope.parents',
    },
    {
      name: 'Flatten when done',
      desc: 'dict() takes a snapshot with the correct precedence.',
      code: 'snapshot = dict(config)',
    },
  ],

  examples: [
    { title: 'First mapping wins',        code: "from collections import ChainMap\nChainMap({'x': 1}, {'x': 2, 'y': 3})['x']", returns: '1' },
    { title: 'Falls through to later maps', code: "from collections import ChainMap\nChainMap({'x': 1}, {'x': 2, 'y': 3})['y']", returns: '3' },
    { title: 'repr shows every map',      code: "from collections import ChainMap\nChainMap({'a': 1}, {'b': 2})", returns: "ChainMap({'a': 1}, {'b': 2})" },
    { title: 'get with a default',        code: "from collections import ChainMap\nChainMap({'a': 1}).get('z', 0)", returns: '0' },
    { title: 'Live view, not a copy',     code: "from collections import ChainMap\ndefaults = {'size': 'M'}\ncm = ChainMap({}, defaults)\ndefaults['size'] = 'L'\ncm['size']", returns: "'L'" },
    { title: 'copy() copies only maps[0]', code: "from collections import ChainMap\nbase = {'b': 2}\nc2 = ChainMap({'a': 1}, base).copy()\nc2.maps[1] is base", returns: 'True' },
    { title: 'fromkeys',                  code: "from collections import ChainMap\nChainMap.fromkeys('ab', 0)", returns: "ChainMap({'a': 0, 'b': 0})" },
  ],

  pitfalls: [
    {
      name: 'Expecting writes to update the mapping that holds the key',
      desc: 'Writes go to maps[0]. To change a lower layer, write to it directly (cm.maps[i][key] = v).',
      wrong: { label: 'cm[key] = v',          code: "from collections import ChainMap\ndefaults = {'size': 'M'}\ncm = ChainMap({}, defaults)\ncm['size'] = 'L'\ndefaults", output: "{'size': 'M'}" },
      fix:   { label: 'cm.maps[1][key] = v',  code: "from collections import ChainMap\ndefaults = {'size': 'M'}\ncm = ChainMap({}, defaults)\ncm.maps[1]['size'] = 'L'\ndefaults", output: "{'size': 'L'}" },
    },
    {
      name: 'Merging with dict unpacking when you need live data',
      desc: '{**a, **b} is a snapshot; later changes to a or b are not seen. ChainMap reads through.',
      wrong: { label: '{**user, **defaults}', code: "user, defaults = {}, {'x': 1}\nmerged = {**defaults, **user}\nuser['x'] = 2\nmerged['x']", output: '1' },
      fix:   { label: 'ChainMap(user, defaults)', code: "from collections import ChainMap\nuser, defaults = {}, {'x': 1}\nmerged = ChainMap(user, defaults)\nuser['x'] = 2\nmerged['x']", output: '2' },
    },
  ],

  when: {
    use: [
      'Layered configuration with precedence',
      'Variable scopes in interpreters and template engines',
      'Temporary overrides that must not modify the originals',
    ],
    avoid: [
      'A one-time merge → {**a, **b} or a | b (3.9+)',
      'Very many layers on a hot path → lookups walk the maps in order',
    ],
  },

  notes: {
    cpython:    'Lib/collections/__init__.py — a MutableMapping over self.maps; not a dict subclass',
    'Iteration': 'Keys are yielded in dict.fromkeys order over the maps from LAST to first, so the deepest map\'s keys come first',
    'Versions': 'Added in 3.3; | and |= operators 3.9 (docs.python.org)',
  },

  related: [
    { name: 'ChainMap.new_child / parents', slug: 'chainmap-new_child', when: 'Push and pop scopes' },
    { name: 'ChainMap pop / popitem / clear', slug: 'chainmap-pop', when: 'Deleting only touches maps[0]' },
    { name: 'dict',       slug: 'dict',       when: 'Flatten a ChainMap', category: 'functions' },
    { name: 'dict.get',   slug: 'get',        when: 'Same semantics', category: 'functions' },
    { name: 'dict.fromkeys', slug: 'dict-fromkeys', when: 'What ChainMap.fromkeys builds', category: 'functions' },
    { name: 'KeyError',   slug: 'keyerror',   when: 'A key in no mapping', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What is ChainMap used for?',
      a: 'Treating several dicts as one without copying them: lookups search the mappings in order and return the first hit. It is typically used for layered settings (user > environment > defaults) and for nested scopes.',
    },
    {
      q: 'ChainMap vs merging dicts — what is the difference?',
      a: '{**a, **b} or a | b builds a new dict once. ChainMap keeps references, so changes to the underlying dicts are visible immediately, and nothing is copied up front.',
    },
    {
      q: 'Why did my ChainMap update not change the original dict?',
      a: 'All writes, updates and deletions go to the first mapping (maps[0]). Write to cm.maps[i] to change a specific layer.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/collections.html#collections.ChainMap',
    meta:  'collections.ChainMap',
  },
};
