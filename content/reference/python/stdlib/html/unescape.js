// content/reference/python/stdlib/html/unescape.js

export const meta = {
  slug:        'unescape',
  name:        'html.unescape',
  signature:   'html.unescape(s)',
  blurb:       'Decode every named (&copy;), decimal (&#169;) and hex (&#xA9;) character reference in a string, using the HTML5 table and the browser error-recovery rules.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.4+',
  searchTerms: 'html unescape python html.unescape decode html entities convert amp to & html entity to character numeric character reference hex reference html5 named character references nbsp copy without semicolon windows-1252 replacement character html.entities.html5',
};

export const method = {
  slug:      'unescape',
  name:      'html.unescape',
  signature: 'html.unescape(s)',
  returns:   { type: 'str', desc: 'The text with every recognised reference replaced by its character(s). Unrecognised references are left as they are.' },

  category:    'html function',
  version:     'Python 3.4+',
  hasLiveDemo: true,

  subtitle: 'Not a simple table lookup: it decodes the way an HTML5 browser does — 2231 names, some valid without the semicolon, longest-prefix matching, Windows-1252 for &#128;–&#159;, and U+FFFD for references that cannot be characters.',

  covers: ['unescape'],

  cheat: {
    commonCall: "html.unescape('Tom &amp; Jerry')",
    returns:    "'Tom & Jerry'",
    replaces:   'hand-written replace() chains and HTMLParser().unescape (removed in 3.9)',
    watchOut:   'it decodes references only — it does not remove tags',
  },

  parameters: [
    { name: 's', type: 'str', required: true, default: null, desc: 'Text containing character references. A str without any & is returned unchanged; bytes raise TypeError.' },
  ],

  modes: [
    {
      id: 'decode',
      label: 'decode',
      blurb: 'Type HTML text with references.',
      params: [{ name: 'text', type: 'str', hint: 'text with &...; references', input: 'text' }],
      template: 'import html\nhtml.unescape({$text})',
      cases: [
        { id: 'named',  label: 'named',           values: { text: '&lt;p&gt;Caf&eacute; &copy; 2026 &mdash; &euro;5&lt;/p&gt;' } },
        { id: 'nosemi', label: 'no semicolon',    values: { text: '&copy 2026, &eacute;t&eacute &amp more' } },
        { id: 'prefix', label: 'longest prefix',  values: { text: '&notit; &notin; &ampersand' } },
        { id: 'unknown', label: 'unknown names',  values: { text: 'AT&T &foo; &hearts' } },
        { id: 'double', label: 'double-encoded',  values: { text: '&amp;lt;b&amp;gt;' } },
      ],
    },
    {
      id: 'numeric',
      label: 'numeric',
      blurb: 'Build a numeric reference: decimal digits, or x and hex digits.',
      params: [{ name: 'num', type: 'str', hint: '65, x41, 150, 0, xD800 …', input: 'text' }],
      template: "import html\nref = '&#' + {$num} + ';'\n(ref, html.unescape(ref))",
      cases: [
        { id: 'dec',   label: '65',        values: { num: '65' } },
        { id: 'hex',   label: 'x1F600',    values: { num: 'x1F600' } },
        { id: 'w1252', label: '150',       values: { num: '150' } },
        { id: 'zero',  label: '0',         values: { num: '0' } },
        { id: 'surr',  label: 'xD800',     values: { num: 'xD800' } },
        { id: 'big',   label: 'x110000',   values: { num: 'x110000' } },
        { id: 'ctrl',  label: '7 (control)', values: { num: '7' } },
      ],
    },
    {
      id: 'table',
      label: 'name table',
      blurb: 'Is a name in html.entities.html5 — with or without its semicolon?',
      params: [{ name: 'name', type: 'str', hint: "e.g. 'eacute;', 'eacute', 'hearts'", input: 'text' }],
      template: "import html\nfrom html.entities import html5\n({$name} in html5, html.unescape('&' + {$name}))",
      cases: [
        { id: 'semi',   label: 'eacute;',  values: { name: 'eacute;' } },
        { id: 'legacy', label: 'eacute',   values: { name: 'eacute' } },
        { id: 'needs',  label: 'hearts',   values: { name: 'hearts' } },
        { id: 'case',   label: 'Lt;',      values: { name: 'Lt;' } },
      ],
    },
  ],
  demoExplainer: 'Only 106 old names (eacute, copy, amp, lt …) are in the table without a semicolon; hearts is not, so "&hearts" stays as it is. When a name is unknown, the longest known prefix wins: "&notit;" decodes the legacy name not and keeps "it;". References 128–159 are taken as Windows-1252 (150 is an en dash), 0, surrogates (D800–DFFF) and values above 10FFFF become U+FFFD (�), and most control characters, such as 7, are dropped. Names are case-sensitive: Lt; is ≪, not <.',

  patterns: [
    {
      name: 'Clean up text from a feed or API',
      desc: 'Titles and descriptions often arrive HTML-encoded.',
      code: 'import html\ntitle = html.unescape(item["title"]).strip()',
    },
    {
      name: 'Text content of an HTML snippet',
      desc: 'HTMLParser decodes references in text for you (convert_charrefs=True is the default).',
      code: 'from html.parser import HTMLParser\n\nclass TextOnly(HTMLParser):\n    def __init__(self):\n        super().__init__()\n        self.parts = []\n    def handle_data(self, data):\n        self.parts.append(data)\n\np = TextOnly()\np.feed(snippet)\ntext = "".join(p.parts)',
    },
    {
      name: 'Undo double encoding',
      desc: 'Unescape until nothing changes — only for data you know was escaped more than once.',
      code: 'import html\nwhile True:\n    decoded = html.unescape(s)\n    if decoded == s:\n        break\n    s = decoded',
    },
  ],

  examples: [
    { title: 'Named references',               code: "import html\nhtml.unescape('&copy; 2026 caf&eacute;')",   returns: "'© 2026 café'" },
    { title: 'Decimal and hex',                code: "import html\nhtml.unescape('&#60;b&#62; &#x3C;i&#X3E;')",  returns: "'<b> <i>'" },
    { title: 'Astral characters',              code: "import html\nhtml.unescape('&#x1F600; &#128512;')",       returns: "'😀 😀'" },
    { title: 'Some names work without ;',      code: "import html\nhtml.unescape('&eacute &copy')",             returns: "'é ©'" },
    { title: 'Most names need the ;',          code: "import html\nhtml.unescape('&hearts &hearts;')",          returns: "'&hearts ♥'" },
    { title: 'Windows-1252 remapping',         code: "import html\nhtml.unescape('&#128; &#150; &#153;')",      returns: "'€ – ™'" },
    { title: 'Impossible code points → U+FFFD', code: "import html\nhtml.unescape('&#0;|&#xD800;|&#x110000;')", returns: "'�|�|�'" },
    { title: 'A bare & is left alone',         code: "import html\nhtml.unescape('AT&T R&D')",                  returns: "'AT&T R&D'" },
  ],

  pitfalls: [
    {
      name: 'Unescaping once is not enough for double-encoded data',
      desc: 'Text escaped twice (&amp;lt;) decodes to an escaped string after one pass. Find out where the second escape happens rather than unescaping blindly.',
      wrong: { label: 'one pass', code: "import html\nhtml.unescape('&amp;lt;b&amp;gt;')", output: "'&lt;b&gt;'" },
      fix:   { label: 'two passes (known double encoding)', code: "import html\nhtml.unescape(html.unescape('&amp;lt;b&amp;gt;'))", output: "'<b>'" },
    },
    {
      name: 'Unescaping text that is then put back into HTML',
      desc: 'unescape() can turn harmless escaped text into live markup. Re-escape before output.',
      wrong: { label: 'unescape → page', code: "import html\nhtml.unescape('&lt;script&gt;x()&lt;/script&gt;')", output: "'<script>x()</script>'" },
      fix:   { label: 'escape before output', code: "import html\nhtml.escape(html.unescape('&lt;script&gt;x()&lt;/script&gt;'))", output: "'&lt;script&gt;x()&lt;/script&gt;'" },
    },
    {
      name: 'Expecting a non-breaking space to be a space',
      desc: '&nbsp; decodes to U+00A0, which looks like a space but is not equal to one. str.split() treats it as whitespace; == and replace(" ") do not.',
      wrong: { label: "== ' '", code: "import html\nhtml.unescape('&nbsp;') == ' '", output: 'False' },
      fix:   { label: 'replace it', code: "import html\nhtml.unescape('a&nbsp;b').replace('\\xa0', ' ')", output: "'a b'" },
    },
  ],

  when: {
    use: [
      'Turning HTML-encoded text (scraped pages, RSS, API fields) back into plain text',
      'Comparing or searching text that may contain references',
    ],
    avoid: [
      'Removing tags → html.parser.HTMLParser (or a full parser library)',
      'Percent-encoded URLs (%20) → urllib.parse.unquote',
      'XML documents → xml.etree / xml.sax.saxutils.unescape (XML has only five named entities)',
    ],
  },

  notes: {
    cpython:        "One regex, &(#[0-9]+;?|#[xX][0-9a-fA-F]+;?|[^\\t\\n\\f <&#;]{1,32};?), substituted with a function that looks the match up in html.entities.html5 — see Lib/html/__init__.py",
    'Numeric rules': 'Following the HTML5 tokenizer: 0x80–0x9F map through Windows-1252, 0 and anything that is not a valid code point give U+FFFD, noncharacters and most C0/C1 controls are removed',
    'Huge numbers': 'A decimal reference longer than 4300 digits raises ValueError: int() refuses to convert it (the integer string conversion limit); hex references have no such limit',
    'Inverse':      'unescape(escape(s)) == s always; escape(unescape(s)) == s only if s contained no references that escape() would not produce',
  },

  related: [
    { name: 'html.escape', slug: 'escape', when: 'The reverse direction' },
    { name: 'html module', slug: 'html',   when: 'html.entities tables and html.parser', category: 'stdlib' },
    { name: 'chr()',       slug: 'chr',    when: 'Code point → character, as numeric references do', category: 'functions' },
    { name: 'ord()',       slug: 'ord',    when: 'Character → the number for &#...;', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I convert HTML entities to characters in Python?',
      a: "html.unescape(text). It decodes named references like &copy;, decimal (&#169;) and hex (&#xA9;) references. Older code used HTMLParser().unescape, which was removed in Python 3.9.",
    },
    {
      q: 'Why does html.unescape decode some entities without a semicolon?',
      a: 'HTML5 keeps 106 legacy names (mostly the Latin-1 names from HTML 4: copy, eacute, amp, lt and friends) that browsers accept without the trailing ;. unescape follows the same rule; newer names such as hearts need the semicolon.',
    },
    {
      q: 'Why does &#150; become an en dash instead of a control character?',
      a: 'Old pages often contained Windows-1252 byte values as references. The HTML5 spec maps &#128;–&#159; to the Windows-1252 characters (€, ‘, ’, “, –, ™ …), and unescape does the same.',
    },
    {
      q: 'Does html.unescape remove HTML tags?',
      a: 'No. It only replaces character references. To get text without tags, feed the markup to html.parser.HTMLParser and collect handle_data, or use a parser library.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/html.html#html.unescape',
    meta:  'html.unescape',
  },
};
