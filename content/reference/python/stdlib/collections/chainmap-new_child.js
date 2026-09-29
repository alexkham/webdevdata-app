// content/reference/python/stdlib/collections/chainmap-new_child.js

export const meta = {
  slug:        'chainmap-new_child',
  name:        'ChainMap.new_child / parents',
  signature:   'ChainMap.new_child(m=None, **kwargs)  ·  ChainMap.parents',
  blurb:       'Push a new mapping in front of a ChainMap (new_child) or get the chain without its first mapping (parents) — nested scopes in two operations.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 3.3+',
  searchTerms: 'chainmap new_child parents ChainMap.new_child ChainMap.parents nested scope push pop context local variables python collections',
};

export const method = {
  slug:      'chainmap-new_child',
  name:      'ChainMap.new_child / parents',
  signature: 'ChainMap.new_child(m=None, **kwargs)',
  returns:   { type: 'ChainMap', desc: 'new_child: ChainMap(m, *self.maps). parents: ChainMap(*self.maps[1:]).' },

  category:    'ChainMap methods',
  version:     'Python 3.3+',
  hasLiveDemo: true,

  subtitle: 'Both return NEW ChainMaps that share the same underlying dicts. new_child puts a fresh (or given) mapping in front, so writes stay local; parents drops the front mapping — like leaving a scope.',

  covers: ['ChainMap.new_child', 'ChainMap.parents'],

  cheat: {
    commonCall: 'local = scope.new_child() · outer = local.parents',
    returns:    'new ChainMaps; the original is unchanged',
    replaces:   'copying a whole dict to shadow a few keys',
    watchOut:   'parents of a one-map chain is ChainMap({}) — a new empty dict',
  },

  parameters: [
    { name: 'm',        type: 'mapping | None', required: false, default: 'None', desc: 'The mapping to put in front; None means a new empty dict (3.4+).' },
    { name: '**kwargs', type: 'values',         required: false, default: null,   desc: 'Keys to set in the new front mapping (3.10+). With m given, they update m itself.' },
  ],

  modes: [
    {
      id: 'scopes',
      label: 'inner / outer',
      blurb: 'An inner scope shadows the outer one; parents gets the outer view back.',
      params: [
        { name: 'a', type: 'list[str]', hint: 'outer names', input: 'csv' },
        { name: 'b', type: 'list[str]', hint: 'inner names', input: 'csv' },
      ],
      template: "from collections import ChainMap\nouter = ChainMap(dict.fromkeys({$a}, 'outer'))\ninner = outer.new_child(dict.fromkeys({$b}, 'inner'))\n(dict(inner), inner.parents)",
      cases: [
        { id: 'shadow', label: 'shadowing', values: { a: 'x, y', b: 'y, z' } },
        { id: 'empty',  label: 'empty inner', values: { a: 'x', b: '' } },
      ],
    },
    {
      id: 'child',
      label: 'writes stay local',
      blurb: 'new_child() with no argument adds an empty dict that catches all writes.',
      params: [
        { name: 'a',   type: 'list[str]', hint: 'keys of the base map', input: 'csv' },
        { name: 'key', type: 'str',       hint: 'key to assign',        input: 'text' },
      ],
      template: 'from collections import ChainMap\ncm = ChainMap(dict.fromkeys({$a}, 0)).new_child()\ncm[{$key}] = 1\n(cm, cm.parents)',
      cases: [
        { id: 'existing', label: 'existing key', values: { a: 'a, b', key: 'a' } },
        { id: 'new',      label: 'new key',      values: { a: 'a', key: 'n' } },
      ],
    },
  ],
  demoExplainer: 'In "shadowing" y resolves to "inner" in the child, while inner.parents is the original outer chain with y still "outer". In the second tab the assignment goes into the new front dict, so parents shows the base mapping unchanged.',

  patterns: [
    {
      name: 'Enter and leave a scope',
      desc: 'Rebind the name on entry and exit.',
      code: 'scope = scope.new_child()\ntry:\n    run_block(scope)\nfinally:\n    scope = scope.parents',
    },
    {
      name: 'Temporary overrides',
      desc: 'Keyword arguments build the front mapping (3.10+).',
      code: 'debug_config = config.new_child(debug=True, log_level="DEBUG")',
    },
    {
      name: 'Skip the local scope on lookup',
      desc: 'parents searches everything except maps[0].',
      code: 'outer_value = scope.parents[name]',
    },
  ],

  examples: [
    { title: 'new_child with no mapping',     code: "from collections import ChainMap\nChainMap({'a': 1}).new_child()", returns: "ChainMap({}, {'a': 1})" },
    { title: 'new_child with keyword values', code: "from collections import ChainMap\nChainMap({'a': 1}).new_child(a=2)['a']", returns: '2' },
    { title: 'parents drops maps[0]',         code: "from collections import ChainMap\nChainMap({'a': 1}, {'b': 2}).parents", returns: "ChainMap({'b': 2})" },
    { title: 'parents of a single map',       code: "from collections import ChainMap\nChainMap({'a': 1}).parents", returns: 'ChainMap({})' },
    { title: 'The original is not changed',   code: "from collections import ChainMap\nbase = ChainMap({'a': 1})\nchild = base.new_child({'a': 2})\n(base['a'], child['a'])", returns: '(1, 2)' },
    { title: 'Mappings are shared',           code: "from collections import ChainMap\nd = {'a': 1}\nChainMap(d).new_child().maps[1] is d", returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Calling parents like a method',
      desc: 'parents is a property.',
      wrong: { label: 'cm.parents()', code: "from collections import ChainMap\nChainMap({}, {'a': 1}).parents()", output: "TypeError: 'ChainMap' object is not callable" },
      fix:   { label: 'cm.parents',   code: "from collections import ChainMap\nChainMap({}, {'a': 1}).parents", output: "ChainMap({'a': 1})" },
    },
    {
      name: 'Forgetting to rebind',
      desc: 'new_child returns a new ChainMap; the old variable still points at the old chain.',
      wrong: { label: 'call only',      code: "from collections import ChainMap\ncm = ChainMap({'a': 1})\ncm.new_child({'a': 2})\ncm['a']", output: '1' },
      fix:   { label: 'cm = cm.new_child(...)', code: "from collections import ChainMap\ncm = ChainMap({'a': 1})\ncm = cm.new_child({'a': 2})\ncm['a']", output: '2' },
    },
  ],

  when: {
    use: [
      'Interpreters, template engines and config systems with nested scopes',
      'Trying out overrides without touching the base settings',
    ],
    avoid: [
      'Deeply nested chains on hot paths → lookups get slower with every layer',
    ],
  },

  notes: {
    cpython:    'new_child returns self.__class__(m, *self.maps); parents returns self.__class__(*self.maps[1:])',
    'Versions': 'm parameter 3.4, keyword arguments 3.10 (docs.python.org)',
  },

  related: [
    { name: 'ChainMap',                 slug: 'chainmap',     when: 'Lookup and write rules' },
    { name: 'ChainMap pop / popitem',   slug: 'chainmap-pop', when: 'Deletes also hit only maps[0]' },
    { name: 'global',                   slug: 'global',       when: 'Python\'s own scopes', category: 'keywords' },
    { name: 'nonlocal',                 slug: 'nonlocal',     when: 'Writing to an enclosing scope', category: 'keywords' },
  ],

  faq: [
    {
      q: 'What does ChainMap.new_child do?',
      a: 'It returns a new ChainMap with a mapping in front of the existing ones: a new empty dict by default, or the mapping you pass. Lookups see the new mapping first and all writes go into it.',
    },
    {
      q: 'What does ChainMap.parents return?',
      a: 'A new ChainMap of all mappings except the first — the enclosing scope. It is a property, so no parentheses.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/collections.html#collections.ChainMap.new_child',
    meta:  'ChainMap.new_child',
  },
};
