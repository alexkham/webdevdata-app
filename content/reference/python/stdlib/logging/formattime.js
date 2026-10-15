// content/reference/python/stdlib/logging/formattime.js

export const meta = {
  slug:        'formattime',
  name:        'Formatter.formatTime',
  signature:   'Formatter.formatTime(record, datefmt=None)',
  blurb:       "How %(asctime)s is made: record.created through converter (time.localtime) and time.strftime with datefmt — or, without datefmt, default_time_format plus milliseconds via default_msec_format.",
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 2.3+ (default_*_format 3.3+)',
  searchTerms: 'Formatter.formatTime Formatter.converter Formatter.default_time_format Formatter.default_msec_format logging asctime format datefmt milliseconds msecs utc time.gmtime logging timestamp format iso 8601 change date format logging comma milliseconds',
};

export const method = {
  slug:      'formattime',
  name:      'Formatter.formatTime',
  signature: 'Formatter.formatTime(record, datefmt=None)  ·  Formatter.converter  ·  Formatter.default_time_format  ·  Formatter.default_msec_format',
  returns:   { type: 'str', desc: "The text format() stores in record.asctime, e.g. '2023-11-14 22:13:20,250'." },

  category:    'logging.Formatter method',
  version:     'Python 2.3+ (default_*_format 3.3+)',
  hasLiveDemo: true,

  subtitle: "With a datefmt, asctime is time.strftime(datefmt, converter(record.created)) — and nothing else, so the milliseconds disappear. Without one it is strftime(default_time_format) followed by default_msec_format % (that, record.msecs): '2023-11-14 22:13:20,250'. converter is time.localtime by default; set it to time.gmtime for UTC.",

  covers: ['Formatter.formatTime', 'Formatter.converter', 'Formatter.default_time_format', 'Formatter.default_msec_format'],

  cheat: {
    commonCall: "logging.Formatter('%(asctime)s %(message)s', datefmt='%Y-%m-%dT%H:%M:%S')",
    returns:    "'2023-11-14T22:13:20 backup finished'",
    replaces:   'datetime.now().isoformat() pasted into messages',
    watchOut:   'datefmt drops the milliseconds — add %(msecs)03d yourself',
  },

  parameters: [
    { name: 'record',  type: 'LogRecord',  required: true,  default: null,   desc: 'Its created (seconds since the epoch) and msecs attributes are used.' },
    { name: 'datefmt', type: 'str | None', required: false, default: 'None', desc: 'A time.strftime format. format() passes the Formatter’s datefmt.' },
  ],

  attributes: [
    { name: 'converter',           type: 'function',   meaning: 'Turns record.created into a time.struct_time: time.localtime by default, time.gmtime for UTC' },
    { name: 'default_time_format', type: 'str',        meaning: "'%Y-%m-%d %H:%M:%S', used when there is no datefmt" },
    { name: 'default_msec_format', type: 'str | None', meaning: "'%s,%03d' — % (time text, msecs); None (3.9+) leaves the milliseconds out" },
  ],

  modes: [
    {
      id: 'datefmt',
      label: 'datefmt',
      blurb: 'A record created at 1700000000.25 (a fixed moment), formatted in UTC with converter = time.gmtime. Try strftime formats.',
      params: [{ name: 'datefmt', type: 'str | None', hint: 'empty = None', input: 'text-or-none' }],
      template: "import time, logging\nformatter = logging.Formatter('%(asctime)s %(message)s', datefmt={$datefmt})\nformatter.converter = time.gmtime\nrecord = logging.makeLogRecord({'msg': 'backup finished', 'created': 1700000000.25, 'msecs': 250.0})\nformatter.format(record)",
      cases: [
        { id: 'none',  label: 'None (default)',     values: { datefmt: '' } },
        { id: 'iso',   label: "'%Y-%m-%dT%H:%M:%S'", values: { datefmt: '%Y-%m-%dT%H:%M:%S' } },
        { id: 'short', label: "'%H:%M'",            values: { datefmt: '%H:%M' } },
        { id: 'words', label: "'%a %d %b %Y'",      values: { datefmt: '%a %d %b %Y' } },
        { id: 'eu',    label: "'%d.%m.%Y %H:%M:%S'", values: { datefmt: '%d.%m.%Y %H:%M:%S' } },
      ],
    },
    {
      id: 'msec',
      label: 'default_msec_format',
      blurb: 'No datefmt, so the milliseconds part is added with default_msec_format % (time, msecs). msecs is 7 here. Empty = None.',
      params: [{ name: 'msec_format', type: 'str | None', hint: "'%s,%03d' is the default", input: 'text-or-none' }],
      template: "import time, logging\nformatter = logging.Formatter('%(asctime)s %(message)s')\nformatter.converter = time.gmtime\nformatter.default_msec_format = {$msec_format}\nrecord = logging.makeLogRecord({'msg': 'backup finished', 'created': 1700000000.007, 'msecs': 7.0})\nformatter.format(record)",
      cases: [
        { id: 'comma', label: "'%s,%03d'",      values: { msec_format: '%s,%03d' } },
        { id: 'dot',   label: "'%s.%03d'",      values: { msec_format: '%s.%03d' } },
        { id: 'none',  label: 'None',           values: { msec_format: '' } },
        { id: 'words', label: "'%s (%d ms)'",   values: { msec_format: '%s (%d ms)' } },
        { id: 'bad',   label: "'%s'",           values: { msec_format: '%s' } },
      ],
    },
  ],
  demoExplainer: "1700000000.25 seconds after the epoch is 22:13:20.25 UTC on Tuesday 14 November 2023. With no datefmt the default gives '2023-11-14 22:13:20,250' — the comma comes from default_msec_format. Any datefmt replaces all of that, so the milliseconds disappear. In the second tab the format receives two values, the time text and msecs: '%s.%03d' gives a dot, None (3.9+) drops the milliseconds, and a format with only one placeholder fails with TypeError: not all arguments converted during string formatting — raised by the format() call itself, because no handler is involved here.",

  patterns: [
    {
      name: 'UTC timestamps for one formatter',
      desc: 'An instance attribute affects only this formatter.',
      code: "import time, logging\nformatter = logging.Formatter('%(asctime)s %(levelname)s %(message)s')\nformatter.converter = time.gmtime",
    },
    {
      name: 'A UTC formatter class',
      desc: 'Usable from dictConfig via the "()" or "class" keys.',
      code: "import time, logging\n\nclass UTCFormatter(logging.Formatter):\n    converter = time.gmtime",
    },
    {
      name: 'ISO 8601 with milliseconds and a Z',
      desc: 'datefmt for the seconds, %(msecs)03d for the rest.',
      code: "import time, logging\nformatter = logging.Formatter('%(asctime)s.%(msecs)03dZ %(levelname)s %(message)s', datefmt='%Y-%m-%dT%H:%M:%S')\nformatter.converter = time.gmtime",
    },
  ],

  examples: [
    { title: 'The class defaults',           code: 'import logging\n(logging.Formatter.default_time_format, logging.Formatter.default_msec_format)', returns: "('%Y-%m-%d %H:%M:%S', '%s,%03d')" },
    { title: 'Local time by default',        code: 'import time, logging\nlogging.Formatter.converter is time.localtime', returns: 'True' },
    { title: 'Calling formatTime directly',  code: "import time, logging\nf = logging.Formatter()\nf.converter = time.gmtime\nf.formatTime(logging.makeLogRecord({'created': 0, 'msecs': 0}), '%Y-%m-%d %H:%M:%S')", returns: "'1970-01-01 00:00:00'" },
    { title: 'A UTC subclass',               code: "import time, logging\nclass UTCFormatter(logging.Formatter):\n    converter = time.gmtime\nUTCFormatter('%(asctime)s %(message)s').format(logging.makeLogRecord({'msg': 'epoch', 'created': 0, 'msecs': 0}))", returns: "'1970-01-01 00:00:00,000 epoch'" },
    { title: 'Milliseconds with {}-style',   code: "import time, logging\nf = logging.Formatter('{asctime}.{msecs:03.0f} {message}', datefmt='%H:%M:%S', style='{')\nf.converter = time.gmtime\nf.format(logging.makeLogRecord({'msg': 'tick', 'created': 1700000000.004, 'msecs': 4.0}))", returns: "'22:13:20.004 tick'" },
    { title: 'Changing default_time_format', code: "import time, logging\nf = logging.Formatter()\nf.converter = time.gmtime\nf.default_time_format = '%H:%M:%S'\nf.formatTime(logging.makeLogRecord({'created': 1700000000.5, 'msecs': 500.0}))", returns: "'22:13:20,500'" },
    { title: 'No asctime in the format, no formatTime call', code: "import logging\nrecord = logging.makeLogRecord({'msg': 'x'})\nlogging.Formatter('%(message)s').format(record)\nhasattr(record, 'asctime')", returns: 'False' },
  ],

  pitfalls: [
    {
      name: 'Expecting milliseconds after setting datefmt',
      desc: 'default_msec_format is only used when there is no datefmt, and time.strftime has no millisecond directive. Put %(msecs)03d in the format string.',
      wrong: { label: 'datefmt only', code: "import time, logging\nf = logging.Formatter('%(asctime)s %(message)s', datefmt='%H:%M:%S')\nf.converter = time.gmtime\nf.format(logging.makeLogRecord({'msg': 'backup finished', 'created': 1700000000.25, 'msecs': 250.0}))", output: "'22:13:20 backup finished'" },
      fix:   { label: '%(msecs)03d', code: "import time, logging\nf = logging.Formatter('%(asctime)s.%(msecs)03d %(message)s', datefmt='%H:%M:%S')\nf.converter = time.gmtime\nf.format(logging.makeLogRecord({'msg': 'backup finished', 'created': 1700000000.25, 'msecs': 250.0}))", output: "'22:13:20.250 backup finished'" },
    },
    {
      name: 'Setting converter on the Formatter class',
      desc: 'logging.Formatter.converter = time.gmtime changes the class attribute: every formatter without its own converter — including those of libraries — follows. That is the documented way to switch all of them; when you only mean your own output, set it on your instance or subclass.',
      wrong: { label: 'on the class', code: "import time, logging\ntheirs = logging.Formatter('%(asctime)s')\nsaved = logging.Formatter.converter\ntry:\n    logging.Formatter.converter = time.gmtime\n    result = theirs.converter is time.gmtime\nfinally:\n    logging.Formatter.converter = saved\nresult", output: 'True' },
      fix:   { label: 'on the instance', code: "import time, logging\nmine = logging.Formatter('%(asctime)s')\ntheirs = logging.Formatter('%(asctime)s')\nmine.converter = time.gmtime\n(mine.converter is time.gmtime, theirs.converter is time.gmtime)", output: '(True, False)' },
    },
  ],

  when: {
    use: [
      'datefmt for the date layout, converter for the time zone',
      'Overriding formatTime for formats strftime cannot do (e.g. datetime.isoformat with microseconds)',
    ],
    avoid: [
      'Platform-specific strftime codes in datefmt (%-d, %e, %c, %x): Windows and Linux render or reject them differently',
    ],
  },

  notes: {
    cpython:      "formatTime(): ct = self.converter(record.created); with datefmt: time.strftime(datefmt, ct); else s = strftime(default_time_format, ct) and, if default_msec_format is set, default_msec_format % (s, record.msecs)",
    'Local time': 'The default converter time.localtime uses the machine’s time zone, so the same record prints differently on servers in different zones — the demos here use time.gmtime to stay reproducible',
    'Versions':   'default_time_format and default_msec_format were added in 3.3 (the format used to be hard-coded); default_msec_format may be None since 3.9',
    'Called by':  'format() calls formatTime only when usesTime() is true, i.e. the format mentions asctime',
  },

  related: [
    { name: 'logging.Formatter', slug: 'formatter', when: 'The format string and styles' },
    { name: 'LogRecord', slug: 'logrecord', when: 'created and msecs come from here' },
    { name: 'logging.basicConfig', slug: 'basicconfig', when: 'datefmt= in one call' },
    { name: 'time module', slug: 'time', when: 'strftime, gmtime and localtime', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I change the timestamp format in Python logging?',
      a: "Pass datefmt to the Formatter or basicConfig, e.g. datefmt='%Y-%m-%d %H:%M:%S'. It is a time.strftime format applied to the record’s creation time.",
    },
    {
      q: 'How do I log timestamps in UTC?',
      a: 'Set converter = time.gmtime on the formatter instance, or define a Formatter subclass with converter = time.gmtime. The default, time.localtime, uses the local time zone.',
    },
    {
      q: 'Why is there a comma before the milliseconds in asctime?',
      a: "Because default_msec_format is '%s,%03d'. Set formatter.default_msec_format = '%s.%03d' for a dot, or None (3.9+) to drop the milliseconds.",
    },
    {
      q: 'How do I add milliseconds when I use datefmt?',
      a: 'datefmt disables the automatic milliseconds. Add them in the format string: %(asctime)s.%(msecs)03d — or {msecs:03.0f} with style="{".',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/logging.html#logging.Formatter.formatTime',
    meta:  'Formatter.formatTime',
  },

};
