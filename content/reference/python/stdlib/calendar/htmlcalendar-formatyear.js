// content/reference/python/stdlib/calendar/htmlcalendar-formatyear.js — HTMLCalendar.formatyear and formatyearpage

export const meta = {
  slug:        'htmlcalendar-formatyear',
  name:        'HTMLCalendar.formatyear / formatyearpage',
  signature:   "cal.formatyear(theyear, width=3) · cal.formatyearpage(theyear, width=3, css='calendar.css', encoding=None)",
  blurb:       'A whole year as HTML: formatyear returns a table of month tables as a str; formatyearpage wraps it in a complete XHTML page and returns encoded bytes.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'Python 2.5+',
  searchTerms: 'HTMLCalendar.formatyear HTMLCalendar.formatyearpage formatyear formatyearpage html year calendar python year table xhtml page css stylesheet encoding bytes xmlcharrefreplace python -m calendar -t html',
};

export const method = {
  slug:      'htmlcalendar-formatyear',
  name:      'HTMLCalendar.formatyear / formatyearpage',
  signature: "cal.formatyear(theyear, width=3) · cal.formatyearpage(theyear, width=3, css='calendar.css', encoding=None)",
  returns:   { type: 'str · bytes', desc: 'formatyear: a <table class="year"> holding one cell per month. formatyearpage: the whole XHTML document, encoded (UTF-8 by default).' },

  category:    'HTMLCalendar method',
  version:     'Python 2.5+',
  hasLiveDemo: true,

  subtitle: 'width is the number of months per row (values below 1 count as 1). The month tables inside are formatmonth(year, month, withyear=False), so their titles show only the month name — the year sits once in the title row on top.',

  covers: ['HTMLCalendar.formatyear', 'HTMLCalendar.formatyearpage'],

  cheat: {
    commonCall: "open('2026.html', 'wb').write(calendar.HTMLCalendar().formatyearpage(2026))",
    returns:    'a complete page, as bytes',
    replaces:   'assembling twelve month tables and an HTML skeleton by hand',
    watchOut:   'formatyearpage returns bytes — write in binary mode or decode first',
  },

  parameters: [
    { name: 'theyear',  type: 'int', required: true,  default: null, desc: 'The year; shown with str() in the title row and with %d in the page <title>.' },
    { name: 'width',    type: 'int', required: false, default: '3',  desc: 'Months per row: max(width, 1) — 0 or a negative width gives one month per row.' },
    { name: 'css',      type: 'str | None', required: false, default: "'calendar.css'", desc: 'formatyearpage: href of the stylesheet <link>; None leaves the link out.' },
    { name: 'encoding', type: 'str | None', required: false, default: 'None', desc: 'formatyearpage: the codec for the bytes and the name written into the XML declaration and <meta>. None means sys.getdefaultencoding(), i.e. utf-8. Characters the codec cannot encode become &#NNN; references.' },
  ],

  modes: [
    {
      id: 'year',
      label: 'formatyear',
      blurb: 'Everything before the first month cell, and the number of month rows, for a width you choose.',
      params: [
        { name: 'year',  type: 'int', hint: 'any year',       input: 'number' },
        { name: 'width', type: 'int', hint: 'months per row', input: 'number' },
      ],
      template: "import calendar\nhtml = calendar.HTMLCalendar().formatyear({$year}, width={$width})\n(html.split('<tr><td>')[0], html.count('<tr><td>'))",
      cases: [
        { id: 'w3',  label: 'width 3',  values: { year: '2026', width: '3' } },
        { id: 'w5',  label: 'width 5',  values: { year: '2026', width: '5' } },
        { id: 'w0',  label: 'width 0',  values: { year: '2026', width: '0' } },
        { id: 'w12', label: 'width 12', values: { year: '2026', width: '12' } },
      ],
    },
    {
      id: 'page',
      label: 'formatyearpage',
      blurb: 'The first seven lines of the page (bytes). Leave css empty for css=None.',
      params: [
        { name: 'year', type: 'int', hint: 'any year',                 input: 'number' },
        { name: 'css',  type: 'str | None', hint: 'stylesheet href or empty', input: 'text-or-none' },
      ],
      template: 'import calendar\npage = calendar.HTMLCalendar().formatyearpage({$year}, css={$css})\npage.splitlines()[:7]',
      cases: [
        { id: 'default', label: 'calendar.css', values: { year: '2026', css: 'calendar.css' } },
        { id: 'none',    label: 'css=None',     values: { year: '2026', css: '' } },
        { id: 'accent',  label: 'non-ASCII css', values: { year: '2026', css: 'zoë.css' } },
      ],
    },
    {
      id: 'encoding',
      label: 'encoding',
      blurb: 'The <meta> and <link> lines for an encoding (utf-8, ascii or latin-1 in this demo) and a stylesheet name.',
      params: [
        { name: 'css',      type: 'str', hint: 'stylesheet href', input: 'text' },
        { name: 'encoding', type: 'str', hint: 'codec name',      input: 'text' },
      ],
      template: 'import calendar\ncalendar.HTMLCalendar().formatyearpage(2026, css={$css}, encoding={$encoding}).splitlines()[4:6]',
      cases: [
        { id: 'ascii',  label: 'ascii',   values: { css: 'zoë.css', encoding: 'ascii' } },
        { id: 'latin1', label: 'latin-1', values: { css: '€uro.css', encoding: 'latin-1' } },
        { id: 'utf8',   label: 'utf-8',   values: { css: 'zoë.css', encoding: 'utf-8' } },
      ],
    },
  ],
  demoExplainer: 'The title row spans width columns, and width below 1 is raised to 1, so width 0 gives twelve rows of one month. In the page, the year line and stylesheet line come before </head>; with css=None the <link> line is simply missing. The encoding decides the bytes: ë is one byte in Latin-1 and two in UTF-8, and a character the codec has no byte for (ë in ASCII, € in Latin-1) is written as a numeric character reference such as &#235;.',

  patterns: [
    {
      name: 'Save a year as a web page',
      desc: 'Binary mode — the page is already encoded.',
      code: "import calendar\nwith open('2026.html', 'wb') as f:\n    f.write(calendar.HTMLCalendar(calendar.SUNDAY).formatyearpage(2026, css='style.css'))",
    },
    {
      name: 'Embed the year table in your own page',
      desc: 'formatyear gives a str fragment without <html> or <head>.',
      code: "import calendar\nbody = f'<h1>Holidays</h1>\\n{calendar.HTMLCalendar().formatyear(2026, width=4)}'",
    },
    {
      name: 'From the shell',
      desc: 'The command line writes formatyearpage output to stdout.',
      code: '# shell:\n# python -m calendar -t html 2026 > 2026.html\n# python -m calendar -t html -c style.css 2026 > 2026.html',
    },
  ],

  examples: [
    { title: 'One year table, twelve month tables', code: "import calendar\ncalendar.HTMLCalendar().formatyear(2026).count('<table')", returns: '13' },
    { title: 'width=4: three rows',        code: "import calendar\ncalendar.HTMLCalendar().formatyear(2026, width=4).count('<tr><td>')", returns: '3' },
    { title: 'width below 1 means 1',      code: "import calendar\ncalendar.HTMLCalendar().formatyear(2026, 0).split('<tr><td>')[0]", returns: "'<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"year\">\\n<tr><th colspan=\"1\" class=\"year\">2026</th></tr>'" },
    { title: 'Month titles without the year', code: "import calendar\nhtml = calendar.HTMLCalendar().formatyear(2026)\n('<th colspan=\"7\" class=\"month\">October</th>' in html, 'October 2026' in html)", returns: '(True, False)' },
    { title: 'The page starts with an XML declaration', code: 'import calendar\ncalendar.HTMLCalendar().formatyearpage(2026).splitlines()[:2]', returns: "[b'<?xml version=\"1.0\" encoding=\"utf-8\"?>', b'<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">']" },
    { title: 'css=None drops the stylesheet', code: "import calendar\nb'stylesheet' in calendar.HTMLCalendar().formatyearpage(2026, css=None)", returns: 'False' },
    { title: 'Decode to work with text',   code: "import calendar\ncalendar.HTMLCalendar().formatyearpage(2026).decode('utf-8').splitlines()[6]", returns: "'<title>Calendar for 2026</title>'" },
    { title: 'Unencodable characters become references', code: "import calendar\ncalendar.HTMLCalendar().formatyearpage(2026, css='zoë.css', encoding='ascii').splitlines()[5]", returns: "b'<link rel=\"stylesheet\" type=\"text/css\" href=\"zo&#235;.css\" />'" },
  ],

  pitfalls: [
    {
      name: 'Mixing the page bytes with str',
      desc: 'formatyearpage returns bytes, so str concatenation (or a text-mode write) fails. Decode it, or keep everything as bytes.',
      wrong: { label: 'str + bytes', code: "import calendar\npage = calendar.HTMLCalendar().formatyearpage(2026)\n'<!-- generated -->\\n' + page", output: 'TypeError: can only concatenate str (not "bytes") to str' },
      fix:   { label: 'decode first', code: "import calendar\npage = calendar.HTMLCalendar().formatyearpage(2026)\n('<!-- generated -->\\n' + page.decode('utf-8')).splitlines()[0]", output: "'<!-- generated -->'" },
    },
    {
      name: 'Passing TextCalendar\'s m=',
      desc: 'The HTML version calls the months-per-row argument width, and has no w, l or c.',
      wrong: { label: 'formatyear(m=4)', code: 'import calendar\ncalendar.HTMLCalendar().formatyear(2026, m=4)', output: "TypeError: HTMLCalendar.formatyear() got an unexpected keyword argument 'm'" },
      fix:   { label: 'formatyear(width=4)', code: "import calendar\ncalendar.HTMLCalendar().formatyear(2026, width=4).count('<tr><td>')", output: '3' },
    },
  ],

  when: {
    use: [
      'A printable or static year calendar page generated by a script',
      'A year overview fragment inside your own template (formatyear)',
    ],
    avoid: [
      'One month → formatmonth',
      'Your own page skeleton, scripts or meta tags → formatyear plus your template',
      'Plain text → TextCalendar.formatyear',
    ],
  },

  notes: {
    cpython:       'Lib/calendar.py: formatyear writes the <table class="year">, a title row with colspan=max(width, 1), then for each group of width months a <tr> of <td>formatmonth(theyear, m, withyear=False)</td> cells. formatyearpage adds the XML declaration, XHTML 1.0 Strict doctype, <meta> charset, optional stylesheet <link> and <title>, and returns "".join(v).encode(encoding, "xmlcharrefreplace")',
    'Line breaks': 'Apart from the newline after the opening <table>, formatyear adds none of its own — the line breaks come from the month tables, so the second line runs from the title row straight into the first month\'s <table> tag',
    'Command line': 'python -m calendar -t html [year] writes formatyearpage output (bytes) to stdout; -c sets the css, -e the encoding; a month argument is rejected with "incorrect number of arguments"',
  },

  related: [
    { name: 'HTMLCalendar.formatmonth', slug: 'htmlcalendar-formatmonth', when: 'The month tables inside' },
    { name: 'CSS class attributes', slug: 'htmlcalendar-cssclasses', when: 'cssclass_year and cssclass_year_head' },
    { name: 'HTMLCalendar', slug: 'htmlcalendar', when: 'The class' },
    { name: 'TextCalendar.formatyear / pryear', slug: 'textcalendar-formatyear', when: 'The text version' },
    { name: 'yeardayscalendar …', slug: 'yeardayscalendar', when: 'The year as data' },
    { name: 'calendar module', slug: 'calendar', when: 'Overview and the command line', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I generate an HTML calendar for a whole year in Python?',
      a: "calendar.HTMLCalendar().formatyearpage(2026) returns a complete XHTML page as bytes — write it with open('2026.html', 'wb'). formatyear(2026) gives just the table as a str. From a shell: python -m calendar -t html 2026 > 2026.html.",
    },
    {
      q: 'Why does formatyearpage return bytes?',
      a: 'It encodes the page itself, with the encoding named in its XML declaration (UTF-8 unless you pass encoding=), replacing characters the codec cannot represent with numeric references. Decode with the same encoding if you need a str.',
    },
    {
      q: 'How do I change the number of months per row in an HTML year calendar?',
      a: 'Pass width: formatyear(2026, width=4) or formatyearpage(2026, width=4) gives three rows of four months; width=12 a single row.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/calendar.html#calendar.HTMLCalendar.formatyearpage',
    meta:  'HTMLCalendar.formatyearpage',
  },

};
