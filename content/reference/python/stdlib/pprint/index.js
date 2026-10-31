// content/reference/python/stdlib/pprint/index.js — the pprint module hub

export const meta = {
  slug:        'index',
  name:        'pprint',
  signature:   'import pprint',
  blurb:       'Pretty-print nested dicts, lists, tuples and sets: one line when the repr fits, otherwise one item per line with nested items indented — pprint, pformat, pp and PrettyPrinter.',
  category:    'text',
  type:        'module',
  hasLiveDemo: true,
  version:     'All Python versions (pp 3.8+)',
  searchTerms: 'pprint module python pretty print dict pretty print list pretty print nested dictionary pformat pp PrettyPrinter saferepr isreadable isrecursive width indent depth compact sort_dicts underscore_numbers readable output debug print',
};

export const method = {
  slug: 'index',
  name: 'pprint',

  category:    'Text',
  version:     'All Python versions (pp 3.8+)',
  hasLiveDemo: true,

  subtitle: 'pprint shows a value the way repr() does, but when that one line is wider than 80 columns it breaks dicts, lists, tuples, sets, strings and bytes over several lines and indents the nested parts. pformat returns the text instead of printing it; pp is pprint without sorting dict keys.',

  // every public name PrettyPrinter defines itself must have a member page
  coverClasses: ['PrettyPrinter'],

  imports: ['import pprint', 'from pprint import pp, pformat'],
  facts: [
    { label: 'Public API', value: 'pprint, pformat, pp, PrettyPrinter, saferepr, isreadable, isrecursive' },
    { label: 'Defaults',   value: 'indent=1, width=80, depth=None, compact=False, sort_dicts=True (pp: False), underscore_numbers=False' },
    { label: 'Output',     value: 'Python literal syntax (repr), not JSON: single quotes, True, None' },
    { label: 'Source',     value: 'Lib/pprint.py — pure Python, no C accelerator' },
  ],

  modes: [
    {
      id: 'pformat',
      label: 'width',
      blurb: 'Type any Python literal. Lower the width to watch where pprint starts breaking lines (shown here one output line per list item).',
      params: [
        { name: 'data',  type: 'str', hint: 'a Python literal', input: 'text' },
        { name: 'width', type: 'int', hint: 'target line width', input: 'number' },
      ],
      template: 'import ast, pprint\ndata = ast.literal_eval({$data})\npprint.pformat(data, width={$width}).splitlines()',
      cases: [
        { id: 'fits',   label: 'fits on one line', values: { data: "{'name': 'Ada', 'id': 7}", width: '80' } },
        { id: 'nested', label: 'nested, width 30', values: { data: "{'user': {'name': 'Ada', 'roles': ['admin', 'dev']}, 'active': True}", width: '30' } },
        { id: 'text',   label: 'long string',      values: { data: "['Beautiful is better than ugly. Explicit is better than implicit.']", width: '30' } },
        { id: 'keys',   label: 'mixed key types',  values: { data: "{2: 'b', 'a': 1, 1: 'c', None: 0}", width: '20' } },
        { id: 'narrow', label: 'width 1',          values: { data: '[(1, 2), [3]]', width: '1' } },
      ],
    },
    {
      id: 'nesting',
      label: 'indent / depth',
      blurb: 'indent adds spaces per nesting level; depth replaces everything nested deeper with ... (leave depth empty for None).',
      params: [
        { name: 'data',   type: 'str', hint: 'a Python literal', input: 'text' },
        { name: 'indent', type: 'int', hint: 'spaces per level', input: 'number' },
        { name: 'width',  type: 'int', hint: 'target line width', input: 'number' },
        { name: 'depth',  type: 'int | None', hint: 'levels to show', input: 'number-or-none' },
      ],
      template: 'import ast, pprint\ndata = ast.literal_eval({$data})\npprint.pformat(data, indent={$indent}, width={$width}, depth={$depth}).splitlines()',
      cases: [
        { id: 'indent4', label: 'indent=4',  values: { data: "{'id': 7, 'tags': ['a', 'b'], 'meta': {'x': 1}}", indent: '4', width: '20', depth: '' } },
        { id: 'depth1',  label: 'depth=1',   values: { data: "{'id': 7, 'tags': ['a', 'b'], 'meta': {'x': 1}}", indent: '1', width: '80', depth: '1' } },
        { id: 'depth2',  label: 'depth=2',   values: { data: '[1, [2, [3, [4, [5]]]]]', indent: '1', width: '80', depth: '2' } },
        { id: 'bad',     label: 'depth=0',   values: { data: '[1, 2]', indent: '1', width: '80', depth: '0' } },
      ],
    },
    {
      id: 'compact',
      label: 'compact',
      blurb: 'compact=True packs as many items of a long sequence on each line as fit, instead of one per line.',
      params: [
        { name: 'data',  type: 'str', hint: 'a Python literal', input: 'text' },
        { name: 'width', type: 'int', hint: 'target line width', input: 'number' },
      ],
      template: 'import ast, pprint\ndata = ast.literal_eval({$data})\npprint.pformat(data, width={$width}, compact=True).splitlines()',
      cases: [
        { id: 'ints',   label: '25 ints',        values: { data: '[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]', width: '40' } },
        { id: 'words',  label: 'words',          values: { data: "['spam', 'eggs', 'lumberjack', 'knights', 'ni', 'dead', 'parrot', 'fresh fruit']", width: '30' } },
        { id: 'nested', label: 'nested lists',   values: { data: '[[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]]', width: '20' } },
      ],
    },
  ],
  demoExplainer: "pprint first tries the plain repr; only when it is wider than the width does it split. Dict keys are sorted, and keys of different types are ordered by type name, so None (type 'NoneType', capital N) comes first, then the ints, then the str. A long string is cut after spaces into several adjacent literals, which Python joins back into one string (a string printed on its own also gets parentheses around them). width=1 cannot be met at all, so every container still breaks up, and scalars that do not fit are printed whole. depth=0 is rejected with ValueError: depth must be > 0.",

  patterns: [
    {
      name: 'Inspect nested data',
      desc: 'pp keeps insertion order; pprint sorts dict keys.',
      code: "import pprint\npprint.pp(response_json)",
    },
    {
      name: 'Pretty text for a log message',
      desc: 'pformat returns the string instead of printing it.',
      code: "import logging, pprint\nlogging.getLogger(__name__).debug('config:\\n%s', pprint.pformat(config))",
    },
    {
      name: 'Only the top levels',
      desc: 'depth hides everything nested deeper as ...',
      code: 'import pprint\npprint.pp(huge_tree, depth=2)',
    },
    {
      name: 'One configured printer',
      desc: 'A PrettyPrinter keeps its options for every call.',
      code: "import pprint\nprinter = pprint.PrettyPrinter(width=120, compact=True, sort_dicts=False)\nprinter.pprint(rows)",
    },
  ],

  examples: [
    { title: 'One line when it fits',            code: "import pprint\npprint.pprint({'b': 2, 'a': 1})", returns: "{'a': 1, 'b': 2}" },
    { title: 'Too wide: one item per line',      code: "import pprint\npprint.pprint({'name': 'Ada', 'langs': ['python', 'c', 'rust'], 'id': 7}, width=30)", returns: "{'id': 7,\n 'langs': ['python',\n           'c',\n           'rust'],\n 'name': 'Ada'}" },
    { title: 'pp keeps insertion order',          code: "import pprint\npprint.pp({'b': 2, 'a': 1})", returns: "{'b': 2, 'a': 1}" },
    { title: 'pformat returns the text',          code: "import pprint\npprint.pformat([1, 2, 3])", returns: "'[1, 2, 3]'" },
    { title: 'depth hides deeper levels',         code: "import pprint\npprint.pprint([1, [2, [3, [4]]]], depth=2)", returns: '[1, [2, [...]]]' },
    { title: 'Long strings split at spaces',      code: "import pprint\npprint.pprint({'motto': 'Beautiful is better than ugly. Explicit is better than implicit.'}, width=40)", returns: "{'motto': 'Beautiful is better than '\n          'ugly. Explicit is better '\n          'than implicit.'}" },
    { title: 'Digit groups with underscores',     code: "import pprint\npprint.pprint({'population': 8100000000}, underscore_numbers=True)", returns: "{'population': 8_100_000_000}" },
    { title: 'compact packs short items',         code: "import pprint\npprint.pprint(list(range(25)), width=40, compact=True)", returns: '[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,\n 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,\n 22, 23, 24]' },
  ],

  pitfalls: [
    {
      name: 'Expecting pprint to return the text',
      desc: 'pprint and pp print and return None. Use pformat when you need the string — for a log message, a file or an assertion.',
      wrong: { label: 'text = pprint.pprint(…)',  code: "import pprint\ntext = pprint.pprint([1, 2])\ntype(text)",  output: "[1, 2]\n<class 'NoneType'>" },
      fix:   { label: 'text = pprint.pformat(…)', code: "import pprint\ntext = pprint.pformat([1, 2])\ntype(text)", output: "<class 'str'>" },
    },
    {
      name: 'Losing the dict order you built',
      desc: 'pprint, pformat and PrettyPrinter sort dict keys by default. pp (3.8+) or sort_dicts=False keeps insertion order.',
      wrong: { label: 'pprint sorts', code: "import pprint\npprint.pprint({'zebra': 1, 'apple': 2})", output: "{'apple': 2, 'zebra': 1}" },
      fix:   { label: 'pp keeps order', code: "import pprint\npprint.pp({'zebra': 1, 'apple': 2})", output: "{'zebra': 1, 'apple': 2}" },
    },
    {
      name: 'Using pformat to produce JSON',
      desc: 'pprint writes Python literals — single quotes, True, None. For JSON use json.dumps with indent.',
      wrong: { label: 'pformat → json.loads', code: "import json, pprint\njson.loads(pprint.pformat({'ok': True}))", output: 'json.decoder.JSONDecodeError: Expecting property name enclosed in double quotes: line 1 column 2 (char 1)' },
      fix:   { label: 'json.dumps(indent=2)', code: "import json\nprint(json.dumps({'ok': True}, indent=2))", output: '{\n  "ok": true\n}' },
    },
  ],

  when: {
    use: [
      'Looking at nested data in the REPL, a notebook or a debug log',
      'Readable, stable dumps of dicts in test failure messages (keys sorted)',
      'Checking what a parsed config, API response or AST-like structure really contains',
    ],
    avoid: [
      'Writing JSON for other programs → json.dumps(data, indent=2)',
      'Your own classes with a custom __repr__ — pprint lays out only built-in containers, dataclasses and SimpleNamespace; other objects print as their repr',
      'Serializing data to read back later → json or pickle; pformat output of non-literal objects cannot be eval()ed',
    ],
  },

  notes: {
    cpython:   'Lib/pprint.py, pure Python. PrettyPrinter._format writes the plain repr if it fits; otherwise it calls a per-type layout for dict, list, tuple, set, frozenset, str, bytes, bytearray, OrderedDict, defaultdict, Counter, ChainMap, deque, UserDict, UserList, UserString, mappingproxy, SimpleNamespace and dataclasses',
    'Width':   "width is a target, not a limit: a number, or a string without spaces, that is wider than the width is printed whole and the line runs past it — pprint.pprint(['x' * 30], width=20) prints one 34-character line",
    'Sets':    'A set that fits on one line is shown in iteration order, exactly like repr(); a set that has to be split is sorted first',
    'Versions': 'compact 3.4; pp() and sort_dicts 3.8; SimpleNamespace 3.9; dataclasses and underscore_numbers 3.10',
  },

  related: [
    { name: 'json.dumps',  slug: 'dumps', when: 'Pretty JSON text with indent=', category: 'stdlib/json' },
    { name: 'repr()',      slug: 'repr',  when: 'The one-line form pprint starts from', category: 'functions' },
    { name: 'print()',     slug: 'print', when: 'Plain output without layout', category: 'functions' },
    { name: 'json module', slug: 'json',  when: 'Data exchange instead of display', category: 'stdlib' },
    { name: 'textwrap module', slug: 'textwrap', when: 'Wrap plain text paragraphs to a width', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I pretty print a dict in Python?',
      a: "import pprint, then pprint.pp(d) to keep insertion order or pprint.pprint(d) to sort the keys. Both break the dict over several lines only when it does not fit in 80 columns (change it with width=). For JSON-style output use json.dumps(d, indent=2).",
    },
    {
      q: 'What is the difference between pprint.pprint and pprint.pp?',
      a: 'pp (added in 3.8) is pprint with sort_dicts=False: dict keys stay in insertion order. Every other parameter is the same.',
    },
    {
      q: 'How do I get pprint output as a string?',
      a: 'pprint.pformat(obj) returns the text pprint would print, without the trailing newline. It takes the same options: indent, width, depth, compact, sort_dicts, underscore_numbers.',
    },
    {
      q: 'Why does pprint print my dict on one line?',
      a: 'pprint splits a container only when its repr is wider than width (80 by default). A small dict stays on one line; pass a smaller width to force the layout.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/pprint.html',
    meta:  'pprint — Data pretty printer',
  },

};
