// content/reference/python/stdlib/html/index.js — the html module hub

export const meta = {
  slug:        'index',
  name:        'html',
  signature:   'import html',
  blurb:       'Two functions for putting text into HTML safely and getting it back: escape() turns <, >, & and quotes into character references, unescape() decodes every HTML5 reference.',
  category:    'text',
  type:        'module',
  hasLiveDemo: true,
  version:     'Python 3.2+ (escape), 3.4+ (unescape)',
  searchTerms: 'html module python html escape unescape html entities character references encode decode html special characters xss sanitize html.entities html.parser amp lt gt quot',
};

export const method = {
  slug: 'index',
  name: 'html',

  category:    'Text',
  version:     'Python 3.2+ (escape), 3.4+ (unescape)',
  hasLiveDemo: true,

  subtitle: 'escape() makes text safe to drop into an HTML page or a quoted attribute; unescape() decodes named and numeric references exactly the way a browser does. Everything else lives in the html.parser and html.entities submodules.',

  imports: ['import html', 'from html import escape, unescape'],
  facts: [
    { label: 'Public API', value: 'escape(s, quote=True), unescape(s) — that is the whole of html.__all__' },
    { label: 'Submodules', value: 'html.parser (HTMLParser, a tag-event parser) and html.entities (the name tables) — imported separately' },
    { label: 'Escapes',    value: '& < > always; " and \' too unless quote=False. Nothing else — non-ASCII text is left as it is' },
    { label: 'Decodes',    value: 'All 2231 HTML5 named references (html.entities.html5), decimal and hex numeric references, with the HTML5 error-recovery rules' },
  ],

  modes: [
    {
      id: 'escape',
      label: 'escape',
      blurb: 'Make text safe to put inside HTML. Try text that is already escaped: escaping is not idempotent.',
      params: [{ name: 'text', type: 'str', hint: 'any text', input: 'text' }],
      template: 'import html\nhtml.escape({$text})',
      cases: [
        { id: 'tag',    label: 'a script tag',     values: { text: '<script>alert("hi")</script>' } },
        { id: 'quotes', label: 'quotes',           values: { text: `Tom's "best" café` } },
        { id: 'twice',  label: 'already escaped',  values: { text: 'Fish &amp; Chips' } },
        { id: 'plain',  label: 'nothing to do',    values: { text: 'plain text, 100% safe' } },
      ],
    },
    {
      id: 'unescape',
      label: 'unescape',
      blurb: 'Decode character references back into characters — named, decimal and hex.',
      params: [{ name: 'text', type: 'str', hint: 'HTML text with &...; references', input: 'text' }],
      template: 'import html\nhtml.unescape({$text})',
      cases: [
        { id: 'named',   label: 'named',             values: { text: '&lt;p&gt;Caf&eacute; &copy; 2026&lt;/p&gt;' } },
        { id: 'numeric', label: 'numeric',           values: { text: '&#60; &#x3C; &#128512;' } },
        { id: 'nosemi',  label: 'no semicolon',      values: { text: 'AT&T &amp &notit; &hearts' } },
        { id: 'cp1252',  label: '&#150; and &#153;', values: { text: '&#150; &#153; &#0;' } },
      ],
    },
    {
      id: 'roundtrip',
      label: 'round trip',
      blurb: 'unescape(escape(s)) always gives s back — the reverse is not true.',
      params: [{ name: 'text', type: 'str', hint: 'any text', input: 'text' }],
      template: 'import html\nsafe = html.escape({$text})\n(safe, html.unescape(safe) == {$text})',
      cases: [
        { id: 'mixed', label: 'mixed',  values: { text: `<b>"5" > '3' & more</b>` } },
        { id: 'ref',   label: 'a reference in the text', values: { text: 'write &lt; for <' } },
      ],
    },
  ],
  demoExplainer: 'escape() replaces & first, so text that already contains a reference gets a second layer: "Fish & Chips" written as a reference comes out with its & escaped again. unescape() follows the HTML5 rules: a few legacy names such as amp and not work without the semicolon (so "&notit;" becomes "¬it;"), but most names, like hearts, need it; references 128-159 are read as Windows-1252, so &#150; is an en dash and &#153; is ™; and &#0; becomes U+FFFD (�).',

  patterns: [
    {
      name: 'Insert user text into a page',
      desc: 'Escape every untrusted value at the point where it enters HTML.',
      code: 'import html\nrow = f"<td>{html.escape(comment)}</td>"',
    },
    {
      name: 'Build an attribute value',
      desc: 'With the default quote=True, " and \' are escaped too, so the value cannot close the attribute.',
      code: 'import html\nlink = f\'<a href="{html.escape(url)}" title="{html.escape(title)}">\'',
    },
    {
      name: 'Plain text out of an HTML snippet',
      desc: 'Decode references after the tags have been removed (by a parser, not a regex).',
      code: 'import html\ntext = html.unescape(fragment_without_tags)',
    },
    {
      name: 'Parse tags with the standard library',
      desc: 'html.parser.HTMLParser calls your methods for each start tag, end tag and run of text.',
      code: 'from html.parser import HTMLParser\n\nclass Links(HTMLParser):\n    def handle_starttag(self, tag, attrs):\n        if tag == "a":\n            print(dict(attrs).get("href"))\n\nLinks().feed(page)',
    },
  ],

  examples: [
    { title: 'Apostrophes become a hex reference', code: 'import html\nhtml.escape("It\'s")',                     returns: "'It&#x27;s'" },
    { title: 'quote=False leaves quotes alone',   code: 'import html\nhtml.escape("It\'s \\"ok\\"", quote=False)', returns: '\'It\\\'s "ok"\'' },
    { title: 'Named references',                  code: "import html\nhtml.unescape('&copy; 2026 caf&eacute;')", returns: "'© 2026 café'" },
    { title: 'Decimal and hex references',        code: "import html\nhtml.unescape('&#60;b&#62; &#x1F600;')",   returns: "'<b> 😀'" },
    { title: 'Round trip',                        code: "import html\ns = '<b>\"Tom\" & \\'Jerry\\'</b>'\nhtml.unescape(html.escape(s)) == s", returns: 'True' },
    { title: 'Non-ASCII text is not touched',     code: "import html\nhtml.escape('naïve 😀')",                 returns: "'naïve 😀'" },
    { title: 'Only str is accepted',              code: 'import html\nhtml.escape(42)',                          returns: "AttributeError: 'int' object has no attribute 'replace'" },
  ],

  pitfalls: [
    {
      name: 'Escaping twice',
      desc: 'escape() does not know that its input is already escaped: every & is escaped again, and the page shows the reference text instead of the character.',
      wrong: { label: 'escape(escape(s))', code: "import html\nhtml.escape(html.escape('Fish & Chips'))", output: "'Fish &amp;amp; Chips'" },
      fix:   { label: 'escape once, at output', code: "import html\nhtml.escape('Fish & Chips')", output: "'Fish &amp; Chips'" },
    },
    {
      name: 'quote=False inside an attribute',
      desc: 'Without quote escaping, a " in the value ends the attribute and the rest becomes markup.',
      wrong: { label: 'quote=False', code: 'import html\nv = \'x" onmouseover="alert(1)\'\nf\'<a title="{html.escape(v, quote=False)}">\'', output: '\'<a title="x" onmouseover="alert(1)">\'' },
      fix:   { label: 'default quote=True', code: 'import html\nv = \'x" onmouseover="alert(1)\'\nf\'<a title="{html.escape(v)}">\'', output: '\'<a title="x&quot; onmouseover=&quot;alert(1)">\'' },
    },
    {
      name: 'Expecting unescape to strip tags',
      desc: 'unescape() only decodes references. Tags stay — and decoding can even create new ones out of escaped text.',
      wrong: { label: 'unescape only', code: "import html\nhtml.unescape('&lt;b&gt;bold&lt;/b&gt;')", output: "'<b>bold</b>'" },
      fix:   { label: 'parse, then use the text', code: "from html.parser import HTMLParser\nclass Text(HTMLParser):\n    def __init__(self):\n        super().__init__()\n        self.parts = []\n    def handle_data(self, data):\n        self.parts.append(data)\np = Text()\np.feed('<b>bold</b> &amp; plain')\n''.join(p.parts)", output: "'bold & plain'" },
    },
  ],

  when: {
    use: [
      'Generating HTML by hand (f-strings, small reports, emails) with values you do not control',
      'Decoding references in scraped text, RSS titles or API fields that arrive HTML-encoded',
    ],
    avoid: [
      'Full pages → a template engine with auto-escaping (Jinja2, Django templates)',
      'Sanitizing HTML you want to keep partly (allow <b>, drop <script>) → a dedicated sanitizer library',
      'URLs in query strings → urllib.parse.quote; JSON in a <script> → json.dumps plus escaping of </',
    ],
  },

  notes: {
    cpython:        'Lib/html/__init__.py — escape is five str.replace calls; unescape is one regex substitution over the html.entities.html5 table',
    'html.entities': 'html5 (2231 names → text, e.g. "amp;" → "&"), name2codepoint and codepoint2name (the 252 HTML 4 entities), entitydefs',
    'html.parser':  'HTMLParser — a forgiving, event-based parser: subclass it and override handle_starttag, handle_endtag, handle_data',
    'Not a sanitizer': 'escape() makes text inert in element content and quoted attributes. It does not make text safe inside <script>, <style>, unquoted attributes or javascript: URLs',
  },

  related: [
    { name: 'html.escape',   slug: 'escape',   when: 'Text → HTML-safe text' },
    { name: 'html.unescape', slug: 'unescape', when: 'Character references → text' },
    { name: 'str.replace()', slug: 'replace',  when: 'What escape() does five times', category: 'functions' },
    { name: 'chr()',         slug: 'chr',      when: 'What a numeric reference turns into', category: 'functions' },
    { name: 're module',     slug: 're',       when: 'Find patterns in text (not for parsing HTML)', category: 'stdlib' },
    { name: 'string module', slug: 'string',   when: 'Template strings for simple substitution', category: 'stdlib' },
  ],

  faq: [
    {
      q: 'How do I escape HTML in Python?',
      a: 'import html, then html.escape(text). It replaces &, < and > with the named references amp, lt and gt (each written between & and ;), and with the default quote=True also " (quot) and \' (the hex reference &#x27;). Do it once, at the moment the text goes into the page.',
    },
    {
      q: 'How do I decode HTML entities like &copy; or &#233; in Python?',
      a: "html.unescape(text). It knows every HTML5 named reference, decimal (&#233;) and hex (&#xE9;) references, and the browser's error-recovery rules — for example a few old names work without the semicolon.",
    },
    {
      q: 'Does html.escape protect against XSS?',
      a: 'In element content and in quoted attribute values, yes — that is what it is for. It does not help inside <script> or <style> blocks, unquoted attributes, or href values like javascript:..., which need validation rather than escaping.',
    },
    {
      q: 'What is the difference between html.escape and the old cgi.escape?',
      a: 'cgi.escape did not escape quotes by default and was removed in Python 3.8 (with the whole cgi module removed in 3.13). html.escape escapes quotes by default, which is the safe choice for attributes.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/html.html',
    meta:  'html — HyperText Markup Language support',
  },
};
