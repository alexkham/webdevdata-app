// content/reference/python/stdlib/logging/bufferingformatter.js

export const meta = {
  slug:        'bufferingformatter',
  name:        'logging.BufferingFormatter',
  signature:   'logging.BufferingFormatter(linefmt=None)',
  blurb:       'Format a whole list of records into one string: formatHeader(records), then linefmt.format(record) for each, then formatFooter(records) — for batched output such as one e-mail per batch of errors.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'logging BufferingFormatter python format batch of log records BufferingFormatter.format BufferingFormatter.formatHeader BufferingFormatter.formatFooter linefmt header footer digest email report MemoryHandler BufferingHandler',
};

export const method = {
  slug:      'bufferingformatter',
  name:      'logging.BufferingFormatter',
  signature: 'logging.BufferingFormatter(linefmt=None)',
  returns:   { type: 'logging.BufferingFormatter', desc: 'An object whose format(records) returns header + lines + footer, or an empty string for an empty list.' },

  category:    'logging class',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'Not a Formatter subclass and not used by any handler automatically: you call format(records) yourself, typically from a buffering handler’s flush(). It concatenates exactly what linefmt produces — no separator is added — and returns "" for an empty list, without header or footer.',

  covers: ['BufferingFormatter', 'BufferingFormatter.format', 'BufferingFormatter.formatHeader', 'BufferingFormatter.formatFooter'],

  cheat: {
    commonCall: "logging.BufferingFormatter(logging.Formatter('%(levelname)s %(message)s\\n'))",
    returns:    "'WARNING disk full\\nWARNING slow query\\n'",
    replaces:   "'\\n'.join(fmt.format(r) for r in records)",
    watchOut:   'lines run together unless linefmt ends with \\n',
  },

  parameters: [
    { name: 'linefmt', type: 'Formatter | None', required: false, default: 'None', desc: "The Formatter applied to each record; None means logging's default formatter ('%(message)s', no newline)." },
  ],

  attributes: [
    { name: 'linefmt', type: 'Formatter', meaning: 'The per-record formatter' },
  ],

  modes: [
    {
      id: 'batch',
      label: 'a report',
      blurb: 'Report subclasses BufferingFormatter with a header that counts the records and a fixed footer. Give it messages (comma-separated) and a line format.',
      params: [
        { name: 'messages', type: 'list[str]', hint: 'comma-separated messages', input: 'csv' },
        { name: 'linefmt',  type: 'str',       hint: 'a %-style line format',    input: 'text' },
      ],
      template: "import logging\nclass Report(logging.BufferingFormatter):\n    def formatHeader(self, records):\n        return f'{len(records)} problem(s):\\n'\n    def formatFooter(self, records):\n        return '-- end of report --'\nrecords = [logging.makeLogRecord({'msg': m, 'levelname': 'WARNING'}) for m in {$messages}]\nReport(logging.Formatter({$linefmt})).format(records)",
      cases: [
        { id: 'two',   label: 'two records',      values: { messages: 'disk full, slow query', linefmt: '- %(levelname)s %(message)s\n' } },
        { id: 'none',  label: 'no records',       values: { messages: '', linefmt: '- %(message)s\n' } },
        { id: 'inline', label: "'; ' separator",  values: { messages: 'disk full, slow query', linefmt: '%(message)s; ' } },
        { id: 'raw',   label: 'no newline',       values: { messages: 'a, b, c', linefmt: '[%(message)s]' } },
      ],
    },
  ],
  demoExplainer: "Every record goes through the same Formatter and the pieces are simply concatenated, so the newline (or any other separator) must be part of the line format. An empty list produces an empty string: the header and footer are only written when there is at least one record.",

  patterns: [
    {
      name: 'Send buffered records as one message',
      desc: 'A BufferingHandler collects records; flush() formats them in one go.',
      code: "import logging, logging.handlers\n\nclass DigestHandler(logging.handlers.BufferingHandler):\n    def __init__(self, capacity, send):\n        super().__init__(capacity)\n        self.send = send\n        self.digest = logging.BufferingFormatter(\n            logging.Formatter('%(asctime)s %(levelname)s %(message)s\\n'))\n\n    def flush(self):\n        with self.lock:\n            if self.buffer:\n                self.send(self.digest.format(self.buffer))\n                self.buffer.clear()",
    },
    {
      name: 'Header and footer from the records',
      desc: 'Both hooks receive the full list.',
      code: "import logging\n\nclass Digest(logging.BufferingFormatter):\n    def formatHeader(self, records):\n        return f'{len(records)} new error(s)\\n'\n    def formatFooter(self, records):\n        return f'last: {records[-1].getMessage()}\\n'",
    },
  ],

  examples: [
    { title: 'An empty list gives an empty string', code: 'import logging\nlogging.BufferingFormatter().format([])', returns: "''" },
    { title: 'The default line format has no newline', code: "import logging\nrecords = [logging.makeLogRecord({'msg': m}) for m in ('one', 'two')]\nlogging.BufferingFormatter().format(records)", returns: "'onetwo'" },
    { title: 'A line format with a newline', code: "import logging\nbf = logging.BufferingFormatter(logging.Formatter('%(message)s\\n'))\nbf.format([logging.makeLogRecord({'msg': 'x %d', 'args': (1,)}), logging.makeLogRecord({'msg': 'y'})])", returns: "'x 1\\ny\\n'" },
    { title: 'Header and footer are empty by default', code: 'import logging\nbf = logging.BufferingFormatter()\n(bf.formatHeader([]), bf.formatFooter([]))', returns: "('', '')" },
    { title: 'linefmt is a Formatter',           code: 'import logging\ntype(logging.BufferingFormatter().linefmt).__name__', returns: "'Formatter'" },
  ],

  pitfalls: [
    {
      name: 'Passing a format string instead of a Formatter',
      desc: "linefmt must be a Formatter. A str is accepted without complaint, and its str.format(record) returns the text unchanged — every line is the literal format string.",
      wrong: { label: 'a str', code: "import logging\nrecords = [logging.makeLogRecord({'msg': m}) for m in ('disk full', 'slow query')]\nlogging.BufferingFormatter('%(message)s\\n').format(records)", output: "'%(message)s\\n%(message)s\\n'" },
      fix:   { label: 'a Formatter', code: "import logging\nrecords = [logging.makeLogRecord({'msg': m}) for m in ('disk full', 'slow query')]\nlogging.BufferingFormatter(logging.Formatter('%(message)s\\n')).format(records)", output: "'disk full\\nslow query\\n'" },
    },
    {
      name: 'Forgetting the line separator',
      desc: 'Unlike a StreamHandler, which adds its terminator, BufferingFormatter joins the formatted records with nothing in between.',
      wrong: { label: "'%(message)s'", code: "import logging\nrecords = [logging.makeLogRecord({'msg': m}) for m in ('disk full', 'slow query')]\nlogging.BufferingFormatter(logging.Formatter('%(message)s')).format(records)", output: "'disk fullslow query'" },
      fix:   { label: "'%(message)s\\n'", code: "import logging\nrecords = [logging.makeLogRecord({'msg': m}) for m in ('disk full', 'slow query')]\nlogging.BufferingFormatter(logging.Formatter('%(message)s\\n')).format(records)", output: "'disk full\\nslow query\\n'" },
    },
  ],

  when: {
    use: [
      'Formatting the buffer of a BufferingHandler / MemoryHandler subclass in one piece',
      'Digest e-mails or chat messages that summarise many records',
    ],
    avoid: [
      'Formatting one record → logging.Formatter',
      'Attaching it with handler.setFormatter → handlers call format(record) on a single record',
    ],
  },

  notes: {
    cpython:    'BufferingFormatter in Lib/logging/__init__.py: format(records) returns "" for an empty list, else formatHeader(records) + linefmt.format(r) for each record + formatFooter(records)',
    'Default':  'linefmt=None (or any false value) uses the module’s default Formatter, whose format is %(message)s',
    'Not a Formatter': "It does not inherit from Formatter. setFormatter accepts it, but every record then fails with TypeError: object of type 'LogRecord' has no len(), reported through handleError",
  },

  related: [
    { name: 'logging.Formatter', slug: 'formatter', when: 'What linefmt must be' },
    { name: 'logging.Handler', slug: 'handler', when: 'Write the handler that calls it' },
    { name: 'LogRecord', slug: 'logrecord', when: 'The items of the list' },
  ],

  faq: [
    {
      q: 'What is logging.BufferingFormatter used for?',
      a: 'Turning a list of LogRecords into one string — header, one formatted line per record, footer. It is meant for handlers that collect records and send them in batches, such as a digest e-mail built in a BufferingHandler.flush().',
    },
    {
      q: 'How do I add a header and footer?',
      a: 'Subclass BufferingFormatter and override formatHeader(records) and formatFooter(records); both receive the list and return a str. They are skipped entirely when the list is empty.',
    },
    {
      q: 'Can I use BufferingFormatter with setFormatter?',
      a: "No. Handlers call formatter.format(record) with a single record, while BufferingFormatter.format expects a list — every line would fail with TypeError: object of type 'LogRecord' has no len(). Call it yourself from the handler that holds the records.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/logging.html#logging.BufferingFormatter',
    meta:  'logging.BufferingFormatter',
  },

};
