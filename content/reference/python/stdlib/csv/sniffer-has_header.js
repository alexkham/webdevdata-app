// content/reference/python/stdlib/csv/sniffer-has_header.js

export const meta = {
  slug:        'sniffer-has_header',
  name:        'Sniffer.has_header',
  signature:   'Sniffer.has_header(sample)',
  blurb:       'Guess whether the first row of a CSV sample is a header, by comparing it with the types and lengths of the values below it.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'csv sniffer has_header detect header row python Sniffer.has_header does csv have header first row column names guess heuristic',
};

export const method = {
  slug:      'sniffer-has_header',
  name:      'Sniffer.has_header',
  signature: 'Sniffer.has_header(sample)',
  returns:   { type: 'bool', desc: 'True when the first row looks different from the rows below it.' },

  category:    'Sniffer method',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'A vote per column: if a column below the first row is all numbers, or all strings of one length, the first row gets +1 when it breaks that pattern and -1 when it fits. More plus than minus means "header".',

  covers: ['Sniffer.has_header'],

  cheat: {
    commonCall: 'csv.Sniffer().has_header(sample)',
    returns:    'True / False',
    replaces:   'asking whether the file has a header',
    watchOut:   'text-only columns of varying length do not vote at all',
  },

  parameters: [
    { name: 'sample', type: 'str', required: true, default: null, desc: 'The first lines of the file. It is sniffed for the dialect first (and raises csv.Error if that fails).' },
  ],

  modes: [
    {
      id: 'header',
      label: 'has_header',
      blurb: 'Sample text (\\n = line break) → the guess.',
      params: [{ name: 'text', type: 'str', hint: 'sample, \\n = line break', input: 'text' }],
      template: "import csv\ntext = {$text}.replace('\\\\n', '\\n')\ncsv.Sniffer().has_header(text)",
      cases: [
        { id: 'num',    label: 'numeric column',  values: { text: 'name,age\\nAda,36\\nBob,41' } },
        { id: 'nums',   label: 'all numbers',     values: { text: '1,2\\n3,4\\n5,6' } },
        { id: 'len',    label: 'same lengths',    values: { text: 'name,city\\nAda,London\\nBob,Paris' } },
        { id: 'short',  label: 'one-letter text', values: { text: 'a,b\\nc,d' } },
        { id: 'single', label: 'one row only',    values: { text: 'name,age' } },
        { id: 'one',    label: 'one column',      values: { text: 'x\\ny\\nz' } },
      ],
    },
  ],
  demoExplainer: 'In "numeric column" age is a number in every data row and "age" is not → +1, and Ada/Bob are both 3 characters long while "name" has 4 → +1. In "same lengths" city (London 6, Paris 5) varies and drops out, but the 3-letter names still vote +1. "a,b / c,d" scores -2: every value is one character, header included. With one row only, no column gets a type, and the code\'s attempt to call None counts as a vote for the header — so True. A sample without a detectable delimiter fails in sniff first.',

  patterns: [
    {
      name: 'Choose reader or DictReader',
      desc: 'Sniff the dialect and the header from one sample.',
      code: "import csv\nwith open('upload.csv', newline='', encoding='utf-8') as f:\n    sample = f.read(4096)\n    f.seek(0)\n    sniffer = csv.Sniffer()\n    dialect = sniffer.sniff(sample)\n    if sniffer.has_header(sample):\n        rows = list(csv.DictReader(f, dialect=dialect))\n    else:\n        rows = list(csv.reader(f, dialect))",
    },
    {
      name: 'Skip the header if there is one',
      desc: 'next() on the reader drops the first row.',
      code: "rows = csv.reader(f, dialect)\nif csv.Sniffer().has_header(sample):\n    next(rows)",
    },
  ],

  examples: [
    { title: 'Numbers under a text header', code: "import csv\ncsv.Sniffer().has_header('name,age\\nAda,36\\nBob,41\\n')", returns: 'True' },
    { title: 'All numeric rows',            code: "import csv\ncsv.Sniffer().has_header('1,2\\n3,4\\n5,6\\n')", returns: 'False' },
    { title: 'Text of equal length',        code: "import csv\ncsv.Sniffer().has_header('code,n\\nAB,1\\nCD,2\\n')", returns: 'True' },
    { title: 'Complex numbers count as numbers', code: "import csv\ncsv.Sniffer().has_header('a,b\\n1j,2\\n3+4j,5\\n')", returns: 'True' },
    { title: 'Fails when sniff fails',      code: "import csv\ncsv.Sniffer().has_header('x\\ny\\nz')", returns: '_csv.Error: Could not determine delimiter' },
  ],

  pitfalls: [
    {
      name: 'Text columns with varying lengths',
      desc: 'Columns whose values differ in length and are not numbers cast no vote. If every column is like that, the answer is False even with an obvious header.',
      wrong: { label: 'text only', code: "import csv\ncsv.Sniffer().has_header('first,last\\nAda,Lovelace\\nAlan,Turing\\n')", output: 'False' },
      fix:   { label: 'decide yourself', code: "import csv\nheader = next(csv.reader(['first,last']))\nheader == ['first', 'last']", output: 'True' },
    },
    {
      name: 'Numeric headers',
      desc: 'A header made of numbers (years, IDs) fits the numeric columns below it and is voted down.',
      wrong: { label: 'year columns', code: "import csv\ncsv.Sniffer().has_header('2023,2024\\n10,12\\n11,15\\n')", output: 'False' },
      fix:   { label: 'known layout', code: "import csv\nrows = list(csv.reader(['2023,2024', '10,12', '11,15']))\nheader, data = rows[0], rows[1:]\nheader", output: "['2023', '2024']" },
    },
  ],

  when: {
    use: ['Mixed numeric/text files of unknown origin'],
    avoid: [
      'Files you produce yourself — you know whether there is a header',
      'All-text or all-numeric data, where the heuristic has nothing to compare',
    ],
  },

  notes: {
    cpython:     'Lib/csv.py — reads the sample with the sniffed dialect, checks up to 21 rows after the first; per column the type is complex (if complex(value) parses) or len(value); columns with mixed types are dropped; rows with a different number of fields are skipped',
    'Vote':      'Each remaining column: +1 if the header value breaks the column type, -1 if it fits; has_header returns sum > 0',
  },

  related: [
    { name: 'csv.Sniffer',    slug: 'sniffer',    when: 'sniff() — the dialect half' },
    { name: 'csv.DictReader', slug: 'dictreader', when: 'Use the header as keys' },
    { name: 'csv module',     slug: 'csv',        when: 'Overview', category: 'stdlib' },
    { name: 'complex()',      slug: 'complex',    when: 'The number test it uses', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I check if a CSV file has a header in Python?',
      a: 'csv.Sniffer().has_header(sample) with the first few KB of the file. It is a heuristic: reliable when some columns are numeric or fixed-length, unreliable for all-text files.',
    },
    {
      q: 'Why does has_header return False for my file with a header?',
      a: 'No column gave it evidence: text columns with varying lengths are ignored, and numeric header names fit numeric columns. Decide from your knowledge of the file instead.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/csv.html#csv.Sniffer.has_header',
    meta:  'Sniffer.has_header',
  },

};
