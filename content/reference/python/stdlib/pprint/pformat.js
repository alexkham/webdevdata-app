// content/reference/python/stdlib/pprint/pformat.js

export const meta = {
  slug:        'pformat',
  name:        'pprint.pformat',
  signature:   'pprint.pformat(object, indent=1, width=80, depth=None, *, compact=False, sort_dicts=True, underscore_numbers=False)',
  blurb:       'Return the pretty-printed text of a value as a str — exactly what pprint would print, minus the final newline — for logs, files, assertions and f-strings.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'All Python versions (compact 3.4, sort_dicts 3.8, underscore_numbers 3.10)',
  searchTerms: 'pprint.pformat python pretty print to string pformat dict to string pretty string log pretty print compact underscore_numbers sort_dicts width indent depth format nested data as text',
};

export const method = {
  slug:      'pformat',
  name:      'pprint.pformat',
  signature: 'pprint.pformat(object, indent=1, width=80, depth=None, *, compact=False, sort_dicts=True, underscore_numbers=False)',
  returns:   { type: 'str', desc: 'The formatted text: the plain repr if it fits in width, otherwise several lines joined with "\\n". No trailing newline.' },

  category:    'pprint function',
  version:     'All Python versions (compact 3.4, sort_dicts 3.8, underscore_numbers 3.10)',
  hasLiveDemo: true,

  subtitle: 'The string version of pprint. It takes the same options except stream — so its second positional parameter is indent, not stream; pass the options by keyword.',

  covers: ['pformat'],

  cheat: {
    commonCall: 'text = pprint.pformat(data, width=100)',
    returns:    "\"{'a': 1, 'b': 2}\" — a str, no trailing newline",
    replaces:   'str(data) or repr(data) for big nested values in logs',
    watchOut:   'The 2nd positional argument is indent',
  },

  parameters: [
    { name: 'object',             type: 'any',        required: true,  default: null,    desc: 'The value to format.' },
    { name: 'indent',             type: 'int',        required: false, default: '1',     desc: 'Extra spaces per nesting level (>= 0).' },
    { name: 'width',              type: 'int',        required: false, default: '80',    desc: 'Target line width (must not be 0). A container is split only when its repr is wider.' },
    { name: 'depth',              type: 'int | None', required: false, default: 'None',  desc: 'Levels to show; deeper containers become [...], {...}, (...). Must be > 0.' },
    { name: 'compact',            type: 'bool',       required: false, default: 'False', desc: 'Keyword-only. Fill each line with as many sequence items as fit.' },
    { name: 'sort_dicts',         type: 'bool',       required: false, default: 'True',  desc: 'Keyword-only (3.8+). False keeps dict insertion order.' },
    { name: 'underscore_numbers', type: 'bool',       required: false, default: 'False', desc: 'Keyword-only (3.10+). Write ints as 1_000_000. Floats are not affected.' },
  ],

  modes: [
    {
      id: 'pformat',
      label: 'pformat',
      blurb: 'The returned string, split at its newlines so each output line is one list item.',
      params: [
        { name: 'data',  type: 'str', hint: 'a Python literal', input: 'text' },
        { name: 'width', type: 'int', hint: 'target line width', input: 'number' },
      ],
      template: 'import ast, pprint\ndata = ast.literal_eval({$data})\npprint.pformat(data, width={$width}).splitlines()',
      cases: [
        { id: 'dict',   label: 'dict, width 15',  values: { data: "{'id': 7, 'tags': ['a', 'b']}", width: '15' } },
        { id: 'tuple',  label: '1-tuple',         values: { data: "('a long single item',)", width: '10' } },
        { id: 'string', label: 'string',          values: { data: "'The quick brown fox jumps over the lazy dog'", width: '20' } },
        { id: 'escape', label: 'newlines in str', values: { data: "{'poem': 'Roses are red\\nViolets are blue\\n'}", width: '30' } },
      ],
    },
    {
      id: 'compact',
      label: 'compact=True',
      blurb: 'How many lines the default layout needs, and the compact layout of the same value.',
      params: [
        { name: 'data',  type: 'str', hint: 'a Python literal', input: 'text' },
        { name: 'width', type: 'int', hint: 'target line width', input: 'number' },
      ],
      template: "import ast, pprint\ndata = ast.literal_eval({$data})\nlines = pprint.pformat(data, width={$width}).count('\\n') + 1\n(lines, pprint.pformat(data, width={$width}, compact=True).splitlines())",
      cases: [
        { id: 'ints',   label: '20 ints',          values: { data: '[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]', width: '30' } },
        { id: 'mixed',  label: 'nested item',      values: { data: "[1, 2, 3, ['a', 'b', 'c', 'd', 'e', 'f'], 4, 5]", width: '20' } },
        { id: 'dict',   label: 'dict values',      values: { data: "{'evens': [0, 2, 4, 6, 8, 10, 12, 14], 'odds': [1, 3, 5, 7, 9, 11, 13, 15]}", width: '30' } },
      ],
    },
    {
      id: 'underscore',
      label: 'underscore_numbers',
      blurb: 'Every int at any depth gets digit-group underscores; floats and bools do not.',
      params: [{ name: 'data', type: 'str', hint: 'a Python literal', input: 'text' }],
      template: 'import ast, pprint\npprint.pformat(ast.literal_eval({$data}), underscore_numbers=True)',
      cases: [
        { id: 'ints',   label: 'ints',            values: { data: "{'views': 1234567, 'likes': -98765, 'id': 42}" } },
        { id: 'floats', label: 'float and bool',  values: { data: '[1234567.5, True, 10000]' } },
        { id: 'keys',   label: 'int keys',        values: { data: '{1000000: (2000, 3000000)}' } },
      ],
    },
  ],
  demoExplainer: "A one-item tuple keeps its trailing comma even when split: the closing becomes ,) on the last line. A string with newlines is split after each \\n first, then at spaces if a line is still too long. compact=True puts several short items per line; an item too wide for the rest of the line (like the nested list) starts a new line and is split the same compact way. underscore_numbers only touches int: 1234567.5 stays as it is, and True keeps its plain repr although bool is a subclass of int.",

  patterns: [
    {
      name: 'Pretty data in a log record',
      desc: 'Format lazily: pass pformat output as an argument.',
      code: "import logging, pprint\nlog = logging.getLogger(__name__)\nlog.debug('payload:\\n%s', pprint.pformat(payload, width=100))",
    },
    {
      name: 'Readable assertion messages',
      desc: 'Show both sides laid out when a test fails.',
      code: "import pprint\nassert got == want, f'\\n{pprint.pformat(got)}\\n!=\\n{pprint.pformat(want)}'",
    },
    {
      name: 'Write a snapshot file',
      desc: 'Sorted keys make the text stable between runs.',
      code: "import pprint\nfrom pathlib import Path\nPath('snapshot.txt').write_text(pprint.pformat(result) + '\\n', encoding='utf-8')",
    },
  ],

  examples: [
    { title: 'A str, keys sorted',             code: "import pprint\npprint.pformat({'b': 1, 'a': 2})",                       returns: `"{'a': 2, 'b': 1}"` },
    { title: 'Insertion order instead',        code: "import pprint\npprint.pformat({'b': 1, 'a': 2}, sort_dicts=False)",      returns: `"{'b': 1, 'a': 2}"` },
    { title: 'Several lines when too wide',    code: "import pprint\nprint(pprint.pformat({'id': 7, 'tags': ['a', 'b']}, width=15))", returns: "{'id': 7,\n 'tags': ['a',\n          'b']}" },
    { title: 'Counting the lines',             code: "import pprint\ntext = pprint.pformat(list(range(12)), width=20)\ntext.count('\\n')", returns: '11' },
    { title: 'No trailing newline',            code: "import pprint\npprint.pformat([1]).endswith('\\n')",                     returns: 'False' },
    { title: 'A top-level string in parentheses', code: "import pprint\npprint.pformat('a' * 10 + ' ' + 'b' * 10, width=12)",     returns: `"('aaaaaaaaaa '\\n 'bbbbbbbbbb')"` },
    { title: 'Digit groups for ints',          code: "import pprint\npprint.pformat({'n': -98765432109876543210}, underscore_numbers=True)", returns: `"{'n': -98_765_432_109_876_543_210}"` },
  ],

  pitfalls: [
    {
      name: 'Passing width as the second argument',
      desc: "pformat's second positional parameter is indent, so pformat(data, 30) indents by 30 instead of narrowing the output.",
      wrong: { label: 'pformat(words, 30)',       code: "import pprint\nwords = ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda']\nprint(pprint.pformat(words, 30))",       output: "[                             'alpha',\n                              'beta',\n                              'gamma',\n                              'delta',\n                              'epsilon',\n                              'zeta',\n                              'eta',\n                              'theta',\n                              'iota',\n                              'kappa',\n                              'lambda']" },
      fix:   { label: 'pformat(words, width=30)', code: "import pprint\nwords = ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda']\nprint(pprint.pformat(words, width=30, compact=True))", output: "['alpha', 'beta', 'gamma',\n 'delta', 'epsilon', 'zeta',\n 'eta', 'theta', 'iota',\n 'kappa', 'lambda']" },
    },
    {
      name: 'Expecting underscore_numbers to group floats',
      desc: 'Only ints are written with underscores. Format floats yourself with the _ option of format().',
      wrong: { label: 'float stays plain', code: "import pprint\npprint.pformat(1234567.5, underscore_numbers=True)", output: "'1234567.5'" },
      fix:   { label: "f'{x:_}'",         code: "f'{1234567.5:_}'",                                                    output: "'1_234_567.5'" },
    },
  ],

  when: {
    use: [
      'Logging or storing a readable form of nested data',
      'Building messages: assertions, exceptions, CLI output',
      'Comparing structures as text (sorted keys make dict output stable)',
    ],
    avoid: [
      'Printing directly → pprint.pp / pprint.pprint',
      'Machine-readable output → json.dumps',
      'One-line output always → repr(); pformat may add newlines',
    ],
  },

  notes: {
    cpython:   'Lib/pprint.py: PrettyPrinter(indent, width, depth, compact=…, sort_dicts=…, underscore_numbers=…).pformat(object), which runs _format() into an io.StringIO and returns its value',
    'Errors':  "ValueError for indent < 0 ('indent must be >= 0'), depth <= 0 ('depth must be > 0') and width == 0 ('width must be != 0'); a negative width is accepted",
    'Versions': 'compact 3.4; sort_dicts 3.8; underscore_numbers 3.10',
  },

  related: [
    { name: 'pprint.pprint',  slug: 'pprint',        when: 'Print the same text (plus a newline)' },
    { name: 'pprint.pp',      slug: 'pp',            when: 'Print without sorting dict keys' },
    { name: 'PrettyPrinter',  slug: 'prettyprinter', when: 'The class pformat builds for you' },
    { name: 'repr()',         slug: 'repr',          when: 'Always one line', category: 'functions' },
    { name: 'json.dumps',     slug: 'dumps',         when: 'JSON text, indent= for line breaks', category: 'stdlib/json' },
  ],

  faq: [
    {
      q: 'How do I pretty print a dict to a string in Python?',
      a: "text = pprint.pformat(d). Add sort_dicts=False to keep insertion order and width= to change where lines break. For JSON text use json.dumps(d, indent=2).",
    },
    {
      q: 'What is the difference between pprint.pformat and pprint.pprint?',
      a: 'pformat returns the text as a str; pprint writes the same text plus a newline to a stream (sys.stdout by default) and returns None.',
    },
    {
      q: 'Why does pformat ignore my width?',
      a: 'A single item that is wider than the width cannot be split further — a long number, or a string without spaces — so it is printed whole. Also check that you passed width= by keyword: the second positional argument is indent.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/pprint.html#pprint.pformat',
    meta:  'pprint.pformat',
  },

};
