// content/reference/python/stdlib/csv/quoting.js

export const meta = {
  slug:        'quoting',
  name:        'csv.QUOTE_MINIMAL',
  signature:   'csv.QUOTE_MINIMAL, csv.QUOTE_ALL, csv.QUOTE_NONNUMERIC, csv.QUOTE_NONE, csv.QUOTE_STRINGS, csv.QUOTE_NOTNULL',
  blurb:       'The six quoting styles: when the writer puts quotes around fields, and how the reader treats unquoted ones (as floats, or empty ones as None).',
  category:    'constants',
  type:        'constant',
  hasLiveDemo: true,
  version:     'Python 2.3+ (QUOTE_STRINGS, QUOTE_NOTNULL: 3.12+)',
  searchTerms: 'csv quoting constants QUOTE_MINIMAL QUOTE_ALL QUOTE_NONNUMERIC QUOTE_NONE QUOTE_STRINGS QUOTE_NOTNULL quote all fields csv quote strings none empty field float conversion python csv quoting',
};

export const method = {
  slug:      'quoting',
  name:      'csv.QUOTE_MINIMAL',
  signature: 'csv.QUOTE_MINIMAL, csv.QUOTE_ALL, csv.QUOTE_NONNUMERIC, csv.QUOTE_NONE, csv.QUOTE_STRINGS, csv.QUOTE_NOTNULL',
  returns:   { type: 'int', desc: 'Plain ints 0 to 5, in the order listed, passed as quoting= to reader, writer, DictReader, DictWriter or a Dialect.' },

  category:    'csv constants',
  version:     'Python 2.3+ (QUOTE_STRINGS, QUOTE_NOTNULL: 3.12+)',
  hasLiveDemo: true,

  subtitle: 'QUOTE_MINIMAL (the default) quotes only fields that need it. The others quote everything, everything but numbers, nothing, only str values, or everything but None — and three of them also change what the reader returns.',

  covers: ['QUOTE_MINIMAL', 'QUOTE_ALL', 'QUOTE_NONNUMERIC', 'QUOTE_NONE', 'QUOTE_STRINGS', 'QUOTE_NOTNULL'],

  cheat: {
    commonCall: 'csv.writer(f, quoting=csv.QUOTE_ALL)',
    returns:    '0 MINIMAL · 1 ALL · 2 NONNUMERIC · 3 NONE · 4 STRINGS · 5 NOTNULL',
    replaces:   'adding quotes to values yourself',
    watchOut:   'on READING, NONNUMERIC turns every unquoted field into a float',
  },

  parameters: [],

  modes: [
    {
      id: 'write',
      label: 'writing',
      blurb: "The row ['Ada', 36, 2.5, None, ''] written with quoting 0 to 5.",
      params: [{ name: 'quoting', type: 'int', hint: '0 to 5', input: 'number' }],
      template: "import csv, io\nbuf = io.StringIO(newline='')\ncsv.writer(buf, quoting={$quoting}, escapechar='\\\\').writerow(['Ada', 36, 2.5, None, ''])\nbuf.getvalue()",
      cases: [
        { id: 'min',     label: 'QUOTE_MINIMAL',    values: { quoting: '0' } },
        { id: 'all',     label: 'QUOTE_ALL',        values: { quoting: '1' } },
        { id: 'nonnum',  label: 'QUOTE_NONNUMERIC', values: { quoting: '2' } },
        { id: 'none',    label: 'QUOTE_NONE',       values: { quoting: '3' } },
        { id: 'strings', label: 'QUOTE_STRINGS',    values: { quoting: '4' } },
        { id: 'notnull', label: 'QUOTE_NOTNULL',    values: { quoting: '5' } },
      ],
    },
    {
      id: 'read',
      label: 'reading',
      blurb: 'Your line read with quoting 0 to 5. Quoted fields always stay strings.',
      params: [
        { name: 'line',    type: 'str', hint: 'one CSV line', input: 'text' },
        { name: 'quoting', type: 'int', hint: '0 to 5',       input: 'number' },
      ],
      template: "import csv\nnext(csv.reader([{$line}], quoting={$quoting}))",
      cases: [
        { id: 'min',     label: 'QUOTE_MINIMAL',    values: { line: '1,"2",,""', quoting: '0' } },
        { id: 'nonnum',  label: 'QUOTE_NONNUMERIC', values: { line: '1,"2",3.5', quoting: '2' } },
        { id: 'nonnumx', label: 'NONNUMERIC + text', values: { line: '1,Ada', quoting: '2' } },
        { id: 'none',    label: 'QUOTE_NONE',       values: { line: '1,"2",,""', quoting: '3' } },
        { id: 'strings', label: 'QUOTE_STRINGS',    values: { line: '1,"2",,""', quoting: '4' } },
        { id: 'notnull', label: 'QUOTE_NOTNULL',    values: { line: '1,"2",,""', quoting: '5' } },
      ],
    },
  ],
  demoExplainer: 'Writing: None and \'\' both become empty fields; QUOTE_STRINGS and QUOTE_NOTNULL quote \'\' but not None, so the difference survives the file. Reading: QUOTE_NONNUMERIC converts every unquoted, non-empty field with float() — "Ada" raises ValueError: could not convert string to float: \'Ada\'. QUOTE_STRINGS converts too, and also turns an empty unquoted field into None; QUOTE_NOTNULL only does the None part. QUOTE_NONE treats quote characters as ordinary text.',

  patterns: [
    {
      name: 'Quote every field',
      desc: 'Some importers insist on it.',
      code: "import csv\nwith open('out.csv', 'w', newline='', encoding='utf-8') as f:\n    csv.writer(f, quoting=csv.QUOTE_ALL).writerows(rows)",
    },
    {
      name: 'Keep None and empty string apart (3.12+)',
      desc: 'Write and read with the same style.',
      code: "import csv\nwith open('out.csv', 'w', newline='', encoding='utf-8') as f:\n    csv.writer(f, quoting=csv.QUOTE_NOTNULL).writerows(rows)\nwith open('out.csv', newline='', encoding='utf-8') as f:\n    rows = list(csv.reader(f, quoting=csv.QUOTE_NOTNULL))",
    },
    {
      name: 'Numbers back as floats',
      desc: 'Write with QUOTE_NONNUMERIC so text is quoted, read with it so numbers come back as float.',
      code: "import csv\nwith open('nums.csv', newline='', encoding='utf-8') as f:\n    rows = list(csv.reader(f, quoting=csv.QUOTE_NONNUMERIC))",
    },
  ],

  examples: [
    { title: 'They are plain ints',               code: 'import csv\n[csv.QUOTE_MINIMAL, csv.QUOTE_ALL, csv.QUOTE_NONNUMERIC, csv.QUOTE_NONE, csv.QUOTE_STRINGS, csv.QUOTE_NOTNULL]', returns: '[0, 1, 2, 3, 4, 5]' },
    { title: 'QUOTE_ALL',                         code: "import csv, io\nbuf = io.StringIO(newline='')\ncsv.writer(buf, quoting=csv.QUOTE_ALL).writerow(['a', 1])\nbuf.getvalue()", returns: '\'"a","1"\\r\\n\'' },
    { title: 'QUOTE_NONNUMERIC round trip',       code: "import csv, io\nbuf = io.StringIO(newline='')\ncsv.writer(buf, quoting=csv.QUOTE_NONNUMERIC).writerow(['Ada', 36])\nnext(csv.reader([buf.getvalue()], quoting=csv.QUOTE_NONNUMERIC))", returns: "['Ada', 36.0]" },
    { title: 'QUOTE_NOTNULL keeps None',          code: "import csv, io\nbuf = io.StringIO(newline='')\ncsv.writer(buf, quoting=csv.QUOTE_NOTNULL).writerow(['a', None, ''])\n(buf.getvalue(), next(csv.reader([buf.getvalue()], quoting=csv.QUOTE_NOTNULL)))", returns: '(\'"a",,""\\r\\n\', [\'a\', None, \'\'])' },
    { title: 'QUOTE_NONE needs an escapechar',    code: "import csv, io\ncsv.writer(io.StringIO(), quoting=csv.QUOTE_NONE).writerow(['a,b'])", returns: '_csv.Error: need to escape, but no escapechar set' },
    { title: 'quotechar=None implies QUOTE_NONE', code: "import csv\ncsv.reader([], quotechar=None).dialect.quoting", returns: '3' },
    { title: 'Anything else is rejected',         code: "import csv\ncsv.reader([], quoting=6)", returns: 'TypeError: bad "quoting" value' },
  ],

  pitfalls: [
    {
      name: 'Reading with QUOTE_NONNUMERIC when text is unquoted',
      desc: 'The reader cannot know which unquoted fields were meant as text. Any non-number that is not quoted stops the read.',
      wrong: { label: 'QUOTE_NONNUMERIC', code: "import csv\nlist(csv.reader(['name,age', 'Ada,36'], quoting=csv.QUOTE_NONNUMERIC))", output: "ValueError: could not convert string to float: 'name'" },
      fix:   { label: 'convert yourself', code: "import csv\nrows = csv.reader(['name,age', 'Ada,36'])\nheader = next(rows)\n[(name, int(age)) for name, age in rows]", output: "[('Ada', 36)]" },
    },
    {
      name: 'Expecting QUOTE_ALL to change what is read',
      desc: 'For reading, QUOTE_ALL behaves like QUOTE_MINIMAL: quotes are removed and everything is a str.',
      wrong: { label: 'QUOTE_ALL', code: "import csv\nnext(csv.reader(['\"1\",2'], quoting=csv.QUOTE_ALL))", output: "['1', '2']" },
      fix:   { label: 'QUOTE_NONNUMERIC', code: "import csv\nnext(csv.reader(['\"1\",2'], quoting=csv.QUOTE_NONNUMERIC))", output: "['1', 2.0]" },
    },
  ],

  when: {
    use: [
      'QUOTE_ALL / QUOTE_NONNUMERIC: the consumer expects quoted text',
      'QUOTE_NOTNULL / QUOTE_STRINGS: None must survive a round trip (3.12+)',
      'QUOTE_NONE + escapechar: formats that use backslash escapes instead of quotes',
    ],
    avoid: [
      'QUOTE_NONNUMERIC for reading files you did not write that way',
    ],
  },

  notes: {
    cpython:    'Modules/_csv.c — enum QuoteStyle; csv_writerow picks the initial quoted flag per field, parse_save_field applies the float() / None rules when reading',
    'Version':  'QUOTE_STRINGS and QUOTE_NOTNULL were added in Python 3.12',
    'Numbers':  'For QUOTE_NONNUMERIC/STRINGS writing, "numeric" means int, float, bool, Decimal… (anything that supports the number protocol)',
  },

  related: [
    { name: 'csv.writer', slug: 'writer', when: 'Where quoting applies' },
    { name: 'csv.reader', slug: 'reader', when: 'Reading with NONNUMERIC / STRINGS / NOTNULL' },
    { name: 'Dialect',    slug: 'dialect', when: 'quoting as a dialect setting' },
    { name: 'csv module', slug: 'csv', when: 'Overview', category: 'stdlib' },
    { name: 'float()',    slug: 'float', when: 'The conversion QUOTE_NONNUMERIC uses', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I quote all fields in a CSV file with Python?',
      a: 'Pass quoting=csv.QUOTE_ALL to csv.writer (or DictWriter). Every field, numbers included, is wrapped in quotes.',
    },
    {
      q: 'Why do I get "could not convert string to float" from csv.reader?',
      a: 'quoting=csv.QUOTE_NONNUMERIC (or QUOTE_STRINGS) is set, and an unquoted field is not a number — often the header row. Read without it and convert the numeric columns yourself.',
    },
    {
      q: 'How do I tell an empty string from None in a CSV file?',
      a: "Since Python 3.12: write and read with quoting=csv.QUOTE_NOTNULL (or QUOTE_STRINGS). None is written as an empty unquoted field, '' as \"\", and the reader maps them back.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/csv.html#csv.QUOTE_MINIMAL',
    meta:  'csv module constants',
  },

};
