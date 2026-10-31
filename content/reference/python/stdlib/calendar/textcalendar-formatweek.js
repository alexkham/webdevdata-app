// content/reference/python/stdlib/calendar/textcalendar-formatweek.js — the TextCalendar building blocks

export const meta = {
  slug:        'textcalendar-formatweek',
  name:        'TextCalendar.formatday / formatweek / formatweekday …',
  signature:   'cal.formatday(day, weekday, width) · cal.formatweek(theweek, width) · cal.prweek(theweek, width) · cal.formatweekday(day, width) · cal.formatweekheader(width) · cal.formatmonthname(theyear, themonth, width, withyear=True)',
  blurb:       'The pieces formatmonth and formatyear are assembled from: one day, one week, one weekday name, the header row and the month title — each padded to a width.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: 'TextCalendar.formatday TextCalendar.formatweek TextCalendar.prweek TextCalendar.formatweekday TextCalendar.formatweekheader TextCalendar.formatmonthname formatday formatweek prweek formatweekday formatweekheader formatmonthname override subclass text calendar parts',
};

export const method = {
  slug:      'textcalendar-formatweek',
  name:      'TextCalendar.formatday / formatweek / formatweekday …',
  signature: 'cal.formatday(day, weekday, width) · cal.formatweek(theweek, width) · cal.prweek(theweek, width) · cal.formatweekday(day, width) · cal.formatweekheader(width) · cal.formatmonthname(theyear, themonth, width, withyear=True)',
  returns:   { type: 'str (prweek: None)', desc: 'A single padded piece of text without a newline; prweek prints formatweek\'s result with no newline.' },

  category:    'TextCalendar method',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  subtitle: 'Override these to restyle a text calendar: formatmonth and formatyear call formatmonthname, formatweekheader → formatweekday, and formatweek → formatday. Every width argument is required.',

  covers: ['TextCalendar.formatday', 'TextCalendar.formatweek', 'TextCalendar.prweek', 'TextCalendar.formatweekday', 'TextCalendar.formatweekheader', 'TextCalendar.formatmonthname'],

  cheat: {
    commonCall: 'cal.formatweek(cal.monthdays2calendar(2026, 10)[0], 2)',
    returns:    "'          1  2  3  4'",
    replaces:   'string padding arithmetic of your own',
    watchOut:   'formatweek needs (day, weekday) pairs — monthdays2calendar, not monthdayscalendar',
  },

  parameters: [
    { name: 'day',      type: 'int',  required: true,  default: null, desc: 'formatday: day of month, 0 for an empty cell. formatweekday: weekday 0–6.' },
    { name: 'weekday',  type: 'int',  required: true,  default: null, desc: 'formatday: the weekday of the cell (unused by TextCalendar itself, there for subclasses).' },
    { name: 'theweek',  type: 'list[tuple[int, int]]', required: true, default: null, desc: 'formatweek / prweek: seven (day, weekday) pairs, e.g. a week of monthdays2calendar().' },
    { name: 'width',    type: 'int',  required: true,  default: null, desc: 'Characters per piece; the text is centered in it. formatweekday uses full names from 9.' },
    { name: 'withyear', type: 'bool', required: false, default: 'True', desc: 'formatmonthname: append the year to the month name.' },
  ],

  modes: [
    {
      id: 'week',
      label: 'formatweek',
      blurb: 'One week of a month (row 0 is the first; -1 the last) at a column width.',
      params: [
        { name: 'year',  type: 'int', hint: 'any year',  input: 'number' },
        { name: 'month', type: 'int', hint: '1–12',      input: 'number' },
        { name: 'row',   type: 'int', hint: 'week index', input: 'number' },
        { name: 'width', type: 'int', hint: 'column width', input: 'number' },
      ],
      template: 'import calendar\ncal = calendar.TextCalendar()\ncal.formatweek(cal.monthdays2calendar({$year}, {$month})[{$row}], {$width})',
      cases: [
        { id: 'first', label: 'first week', values: { year: '2026', month: '10', row: '0', width: '2' } },
        { id: 'last',  label: 'last week',  values: { year: '2026', month: '10', row: '-1', width: '3' } },
        { id: 'w1',    label: 'width 1',    values: { year: '2026', month: '10', row: '1', width: '1' } },
      ],
    },
    {
      id: 'weekday',
      label: 'formatweekday',
      blurb: 'One weekday name, centered; abbreviations below width 9.',
      params: [
        { name: 'day',   type: 'int', hint: '0 = Monday … 6 = Sunday', input: 'number' },
        { name: 'width', type: 'int', hint: 'characters',              input: 'number' },
      ],
      template: 'import calendar\ncalendar.TextCalendar().formatweekday({$day}, {$width})',
      cases: [
        { id: 'w2',  label: 'width 2', values: { day: '2', width: '2' } },
        { id: 'w4',  label: 'width 4', values: { day: '2', width: '4' } },
        { id: 'w10', label: 'width 10', values: { day: '6', width: '10' } },
      ],
    },
    {
      id: 'name',
      label: 'formatmonthname',
      blurb: 'The month title centered in width characters.',
      params: [
        { name: 'year',  type: 'int', hint: 'any year',   input: 'number' },
        { name: 'month', type: 'int', hint: '1–12',       input: 'number' },
        { name: 'width', type: 'int', hint: 'characters', input: 'number' },
      ],
      template: 'import calendar\ncalendar.TextCalendar().formatmonthname({$year}, {$month}, {$width})',
      cases: [
        { id: 'w20', label: 'width 20', values: { year: '2026', month: '10', width: '20' } },
        { id: 'w0',  label: 'width 0',  values: { year: '2026', month: '10', width: '0' } },
        { id: 'bad', label: 'month 0',  values: { year: '2026', month: '0', width: '20' } },
      ],
    },
    {
      id: 'day',
      label: 'formatday',
      blurb: 'One day cell: right-aligned in two characters, then centered in width; 0 is blank.',
      params: [
        { name: 'day',   type: 'int', hint: 'day, 0 = empty', input: 'number' },
        { name: 'width', type: 'int', hint: 'characters',     input: 'number' },
      ],
      template: 'import calendar\ncalendar.TextCalendar().formatday({$day}, 0, {$width})',
      cases: [
        { id: 'd5', label: '5, width 2', values: { day: '5', width: '2' } },
        { id: 'd5w5', label: '5, width 5', values: { day: '5', width: '5' } },
        { id: 'd0', label: '0, width 3', values: { day: '0', width: '3' } },
      ],
    },
  ],
  demoExplainer: 'Days are first formatted with %2i — so 5 becomes " 5" — and only then centered, which is why a day can sit off-center in a wide column. formatweek joins seven cells with single spaces and keeps trailing spaces (formatmonth strips them later). The month name width counts the whole "October 2026" title; a width smaller than the text leaves it unpadded.',

  patterns: [
    {
      name: 'Highlight one day in the text grid',
      desc: 'Override formatday and return exactly width characters; use w=4 so the brackets fit.',
      code: "import calendar\n\nclass Highlight(calendar.TextCalendar):\n    def __init__(self, day, firstweekday=0):\n        super().__init__(firstweekday)\n        self.day = day\n\n    def formatday(self, day, weekday, width):\n        if day == self.day:\n            return f'[{day}]'.center(width)\n        return super().formatday(day, weekday, width)\n\nprint(Highlight(25).formatmonth(2026, 10, w=4))",
    },
    {
      name: 'Your own week rows',
      desc: 'formatweek on monthdays2calendar rows, one per line.',
      code: "import calendar\ncal = calendar.TextCalendar()\nlines = [cal.formatweek(week, 3) for week in cal.monthdays2calendar(2026, 10)]",
    },
  ],

  examples: [
    { title: 'formatday',              code: 'import calendar\ncal = calendar.TextCalendar()\n(cal.formatday(5, 0, 2), cal.formatday(0, 0, 3))', returns: "(' 5', '   ')" },
    { title: 'formatweek',             code: 'import calendar\ncal = calendar.TextCalendar()\ncal.formatweek(cal.monthdays2calendar(2026, 10)[0], 2)', returns: "'          1  2  3  4'" },
    { title: 'formatweekday',          code: 'import calendar\ncal = calendar.TextCalendar()\n(cal.formatweekday(0, 2), cal.formatweekday(2, 4), cal.formatweekday(2, 9))', returns: "('Mo', 'Wed ', 'Wednesday')" },
    { title: 'formatweekheader',       code: 'import calendar\ncalendar.TextCalendar(calendar.SUNDAY).formatweekheader(2)', returns: "'Su Mo Tu We Th Fr Sa'" },
    { title: 'formatmonthname',        code: 'import calendar\ncal = calendar.TextCalendar()\n(cal.formatmonthname(2026, 10, 20), cal.formatmonthname(2026, 10, 20, withyear=False))', returns: "('    October 2026    ', '      October       ')" },
    { title: 'prweek prints, no newline', code: "import calendar\ncal = calendar.TextCalendar()\ncal.prweek(cal.monthdays2calendar(2026, 10)[0], 2)\nprint('|')", returns: '          1  2  3  4|' },
  ],

  pitfalls: [
    {
      name: 'Passing plain day numbers to formatweek',
      desc: 'formatweek unpacks (day, weekday) pairs. Weeks from monthdayscalendar are plain ints.',
      wrong: { label: 'monthdayscalendar row', code: 'import calendar\ncal = calendar.TextCalendar()\ncal.formatweek(cal.monthdayscalendar(2026, 10)[0], 2)', output: 'TypeError: cannot unpack non-iterable int object' },
      fix:   { label: 'monthdays2calendar row', code: 'import calendar\ncal = calendar.TextCalendar()\ncal.formatweek(cal.monthdays2calendar(2026, 10)[0], 2)', output: "'          1  2  3  4'" },
    },
    {
      name: 'Leaving out width',
      desc: 'The docs show formatmonthname(theyear, themonth, width=0, …) and formatweek(theweek, w=0), but in CPython 3.13 width is a required argument.',
      wrong: { label: 'no width', code: 'import calendar\ncalendar.TextCalendar().formatmonthname(2026, 10)', output: "TypeError: TextCalendar.formatmonthname() missing 1 required positional argument: 'width'" },
      fix:   { label: 'width=0', code: 'import calendar\ncalendar.TextCalendar().formatmonthname(2026, 10, 0)', output: "'October 2026'" },
    },
  ],

  when: {
    use: [
      'Subclassing TextCalendar to change how one kind of piece looks',
      'Assembling a custom text layout from the standard pieces',
    ],
    avoid: [
      'A complete month or year → formatmonth / formatyear',
      'The module-level header → calendar.weekheader(width)',
    ],
  },

  notes: {
    cpython:          'Lib/calendar.py: formatday → ("%2i" % day).center(width) or "".center(width); formatweek → " ".join(formatday(d, wd, width) for d, wd in theweek); formatweekday → (day_name if width >= 9 else day_abbr)[day][:width].center(width); formatmonthname → validates the month, then "%s %r" % (name, theyear) centered',
    'Trailing spaces': 'The pieces keep their padding; formatmonth and formatyear right-strip whole lines',
    'prweek':          'print(self.formatweek(theweek, width), end="") — the module also has calendar.prweek and calendar.week, which are not in __all__',
  },

  related: [
    { name: 'TextCalendar.formatmonth / prmonth', slug: 'textcalendar-formatmonth', when: 'Uses these pieces' },
    { name: 'calendar.weekheader', slug: 'weekheader', when: 'Module-level formatweekheader' },
    { name: 'monthdayscalendar …', slug: 'monthdayscalendar', when: 'monthdays2calendar rows for formatweek' },
    { name: 'TextCalendar', slug: 'textcalendar', when: 'The class' },
    { name: 'HTMLCalendar.formatday …', slug: 'htmlcalendar-formatday', when: 'The HTML counterparts' },
  ],

  faq: [
    {
      q: 'How do I customise how days look in a Python text calendar?',
      a: 'Subclass calendar.TextCalendar and override formatday(day, weekday, width); keep the returned string exactly width characters so the columns stay aligned. formatweek, formatmonth and formatyear all go through it.',
    },
    {
      q: 'Why does formatweek raise "cannot unpack non-iterable int object"?',
      a: 'It expects each item of the week to be a (day, weekday) pair, as produced by monthdays2calendar. monthdayscalendar gives plain ints.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/calendar.html#calendar.TextCalendar.formatweek',
    meta:  'TextCalendar.formatweek',
  },

};
