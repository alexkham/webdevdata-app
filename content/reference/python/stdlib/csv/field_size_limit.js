// content/reference/python/stdlib/csv/field_size_limit.js

export const meta = {
  slug:        'field_size_limit',
  name:        'csv.field_size_limit',
  signature:   'csv.field_size_limit([new_limit])',
  blurb:       'Get or set the largest field the reader accepts (131072 characters by default). Returns the old limit.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: 'csv field_size_limit field larger than field limit 131072 csv.Error large field maxsize increase csv field size python csv.field_size_limit sys.maxsize OverflowError',
};

export const method = {
  slug:      'field_size_limit',
  name:      'csv.field_size_limit',
  signature: 'csv.field_size_limit([new_limit])',
  returns:   { type: 'int', desc: 'The limit that was in force before the call.' },

  category:    'csv function',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  subtitle: 'A safety net against runaway fields (e.g. an unclosed quote swallowing the rest of a file). The limit is module-wide, counts characters, and applies to reading only.',

  covers: ['field_size_limit'],

  cheat: {
    commonCall: 'csv.field_size_limit(10_000_000)',
    returns:    'the previous limit, 131072 at first',
    replaces:   '-',
    watchOut:   'global for the whole process; sys.maxsize overflows on Windows before 3.13.1',
  },

  parameters: [
    { name: 'new_limit', type: 'int', required: false, default: null, desc: 'The new maximum number of characters per field. Omit it to only read the current value.' },
  ],

  modes: [
    {
      id: 'limit',
      label: 'limit',
      blurb: 'Set a limit, read one line, put the old limit back. A field longer than the limit raises csv.Error.',
      params: [
        { name: 'limit', type: 'int', hint: 'max characters per field', input: 'number' },
        { name: 'line',  type: 'str', hint: 'one CSV line',             input: 'text' },
      ],
      template: "import csv\nold = csv.field_size_limit({$limit})\ntry:\n    rows = list(csv.reader([{$line}]))\nfinally:\n    csv.field_size_limit(old)\n(old, rows)",
      cases: [
        { id: 'fits',  label: 'fits',          values: { limit: '5', line: 'abcde,xy' } },
        { id: 'over',  label: 'one too long',  values: { limit: '5', line: 'abcdef,xy' } },
        { id: 'quote', label: 'quotes not counted', values: { limit: '3', line: '"abc",d' } },
        { id: 'zero',  label: 'limit 0',       values: { limit: '0', line: 'a' } },
        { id: 'empty', label: 'limit 0, empty fields', values: { limit: '0', line: ',,' } },
      ],
    },
  ],
  demoExplainer: 'The limit counts the characters of the field value: "abcde" fits a limit of 5, "abcdef" raises _csv.Error: field larger than field limit (5). The surrounding quotes of "abc" are not part of the value, so a limit of 3 is enough. With 0 no field may have even one character, but empty fields are still fine. The snippet restores the old limit in finally because the setting is shared by the whole program.',

  patterns: [
    {
      name: 'Allow very large fields',
      desc: 'Up to Python 3.13.0 the limit was a C long — 32 bits on Windows — so sys.maxsize raised OverflowError there; halving until it fits works everywhere.',
      code: "import csv, sys\nlimit = sys.maxsize\nwhile True:\n    try:\n        csv.field_size_limit(limit)\n        break\n    except OverflowError:\n        limit //= 2",
    },
    {
      name: 'Raise it temporarily',
      desc: 'Restore the previous value when done.',
      code: "import csv\nold = csv.field_size_limit(10_000_000)\ntry:\n    rows = list(csv.reader(f))\nfinally:\n    csv.field_size_limit(old)",
    },
  ],

  examples: [
    { title: 'Read the current limit',      code: 'import csv\ncsv.field_size_limit()', returns: '131072' },
    { title: 'A field over the limit',      code: "import csv\nnext(csv.reader(['x' * 131073]))", returns: '_csv.Error: field larger than field limit (131072)' },
    { title: 'Exactly the limit is fine',   code: "import csv\nlen(next(csv.reader(['x' * 131072]))[0])", returns: '131072' },
    { title: 'Setting returns the old value', code: 'import csv\nold = csv.field_size_limit(500)\ntry:\n    now = csv.field_size_limit()\nfinally:\n    csv.field_size_limit(old)\n(old, now)', returns: '(131072, 500)' },
    { title: 'Only ints',                   code: "import csv\ncsv.field_size_limit('1000')", returns: 'TypeError: limit must be an integer' },
    { title: 'Writing is not limited',      code: "import csv, io\nbuf = io.StringIO(newline='')\ncsv.writer(buf).writerow(['x' * 200000])\nlen(buf.getvalue())", returns: '200002' },
  ],

  pitfalls: [
    {
      name: 'An unclosed quote hits the limit',
      desc: 'Without a closing quote the rest of the input becomes one field. The limit error is often a symptom of broken quoting, not of a legitimately huge field.',
      wrong: { label: 'raise the limit', code: "import csv\nlines = ['a,\"b'] + ['x' * 100] * 2000\nlen(next(csv.reader(lines)))", output: '_csv.Error: field larger than field limit (131072)' },
      fix:   { label: 'strict=True', code: "import csv\nlines = ['a,\"b'] + ['x' * 100] * 10\ntry:\n    next(csv.reader(lines, strict=True))\nexcept csv.Error as e:\n    msg = str(e)\nmsg", output: "'unexpected end of data'" },
    },
  ],

  when: {
    use: ['Files with legitimately huge fields (embedded documents, base64 blobs)'],
    avoid: ['Hiding broken quoting — check the data first (strict=True helps)'],
  },

  notes: {
    cpython:   'Modules/_csv.c — field_limit in the module state (128 * 1024); parse_add_char raises "field larger than field limit (%zd)" before appending the character that would exceed it',
    'Range':   'Stored as a C Py_ssize_t since 3.13.1 (a C long before, 32-bit on Windows); beyond it: OverflowError. A non-int is TypeError: limit must be an integer',
    'Scope':   'Module-wide: affects every reader in the process, including other threads',
  },

  related: [
    { name: 'csv.reader', slug: 'reader', when: 'Where the limit is enforced' },
    { name: 'csv.Error',  slug: 'error',  when: 'What an oversized field raises' },
    { name: 'csv module', slug: 'csv',    when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I fix "_csv.Error: field larger than field limit (131072)"?',
      a: 'First check for an unclosed quote. If the fields really are that large, raise the limit before reading: csv.field_size_limit(10_000_000) (or the largest value your platform accepts).',
    },
    {
      q: 'Why does csv.field_size_limit(sys.maxsize) raise OverflowError on Windows?',
      a: 'Before Python 3.13.1 the limit was stored in a C long, which is 32 bits on Windows, so sys.maxsize did not fit there. 3.13.1+ stores it as Py_ssize_t and accepts sys.maxsize; for older versions use a smaller number, or halve sys.maxsize until the call succeeds.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/csv.html#csv.field_size_limit',
    meta:  'csv.field_size_limit',
  },

};
