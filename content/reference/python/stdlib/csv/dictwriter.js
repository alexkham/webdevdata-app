// content/reference/python/stdlib/csv/dictwriter.js

export const meta = {
  slug:        'dictwriter',
  name:        'csv.DictWriter',
  signature:   "csv.DictWriter(f, fieldnames, restval='', extrasaction='raise', dialect='excel', *args, **kwds)",
  blurb:       'Write dicts as CSV rows, columns in the order of fieldnames. Missing keys get restval; unknown keys raise ValueError unless extrasaction="ignore".',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: "csv dictwriter write dict to csv python csv.DictWriter DictWriter.writerow DictWriter.writerows writerow writerows fieldnames restval extrasaction ignore dict contains fields not in fieldnames list of dicts to csv",
};

export const method = {
  slug:      'dictwriter',
  name:      'csv.DictWriter',
  signature: "csv.DictWriter(f, fieldnames, restval='', extrasaction='raise', dialect='excel', *args, **kwds)",
  returns:   { type: 'DictWriter', desc: 'An object with writeheader(), writerow(rowdict) and writerows(rowdicts); .writer is the underlying csv.writer.' },

  category:    'csv class',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'fieldnames fixes the columns and their order; each dict is looked up key by key. A key the dict lacks is filled with restval, a key fieldnames lacks is an error — and the header line is only written when you call writeheader().',

  covers: ['DictWriter', 'DictWriter.writerow', 'DictWriter.writerows'],

  cheat: {
    commonCall: 'w = csv.DictWriter(f, fieldnames=["name", "age"]); w.writeheader(); w.writerows(rows)',
    returns:    'writerow: what f.write returned; writerows: None',
    replaces:   'writer.writerow([d[k] for k in keys]) by hand',
    watchOut:   'extra keys raise ValueError — extrasaction="ignore" drops them',
  },

  parameters: [
    { name: 'f',            type: 'object with write()', required: true,  default: null,      desc: "A file opened with newline='' (or io.StringIO)." },
    { name: 'fieldnames',   type: 'sequence of keys',    required: true,  default: null,      desc: 'The columns, in output order.' },
    { name: 'restval',      type: 'any',                 required: false, default: "''",      desc: 'Written for a field name the dict has no key for.' },
    { name: 'extrasaction', type: "'raise' | 'ignore'",  required: false, default: "'raise'", desc: "What to do with keys that are not in fieldnames (case-insensitive)." },
    { name: 'dialect',      type: 'str | Dialect',       required: false, default: "'excel'", desc: 'Passed to csv.writer with any other keyword arguments (delimiter=…, quoting=…).' },
  ],

  modes: [
    {
      id: 'write',
      label: 'writerow',
      blurb: 'Header + one dict built from your keys and values (comma-separated lists).',
      params: [
        { name: 'fieldnames', type: 'list[str]', hint: 'columns',    input: 'csv' },
        { name: 'keys',       type: 'list[str]', hint: 'dict keys',  input: 'csv' },
        { name: 'values',     type: 'list[str]', hint: 'dict values', input: 'csv' },
      ],
      template: "import csv, io\nbuf = io.StringIO(newline='')\nw = csv.DictWriter(buf, fieldnames={$fieldnames})\nw.writeheader()\nw.writerow(dict(zip({$keys}, {$values})))\nbuf.getvalue()",
      cases: [
        { id: 'match',   label: 'keys match',      values: { fieldnames: 'name, age', keys: 'name, age', values: 'Ada, 36' } },
        { id: 'order',   label: 'other key order', values: { fieldnames: 'name, age', keys: 'age, name', values: '36, Ada' } },
        { id: 'missing', label: 'missing key',     values: { fieldnames: 'name, age, city', keys: 'name', values: 'Ada' } },
        { id: 'extra',   label: 'unknown key',     values: { fieldnames: 'name', keys: 'name, age', values: 'Ada, 36' } },
      ],
    },
    {
      id: 'options',
      label: 'restval / extrasaction',
      blurb: "Same row, with your restval and extrasaction ('raise' or 'ignore').",
      params: [
        { name: 'restval',      type: 'str', hint: 'for missing keys',  input: 'text' },
        { name: 'extrasaction', type: 'str', hint: "'raise' or 'ignore'", input: 'text' },
      ],
      template: "import csv, io\nbuf = io.StringIO(newline='')\nw = csv.DictWriter(buf, ['name', 'age', 'city'], restval={$restval}, extrasaction={$extrasaction})\nw.writerows([{'name': 'Ada', 'age': 36}, {'name': 'Bob', 'id': 7}])\nbuf.getvalue()",
      cases: [
        { id: 'ignore', label: 'ignore extras',   values: { restval: 'n/a', extrasaction: 'ignore' } },
        { id: 'raise',  label: 'raise (default)', values: { restval: '', extrasaction: 'raise' } },
        { id: 'upper',  label: 'IGNORE',          values: { restval: '-', extrasaction: 'IGNORE' } },
        { id: 'typo',   label: 'typo',            values: { restval: '', extrasaction: 'skip' } },
      ],
    },
  ],
  demoExplainer: "Columns always follow fieldnames, whatever order the dict has. A missing key is written as restval ('' by default), so \"missing key\" ends in two empty fields. An unknown key raises ValueError: dict contains fields not in fieldnames: 'age' — with several unknown keys they are listed in set order, which can change from run to run. In the second tab, the first dict is written before Bob's 'id' key stops writerows, so with 'raise' nothing at all comes out of the demo (the exception is what you see). extrasaction is lower-cased, so 'IGNORE' works; any other word is rejected by the constructor.",

  patterns: [
    {
      name: 'Write a list of dicts to a CSV file',
      desc: 'Take the column names from the first dict, or list them explicitly.',
      code: "import csv\nwith open('people.csv', 'w', newline='', encoding='utf-8') as f:\n    w = csv.DictWriter(f, fieldnames=['name', 'age'])\n    w.writeheader()\n    w.writerows(people)",
    },
    {
      name: 'Keep only some columns',
      desc: 'extrasaction="ignore" drops the keys you do not list.',
      code: "import csv\nwith open('export.csv', 'w', newline='', encoding='utf-8') as f:\n    w = csv.DictWriter(f, fieldnames=['id', 'email'], extrasaction='ignore')\n    w.writeheader()\n    w.writerows(users)",
    },
    {
      name: 'Columns from all rows',
      desc: 'When dicts have different keys, collect them first (dict.fromkeys keeps first-seen order).',
      code: "import csv\nfields = list(dict.fromkeys(k for row in rows for k in row))\nwith open('all.csv', 'w', newline='', encoding='utf-8') as f:\n    w = csv.DictWriter(f, fieldnames=fields)\n    w.writeheader()\n    w.writerows(rows)",
    },
  ],

  examples: [
    { title: 'Header and rows',             code: "import csv, io\nbuf = io.StringIO(newline='')\nw = csv.DictWriter(buf, fieldnames=['name', 'age'])\nw.writeheader()\nw.writerows([{'name': 'Ada', 'age': 36}, {'age': 41, 'name': 'Bob'}])\nbuf.getvalue()", returns: "'name,age\\r\\nAda,36\\r\\nBob,41\\r\\n'" },
    { title: 'Missing keys use restval',    code: "import csv, io\nbuf = io.StringIO(newline='')\ncsv.DictWriter(buf, ['a', 'b'], restval='NA').writerow({'a': 1})\nbuf.getvalue()", returns: "'1,NA\\r\\n'" },
    { title: 'Unknown keys raise',          code: "import csv, io\ncsv.DictWriter(io.StringIO(), ['a']).writerow({'a': 1, 'b': 2})", returns: "ValueError: dict contains fields not in fieldnames: 'b'" },
    { title: "extrasaction='ignore'",       code: "import csv, io\nbuf = io.StringIO(newline='')\ncsv.DictWriter(buf, ['a'], extrasaction='ignore').writerow({'a': 1, 'b': 2})\nbuf.getvalue()", returns: "'1\\r\\n'" },
    { title: 'Writer options pass through', code: "import csv, io\nbuf = io.StringIO(newline='')\ncsv.DictWriter(buf, ['a', 'b'], delimiter=';', quoting=csv.QUOTE_ALL).writerow({'a': 1, 'b': 'x'})\nbuf.getvalue()", returns: "'\"1\";\"x\"\\r\\n'" },
    { title: 'writerow returns write()\'s result', code: "import csv, io\ncsv.DictWriter(io.StringIO(), ['a', 'b']).writerow({'a': 'x', 'b': 'y'})", returns: '5' },
    { title: 'Bad extrasaction',            code: "import csv, io\ncsv.DictWriter(io.StringIO(), ['a'], extrasaction='skip')", returns: "ValueError: extrasaction (skip) must be 'raise' or 'ignore'" },
  ],

  pitfalls: [
    {
      name: 'Forgetting writeheader()',
      desc: 'Creating the DictWriter writes nothing. Without writeheader() the file has no column names.',
      wrong: { label: 'no header', code: "import csv, io\nbuf = io.StringIO(newline='')\nw = csv.DictWriter(buf, ['name', 'age'])\nw.writerow({'name': 'Ada', 'age': 36})\nbuf.getvalue()", output: "'Ada,36\\r\\n'" },
      fix:   { label: 'writeheader() first', code: "import csv, io\nbuf = io.StringIO(newline='')\nw = csv.DictWriter(buf, ['name', 'age'])\nw.writeheader()\nw.writerow({'name': 'Ada', 'age': 36})\nbuf.getvalue()", output: "'name,age\\r\\nAda,36\\r\\n'" },
    },
    {
      name: 'Passing a list instead of a dict',
      desc: 'DictWriter.writerow expects a mapping — a list has no .keys(), so the extrasaction check fails with AttributeError.',
      wrong: { label: 'writerow(list)', code: "import csv, io\ncsv.DictWriter(io.StringIO(), ['a', 'b']).writerow(['x', 'y'])", output: "AttributeError: 'list' object has no attribute 'keys'" },
      fix:   { label: 'csv.writer for lists', code: "import csv, io\nbuf = io.StringIO(newline='')\ncsv.writer(buf).writerow(['x', 'y'])\nbuf.getvalue()", output: "'x,y\\r\\n'" },
    },
    {
      name: 'Rows with more keys than the first one',
      desc: 'Building fieldnames from rows[0] fails as soon as a later row has a new key.',
      wrong: { label: 'rows[0].keys()', code: "import csv, io\nrows = [{'a': 1}, {'a': 2, 'b': 3}]\nw = csv.DictWriter(io.StringIO(), fieldnames=rows[0].keys())\nw.writerows(rows)", output: "ValueError: dict contains fields not in fieldnames: 'b'" },
      fix:   { label: 'all keys', code: "import csv, io\nrows = [{'a': 1}, {'a': 2, 'b': 3}]\nbuf = io.StringIO(newline='')\nw = csv.DictWriter(buf, fieldnames=list(dict.fromkeys(k for r in rows for k in r)))\nw.writerows(rows)\nbuf.getvalue()", output: "'1,\\r\\n2,3\\r\\n'" },
    },
  ],

  when: {
    use: [
      'Your data is already a list of dicts (JSON records, database rows)',
      'You want a fixed column order regardless of dict order',
    ],
    avoid: [
      'Rows that are lists → csv.writer',
      'Nested values (dicts inside dicts) → json, or flatten first',
    ],
  },

  notes: {
    cpython:        'Lib/csv.py — class DictWriter: _dict_to_list checks rowdict.keys() - fieldnames, then yields rowdict.get(key, restval) for every field name; writerow/writerows delegate to csv.writer',
    'Error order':  'The unknown-key message lists a set, so with several unknown keys their order varies between runs',
    'Return value': 'writerow returns what the file\'s write() returned; writerows returns None',
  },

  related: [
    { name: 'DictWriter.writeheader', slug: 'dictwriter-writeheader', when: 'Write the column names' },
    { name: 'csv.DictReader',         slug: 'dictreader',             when: 'Read the dicts back' },
    { name: 'csv.writer',             slug: 'writer',                 when: 'Rows that are lists' },
    { name: 'csv module',             slug: 'csv',                    when: 'Overview', category: 'stdlib' },
    { name: 'ValueError',             slug: 'valueerror',             when: 'What unknown keys raise', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'How do I write a list of dictionaries to a CSV file?',
      a: "Open the file with newline='', create csv.DictWriter(f, fieldnames=[...]), call writeheader(), then writerows(list_of_dicts).",
    },
    {
      q: 'What does "dict contains fields not in fieldnames" mean?',
      a: 'A dict passed to writerow has a key that is not in fieldnames. Add the key to fieldnames, or pass extrasaction="ignore" to drop such keys silently.',
    },
    {
      q: 'Does DictWriter write the header automatically?',
      a: 'No. Call writeheader() once before the rows; it writes the field names as a row.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/csv.html#csv.DictWriter',
    meta:  'csv.DictWriter',
  },

};
