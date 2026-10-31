// content/reference/python/stdlib/calendar/month_name.js — month_name and month_abbr

export const meta = {
  slug:        'month_name',
  name:        'calendar.month_name / month_abbr',
  signature:   'calendar.month_name[i] · calendar.month_abbr[i]',
  blurb:       'Month names and abbreviations in the current locale, indexed 1–12 — index 0 is an empty string.',
  category:    'constants',
  type:        'constant',
  hasLiveDemo: true,
  version:     'Python 3 (all versions)',
  searchTerms: 'calendar month_name month_abbr python month name from number month number from name list of month names january jan abbreviation locale month names',
};

export const method = {
  slug:      'month_name',
  name:      'calendar.month_name / month_abbr',
  signature: 'calendar.month_name[i] · calendar.month_abbr[i]',
  returns:   { type: 'str', desc: "One name; list(calendar.month_name) gives all 13 entries, starting with ''." },

  category:    'calendar constant',
  version:     'Python 3 (all versions)',
  hasLiveDemo: true,

  subtitle: 'Read-only sequences of 13 items so that month_name[1] is January — the month number is the index. The names come from strftime in the current LC_TIME locale: English unless your program has called locale.setlocale.',

  covers: ['month_name', 'month_abbr'],

  cheat: {
    commonCall: 'calendar.month_name[10]',
    returns:    "'October' (month_abbr[10] is 'Oct')",
    replaces:   'a hand-written list of month names',
    watchOut:   "index 0 is ''; the names follow the locale",
  },

  parameters: [
    { name: 'i', type: 'int | slice', required: true, default: null, desc: '1–12 for a month, 0 for the empty placeholder; negative indexes and slices work like a list (-1 is December).' },
  ],

  modes: [
    {
      id: 'lookup',
      label: 'number → name',
      blurb: 'Both sequences at the same index.',
      params: [{ name: 'i', type: 'int', hint: '0–12', input: 'number' }],
      template: 'import calendar\n(calendar.month_name[{$i}], calendar.month_abbr[{$i}])',
      cases: [
        { id: 'oct',  label: '10', values: { i: '10' } },
        { id: 'zero', label: '0',  values: { i: '0' } },
        { id: 'neg',  label: '-1', values: { i: '-1' } },
        { id: 'big',  label: '13', values: { i: '13' } },
      ],
    },
    {
      id: 'parse',
      label: 'abbreviation → number',
      blurb: 'The position in month_abbr is the month number. Exact, case-sensitive match.',
      params: [{ name: 'abbr', type: 'str', hint: 'e.g. Mar', input: 'text' }],
      template: 'import calendar\nlist(calendar.month_abbr).index({$abbr})',
      cases: [
        { id: 'mar',   label: "'Mar'",   values: { abbr: 'Mar' } },
        { id: 'full',  label: "'March'", values: { abbr: 'March' } },
        { id: 'lower', label: "'mar'",   values: { abbr: 'mar' } },
      ],
    },
  ],
  demoExplainer: 'Index 0 is the empty placeholder that makes the numbering 1-based, and -1 wraps around to December just like a list; 13 is past the end. Looking a name up is a plain list.index, so "March" is not found in the abbreviations and "mar" differs in case.',

  patterns: [
    {
      name: 'Month number → name',
      desc: 'The index is the month.',
      code: 'import calendar\nlabel = calendar.month_name[d.month]',
    },
    {
      name: 'Name → number, case-insensitive',
      desc: 'A dict built once from the sequence.',
      code: 'import calendar\nMONTHS = {name.lower(): i for i, name in enumerate(calendar.month_abbr) if name}\nmonth = MONTHS[text[:3].lower()]',
    },
    {
      name: 'All twelve names',
      desc: 'Skip the empty entry.',
      code: 'import calendar\nnames = list(calendar.month_name)[1:]',
    },
  ],

  examples: [
    { title: 'All entries',                 code: 'import calendar\nlist(calendar.month_name)', returns: "['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']" },
    { title: 'Abbreviations',               code: 'import calendar\nlist(calendar.month_abbr)[1:]', returns: "['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']" },
    { title: 'Thirteen items',              code: 'import calendar\nlen(calendar.month_name)', returns: '13' },
    { title: 'Name → number',               code: "import calendar\nlist(calendar.month_name).index('October')", returns: '10' },
    { title: 'Slices give lists',           code: 'import calendar\ncalendar.month_abbr[1:4]', returns: "['Jan', 'Feb', 'Mar']" },
    { title: 'A Month member is a valid index', code: 'import calendar\ncalendar.month_name[calendar.OCTOBER]', returns: "'October'" },
    { title: 'Not a list',                  code: 'import calendar\ntype(calendar.month_name).__name__', returns: "'_localized_month'" },
  ],

  pitfalls: [
    {
      name: 'Counting months from 0',
      desc: 'Entry 0 is an empty string so that the month number can be used directly.',
      wrong: { label: 'month_name[0]', code: 'import calendar\ncalendar.month_name[0]', output: "''" },
      fix:   { label: 'month_name[1]', code: 'import calendar\ncalendar.month_name[1]', output: "'January'" },
    },
    {
      name: 'Case-sensitive lookups',
      desc: 'index() compares exactly; user input like "mar" is not found.',
      wrong: { label: 'index(text)', code: "import calendar\nlist(calendar.month_abbr).index('mar')", output: "ValueError: 'mar' is not in list" },
      fix:   { label: 'compare lower-case', code: "import calendar\n[a.lower() for a in calendar.month_abbr].index('mar')", output: '3' },
    },
  ],

  when: {
    use: [
      'Labels for month numbers in reports and UIs',
      'Parsing month names that match the locale of the running program',
    ],
    avoid: [
      'Names in a fixed language regardless of locale → your own tuple',
      'Formatting a whole date → date.strftime("%B %Y")',
    ],
  },

  notes: {
    cpython:     'Lib/calendar.py: _localized_month calls datetime.date(2001, i, 1).strftime("%B" or "%b") on every access, so a later locale.setlocale changes the names',
    'Type':      'Not a list or tuple — a small class with __getitem__ and __len__ (13); list() turns it into a real list',
    'Locale':    'Python starts with the C locale for LC_TIME, which gives the English names',
    '3.15':      'standalone_month_name / standalone_month_abbr are added for languages whose month names change form inside a date (docs.python.org)',
  },

  related: [
    { name: 'Month enum',      slug: 'month-enum', when: 'JANUARY … DECEMBER as named ints' },
    { name: 'day_name / day_abbr', slug: 'day_name', when: 'The weekday names' },
    { name: 'LocaleTextCalendar', slug: 'localetextcalendar', when: 'Names in another locale' },
    { name: 'date.strftime',   slug: 'strftime-strptime', when: '%B and %b in a format string', category: 'stdlib/datetime' },
    { name: 'calendar module', slug: 'calendar', when: 'Overview', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I get the month name from a number in Python?',
      a: 'calendar.month_name[n] for the full name, calendar.month_abbr[n] for the three-letter form. They are 1-based: month_name[1] is "January" and month_name[0] is an empty string.',
    },
    {
      q: 'How do I convert a month name to its number?',
      a: "list(calendar.month_name).index('October') returns 10. For user input, compare in lower case: [m.lower() for m in calendar.month_abbr].index('oct').",
    },
    {
      q: 'Why does calendar.month_name have 13 entries?',
      a: 'So that the month number is the index. Entry 0 is an empty string placeholder; len(calendar.month_name) is 13.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/calendar.html#calendar.month_name',
    meta:  'calendar.month_name',
  },

};
