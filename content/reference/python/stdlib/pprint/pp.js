// content/reference/python/stdlib/pprint/pp.js

export const meta = {
  slug:        'pp',
  name:        'pprint.pp',
  signature:   'pprint.pp(object, stream=None, indent=1, width=80, depth=None, *, compact=False, sort_dicts=False, underscore_numbers=False)',
  blurb:       'Pretty-print a value and keep dict keys in insertion order — pprint.pprint with sort_dicts=False. The quickest way to look at nested data.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.8+',
  searchTerms: 'pprint.pp python pp function pretty print without sorting keep dict order insertion order sort_dicts False pp vs pprint print = pprint.pp',
};

export const method = {
  slug:      'pp',
  name:      'pprint.pp',
  signature: 'pprint.pp(object, stream=None, indent=1, width=80, depth=None, *, compact=False, sort_dicts=False, underscore_numbers=False)',
  returns:   { type: 'None', desc: 'Nothing — the text and a newline are written to stream (sys.stdout by default).' },

  category:    'pprint function',
  version:     'Python 3.8+',
  hasLiveDemo: true,

  subtitle: 'Same layout as pprint.pprint, same options, one different default: sort_dicts=False, so dicts appear in the order their keys were inserted — the order you built them and the order repr() shows.',

  covers: ['pp'],

  cheat: {
    commonCall: 'pprint.pp(data)',
    returns:    'None — it prints',
    replaces:   'pprint.pprint(data, sort_dicts=False)',
    watchOut:   'Pass width= by keyword (2nd positional is stream)',
  },

  parameters: [
    { name: 'object',     type: 'any',        required: true,  default: null,    desc: 'The value to print.' },
    { name: 'stream',     type: 'text file',  required: false, default: 'None',  desc: 'Where to write; None means sys.stdout.' },
    { name: 'indent',     type: 'int',        required: false, default: '1',     desc: 'Extra spaces per nesting level.' },
    { name: 'width',      type: 'int',        required: false, default: '80',    desc: 'Target line width.' },
    { name: 'depth',      type: 'int | None', required: false, default: 'None',  desc: 'Nesting levels to show.' },
    { name: 'compact',    type: 'bool',       required: false, default: 'False', desc: 'Keyword-only. Several sequence items per line.' },
    { name: 'sort_dicts', type: 'bool',       required: false, default: 'False', desc: 'Keyword-only. The one default that differs from pprint: keys are not sorted.' },
    { name: 'underscore_numbers', type: 'bool', required: false, default: 'False', desc: 'Keyword-only (3.10+). Write ints as 1_000_000.' },
  ],

  modes: [
    {
      id: 'both',
      label: 'pp vs pprint',
      blurb: 'The same value printed by pp (first) and pprint (second); the final None is the return value of the last call.',
      params: [
        { name: 'data',  type: 'str', hint: 'a Python literal', input: 'text' },
        { name: 'width', type: 'int', hint: 'target line width', input: 'number' },
      ],
      template: 'import ast, pprint\ndata = ast.literal_eval({$data})\npprint.pp(data, width={$width})\npprint.pprint(data, width={$width})',
      cases: [
        { id: 'config', label: 'config dict',   values: { data: "{'server': {'port': 8080, 'host': 'localhost'}, 'debug': True}", width: '30' } },
        { id: 'record', label: 'one record',    values: { data: "{'name': 'Ada', 'born': 1815, 'field': 'math'}", width: '80' } },
        { id: 'list',   label: 'list of dicts', values: { data: "[{'z': 1, 'a': 2}, {'y': 3, 'b': 4}]", width: '80' } },
      ],
    },
    {
      id: 'depth',
      label: 'depth',
      blurb: 'pp takes every pprint option; depth shows only the outer levels (empty = no limit).',
      params: [
        { name: 'data',  type: 'str', hint: 'a Python literal', input: 'text' },
        { name: 'depth', type: 'int | None', hint: 'levels to show', input: 'number-or-none' },
      ],
      template: 'import ast, pprint\npprint.pp(ast.literal_eval({$data}), depth={$depth})',
      cases: [
        { id: 'one', label: 'depth=1', values: { data: "[{'id': 3, 'name': 'c'}, {'name': 'a', 'id': 1}]", depth: '1' } },
        { id: 'two', label: 'depth=2', values: { data: "{'a': {'b': {'c': {'d': 1}}}}", depth: '2' } },
        { id: 'all', label: 'no limit', values: { data: "{'a': {'b': {'c': {'d': 1}}}}", depth: '' } },
      ],
    },
  ],
  demoExplainer: "pp prints the keys as they were written — server before debug, port before host — while pprint sorts them at every level. Lists are never reordered by either. With depth=1 only the outer list is shown and each dict inside becomes {...}.",

  patterns: [
    {
      name: 'Look at an API response',
      desc: 'Field order as the server sent it.',
      code: 'import pprint\npprint.pp(response.json())',
    },
    {
      name: 'Pretty print by default in a scope',
      desc: 'The tip from the docs: shadow print with pp inside a function or a REPL session.',
      code: 'import pprint\nprint = pprint.pp\nprint(nested_data)',
    },
    {
      name: 'Only the outline',
      desc: 'depth keeps big structures short.',
      code: 'import pprint\npprint.pp(tree, depth=2, width=120)',
    },
  ],

  examples: [
    { title: 'Insertion order',                 code: "import pprint\npprint.pp({'b': 2, 'a': 1})", returns: "{'b': 2, 'a': 1}" },
    { title: 'Order kept at every level',       code: "import pprint\nconfig = {'server': {'port': 8080, 'host': 'localhost'}, 'debug': True}\npprint.pp(config, width=30)", returns: "{'server': {'port': 8080,\n            'host': 'localhost'},\n 'debug': True}" },
    { title: 'sort_dicts=True turns it into pprint', code: "import pprint\npprint.pp({'b': 2, 'a': 1}, sort_dicts=True)", returns: "{'a': 1, 'b': 2}" },
    { title: 'It returns None',                 code: "import pprint\npprint.pp([1]) is None", returns: '[1]\nTrue' },
    { title: 'print = pprint.pp',               code: "import pprint\nprint = pprint.pp\nprint({'z': 1, 'a': [1, 2, 3]}, width=20)", returns: "{'z': 1,\n 'a': [1, 2, 3]}" },
    { title: 'depth=1',                         code: "import pprint\npprint.pp([{'id': 3, 'name': 'c'}, {'name': 'a', 'id': 1}], depth=1)", returns: '[{...}, {...}]' },
    { title: 'Its real signature',              code: "import inspect, pprint\nstr(inspect.signature(pprint.pp))", returns: "'(object, *args, sort_dicts=False, **kwargs)'" },
  ],

  pitfalls: [
    {
      name: 'Passing width positionally',
      desc: 'pp forwards its arguments to pprint, whose second positional parameter is stream.',
      wrong: { label: 'pp(data, 20)',       code: "import pprint\npprint.pp({'b': 2, 'a': 1}, 20)",       output: "AttributeError: 'int' object has no attribute 'write'" },
      fix:   { label: 'pp(data, width=20)', code: "import pprint\npprint.pp({'b': 2, 'a': 1}, width=20)", output: "{'b': 2, 'a': 1}" },
    },
    {
      name: 'Comparing pp-style text of equal dicts',
      desc: 'Two equal dicts built in different orders give different unsorted text. Sort the keys (the pprint / pformat default) when the text is compared or stored.',
      wrong: { label: 'sort_dicts=False', code: "import pprint\nd1 = {'a': 1, 'b': 2}\nd2 = {'b': 2, 'a': 1}\n(d1 == d2, pprint.pformat(d1, sort_dicts=False) == pprint.pformat(d2, sort_dicts=False))", output: '(True, False)' },
      fix:   { label: 'sorted (default)', code: "import pprint\nd1 = {'a': 1, 'b': 2}\nd2 = {'b': 2, 'a': 1}\n(d1 == d2, pprint.pformat(d1) == pprint.pformat(d2))", output: '(True, True)' },
    },
  ],

  when: {
    use: [
      'Interactive inspection of JSON responses, configs and records — keys in their natural order',
      'Debug prints where the order of fields carries meaning',
    ],
    avoid: [
      'Text you compare or snapshot → pprint.pformat (sorted keys)',
      'You need the string → pprint.pformat(obj, sort_dicts=False)',
      'Python 3.7 or older → pprint.pprint (pp and sort_dicts were added in 3.8)',
    ],
  },

  notes: {
    cpython:   'Lib/pprint.py: def pp(object, *args, sort_dicts=False, **kwargs): pprint(object, *args, sort_dicts=sort_dicts, **kwargs) — a thin wrapper, so it accepts exactly what pprint accepts',
    'Versions': 'Added in Python 3.8, together with the sort_dicts parameter',
  },

  related: [
    { name: 'pprint.pprint',  slug: 'pprint',        when: 'Same, with sorted dict keys' },
    { name: 'pprint.pformat', slug: 'pformat',       when: 'Get the text instead of printing' },
    { name: 'PrettyPrinter',  slug: 'prettyprinter', when: 'Keep one set of options' },
    { name: 'print()',        slug: 'print',         when: 'One line, no layout', category: 'functions' },
    { name: 'dict',           slug: 'dict',          when: 'Why insertion order exists', category: 'functions' },
  ],

  faq: [
    {
      q: 'What is the difference between pprint.pp and pprint.pprint?',
      a: 'Only the default of sort_dicts: pp keeps dict keys in insertion order (False), pprint sorts them (True). Layout, width, indent, depth and the other options behave the same.',
    },
    {
      q: 'How do I pretty print a dict without sorting the keys?',
      a: 'pprint.pp(d) on Python 3.8+, or pprint.pprint(d, sort_dicts=False). For a string, pprint.pformat(d, sort_dicts=False).',
    },
    {
      q: 'Does pprint.pp exist in older Python versions?',
      a: 'No — it was added in 3.8, together with sort_dicts. On older versions pprint always sorts dict keys.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/pprint.html#pprint.pp',
    meta:  'pprint.pp',
  },

};
