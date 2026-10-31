// content/reference/python/stdlib/calendar/illegalmontherror.js

export const meta = {
  slug:        'illegalmontherror',
  name:        'calendar.IllegalMonthError',
  signature:   'calendar.IllegalMonthError(month)',
  blurb:       'Raised by the calendar functions for a month number outside 1–12: "bad month number 13; must be 1-12". A ValueError — and since Python 3.12.8 / 3.13.1 also an IndexError.',
  category:    'exceptions',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3 (all versions); also an IndexError since 3.12.8 / 3.13.1',
  searchTerms: 'calendar IllegalMonthError python bad month number must be 1-12 month 13 month 0 monthrange error invalid month valueerror indexerror calendar.error',
};

export const method = {
  slug:      'illegalmontherror',
  name:      'calendar.IllegalMonthError',
  signature: 'calendar.IllegalMonthError(month)',

  category:    'calendar exception',
  version:     'Python 3 (all versions); also an IndexError since 3.12.8 / 3.13.1',
  hasLiveDemo: true,

  subtitle: 'What monthrange(), monthcalendar(), month() and the Calendar methods raise when the month is not 1–12. Catch ValueError to cover it together with the plain ValueError that weekday() and timegm() raise for the same mistake.',

  covers: ['IllegalMonthError'],

  chain: ['BaseException', 'Exception', 'LookupError', 'IndexError', 'ValueError', 'IllegalMonthError'],

  cheat: {
    raisedBy: 'monthrange(), monthcalendar(), month() / prmonth(), the itermonth* and month*calendar methods, formatmonth() / formatmonthname() (3.12.8 / 3.13.1+)',
    message:  'bad month number 13; must be 1-12',
    quickFix: 'Pass 1–12 (not 0–11); catch ValueError around user input',
    watchOut: 'weekday() and timegm() raise a plain ValueError: month must be in 1..12 instead',
  },

  parameters: [
    { name: 'month', type: 'object', required: true, default: null, desc: 'The rejected value, stored in e.month and shown with repr() in the message — 13, 0, -1, 12.5 …' },
  ],

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: 'monthrange checks the month first. Try 13, 0 or a valid month.',
      params: [
        { name: 'year',  type: 'int', hint: 'any year', input: 'number' },
        { name: 'month', type: 'int', hint: '1–12',     input: 'number' },
      ],
      template: 'import calendar\ncalendar.monthrange({$year}, {$month})',
      cases: [
        { id: 'thirteen', label: 'month 13', values: { year: '2026', month: '13' } },
        { id: 'zero',     label: 'month 0',  values: { year: '2026', month: '0' } },
        { id: 'negative', label: 'month -1', values: { year: '2026', month: '-1' } },
        { id: 'valid',    label: 'month 2',  values: { year: '2026', month: '2' } },
      ],
    },
    {
      id: 'attributes',
      label: 'Attributes',
      blurb: 'Catch it and read the rejected value back: e.month, e.args and the message.',
      params: [
        { name: 'year',  type: 'int', hint: 'any year', input: 'number' },
        { name: 'month', type: 'int', hint: '1–12',     input: 'number' },
      ],
      template: "import calendar\ntry:\n    calendar.monthcalendar({$year}, {$month})\nexcept calendar.IllegalMonthError as e:\n    result = (e.month, e.args, str(e))\nelse:\n    result = 'valid month'\nresult",
      cases: [
        { id: 'zero',  label: 'month 0',  values: { year: '2026', month: '0' } },
        { id: 'big',   label: 'month 100', values: { year: '2026', month: '100' } },
        { id: 'ok',    label: 'month 10', values: { year: '2026', month: '10' } },
      ],
    },
    {
      id: 'who',
      label: 'Who raises it',
      blurb: 'The same bad month through three functions, each caught with except ValueError: which class arrives?',
      params: [{ name: 'month', type: 'int', hint: '1–12', input: 'number' }],
      template: "import calendar\ndef kind(f, *args):\n    try:\n        f(*args)\n    except ValueError as e:\n        return type(e).__name__\n    return 'ok'\n(kind(calendar.monthrange, 2026, {$month}), kind(calendar.weekday, 2026, {$month}, 1), kind(calendar.timegm, (2026, {$month}, 1, 0, 0, 0)))",
      cases: [
        { id: 'thirteen', label: 'month 13', values: { month: '13' } },
        { id: 'zero',     label: 'month 0',  values: { month: '0' } },
        { id: 'valid',    label: 'month 12', values: { month: '12' } },
      ],
    },
  ],
  demoExplainer: 'Only the calendar module\'s own checks raise IllegalMonthError: monthrange tests 1 <= month <= 12 before anything else. weekday() and timegm() leave the month to datetime.date, which raises a plain ValueError with a different message — so except ValueError is the one clause that handles all three. e.args holds the month itself, not the message: the class builds its text in __str__.',

  attributes: [
    { name: 'month', type: 'object', meaning: 'The month value that was rejected, exactly as passed (an int, or a float such as 12.5).' },
    { name: 'args',  type: 'tuple',  meaning: 'One item, the same month value — the message is produced by __str__, not stored.' },
  ],

  patterns: [
    {
      name: 'Validate user input',
      desc: 'One except clause for the calendar check and datetime\'s check.',
      code: "import calendar\ntry:\n    days = calendar.monthrange(year, month)[1]\nexcept ValueError as e:\n    print(f'invalid month: {e}')",
    },
    {
      name: 'Report the bad value',
      desc: 'e.month holds what was passed.',
      code: "import calendar\ntry:\n    weeks = calendar.monthcalendar(year, month)\nexcept calendar.IllegalMonthError as e:\n    raise SystemExit(f'month {e.month!r} is not 1-12')",
    },
    {
      name: 'Check before calling',
      desc: 'The same test the module does.',
      code: "if not 1 <= month <= 12:\n    raise ValueError(f'month must be 1-12, got {month}')",
    },
  ],

  examples: [
    { title: 'Month 13',                   code: 'import calendar\ncalendar.monthrange(2026, 13)', returns: 'calendar.IllegalMonthError: bad month number 13; must be 1-12' },
    { title: 'The value is kept on the exception', code: 'import calendar\ntry:\n    calendar.monthcalendar(2026, 0)\nexcept calendar.IllegalMonthError as e:\n    info = (e.month, e.args, str(e))\ninfo', returns: "(0, (0,), 'bad month number 0; must be 1-12')" },
    { title: 'Both a ValueError and an IndexError', code: 'import calendar\n(issubclass(calendar.IllegalMonthError, ValueError), issubclass(calendar.IllegalMonthError, IndexError))', returns: '(True, True)' },
    { title: 'The message uses repr()',    code: 'import calendar\ncalendar.monthrange(2026, 12.5)', returns: 'calendar.IllegalMonthError: bad month number 12.5; must be 1-12' },
    { title: 'month() checks it too',      code: 'import calendar\ncalendar.month(2026, -1)', returns: 'calendar.IllegalMonthError: bad month number -1; must be 1-12' },
    { title: 'weekday() does not raise it', code: 'import calendar\ncalendar.weekday(2026, 13, 1)', returns: 'ValueError: month must be in 1..12' },
    { title: 'Its repr',                   code: 'import calendar\nrepr(calendar.IllegalMonthError(0))', returns: "'IllegalMonthError(0)'" },
  ],

  pitfalls: [
    {
      name: 'Counting months from 0',
      desc: 'range(12) starts at 0, which no calendar function accepts. Month numbers run from 1 to 12.',
      wrong: { label: 'range(12)',    code: 'import calendar\n[calendar.monthrange(2026, m)[1] for m in range(12)]', output: 'calendar.IllegalMonthError: bad month number 0; must be 1-12' },
      fix:   { label: 'range(1, 13)', code: 'import calendar\n[calendar.monthrange(2026, m)[1] for m in range(1, 13)]', output: '[31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]' },
    },
    {
      name: 'Catching IllegalMonthError around timegm() or weekday()',
      desc: 'These two never raise it — datetime.date rejects the month first, with a plain ValueError — so the except clause does not match.',
      wrong: { label: 'except IllegalMonthError', code: 'import calendar\ntry:\n    seconds = calendar.timegm((2026, 13, 1, 0, 0, 0))\nexcept calendar.IllegalMonthError:\n    seconds = None\nseconds', output: 'ValueError: month must be in 1..12' },
      fix:   { label: 'except ValueError', code: 'import calendar\ntry:\n    seconds = calendar.timegm((2026, 13, 1, 0, 0, 0))\nexcept ValueError as e:\n    seconds = str(e)\nseconds', output: "'month must be in 1..12'" },
    },
  ],

  when: {
    use: [
      'except calendar.IllegalMonthError when only the calendar functions can fail and you want to report e.month',
      'except ValueError around user input, to cover datetime\'s month check as well',
    ],
    avoid: [
      'except IndexError in new code — that base exists only for backward compatibility',
      'Validating with a lookup like month_name[m] — index 0 and negative indexes do not fail',
    ],
  },

  notes: {
    cpython:        'Lib/calendar.py: class IllegalMonthError(ValueError, IndexError) — __init__ stores self.month, __str__ returns "bad month number %r; must be 1-12" % self.month. _validate_month() raises it when not 1 <= month <= 12',
    'Since 3.12.8 / 3.13.1': 'The IndexError base and the check in formatmonthname() arrived in the bugfix releases 3.12.8 and 3.13.1 (gh-126476). Earlier releases (checked on 3.12.3) derive the class from ValueError only, and there month(2026, 13) raised IndexError: list index out of range from month_name',
    'Lazy methods': 'The itermonth* methods are generators, so the error appears when iteration starts, not at the call',
    'calendar.error': 'The module also has calendar.error, an old alias of ValueError (not in __all__)',
  },

  history: [
    { version: '3.12.8 / 3.13.1', note: 'Also subclasses IndexError; formatmonthname() — and so month(), prmonth() and formatmonth() — raises it for a month above 12 instead of IndexError' },
  ],

  related: [
    { name: 'monthrange',   slug: 'monthrange',   when: 'The most common source' },
    { name: 'calendar.month / prmonth', slug: 'month', when: 'Checks the month since 3.12.8 / 3.13.1' },
    { name: 'Month enum',   slug: 'month-enum',   when: 'Named month numbers 1–12' },
    { name: 'IllegalWeekdayError', slug: 'illegalweekdayerror', when: 'The weekday counterpart' },
    { name: 'ValueError',   slug: 'valueerror',   when: 'The base class to catch', category: 'exceptions' },
    { name: 'IndexError',   slug: 'indexerror',   when: 'The compatibility base (3.12.8 / 3.13.1+)', category: 'exceptions' },
    { name: 'calendar module', slug: 'calendar',  when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What does "calendar.IllegalMonthError: bad month number 13; must be 1-12" mean?',
      a: 'A calendar function got a month outside 1–12. The usual causes are a 0-based month (range(12), JavaScript getMonth()) or month arithmetic that went past December — wrap it with (month - 1) % 12 + 1.',
    },
    {
      q: 'Should I catch IllegalMonthError or ValueError?',
      a: 'ValueError, unless you only call the calendar functions and want e.month. IllegalMonthError is a ValueError subclass, and weekday() and timegm() report the same mistake as a plain ValueError from datetime.',
    },
    {
      q: 'Why is IllegalMonthError also an IndexError?',
      a: 'Before the bugfix releases 3.12.8 and 3.13.1, month() and formatmonthname() looked the name up in month_name first, so month 13 failed with IndexError. Those releases validate the month there and raise IllegalMonthError, and added IndexError as a base class so existing except IndexError clauses still work.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/calendar.html#calendar.IllegalMonthError',
    meta:  'calendar.IllegalMonthError',
  },

};
