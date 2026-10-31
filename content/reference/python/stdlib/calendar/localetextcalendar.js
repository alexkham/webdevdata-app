// content/reference/python/stdlib/calendar/localetextcalendar.js — LocaleTextCalendar and LocaleHTMLCalendar

export const meta = {
  slug:        'localetextcalendar',
  name:        'calendar.LocaleTextCalendar / LocaleHTMLCalendar',
  signature:   'calendar.LocaleTextCalendar(firstweekday=0, locale=None) · calendar.LocaleHTMLCalendar(firstweekday=0, locale=None)',
  blurb:       'TextCalendar and HTMLCalendar with month and weekday names in another language: each name lookup switches the LC_TIME locale to the one you pass, then switches it back.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: false,
  version:     'Python 2.5+',
  searchTerms: 'calendar LocaleTextCalendar LocaleHTMLCalendar python localized calendar german calendar french month names locale LC_TIME setlocale unsupported locale setting translate calendar language python -m calendar -L',
};

export const method = {
  slug:      'localetextcalendar',
  name:      'calendar.LocaleTextCalendar / LocaleHTMLCalendar',
  signature: 'calendar.LocaleTextCalendar(firstweekday=0, locale=None) · calendar.LocaleHTMLCalendar(firstweekday=0, locale=None)',
  returns:   { type: 'LocaleTextCalendar · LocaleHTMLCalendar', desc: 'A TextCalendar or HTMLCalendar whose month and weekday names come from the given locale.' },

  category:    'calendar class',
  version:     'Python 2.5+',
  hasLiveDemo: false,

  subtitle: 'The output depends on which locales the machine has installed and on their exact names, so this page has no live demo. Everything except the names — layout, first weekday, CSS classes — works exactly like TextCalendar and HTMLCalendar.',

  covers: ['LocaleTextCalendar', 'LocaleHTMLCalendar'],

  cheat: {
    commonCall: "calendar.LocaleTextCalendar(locale='de_DE.UTF-8').formatmonth(2026, 10)",
    returns:    'the month with German names, if that locale is installed',
    replaces:   'locale.setlocale(...) around calendar.month() by hand',
    watchOut:   'locale names are platform-specific; a missing one raises locale.Error: unsupported locale setting',
  },

  parameters: [
    { name: 'firstweekday', type: 'int', required: false, default: '0', desc: '0 = MONDAY … 6 = SUNDAY, as for TextCalendar and HTMLCalendar.' },
    { name: 'locale', type: 'str | tuple | None', required: false, default: 'None', desc: 'A locale name for locale.setlocale, such as "de_DE.UTF-8", or a (language, encoding) tuple. None takes the current LC_TIME locale — and if that is "C", the user\'s default locale from the environment.' },
  ],

  examples: [
    { title: 'The C locale gives the plain English output', code: "import calendar\ncalendar.LocaleTextCalendar(locale='C').formatmonth(2026, 10) == calendar.TextCalendar().formatmonth(2026, 10)", returns: 'True' },
    { title: 'Subclasses of the two formatters', code: 'import calendar\n([c.__name__ for c in calendar.LocaleTextCalendar.__mro__], [c.__name__ for c in calendar.LocaleHTMLCalendar.__mro__])', returns: "(['LocaleTextCalendar', 'TextCalendar', 'Calendar', 'object'], ['LocaleHTMLCalendar', 'HTMLCalendar', 'Calendar', 'object'])" },
    { title: 'Only the two name methods are overridden', code: 'import calendar\nsorted(name for name in vars(calendar.LocaleTextCalendar) if not name.startswith(\'_\'))', returns: "['formatmonthname', 'formatweekday']" },
    { title: 'Settings are stored on the object', code: "import calendar\ncal = calendar.LocaleHTMLCalendar(calendar.SUNDAY, locale='C')\n(cal.locale, cal.firstweekday, cal.formatweekday(6))", returns: "('C', 6, '<th class=\"sun\">Sun</th>')" },
    { title: 'The locale is only checked when a name is needed', code: "import calendar\ncal = calendar.LocaleTextCalendar(locale='no_such_locale')\ncal.locale", returns: "'no_such_locale'" },
    { title: 'An unknown locale',           code: "import calendar\ncalendar.LocaleTextCalendar(locale='no_such_locale').formatmonthname(2026, 10, 20)", returns: 'locale.Error: unsupported locale setting' },
  ],

  pitfalls: [
    {
      name: 'Assuming a locale name exists everywhere',
      desc: 'Names differ between systems (Linux uses forms like "de_DE.UTF-8", while Windows also accepts names like "German_Germany"), and a Linux machine may have no extra locales installed at all. Catch locale.Error and fall back.',
      wrong: { label: 'unchecked name', code: "import calendar\ncalendar.LocaleTextCalendar(locale='no_such_locale').formatmonthname(2026, 10, 20)", output: 'locale.Error: unsupported locale setting' },
      fix:   { label: 'fall back to C', code: "import calendar, locale\ndef month_title(name):\n    try:\n        return calendar.LocaleTextCalendar(locale=name).formatmonthname(2026, 10, 0)\n    except locale.Error:\n        return calendar.LocaleTextCalendar(locale='C').formatmonthname(2026, 10, 0)\nmonth_title('no_such_locale')", output: "'October 2026'" },
    },
  ],

  patterns: [
    {
      name: 'A German month (Linux locale name)',
      desc: 'The locale must be installed on the machine.',
      code: "import calendar\nprint(calendar.LocaleTextCalendar(calendar.MONDAY, 'de_DE.UTF-8').formatmonth(2026, 10))",
    },
    {
      name: 'A localized HTML table',
      desc: 'Same CSS classes as HTMLCalendar; only the names change.',
      code: "import calendar\nhtml = calendar.LocaleHTMLCalendar(locale='fr_FR.UTF-8').formatmonth(2026, 10)",
    },
    {
      name: 'From the shell',
      desc: '-L needs -e (the output encoding).',
      code: '# shell:\n# python -m calendar -L de_DE.UTF-8 -e utf-8 2026 10',
    },
  ],

  when: {
    use: [
      'A month or year in the user\'s language in a single-threaded script or CLI tool',
      'Quick localized calendars where the target locale is known to be installed',
    ],
    avoid: [
      'Multi-threaded servers — the locale switch is process-wide and not thread-safe',
      'Portable output → your own list of month names, or a localisation library such as Babel',
      'English names → plain TextCalendar / HTMLCalendar (no locale switching at all)',
    ],
  },

  notes: {
    cpython:      'Lib/calendar.py: both classes override formatweekday() and formatmonthname(), wrapping the parent method in "with different_locale(self.locale)", which saves locale.setlocale(LC_TIME, None), sets the new locale and restores the old one on exit',
    'Default locale': 'locale=None calls _get_default_locale(): the current LC_TIME locale, or — when that is "C" — the one setlocale(LC_TIME, "") selects from the environment',
    'Thread safety': 'The docs note that the constructor, formatweekday() and formatmonthname() temporarily change LC_TIME; the locale is process-wide, so these classes are not thread-safe',
    'Errors':     'An unknown locale raises locale.Error: unsupported locale setting — not at construction but at the first name lookup',
    'Command line': 'python -m calendar -L LOCALE -e ENCODING uses these classes; -L without -e stops with "if --locale is specified --encoding is required"',
  },

  related: [
    { name: 'TextCalendar', slug: 'textcalendar', when: 'The parent of LocaleTextCalendar' },
    { name: 'HTMLCalendar', slug: 'htmlcalendar', when: 'The parent of LocaleHTMLCalendar' },
    { name: 'month_name / month_abbr', slug: 'month_name', when: 'Names in the current locale' },
    { name: 'day_name / day_abbr', slug: 'day_name', when: 'Weekday names in the current locale' },
    { name: 'date.strftime', slug: 'strftime-strptime', when: '%A / %B follow the same LC_TIME locale', category: 'stdlib/datetime' },
    { name: 'calendar module', slug: 'calendar', when: 'Overview and the command line', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'Why is there no live demo on this page?',
      a: 'The names these classes produce come from the operating system\'s locale data: which locales exist, what they are called (de_DE.UTF-8 on Linux, German_Germany on Windows) and the exact spelling of each month and weekday all depend on the machine running Python. A browser demo cannot reproduce that, so the examples here stick to the C locale and to the error an unknown locale name gives.',
    },
    {
      q: 'How do I print a calendar in another language in Python?',
      a: "calendar.LocaleTextCalendar(locale='de_DE.UTF-8').formatmonth(2026, 10) (or LocaleHTMLCalendar for HTML). The locale has to exist on the machine; on Linux, locale -a lists the installed ones.",
    },
    {
      q: 'Why do I get locale.Error: unsupported locale setting?',
      a: 'The operating system does not know that locale name. Install or generate the locale, or use a name the platform accepts — Linux uses forms like de_DE.UTF-8; Windows also accepts names like German_Germany.',
    },
    {
      q: 'Is LocaleTextCalendar thread-safe?',
      a: 'No. Every name lookup switches the process-wide LC_TIME locale and switches it back, so another thread formatting dates at the same moment can see the wrong locale. The documentation says so explicitly.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/calendar.html#calendar.LocaleTextCalendar',
    meta:  'calendar.LocaleTextCalendar',
  },

};
