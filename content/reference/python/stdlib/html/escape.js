// content/reference/python/stdlib/html/escape.js

export const meta = {
  slug:        'escape',
  name:        'html.escape',
  signature:   'html.escape(s, quote=True)',
  blurb:       'Replace &, < and > (and, by default, " and \') with HTML character references so text displays literally instead of being read as markup.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.2+',
  searchTerms: 'html escape python html.escape escape html special characters encode html entities amp lt gt quot x27 quote=False xss prevent html injection attribute value cgi.escape replacement',
};

export const method = {
  slug:      'escape',
  name:      'html.escape',
  signature: 'html.escape(s, quote=True)',
  returns:   { type: 'str', desc: 'A new string with the special characters replaced; everything else unchanged.' },

  category:    'html function',
  version:     'Python 3.2+',
  hasLiveDemo: true,

  subtitle: 'Five replacements, & first: the three markup characters always, both quote characters unless quote=False. Non-ASCII text, newlines and everything else pass through untouched.',

  covers: ['escape'],

  cheat: {
    commonCall: 'html.escape(user_text)',
    returns:    "'&lt;b&gt;Tom &amp; Jerry&lt;/b&gt;' for '<b>Tom & Jerry</b>'",
    replaces:   'cgi.escape (removed in 3.8) and chains of .replace() calls',
    watchOut:   'escaping already-escaped text escapes every & again',
  },

  parameters: [
    { name: 's',     type: 'str',  required: true,  default: null,   desc: 'The text to escape. Must be a str — bytes and numbers fail (convert with str() first).' },
    { name: 'quote', type: 'bool', required: false, default: 'True', desc: "Also replace \" with &quot; and ' with &#x27;. Keep it True for attribute values; False is fine for element content." },
  ],

  modes: [
    {
      id: 'escape',
      label: 'escape',
      blurb: 'The default: & < > " and \' are all replaced.',
      params: [{ name: 'text', type: 'str', hint: 'any text', input: 'text' }],
      template: 'import html\nhtml.escape({$text})',
      cases: [
        { id: 'tag',   label: 'markup',          values: { text: '<a href="/x">Tom & Jerry</a>' } },
        { id: 'apos',  label: 'apostrophe',      values: { text: "it's 5 > 3" } },
        { id: 'twice', label: 'already escaped', values: { text: '&lt;b&gt; is bold' } },
        { id: 'utf',   label: 'non-ASCII',       values: { text: 'naïve café 😀' } },
      ],
    },
    {
      id: 'noquote',
      label: 'quote=False',
      blurb: 'Only & < and > — quotes are left as they are.',
      params: [{ name: 'text', type: 'str', hint: 'any text', input: 'text' }],
      template: 'import html\nhtml.escape({$text}, quote=False)',
      cases: [
        { id: 'quotes', label: 'quotes',  values: { text: `He said "it's <fine>"` } },
        { id: 'amp',    label: 'ampersand', values: { text: 'R&D' } },
      ],
    },
    {
      id: 'attr',
      label: 'in an attribute',
      blurb: 'Put the escaped value inside a double-quoted attribute. Try a value that contains a double quote.',
      params: [{ name: 'value', type: 'str', hint: 'attribute value', input: 'text' }],
      template: 'import html\nv = html.escape({$value})\nf\'<input value="{v}">\'',
      cases: [
        { id: 'plain',  label: 'plain',          values: { value: 'Ada Lovelace' } },
        { id: 'inject', label: 'breakout attempt', values: { value: '" autofocus onfocus="alert(1)' } },
      ],
    },
  ],
  demoExplainer: 'Every & is replaced first, then < and >, then the two quote characters — so the output of escape() can never contain a bare markup character, and the double quote in the breakout attempt can no longer end the value="..." attribute. The apostrophe becomes the hex reference &#x27;, not a named one. Already-escaped input gets its & escaped again: escape() cannot tell text from markup.',

  patterns: [
    {
      name: 'Escape at output time',
      desc: 'Store and process raw text; escape only where it is written into HTML.',
      code: 'import html\nrows = "".join(f"<li>{html.escape(name)}</li>" for name in names)',
    },
    {
      name: 'Escape non-str values',
      desc: 'escape() calls str methods, so convert numbers, None and objects first.',
      code: 'import html\ncell = html.escape(str(value))',
    },
    {
      name: 'A tiny escaping helper for templates',
      desc: 'Wrap escape() so every interpolated value goes through it.',
      code: 'import html\ndef render(template, **values):\n    return template.format(**{k: html.escape(str(v)) for k, v in values.items()})\n\nrender("<p>{name}</p>", name="<b>x</b>")',
    },
  ],

  examples: [
    { title: 'The apostrophe becomes a hex reference', code: 'import html\nhtml.escape("It\'s")',                          returns: "'It&#x27;s'" },
    { title: 'quote=False keeps quotes',             code: 'import html\nhtml.escape("It\'s", quote=False)',             returns: '"It\'s"' },
    { title: 'Nothing to escape',                    code: "import html\nhtml.escape('plain text 100%')",               returns: "'plain text 100%'" },
    { title: 'Non-ASCII is left as it is',           code: "import html\nhtml.escape('naïve café 😀')",                  returns: "'naïve café 😀'" },
    { title: 'The output is longer',                 code: "import html\nlen('<'), len(html.escape('<'))",              returns: '(1, 4)' },
    { title: 'unescape() reverses it exactly',       code: "import html\ns = '<a title=\"x\">\\'R&D\\'</a>'\nhtml.unescape(html.escape(s)) == s", returns: 'True' },
    { title: 'Numbers must be converted first',      code: 'import html\nhtml.escape(3.5)',                              returns: "AttributeError: 'float' object has no attribute 'replace'" },
    { title: 'bytes are rejected',                   code: "import html\nhtml.escape(b'<b>')",                           returns: "TypeError: a bytes-like object is required, not 'str'" },
  ],

  pitfalls: [
    {
      name: 'Double escaping',
      desc: 'Escaping a value that was already escaped (in the database, by a template engine, by an earlier call) shows the reference text on the page.',
      wrong: { label: 'escaped twice', code: "import html\nhtml.escape('&lt;b&gt;')", output: "'&amp;lt;b&amp;gt;'" },
      fix:   { label: 'escape raw text once', code: "import html\nhtml.escape('<b>')", output: "'&lt;b&gt;'" },
    },
    {
      name: 'quote=False for attribute values',
      desc: 'A " inside the value closes the attribute and injects new attributes.',
      wrong: { label: 'quote=False', code: "import html\nv = html.escape('x\" onclick=\"go()', quote=False)\nf'<p title=\"{v}\">'", output: '\'<p title="x" onclick="go()">\'' },
      fix:   { label: 'quote=True (default)', code: "import html\nv = html.escape('x\" onclick=\"go()')\nf'<p title=\"{v}\">'", output: '\'<p title="x&quot; onclick=&quot;go()">\'' },
    },
    {
      name: 'Passing bytes',
      desc: 'escape() replaces with str arguments, so a bytes value fails with a confusing message. Decode first.',
      wrong: { label: 'bytes', code: "import html\nhtml.escape(b'a < b')", output: "TypeError: a bytes-like object is required, not 'str'" },
      fix:   { label: 'decode', code: "import html\nhtml.escape(b'a < b'.decode())", output: "'a &lt; b'" },
    },
  ],

  when: {
    use: [
      'Writing untrusted text into HTML element content or a quoted attribute',
      'Showing code or markup literally on a web page',
    ],
    avoid: [
      'Values inside <script> or <style> — escaping does not make them safe there',
      'URLs in href/src → validate the scheme, and use urllib.parse.quote for query values',
      'Whole pages → a template engine that auto-escapes (Jinja2, Django)',
    ],
  },

  notes: {
    cpython:   's.replace("&", "&amp;") first, then < → &lt;, > → &gt;, and with quote: " → &quot;, \' → &#x27; — pure Python, no regex',
    'Order':   'The & replacement must run first, otherwise the & of the new references would be escaped again',
    'Inverse': 'html.unescape(html.escape(s)) == s for every str s',
  },

  related: [
    { name: 'html.unescape', slug: 'unescape', when: 'The reverse direction' },
    { name: 'html module',   slug: 'html',     when: 'Overview, html.parser and html.entities', category: 'stdlib' },
    { name: 'str.replace()', slug: 'replace',  when: 'The building block escape() uses', category: 'functions' },
    { name: 'repr()',        slug: 'repr',     when: 'Show a string with Python escapes instead', category: 'functions' },
  ],

  faq: [
    {
      q: 'Which characters does html.escape replace?',
      a: "Five: & < > always, plus \" and ' when quote is true (the default). The double quote becomes the named reference quot and the apostrophe the hex reference &#x27;. Nothing else changes — accented letters and emoji are left as they are, which is correct for a UTF-8 page.",
    },
    {
      q: 'Why does html.escape turn an apostrophe into &#x27; and not a named reference?',
      a: "The named reference apos is not defined in HTML 4, so older browsers did not understand it; &#x27; works everywhere. html.unescape decodes both forms.",
    },
    {
      q: 'Do I need quote=True?',
      a: 'Yes whenever the text goes inside an attribute value. In element content (between tags) quotes are harmless and quote=False gives slightly more readable output.',
    },
    {
      q: 'How do I escape HTML in Python 2 or old code that used cgi.escape?',
      a: 'Replace cgi.escape(s) with html.escape(s, quote=False) to keep the old output exactly, or plain html.escape(s) to also escape quotes. cgi.escape was removed in Python 3.8.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/html.html#html.escape',
    meta:  'html.escape',
  },
};
