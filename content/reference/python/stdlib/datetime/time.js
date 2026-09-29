// content/reference/python/stdlib/datetime/time.js — the time class

export const meta = {
  slug:        'time',
  name:        'datetime.time',
  signature:   'time(hour=0, minute=0, second=0, microsecond=0, tzinfo=None, *, fold=0)',
  blurb:       'A time of day — hour, minute, second, microsecond — independent of any date. Comparable, formattable, but with no arithmetic.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'time class datetime.time time of day python time object add minutes to time unsupported operand type datetime.time timedelta opening hours hour must be in 0..23',
};

export const method = {
  slug:      'time',
  name:      'datetime.time',
  signature: 'time(hour=0, minute=0, second=0, microsecond=0, tzinfo=None, *, fold=0)',
  returns:   { type: 'time', desc: 'An immutable time-of-day value, naive or (with tzinfo) aware.' },

  category:    'datetime class',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'A wall-clock reading without a date. You can compare and format it, but not add a timedelta to it — without a date, "23:30 + 45 minutes" has nowhere to roll over to.',

  covers: ['time'],

  cheat: {
    commonCall: 'time(9, 30)',
    returns:    'datetime.time(9, 30)',
    replaces:   '(hour, minute) tuples and "HH:MM" strings',
    watchOut:   'time + timedelta raises TypeError — combine with a date first',
  },

  parameters: [
    { name: 'hour',        type: 'int', required: false, default: '0',    desc: '0 to 23.' },
    { name: 'minute',      type: 'int', required: false, default: '0',    desc: '0 to 59.' },
    { name: 'second',      type: 'int', required: false, default: '0',    desc: '0 to 59.' },
    { name: 'microsecond', type: 'int', required: false, default: '0',    desc: '0 to 999999.' },
    { name: 'tzinfo',      type: 'tzinfo | None', required: false, default: 'None', desc: 'Usually None. With a fixed-offset timezone the time is aware.' },
    { name: 'fold',        type: 'int', required: false, default: '0',    desc: 'Keyword-only, 0 or 1; see the fold attribute.' },
  ],

  modes: [
    {
      id: 'construct',
      label: 'construct',
      blurb: 'Every argument is optional; each is range-checked.',
      params: [
        { name: 'hour',   type: 'int', hint: 'hour',   input: 'number' },
        { name: 'minute', type: 'int', hint: 'minute', input: 'number' },
        { name: 'second', type: 'int', hint: 'second', input: 'number' },
      ],
      template: "from datetime import time\nt = time({$hour}, {$minute}, {$second})\n(t, str(t), t.strftime('%I:%M'))",
      cases: [
        { id: 'pm',    label: 'afternoon', values: { hour: '14', minute: '30', second: '0' } },
        { id: 'secs',  label: 'with seconds', values: { hour: '9', minute: '5', second: '7' } },
        { id: 'h24',   label: '24:00',     values: { hour: '24', minute: '0', second: '0' } },
        { id: 'm60',   label: 'minute 60', values: { hour: '9', minute: '60', second: '0' } },
      ],
    },
    {
      id: 'shift',
      label: 'add minutes',
      blurb: 'The standard workaround: attach any date, add the timedelta, take .time() back — and count the days it crossed.',
      params: [
        { name: 't',       type: 'str', hint: 'HH:MM', input: 'text' },
        { name: 'minutes', type: 'int', hint: 'minutes to add', input: 'number' },
      ],
      template: 'from datetime import date, datetime, time, timedelta\nstart = datetime.combine(date(2000, 1, 1), time.fromisoformat({$t}))\nend = start + timedelta(minutes={$minutes})\n(end.time(), (end.date() - start.date()).days)',
      cases: [
        { id: 'same',  label: 'same day',       values: { t: '09:30', minutes: '45' } },
        { id: 'wrap',  label: 'past midnight',  values: { t: '23:30', minutes: '45' } },
        { id: 'back',  label: 'backwards',      values: { t: '00:10', minutes: '-30' } },
      ],
    },
  ],
  demoExplainer: 'Hour 24 is rejected by the constructor (24:00 is not a time of day here), and a minute of 60 does not carry into the hour. In the "add minutes" tab the date is a throwaway anchor: 23:30 + 45 minutes is 00:15 with one day crossed.',

  patterns: [
    {
      name: 'Is a time inside opening hours?',
      desc: 'Chained comparisons work on naive times.',
      code: 'from datetime import time\ndef is_open(t, opens=time(9), closes=time(17, 30)):\n    return opens <= t < closes',
    },
    {
      name: 'Minutes between two times',
      desc: 'Anchor both to the same date, subtract, convert.',
      code: 'from datetime import date, datetime\nd = date(2000, 1, 1)\nminutes = (datetime.combine(d, end) - datetime.combine(d, start)).total_seconds() / 60',
    },
    {
      name: 'Time part of a datetime',
      desc: '.time() drops tzinfo; .timetz() keeps it.',
      code: 'wall_clock = dt.time()',
    },
  ],

  examples: [
    { title: 'Construct',                   code: 'from datetime import time\ntime(14, 30)', returns: 'datetime.time(14, 30)' },
    { title: 'All defaults: midnight',      code: 'from datetime import time\ntime()', returns: 'datetime.time(0, 0)' },
    { title: 'Midnight is truthy (3.5+)',   code: 'from datetime import time\nbool(time(0))', returns: 'True' },
    { title: 'Compare',                     code: 'from datetime import time\ntime(9) < time(17, 30)', returns: 'True' },
    { title: 'Format',                      code: "from datetime import time\ntime(9, 5).strftime('%H:%M')", returns: "'09:05'" },
    { title: 'No subtraction either',       code: 'from datetime import time\ntime(17) - time(9)', returns: "TypeError: unsupported operand type(s) for -: 'datetime.time' and 'datetime.time'" },
    { title: 'Aware times compare in UTC',  code: 'from datetime import time, timedelta, timezone, UTC\ntime(12, tzinfo=timezone(timedelta(hours=2))) == time(10, tzinfo=UTC)', returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'Adding a timedelta to a time',
      desc: 'time has no date to roll over into, so + is not defined. Combine with a date, add, take .time().',
      wrong: { label: 'time + timedelta', code: 'from datetime import time, timedelta\ntime(23, 30) + timedelta(minutes=45)', output: "TypeError: unsupported operand type(s) for +: 'datetime.time' and 'datetime.timedelta'" },
      fix:   { label: 'via datetime', code: 'from datetime import date, datetime, time, timedelta\n(datetime.combine(date(2000, 1, 1), time(23, 30)) + timedelta(minutes=45)).time()', output: 'datetime.time(0, 15)' },
    },
    {
      name: 'Ordering naive and aware times',
      desc: 'Same rule as datetime: == is False, < raises.',
      wrong: { label: 'naive < aware', code: 'from datetime import time, UTC\ntime(12) < time(12, tzinfo=UTC)', output: "TypeError: can't compare offset-naive and offset-aware times" },
      fix:   { label: 'both naive', code: 'from datetime import time\ntime(12) < time(12, 30)', output: 'True' },
    },
  ],

  when: {
    use: [
      'Recurring times of day: opening hours, alarms, schedules',
      'The wall-clock part of a datetime (dt.time())',
    ],
    avoid: [
      'Durations → timedelta',
      'A specific moment → datetime',
      'Time zones with DST → a time alone cannot know which offset applies; use datetime + zoneinfo',
    ],
  },

  notes: {
    cpython:      'PyDateTime_Time in Modules/_datetimemodule.c — 6 bytes of data, tzinfo, fold',
    'Operators':  'Comparisons only (== < etc.) — no + or - with anything',
    'Truth':      'Every time is truthy since Python 3.5; before that midnight UTC was falsy',
    'repr':       'time repr lists tzinfo before fold; datetime repr lists fold before tzinfo',
  },

  related: [
    { name: 'hour / minute / second …', slug: 'time-attributes', when: 'Read the fields' },
    { name: 'combine / date() / time()', slug: 'combine', when: 'Join a date and a time, or split them' },
    { name: 'fromisoformat', slug: 'fromisoformat', when: 'time.fromisoformat("14:30")' },
    { name: 'strftime', slug: 'strftime-strptime', when: 'Format a time' },
    { name: 'datetime module', slug: 'datetime', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I add minutes to a time object in Python?',
      a: 'Combine it with any date, add the timedelta, and take .time(): (datetime.combine(date.today(), t) + timedelta(minutes=45)).time(). Check the date part too if crossing midnight matters.',
    },
    {
      q: 'How do I get the current time of day?',
      a: 'datetime.now().time() for local wall-clock time, or datetime.now(UTC).timetz() for an aware UTC time. There is no time.now() — and the time MODULE is a different thing altogether.',
    },
    {
      q: 'Why is there both a time module and a datetime.time class?',
      a: 'The time module (import time) wraps the C library: time.time(), time.sleep(), time.strftime. datetime.time is a value type for a time of day. from datetime import time shadows the module name — a common source of confusion.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/datetime.html#time-objects',
    meta:  'time objects',
  },
};
