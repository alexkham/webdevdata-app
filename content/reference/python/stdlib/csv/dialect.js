// content/reference/python/stdlib/csv/dialect.js

export const meta = {
  slug:        'dialect',
  name:        'csv.Dialect',
  signature:   'class csv.Dialect',
  blurb:       'The bundle of format settings — delimiter, quotechar, escapechar, doublequote, skipinitialspace, lineterminator, quoting — that readers and writers follow. Subclass it to name your own format.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'csv dialect class python csv.Dialect custom dialect subclass Dialect.delimiter Dialect.quotechar Dialect.escapechar Dialect.doublequote Dialect.skipinitialspace Dialect.lineterminator Dialect.quoting strict fmtparams format parameters bad delimiter value 1-character string',
};

export const method = {
  slug:      'dialect',
  name:      'csv.Dialect',
  signature: 'class csv.Dialect',
  returns:   { type: 'class', desc: 'Subclass it and set the class attributes; pass the class (or a name registered for it) as dialect=.' },

  category:    'csv class',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'Seven class attributes describe a CSV format. Every reader and writer validates them into an internal _csv.Dialect — single keyword arguments like delimiter=";" override one setting on top of the dialect.',

  covers: ['Dialect', 'Dialect.delimiter', 'Dialect.quotechar', 'Dialect.escapechar', 'Dialect.doublequote', 'Dialect.skipinitialspace', 'Dialect.lineterminator', 'Dialect.quoting'],

  cheat: {
    commonCall: "class Pipes(csv.excel):\n    delimiter = '|'",
    returns:    'a dialect class to pass as dialect=Pipes',
    replaces:   'repeating delimiter=…, quotechar=… on every call',
    watchOut:   'subclass csv.excel, not bare csv.Dialect, unless you set all seven attributes',
  },

  parameters: [
    { name: 'delimiter',        type: 'str (1 char)',  required: false, default: "','",    desc: 'Separates fields.' },
    { name: 'quotechar',        type: 'str (1 char) | None', required: false, default: "'\"'", desc: 'Wraps fields that contain special characters. None turns quoting off (QUOTE_NONE).' },
    { name: 'escapechar',       type: 'str (1 char) | None', required: false, default: 'None', desc: 'Removes the special meaning of the next character (needed with QUOTE_NONE, or doublequote=False).' },
    { name: 'doublequote',      type: 'bool',          required: false, default: 'True',   desc: 'A quotechar inside a field is written (and read) as two quotechars.' },
    { name: 'skipinitialspace', type: 'bool',          required: false, default: 'False',  desc: 'Ignore spaces right after a delimiter when reading.' },
    { name: 'lineterminator',   type: 'str',           required: false, default: "'\\r\\n'", desc: 'Ends rows written by the writer. The reader ignores it: it always accepts \\r, \\n and \\r\\n.' },
    { name: 'quoting',          type: 'int',           required: false, default: 'QUOTE_MINIMAL', desc: 'One of the six QUOTE_* constants.' },
    { name: 'strict',           type: 'bool',          required: false, default: 'False',  desc: 'Raise csv.Error on malformed input instead of guessing.' },
  ],

  modes: [
    {
      id: 'settings',
      label: 'settings',
      blurb: 'Pass delimiter and quotechar (empty = None) and read back the validated dialect the reader uses.',
      params: [
        { name: 'delimiter', type: 'str',        hint: 'one character',  input: 'text' },
        { name: 'quotechar', type: 'str | None', hint: 'empty = None',   input: 'text-or-none' },
      ],
      template: "import csv\nd = csv.reader([], delimiter={$delimiter}, quotechar={$quotechar}).dialect\n(d.delimiter, d.quotechar, d.escapechar, d.doublequote, d.skipinitialspace, d.quoting, d.lineterminator)",
      cases: [
        { id: 'default', label: 'excel values', values: { delimiter: ',', quotechar: '"' } },
        { id: 'semi',    label: 'semicolon',    values: { delimiter: ';', quotechar: "'" } },
        { id: 'noquote', label: 'quotechar=None', values: { delimiter: ',', quotechar: '' } },
        { id: 'clash',   label: 'same char',    values: { delimiter: ';', quotechar: ';' } },
        { id: 'long',    label: 'two chars',    values: { delimiter: '::', quotechar: '"' } },
        { id: 'space',   label: 'space delimiter', values: { delimiter: ' ', quotechar: '"' } },
      ],
    },
    {
      id: 'subclass',
      label: 'subclass',
      blurb: 'A dialect class based on csv.excel with your delimiter and skipinitialspace=True, used to read your text (\\n = line break).',
      params: [
        { name: 'delimiter', type: 'str', hint: 'one character',              input: 'text' },
        { name: 'text',      type: 'str', hint: 'CSV text, \\n = line break', input: 'text' },
      ],
      template: "import csv, io\nclass MyDialect(csv.excel):\n    delimiter = {$delimiter}\n    skipinitialspace = True\ntext = {$text}.replace('\\\\n', '\\n')\nlist(csv.reader(io.StringIO(text, newline=''), dialect=MyDialect))",
      cases: [
        { id: 'pipes', label: 'pipes',            values: { delimiter: '|', text: 'id | name\\n1 | "Ada | the first"' } },
        { id: 'semi',  label: 'semicolons',       values: { delimiter: ';', text: 'a; b;  c' } },
        { id: 'tab',   label: 'two-char delimiter', values: { delimiter: '||', text: 'a||b' } },
      ],
    },
  ],
  demoExplainer: 'The validation runs when the reader is created: a delimiter must be exactly one character (TypeError otherwise), and delimiter, quotechar and escapechar must differ ("bad delimiter or quotechar value", a ValueError). quotechar=None switches quoting to 3 (QUOTE_NONE) when quoting is not given. A space is a fine delimiter; a space as quotechar or escapechar is only rejected ("bad quotechar value") when skipinitialspace=True. In "subclass", skipinitialspace=True drops the spaces after each delimiter — but not the ones before it.',

  patterns: [
    {
      name: 'A named format for your project',
      desc: 'Subclass csv.excel and override what differs; register it if you want to refer to it by name.',
      code: "import csv\n\nclass Pipes(csv.excel):\n    delimiter = '|'\n\nwith open('data.psv', newline='', encoding='utf-8') as f:\n    rows = list(csv.reader(f, dialect=Pipes))",
    },
    {
      name: 'Backslash-escaped format',
      desc: 'No quoting at all, special characters escaped with a backslash.',
      code: "import csv\n\nclass Escaped(csv.excel):\n    quoting = csv.QUOTE_NONE\n    escapechar = '\\\\'\n\nw = csv.writer(f, dialect=Escaped)",
    },
    {
      name: 'Override one setting',
      desc: 'Keyword arguments win over the dialect.',
      code: "import csv\nreader = csv.reader(f, dialect='excel-tab', skipinitialspace=True)",
    },
  ],

  examples: [
    { title: 'The defaults (excel)',              code: "import csv\nd = csv.get_dialect('excel')\n(d.delimiter, d.quotechar, d.escapechar, d.doublequote, d.skipinitialspace, d.lineterminator, d.quoting, d.strict)", returns: "(',', '\"', None, True, False, '\\r\\n', 0, False)" },
    { title: 'Subclass excel, change one thing',  code: "import csv\nclass Semi(csv.excel):\n    delimiter = ';'\nnext(csv.reader(['a;\"b;c\"'], dialect=Semi))", returns: "['a', 'b;c']" },
    { title: 'Keyword arguments override',        code: "import csv\ncsv.reader([], dialect='excel-tab', delimiter='|').dialect.delimiter", returns: "'|'" },
    { title: 'doublequote=False escapes the quote', code: "import csv, io\nbuf = io.StringIO(newline='')\ncsv.writer(buf, doublequote=False, escapechar='\\\\').writerow(['say \"hi\"'])\nbuf.getvalue()", returns: '\'say \\\\"hi\\\\"\\r\\n\'' },
    { title: 'Registered dialects are _csv.Dialect', code: "import csv\nd = csv.get_dialect('excel')\n(type(d).__name__, isinstance(d, csv.Dialect))", returns: "('Dialect', False)" },
    { title: 'Settings are read-only',            code: "import csv\ncsv.get_dialect('excel').delimiter = ';'", returns: "AttributeError: attribute 'delimiter' of '_csv.Dialect' objects is not writable" },
  ],

  pitfalls: [
    {
      name: 'Subclassing bare csv.Dialect',
      desc: 'csv.Dialect sets every attribute to None as a placeholder. Leave one unset and validation fails — here quoting is still None.',
      wrong: { label: 'csv.Dialect', code: "import csv\nclass Semi(csv.Dialect):\n    delimiter = ';'\n    quotechar = '\"'\n    lineterminator = '\\r\\n'\nlist(csv.reader(['a;b'], dialect=Semi))", output: 'TypeError: "quoting" must be an integer' },
      fix:   { label: 'csv.excel', code: "import csv\nclass Semi(csv.excel):\n    delimiter = ';'\nlist(csv.reader(['a;b'], dialect=Semi))", output: "[['a', 'b']]" },
    },
    {
      name: 'Changing lineterminator to change what the reader accepts',
      desc: 'The reader ignores lineterminator — it always splits rows on \\r, \\n and \\r\\n. Only the writer uses it.',
      wrong: { label: "lineterminator=';'", code: "import csv, io\nlist(csv.reader(io.StringIO('a;b;c', newline=''), lineterminator=';'))", output: "[['a;b;c']]" },
      fix:   { label: 'split rows first', code: "import csv\nlist(csv.reader('a;b;c'.split(';')))", output: "[['a'], ['b'], ['c']]" },
    },
  ],

  when: {
    use: [
      'A format you read or write in several places',
      'Bundling several non-default settings under one name',
    ],
    avoid: [
      'A single change → pass delimiter=… directly',
      'Guessing the format of an unknown file → csv.Sniffer',
    ],
  },

  notes: {
    cpython:        "Two classes share the name: Lib/csv.py's csv.Dialect (the base class you subclass, all attributes None) and _csv.Dialect in Modules/_csv.c (dialect_new validates the attributes; reader.dialect, writer.dialect and get_dialect() return it)",
    'Validation':   'Wrong types raise TypeError ("delimiter" must be a 1-character string), conflicting characters ValueError (bad delimiter or quotechar value); instantiating a csv.Dialect subclass re-raises the TypeError as csv.Error',
    'strict':       'A setting of _csv.Dialect too (default False), though Lib/csv.py does not list it on csv.Dialect',
  },

  related: [
    { name: 'excel, excel_tab, unix_dialect', slug: 'excel', when: 'The built-in dialect classes' },
    { name: 'register_dialect',  slug: 'register_dialect', when: 'Give a dialect a name' },
    { name: 'Quoting constants', slug: 'quoting',          when: 'Values for quoting' },
    { name: 'csv.Sniffer',       slug: 'sniffer',          when: 'Detect a dialect from sample text' },
    { name: 'csv module',        slug: 'csv',              when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I create a custom CSV dialect in Python?',
      a: "Subclass csv.excel and override the attributes that differ (class Pipes(csv.excel): delimiter = '|'), then pass dialect=Pipes — or csv.register_dialect('pipes', Pipes) and pass dialect='pipes'.",
    },
    {
      q: 'What does "\\"delimiter\\" must be a 1-character string" mean?',
      a: "The delimiter (or quotechar/escapechar) is empty or longer than one character, e.g. '||' or '\\\\t' typed as two characters. csv supports single-character delimiters only.",
    },
    {
      q: 'Can the csv module use a multi-character delimiter?',
      a: "No. Either replace the separator with a single character first (line.replace('||', '|')) when it cannot occur in the data, or split the lines yourself.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/csv.html#dialects-and-formatting-parameters',
    meta:  'Dialects and Formatting Parameters',
  },

};
