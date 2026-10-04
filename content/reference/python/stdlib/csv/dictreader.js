// content/reference/python/stdlib/csv/dictreader.js

export const meta = {
  slug:        'dictreader',
  name:        'csv.DictReader',
  signature:   "csv.DictReader(f, fieldnames=None, restkey=None, restval=None, dialect='excel', *args, **kwds)",
  blurb:       'Read a CSV file as one dict per row, keyed by the header line (or by fieldnames you supply). Extra fields go under restkey, missing ones get restval.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 2.3+ (plain dict rows since 3.8)',
  searchTerms: 'csv dictreader read csv into dict python csv.DictReader fieldnames DictReader.fieldnames header row keys restkey restval None key extra fields missing fields list of dicts column names bom ufeff utf-8-sig',
};

export const method = {
  slug:      'dictreader',
  name:      'csv.DictReader',
  signature: "csv.DictReader(f, fieldnames=None, restkey=None, restval=None, dialect='excel', *args, **kwds)",
  returns:   { type: 'DictReader', desc: 'An iterator of dicts, one per non-blank row. .fieldnames holds the keys; .line_num and .reader are also available.' },

  category:    'csv class',
  version:     'Python 2.3+ (plain dict rows since 3.8)',
  hasLiveDemo: true,

  subtitle: 'The first row becomes the keys, every later row a dict. Blank lines are skipped, a short row is padded with restval, and a long row puts its extra values in a list under the key None.',

  covers: ['DictReader', 'DictReader.fieldnames'],

  cheat: {
    commonCall: "for row in csv.DictReader(f): row['name']",
    returns:    "{'name': 'Ada', 'age': '36'} per row",
    replaces:   'dict(zip(header, row)) for every row by hand',
    watchOut:   'values are still strings; extra fields land under the key None',
  },

  parameters: [
    { name: 'f',          type: 'iterable of str', required: true,  default: null,      desc: "A file opened with newline='' (or any iterable of lines)." },
    { name: 'fieldnames', type: 'sequence of str', required: false, default: 'None',    desc: 'The keys. None reads them from the first row; given, the first row is treated as data.' },
    { name: 'restkey',    type: 'hashable',        required: false, default: 'None',    desc: 'Key for the list of values beyond the last field name.' },
    { name: 'restval',    type: 'any',             required: false, default: 'None',    desc: 'Value for field names that a short row has no value for.' },
    { name: 'dialect',    type: 'str | Dialect',   required: false, default: "'excel'", desc: 'Passed to csv.reader together with any other keyword arguments (delimiter=…).' },
  ],

  modes: [
    {
      id: 'rows',
      label: 'rows',
      blurb: 'CSV text with a header line (\\n = line break) → a list of dicts.',
      params: [{ name: 'text', type: 'str', hint: 'CSV text, \\n = line break', input: 'text' }],
      template: "import csv, io\ntext = {$text}.replace('\\\\n', '\\n')\nlist(csv.DictReader(io.StringIO(text, newline='')))",
      cases: [
        { id: 'basic', label: 'header + rows', values: { text: 'name,age\\nAda,36\\nBob,41' } },
        { id: 'blank', label: 'blank line',    values: { text: 'name,age\\n\\nAda,36' } },
        { id: 'dup',   label: 'repeated column', values: { text: 'id,id,name\\n1,2,Ada' } },
        { id: 'empty', label: 'header only',   values: { text: 'name,age' } },
      ],
    },
    {
      id: 'fieldnames',
      label: 'fieldnames',
      blurb: 'Supply the keys yourself (comma-separated). Then the first line is data, not a header. Leave it empty for fieldnames=[].',
      params: [
        { name: 'text',  type: 'str',       hint: 'CSV text, \\n = line break', input: 'text' },
        { name: 'names', type: 'list[str]', hint: 'comma-separated keys',      input: 'csv' },
      ],
      template: "import csv, io\ntext = {$text}.replace('\\\\n', '\\n')\nr = csv.DictReader(io.StringIO(text, newline=''), fieldnames={$names})\n(list(r), r.fieldnames)",
      cases: [
        { id: 'given', label: 'no header in file', values: { text: 'Ada,36\\nBob,41', names: 'name, age' } },
        { id: 'short', label: 'fewer names',       values: { text: 'Ada,36,London', names: 'name, age' } },
        { id: 'none',  label: 'empty list',        values: { text: 'Ada,36', names: '' } },
      ],
    },
    {
      id: 'ragged',
      label: 'restkey / restval',
      blurb: 'Rows longer or shorter than the header. Leave restkey or restval empty for None (the default).',
      params: [
        { name: 'text',    type: 'str',        hint: 'CSV text, \\n = line break', input: 'text' },
        { name: 'restkey', type: 'str | None', hint: 'empty = None', input: 'text-or-none' },
        { name: 'restval', type: 'str | None', hint: 'empty = None', input: 'text-or-none' },
      ],
      template: "import csv, io\ntext = {$text}.replace('\\\\n', '\\n')\nlist(csv.DictReader(io.StringIO(text, newline=''), restkey={$restkey}, restval={$restval}))",
      cases: [
        { id: 'default', label: 'defaults',     values: { text: 'a,b\\n1,2,3,4\\n5', restkey: '', restval: '' } },
        { id: 'named',   label: 'named',        values: { text: 'a,b\\n1,2,3,4\\n5', restkey: 'extra', restval: 'n/a' } },
      ],
    },
  ],
  demoExplainer: 'A repeated column name keeps the LAST value (dict(zip(...)) overwrites) but the first position. A header with no data rows gives []. With fieldnames=[] every value counts as "extra": the dict holds a single key, None. In restkey / restval the long row 1,2,3,4 keeps ["3", "4"] under None and the short row 5 gets None for b — the dict itself never complains, which is how wrong delimiters go unnoticed.',

  patterns: [
    {
      name: 'Read a CSV file into a list of dicts',
      desc: "utf-8-sig drops the BOM Excel puts in front of the first column name.",
      code: "import csv\nwith open('people.csv', newline='', encoding='utf-8-sig') as f:\n    people = list(csv.DictReader(f))",
    },
    {
      name: 'Convert columns while reading',
      desc: 'Values are str; convert the ones you need.',
      code: "import csv\nwith open('people.csv', newline='', encoding='utf-8') as f:\n    people = [{**row, 'age': int(row['age'])} for row in csv.DictReader(f)]",
    },
    {
      name: 'Check the header first',
      desc: 'Reading .fieldnames consumes the header row only.',
      code: "import csv\nwith open('people.csv', newline='', encoding='utf-8') as f:\n    rows = csv.DictReader(f)\n    missing = {'name', 'age'} - set(rows.fieldnames or [])\n    if missing:\n        raise ValueError(f'missing columns: {missing}')",
    },
  ],

  examples: [
    { title: 'One dict per row',             code: "import csv, io\nf = io.StringIO('name,age\\nAda,36\\nBob,41\\n', newline='')\nlist(csv.DictReader(f))", returns: "[{'name': 'Ada', 'age': '36'}, {'name': 'Bob', 'age': '41'}]" },
    { title: 'fieldnames reads the header',  code: "import csv, io\nr = csv.DictReader(io.StringIO('name,age\\nAda,36\\n', newline=''))\n(r.fieldnames, r.line_num)", returns: "(['name', 'age'], 1)" },
    { title: 'Extra values under None',      code: "import csv\nnext(csv.DictReader(['a,b', '1,2,3']))", returns: "{'a': '1', 'b': '2', None: ['3']}" },
    { title: 'Missing values get restval',   code: "import csv\nnext(csv.DictReader(['a,b,c', '1'], restval=''))", returns: "{'a': '1', 'b': '', 'c': ''}" },
    { title: 'Other delimiters pass through', code: "import csv\nnext(csv.DictReader(['name;age', 'Ada;36'], delimiter=';'))", returns: "{'name': 'Ada', 'age': '36'}" },
    { title: 'A BOM sticks to the first key', code: "import csv\nwith open('b.csv', 'w', encoding='utf-8-sig', newline='') as f:\n    f.write('name,age\\r\\nAda,36\\r\\n')\nwith open('b.csv', encoding='utf-8', newline='') as f:\n    keys = csv.DictReader(f).fieldnames\nkeys", returns: "['\\ufeffname', 'age']" },
    { title: 'Rows are plain dicts',         code: "import csv\ntype(next(csv.DictReader(['a', '1']))).__name__", returns: "'dict'" },
  ],

  pitfalls: [
    {
      name: 'Wrong delimiter: one giant column',
      desc: 'A semicolon file read with the default comma gives one key that contains the whole header — no error, just wrong data.',
      wrong: { label: 'default delimiter', code: "import csv\nnext(csv.DictReader(['name;age', 'Ada;36']))", output: "{'name;age': 'Ada;36'}" },
      fix:   { label: "delimiter=';'",   code: "import csv\nnext(csv.DictReader(['name;age', 'Ada;36'], delimiter=';'))", output: "{'name': 'Ada', 'age': '36'}" },
    },
    {
      name: 'KeyError from an Excel BOM',
      desc: 'Files saved by Excel as "CSV UTF-8" start with a BOM. Read as utf-8 it becomes part of the first column name.',
      wrong: { label: "encoding='utf-8'", code: "import csv\nwith open('b.csv', 'w', encoding='utf-8-sig', newline='') as f:\n    f.write('name,age\\r\\nAda,36\\r\\n')\nwith open('b.csv', encoding='utf-8', newline='') as f:\n    name = next(csv.DictReader(f))['name']", output: "KeyError: 'name'" },
      fix:   { label: "encoding='utf-8-sig'", code: "import csv\nwith open('b.csv', 'w', encoding='utf-8-sig', newline='') as f:\n    f.write('name,age\\r\\nAda,36\\r\\n')\nwith open('b.csv', encoding='utf-8-sig', newline='') as f:\n    name = next(csv.DictReader(f))['name']\nname", output: "'Ada'" },
    },
    {
      name: 'Spaces after the commas end up in the keys',
      desc: '"name, age" has the key " age" (with a space). skipinitialspace=True drops spaces after each delimiter.',
      wrong: { label: 'default', code: "import csv\nlist(next(csv.DictReader(['name, age', 'Ada, 36'])))", output: "['name', ' age']" },
      fix:   { label: 'skipinitialspace=True', code: "import csv\nlist(next(csv.DictReader(['name, age', 'Ada, 36'], skipinitialspace=True)))", output: "['name', 'age']" },
    },
  ],

  when: {
    use: [
      'Files with a header row where you want columns by name',
      'Code that should survive reordered columns',
    ],
    avoid: [
      'Files without a header and fixed positions → csv.reader is simpler',
      'Typed data and analysis → pandas.read_csv',
    ],
  },

  notes: {
    cpython:       'Lib/csv.py — class DictReader wraps csv.reader; __next__ skips rows == [], builds dict(zip(fieldnames, row)) and adds restkey / restval',
    'Row type':    'A plain dict since Python 3.8 (OrderedDict in 3.6–3.7)',
    'fieldnames':  'A property: the first access reads the header row from the file; set it to rename columns before iterating',
  },

  related: [
    { name: 'csv.DictWriter', slug: 'dictwriter', when: 'Write dicts back out' },
    { name: 'csv.reader',     slug: 'reader',     when: 'Rows as lists' },
    { name: 'Sniffer.has_header', slug: 'sniffer-has_header', when: 'Guess whether there is a header' },
    { name: 'csv module',     slug: 'csv',        when: 'Overview', category: 'stdlib' },
    { name: 'dict',           slug: 'dict',       when: 'What each row is', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I read a CSV file into a list of dictionaries?',
      a: "with open(path, newline='', encoding='utf-8') as f: rows = list(csv.DictReader(f)). Each dict maps the header names to that row's values (all strings).",
    },
    {
      q: 'Why does my DictReader row have a None key?',
      a: 'That row has more fields than the header. The extra values are collected in a list under restkey, which defaults to None. Usually a wrong delimiter or an unquoted comma inside a value.',
    },
    {
      q: 'Why is the first column name "\\ufeffname"?',
      a: "The file starts with a UTF-8 byte-order mark (Excel's \"CSV UTF-8\"). Open it with encoding='utf-8-sig'.",
    },
    {
      q: 'How do I get the column names?',
      a: 'reader.fieldnames — reading it consumes the header row if it has not been read yet. It is None for an empty file.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/csv.html#csv.DictReader',
    meta:  'csv.DictReader',
  },

};
