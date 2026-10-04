// content/reference/python/stdlib/csv/writer.js

export const meta = {
  slug:        'writer',
  name:        'csv.writer',
  signature:   "csv.writer(csvfile, dialect='excel', **fmtparams)",
  blurb:       'Write rows (lists of values) as CSV lines — writerow for one row, writerows for many. Quotes and escapes are added only where needed.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: "csv writer write csv file python csv.writer writerow writerows newline='' blank lines windows \\r\\n lineterminator quoting escapechar need to escape but no escapechar set single empty field record must be quoted iterable expected",
};

export const method = {
  slug:      'writer',
  name:      'csv.writer',
  signature: "csv.writer(csvfile, dialect='excel', **fmtparams)",
  returns:   { type: '_csv.writer', desc: 'An object with writerow(row), writerows(rows) and a read-only dialect attribute.' },

  category:    'csv function',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: "writer(f).writerow(row) formats one row and calls f.write() with it. Every value goes through str(), None becomes an empty field — and the row ends in \\r\\n, which is why the file needs newline=''.",

  covers: ['writer'],

  cheat: {
    commonCall: "csv.writer(f).writerows(rows)",
    returns:    'writerow: what f.write returned (the number of characters for text files)',
    replaces:   "f.write(','.join(row) + '\\n'), which breaks on commas and quotes",
    watchOut:   "open(path, 'w', newline='') — or Windows adds blank rows",
  },

  parameters: [
    { name: 'csvfile',   type: 'object with write()', required: true,  default: null,      desc: "A file opened with newline='', io.StringIO, or anything with a write(str) method." },
    { name: 'dialect',   type: 'str | Dialect',       required: false, default: "'excel'", desc: "A registered name ('excel', 'excel-tab', 'unix') or a Dialect class/instance." },
    { name: 'fmtparams', type: 'keyword arguments',   required: false, default: null,      desc: 'Override single settings: delimiter, quotechar, escapechar, doublequote, quoting, lineterminator, skipinitialspace.' },
  ],

  modes: [
    {
      id: 'row',
      label: 'writerow',
      blurb: 'One row of three values. Numbers are typed as numbers (7, 2.5). The result shows what writerow returned and what was written.',
      params: [
        { name: 'a', type: 'str | int | float', hint: 'field 1', input: 'auto' },
        { name: 'b', type: 'str | int | float', hint: 'field 2', input: 'auto' },
        { name: 'c', type: 'str | int | float', hint: 'field 3', input: 'auto' },
      ],
      template: "import csv, io\nbuf = io.StringIO(newline='')\nw = csv.writer(buf)\nn = w.writerow([{$a}, {$b}, {$c}])\n(n, buf.getvalue())",
      cases: [
        { id: 'plain', label: 'plain',            values: { a: 'Ada', b: '36', c: '1.5' } },
        { id: 'comma', label: 'comma in a field', values: { a: 'Paris, TX', b: '2', c: 'x' } },
        { id: 'quote', label: 'quote in a field', values: { a: '12" ruler', b: '3', c: 'y' } },
        { id: 'empty', label: 'empty strings',    values: { a: '', b: '4', c: '' } },
      ],
    },
    {
      id: 'quoting',
      label: 'quoting',
      blurb: 'The same row — your two values, then None and an empty string — under quoting 0 to 5 (QUOTE_MINIMAL, ALL, NONNUMERIC, NONE, STRINGS, NOTNULL).',
      params: [
        { name: 'quoting', type: 'int', hint: '0 to 5', input: 'number' },
        { name: 'a', type: 'str | int | float', hint: 'field 1', input: 'auto' },
        { name: 'b', type: 'str | int | float', hint: 'field 2', input: 'auto' },
      ],
      template: "import csv, io\nbuf = io.StringIO(newline='')\ncsv.writer(buf, quoting={$quoting}).writerow([{$a}, {$b}, None, ''])\nbuf.getvalue()",
      cases: [
        { id: 'min',     label: 'MINIMAL (0)',    values: { quoting: '0', a: 'Ada', b: '36' } },
        { id: 'all',     label: 'ALL (1)',        values: { quoting: '1', a: 'Ada', b: '36' } },
        { id: 'nonnum',  label: 'NONNUMERIC (2)', values: { quoting: '2', a: 'Ada', b: '36' } },
        { id: 'strings', label: 'STRINGS (4)',    values: { quoting: '4', a: 'Ada', b: '36' } },
        { id: 'notnull', label: 'NOTNULL (5)',    values: { quoting: '5', a: 'Ada', b: '36' } },
        { id: 'bad',     label: 'quoting=7',      values: { quoting: '7', a: 'Ada', b: '36' } },
      ],
    },
    {
      id: 'escape',
      label: 'QUOTE_NONE',
      blurb: 'With quoting=csv.QUOTE_NONE nothing is quoted, so special characters need an escapechar. Leave escapechar empty for None.',
      params: [
        { name: 'a',          type: 'str', hint: 'field 1',               input: 'text' },
        { name: 'escapechar', type: 'str | None', hint: 'empty = None',   input: 'text-or-none' },
      ],
      template: "import csv, io\nbuf = io.StringIO(newline='')\ncsv.writer(buf, quoting=csv.QUOTE_NONE, escapechar={$escapechar}).writerow([{$a}, 'end'])\nbuf.getvalue()",
      cases: [
        { id: 'esc',   label: 'comma, escaped', values: { a: 'a,b', escapechar: '\\' } },
        { id: 'none',  label: 'no escapechar',  values: { a: 'a,b', escapechar: '' } },
        { id: 'plain', label: 'nothing special', values: { a: 'plain', escapechar: '' } },
        { id: 'quote', label: 'quote char',     values: { a: 'say "hi"', escapechar: '\\' } },
      ],
    },
  ],
  demoExplainer: 'writerow returns whatever the file\'s write() returned — for io.StringIO and text files that is the number of characters written, including the two of "\\r\\n". In the quoting tab, None is written as an empty field: QUOTE_ALL and QUOTE_NONNUMERIC quote it (""), QUOTE_STRINGS and QUOTE_NOTNULL leave it bare so it can be told apart from the quoted empty string; QUOTE_NONNUMERIC leaves the int 36 bare. A quoting value outside 0–5 is TypeError: bad "quoting" value. Under QUOTE_NONE the escapechar is put before every delimiter and quote character; without one the writer raises csv.Error.',

  patterns: [
    {
      name: 'Write a header and rows',
      desc: "newline='' on the open() is the one thing not to forget.",
      code: "import csv\nwith open('out.csv', 'w', newline='', encoding='utf-8') as f:\n    w = csv.writer(f)\n    w.writerow(['name', 'age'])\n    w.writerows([['Ada', 36], ['Bob', 41]])",
    },
    {
      name: 'CSV text in memory',
      desc: 'io.StringIO collects the output, e.g. for an HTTP response.',
      code: "import csv, io\nbuf = io.StringIO(newline='')\ncsv.writer(buf).writerows(rows)\ntext = buf.getvalue()",
    },
    {
      name: 'Unix line endings',
      desc: "lineterminator='\\n' (or dialect='unix', which also quotes everything).",
      code: "import csv\nwith open('out.csv', 'w', newline='', encoding='utf-8') as f:\n    csv.writer(f, lineterminator='\\n').writerows(rows)",
    },
  ],

  examples: [
    { title: 'writerows writes many rows',    code: "import csv, io\nbuf = io.StringIO(newline='')\ncsv.writer(buf).writerows([['a', 1], ['b', 2]])\nbuf.getvalue()", returns: "'a,1\\r\\nb,2\\r\\n'" },
    { title: 'Values go through str()',       code: "import csv, io\nbuf = io.StringIO(newline='')\ncsv.writer(buf).writerow([1.5, True, None, [1, 2]])\nbuf.getvalue()", returns: "'1.5,True,,\"[1, 2]\"\\r\\n'" },
    { title: 'A lone empty field is quoted',  code: "import csv, io\nbuf = io.StringIO(newline='')\ncsv.writer(buf).writerows([[''], ['', '']])\nbuf.getvalue()", returns: "'\"\"\\r\\n,\\r\\n'" },
    { title: 'Semicolons for European Excel', code: "import csv, io\nbuf = io.StringIO(newline='')\ncsv.writer(buf, delimiter=';').writerow(['Tea', '2,50'])\nbuf.getvalue()", returns: "'Tea;2,50\\r\\n'" },
    { title: 'Custom line terminator',        code: "import csv, io\nbuf = io.StringIO(newline='')\ncsv.writer(buf, lineterminator='\\n').writerows([['a'], ['b']])\nbuf.getvalue()", returns: "'a\\nb\\n'" },
    { title: 'writerows returns None',        code: "import csv, io\ncsv.writer(io.StringIO()).writerows([['a']]) is None", returns: 'True' },
    { title: 'A row must be iterable',        code: "import csv, io\ncsv.writer(io.StringIO()).writerow(42)", returns: '_csv.Error: iterable expected, not int' },
  ],

  pitfalls: [
    {
      name: 'Passing a string as the row',
      desc: 'writerow iterates its argument. A str is an iterable of characters, so every letter becomes its own field.',
      wrong: { label: "writerow('abc')", code: "import csv, io\nbuf = io.StringIO(newline='')\ncsv.writer(buf).writerow('abc')\nbuf.getvalue()", output: "'a,b,c\\r\\n'" },
      fix:   { label: "writerow(['abc'])", code: "import csv, io\nbuf = io.StringIO(newline='')\ncsv.writer(buf).writerow(['abc'])\nbuf.getvalue()", output: "'abc\\r\\n'" },
    },
    {
      name: "Blank rows: no newline='' when the OS translates \\n",
      desc: "On Windows a text file opened without newline='' writes every \\n as \\r\\n, so the writer's \\r\\n ends up as \\r\\r\\n. newline='\\r\\n' below reproduces that on any OS.",
      wrong: { label: 'translated', code: "import csv\nwith open('t.csv', 'w', newline='\\r\\n') as f:\n    csv.writer(f).writerow(['a', 'b'])\nwith open('t.csv', 'rb') as f:\n    raw = f.read()\nraw", output: "b'a,b\\r\\r\\n'" },
      fix:   { label: "newline=''", code: "import csv\nwith open('t.csv', 'w', newline='') as f:\n    csv.writer(f).writerow(['a', 'b'])\nwith open('t.csv', 'rb') as f:\n    raw = f.read()\nraw", output: "b'a,b\\r\\n'" },
    },
    {
      name: 'Joining with commas by hand',
      desc: "','.join does not quote anything, so a value with a comma silently becomes two columns.",
      wrong: { label: "','.join", code: "import csv\nline = ','.join(['Paris, TX', '2'])\nnext(csv.reader([line]))", output: "['Paris', ' TX', '2']" },
      fix:   { label: 'csv.writer', code: "import csv, io\nbuf = io.StringIO(newline='')\ncsv.writer(buf).writerow(['Paris, TX', '2'])\nnext(csv.reader([buf.getvalue()]))", output: "['Paris, TX', '2']" },
    },
  ],

  when: {
    use: [
      'Exporting lists/tuples of values to a spreadsheet-readable file',
      'Generating CSV text for downloads or APIs (with io.StringIO)',
    ],
    avoid: [
      'Rows that are dicts → csv.DictWriter',
      'Data with nesting → json',
    ],
  },

  notes: {
    cpython:       'Modules/_csv.c — csv_writerow joins the fields in a buffer (join_append_data decides quoting and escaping per character), adds lineterminator and makes ONE write() call per row',
    'Quoting rule': 'QUOTE_MINIMAL quotes a field containing the delimiter, quotechar, \\r, \\n or any character of lineterminator; a quotechar inside is doubled (doublequote=True)',
    'None':         'Written as an empty field; QUOTE_STRINGS / QUOTE_NOTNULL (3.12+) leave it unquoted so readers can map it back to None',
  },

  related: [
    { name: 'csv.DictWriter', slug: 'dictwriter', when: 'Write dicts in header order' },
    { name: 'csv.reader',     slug: 'reader',     when: 'Read the rows back' },
    { name: 'Quoting constants', slug: 'quoting', when: 'QUOTE_MINIMAL … QUOTE_NOTNULL' },
    { name: 'csv module',     slug: 'csv',        when: 'Overview', category: 'stdlib' },
    { name: 'open()',         slug: 'open',       when: "newline='' and encoding", category: 'functions' },
  ],

  faq: [
    {
      q: 'Why are there blank lines between rows in my CSV file?',
      a: "You opened the file without newline='' on Windows. The writer ends rows with \\r\\n; text mode turns the \\n into \\r\\n again. Use open(path, 'w', newline='', encoding='utf-8').",
    },
    {
      q: 'What is the difference between writerow and writerows?',
      a: 'writerow(row) writes one row (an iterable of values) and returns what write() returned. writerows(rows) calls writerow for every row of an iterable and returns None.',
    },
    {
      q: 'How do I quote every field?',
      a: 'csv.writer(f, quoting=csv.QUOTE_ALL). QUOTE_NONNUMERIC quotes everything except numbers, QUOTE_STRINGS (3.12+) only str values.',
    },
    {
      q: 'What does "need to escape, but no escapechar set" mean?',
      a: 'With quoting=csv.QUOTE_NONE a field contained the delimiter, the quote character or a line break, and there is no escapechar to protect it. Set escapechar (e.g. "\\\\"), or allow quoting.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/csv.html#csv.writer',
    meta:  'csv.writer',
  },

};
