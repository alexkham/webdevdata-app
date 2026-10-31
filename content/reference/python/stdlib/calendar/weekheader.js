// content/reference/python/stdlib/calendar/weekheader.js

export const meta = {
  slug:        'weekheader',
  name:        'calendar.weekheader',
  signature:   'calendar.weekheader(width)',
  blurb:       'The row of weekday names that heads a text calendar — Mo Tu We … — each centered in width characters.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3 (all versions)',
  searchTerms: 'calendar weekheader python weekday header row day abbreviations mo tu we th fr sa su weekday names width',
};

export const method = {
  slug:      'weekheader',
  name:      'calendar.weekheader',
  signature: 'calendar.weekheader(width)',
  returns:   { type: 'str', desc: 'Seven names joined by single spaces, in the current first-weekday order.' },

  category:    'calendar function',
  version:     'Python 3 (all versions)',
  hasLiveDemo: true,

  subtitle: 'Abbreviated names cut to width letters (Mo, Tue, M …) — full names only from width 9. It follows the module-wide first weekday, so after setfirstweekday(SUNDAY) the row starts with Su.',

  covers: ['weekheader'],

  cheat: {
    commonCall: 'calendar.weekheader(2)',
    returns:    "'Mo Tu We Th Fr Sa Su'",
    replaces:   "' '.join(name[:2] for name in calendar.day_abbr)",
    watchOut:   'widths 4–8 pad the 3-letter abbreviations; trailing spaces are kept',
  },

  parameters: [
    { name: 'width', type: 'int', required: true, default: null, desc: 'Characters per name. Below 9: day_abbr cut to width; 9 or more: day_name. Each name is centered in width.' },
  ],

  modes: [
    {
      id: 'header',
      label: 'header',
      blurb: 'Try 1, 2, 3, 6 and 9.',
      params: [{ name: 'width', type: 'int', hint: 'characters per day', input: 'number' }],
      template: 'import calendar\ncalendar.weekheader({$width})',
      cases: [
        { id: 'w2', label: 'width 2', values: { width: '2' } },
        { id: 'w1', label: 'width 1', values: { width: '1' } },
        { id: 'w6', label: 'width 6', values: { width: '6' } },
        { id: 'w9', label: 'width 9', values: { width: '9' } },
      ],
    },
    {
      id: 'first',
      label: 'after setfirstweekday',
      blurb: 'The module-wide first weekday reorders the header. The snippet restores Monday afterwards.',
      params: [
        { name: 'first', type: 'int', hint: '0 = Monday … 6 = Sunday', input: 'number' },
        { name: 'width', type: 'int', hint: 'characters per day',      input: 'number' },
      ],
      template: 'import calendar\ntry:\n    calendar.setfirstweekday({$first})\n    header = calendar.weekheader({$width})\nfinally:\n    calendar.setfirstweekday(calendar.MONDAY)\nheader',
      cases: [
        { id: 'sun', label: 'Sunday',   values: { first: '6', width: '2' } },
        { id: 'sat', label: 'Saturday', values: { first: '5', width: '3' } },
        { id: 'bad', label: '7',        values: { first: '7', width: '2' } },
      ],
    },
  ],
  demoExplainer: 'Width 6 does not give longer names: below 9 the names come from day_abbr, which has only three letters, so they are centered with padding instead — and the last one keeps its trailing spaces. From 9 the full day_name is used. setfirstweekday only accepts 0–6, so 7 raises calendar.IllegalWeekdayError before anything changes.',

  patterns: [
    {
      name: 'Header without trailing spaces',
      desc: 'Centered names can leave spaces at the end.',
      code: 'import calendar\nheader = calendar.weekheader(4).rstrip()',
    },
    {
      name: 'A header in your own first-weekday order',
      desc: 'Without touching the module-wide setting.',
      code: 'import calendar\nheader = calendar.TextCalendar(calendar.SUNDAY).formatweekheader(2)',
    },
    {
      name: 'Single letters for a compact grid',
      desc: 'width=1.',
      code: 'import calendar\nletters = calendar.weekheader(1).split()',
    },
  ],

  examples: [
    { title: 'Two letters',           code: 'import calendar\ncalendar.weekheader(2)', returns: "'Mo Tu We Th Fr Sa Su'" },
    { title: 'Three letters',         code: 'import calendar\ncalendar.weekheader(3)', returns: "'Mon Tue Wed Thu Fri Sat Sun'" },
    { title: 'One letter',            code: 'import calendar\ncalendar.weekheader(1)', returns: "'M T W T F S S'" },
    { title: 'Full names from width 9', code: 'import calendar\ncalendar.weekheader(9)', returns: "'  Monday   Tuesday  Wednesday  Thursday   Friday   Saturday   Sunday '" },
    { title: 'Width 4 pads, it does not lengthen', code: 'import calendar\ncalendar.weekheader(4)', returns: "'Mon  Tue  Wed  Thu  Fri  Sat  Sun '" },
    { title: 'Length of the row',     code: 'import calendar\nlen(calendar.weekheader(2))', returns: '20' },
  ],

  pitfalls: [
    {
      name: 'Expecting full names at width 6',
      desc: 'Below 9 the source is day_abbr (three letters), centered in the width.',
      wrong: { label: 'weekheader(6)', code: 'import calendar\ncalendar.weekheader(6).split()', output: "['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" },
      fix:   { label: 'weekheader(9)', code: 'import calendar\ncalendar.weekheader(9).split()', output: "['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']" },
    },
    {
      name: 'Comparing with a stripped string',
      desc: 'Centering leaves trailing spaces after Sun at widths like 4.',
      wrong: { label: '== without rstrip', code: "import calendar\ncalendar.weekheader(4) == 'Mon  Tue  Wed  Thu  Fri  Sat  Sun'", output: 'False' },
      fix:   { label: 'rstrip() first', code: "import calendar\ncalendar.weekheader(4).rstrip() == 'Mon  Tue  Wed  Thu  Fri  Sat  Sun'", output: 'True' },
    },
  ],

  when: {
    use: [
      'Column headers for your own text calendar layout',
      'A quick list of localized weekday abbreviations in calendar order',
    ],
    avoid: [
      'Per-object first weekday → TextCalendar(firstweekday).formatweekheader',
      'The names as a list → list(calendar.day_abbr)',
    ],
  },

  notes: {
    cpython:   'Lib/calendar.py: weekheader = c.formatweekheader — joins formatweekday(i, width) for each i of iterweekdays()',
    'Names':   'From day_abbr (width < 9) or day_name, i.e. strftime %a / %A in the current LC_TIME locale',
    'Order':   'Starts with calendar.firstweekday() — Monday unless setfirstweekday() changed it',
  },

  related: [
    { name: 'TextCalendar.formatweekheader', slug: 'textcalendar-formatweek', when: 'The method, per object' },
    { name: 'day_name / day_abbr', slug: 'day_name', when: 'The names it uses' },
    { name: 'setfirstweekday', slug: 'setfirstweekday', when: 'Reorder the columns' },
    { name: 'calendar.month / prmonth', slug: 'month', when: 'A month with this header' },
    { name: 'calendar module', slug: 'calendar', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I get weekday abbreviations like Mo Tu We in Python?',
      a: 'calendar.weekheader(2) returns "Mo Tu We Th Fr Sa Su"; .split() makes it a list. weekheader(1) gives single letters and weekheader(3) the three-letter forms.',
    },
    {
      q: 'Why does calendar.weekheader(6) still show Mon, Tue …?',
      a: 'For widths below 9 the names come from day_abbr, which has three letters; extra width only adds padding. Full names (day_name) are used from width 9.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/calendar.html#calendar.weekheader',
    meta:  'calendar.weekheader',
  },

};
