// content/reference/python/stdlib/datetime/timedelta.js — the timedelta class

export const meta = {
  slug:        'timedelta',
  name:        'datetime.timedelta',
  signature:   'timedelta(days=0, seconds=0, microseconds=0, milliseconds=0, minutes=0, hours=0, weeks=0)',
  blurb:       'A duration: the difference between two dates or datetimes, and the amount you add to one. Normalized to days, seconds and microseconds.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 2.3+',
  searchTerms: 'timedelta duration python add days to date subtract dates difference hours minutes weeks timedelta arithmetic divide multiply negative timedelta str format months years',
};

export const method = {
  slug:      'timedelta',
  name:      'datetime.timedelta',
  signature: 'timedelta(days=0, seconds=0, microseconds=0, milliseconds=0, minutes=0, hours=0, weeks=0)',
  returns:   { type: 'timedelta', desc: 'A normalized duration: 0 <= seconds < 86400, 0 <= microseconds < 1000000, days carries the sign.' },

  category:    'datetime class',
  version:     'Python 2.3+',
  hasLiveDemo: true,

  subtitle: 'Seven keyword units in, three fields out. Everything is folded into days, seconds (0–86399) and microseconds, so a negative duration shows up as "-1 day, 23:00:00".',

  covers: ['timedelta'],

  cheat: {
    commonCall: 'datetime.now(UTC) + timedelta(days=7)',
    returns:    'timedelta(days=…, seconds=…, microseconds=…)',
    replaces:   'Manual seconds arithmetic: t + 7 * 24 * 3600',
    watchOut:   'No months or years — their length varies',
  },

  parameters: [
    { name: 'days',         type: 'int | float', required: false, default: '0', desc: 'Whole or fractional days.' },
    { name: 'seconds',      type: 'int | float', required: false, default: '0', desc: 'Seconds; values ≥ 86400 roll into days.' },
    { name: 'microseconds', type: 'int | float', required: false, default: '0', desc: 'Microseconds, the resolution. Fractions round half to even.' },
    { name: 'milliseconds', type: 'int | float', required: false, default: '0', desc: '= 1000 microseconds.' },
    { name: 'minutes',      type: 'int | float', required: false, default: '0', desc: '= 60 seconds.' },
    { name: 'hours',        type: 'int | float', required: false, default: '0', desc: '= 3600 seconds.' },
    { name: 'weeks',        type: 'int | float', required: false, default: '0', desc: '= 7 days.' },
  ],

  modes: [
    {
      id: 'normalize',
      label: 'normalize',
      blurb: 'Mix any units, including negatives. The repr shows how Python stores it; str() is the h:mm:ss form.',
      params: [
        { name: 'days',    type: 'int', hint: 'days',    input: 'number' },
        { name: 'hours',   type: 'int', hint: 'hours',   input: 'number' },
        { name: 'minutes', type: 'int', hint: 'minutes', input: 'number' },
        { name: 'seconds', type: 'int', hint: 'seconds', input: 'number' },
      ],
      template: 'from datetime import timedelta\nd = timedelta(days={$days}, hours={$hours}, minutes={$minutes}, seconds={$seconds})\n(d, str(d))',
      cases: [
        { id: 'carry',  label: 'overflowing units', values: { days: '1', hours: '36', minutes: '90', seconds: '0' } },
        { id: 'neg',    label: 'minus one hour',    values: { days: '0', hours: '-1', minutes: '0', seconds: '0' } },
        { id: 'mixed',  label: 'mixed signs',       values: { days: '2', hours: '-30', minutes: '15', seconds: '-1' } },
        { id: 'zero',   label: 'zero',              values: { days: '0', hours: '0', minutes: '0', seconds: '0' } },
        { id: 'huge',   label: 'too big',           values: { days: '999999999', hours: '24', minutes: '0', seconds: '0' } },
      ],
    },
    {
      id: 'divide',
      label: 'divide',
      blurb: 'Dividing a duration by a duration: how many steps fit (/ gives a float, // an int) and what is left over (%).',
      params: [
        { name: 'hours',   type: 'int', hint: 'total, in hours',  input: 'number' },
        { name: 'minutes', type: 'int', hint: 'step, in minutes', input: 'number' },
      ],
      template: 'from datetime import timedelta\ntotal = timedelta(hours={$hours})\nstep = timedelta(minutes={$minutes})\n(total / step, total // step, total % step)',
      cases: [
        { id: 'slots', label: '45-minute slots', values: { hours: '8', minutes: '45' } },
        { id: 'exact', label: 'fits exactly',    values: { hours: '2', minutes: '30' } },
        { id: 'neg',   label: 'negative total',  values: { hours: '-1', minutes: '25' } },
        { id: 'zero',  label: 'zero step',       values: { hours: '1', minutes: '0' } },
      ],
    },
    {
      id: 'scale',
      label: 'multiply',
      blurb: 'Multiply by an int or a float. The result is rounded to the nearest microsecond (ties to even).',
      params: [
        { name: 'minutes', type: 'int',   hint: 'a duration in minutes', input: 'number' },
        { name: 'factor',  type: 'float', hint: 'a factor',              input: 'float' },
      ],
      template: 'from datetime import timedelta\ntimedelta(minutes={$minutes}) * {$factor}',
      cases: [
        { id: 'half',  label: '× 2.5',    values: { minutes: '90', factor: '2.5' } },
        { id: 'third', label: '× 1/3',    values: { minutes: '10', factor: '0.3333333333333333' } },
        { id: 'neg',   label: '× -1',     values: { minutes: '1', factor: '-1' } },
      ],
    },
  ],
  demoExplainer: 'The normalized form explains the odd-looking reprs: minus one hour is stored as days=-1, seconds=82800 (−86400 + 82800 = −3600 seconds), and str() prints it the same way, "-1 day, 23:00:00". Division by a timedelta needs a non-zero step; % keeps the sign of the step, like int %.',

  patterns: [
    {
      name: 'N days from a date',
      desc: 'date + timedelta → date; datetime + timedelta → datetime.',
      code: 'from datetime import date, timedelta\ndue = date(2026, 9, 29) + timedelta(days=30)',
    },
    {
      name: 'Sum durations',
      desc: 'sum() starts from 0 (an int) — give it a timedelta start value.',
      code: 'from datetime import timedelta\ntotal = sum(durations, timedelta())',
    },
    {
      name: 'Format as H:MM without days',
      desc: 'divmod on total seconds gives any layout you like.',
      code: "minutes, seconds = divmod(int(d.total_seconds()), 60)\nhours, minutes = divmod(minutes, 60)\nlabel = f'{hours}:{minutes:02d}'",
    },
    {
      name: 'Round a datetime to 15 minutes',
      desc: 'timedelta % timedelta gives the remainder to strip off (naive dt; datetime.min is naive).',
      code: 'from datetime import timedelta\nq = timedelta(minutes=15)\nrounded_down = dt - (dt - dt.min) % q',
    },
  ],

  examples: [
    { title: 'Units are normalized',          code: 'from datetime import timedelta\ntimedelta(days=1, hours=36, minutes=90)', returns: 'datetime.timedelta(days=2, seconds=48600)' },
    { title: 'Negative durations',            code: 'from datetime import timedelta\nd = timedelta(hours=-1)\nprint(d)\nd', returns: '-1 day, 23:00:00\ndatetime.timedelta(days=-1, seconds=82800)' },
    { title: 'How many fit',                  code: 'from datetime import timedelta\ntimedelta(weeks=1) / timedelta(days=1)', returns: '7.0' },
    { title: 'Floor division and remainder',  code: 'from datetime import timedelta\ndivmod(timedelta(hours=10), timedelta(hours=3))', returns: '(3, datetime.timedelta(seconds=3600))' },
    { title: 'Divide by an int',              code: 'from datetime import timedelta\ntimedelta(minutes=10) / 7', returns: 'datetime.timedelta(seconds=85, microseconds=714286)' },
    { title: 'Fractions of a microsecond round to even', code: 'from datetime import timedelta\n(timedelta(microseconds=0.5), timedelta(microseconds=1.5))', returns: '(datetime.timedelta(0), datetime.timedelta(microseconds=2))' },
    { title: 'Compare durations',             code: 'from datetime import timedelta\ntimedelta(hours=24) == timedelta(days=1)', returns: 'True' },
    { title: 'The range limit',               code: 'from datetime import timedelta\ntimedelta(days=1_000_000_000)', returns: 'OverflowError: days=1000000000; must have magnitude <= 999999999' },
  ],

  pitfalls: [
    {
      name: 'timedelta(months=1)',
      desc: 'There is no months (or years) argument — a month is 28 to 31 days. Use replace() on the date, or calendar.monthrange to clamp the day.',
      wrong: { label: 'months=', code: 'from datetime import timedelta\ntimedelta(months=1)', output: "TypeError: __new__() got an unexpected keyword argument 'months'" },
      fix:   { label: 'replace(month=…)', code: 'from datetime import date\ndate(2026, 9, 29).replace(month=10)', output: 'datetime.date(2026, 10, 29)' },
    },
    {
      name: 'sum() of timedeltas without a start',
      desc: 'sum() starts from the int 0, and int + timedelta is not defined.',
      wrong: { label: 'sum(list)', code: 'from datetime import timedelta\nsum([timedelta(minutes=30), timedelta(minutes=45)])', output: "TypeError: unsupported operand type(s) for +: 'int' and 'datetime.timedelta'" },
      fix:   { label: 'sum(list, timedelta())', code: 'from datetime import timedelta\nsum([timedelta(minutes=30), timedelta(minutes=45)], timedelta())', output: 'datetime.timedelta(seconds=4500)' },
    },
    {
      name: 'Reading .seconds as the length',
      desc: '.seconds is only the part below one day. A 26-hour duration has seconds=7200.',
      wrong: { label: '.seconds', code: 'from datetime import timedelta\ntimedelta(hours=26).seconds', output: '7200' },
      fix:   { label: '.total_seconds()', code: 'from datetime import timedelta\ntimedelta(hours=26).total_seconds()', output: '93600.0' },
    },
  ],

  when: {
    use: [
      'Adding or subtracting fixed amounts of time from dates and datetimes',
      'The result of date - date or datetime - datetime',
      'Timeouts, TTLs and intervals you want to print or compare',
    ],
    avoid: [
      'Calendar months and years → replace(), or dateutil.relativedelta (third-party)',
      'Wall-clock arithmetic across DST changes → do it in UTC, then convert',
      'Measuring code speed → time.perf_counter()',
    ],
  },

  notes: {
    cpython:     'delta_new in Modules/_datetimemodule.c: int arguments are summed exactly as microseconds; float fractions are accumulated separately and rounded half to even once at the end',
    'Range':     'timedelta.min is -999999999 days, timedelta.max is 999999999 days, 23:59:59.999999; beyond that OverflowError',
    'Operators': '+ - with timedelta, date, datetime; * by int/float; / by int/float/timedelta; // by int/timedelta; % and divmod by timedelta; abs(), -d, comparisons',
    'Truth':     'timedelta(0) is falsy, every other duration is truthy',
  },

  related: [
    { name: 'days / seconds / total_seconds', slug: 'timedelta-total-seconds', when: 'Reading a duration back out' },
    { name: 'min / max / resolution', slug: 'min-max-resolution', when: 'The limits of timedelta' },
    { name: 'datetime', slug: 'datetime', when: 'Subtracting datetimes gives a timedelta' },
    { name: 'date', slug: 'date', when: 'date + timedelta uses whole days only' },
    { name: 'datetime module', slug: 'datetime', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I add days to a date in Python?',
      a: 'date + timedelta(days=n). It works for negative n too, and crosses month and year ends correctly: date(2026, 12, 31) + timedelta(days=1) is date(2027, 1, 1).',
    },
    {
      q: 'Why does a negative timedelta print as "-1 day, 23:00:00"?',
      a: 'Only days can be negative; seconds and microseconds are always positive. -1 hour is therefore stored as -1 day plus 23 hours. abs(d) or -d gives the positive duration if you want to print "1:00:00" with your own minus sign.',
    },
    {
      q: 'How do I convert a timedelta to minutes or hours?',
      a: 'd.total_seconds() / 60 for minutes, / 3600 for hours — or divide by a unit: d / timedelta(minutes=1). Use // for whole units.',
    },
    {
      q: 'Can a timedelta hold months or years?',
      a: 'No. Its largest unit is weeks, because months and years have no fixed length. For calendar arithmetic change the date fields (replace) or use dateutil.relativedelta.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/datetime.html#timedelta-objects',
    meta:  'timedelta objects',
  },
};
