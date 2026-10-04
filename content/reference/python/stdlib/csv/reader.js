// content/reference/python/stdlib/csv/reader.js

export const meta = {
  slug:        'reader',
  name:        'csv.reader',
  signature:   "csv.reader(csvfile, dialect='excel', **fmtparams)",
  blurb:       'Iterate over CSV lines and get each row as a list of strings — quotes, doubled quotes, escapes and line breaks inside fields handled.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'csv reader read csv file python csv.reader parse csv rows list of strings line_num dialect delimiter quotechar skipinitialspace strict escapechar newline new-line character seen in unquoted field iterator should return strings not bytes text mode',
};

export const method = {
  slug:      'reader',
  name:      'csv.reader',
  signature: "csv.reader(csvfile, dialect='excel', **fmtparams)",
  returns:   { type: '_csv.reader', desc: 'An iterator: each next() returns one row as a list of str (one row may span several input lines).' },

  category:    'csv function',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: "Give it anything that yields lines of text — an open file, a list of strings, io.StringIO — and iterate. Every field comes back as a str, and the file must be opened with newline=''.",

  covers: ['reader'],

  cheat: {
    commonCall: "for row in csv.reader(f): ...",
    returns:    "['Ada', '36'] per row — always strings",
    replaces:   "line.strip().split(',') loops that break on quoted commas",
    watchOut:   "open the file with newline='' — and in text mode, not 'rb'",
  },

  parameters: [
    { name: 'csvfile',    type: 'iterable of str', required: true,  default: null,    desc: "Anything that yields lines: a file opened with newline='', a list of strings, io.StringIO." },
    { name: 'dialect',    type: 'str | Dialect',   required: false, default: "'excel'", desc: "A registered name ('excel', 'excel-tab', 'unix') or a Dialect class/instance." },
    { name: 'fmtparams',  type: 'keyword arguments', required: false, default: null, desc: 'Override single settings: delimiter, quotechar, escapechar, doublequote, skipinitialspace, quoting, strict, lineterminator.' },
  ],

  modes: [
    {
      id: 'rows',
      label: 'rows',
      blurb: 'Type CSV text (\\n = line break) and choose the delimiter and quote character.',
      params: [
        { name: 'text',      type: 'str', hint: 'CSV text, \\n = line break', input: 'text' },
        { name: 'delimiter', type: 'str', hint: 'one character',             input: 'text' },
        { name: 'quotechar', type: 'str', hint: 'one character',             input: 'text' },
      ],
      template: "import csv, io\ntext = {$text}.replace('\\\\n', '\\n')\nlist(csv.reader(io.StringIO(text, newline=''), delimiter={$delimiter}, quotechar={$quotechar}))",
      cases: [
        { id: 'default', label: 'excel defaults',  values: { text: 'id,name\\n1,"Smith, John"', delimiter: ',', quotechar: '"' } },
        { id: 'pipe',    label: 'pipes',           values: { text: 'id|name\\n1|Ada', delimiter: '|', quotechar: '"' } },
        { id: 'single',  label: "quotechar '",     values: { text: "id,name\\n1,'Smith, John'", delimiter: ',', quotechar: "'" } },
        { id: 'same',    label: 'same characters', values: { text: 'a,b', delimiter: ',', quotechar: ',' } },
      ],
    },
    {
      id: 'linenum',
      label: 'line_num',
      blurb: 'line_num counts input LINES read so far, not rows — a quoted line break makes them differ.',
      params: [{ name: 'text', type: 'str', hint: 'CSV text, \\n = line break', input: 'text' }],
      template: "import csv, io\ntext = {$text}.replace('\\\\n', '\\n')\nr = csv.reader(io.StringIO(text, newline=''))\n[(r.line_num, row) for row in r]",
      cases: [
        { id: 'simple', label: 'one line per row',  values: { text: 'a,b\\nc,d\\ne,f' } },
        { id: 'multi',  label: 'quoted line break', values: { text: 'id,note\\n1,"line one\\nline two"\\n2,ok' } },
        { id: 'blank',  label: 'blank line',        values: { text: 'a,b\\n\\nc,d' } },
      ],
    },
    {
      id: 'strict',
      label: 'strict',
      blurb: 'The same text read normally and with strict=True. Without strict the reader quietly accepts malformed quoting.',
      params: [{ name: 'text', type: 'str', hint: 'CSV text, \\n = line break', input: 'text' }],
      template: "import csv, io\ntext = {$text}.replace('\\\\n', '\\n')\nloose = list(csv.reader(io.StringIO(text, newline='')))\n(loose, list(csv.reader(io.StringIO(text, newline=''), strict=True)))",
      cases: [
        { id: 'after',  label: 'text after quote', values: { text: 'a,"b"c,d' } },
        { id: 'open',   label: 'unclosed quote',   values: { text: 'a,"b,c' } },
        { id: 'mid',    label: 'quote mid-field',  values: { text: 'a,b"c"d' } },
        { id: 'ok',     label: 'well-formed',      values: { text: 'a,"b ""c""",d' } },
      ],
    },
  ],
  demoExplainer: 'line_num is read after each row is produced, so a row whose quoted field spans two lines advances it by 2, and a blank line produces an empty list []. In strict: a quote that opens a field must be followed by the delimiter or the end of the line once it closes — "b"c is accepted as bc normally and is "\',\' expected after \'"\'" with strict=True. A quote in the middle of an unquoted field is just a character either way.',

  patterns: [
    {
      name: 'Loop over a file',
      desc: "newline='' lets the reader see line breaks inside quoted fields exactly as written.",
      code: "import csv\nwith open('data.csv', newline='', encoding='utf-8') as f:\n    for row in csv.reader(f):\n        print(row)",
    },
    {
      name: 'Skip the header row',
      desc: 'next() on the reader consumes one row.',
      code: "import csv\nwith open('data.csv', newline='', encoding='utf-8') as f:\n    rows = csv.reader(f)\n    header = next(rows)\n    data = [row for row in rows]",
    },
    {
      name: 'Report the line of a bad row',
      desc: 'reader.line_num is the number of physical lines read so far.',
      code: "import csv\nwith open('data.csv', newline='', encoding='utf-8') as f:\n    rows = csv.reader(f, strict=True)\n    try:\n        for row in rows:\n            pass\n    except csv.Error as e:\n        print(f'line {rows.line_num}: {e}')",
    },
  ],

  examples: [
    { title: 'Any iterable of strings works', code: "import csv\nlist(csv.reader(['a,b', '\"c,d\",e']))", returns: "[['a', 'b'], ['c,d', 'e']]" },
    { title: 'Read a file',                  code: "import csv\nwith open('p.csv', 'w', newline='') as f:\n    f.write('name,age\\r\\nAda,36\\r\\n')\nwith open('p.csv', newline='') as f:\n    rows = list(csv.reader(f))\nrows", returns: "[['name', 'age'], ['Ada', '36']]" },
    { title: 'skipinitialspace',             code: "import csv\nline = 'a, b, \"c, d\"'\n(next(csv.reader([line])), next(csv.reader([line], skipinitialspace=True)))", returns: "(['a', ' b', ' \"c', ' d\"'], ['a', 'b', 'c, d'])" },
    { title: 'Escapes instead of quotes',    code: "import csv\nnext(csv.reader(['a\\\\,b,c'], escapechar='\\\\', quoting=csv.QUOTE_NONE))", returns: "['a,b', 'c']" },
    { title: 'Unquoted fields as floats',    code: "import csv\nnext(csv.reader(['1,\"2\",3.5'], quoting=csv.QUOTE_NONNUMERIC))", returns: "[1.0, '2', 3.5]" },
    { title: 'The dialect it uses',          code: "import csv\nd = csv.reader([], delimiter=';').dialect\n(d.delimiter, d.quotechar, d.lineterminator)", returns: "(';', '\"', '\\r\\n')" },
    { title: 'A bare \\r inside a line',     code: "import csv, io\nlist(csv.reader(io.StringIO('a,b\\rc,d\\n')))", returns: "_csv.Error: new-line character seen in unquoted field - do you need to open the file with newline=''?" },
  ],

  pitfalls: [
    {
      name: "Opening the file in binary mode",
      desc: 'csv works on str. A file opened with "rb" yields bytes, and the reader refuses them on the first row.',
      wrong: { label: "open(path, 'rb')", code: "import csv\nwith open('p.csv', 'w', newline='') as f:\n    f.write('a,b\\r\\n')\nwith open('p.csv', 'rb') as f:\n    rows = list(csv.reader(f))", output: '_csv.Error: iterator should return strings, not bytes (the file should be opened in text mode)' },
      fix:   { label: "newline=''", code: "import csv\nwith open('p.csv', 'w', newline='') as f:\n    f.write('a,b\\r\\n')\nwith open('p.csv', newline='', encoding='utf-8') as f:\n    rows = list(csv.reader(f))\nrows", output: "[['a', 'b']]" },
    },
    {
      name: "Reading without newline='' changes quoted line breaks",
      desc: 'With the default newline=None the file object turns \\r\\n into \\n before the reader sees it, so a multi-line field does not come back as it was written.',
      wrong: { label: 'open(path)', code: "import csv\nwith open('q.csv', 'w', newline='') as f:\n    csv.writer(f).writerow(['line1\\r\\nline2'])\nwith open('q.csv') as f:\n    rows = list(csv.reader(f))\nrows", output: "[['line1\\nline2']]" },
      fix:   { label: "open(path, newline='')", code: "import csv\nwith open('q.csv', 'w', newline='') as f:\n    csv.writer(f).writerow(['line1\\r\\nline2'])\nwith open('q.csv', newline='') as f:\n    rows = list(csv.reader(f))\nrows", output: "[['line1\\r\\nline2']]" },
    },
    {
      name: 'Iterating a reader twice',
      desc: 'A reader is a one-pass iterator over the file. The second loop finds it exhausted — keep the rows in a list.',
      wrong: { label: 'two passes', code: "import csv\nrows = csv.reader(['a,b', 'c,d'])\nfirst = list(rows)\nsecond = list(rows)\n(len(first), len(second))", output: '(2, 0)' },
      fix:   { label: 'list() once', code: "import csv\nrows = list(csv.reader(['a,b', 'c,d']))\n(len(rows), len(rows))", output: '(2, 2)' },
    },
  ],

  when: {
    use: [
      'Row-by-row processing where columns are known by position',
      'Large files — the reader streams one row at a time',
      'Any delimiter: tabs, semicolons, pipes',
    ],
    avoid: [
      'Columns by name → csv.DictReader',
      'Typed columns and analysis → convert yourself, or pandas.read_csv',
      'Fixed-width text → slicing, not csv',
    ],
  },

  notes: {
    cpython:      'Modules/_csv.c — Reader_iternext feeds each character of each line to parse_process_char, a 9-state machine; errors come from there',
    'Line endings': '\\n, \\r and \\r\\n all end a row; inside quotes they are kept as data',
    'Field limit': 'A field longer than csv.field_size_limit() (131072 characters by default) raises csv.Error',
    'Attributes': 'reader.dialect (the settings in use) and reader.line_num (physical lines read)',
  },

  related: [
    { name: 'csv.DictReader', slug: 'dictreader', when: 'Rows as dicts keyed by the header' },
    { name: 'csv.writer',     slug: 'writer',     when: 'The reverse: rows → CSV text' },
    { name: 'Dialect',        slug: 'dialect',    when: 'Every setting the reader accepts' },
    { name: 'csv.Error',      slug: 'error',      when: 'What malformed input raises' },
    { name: 'csv module',     slug: 'csv',        when: 'Overview', category: 'stdlib' },
    { name: 'open()',         slug: 'open',       when: "newline='' and encoding", category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I skip the header row with csv.reader?',
      a: 'Call next(reader) once before the loop: header = next(rows). Or use csv.DictReader, which reads the header for you and uses it as the dict keys.',
    },
    {
      q: 'What does "new-line character seen in unquoted field" mean?',
      a: "The reader got a line with a line break (usually a lone \\r from an old Mac or a broken export) in the middle of an unquoted field. Open the file with newline='' so the file object splits lines on \\r too.",
    },
    {
      q: 'Why does csv.reader say "iterator should return strings, not bytes"?',
      a: "The file was opened in binary mode ('rb'). Open it in text mode with an encoding: open(path, newline='', encoding='utf-8'). For bytes you already have, wrap them: io.StringIO(data.decode('utf-8'), newline='').",
    },
    {
      q: 'Can csv.reader convert numbers for me?',
      a: 'Only with quoting=csv.QUOTE_NONNUMERIC (every unquoted field becomes a float, and non-numbers raise ValueError) or QUOTE_STRINGS. Otherwise convert the columns yourself with int() or float().',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/csv.html#csv.reader',
    meta:  'csv.reader',
  },

};
