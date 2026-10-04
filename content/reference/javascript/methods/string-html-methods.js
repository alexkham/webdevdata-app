// content/reference/javascript/methods/string-html-methods.js
//
// One combined page for the thirteen Annex B HTML-wrapper methods, in the
// same spirit as the Python bytes-is-methods page. They share one
// implementation shape, one reason to exist, and one reason not to use
// them. The live demo uses bold() as the representative.

export const meta = {
  slug:        'string-html-methods',
  name:        'String HTML methods (bold, italics, link…)',
  signature:   "string.bold(), string.link(url), string.fontcolor(c)…",
  blurb:       'Thirteen deprecated methods that wrap text in 1995-era HTML tags — and do not escape it.',
  category:    'string',
  type:        'string',
  hasLiveDemo: true,
  version:     'Annex B (legacy)',
  searchTerms: 'string bold italics link anchor big small strike sub sup blink fontcolor fontsize fixed html methods deprecated annex b legacy javascript',
};

export const method = {
  slug:      'string-html-methods',
  name:      'String HTML methods (bold, italics, link…)',
  signature: "string.bold(), string.link(url), string.fontcolor(c)…",
  returns:   { type: 'string', desc: 'The string wrapped in an HTML tag. No escaping is performed on the text OR on the attribute values, which is why these are unsafe as well as obsolete.' },

  category:    'String methods (Annex B)',
  version:     'Annex B (legacy)',
  hasLiveDemo: true,

  subtitle: 'Netscape shipped these in 1995 and the web never let them go. They are normatively optional, they generate tags that HTML5 removed, and they interpolate without escaping. Documented here so you recognise them — not so you use them.',

  cheat: {
    commonCall: "'text'.bold()",
    returns: "'<b>text</b>' — unescaped",
    replaces: 'nothing; CSS and real DOM APIs replace THEM',
    watchOut: 'no escaping at all — an XSS hazard on any dynamic input',
  },

  parameters: [
    { name: 'value', type: 'string', required: false, default: 'none', desc: 'Only four of the thirteen take an argument: link(url), anchor(name), fontcolor(color) and fontsize(size). The value is inserted into the attribute with quotes escaped but nothing else.' },
  ],

  demoParams: [
    { name: 's', type: 'string', hint: 'text to wrap', input: 'text' },
  ],
  demoTemplate: '{s}.bold()',
  cases: [
    { id: 'plain',  label: 'plain text',        values: { s: 'hello' } },
    { id: 'spaces', label: 'with spaces',       values: { s: 'hello world' } },
    { id: 'markup', label: 'markup NOT escaped (!)', values: { s: '<script>' } },
    { id: 'empty',  label: 'empty string',      values: { s: '' } },
  ],
  demoExplainer: "bold() stands in for the whole family — every one of the thirteen does the same thing with a different tag name. The third case is the reason this page exists as a warning rather than a recommendation: the input is dropped into the output verbatim, so anything that looks like markup stays markup. Wrapping user input this way and inserting the result with innerHTML is a textbook XSS hole, and the tag it produces was removed from HTML5 anyway.",

  patterns: [
    {
      name: 'Style with CSS',
      desc: 'What bold, italics and the font methods should be.',
      code: 'el.style.fontWeight = "bold";',
    },
    {
      name: 'Build elements safely',
      desc: 'textContent escapes; innerHTML does not.',
      code: 'const a = document.createElement("a");\na.href = url;\na.textContent = label;',
    },
    {
      name: 'Semantic markup in a template',
      desc: 'With the text escaped by whatever renders it.',
      code: 'const html = `<strong>${escapeHtml(text)}</strong>`;',
    },
  ],

  examples: [
    { title: 'bold',        code: "'hi'.bold()",              returns: "'<b>hi</b>'" },
    { title: 'italics',     code: "'hi'.italics()",           returns: "'<i>hi</i>'" },
    { title: 'link',        code: "'hi'.link('/x')",          returns: `'<a href="/x">hi</a>'` },
    { title: 'fontcolor',   code: "'hi'.fontcolor('red')",    returns: `'<font color="red">hi</font>'` },
    { title: 'Not escaped', code: "'<b>'.bold()",             returns: "'<b><b></b>'" },
    { title: 'blink, really',code: "'hi'.blink()",            returns: "'<blink>hi</blink>'" },
  ],

  pitfalls: [
    {
      name: 'They do not escape the text',
      desc: 'The content is concatenated in as-is. Wrapping anything a user supplied and then assigning the result to innerHTML executes whatever they sent — these methods predate the web taking injection seriously.',
      wrong: { label: 'Markup survives', code: "'<img src=x onerror=alert(1)>'.bold()", output: "'<b><img src=x onerror=alert(1)></b>'" },
      fix:   { label: 'Escape, or use textContent', code: 'el.textContent = userInput;', output: 'inert text' },
    },
    {
      name: 'They generate tags HTML5 removed',
      desc: 'font, blink, strike and big are all obsolete. Browsers still render most of them for compatibility, blink does nothing at all any more, and validators reject the lot.',
      wrong: { label: 'Obsolete element', code: "'hi'.fontsize(7)", output: `'<font size="7">hi</font>'` },
      fix:   { label: 'CSS',              code: 'el.style.fontSize = "2em";', output: 'supported' },
    },
    {
      name: 'They are Annex B, not the core language',
      desc: 'Annex B is normatively OPTIONAL — required only for web browsers. A non-browser JavaScript runtime is free to omit them entirely, so code relying on them is not portable even though it works today.',
      wrong: { label: 'May not exist', code: "'hi'.bold()", output: 'TypeError in a conforming non-browser host' },
      fix:   { label: 'Plain string',   code: '`<strong>${escapeHtml(s)}</strong>`', output: 'portable' },
    },
    {
      name: 'anchor and link only escape quotes',
      desc: 'The argument has its double quotes replaced with &quot; and nothing else, so the attribute cannot be broken out of by quoting — but a javascript: URL in link() is passed straight through.',
      wrong: { label: 'Dangerous scheme', code: "'click'.link('javascript:alert(1)')", output: `'<a href="javascript:alert(1)">click</a>'` },
      fix:   { label: 'Validate the URL', code: "new URL(u).protocol === 'https:'", output: 'checked' },
    },
  ],

  when: {
    use: [
      'Never in new code',
      'Recognising them while reading something written long ago',
    ],
    avoid: [
      'Styling text → CSS',
      'Building markup → createElement with textContent, or a templating layer that escapes',
      'Anything involving user input → these escape nothing',
      'Portable code → Annex B is optional outside browsers',
    ],
  },

  notes: {
    complexity: 'O(n) — a concatenation',
    return:     'A new string; the original is untouched',
    cpython:    'V8: Builtins-string-html — one shared helper for all thirteen',
    memory:     'Allocates the wrapped string',
    threadSafe: 'Single-threaded',
  },

  related: [
    { name: 'String.prototype.replace',  slug: 'string-replace',  when: 'Writing an escape function by hand' },
    { name: 'String.prototype.concat',   slug: 'string-concat',   when: 'The other method superseded by template literals' },
    { name: 'String.prototype.toString', slug: 'string-tostring', when: 'Another page about a method not to use' },
    { name: 'Array.prototype.join',      slug: 'array-join',      when: 'Assembling markup from pieces' },
  ],

  faq: [
    {
      q: 'Which methods are in this family?',
      a: 'Thirteen: anchor, big, blink, bold, fixed, fontcolor, fontsize, italics, link, small, strike, sub and sup. Four take an argument — anchor, link, fontcolor and fontsize — and the rest simply wrap.',
      code: "'x'.bold();      // '<b>x</b>'\n'x'.sub();       // '<sub>x</sub>'\n'x'.link('/y');  // '<a href=\"/y\">x</a>'",
    },
    {
      q: 'Will they ever be removed?',
      a: 'Almost certainly not. Annex B exists precisely because removing them would break old pages, and the web platform does not break old pages. They will stay deprecated and functional indefinitely.',
    },
    {
      q: 'Is sub() or sup() safe for maths?',
      a: 'The tags are fine — sub and sup are real HTML5 elements. The METHOD is still unsafe for dynamic text because it does not escape, so build the element properly or escape the content first.',
      code: 'const sup = document.createElement("sup");\nsup.textContent = value;',
    },
  ],

  history: [
    { version: 'Netscape 2', note: 'Added in 1995 alongside the original String methods, when generating HTML from JavaScript meant string concatenation.' },
    { version: 'ES5',        note: 'Documented in Annex B as normatively optional legacy features required for web compatibility.' },
    { version: 'HTML5',      note: 'font, big, strike and blink removed from the HTML specification; the JavaScript methods that generate them remain.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#html_wrapper_methods',
    meta:  'String HTML wrapper methods',
  },

};
