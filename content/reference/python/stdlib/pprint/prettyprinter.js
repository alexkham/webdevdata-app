// content/reference/python/stdlib/pprint/prettyprinter.js

export const meta = {
  slug:        'prettyprinter',
  name:        'pprint.PrettyPrinter',
  signature:   'pprint.PrettyPrinter(indent=1, width=80, depth=None, stream=None, *, compact=False, sort_dicts=True, underscore_numbers=False)',
  blurb:       'A pretty printer with its options fixed once: call its pprint, pformat, isreadable and isrecursive methods as often as you like. The module functions build one per call.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'All Python versions (compact 3.4, sort_dicts 3.8, underscore_numbers 3.10)',
  searchTerms: 'pprint.PrettyPrinter python PrettyPrinter class PrettyPrinter.pprint PrettyPrinter.pformat PrettyPrinter.isreadable PrettyPrinter.isrecursive pretty printer object stream indent width depth compact sort_dicts underscore_numbers reuse options indent must be >= 0 width must be != 0 depth must be > 0',
};

export const method = {
  slug:      'prettyprinter',
  name:      'pprint.PrettyPrinter',
  signature: 'pprint.PrettyPrinter(indent=1, width=80, depth=None, stream=None, *, compact=False, sort_dicts=True, underscore_numbers=False)',
  returns:   { type: 'PrettyPrinter', desc: 'A printer whose pprint(obj), pformat(obj), isreadable(obj) and isrecursive(obj) use these options.' },

  category:    'pprint class',
  version:     'All Python versions (compact 3.4, sort_dicts 3.8, underscore_numbers 3.10)',
  hasLiveDemo: true,

  subtitle: 'The class behind pprint, pformat and pp. Note the parameter order — indent, width, depth, then stream (pprint() has stream second) — and that sort_dicts is True, as in pprint. The options are checked once, when the printer is created.',

  covers: ['PrettyPrinter', 'PrettyPrinter.pprint', 'PrettyPrinter.pformat', 'PrettyPrinter.isreadable', 'PrettyPrinter.isrecursive'],

  cheat: {
    commonCall: 'printer = pprint.PrettyPrinter(width=120, sort_dicts=False)',
    returns:    'printer.pprint(obj) prints · printer.pformat(obj) returns str',
    replaces:   'Repeating the same keyword options on every pprint call',
    watchOut:   'stream=None means the sys.stdout of the moment the printer is created',
  },

  parameters: [
    { name: 'indent',             type: 'int',        required: false, default: '1',     desc: 'Extra spaces per nesting level; int(indent) must be >= 0.' },
    { name: 'width',              type: 'int',        required: false, default: '80',    desc: 'Target line width; int(width) must not be 0.' },
    { name: 'depth',              type: 'int | None', required: false, default: 'None',  desc: 'Nesting levels to show; must be > 0.' },
    { name: 'stream',             type: 'text file',  required: false, default: 'None',  desc: 'Where pprint() writes. None: sys.stdout as it is when the printer is created.' },
    { name: 'compact',            type: 'bool',       required: false, default: 'False', desc: 'Keyword-only. Several sequence items per line.' },
    { name: 'sort_dicts',         type: 'bool',       required: false, default: 'True',  desc: 'Keyword-only (3.8+). Sort dict keys.' },
    { name: 'underscore_numbers', type: 'bool',       required: false, default: 'False', desc: 'Keyword-only (3.10+). Write ints as 1_000_000.' },
  ],

  modes: [
    {
      id: 'reuse',
      label: 'pformat',
      blurb: 'Configure the printer once, then format a value with it. Bad options raise when the printer is created (try indent -1 or width 0).',
      params: [
        { name: 'data',   type: 'str', hint: 'a Python literal', input: 'text' },
        { name: 'indent', type: 'int', hint: 'spaces per level', input: 'number' },
        { name: 'width',  type: 'int', hint: 'target line width', input: 'number' },
        { name: 'depth',  type: 'int | None', hint: 'levels to show', input: 'number-or-none' },
      ],
      template: 'import ast, pprint\nprinter = pprint.PrettyPrinter(indent={$indent}, width={$width}, depth={$depth})\nprinter.pformat(ast.literal_eval({$data})).splitlines()',
      cases: [
        { id: 'indent', label: 'indent=4',  values: { data: "{'name': 'Ada', 'langs': ['python', 'c']}", indent: '4', width: '30', depth: '' } },
        { id: 'depth',  label: 'depth=2',   values: { data: "('a', ('b', ('c', ('d',))))", indent: '1', width: '80', depth: '2' } },
        { id: 'neg',    label: 'indent=-1', values: { data: '[1, 2]', indent: '-1', width: '80', depth: '' } },
        { id: 'zero',   label: 'width=0',   values: { data: '[1, 2]', indent: '1', width: '0', depth: '' } },
      ],
    },
    {
      id: 'stream',
      label: 'stream=',
      blurb: 'One printer, many calls: each item of the value is printed to the same StringIO, one pprint() call per item.',
      params: [
        { name: 'data',  type: 'str', hint: 'a list of values', input: 'text' },
        { name: 'width', type: 'int', hint: 'target line width', input: 'number' },
      ],
      template: 'import ast, io, pprint\nbuf = io.StringIO()\nprinter = pprint.PrettyPrinter(width={$width}, stream=buf)\nfor item in ast.literal_eval({$data}):\n    printer.pprint(item)\nbuf.getvalue().splitlines()',
      cases: [
        { id: 'rows',  label: 'three rows',  values: { data: "[{'id': 1, 'ok': True}, {'id': 2, 'ok': False}, {'id': 3, 'ok': None}]", width: '80' } },
        { id: 'wide',  label: 'width 15',    values: { data: "[['alpha', 'beta'], ('x', 'y', 'z')]", width: '15' } },
        { id: 'dict',  label: 'a dict',      values: { data: "{'b': 1, 'a': 2}", width: '80' } },
        { id: 'int',   label: 'not iterable', values: { data: '42', width: '80' } },
      ],
    },
    {
      id: 'flags',
      label: 'isreadable / isrecursive',
      blurb: 'The text a depth-limited printer produces, next to what its isreadable() and isrecursive() methods report.',
      params: [
        { name: 'data',  type: 'str', hint: 'a Python literal', input: 'text' },
        { name: 'depth', type: 'int | None', hint: 'levels to show', input: 'number-or-none' },
      ],
      template: 'import ast, pprint\nprinter = pprint.PrettyPrinter(depth={$depth})\ndata = ast.literal_eval({$data})\n(printer.pformat(data), printer.isreadable(data), printer.isrecursive(data))',
      cases: [
        { id: 'cut',  label: 'depth=1',  values: { data: '[[1, 2], {3: 4}]', depth: '1' } },
        { id: 'full', label: 'no depth', values: { data: '[[1, 2], {3: 4}]', depth: '' } },
        { id: 'flat', label: 'flat',     values: { data: "('a', 1.5, None)", depth: '1' } },
      ],
    },
  ],
  demoExplainer: "indent=4 puts three spaces after the opening brace and four per level. A depth of 2 keeps two levels of the tuple and replaces the third with (...). The options are validated in the constructor, so indent=-1 and width=0 fail before the value is even read. Iterating a dict gives its keys, so the dict case prints 'b' and 'a' — one call each. In the last tab, isreadable() stays True although the depth-limited text [[...], {...}] could not be evaluated back: CPython's isreadable() and isrecursive() ignore depth.",

  patterns: [
    {
      name: 'A module-level printer',
      desc: 'Configure once, use everywhere in the module.',
      code: "import pprint, sys\n_debug = pprint.PrettyPrinter(width=120, compact=True, stream=sys.stderr)\n\ndef dump(obj):\n    _debug.pprint(obj)",
    },
    {
      name: 'Several values into one buffer',
      desc: 'stream= collects the output of many calls.',
      code: "import io, pprint\nbuf = io.StringIO()\nprinter = pprint.PrettyPrinter(stream=buf, sort_dicts=False)\nfor record in records:\n    printer.pprint(record)\nreport = buf.getvalue()",
    },
    {
      name: 'Customize through a subclass',
      desc: 'Override format() to change how some objects are shown.',
      code: "import pprint\n\nclass ShortFloats(pprint.PrettyPrinter):\n    def format(self, object, context, maxlevels, level):\n        if isinstance(object, float):\n            return f'{object:.3g}', True, False\n        return super().format(object, context, maxlevels, level)",
    },
  ],

  examples: [
    { title: 'indent=4',                       code: "import pprint\nprinter = pprint.PrettyPrinter(indent=4, width=30)\nprinter.pprint({'name': 'Ada', 'langs': ['python', 'c']})", returns: "{   'langs': ['python', 'c'],\n    'name': 'Ada'}" },
    { title: 'compact=True',                   code: "import pprint\nprinter = pprint.PrettyPrinter(width=30, compact=True)\nprinter.pprint(['spam', 'eggs', 'lumberjack', 'knights', 'ni', 'dead', 'parrot'])", returns: "['spam', 'eggs', 'lumberjack',\n 'knights', 'ni', 'dead',\n 'parrot']" },
    { title: 'depth=2',                        code: "import pprint\npprint.PrettyPrinter(depth=2).pformat(('a', ('b', ('c', ('d',)))))", returns: `"('a', ('b', (...)))"` },
    { title: 'Several calls, one stream',      code: "import io, pprint\nbuf = io.StringIO()\nprinter = pprint.PrettyPrinter(stream=buf)\nprinter.pprint({'a': 1})\nprinter.pprint([2, 3])\nbuf.getvalue()", returns: `"{'a': 1}\\n[2, 3]\\n"` },
    { title: 'All options together',           code: "import pprint\nprinter = pprint.PrettyPrinter(sort_dicts=False, underscore_numbers=True)\nprinter.pformat({'z': 10000, 'a': 2.5})", returns: `"{'z': 10_000, 'a': 2.5}"` },
    { title: 'isrecursive / isreadable',       code: "import pprint\na = [1]\na.append(a)\nprinter = pprint.PrettyPrinter()\n(printer.isrecursive(a), printer.isreadable(a))", returns: '(True, False)' },
    { title: 'isreadable ignores depth',       code: "import pprint\nprinter = pprint.PrettyPrinter(depth=1)\n(printer.pformat([[1]]), printer.isreadable([[1]]))", returns: "('[[...]]', True)" },
    { title: 'Invalid options fail early',     code: "import pprint\npprint.PrettyPrinter(width=0)", returns: 'ValueError: width must be != 0' },
  ],

  pitfalls: [
    {
      name: 'Creating the printer before redirecting stdout',
      desc: 'With stream=None the printer stores sys.stdout when it is created. A redirect_stdout that starts later does not see its output. Create the printer inside the with block, or pass stream= explicitly.',
      wrong: { label: 'printer made outside', code: "import contextlib, io, pprint\nprinter = pprint.PrettyPrinter()\nbuf = io.StringIO()\nwith contextlib.redirect_stdout(buf):\n    printer.pprint('where am I?')\nbuf.getvalue()", output: "'where am I?'\n''" },
      fix:   { label: 'printer made inside',  code: "import contextlib, io, pprint\nbuf = io.StringIO()\nwith contextlib.redirect_stdout(buf):\n    printer = pprint.PrettyPrinter()\n    printer.pprint('where am I?')\nbuf.getvalue()", output: `"'where am I?'\\n"` },
    },
    {
      name: 'Passing the width positionally',
      desc: "PrettyPrinter's first positional parameter is indent, so PrettyPrinter(4) means indent=4, not width=4.",
      wrong: { label: 'PrettyPrinter(4)',       code: "import pprint\nprint(pprint.PrettyPrinter(4).pformat(['a' * 40, 'b' * 40]))",       output: "[   'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',\n    'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb']" },
      fix:   { label: 'PrettyPrinter(width=4)', code: "import pprint\nprint(pprint.PrettyPrinter(width=4).pformat(['a' * 40, 'b' * 40]))", output: "['aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',\n 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb']" },
    },
  ],

  when: {
    use: [
      'The same options for many calls (a debug helper, a report writer)',
      'Printing to a fixed stream: stderr, a log file, a StringIO',
      'Subclassing to change how particular objects are shown (override format)',
    ],
    avoid: [
      'One-off output → pprint.pp / pprint.pformat with keyword options',
      'Checking whether eval(repr(x)) works for depth-limited output — isreadable ignores depth',
    ],
  },

  notes: {
    cpython:      'Lib/pprint.py: __init__ converts indent and width with int(), raises ValueError for indent < 0, depth <= 0 and width == 0, and stores sys.stdout if stream is None. pprint() writes nothing when the stored stream is None (3.11+)',
    'Methods':    'pprint(object) and pformat(object) use every option; isreadable(object) and isrecursive(object) call format(object, {}, 0, 0) — maxlevels 0 means no depth limit, so depth never affects them',
    'isreadable': 'True when the text from saferepr-style formatting can rebuild the value: False for recursive structures and for objects whose repr starts with "<". The docs say a depth-limited printer returns False; CPython 3.13 (and 3.12) return True',
    'Versions':   'compact 3.4; sort_dicts 3.8; underscore_numbers 3.10; no writes to a None sys.stdout 3.11',
  },

  related: [
    { name: 'PrettyPrinter.format', slug: 'format',  when: 'The hook subclasses override' },
    { name: 'pprint.pformat',       slug: 'pformat', when: 'One call, a new printer each time' },
    { name: 'pprint.pp',            slug: 'pp',      when: 'Print with sort_dicts=False' },
    { name: 'pprint.isreadable / isrecursive', slug: 'isreadable-isrecursive', when: 'The module-level checks' },
    { name: 'print()',              slug: 'print',   when: 'file= is the same idea as stream=', category: 'functions' },
  ],

  faq: [
    {
      q: 'When should I use PrettyPrinter instead of pprint.pprint?',
      a: 'When you print many values with the same options, or always to the same stream: create the printer once and call printer.pprint(obj). The module functions create a new PrettyPrinter on every call, with the options you pass.',
    },
    {
      q: 'Why is the PrettyPrinter parameter order different from pprint()?',
      a: 'PrettyPrinter(indent, width, depth, stream) has stream fourth; pprint(object, stream, indent, width, depth) has it second. Pass everything except the object by keyword and the difference does not matter.',
    },
    {
      q: 'Can I make PrettyPrinter print my own class differently?',
      a: 'Subclass it and override format(object, context, maxlevels, level): return (text, readable, recursive) for your objects and call super().format() for everything else. The layout of dicts and lists is still done by pprint.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/pprint.html#pprint.PrettyPrinter',
    meta:  'pprint.PrettyPrinter',
  },

};
