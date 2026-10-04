// content/reference/python/stdlib/csv/sniffer.js

export const meta = {
  slug:        'sniffer',
  name:        'csv.Sniffer',
  signature:   'csv.Sniffer().sniff(sample, delimiters=None)',
  blurb:       'Guess the format of a CSV sample — delimiter, quote character, doubled quotes, spaces after delimiters — and get a Dialect class to read the file with.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'csv sniffer sniff detect delimiter auto detect csv format python csv.Sniffer Sniffer.sniff guess dialect delimiters could not determine delimiter preferred semicolon tab comma',
};

export const method = {
  slug:      'sniffer',
  name:      'csv.Sniffer',
  signature: 'csv.Sniffer().sniff(sample, delimiters=None)',
  returns:   { type: 'type[csv.Dialect]', desc: 'A new Dialect subclass (named "dialect") with delimiter, quotechar, doublequote and skipinitialspace guessed; \\r\\n and QUOTE_MINIMAL otherwise.' },

  category:    'csv class',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'Two heuristics from Lib/csv.py: first look for quoted fields and the character next to them; failing that, find the character that appears equally often on most lines. A guess, not a parser — restrict it with delimiters= when you can.',

  covers: ['Sniffer', 'Sniffer.sniff'],

  cheat: {
    commonCall: "dialect = csv.Sniffer().sniff(f.read(4096)); f.seek(0)",
    returns:    'a Dialect class → csv.reader(f, dialect)',
    replaces:   'asking the user which delimiter the file uses',
    watchOut:   'can guess a letter as the delimiter — pass delimiters=",;\\t|"',
  },

  parameters: [
    { name: 'sample',     type: 'str',        required: true,  default: null,   desc: 'The first few kilobytes of the file, as text.' },
    { name: 'delimiters', type: 'str | None', required: false, default: 'None', desc: 'Only these characters may be chosen as the delimiter.' },
  ],

  modes: [
    {
      id: 'sniff',
      label: 'sniff',
      blurb: 'Sample text (\\n = line break) → the guessed delimiter, quotechar, doublequote and skipinitialspace.',
      params: [{ name: 'text', type: 'str', hint: 'sample, \\n = line break', input: 'text' }],
      template: "import csv\ntext = {$text}.replace('\\\\n', '\\n')\nd = csv.Sniffer().sniff(text)\n(d.delimiter, d.quotechar, d.doublequote, d.skipinitialspace)",
      cases: [
        { id: 'semi',   label: 'semicolons',       values: { text: 'name;age\\nAda;36\\nBob;41' } },
        { id: 'space',  label: 'comma + space',    values: { text: 'a, b, c\\n1, 2, 3' } },
        { id: 'quoted', label: "single quotes",    values: { text: "'a';'b'\\n'1';'2'" } },
        { id: 'dq',     label: 'doubled quotes',   values: { text: '"say ""hi""",2\\n"x",3' } },
        { id: 'two',    label: 'two candidates',   values: { text: 'a:b,c\\nd:e,f' } },
        { id: 'one',    label: 'one column',       values: { text: 'single\\nvalue' } },
      ],
    },
    {
      id: 'delimiters',
      label: 'delimiters=',
      blurb: 'The same guess restricted to the characters you allow.',
      params: [
        { name: 'text',       type: 'str', hint: 'sample, \\n = line break', input: 'text' },
        { name: 'delimiters', type: 'str', hint: 'allowed characters',       input: 'text' },
      ],
      template: "import csv\ntext = {$text}.replace('\\\\n', '\\n')\ncsv.Sniffer().sniff(text, delimiters={$delimiters}).delimiter",
      cases: [
        { id: 'one',   label: 'one column',     values: { text: 'single\\nvalue', delimiters: ',;\t|' } },
        { id: 'pipe',  label: 'pipes allowed',  values: { text: 'id|name\\n1|Ada\\n2|Bob', delimiters: ',;|' } },
        { id: 'nopipe', label: 'pipes not allowed', values: { text: 'id|name\\n1|Ada\\n2|Bob', delimiters: ',;' } },
      ],
    },
  ],
  demoExplainer: '"single\\nvalue" has no delimiter at all, yet sniff answers "l": the letter l appears exactly once on both lines, which is all the frequency heuristic checks. With delimiters= it correctly gives up: csv.Error: Could not determine delimiter. In "two candidates" both : and , occur once per line; ties are broken by the preferred order , then tab, ; space :. In "comma + space" every comma is followed by a space, so skipinitialspace is True. doublequote is only True when a quoted field with a doubled quote is found.',

  patterns: [
    {
      name: 'Open a CSV file of unknown format',
      desc: 'Sniff a sample, rewind, read with the result. Restrict the candidates.',
      code: "import csv\nwith open('upload.csv', newline='', encoding='utf-8') as f:\n    dialect = csv.Sniffer().sniff(f.read(4096), delimiters=',;\\t|')\n    f.seek(0)\n    rows = list(csv.reader(f, dialect))",
    },
    {
      name: 'Fall back when sniffing fails',
      desc: 'sniff raises csv.Error when no candidate is consistent.',
      code: "import csv\ntry:\n    dialect = csv.Sniffer().sniff(sample, delimiters=',;\\t')\nexcept csv.Error:\n    dialect = csv.excel",
    },
    {
      name: 'Header too',
      desc: 'has_header uses the same sample.',
      code: "import csv\nsniffer = csv.Sniffer()\ndialect = sniffer.sniff(sample)\nheader = sniffer.has_header(sample)",
    },
  ],

  examples: [
    { title: 'Detect semicolons',         code: "import csv\ncsv.Sniffer().sniff('name;age\\nAda;36\\n').delimiter", returns: "';'" },
    { title: 'Use the result',            code: "import csv\nd = csv.Sniffer().sniff('a;b\\n1;2\\n')\nlist(csv.reader(['x;\"y;z\"'], d))", returns: "[['x', 'y;z']]" },
    { title: 'It returns a class',        code: "import csv\nd = csv.Sniffer().sniff('a;b\\n1;2\\n')\n(d.__name__, issubclass(d, csv.Dialect), d.lineterminator)", returns: "('dialect', True, '\\r\\n')" },
    { title: 'Tabs',                      code: "import csv\ncsv.Sniffer().sniff('a\\tb\\n1\\t2\\n').delimiter", returns: "'\\t'" },
    { title: 'The preferred order',       code: 'import csv\ncsv.Sniffer().preferred', returns: "[',', '\\t', ';', ' ', ':']" },
    { title: 'Nothing consistent',        code: "import csv\ncsv.Sniffer().sniff('x\\ny\\nz')", returns: '_csv.Error: Could not determine delimiter' },
  ],

  pitfalls: [
    {
      name: 'Trusting the guess on odd samples',
      desc: 'Any character that occurs equally often on every line can win — even a letter.',
      wrong: { label: 'unrestricted', code: "import csv\ncsv.Sniffer().sniff('hello\\nworld').delimiter", output: "'o'" },
      fix:   { label: 'delimiters=', code: "import csv\ntry:\n    d = csv.Sniffer().sniff('hello\\nworld', delimiters=',;\\t').delimiter\nexcept csv.Error as e:\n    d = str(e)\nd", output: "'Could not determine delimiter'" },
    },
    {
      name: 'Reading after sniffing without seek(0)',
      desc: 'f.read(n) moved the file position; the reader starts after the sample.',
      wrong: { label: 'no seek', code: "import csv\nwith open('d.csv', 'w', newline='') as f:\n    f.write('a;b\\r\\n1;2\\r\\n')\nwith open('d.csv', newline='') as f:\n    d = csv.Sniffer().sniff(f.read(1024))\n    rows = list(csv.reader(f, d))\nrows", output: '[]' },
      fix:   { label: 'f.seek(0)', code: "import csv\nwith open('d.csv', 'w', newline='') as f:\n    f.write('a;b\\r\\n1;2\\r\\n')\nwith open('d.csv', newline='') as f:\n    d = csv.Sniffer().sniff(f.read(1024))\n    f.seek(0)\n    rows = list(csv.reader(f, d))\nrows", output: "[['a', 'b'], ['1', '2']]" },
    },
  ],

  when: {
    use: [
      'User uploads in unknown formats (comma vs semicolon vs tab)',
      'Quick scripts over files from many sources',
    ],
    avoid: [
      'Files whose format you know — just pass the delimiter',
      'Single-column files: there is no delimiter to find',
    ],
  },

  notes: {
    cpython:       'Lib/csv.py — sniff() tries _guess_quote_and_delimiter (four regexes looking for quote-delimited text), then _guess_delimiter (per-line character frequency over the 127 ASCII characters, in chunks of 10 lines, accepting a mode that holds on at least 90% of lines)',
    'Result':      'A new class "dialect" (a csv.Dialect subclass, _name = "sniffed") — not an instance and not registered',
    'Sample size': 'More lines make the frequency heuristic more reliable; a partial last line can mislead it',
  },

  related: [
    { name: 'Sniffer.has_header', slug: 'sniffer-has_header', when: 'Guess whether the first row is a header' },
    { name: 'csv.Dialect',        slug: 'dialect',            when: 'What the result contains' },
    { name: 'csv.reader',         slug: 'reader',             when: 'Read with the sniffed dialect' },
    { name: 'csv.Error',          slug: 'error',              when: 'Could not determine delimiter' },
    { name: 'csv module',         slug: 'csv',                when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I detect the delimiter of a CSV file in Python?',
      a: "csv.Sniffer().sniff(sample).delimiter, where sample is the first few KB of the file. Pass delimiters=',;\\t|' to limit the candidates, and seek(0) before reading the file.",
    },
    {
      q: 'What does "Could not determine delimiter" mean?',
      a: 'No character (among the allowed delimiters) occurs consistently across the sample lines, and there were no quoted fields to infer it from. Typical for single-column files or samples with ragged rows.',
    },
    {
      q: 'Is csv.Sniffer reliable?',
      a: 'It is a heuristic. It works well on regular files with several columns, but can pick a letter or a character from the data on small or irregular samples. Restrict it with delimiters= and fall back to a default on csv.Error.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/csv.html#csv.Sniffer',
    meta:  'csv.Sniffer',
  },

};
