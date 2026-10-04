// content/reference/python/stdlib/csv/dictwriter-writeheader.js

export const meta = {
  slug:        'dictwriter-writeheader',
  name:        'DictWriter.writeheader',
  signature:   'DictWriter.writeheader()',
  blurb:       'Write the field names as the first row of the file — DictWriter never does it on its own.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 2.7+ (returns the write() result since 3.8)',
  searchTerms: 'csv dictwriter writeheader write header row column names python DictWriter.writeheader csv header missing first row fieldnames',
};

export const method = {
  slug:      'dictwriter-writeheader',
  name:      'DictWriter.writeheader',
  signature: 'DictWriter.writeheader()',
  returns:   { type: 'int | None', desc: "Whatever the file's write() returned — the number of characters for text files." },

  category:    'DictWriter method',
  version:     'Python 2.7+ (returns the write() result since 3.8)',
  hasLiveDemo: true,

  subtitle: 'One call, one row: the fieldnames, formatted with the same dialect as the data. Call it once, before the first writerow.',

  covers: ['DictWriter.writeheader'],

  cheat: {
    commonCall: 'w.writeheader()',
    returns:    "the write() result, e.g. 10 for 'name,age\\r\\n'",
    replaces:   'w.writer.writerow(fieldnames)',
    watchOut:   'not automatic — and calling it twice writes the header twice',
  },

  parameters: [],

  modes: [
    {
      id: 'header',
      label: 'writeheader',
      blurb: 'Comma-separated field names → the header line and what writeheader returned.',
      params: [{ name: 'fieldnames', type: 'list[str]', hint: 'column names', input: 'csv' }],
      template: "import csv, io\nbuf = io.StringIO(newline='')\nn = csv.DictWriter(buf, fieldnames={$fieldnames}).writeheader()\n(n, buf.getvalue())",
      cases: [
        { id: 'basic', label: 'two columns',     values: { fieldnames: 'name, age' } },
        { id: 'one',   label: 'one column',      values: { fieldnames: 'id' } },
        { id: 'empty', label: 'no columns',      values: { fieldnames: '' } },
      ],
    },
    {
      id: 'quoted',
      label: 'quoting',
      blurb: 'The header is an ordinary row: names with commas or quotes are quoted, and quoting= applies to it too (0 to 5).',
      params: [
        { name: 'name',    type: 'str', hint: 'one column name', input: 'text' },
        { name: 'quoting', type: 'int', hint: '0 to 5',          input: 'number' },
      ],
      template: "import csv, io\nbuf = io.StringIO(newline='')\ncsv.DictWriter(buf, ['id', {$name}], quoting={$quoting}).writeheader()\nbuf.getvalue()",
      cases: [
        { id: 'comma', label: 'comma in name', values: { name: 'price, EUR', quoting: '0' } },
        { id: 'all',   label: 'QUOTE_ALL',     values: { name: 'name', quoting: '1' } },
        { id: 'none',  label: 'QUOTE_NONE',    values: { name: 'price, EUR', quoting: '3' } },
      ],
    },
  ],
  demoExplainer: 'With fieldnames=[] the header is a row with no fields, which is written as a bare "\\r\\n" (2 characters). writeheader builds dict(zip(fieldnames, fieldnames)) and passes it to writerow, so it follows every dialect rule — under QUOTE_NONE a name containing a comma has nothing to protect it and csv.Error is raised.',

  patterns: [
    {
      name: 'Header, then rows',
      desc: 'The usual three lines.',
      code: "import csv\nwith open('out.csv', 'w', newline='', encoding='utf-8') as f:\n    w = csv.DictWriter(f, fieldnames=['name', 'age'])\n    w.writeheader()\n    w.writerows(rows)",
    },
    {
      name: 'Append without repeating the header',
      desc: 'Only write it when the file is new or empty.',
      code: "import csv, os\nnew = not os.path.exists('log.csv') or os.path.getsize('log.csv') == 0\nwith open('log.csv', 'a', newline='', encoding='utf-8') as f:\n    w = csv.DictWriter(f, fieldnames=['time', 'event'])\n    if new:\n        w.writeheader()\n    w.writerow(entry)",
    },
    {
      name: 'Human-friendly header labels',
      desc: 'writeheader always writes the keys; for other labels write the row yourself.',
      code: "w = csv.DictWriter(f, fieldnames=['name', 'age'])\nw.writer.writerow(['Full name', 'Age (years)'])\nw.writerows(rows)",
    },
  ],

  examples: [
    { title: 'Writes the field names',     code: "import csv, io\nbuf = io.StringIO(newline='')\ncsv.DictWriter(buf, ['name', 'age']).writeheader()\nbuf.getvalue()", returns: "'name,age\\r\\n'" },
    { title: 'Returns the write() result', code: "import csv, io\ncsv.DictWriter(io.StringIO(), ['name', 'age']).writeheader()", returns: '10' },
    { title: 'Uses the dialect',           code: "import csv, io\nbuf = io.StringIO(newline='')\ncsv.DictWriter(buf, ['a', 'b'], dialect='excel-tab').writeheader()\nbuf.getvalue()", returns: "'a\\tb\\r\\n'" },
    { title: 'Same as writing the keys as a row', code: "import csv, io\na, b = io.StringIO(newline=''), io.StringIO(newline='')\ncsv.DictWriter(a, ['x', 'y']).writeheader()\ncsv.writer(b).writerow(['x', 'y'])\na.getvalue() == b.getvalue()", returns: 'True' },
    { title: 'Read it back as fieldnames', code: "import csv, io\nbuf = io.StringIO(newline='')\nw = csv.DictWriter(buf, ['name', 'age'])\nw.writeheader()\nw.writerow({'name': 'Ada', 'age': 36})\nbuf.seek(0)\ncsv.DictReader(buf).fieldnames", returns: "['name', 'age']" },
  ],

  pitfalls: [
    {
      name: 'Calling writeheader inside the loop',
      desc: 'Every call writes another header row.',
      wrong: { label: 'per row', code: "import csv, io\nbuf = io.StringIO(newline='')\nw = csv.DictWriter(buf, ['n'])\nfor n in (1, 2):\n    w.writeheader()\n    w.writerow({'n': n})\nbuf.getvalue()", output: "'n\\r\\n1\\r\\nn\\r\\n2\\r\\n'" },
      fix:   { label: 'once', code: "import csv, io\nbuf = io.StringIO(newline='')\nw = csv.DictWriter(buf, ['n'])\nw.writeheader()\nfor n in (1, 2):\n    w.writerow({'n': n})\nbuf.getvalue()", output: "'n\\r\\n1\\r\\n2\\r\\n'" },
    },
    {
      name: 'A generator as fieldnames',
      desc: 'DictWriter turns an iterator into a list, so this works — but the generator is used up by the time you try to reuse it elsewhere.',
      wrong: { label: 'reuse the generator', code: "import csv, io\nnames = (c for c in ['a', 'b'])\ncsv.DictWriter(io.StringIO(), names).writeheader()\nlist(names)", output: '[]' },
      fix:   { label: 'use a list', code: "import csv, io\nnames = ['a', 'b']\ncsv.DictWriter(io.StringIO(), names).writeheader()\nlist(names)", output: "['a', 'b']" },
    },
  ],

  when: {
    use: ['Once, right after creating a DictWriter for a new file'],
    avoid: [
      'Appending to a file that already has a header',
      'Custom header labels → w.writer.writerow([...])',
    ],
  },

  notes: {
    cpython:      'Lib/csv.py — header = dict(zip(self.fieldnames, self.fieldnames)); return self.writerow(header)',
    'Return value': 'Returns the writerow result since Python 3.8; None before',
  },

  related: [
    { name: 'csv.DictWriter', slug: 'dictwriter', when: 'The class and its writerow / writerows' },
    { name: 'csv.DictReader', slug: 'dictreader', when: 'Reads the header back as fieldnames' },
    { name: 'csv module',     slug: 'csv',        when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I write the header row with csv.DictWriter?',
      a: 'Call writer.writeheader() once after creating the DictWriter and before writing rows. It writes the fieldnames as the first row.',
    },
    {
      q: 'Why does my CSV file have the header repeated?',
      a: 'writeheader() was called more than once — typically inside the loop, or each time a script appends to the same file. Write it only when the file is new.',
    },
    {
      q: 'Can I use different labels in the header than the dict keys?',
      a: 'Not with writeheader. Write the labels with w.writer.writerow([...]) instead, then the rows with w.writerows(...).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/csv.html#csv.DictWriter.writeheader',
    meta:  'DictWriter.writeheader',
  },

};
