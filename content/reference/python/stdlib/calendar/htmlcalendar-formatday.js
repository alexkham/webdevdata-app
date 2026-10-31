// content/reference/python/stdlib/calendar/htmlcalendar-formatday.js — the HTMLCalendar building blocks

export const meta = {
  slug:        'htmlcalendar-formatday',
  name:        'HTMLCalendar.formatday / formatweek / formatweekday …',
  signature:   'cal.formatday(day, weekday) · cal.formatweek(theweek) · cal.formatweekday(day) · cal.formatweekheader() · cal.formatmonthname(theyear, themonth, withyear=True)',
  blurb:       'The cells and rows HTMLCalendar tables are built from: a <td> per day, a <tr> per week, a <th> per weekday name, the header row and the title row.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: 'HTMLCalendar.formatday HTMLCalendar.formatweek HTMLCalendar.formatweekday HTMLCalendar.formatweekheader HTMLCalendar.formatmonthname formatday formatweek formatweekday formatweekheader formatmonthname td th tr override links events html calendar cell',
};

export const method = {
  slug:      'htmlcalendar-formatday',
  name:      'HTMLCalendar.formatday / formatweek / formatweekday …',
  signature: 'cal.formatday(day, weekday) · cal.formatweek(theweek) · cal.formatweekday(day) · cal.formatweekheader() · cal.formatmonthname(theyear, themonth, withyear=True)',
  returns:   { type: 'str', desc: 'One HTML fragment: <td …>, <tr>…</tr>, <th …> or the title <tr>.' },

  category:    'HTMLCalendar method',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  subtitle: 'Override these to change the markup: formatmonth calls formatmonthname, formatweekheader (→ formatweekday) and formatweek (→ formatday). Day cells get the weekday\'s CSS class, padding cells get "noday".',

  covers: ['HTMLCalendar.formatday', 'HTMLCalendar.formatweek', 'HTMLCalendar.formatweekday', 'HTMLCalendar.formatweekheader', 'HTMLCalendar.formatmonthname'],

  cheat: {
    commonCall: 'calendar.HTMLCalendar().formatday(5, calendar.WEDNESDAY)',
    returns:    '\'<td class="wed">5</td>\'',
    replaces:   'string templates for table cells',
    watchOut:   'formatday gets no month or year — only the day and its weekday',
  },

  parameters: [
    { name: 'day',      type: 'int',  required: true,  default: null,   desc: 'formatday: day of month, 0 for a padding cell. formatweekday: weekday 0–6.' },
    { name: 'weekday',  type: 'int',  required: true,  default: null,   desc: 'formatday: picks the CSS class from cssclasses[weekday].' },
    { name: 'theweek',  type: 'list[tuple[int, int]]', required: true, default: null, desc: 'formatweek: seven (day, weekday) pairs, e.g. one week of monthdays2calendar().' },
    { name: 'withyear', type: 'bool', required: false, default: 'True', desc: 'formatmonthname: include the year in the title.' },
  ],

  modes: [
    {
      id: 'day',
      label: 'formatday',
      blurb: 'One cell. The weekday picks the CSS class; day 0 is a padding cell.',
      params: [
        { name: 'day',     type: 'int', hint: 'day, 0 = padding', input: 'number' },
        { name: 'weekday', type: 'int', hint: '0–6',              input: 'number' },
      ],
      template: 'import calendar\ncalendar.HTMLCalendar().formatday({$day}, {$weekday})',
      cases: [
        { id: 'wed',  label: '5, Wednesday', values: { day: '5', weekday: '2' } },
        { id: 'pad',  label: 'padding',      values: { day: '0', weekday: '2' } },
        { id: 'bad',  label: 'weekday 7',    values: { day: '5', weekday: '7' } },
      ],
    },
    {
      id: 'week',
      label: 'formatweek',
      blurb: 'One <tr> from a week of monthdays2calendar (row 0 = first, -1 = last).',
      params: [
        { name: 'year',  type: 'int', hint: 'any year',   input: 'number' },
        { name: 'month', type: 'int', hint: '1–12',       input: 'number' },
        { name: 'row',   type: 'int', hint: 'week index', input: 'number' },
      ],
      template: 'import calendar\ncal = calendar.HTMLCalendar()\ncal.formatweek(cal.monthdays2calendar({$year}, {$month})[{$row}])',
      cases: [
        { id: 'first', label: 'first week', values: { year: '2026', month: '10', row: '0' } },
        { id: 'last',  label: 'last week',  values: { year: '2026', month: '10', row: '-1' } },
      ],
    },
    {
      id: 'header',
      label: 'formatweekheader',
      blurb: 'The header row in the object\'s first-weekday order.',
      params: [{ name: 'first', type: 'int', hint: '0 = Monday … 6 = Sunday', input: 'number' }],
      template: 'import calendar\ncalendar.HTMLCalendar({$first}).formatweekheader()',
      cases: [
        { id: 'mon', label: 'Monday', values: { first: '0' } },
        { id: 'sun', label: 'Sunday', values: { first: '6' } },
      ],
    },
    {
      id: 'name',
      label: 'formatmonthname',
      blurb: 'The title row of a month table.',
      params: [
        { name: 'year',  type: 'int', hint: 'any year', input: 'number' },
        { name: 'month', type: 'int', hint: '1–12',     input: 'number' },
      ],
      template: 'import calendar\ncalendar.HTMLCalendar().formatmonthname({$year}, {$month})',
      cases: [
        { id: 'oct', label: 'Oct 2026', values: { year: '2026', month: '10' } },
        { id: 'bad', label: 'month 13', values: { year: '2026', month: '13' } },
      ],
    },
  ],
  demoExplainer: 'The weekday indexes the seven-item cssclasses list, so 7 is an IndexError. The day itself is only formatted with %d — HTMLCalendar never checks that 5 is a real date in any month. The header always uses the three-letter day_abbr names.',

  patterns: [
    {
      name: 'Link every day',
      desc: 'Keep the padding cells as they are.',
      code: "import calendar\n\nclass Linked(calendar.HTMLCalendar):\n    def formatday(self, day, weekday):\n        if day == 0:\n            return super().formatday(day, weekday)\n        return f'<td class=\"{self.cssclasses[weekday]}\"><a href=\"/day/{day}\">{day}</a></td>'",
    },
    {
      name: 'Full weekday names in the header',
      desc: 'formatweekday always uses day_abbr; override it.',
      code: "import calendar\n\nclass FullNames(calendar.HTMLCalendar):\n    def formatweekday(self, day):\n        return f'<th class=\"{self.cssclasses_weekday_head[day]}\">{calendar.day_name[day]}</th>'",
    },
  ],

  examples: [
    { title: 'A day cell',              code: 'import calendar\ncalendar.HTMLCalendar().formatday(5, calendar.WEDNESDAY)', returns: "'<td class=\"wed\">5</td>'" },
    { title: 'A padding cell, entity decoded', code: 'import calendar, html\nhtml.unescape(calendar.HTMLCalendar().formatday(0, calendar.WEDNESDAY))', returns: "'<td class=\"noday\">\\xa0</td>'" },
    { title: 'A week row',              code: 'import calendar\ncal = calendar.HTMLCalendar()\ncal.formatweek(cal.monthdays2calendar(2026, 10)[1])', returns: "'<tr><td class=\"mon\">5</td><td class=\"tue\">6</td><td class=\"wed\">7</td><td class=\"thu\">8</td><td class=\"fri\">9</td><td class=\"sat\">10</td><td class=\"sun\">11</td></tr>'" },
    { title: 'A weekday header cell',   code: 'import calendar\ncalendar.HTMLCalendar().formatweekday(calendar.SUNDAY)', returns: "'<th class=\"sun\">Sun</th>'" },
    { title: 'The title row',           code: 'import calendar\ncal = calendar.HTMLCalendar()\n(cal.formatmonthname(2026, 10), cal.formatmonthname(2026, 10, withyear=False))', returns: "('<tr><th colspan=\"7\" class=\"month\">October 2026</th></tr>', '<tr><th colspan=\"7\" class=\"month\">October</th></tr>')" },
    { title: 'Override formatday',      code: "import calendar\n\nclass Linked(calendar.HTMLCalendar):\n    def formatday(self, day, weekday):\n        if day == 0:\n            return super().formatday(day, weekday)\n        return f'<td class=\"{self.cssclasses[weekday]}\"><a href=\"/day/{day}\">{day}</a></td>'\n\nLinked().formatday(25, calendar.SUNDAY)", returns: "'<td class=\"sun\"><a href=\"/day/25\">25</a></td>'" },
  ],

  pitfalls: [
    {
      name: 'Expecting full weekday names',
      desc: 'formatweekday has no width argument and always uses day_abbr. Override it for full names.',
      wrong: { label: 'formatweekday(6)', code: 'import calendar\ncalendar.HTMLCalendar().formatweekday(6)', output: "'<th class=\"sun\">Sun</th>'" },
      fix:   { label: 'override with day_name', code: "import calendar\n\nclass FullNames(calendar.HTMLCalendar):\n    def formatweekday(self, day):\n        return f'<th class=\"{self.cssclasses_weekday_head[day]}\">{calendar.day_name[day]}</th>'\n\nFullNames().formatweekday(6)", output: "'<th class=\"sun\">Sunday</th>'" },
    },
    {
      name: 'Plain day numbers into formatweek',
      desc: 'formatweek unpacks (day, weekday) pairs — use monthdays2calendar rows.',
      wrong: { label: 'monthdayscalendar row', code: 'import calendar\ncal = calendar.HTMLCalendar()\ncal.formatweek(cal.monthdayscalendar(2026, 10)[0])', output: 'TypeError: cannot unpack non-iterable int object' },
      fix:   { label: 'monthdays2calendar row', code: "import calendar\ncal = calendar.HTMLCalendar()\ncal.formatweek(cal.monthdays2calendar(2026, 10)[0]).count('noday')", output: '3' },
    },
  ],

  when: {
    use: [
      'Subclassing HTMLCalendar to add links, events or extra classes',
      'Building a custom table from standard cells and rows',
    ],
    avoid: [
      'A complete month table → formatmonth',
      'Only renaming classes → the cssclass attributes, no override needed',
    ],
  },

  notes: {
    cpython:  'Lib/calendar.py: formatday → \'<td class="%s">%d</td>\' % (cssclasses[weekday], day) or the noday cell; formatweek → \'<tr>%s</tr>\'; formatweekday → \'<th class="%s">%s</th>\' % (cssclasses_weekday_head[day], day_abbr[day]); formatmonthname → \'<tr><th colspan="7" class="%s">%s</th></tr>\'',
    'Padding cell': 'Always <td class="noday">&nbsp;</td> (with your cssclass_noday) — the HTML entity for a non-breaking space; html.unescape turns it into \\xa0',
    'Errors': 'formatmonthname validates the month (IllegalMonthError, 3.12.8+ / 3.13.1+); formatday and formatweekday raise IndexError for a weekday outside the class lists',
  },

  related: [
    { name: 'HTMLCalendar.formatmonth', slug: 'htmlcalendar-formatmonth', when: 'Assembles these' },
    { name: 'CSS class attributes', slug: 'htmlcalendar-cssclasses', when: 'The class names they use' },
    { name: 'HTMLCalendar', slug: 'htmlcalendar', when: 'The class' },
    { name: 'TextCalendar.formatday …', slug: 'textcalendar-formatweek', when: 'The text counterparts' },
  ],

  faq: [
    {
      q: 'How do I add links or events to Python\'s HTMLCalendar?',
      a: 'Subclass it and override formatday(day, weekday) to return your own <td>. Keep day == 0 as a padding cell. If you need the month, store it in an overridden formatmonth.',
    },
    {
      q: 'Why does the HTMLCalendar header show Mon, Tue … instead of full names?',
      a: 'formatweekday always uses calendar.day_abbr. Override formatweekday to use calendar.day_name.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/calendar.html#calendar.HTMLCalendar',
    meta:  'HTMLCalendar',
  },

};
