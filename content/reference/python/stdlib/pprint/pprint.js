// content/reference/python/stdlib/pprint/pprint.js

export const meta = {
  slug:        'pprint',
  name:        'pprint.pprint',
  signature:   'pprint.pprint(object, stream=None, indent=1, width=80, depth=None, *, compact=False, sort_dicts=True, underscore_numbers=False)',
  blurb:       'Print a value laid out over several lines when its repr is wider than the width — nested dicts and lists indented, dict keys sorted. Returns None.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'All Python versions (compact 3.4, sort_dicts 3.8, underscore_numbers 3.10)',
  searchTerms: 'pprint.pprint python pretty print function print nested dict list readable stream width indent depth compact sort_dicts underscore_numbers returns None int object has no attribute write',
};

export const method = {
  slug:      'pprint',
  name:      'pprint.pprint',
  signature: 'pprint.pprint(object, stream=None, indent=1, width=80, depth=None, *, compact=False, sort_dicts=True, underscore_numbers=False)',
  returns:   { type: 'None', desc: 'Nothing — the text, followed by a newline, is written to stream (sys.stdout by default).' },

  category:    'pprint function',
  version:     'All Python versions (compact 3.4, sort_dicts 3.8, underscore_numbers 3.10)',
  hasLiveDemo: true,

  subtitle: 'Writes pformat(object) plus a newline to the stream. Note the positional order — object, stream, indent, width, depth — so pass width by keyword; and note that dict keys are sorted unless you say sort_dicts=False (or use pp).',

  covers: ['pprint'],

  cheat: {
    commonCall: 'pprint.pprint(data, width=100)',
    returns:    'None — it prints',
    replaces:   'print(data) for nested data you need to read',
    watchOut:   'Sorts dict keys; the 2nd positional argument is stream',
  },

  parameters: [
    { name: 'object',             type: 'any',       required: true,  default: null,    desc: 'The value to show. Built-in containers, dataclasses and SimpleNamespace are laid out; anything else prints as its repr().' },
    { name: 'stream',             type: 'text file', required: false, default: 'None',  desc: 'Where to write: anything with a write() method. None means sys.stdout at call time (since 3.11 nothing is written when sys.stdout is None).' },
    { name: 'indent',             type: 'int',       required: false, default: '1',     desc: 'Extra spaces per nesting level. When a container is split, values above 1 also put indent - 1 spaces right after its opening bracket.' },
    { name: 'width',              type: 'int',       required: false, default: '80',    desc: 'Target line width. A container is split only when its one-line repr is wider; single items longer than the width are printed whole.' },
    { name: 'depth',              type: 'int | None', required: false, default: 'None', desc: 'Nesting levels to show; deeper containers become [...], {...} or (...). Must be > 0.' },
    { name: 'compact',            type: 'bool',      required: false, default: 'False', desc: 'Keyword-only. Put as many sequence items on each line as fit instead of one per line.' },
    { name: 'sort_dicts',         type: 'bool',      required: false, default: 'True',  desc: 'Keyword-only (3.8+). Sort dict keys; False keeps insertion order.' },
    { name: 'underscore_numbers', type: 'bool',      required: false, default: 'False', desc: 'Keyword-only (3.10+). Write ints with _ between groups of three digits: 1_000_000.' },
  ],

  modes: [
    {
      id: 'print',
      label: 'pprint',
      blurb: 'The printed text comes first; the final None is what pprint returns — it prints, it does not give you the text (pformat does).',
      params: [
        { name: 'data',  type: 'str', hint: 'a Python literal', input: 'text' },
        { name: 'width', type: 'int', hint: 'target line width', input: 'number' },
      ],
      template: 'import ast, pprint\ndata = ast.literal_eval({$data})\npprint.pprint(data, width={$width})',
      cases: [
        { id: 'users', label: 'list of dicts', values: { data: "[{'name': 'Ada', 'id': 1}, {'name': 'Grace', 'id': 2}]", width: '30' } },
        { id: 'sets',  label: 'set inside',    values: { data: "[{'id': 1, 'tags': {30, 10, 20}}]", width: '20' } },
        { id: 'bytes', label: 'long bytes',    values: { data: "b'0123456789012345678901234567890123456789'", width: '20' } },
        { id: 'small', label: 'fits',          values: { data: "{'b': [1, 2], 'a': 'x'}", width: '80' } },
      ],
    },
    {
      id: 'stream',
      label: 'stream=',
      blurb: 'Send the output to any object with write() — here an io.StringIO — and look at the exact text: pformat output plus one newline.',
      params: [
        { name: 'data',  type: 'str', hint: 'a Python literal', input: 'text' },
        { name: 'depth', type: 'int | None', hint: 'levels to show', input: 'number-or-none' },
      ],
      template: 'import ast, io, pprint\nbuf = io.StringIO()\npprint.pprint(ast.literal_eval({$data}), stream=buf, depth={$depth})\nbuf.getvalue()',
      cases: [
        { id: 'plain', label: 'no depth', values: { data: "{'a': {'b': {'c': 1}}}", depth: '' } },
        { id: 'one',   label: 'depth=1',  values: { data: "{'a': {'b': {'c': 1}}}", depth: '1' } },
        { id: 'two',   label: 'depth=2',  values: { data: "[1, (2, [3, {4: 5}])]", depth: '2' } },
      ],
    },
  ],
  demoExplainer: "The set {30, 10, 20} is too wide for width 20 inside the dict, so pprint sorts it and prints one item per line; a set that fits stays in its normal iteration order. Bytes longer than the width are cut on 4-byte boundaries into pieces that fit, wrapped in parentheses when the bytes object is the whole value. Whatever goes to the stream ends in exactly one newline, and depth turns everything below the limit into {...}, [...] or (...).",

  patterns: [
    {
      name: 'Quick look at a response',
      desc: 'Wider lines for wide terminals.',
      code: 'import pprint\npprint.pprint(response.json(), width=120)',
    },
    {
      name: 'Print to stderr',
      desc: 'Keep debug output out of stdout.',
      code: 'import pprint, sys\npprint.pprint(state, stream=sys.stderr)',
    },
    {
      name: 'Write to a file',
      desc: 'Any text file works as the stream.',
      code: "import pprint\nwith open('dump.txt', 'w', encoding='utf-8') as f:\n    pprint.pprint(data, stream=f)",
    },
  ],

  examples: [
    { title: 'Sorted keys, one line',      code: "import pprint\npprint.pprint({'b': [1, 2], 'a': 'x'})", returns: "{'a': 'x', 'b': [1, 2]}" },
    { title: 'One item per line',          code: "import pprint\nusers = [{'name': 'Ada', 'id': 1}, {'name': 'Grace', 'id': 2}]\npprint.pprint(users, width=30)", returns: "[{'id': 1, 'name': 'Ada'},\n {'id': 2, 'name': 'Grace'}]" },
    { title: 'Long sequences go vertical', code: "import pprint\npprint.pprint(list(range(12)), width=20)", returns: '[0,\n 1,\n 2,\n 3,\n 4,\n 5,\n 6,\n 7,\n 8,\n 9,\n 10,\n 11]' },
    { title: 'indent above 1',             code: "import pprint\npprint.pprint(['alpha', 'beta', 'gamma'], indent=2, width=10)", returns: "[ 'alpha',\n  'beta',\n  'gamma']" },
    { title: 'depth cuts off nesting',     code: "import pprint\npprint.pprint({'a': {'b': {'c': 1}}}, depth=1)", returns: "{'a': {...}}" },
    { title: 'Bytes are wrapped too',      code: "import pprint\npprint.pprint(b'0123456789' * 3, width=20)", returns: "(b'0123456789012345'\n b'67890123456789')" },
    { title: 'Output to a StringIO',       code: "import io, pprint\nbuf = io.StringIO()\npprint.pprint([1, 2], stream=buf)\nbuf.getvalue()", returns: "'[1, 2]\\n'" },
  ],

  pitfalls: [
    {
      name: 'Passing width as the second argument',
      desc: 'The second positional parameter is stream, so the number is taken as the output file. Pass width (and everything after object) by keyword.',
      wrong: { label: 'pprint(data, 40)',       code: "import pprint\npprint.pprint(list(range(30)), 40)",       output: "AttributeError: 'int' object has no attribute 'write'" },
      fix:   { label: 'pprint(data, width=40)', code: "import pprint\npprint.pprint(list(range(30)), width=40, compact=True)", output: '[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,\n 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,\n 22, 23, 24, 25, 26, 27, 28, 29]' },
    },
    {
      name: 'Wrapping pprint in print',
      desc: 'pprint already prints and returns None, so print(pprint.pprint(x)) adds a stray None line.',
      wrong: { label: 'print(pprint.pprint(…))', code: "import pprint\nprint(pprint.pprint([1, 2]))", output: '[1, 2]\nNone' },
      fix:   { label: 'pprint.pprint(…)',        code: "import pprint\npprint.pprint([1, 2])",        output: '[1, 2]' },
    },
  ],

  when: {
    use: [
      'Reading nested data while debugging — in the REPL, a script or a notebook',
      'Dumping a structure to stderr or a log file with a stable (sorted) key order',
    ],
    avoid: [
      'You need the text → pprint.pformat',
      'Insertion order matters → pprint.pp (sort_dicts=False)',
      'Output for other programs → json.dumps(indent=2)',
    ],
  },

  notes: {
    cpython:   'Lib/pprint.py: pprint() builds a PrettyPrinter with the given options and calls its pprint(), which runs _format() on the stream and then writes "\\n"',
    'Stream':  'sys.stdout is looked up when the PrettyPrinter is created, so contextlib.redirect_stdout captures the output',
    'Versions': 'compact 3.4; sort_dicts 3.8; underscore_numbers 3.10; since 3.11 nothing is written when sys.stdout is None (pythonw.exe)',
  },

  related: [
    { name: 'pprint.pp',          slug: 'pp',            when: 'Same, without sorting dict keys' },
    { name: 'pprint.pformat',     slug: 'pformat',       when: 'Get the text instead of printing it' },
    { name: 'PrettyPrinter',      slug: 'prettyprinter', when: 'Reuse one set of options' },
    { name: 'print()',            slug: 'print',         when: 'Plain output, one line', category: 'functions' },
    { name: 'json.dumps',         slug: 'dumps',         when: 'Indented JSON instead of Python syntax', category: 'stdlib/json' },
  ],

  faq: [
    {
      q: 'Why does pprint.pprint print None?',
      a: 'It does not — print() does. pprint.pprint writes the text itself and returns None; print(pprint.pprint(x)) then prints that None. Call pprint.pprint(x) on its own, or use pformat when you need the string.',
    },
    {
      q: "Why do I get \"AttributeError: 'int' object has no attribute 'write'\" from pprint?",
      a: 'You passed the width positionally: pprint.pprint(data, 100). The second parameter is stream, so pprint tries to call 100.write(). Use pprint.pprint(data, width=100).',
    },
    {
      q: 'How do I make pprint use the full width of my terminal?',
      a: 'Pass width=shutil.get_terminal_size().columns. pprint never measures the terminal itself; the default is always 80.',
    },
    {
      q: 'Does pprint.pprint sort lists and sets?',
      a: 'It never reorders lists or tuples. It sorts dict keys (unless sort_dicts=False), and it sorts the items of a set only when the set is too wide for one line and has to be split.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/pprint.html#pprint.pprint',
    meta:  'pprint.pprint',
  },

};
