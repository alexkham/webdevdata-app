// content/reference/python/stdlib/csv/index.js — the csv module hub

export const meta = {
  slug:        'index',
  name:        'csv',
  signature:   'import csv',
  blurb:       'Read and write comma-separated (and tab-, semicolon- or pipe-separated) files correctly — quoted commas, doubled quotes and line breaks inside fields included.',
  category:    'data',
  type:        'module',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'csv module python csv read csv file write csv file reader writer dictreader dictwriter comma separated values tsv tab separated semicolon delimiter quotechar quoting newline blank lines excel sniffer dialect parse csv split comma',
};

export const method = {
  slug: 'index',
  name: 'csv',

  category:    'Data formats',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  coverClasses: ['DictReader', 'DictWriter', 'Sniffer', 'Dialect'],

  subtitle: "reader and writer turn lines into lists of strings and back; DictReader and DictWriter do the same with dicts keyed by the header. Open every CSV file with newline='' — and never parse CSV with str.split(',').",

  imports: ['import csv', 'from csv import DictReader, DictWriter'],
  facts: [
    { label: 'Workhorses', value: 'reader, writer, DictReader, DictWriter' },
    { label: 'Formats',    value: 'Dialects bundle the settings: excel (the default), excel-tab, unix — or pass delimiter=, quotechar=, quoting= … directly' },
    { label: 'Values',     value: 'Every field is read as a str; the writer calls str() on everything except None, which becomes an empty field' },
    { label: 'Engine',     value: 'Parser and writer state machines in C (Modules/_csv.c); DictReader, DictWriter and Sniffer are Python (Lib/csv.py)' },
  ],

  modes: [
    {
      id: 'read',
      label: 'read',
      blurb: 'Type CSV text — write \\n where a new line starts — and pick the delimiter. Each row comes back as a list of strings.',
      params: [
        { name: 'text',      type: 'str', hint: 'CSV text, \\n = line break', input: 'text' },
        { name: 'delimiter', type: 'str', hint: 'one character',             input: 'text' },
      ],
      template: "import csv, io\ntext = {$text}.replace('\\\\n', '\\n')\nlist(csv.reader(io.StringIO(text, newline=''), delimiter={$delimiter}))",
      cases: [
        { id: 'basic',  label: 'header + rows',     values: { text: 'name,age\\nAda,36\\nBob,41', delimiter: ',' } },
        { id: 'comma',  label: 'quoted comma',      values: { text: 'name,city\\n"Smith, John","Paris, TX"', delimiter: ',' } },
        { id: 'quotes', label: 'doubled quotes',    values: { text: 'id,quote\\n1,"She said ""hi"""', delimiter: ',' } },
        { id: 'semi',   label: 'semicolons',        values: { text: 'name;price\\nTea;2,50', delimiter: ';' } },
        { id: 'nl',     label: 'line break in field', values: { text: 'id,note\\n1,"two\\nlines"\\n2,ok', delimiter: ',' } },
        { id: 'bad',    label: 'two-char delimiter', values: { text: 'a||b', delimiter: '||' } },
      ],
    },
    {
      id: 'split',
      label: 'split vs csv',
      blurb: 'One line, parsed two ways: str.split on commas, and csv.reader. They agree only while no field is quoted.',
      params: [{ name: 'line', type: 'str', hint: 'one CSV line', input: 'text' }],
      template: "import csv\n({$line}.split(','), next(csv.reader([{$line}])))",
      cases: [
        { id: 'plain',  label: 'plain',          values: { line: 'Ada,36,London' } },
        { id: 'comma',  label: 'quoted comma',   values: { line: '"Smith, John",42,"Paris, TX"' } },
        { id: 'quote',  label: 'quote in field', values: { line: '7,"12"" ruler",1.99' } },
        { id: 'empty',  label: 'empty fields',   values: { line: 'a,,"",b' } },
      ],
    },
    {
      id: 'write',
      label: 'write',
      blurb: 'Three values written as one row. Numbers are typed as numbers (36, 2.5); the writer quotes only what needs it.',
      params: [
        { name: 'a', type: 'str | int | float', hint: 'field 1', input: 'auto' },
        { name: 'b', type: 'str | int | float', hint: 'field 2', input: 'auto' },
        { name: 'c', type: 'str | int | float', hint: 'field 3', input: 'auto' },
      ],
      template: "import csv, io\nbuf = io.StringIO(newline='')\ncsv.writer(buf).writerow([{$a}, {$b}, {$c}])\nbuf.getvalue()",
      cases: [
        { id: 'plain', label: 'plain',          values: { a: 'Ada', b: '36', c: '2.5' } },
        { id: 'comma', label: 'comma inside',   values: { a: 'Smith, John', b: '42', c: 'ok' } },
        { id: 'quote', label: 'quote inside',   values: { a: 'say "hi"', b: '1', c: 'x' } },
        { id: 'empty', label: 'empty strings',  values: { a: '', b: '', c: '' } },
      ],
    },
  ],
  demoExplainer: 'The rows end in "\\r\\n": that is the excel dialect\'s line terminator on every platform, which is why files must be opened with newline=\'\' (otherwise Windows turns it into "\\r\\r\\n" and you get blank rows). A field containing the delimiter, the quote character or a line break is wrapped in quotes, and a quote inside is doubled. In "split vs csv", split cannot tell a quoted comma from a separator and keeps the quote characters; csv.reader removes them. A delimiter must be exactly one character — "||" raises TypeError.',

  patterns: [
    {
      name: 'Read a CSV file into dicts',
      desc: "The header row becomes the keys. newline='' keeps quoted line breaks intact; say the encoding.",
      code: "import csv\nwith open('people.csv', newline='', encoding='utf-8') as f:\n    rows = list(csv.DictReader(f))",
    },
    {
      name: 'Write a CSV file',
      desc: "newline='' stops Windows from turning the writer's \\r\\n into \\r\\r\\n (blank rows in Excel).",
      code: "import csv\nwith open('out.csv', 'w', newline='', encoding='utf-8') as f:\n    w = csv.writer(f)\n    w.writerow(['name', 'age'])\n    w.writerows(rows)",
    },
    {
      name: 'Tab- or semicolon-separated files',
      desc: 'Same reader, different delimiter (excel-tab is the registered tab dialect).',
      code: "import csv\nwith open('data.tsv', newline='', encoding='utf-8') as f:\n    for row in csv.reader(f, delimiter='\\t'):\n        print(row)",
    },
    {
      name: 'CSV for Excel with non-ASCII text',
      desc: 'utf-8-sig writes a BOM, which Excel uses to detect UTF-8.',
      code: "import csv\nwith open('excel.csv', 'w', newline='', encoding='utf-8-sig') as f:\n    csv.writer(f).writerows(rows)",
    },
  ],

  examples: [
    { title: 'Parse lines into lists',        code: "import csv\nlist(csv.reader(['name,age', 'Ada,36']))", returns: "[['name', 'age'], ['Ada', '36']]" },
    { title: 'Quoted commas stay in the field', code: "import csv\nnext(csv.reader(['\"Smith, John\",42']))", returns: "['Smith, John', '42']" },
    { title: 'Rows as dicts',                 code: "import csv, io\nf = io.StringIO('name,age\\nAda,36\\n', newline='')\nlist(csv.DictReader(f))", returns: "[{'name': 'Ada', 'age': '36'}]" },
    { title: 'Writing quotes what needs it',  code: "import csv, io\nbuf = io.StringIO(newline='')\ncsv.writer(buf).writerow(['a,b', 'say \"hi\"', 3])\nbuf.getvalue()", returns: '\'"a,b","say ""hi""",3\\r\\n\'' },
    { title: 'Everything read is a str',      code: "import csv\nrow = next(csv.reader(['1,2.5,True']))\n[type(v).__name__ for v in row]", returns: "['str', 'str', 'str']" },
    { title: 'Round trip through a real file', code: "import csv\nwith open('t.csv', 'w', newline='') as f:\n    csv.writer(f).writerows([['id', 'note'], [1, 'two\\nlines']])\nwith open('t.csv', newline='') as f:\n    rows = list(csv.reader(f))\nrows", returns: "[['id', 'note'], ['1', 'two\\nlines']]" },
    { title: 'The registered dialects',       code: 'import csv\nsorted(csv.list_dialects())', returns: "['excel', 'excel-tab', 'unix']" },
  ],

  pitfalls: [
    {
      name: 'Splitting lines on commas',
      desc: 'A comma inside a quoted field is data, not a separator. split breaks the field in two and keeps the quote characters.',
      wrong: { label: "line.split(',')", code: "line = '\"Smith, John\",42'\nline.split(',')", output: "['\"Smith', ' John\"', '42']" },
      fix:   { label: 'csv.reader',     code: "import csv\nline = '\"Smith, John\",42'\nnext(csv.reader([line]))", output: "['Smith, John', '42']" },
    },
    {
      name: "Blank rows on Windows: forgetting newline=''",
      desc: "The writer ends rows with \\r\\n itself. A text file opened without newline='' on Windows translates the \\n again, so each row ends in \\r\\r\\n and readers see an empty row after every line. Here newline='\\r\\n' reproduces the Windows translation on any OS.",
      wrong: { label: 'translated newlines', code: "import csv\nwith open('t.csv', 'w', newline='\\r\\n') as f:\n    csv.writer(f).writerows([['a', 'b'], ['c', 'd']])\nwith open('t.csv', newline='') as f:\n    rows = list(csv.reader(f))\nrows", output: "[['a', 'b'], [], ['c', 'd'], []]" },
      fix:   { label: "newline=''", code: "import csv\nwith open('t.csv', 'w', newline='') as f:\n    csv.writer(f).writerows([['a', 'b'], ['c', 'd']])\nwith open('t.csv', newline='') as f:\n    rows = list(csv.reader(f))\nrows", output: "[['a', 'b'], ['c', 'd']]" },
    },
    {
      name: 'Expecting numbers back',
      desc: 'CSV has no types: the reader returns strings, so "36" + 1 fails. Convert the columns you need.',
      wrong: { label: 'use as is', code: "import csv\nname, age = next(csv.reader(['Ada,36']))\nage + 1", output: 'TypeError: can only concatenate str (not "int") to str' },
      fix:   { label: 'int(...)', code: "import csv\nname, age = next(csv.reader(['Ada,36']))\nint(age) + 1", output: '37' },
    },
  ],

  when: {
    use: [
      'Spreadsheet exports and imports (Excel, Google Sheets, LibreOffice)',
      'Simple tabular data exchange between programs and databases',
      'Streaming large tables row by row without loading them whole',
    ],
    avoid: [
      'Nested or typed data → json',
      'Heavy analysis, joins, type inference → pandas.read_csv',
      'Reading .xlsx workbooks → a library such as openpyxl (csv cannot read them)',
    ],
  },

  notes: {
    cpython:        'Modules/_csv.c implements reader, writer, Dialect, Error and the registry; Lib/csv.py adds DictReader, DictWriter, Sniffer and the excel / excel_tab / unix_dialect classes',
    'Line endings': "Readers accept \\n, \\r\\n and \\r; the excel dialect writes \\r\\n (unix writes \\n). Open files with newline='' for both",
    'Encoding':     'csv works on str only — open files in text mode with an explicit encoding; utf-8-sig for files meant for Excel',
  },

  related: [
    { name: 'json module', slug: 'json', when: 'Nested data instead of flat tables', category: 'stdlib' },
    { name: 'open()',      slug: 'open', when: "Open CSV files with newline=''", category: 'functions' },
    { name: 'str.split',   slug: 'split', when: 'Fine for simple text — not for CSV', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I read a CSV file in Python?',
      a: "with open('file.csv', newline='', encoding='utf-8') as f: rows = list(csv.reader(f)) gives a list of lists of strings; csv.DictReader(f) gives one dict per row keyed by the header line.",
    },
    {
      q: 'Why does my CSV file have blank lines between rows?',
      a: "It was written on Windows without newline=''. The writer already ends rows with \\r\\n, and text mode translates the \\n into \\r\\n again, giving \\r\\r\\n. Open the file with open(path, 'w', newline='').",
    },
    {
      q: 'How do I read a tab-separated or semicolon-separated file?',
      a: "Pass the delimiter: csv.reader(f, delimiter='\\t') or delimiter=';'. For tabs there is also the registered dialect: csv.reader(f, dialect='excel-tab').",
    },
    {
      q: 'Why not just use line.split(",")?',
      a: 'CSV fields may be quoted so they can contain commas, quotes ("" inside a quoted field) and even line breaks. split knows none of that; csv.reader implements the quoting rules.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/csv.html',
    meta:  'csv — CSV File Reading and Writing',
  },

};
