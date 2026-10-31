// content/reference/python/stdlib/calendar/month-enum.js — calendar.Month and JANUARY … DECEMBER

export const meta = {
  slug:        'month-enum',
  name:        'calendar.Month',
  signature:   'calendar.Month(value) · calendar.JANUARY … calendar.DECEMBER',
  blurb:       'An IntEnum of the twelve months, JANUARY = 1 … DECEMBER = 12, whose members are also module constants.',
  category:    'constants',
  type:        'constant',
  hasLiveDemo: true,
  version:     'Python 3.12+',
  searchTerms: 'calendar Month enum python month constants JANUARY FEBRUARY MARCH APRIL MAY JUNE JULY AUGUST SEPTEMBER OCTOBER NOVEMBER DECEMBER intenum month number calendar.January deprecated',
};

export const method = {
  slug:      'month-enum',
  name:      'calendar.Month',
  signature: 'calendar.Month(value) · calendar.JANUARY … calendar.DECEMBER',
  returns:   { type: 'calendar.Month', desc: 'A member that is also an int: calendar.MARCH == 3.' },

  category:    'calendar constant',
  version:     'Python 3.12+',
  hasLiveDemo: true,

  subtitle: 'Named month numbers that still work everywhere an int does — as an argument to monthrange(), as an index into month_name, in arithmetic. calendar.MARCH and calendar.Month.MARCH are the same object.',

  covers: ['Month', 'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'],

  cheat: {
    commonCall: 'calendar.monthrange(2026, calendar.FEBRUARY)',
    returns:    '(calendar.SUNDAY, 28)',
    replaces:   'magic numbers 1–12 and the deprecated calendar.January / February',
    watchOut:   'str(calendar.MARCH) is "3" — use .name or month_name for text',
  },

  parameters: [
    { name: 'value', type: 'int', required: true, default: null, desc: 'Month(value) looks a member up by number, 1–12; Month[name] by its upper-case name.' },
  ],

  attributes: [
    { name: 'JANUARY … DECEMBER', type: 'Month', meaning: 'The members, valued 1 … 12, also exported as calendar.JANUARY … calendar.DECEMBER.' },
    { name: '.name',  type: 'str', meaning: 'The member name, e.g. "MARCH".' },
    { name: '.value', type: 'int', meaning: 'The month number, e.g. 3.' },
  ],

  modes: [
    {
      id: 'lookup',
      label: 'by number',
      blurb: 'Month(n): the member, its name, its value and the display name.',
      params: [{ name: 'n', type: 'int', hint: '1–12', input: 'number' }],
      template: 'import calendar\nm = calendar.Month({$n})\n(m, m.name, m.value, calendar.month_name[m])',
      cases: [
        { id: 'mar',  label: '3',  values: { n: '3' } },
        { id: 'dec',  label: '12', values: { n: '12' } },
        { id: 'zero', label: '0',  values: { n: '0' } },
      ],
    },
    {
      id: 'byname',
      label: 'by name',
      blurb: 'Month[name] needs the exact member name — upper case.',
      params: [{ name: 'name', type: 'str', hint: 'e.g. MARCH', input: 'text' }],
      template: 'import calendar\ncalendar.Month[{$name}]',
      cases: [
        { id: 'upper', label: "'MARCH'", values: { name: 'MARCH' } },
        { id: 'title', label: "'March'", values: { name: 'March' } },
      ],
    },
  ],
  demoExplainer: 'Month(0) is not a member: the enum has no placeholder, unlike month_name, whose index 0 is an empty string. Lookup by name is exact, so "March" raises KeyError — month_name holds the display form.',

  patterns: [
    {
      name: 'Readable month arguments',
      desc: 'Same call, no magic number.',
      code: 'import calendar\ndays = calendar.monthrange(year, calendar.FEBRUARY)[1]',
    },
    {
      name: 'Next month, wrapping December',
      desc: 'Arithmetic gives an int; wrap it, then convert back.',
      code: 'import calendar\nnext_month = calendar.Month(month % 12 + 1)',
    },
    {
      name: 'Iterate over the months',
      desc: 'In order, January first.',
      code: 'import calendar\nfor m in calendar.Month:\n    print(m.value, calendar.month_abbr[m])',
    },
  ],

  examples: [
    { title: 'By number',                code: 'import calendar\ncalendar.Month(3)', returns: 'calendar.MARCH' },
    { title: 'It is an int',             code: 'import calendar\n(calendar.MARCH == 3, isinstance(calendar.MARCH, int))', returns: '(True, True)' },
    { title: 'Module constant = enum member', code: 'import calendar\ncalendar.Month.MARCH is calendar.MARCH', returns: 'True' },
    { title: 'All members in order',     code: 'import calendar\nlist(calendar.Month)[:3]', returns: '[calendar.JANUARY, calendar.FEBRUARY, calendar.MARCH]' },
    { title: 'str() and format() give the number', code: "import calendar\n(str(calendar.MARCH), f'{calendar.MARCH}')", returns: "('3', '3')" },
    { title: 'Arithmetic returns plain ints', code: 'import calendar\ncalendar.DECEMBER + 1', returns: '13' },
    { title: 'The old names warn',       code: "import calendar, warnings\nwith warnings.catch_warnings(record=True) as caught:\n    warnings.simplefilter('always')\n    value = calendar.January\n(value, str(caught[0].message))", returns: "(1, \"The 'January' attribute is deprecated, use 'JANUARY' instead\")" },
    { title: 'Not a month',              code: 'import calendar\ncalendar.Month(13)', returns: 'ValueError: 13 is not a valid Month' },
  ],

  pitfalls: [
    {
      name: 'str() for display',
      desc: 'Month is an IntEnum, so str() and f-strings show the number. Use .name for the identifier or month_name for the text.',
      wrong: { label: 'str(member)', code: 'import calendar\nstr(calendar.MARCH)', output: "'3'" },
      fix:   { label: 'month_name[member]', code: 'import calendar\ncalendar.month_name[calendar.MARCH]', output: "'March'" },
    },
    {
      name: 'Adding 1 to DECEMBER',
      desc: 'Arithmetic leaves the enum; 13 is not a month. Wrap with % 12 before converting back.',
      wrong: { label: 'Month(DECEMBER + 1)', code: 'import calendar\ncalendar.Month(calendar.DECEMBER + 1)', output: 'ValueError: 13 is not a valid Month' },
      fix:   { label: 'Month(DECEMBER % 12 + 1)', code: 'import calendar\ncalendar.Month(calendar.DECEMBER % 12 + 1)', output: 'calendar.JANUARY' },
    },
  ],

  when: {
    use: [
      'Named month arguments in code that targets Python 3.12+',
      'Validating a month number: Month(n) raises ValueError for anything but 1–12',
    ],
    avoid: [
      'Display names → calendar.month_name (locale-aware)',
      'Code that must run on 3.11 or older → plain ints 1–12',
    ],
  },

  notes: {
    cpython:      'Lib/calendar.py: @global_enum class Month(IntEnum) with JANUARY = 1 … DECEMBER = 12; global_enum exports the members to the module and makes their repr calendar.MARCH',
    'Before 3.12': 'Only calendar.January and calendar.February existed, as plain ints (not in __all__); since 3.12 they still work but issue a DeprecationWarning',
    'Comparison': 'Members compare equal to ints and hash like them, so they work as dict keys alongside ints',
  },

  history: [
    { version: '3.12', note: 'Month enum added; JANUARY … DECEMBER exported; January / February deprecated' },
  ],

  related: [
    { name: 'Day enum',    slug: 'day-enum',    when: 'MONDAY … SUNDAY' },
    { name: 'month_name / month_abbr', slug: 'month_name', when: 'Display names' },
    { name: 'monthrange',  slug: 'monthrange',  when: 'Takes a month number' },
    { name: 'IllegalMonthError', slug: 'illegalmontherror', when: 'What a bad month raises in calendar functions' },
    { name: 'enum module', slug: 'enum',        when: 'IntEnum and global_enum', category: 'stdlib' },
    { name: 'calendar module', slug: 'calendar', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'What is calendar.Month in Python?',
      a: 'An IntEnum added in Python 3.12 with members JANUARY (1) to DECEMBER (12), also available as calendar.JANUARY … calendar.DECEMBER. Members are ints, so they work anywhere a month number does.',
    },
    {
      q: 'Why does calendar.January give a DeprecationWarning?',
      a: 'Before 3.12 the module had only calendar.January and calendar.February. They were replaced by the full set of upper-case constants; the old names still return 1 and 2 but warn "use \'JANUARY\' instead".',
    },
    {
      q: 'How do I get the month name from calendar.Month?',
      a: 'member.name gives the identifier ("MARCH"); calendar.month_name[member] gives the display name ("March") in the current locale.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/calendar.html#calendar.Month',
    meta:  'calendar.Month',
  },

};
