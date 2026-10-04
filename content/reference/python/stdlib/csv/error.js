// content/reference/python/stdlib/csv/error.js

export const meta = {
  slug:        'error',
  name:        'csv.Error',
  signature:   'csv.Error(*args)',
  blurb:       'Raised by the csv module for malformed CSV and impossible writes: unexpected end of data, field larger than field limit, need to escape, unknown dialect …',
  category:    'exceptions',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: "csv error _csv.Error csv.Error exception unexpected end of data field larger than field limit new-line character seen in unquoted field need to escape but no escapechar set unknown dialect could not determine delimiter iterator should return strings not bytes expected after",
};

export const method = {
  slug:      'error',
  name:      'csv.Error',
  signature: 'csv.Error(*args)',

  category:    'csv exception',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'The csv module\'s own exception — tracebacks call it _csv.Error, after the C module that defines it. It derives directly from Exception, so except ValueError does not catch it.',

  covers: ['Error'],

  chain: ['BaseException', 'Exception', 'Error'],

  cheat: {
    raisedBy: 'reader iteration, writerow, get_dialect / unregister_dialect, Sniffer.sniff',
    message:  "field larger than field limit (131072)",
    quickFix: 'except csv.Error as e: report e with reader.line_num',
    watchOut: 'bad settings (delimiter=\'::\') are TypeError / ValueError, not csv.Error',
  },

  parameters: [
    { name: 'args', type: 'any', required: false, default: null, desc: 'Like any Exception: the message (str(e) is the first argument when there is one).' },
  ],

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: 'Read your text (\\n = line break) with strict=True, uncaught: malformed input ends in a csv.Error.',
      params: [{ name: 'text', type: 'str', hint: 'CSV text, \\n = line break', input: 'text' }],
      template: "import csv, io\ntext = {$text}.replace('\\\\n', '\\n')\nlist(csv.reader(io.StringIO(text, newline=''), strict=True))",
      cases: [
        { id: 'eod',   label: 'unclosed quote',   values: { text: 'id,note\\n1,"never closed' } },
        { id: 'after', label: 'text after quote', values: { text: '"a"b,c' } },
        { id: 'ok',    label: 'valid',            values: { text: 'id,note\\n1,"fine, really"' } },
      ],
    },
    {
      id: 'handle',
      label: 'Handle',
      blurb: 'Catch it and report the physical line where reading stopped.',
      params: [{ name: 'text', type: 'str', hint: 'CSV text, \\n = line break', input: 'text' }],
      template: "import csv, io\ntext = {$text}.replace('\\\\n', '\\n')\nr = csv.reader(io.StringIO(text, newline=''), strict=True)\ntry:\n    rows = list(r)\nexcept csv.Error as e:\n    result = (r.line_num, str(e))\nelse:\n    result = rows\nresult",
      cases: [
        { id: 'line3', label: 'bad third line', values: { text: 'a,b\\nc,d\\n"e"f,g' } },
        { id: 'eod',   label: 'unclosed quote', values: { text: 'a,b\\n"c,d\\ne,f' } },
        { id: 'ok',    label: 'valid',          values: { text: 'a,b\\nc,d' } },
      ],
    },
  ],
  demoExplainer: 'The traceback shows _csv.Error: csv.Error is the same class, re-exported by Lib/csv.py. line_num is the number of input lines consumed when the error happened — for an unclosed quote that is the last line of the input, since the reader kept looking for the closing quote.',

  attributes: [
    { name: 'args', type: 'tuple', meaning: 'The constructor arguments; for errors raised by csv itself, a 1-tuple with the message.' },
  ],

  patterns: [
    {
      name: 'Report the bad line',
      desc: 'reader.line_num points at the line where parsing stopped.',
      code: "import csv\nwith open('data.csv', newline='', encoding='utf-8') as f:\n    rows = csv.reader(f, strict=True)\n    try:\n        data = list(rows)\n    except csv.Error as e:\n        raise SystemExit(f'data.csv, line {rows.line_num}: {e}')",
    },
    {
      name: 'Skip bad rows',
      desc: 'Catch per row and continue — the reader resets its state for the next row.',
      code: "import csv\ngood = []\nrows = csv.reader(lines, strict=True)\nwhile True:\n    try:\n        row = next(rows)\n    except StopIteration:\n        break\n    except csv.Error:\n        continue\n    good.append(row)",
    },
  ],

  examples: [
    { title: 'Traceback name',               code: "import csv\nlist(csv.reader(['a,\"b'], strict=True))", returns: '_csv.Error: unexpected end of data' },
    { title: 'Same class, two names',        code: 'import csv, _csv\ncsv.Error is _csv.Error', returns: 'True' },
    { title: 'Directly under Exception',     code: 'import csv\n[c.__name__ for c in csv.Error.__mro__]', returns: "['Error', 'Exception', 'BaseException', 'object']" },
    { title: 'Writer errors too',            code: "import csv, io\ncsv.writer(io.StringIO(), quoting=csv.QUOTE_NONE).writerow(['a,b'])", returns: '_csv.Error: need to escape, but no escapechar set' },
    { title: 'A single empty field under QUOTE_NONE', code: "import csv, io\ncsv.writer(io.StringIO(), quoting=csv.QUOTE_NONE).writerow([''])", returns: '_csv.Error: single empty field record must be quoted' },
    { title: 'Catch and inspect',            code: "import csv\ntry:\n    csv.get_dialect('nope')\nexcept csv.Error as e:\n    info = (type(e).__name__, e.args)\ninfo", returns: "('Error', ('unknown dialect',))" },
  ],

  pitfalls: [
    {
      name: 'Catching ValueError',
      desc: 'csv.Error is not a ValueError subclass, so a handler for ValueError lets it through.',
      wrong: { label: 'except ValueError', code: "import csv\ntry:\n    rows = list(csv.reader(['a,\"b'], strict=True))\nexcept ValueError:\n    rows = []\nrows", output: '_csv.Error: unexpected end of data' },
      fix:   { label: 'except csv.Error', code: "import csv\ntry:\n    rows = list(csv.reader(['a,\"b'], strict=True))\nexcept csv.Error:\n    rows = []\nrows", output: '[]' },
    },
    {
      name: 'Expecting csv.Error for bad settings',
      desc: 'Invalid dialect parameters are checked like function arguments: TypeError or ValueError, not csv.Error.',
      wrong: { label: 'except csv.Error', code: "import csv\ntry:\n    csv.reader([], delimiter='::')\nexcept csv.Error:\n    msg = 'caught'", output: 'TypeError: "delimiter" must be a 1-character string' },
      fix:   { label: 'except (TypeError, ValueError)', code: "import csv\ntry:\n    csv.reader([], delimiter='::')\nexcept (TypeError, ValueError) as e:\n    msg = str(e)\nmsg", output: '\'"delimiter" must be a 1-character string\'' },
    },
  ],

  when: {
    use: [
      'Around reading user-supplied CSV, together with strict=True',
      'To report the line number of malformed input',
    ],
    avoid: [
      'Catching it for invalid dialect settings — those are TypeError/ValueError',
      'Catching it for type conversion with QUOTE_NONNUMERIC — that is ValueError',
    ],
  },

  notes: {
    cpython:      "Modules/_csv.c — created in csv_exec as _csv.Error with Exception as base; Lib/csv.py imports it as csv.Error. Raised as Error(message), no extra attributes",
    'Messages':   "Reader: ',' expected after '\"' · unexpected end of data · field larger than field limit (N) · new-line character seen in unquoted field … · iterator should return strings, not … Writer: need to escape, but no escapechar set · single empty field record must be quoted · iterable expected, not … Registry: unknown dialect. Sniffer: Could not determine delimiter",
  },

  related: [
    { name: 'csv.reader',           slug: 'reader',           when: 'Where most of them come from' },
    { name: 'csv.field_size_limit', slug: 'field_size_limit', when: 'field larger than field limit' },
    { name: 'csv.Sniffer',          slug: 'sniffer',          when: 'Could not determine delimiter' },
    { name: 'csv module',           slug: 'csv',              when: 'Overview', category: 'stdlib' },
    { name: 'Exception',            slug: 'exception',        when: 'Its parent class', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'Why does the traceback say _csv.Error instead of csv.Error?',
      a: 'The class is defined in the C module _csv and re-exported by csv. They are the same object; catch it as csv.Error.',
    },
    {
      q: 'What does "_csv.Error: unexpected end of data" mean?',
      a: 'With strict=True, the input ended inside a quoted field (an unclosed quote) or right after an escape character. Without strict the reader would return the partial field instead.',
    },
    {
      q: "What does \"',' expected after '\\\"'\" mean?",
      a: 'With strict=True, a quoted field was closed and followed by something other than the delimiter or the end of the line, as in "a"b. Fix the quoting in the data, or read without strict to accept it.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/csv.html#csv.Error',
    meta:  'csv.Error',
  },

};
