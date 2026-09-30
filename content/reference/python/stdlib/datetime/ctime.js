// content/reference/python/stdlib/datetime/ctime.js — date.ctime / datetime.ctime

export const meta = {
  slug:        'ctime',
  name:        'datetime.ctime',
  signature:   'dt.ctime()',
  blurb:       'The fixed C-style text form "Tue Sep 29 14:30:05 2026" — English names, space-padded day, no zone.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'date.ctime datetime.ctime ctime asctime c style date string python Tue Sep 29 format unix date format',
};

export const method = {
  slug:      'ctime',
  name:      'datetime.ctime',
  signature: 'dt.ctime()',
  returns:   { type: 'str', desc: 'Always 24 characters: "Www Mmm dd hh:mm:ss yyyy".' },

  category:    'date / datetime method',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'The same layout as C\'s ctime() and asctime(), produced by Python itself — so it is identical on every platform and ignores the locale. Microseconds and the UTC offset are not shown.',

  covers: ['date.ctime', 'datetime.ctime'],

  cheat: {
    commonCall: 'dt.ctime()',
    returns:    "'Tue Sep 29 14:30:05 2026'",
    replaces:   "time.asctime(dt.timetuple()) and strftime('%a %b %e %H:%M:%S %Y')",
    watchOut:   'Drops microseconds and the offset; not for storage',
  },

  parameters: [],

  modes: [
    {
      id: 'text',
      label: 'ctime',
      blurb: 'Any date or timestamp in the fixed C layout. A date gets 00:00:00.',
      params: [{ name: 'when', type: 'str', hint: 'an ISO 8601 date or timestamp', input: 'text' }],
      template: 'from datetime import datetime\ndatetime.fromisoformat({$when}).ctime()',
      cases: [
        { id: 'dt',    label: 'timestamp',     values: { when: '2026-09-29T14:30:05' } },
        { id: 'pad',   label: 'single-digit day', values: { when: '2026-09-05T08:00' } },
        { id: 'aware', label: 'with offset',   values: { when: '2026-09-05T14:30:05.999+05:00' } },
        { id: 'y5',    label: 'year 5',        values: { when: '0005-01-01' } },
      ],
    },
  ],
  demoExplainer: 'The day of the month is padded with a space ("Sep  5"), the year with zeros ("0005"). The +05:00 offset and the milliseconds simply disappear.',

  patterns: [
    {
      name: 'Quick human-readable log line',
      desc: 'Fine for debugging output; use isoformat for anything parsed later.',
      code: "print(f'[{dt.ctime()}] job finished')",
    },
  ],

  examples: [
    { title: 'A datetime',          code: 'from datetime import datetime\ndatetime(2026, 9, 29, 14, 30, 5).ctime()', returns: "'Tue Sep 29 14:30:05 2026'" },
    { title: 'A date is midnight',  code: 'from datetime import date\ndate(2026, 9, 29).ctime()', returns: "'Tue Sep 29 00:00:00 2026'" },
    { title: 'Space-padded day',    code: 'from datetime import datetime\ndatetime(2026, 9, 5, 14, 30).ctime()', returns: "'Sat Sep  5 14:30:00 2026'" },
    { title: 'Always 24 characters', code: 'from datetime import datetime\nlen(datetime(2026, 9, 5).ctime())', returns: '24' },
  ],

  pitfalls: [
    {
      name: 'Using ctime() output as data',
      desc: 'The offset and microseconds are gone, so it cannot round-trip. Store isoformat() instead.',
      wrong: { label: 'ctime()', code: 'from datetime import datetime, timedelta, timezone\ndatetime(2026, 9, 29, 14, 30, 5, 999, tzinfo=timezone(timedelta(hours=5))).ctime()', output: "'Tue Sep 29 14:30:05 2026'" },
      fix:   { label: 'isoformat()', code: 'from datetime import datetime, timedelta, timezone\ndatetime(2026, 9, 29, 14, 30, 5, 999, tzinfo=timezone(timedelta(hours=5))).isoformat()', output: "'2026-09-29T14:30:05.000999+05:00'" },
    },
  ],

  when: {
    use: ['Debug output that should look like Unix date', 'Matching legacy asctime-formatted logs'],
    avoid: ['Storage and APIs → isoformat()', 'Localized display → strftime'],
  },

  notes: {
    cpython:    'format_ctime in Modules/_datetimemodule.c: "%s %s %2d %02d:%02d:%02d %04d" with English day and month names — no C library call',
    'Parsing':  "datetime.strptime(s, '%a %b %d %H:%M:%S %Y') reads it back (%d accepts the space-padded day)",
  },

  related: [
    { name: 'strftime', slug: 'strftime-strptime', when: 'Any other layout' },
    { name: 'isoformat', slug: 'fromisoformat', when: 'The lossless text form' },
    { name: 'timetuple', slug: 'timetuple', when: 'For time.asctime()' },
    { name: 'datetime module', slug: 'datetime', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Is ctime() affected by the locale?',
      a: 'No. The day and month names are hard-coded English abbreviations, unlike strftime("%c"), which follows the LC_TIME locale.',
    },
    {
      q: 'How do I parse a ctime string back?',
      a: "datetime.strptime(text, '%a %b %d %H:%M:%S %Y'). The result is naive, because ctime never contained an offset.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/datetime.html#datetime.datetime.ctime',
    meta:  'datetime.ctime',
  },
};
