// content/reference/python/stdlib/calendar/htmlcalendar.js — the calendar.HTMLCalendar class

export const meta = {
  slug:        'htmlcalendar',
  name:        'calendar.HTMLCalendar',
  signature:   'calendar.HTMLCalendar(firstweekday=0)',
  blurb:       'Calendars as HTML tables — a month, a year, or a complete XHTML page — with CSS class names on every cell for styling.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: 'calendar HTMLCalendar python html calendar table month table css classes formatmonth formatyear formatyearpage generate html calendar django flask template',
};

export const method = {
  slug:      'htmlcalendar',
  name:      'calendar.HTMLCalendar',
  signature: 'calendar.HTMLCalendar(firstweekday=0)',
  returns:   { type: 'HTMLCalendar', desc: 'A Calendar subclass whose format* methods return HTML strings (formatyearpage returns bytes).' },

  category:    'calendar class',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  subtitle: 'No styles are included — only class names: "mon" … "sun" on day cells, "noday" on padding cells, "month" and "year" on the tables. Change them through the cssclass attributes, or subclass and override formatday to add links or highlights.',

  covers: ['HTMLCalendar'],

  cheat: {
    commonCall: 'calendar.HTMLCalendar(calendar.SUNDAY).formatmonth(2026, 10)',
    returns:    'a <table class="month"> string, one row per line',
    replaces:   'hand-built calendar tables in templates',
    watchOut:   'formatyearpage returns bytes; a new HTMLCalendar ignores setfirstweekday()',
  },

  parameters: [
    { name: 'firstweekday', type: 'int', required: false, default: '0', desc: '0 = MONDAY … 6 = SUNDAY; decides the column order of every table.' },
  ],

  modes: [
    {
      id: 'month',
      label: 'formatmonth',
      blurb: 'One month table, one line per list item.',
      params: [
        { name: 'first', type: 'int', hint: '0 = Monday … 6 = Sunday', input: 'number' },
        { name: 'year',  type: 'int', hint: 'any year',                input: 'number' },
        { name: 'month', type: 'int', hint: '1–12',                    input: 'number' },
      ],
      template: 'import calendar\ncalendar.HTMLCalendar(firstweekday={$first}).formatmonth({$year}, {$month}).splitlines()',
      cases: [
        { id: 'feb', label: 'Feb 2026',          values: { first: '0', year: '2026', month: '2' } },
        { id: 'sun', label: 'Feb 2026, Sunday',  values: { first: '6', year: '2026', month: '2' } },
        { id: 'bad', label: 'month 13',          values: { first: '0', year: '2026', month: '13' } },
      ],
    },
  ],
  demoExplainer: 'The table is title row, header row and one row per week, each on its own line. Days outside the month become noday cells that hold only a non-breaking-space entity — February 2026 Monday-first has six of them before the 1st and one after the 28th; Sunday-first it has none, because the month starts on a Sunday and fills four rows exactly.',

  patterns: [
    {
      name: 'Month table in a web page',
      desc: 'Insert the string unescaped (it is markup) and style the classes.',
      code: "import calendar\ntable = calendar.HTMLCalendar(calendar.SUNDAY).formatmonth(2026, 10)\nhtml = f'<style>.noday {{ background: #eee }} .sat, .sun {{ color: #b00 }}</style>{table}'",
    },
    {
      name: 'Your own class names',
      desc: 'Override the attributes in a subclass.',
      code: "import calendar\n\nclass BootstrapCalendar(calendar.HTMLCalendar):\n    cssclass_month = 'table table-bordered'\n    cssclass_noday = 'text-muted'",
    },
    {
      name: 'A whole year as a standalone page',
      desc: 'formatyearpage returns bytes — write them in binary mode.',
      code: "import calendar\nwith open('2026.html', 'wb') as f:\n    f.write(calendar.HTMLCalendar().formatyearpage(2026))",
    },
  ],

  examples: [
    { title: 'The first lines of a month', code: 'import calendar\ncalendar.HTMLCalendar().formatmonth(2026, 2).splitlines()[:2]', returns: "['<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"month\">', '<tr><th colspan=\"7\" class=\"month\">February 2026</th></tr>']" },
    { title: 'Padding cells',              code: "import calendar\ncalendar.HTMLCalendar().formatmonth(2026, 2).count('class=\"noday\"')", returns: '7' },
    { title: 'Sunday-first header',        code: 'import calendar\ncalendar.HTMLCalendar(calendar.SUNDAY).formatweekheader()', returns: "'<tr><th class=\"sun\">Sun</th><th class=\"mon\">Mon</th><th class=\"tue\">Tue</th><th class=\"wed\">Wed</th><th class=\"thu\">Thu</th><th class=\"fri\">Fri</th><th class=\"sat\">Sat</th></tr>'" },
    { title: 'Default CSS classes',        code: 'import calendar\ncalendar.HTMLCalendar.cssclasses', returns: "['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']" },
    { title: 'Subclass with a class name', code: "import calendar\n\nclass MyCalendar(calendar.HTMLCalendar):\n    cssclass_month = 'calendar'\n\nMyCalendar().formatmonth(2026, 2).splitlines()[0]", returns: "'<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"calendar\">'" },
    { title: 'formatyearpage gives bytes', code: 'import calendar\ntype(calendar.HTMLCalendar().formatyearpage(2026)).__name__', returns: "'bytes'" },
  ],

  pitfalls: [
    {
      name: 'Writing formatyearpage to a text file',
      desc: 'The page is already encoded (UTF-8 by default). Open the file in binary mode.',
      wrong: { label: "open(..., 'w')", code: "import calendar\npage = calendar.HTMLCalendar().formatyearpage(2026)\nwith open('2026.html', 'w', encoding='utf-8') as f:\n    f.write(page)", output: 'TypeError: write() argument must be str, not bytes' },
      fix:   { label: "open(..., 'wb')", code: "import calendar\npage = calendar.HTMLCalendar().formatyearpage(2026)\nwith open('2026.html', 'wb') as f:\n    f.write(page)\nlen(page)", output: '15381' },
    },
    {
      name: 'Expecting setfirstweekday() to reach your HTMLCalendar',
      desc: 'The module-wide setting belongs to the module\'s own TextCalendar. Each HTMLCalendar has its own first weekday.',
      wrong: { label: 'HTMLCalendar()', code: 'import calendar\ntry:\n    calendar.setfirstweekday(calendar.SUNDAY)\n    first_th = calendar.HTMLCalendar().formatweekday(calendar.HTMLCalendar().firstweekday)\nfinally:\n    calendar.setfirstweekday(calendar.MONDAY)\nfirst_th', output: "'<th class=\"mon\">Mon</th>'" },
      fix:   { label: 'HTMLCalendar(SUNDAY)', code: 'import calendar\ncal = calendar.HTMLCalendar(calendar.SUNDAY)\ncal.formatweekday(cal.firstweekday)', output: "'<th class=\"sun\">Sun</th>'" },
    },
  ],

  when: {
    use: [
      'A quick server-rendered month or year view',
      'Static HTML calendars generated by a script',
      'A starting point to subclass: links, events, highlighted dates in formatday',
    ],
    avoid: [
      'Interactive calendars → a JavaScript widget fed with JSON',
      'Full control over markup → loop over monthdatescalendar in a template',
      'Localized names → LocaleHTMLCalendar',
    ],
  },

  notes: {
    cpython:     'Lib/calendar.py: class HTMLCalendar(Calendar) with formatday, formatweek, formatweekday, formatweekheader, formatmonthname, formatmonth, formatyear, formatyearpage',
    'Escaping':  'Names and class attributes are inserted as they are — no HTML escaping; empty cells contain the entity &nbsp;',
    'Encoding':  'formatyearpage(…, encoding=None) uses sys.getdefaultencoding(), which is utf-8, and encodes with xmlcharrefreplace',
  },

  related: [
    { name: 'HTMLCalendar.formatmonth', slug: 'htmlcalendar-formatmonth', when: 'One month table' },
    { name: 'HTMLCalendar.formatyear / formatyearpage', slug: 'htmlcalendar-formatyear', when: 'A year, or a full page' },
    { name: 'formatday / formatweek …', slug: 'htmlcalendar-formatday', when: 'The cells and rows' },
    { name: 'CSS class attributes', slug: 'htmlcalendar-cssclasses', when: 'Rename the classes' },
    { name: 'TextCalendar', slug: 'textcalendar', when: 'The text sibling' },
    { name: 'html module', slug: 'html', when: 'escape() for text you add to cells', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I generate an HTML calendar in Python?',
      a: 'calendar.HTMLCalendar().formatmonth(2026, 10) returns a <table> for one month; formatyear(2026) a table of month tables; formatyearpage(2026) a complete XHTML page as bytes. Style it with CSS on the classes mon … sun, noday, month and year.',
    },
    {
      q: 'How do I highlight a date or add events to HTMLCalendar?',
      a: 'Subclass it and override formatday(day, weekday). formatday does not receive the month, so override formatmonth too and remember the year and month it was called with.',
    },
    {
      q: 'Does HTMLCalendar include CSS?',
      a: 'No. It only emits class names. formatyearpage links a stylesheet (calendar.css by default; css=None leaves the link out).',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/calendar.html#calendar.HTMLCalendar',
    meta:  'calendar.HTMLCalendar',
  },

};
