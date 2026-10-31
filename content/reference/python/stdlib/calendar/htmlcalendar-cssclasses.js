// content/reference/python/stdlib/calendar/htmlcalendar-cssclasses.js — the HTMLCalendar CSS class attributes

export const meta = {
  slug:        'htmlcalendar-cssclasses',
  name:        'HTMLCalendar.cssclasses / cssclass_*',
  signature:   'cal.cssclasses · cal.cssclasses_weekday_head · cal.cssclass_noday · cal.cssclass_month_head · cal.cssclass_month · cal.cssclass_year_head · cal.cssclass_year',
  blurb:       'The class names HTMLCalendar writes into its markup — one per weekday for the cells, one for padding cells, and one each for the month and year tables and their title rows. Override them to fit your stylesheet.',
  category:    'methods',
  type:        'attribute',
  hasLiveDemo: true,
  version:     'Python 2.5+ (cssclasses); the other six 3.7+',
  searchTerms: 'HTMLCalendar.cssclasses HTMLCalendar.cssclasses_weekday_head HTMLCalendar.cssclass_noday HTMLCalendar.cssclass_month_head HTMLCalendar.cssclass_month HTMLCalendar.cssclass_year_head HTMLCalendar.cssclass_year cssclasses cssclass noday css class html calendar style bootstrap weekend class',
};

export const method = {
  slug:      'htmlcalendar-cssclasses',
  name:      'HTMLCalendar.cssclasses / cssclass_*',
  signature: 'cal.cssclasses · cal.cssclasses_weekday_head · cal.cssclass_noday · cal.cssclass_month_head · cal.cssclass_month · cal.cssclass_year_head · cal.cssclass_year',
  returns:   { type: 'list[str] · str', desc: 'Two lists of seven class strings (Monday first) and five single class strings; each value is inserted into class="…" as it is.' },

  category:    'HTMLCalendar attribute',
  version:     'Python 2.5+ (cssclasses); the other six 3.7+',
  hasLiveDemo: true,

  subtitle: 'Plain class attributes, so you can change them on one instance (cal.cssclass_noday = "empty") or in a subclass. A value may hold several space-separated classes, and nothing is escaped — the text goes into the HTML verbatim.',

  covers: [
    'HTMLCalendar.cssclasses', 'HTMLCalendar.cssclasses_weekday_head', 'HTMLCalendar.cssclass_noday',
    'HTMLCalendar.cssclass_month_head', 'HTMLCalendar.cssclass_month', 'HTMLCalendar.cssclass_year_head', 'HTMLCalendar.cssclass_year',
  ],

  cheat: {
    commonCall: "cal.cssclass_noday = 'text-muted'",
    returns:    'padding cells now render with class="text-muted"',
    replaces:   'post-processing the generated HTML with str.replace',
    watchOut:   'cssclasses_weekday_head is the same list object as cssclasses — reassign both, never mutate in place',
  },

  attributes: [
    { name: 'cssclasses',              type: 'list[str]', meaning: 'Classes of the day cells, indexed by weekday: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]. Must have seven items.' },
    { name: 'cssclasses_weekday_head', type: 'list[str]', meaning: 'Classes of the weekday header cells; by default the very same list as cssclasses (3.7+).' },
    { name: 'cssclass_noday',          type: 'str', meaning: '"noday" — the cells of days from the previous or next month (3.7+).' },
    { name: 'cssclass_month_head',     type: 'str', meaning: '"month" — the title row of a month (formatmonthname) (3.7+).' },
    { name: 'cssclass_month',          type: 'str', meaning: '"month" — the <table> of a month (formatmonth) (3.7+).' },
    { name: 'cssclass_year_head',      type: 'str', meaning: '"year" — the title row of the year table (formatyear) (3.7+).' },
    { name: 'cssclass_year',           type: 'str', meaning: '"year" — the outer <table> of formatyear (3.7+).' },
  ],

  modes: [
    {
      id: 'month',
      label: 'month classes',
      blurb: 'Rename the table, title-row and padding classes on one instance; the first four lines of February 2026 show where each one lands.',
      params: [
        { name: 'table', type: 'str', hint: 'cssclass_month',      input: 'text' },
        { name: 'title', type: 'str', hint: 'cssclass_month_head', input: 'text' },
        { name: 'noday', type: 'str', hint: 'cssclass_noday',      input: 'text' },
      ],
      template: 'import calendar\ncal = calendar.HTMLCalendar()\ncal.cssclass_month = {$table}\ncal.cssclass_month_head = {$title}\ncal.cssclass_noday = {$noday}\ncal.formatmonth(2026, 2).splitlines()[:4]',
      cases: [
        { id: 'bootstrap', label: 'Bootstrap-style', values: { table: 'table table-sm', title: 'text-center', noday: 'text-muted' } },
        { id: 'defaults',  label: 'the defaults',    values: { table: 'month', title: 'month', noday: 'noday' } },
        { id: 'quote',     label: 'a quote',         values: { table: 'a"b', title: 'month', noday: 'noday' } },
      ],
    },
    {
      id: 'weekdays',
      label: 'weekday classes',
      blurb: 'Replace cssclasses with your own seven names (comma-separated): a full week row, plus the Monday header cell.',
      params: [{ name: 'classes', type: 'list[str]', hint: 'seven class names, Monday first', input: 'csv' }],
      template: 'import calendar\ncal = calendar.HTMLCalendar()\ncal.cssclasses = {$classes}\n(cal.formatweek(cal.monthdays2calendar(2026, 10)[1]), cal.formatweekday(calendar.MONDAY))',
      cases: [
        { id: 'weekend', label: 'weekend class', values: { classes: 'mon, tue, wed, thu, fri, sat weekend, sun weekend' } },
        { id: 'six',     label: 'only six',      values: { classes: 'day, day, day, day, day, weekend' } },
      ],
    },
    {
      id: 'year',
      label: 'year classes',
      blurb: 'The outer table and title row of formatyear.',
      params: [
        { name: 'table', type: 'str', hint: 'cssclass_year',      input: 'text' },
        { name: 'head',  type: 'str', hint: 'cssclass_year_head', input: 'text' },
      ],
      template: 'import calendar\ncal = calendar.HTMLCalendar()\ncal.cssclass_year = {$table}\ncal.cssclass_year_head = {$head}\ncal.formatyear(2026).splitlines()[:2]',
      cases: [
        { id: 'custom',   label: 'custom',       values: { table: 'year-grid', head: 'year-title' } },
        { id: 'defaults', label: 'the defaults', values: { table: 'year', head: 'year' } },
      ],
    },
  ],
  demoExplainer: 'Every value is pasted between the quotes of class="…" with no escaping, so a double quote in it ends the attribute early and breaks the markup. In weekday classes the header cell keeps class "mon": assigning cal.cssclasses replaces only that attribute, while cssclasses_weekday_head still points at the original list. A list of six raises IndexError as soon as a Sunday cell is formatted.',

  patterns: [
    {
      name: 'Subclass with your class names',
      desc: 'The documentation\'s own example: extend the defaults instead of replacing them.',
      code: "import calendar\n\nclass CustomHTMLCal(calendar.HTMLCalendar):\n    cssclasses = [style + ' text-nowrap' for style in calendar.HTMLCalendar.cssclasses]\n    cssclass_month_head = 'text-center month-head'\n    cssclass_month = 'text-center month'\n    cssclass_year = 'text-italic lead'",
    },
    {
      name: 'Mark weekends in cells and headers',
      desc: 'Build a new list and assign it to both attributes.',
      code: "import calendar\ncal = calendar.HTMLCalendar()\ncal.cssclasses = cal.cssclasses[:5] + ['sat weekend', 'sun weekend']\ncal.cssclasses_weekday_head = cal.cssclasses",
    },
    {
      name: 'Matching CSS',
      desc: 'The default names, styled.',
      code: "css = '''\n.month { border-collapse: collapse; }\n.noday { background: #f4f4f4; }\n.sat, .sun { color: #b00; }\n'''",
    },
  ],

  examples: [
    { title: 'The defaults',              code: 'import calendar\ncal = calendar.HTMLCalendar()\n(cal.cssclass_noday, cal.cssclass_month_head, cal.cssclass_month, cal.cssclass_year_head, cal.cssclass_year)', returns: "('noday', 'month', 'month', 'year', 'year')" },
    { title: 'Day-cell classes',          code: 'import calendar\ncalendar.HTMLCalendar.cssclasses', returns: "['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']" },
    { title: 'The header uses the same list', code: 'import calendar\ncalendar.HTMLCalendar.cssclasses_weekday_head is calendar.HTMLCalendar.cssclasses', returns: 'True' },
    { title: 'A subclass with extra classes', code: "import calendar\n\nclass NoWrap(calendar.HTMLCalendar):\n    cssclasses = [style + ' text-nowrap' for style in calendar.HTMLCalendar.cssclasses]\n    cssclass_month = 'text-center month'\n\ncal = NoWrap()\n(cal.formatday(1, calendar.MONDAY), cal.formatmonth(2026, 2).splitlines()[0])", returns: "('<td class=\"mon text-nowrap\">1</td>', '<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"text-center month\">')" },
    { title: 'Instance assignment stays on the instance', code: "import calendar\na = calendar.HTMLCalendar()\na.cssclass_noday = 'empty'\nb = calendar.HTMLCalendar()\n(a.cssclass_noday, b.cssclass_noday)", returns: "('empty', 'noday')" },
    { title: 'The year table classes',    code: "import calendar\ncal = calendar.HTMLCalendar()\ncal.cssclass_year = 'year-grid'\ncal.cssclass_year_head = 'year-title'\ncal.formatyear(2026).splitlines()[:2]", returns: "['<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"year-grid\">', '<tr><th colspan=\"3\" class=\"year-title\">2026</th></tr><tr><td><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"month\">']" },
    { title: 'All seven attributes',      code: "import calendar\nsorted(name for name in vars(calendar.HTMLCalendar) if name.startswith('css'))", returns: "['cssclass_month', 'cssclass_month_head', 'cssclass_noday', 'cssclass_year', 'cssclass_year_head', 'cssclasses', 'cssclasses_weekday_head']" },
  ],

  pitfalls: [
    {
      name: 'Changing cssclasses and expecting the header to follow',
      desc: 'Assigning a new list to cssclasses leaves cssclasses_weekday_head on the old one. Assign both.',
      wrong: { label: 'cssclasses only', code: "import calendar\ncal = calendar.HTMLCalendar()\ncal.cssclasses = ['day', 'day', 'day', 'day', 'day', 'weekend', 'weekend']\ncal.formatweekday(calendar.SATURDAY)", output: "'<th class=\"sat\">Sat</th>'" },
      fix:   { label: 'both lists', code: "import calendar\ncal = calendar.HTMLCalendar()\ncal.cssclasses = ['day', 'day', 'day', 'day', 'day', 'weekend', 'weekend']\ncal.cssclasses_weekday_head = cal.cssclasses\ncal.formatweekday(calendar.SATURDAY)", output: "'<th class=\"weekend\">Sat</th>'" },
    },
    {
      name: 'A list without seven items',
      desc: 'The weekday number indexes the list directly; a short list fails on the first day it does not cover.',
      wrong: { label: 'six items', code: "import calendar\ncal = calendar.HTMLCalendar()\ncal.cssclasses = ['day'] * 5 + ['weekend']\ncal.formatweek(cal.monthdays2calendar(2026, 10)[1])", output: 'IndexError: list index out of range' },
      fix:   { label: 'seven items', code: "import calendar\ncal = calendar.HTMLCalendar()\ncal.cssclasses = ['day'] * 5 + ['weekend'] * 2\ncal.formatweek(cal.monthdays2calendar(2026, 10)[1])", output: "'<tr><td class=\"day\">5</td><td class=\"day\">6</td><td class=\"day\">7</td><td class=\"day\">8</td><td class=\"day\">9</td><td class=\"weekend\">10</td><td class=\"weekend\">11</td></tr>'" },
    },
  ],

  when: {
    use: [
      'Fitting HTMLCalendar output to an existing stylesheet or CSS framework',
      'Styling weekends or padding cells without overriding any method',
    ],
    avoid: [
      'cal.cssclasses[5] = "weekend" — that edits the list shared by every HTMLCalendar and by the header; assign a new list instead',
      'Per-date classes (today, holidays) → override formatday',
      'Values with quotes or other characters that need escaping — they are inserted verbatim',
    ],
  },

  notes: {
    cpython:      'Lib/calendar.py: class attributes of HTMLCalendar — cssclasses = ["mon", …, "sun"], cssclasses_weekday_head = cssclasses, cssclass_noday = "noday", cssclass_month_head = "month", cssclass_month = "month", cssclass_year_head = "year", cssclass_year = "year"',
    'Used by':    'formatday (cssclasses, cssclass_noday), formatweekday (cssclasses_weekday_head), formatmonthname (cssclass_month_head), formatmonth (cssclass_month), formatyear (cssclass_year_head, cssclass_year)',
    'History':    'Before 3.7 only cssclasses existed and the other names were fixed strings in the markup; the header cells used cssclasses too',
    'Shared list': 'The two lists are one object on the class. Mutating it in place (cal.cssclasses[5] = …) changes every HTMLCalendar in the process, headers included',
  },

  history: [
    { version: '3.7', note: 'cssclasses_weekday_head, cssclass_noday, cssclass_month_head, cssclass_month, cssclass_year_head and cssclass_year added' },
  ],

  related: [
    { name: 'HTMLCalendar', slug: 'htmlcalendar', when: 'The class' },
    { name: 'formatday / formatweek …', slug: 'htmlcalendar-formatday', when: 'The methods that read them' },
    { name: 'HTMLCalendar.formatmonth', slug: 'htmlcalendar-formatmonth', when: 'Month table and title classes' },
    { name: 'HTMLCalendar.formatyear / formatyearpage', slug: 'htmlcalendar-formatyear', when: 'Year table classes' },
    { name: 'html module', slug: 'html', when: 'escape() for values you build from user input', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I change the CSS classes of Python\'s HTMLCalendar?',
      a: 'Set the attributes: cal.cssclass_month = "table", cal.cssclass_noday = "text-muted", cal.cssclasses = [seven names] — on one instance or as class attributes of a subclass. Several classes go in one space-separated string.',
    },
    {
      q: 'Why did changing cssclasses not change the weekday header?',
      a: 'Since 3.7 the header reads cssclasses_weekday_head, which by default is the original cssclasses list object. Assigning a new list to cssclasses does not touch it — set cssclasses_weekday_head as well.',
    },
    {
      q: 'Does HTMLCalendar escape the class names?',
      a: 'No. The strings are inserted with % formatting as they are; a value containing a double quote produces broken HTML.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/calendar.html#calendar.HTMLCalendar.cssclasses',
    meta:  'HTMLCalendar.cssclasses',
  },

};
