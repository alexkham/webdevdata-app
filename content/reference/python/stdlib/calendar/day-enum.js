// content/reference/python/stdlib/calendar/day-enum.js — calendar.Day and MONDAY … SUNDAY

export const meta = {
  slug:        'day-enum',
  name:        'calendar.Day',
  signature:   'calendar.Day(value) · calendar.MONDAY … calendar.SUNDAY',
  blurb:       'An IntEnum of the weekdays, MONDAY = 0 … SUNDAY = 6, whose members are also module constants.',
  category:    'constants',
  type:        'constant',
  hasLiveDemo: true,
  version:     'Python 3.12+ (MONDAY … SUNDAY as plain ints before)',
  searchTerms: 'calendar Day enum python weekday constants MONDAY TUESDAY WEDNESDAY THURSDAY FRIDAY SATURDAY SUNDAY intenum weekday number monday 0 sunday 6',
};

export const method = {
  slug:      'day-enum',
  name:      'calendar.Day',
  signature: 'calendar.Day(value) · calendar.MONDAY … calendar.SUNDAY',
  returns:   { type: 'calendar.Day', desc: 'A member that is also an int: calendar.SUNDAY == 6.' },

  category:    'calendar constant',
  version:     'Python 3.12+ (MONDAY … SUNDAY as plain ints before)',
  hasLiveDemo: true,

  subtitle: 'The weekday numbers of the whole module with names: what weekday() and monthrange() return, what setfirstweekday() and Calendar(firstweekday) accept, and an index into day_name.',

  covers: ['Day', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'],

  cheat: {
    commonCall: 'calendar.TextCalendar(calendar.SUNDAY)',
    returns:    'a calendar whose weeks start on Sunday (6)',
    replaces:   'magic numbers 0–6',
    watchOut:   'Monday is 0 — not ISO 1, not JavaScript Sunday-0',
  },

  parameters: [
    { name: 'value', type: 'int', required: true, default: null, desc: 'Day(value) looks a member up by number, 0–6; Day[name] by its upper-case name.' },
  ],

  attributes: [
    { name: 'MONDAY … SUNDAY', type: 'Day', meaning: 'The members, valued 0 … 6, also exported as calendar.MONDAY … calendar.SUNDAY.' },
    { name: '.name',  type: 'str', meaning: 'The member name, e.g. "SUNDAY".' },
    { name: '.value', type: 'int', meaning: 'The weekday number, e.g. 6.' },
  ],

  modes: [
    {
      id: 'lookup',
      label: 'by number',
      blurb: 'Day(n): the member, its name and the display name.',
      params: [{ name: 'n', type: 'int', hint: '0–6', input: 'number' }],
      template: 'import calendar\nd = calendar.Day({$n})\n(d, d.name, calendar.day_name[d])',
      cases: [
        { id: 'mon',  label: '0', values: { n: '0' } },
        { id: 'sun',  label: '6', values: { n: '6' } },
        { id: 'iso',  label: '7', values: { n: '7' } },
      ],
    },
    {
      id: 'next',
      label: 'n days later',
      blurb: 'Arithmetic on a member gives an int; % 7 wraps it back into a weekday.',
      params: [
        { name: 'start', type: 'str', hint: 'a member name, e.g. FRIDAY', input: 'text' },
        { name: 'n',     type: 'int', hint: 'days to add',               input: 'number' },
      ],
      template: 'import calendar\ncalendar.Day((calendar.Day[{$start}] + {$n}) % 7)',
      cases: [
        { id: 'fri3',  label: 'FRIDAY + 3',  values: { start: 'FRIDAY', n: '3' } },
        { id: 'sun1',  label: 'SUNDAY + 1',  values: { start: 'SUNDAY', n: '1' } },
        { id: 'back',  label: 'MONDAY - 1',  values: { start: 'MONDAY', n: '-1' } },
        { id: 'lower', label: "'friday'",    values: { start: 'friday', n: '1' } },
      ],
    },
  ],
  demoExplainer: '7 is Sunday in ISO numbering (isoweekday), but Day only has 0–6. Python\'s % always returns a non-negative result for a positive divisor, so MONDAY - 1 wraps to SUNDAY instead of -1. Member names are upper case: Day["friday"] raises KeyError.',

  patterns: [
    {
      name: 'Readable first weekday',
      desc: 'Instead of a bare 6.',
      code: 'import calendar\ncal = calendar.TextCalendar(firstweekday=calendar.SUNDAY)',
    },
    {
      name: 'Weekend test',
      desc: 'Members compare like ints.',
      code: 'import calendar\nweekend = calendar.weekday(y, m, d) in (calendar.SATURDAY, calendar.SUNDAY)',
    },
    {
      name: 'Convert from ISO weekday',
      desc: 'isoweekday() is 1–7; Day is 0–6.',
      code: 'import calendar\nday = calendar.Day(d.isoweekday() - 1)',
    },
  ],

  examples: [
    { title: 'By number',              code: 'import calendar\ncalendar.Day(6)', returns: 'calendar.SUNDAY' },
    { title: 'By name',                code: "import calendar\ncalendar.Day['FRIDAY']", returns: 'calendar.FRIDAY' },
    { title: 'All members',            code: 'import calendar\nlist(calendar.Day)', returns: '[calendar.MONDAY, calendar.TUESDAY, calendar.WEDNESDAY, calendar.THURSDAY, calendar.FRIDAY, calendar.SATURDAY, calendar.SUNDAY]' },
    { title: 'weekday() returns one',  code: 'import calendar\ntype(calendar.weekday(2026, 10, 25))', returns: "<enum 'Day'>" },
    { title: 'Equal to its number',    code: 'import calendar\n(calendar.SUNDAY == 6, calendar.SUNDAY.value)', returns: '(True, 6)' },
    { title: 'Arithmetic gives an int', code: 'import calendar\ncalendar.SATURDAY + 1', returns: '6' },
    { title: 'Out of range',           code: 'import calendar\ncalendar.Day(7)', returns: 'ValueError: 7 is not a valid Day' },
  ],

  pitfalls: [
    {
      name: 'Adding without wrapping',
      desc: 'SUNDAY + 1 is the int 7, which is not a weekday.',
      wrong: { label: 'Day(SUNDAY + 1)', code: 'import calendar\ncalendar.Day(calendar.SUNDAY + 1)', output: 'ValueError: 7 is not a valid Day' },
      fix:   { label: 'Day((SUNDAY + 1) % 7)', code: 'import calendar\ncalendar.Day((calendar.SUNDAY + 1) % 7)', output: 'calendar.MONDAY' },
    },
    {
      name: 'Comparing with isoweekday()',
      desc: 'isoweekday() is one higher (Monday = 1, Sunday = 7); compare with weekday().',
      wrong: { label: 'isoweekday()', code: 'import calendar, datetime\ndatetime.date(2026, 10, 25).isoweekday() == calendar.SUNDAY', output: 'False' },
      fix:   { label: 'weekday()', code: 'import calendar, datetime\ndatetime.date(2026, 10, 25).weekday() == calendar.SUNDAY', output: 'True' },
    },
  ],

  when: {
    use: [
      'Readable weekday arguments: firstweekday=calendar.SUNDAY, w[calendar.FRIDAY]',
      'Interpreting weekday() / monthrange() results by name',
    ],
    avoid: [
      'Display text → calendar.day_name / day_abbr (locale-aware)',
      'ISO weekday numbers (1–7) → subtract 1 first',
    ],
  },

  notes: {
    cpython:       'Lib/calendar.py: @global_enum class Day(IntEnum) with MONDAY = 0 … SUNDAY = 6; global_enum puts the members in the module namespace and makes the repr calendar.SUNDAY',
    'Before 3.12': 'MONDAY … SUNDAY were plain ints from (MONDAY, …, SUNDAY) = range(7), and weekday() returned a plain int',
    'str()':       'An IntEnum member prints as its number: str(calendar.SUNDAY) is "6"',
  },

  history: [
    { version: '3.12', note: 'Day enum added; MONDAY … SUNDAY became its members; weekday() and monthrange() return Day members' },
  ],

  related: [
    { name: 'Month enum',  slug: 'month-enum', when: 'JANUARY … DECEMBER' },
    { name: 'weekday',     slug: 'weekday',    when: 'Returns a Day member' },
    { name: 'day_name / day_abbr', slug: 'day_name', when: 'Display names' },
    { name: 'setfirstweekday', slug: 'setfirstweekday', when: 'Takes a Day' },
    { name: 'enum module', slug: 'enum',       when: 'IntEnum and global_enum', category: 'stdlib' },
    { name: 'calendar module', slug: 'calendar', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Is Monday 0 or 1 in Python?',
      a: 'In calendar and in date.weekday() Monday is 0 and Sunday is 6 (calendar.MONDAY … calendar.SUNDAY). date.isoweekday() is the ISO numbering, Monday 1 … Sunday 7.',
    },
    {
      q: 'What does calendar.SUNDAY equal?',
      a: '6. Since Python 3.12 it is a member of the calendar.Day IntEnum (repr calendar.SUNDAY), but it compares equal to 6 and works anywhere an int does.',
    },
    {
      q: 'How do I get the next weekday as a Day member?',
      a: 'calendar.Day((day + 1) % 7). Arithmetic on members returns plain ints, so wrap with % 7 and convert back with Day(...).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/calendar.html#calendar.Day',
    meta:  'calendar.Day',
  },

};
