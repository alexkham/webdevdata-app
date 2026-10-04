// content/reference/python/stdlib/csv/excel.js

export const meta = {
  slug:        'excel',
  name:        'csv.excel',
  signature:   'class csv.excel · class csv.excel_tab · class csv.unix_dialect',
  blurb:       "The three built-in dialects: excel (comma, \\r\\n, minimal quoting — the default), excel_tab (tabs) and unix_dialect (\\n line ends, every field quoted). Registered as 'excel', 'excel-tab' and 'unix'.",
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 2.3+ (unix_dialect: 3.2+)',
  searchTerms: "csv excel dialect excel_tab excel-tab unix_dialect unix dialect tsv tab separated values default dialect \\r\\n line endings quote all python csv.excel csv.excel_tab csv.unix_dialect",
};

export const method = {
  slug:      'excel',
  name:      'csv.excel',
  signature: 'class csv.excel · class csv.excel_tab · class csv.unix_dialect',
  returns:   { type: 'class', desc: 'Dialect classes (subclasses of csv.Dialect). Pass the class, or its registered name, as dialect=.' },

  category:    'csv classes',
  version:     'Python 2.3+ (unix_dialect: 3.2+)',
  hasLiveDemo: true,

  subtitle: "Readers and writers use excel unless told otherwise. excel_tab only changes the delimiter to a tab; unix_dialect ends lines with \\n and quotes every field. Class names use underscores, registry names use hyphens: excel_tab is 'excel-tab', unix_dialect is 'unix'.",

  covers: ['excel', 'excel_tab', 'unix_dialect'],

  cheat: {
    commonCall: "csv.writer(f, dialect='unix')",
    returns:    "excel: 'a,b\\r\\n' · excel-tab: 'a\\tb\\r\\n' · unix: '\"a\",\"b\"\\n'",
    replaces:   'spelling out delimiter=, lineterminator=, quoting=',
    watchOut:   "the name is 'excel-tab' with a hyphen, the class excel_tab",
  },

  parameters: [],

  modes: [
    {
      id: 'write',
      label: 'write',
      blurb: "The same two rows written with a dialect name: 'excel', 'excel-tab', 'unix' (or anything else).",
      params: [{ name: 'name', type: 'str', hint: 'a dialect name', input: 'text' }],
      template: "import csv, io\nbuf = io.StringIO(newline='')\nw = csv.writer(buf, dialect={$name})\nw.writerows([['id', 'note'], [1, 'say \"hi\"']])\nbuf.getvalue()",
      cases: [
        { id: 'excel', label: 'excel',     values: { name: 'excel' } },
        { id: 'tab',   label: 'excel-tab', values: { name: 'excel-tab' } },
        { id: 'unix',  label: 'unix',      values: { name: 'unix' } },
        { id: 'under', label: 'excel_tab', values: { name: 'excel_tab' } },
      ],
    },
    {
      id: 'read',
      label: 'read',
      blurb: 'Read text (\\n = line break) with a dialect name. Readers accept any line ending, whatever the dialect says.',
      params: [
        { name: 'text', type: 'str', hint: 'CSV text, \\n = line break', input: 'text' },
        { name: 'name', type: 'str', hint: 'a dialect name',            input: 'text' },
      ],
      template: "import csv, io\ntext = {$text}.replace('\\\\n', '\\n')\nlist(csv.reader(io.StringIO(text, newline=''), dialect={$name}))",
      cases: [
        { id: 'excel', label: 'commas',      values: { text: 'id,note\\n1,"a, b"', name: 'excel' } },
        { id: 'tab',   label: 'commas as excel-tab', values: { text: 'id,note\\n1,"a, b"', name: 'excel-tab' } },
        { id: 'unix',  label: 'unix',        values: { text: '"id","note"\\n"1","x"', name: 'unix' } },
      ],
    },
  ],
  demoExplainer: "unix quotes every field, including the number 1, and ends lines with \\n; excel and excel-tab end them with \\r\\n. The class name excel_tab is not a registered name, so dialect='excel_tab' raises csv.Error: unknown dialect — pass the class itself (dialect=csv.excel_tab) or the hyphenated name. Reading comma text as excel-tab gives one field per line, quotes included, because the quote does not start the field.",

  patterns: [
    {
      name: 'Read a tab-separated file',
      desc: "dialect='excel-tab' is the same as delimiter='\\t'.",
      code: "import csv\nwith open('data.tsv', newline='', encoding='utf-8') as f:\n    rows = list(csv.reader(f, dialect='excel-tab'))",
    },
    {
      name: 'Unix-style output',
      desc: '\\n line endings and every field quoted.',
      code: "import csv\nwith open('out.csv', 'w', newline='', encoding='utf-8') as f:\n    csv.writer(f, dialect='unix').writerows(rows)",
    },
    {
      name: 'Base your own dialect on excel',
      desc: 'Inherit the sensible defaults and override one attribute.',
      code: "import csv\n\nclass SemicolonExcel(csv.excel):\n    delimiter = ';'",
    },
  ],

  examples: [
    { title: 'excel settings',         code: "import csv\n(csv.excel.delimiter, csv.excel.quotechar, csv.excel.lineterminator, csv.excel.quoting)", returns: "(',', '\"', '\\r\\n', 0)" },
    { title: 'excel_tab only changes the delimiter', code: "import csv\n(csv.excel_tab.delimiter, csv.excel_tab.__bases__[0].__name__)", returns: "('\\t', 'excel')" },
    { title: 'unix_dialect',           code: "import csv\n(csv.unix_dialect.lineterminator, csv.unix_dialect.quoting == csv.QUOTE_ALL)", returns: "('\\n', True)" },
    { title: 'Pass the class directly', code: "import csv, io\nbuf = io.StringIO(newline='')\ncsv.writer(buf, dialect=csv.excel_tab).writerow(['a', 'b'])\nbuf.getvalue()", returns: "'a\\tb\\r\\n'" },
    { title: 'Registered names',       code: 'import csv\ncsv.list_dialects()', returns: "['excel', 'excel-tab', 'unix']" },
    { title: 'They are csv.Dialect subclasses', code: 'import csv\n[issubclass(c, csv.Dialect) for c in (csv.excel, csv.excel_tab, csv.unix_dialect)]', returns: '[True, True, True]' },
  ],

  pitfalls: [
    {
      name: 'Using the class name as a string',
      desc: "The registry knows 'excel-tab' and 'unix', not the Python class names.",
      wrong: { label: "dialect='unix_dialect'", code: "import csv, io\ncsv.writer(io.StringIO(), dialect='unix_dialect')", output: '_csv.Error: unknown dialect' },
      fix:   { label: "dialect='unix'", code: "import csv, io\nbuf = io.StringIO(newline='')\ncsv.writer(buf, dialect='unix').writerow(['a', 1])\nbuf.getvalue()", output: '\'"a","1"\\n\'' },
    },
    {
      name: 'Expecting excel to mean semicolons',
      desc: 'Excel in many European locales saves CSV with semicolons, but the excel dialect is always comma-separated. Pass the delimiter.',
      wrong: { label: "dialect='excel'", code: "import csv\nnext(csv.reader(['Name;Price', 'Tea;2,50'], dialect='excel'))", output: "['Name;Price']" },
      fix:   { label: "delimiter=';'", code: "import csv\nnext(csv.reader(['Name;Price', 'Tea;2,50'], delimiter=';'))", output: "['Name', 'Price']" },
    },
  ],

  when: {
    use: [
      'excel: the default — files for and from spreadsheets',
      'excel-tab: TSV files',
      'unix: tools expecting \\n line endings and quoted fields',
    ],
    avoid: [
      'Semicolon CSV from European Excel → delimiter=";" (or your own dialect)',
    ],
  },

  notes: {
    cpython:      "Lib/csv.py — class excel(Dialect), class excel_tab(excel), class unix_dialect(Dialect); each is registered at import: register_dialect('excel', excel), ('excel-tab', excel_tab), ('unix', unix_dialect)",
    'escapechar': 'None in all three (inherited from csv.Dialect)',
    'Version':    'unix_dialect was added in Python 3.2',
  },

  related: [
    { name: 'csv.Dialect',      slug: 'dialect',          when: 'What each attribute means' },
    { name: 'register_dialect', slug: 'register_dialect', when: 'The registry behind the names' },
    { name: 'csv.writer',       slug: 'writer',           when: 'Pass dialect= here' },
    { name: 'csv module',       slug: 'csv',              when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What is the default dialect of the Python csv module?',
      a: "excel: comma delimiter, double-quote quotechar, doubled quotes inside fields, minimal quoting and \\r\\n line endings.",
    },
    {
      q: 'How do I read a TSV file with the csv module?',
      a: "csv.reader(f, dialect='excel-tab') or csv.reader(f, delimiter='\\t') — they are equivalent. Open the file with newline=''.",
    },
    {
      q: "What is the difference between the excel and unix dialects?",
      a: 'unix ends rows with \\n instead of \\r\\n and quotes every field (QUOTE_ALL); excel quotes only fields that need it.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/csv.html#csv.excel',
    meta:  'csv.excel, csv.excel_tab, csv.unix_dialect',
  },

};
