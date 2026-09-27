// content/reference/javascript/methods/string-raw.js
//
// Doc-only page: String.raw is a TAG function, used as a prefix on a
// template literal. A text input cannot supply an uncooked template — by
// the time any string reaches the demo harness its escapes have already
// been processed, so a live demo would necessarily misrepresent it.

export const meta = {
  slug:        'string-raw',
  name:        'String.raw',
  signature:   'String.raw`template`',
  blurb:       'The tag that leaves backslashes alone — for Windows paths and regex sources.',
  category:    'string',
  type:        'string',
  hasLiveDemo: false,
  version:     'ES2015',
  searchTerms: 'String.raw tag template literal backslash escape windows path regex source verbatim static es2015 javascript',
};

export const method = {
  slug:      'string-raw',
  name:      'String.raw',
  signature: 'String.raw`template`',
  returns:   { type: 'string', desc: 'The template literal with its escape sequences left UNPROCESSED — a backslash-n stays two characters instead of becoming a newline. Interpolated ${} values are still substituted normally.' },

  category:    'String static method',
  version:     'ES2015',
  hasLiveDemo: false,

  subtitle: 'The only built-in template tag. It is not a normal function call — it is written as a prefix on a backtick literal, which is why it looks unlike everything else in the String API.',

  cheat: {
    commonCall: 'String.raw`C:\\Users\\Alex`',
    returns:    'the text with backslashes intact',
    replaces:   'doubling every backslash by hand',
    watchOut:   'it cannot help a string that is already built',
  },

  parameters: [
    { name: 'strings',  type: 'object', required: true,  default: null,   desc: 'The template strings object, supplied automatically when used as a tag. Its raw property holds the uncooked text.' },
    { name: '...values',type: 'any',    required: false, default: 'none', desc: 'The interpolated ${} expressions, also supplied automatically. These ARE evaluated and inserted normally.' },
  ],

  examples: [
    { title: 'Backslash-n stays literal', code: 'String.raw`a\\nb`',        returns: "'a\\\\nb'   // two characters, not a newline" },
    { title: 'A normal template',         code: '`a\\nb`',                  returns: "'a\\nb'    // an actual newline" },
    { title: 'Its length',                code: 'String.raw`a\\nb`.length', returns: '4' },
    { title: 'A Windows path',            code: 'String.raw`C:\\new\\table`', returns: "'C:\\\\new\\\\table'" },
    { title: 'Interpolation still works', code: 'String.raw`a${1 + 1}b`',   returns: "'a2b'" },
    { title: 'Called as a function',      code: "String.raw({raw: ['a', 'b']}, 1)", returns: "'a1b'" },
  ],

  pitfalls: [
    {
      name: 'It cannot fix a string you already have',
      desc: 'The escapes are processed by the parser when the literal is read. String.raw works only because a tag sees the text BEFORE that happens — applying it to a variable is meaningless, since the damage is already done.',
      wrong: { label: 'Too late', code: 'const p = "C:\\new";\nString.raw(p)', output: 'the \\n is already a newline' },
      fix:   { label: 'Tag the literal', code: 'const p = String.raw`C:\\new`;', output: "'C:\\\\new'" },
    },
    {
      name: 'It is a tag, not an ordinary call',
      desc: 'String.raw(x) with parentheses does not do what you want — it expects a template strings object with a raw property. Written with parentheses and a plain string it returns undefined or throws, depending on what you passed.',
      wrong: { label: 'Parentheses', code: 'String.raw("a\\nb")', output: 'TypeError: Cannot read properties of undefined' },
      fix:   { label: 'Backticks',   code: 'String.raw`a\\nb`', output: "'a\\\\nb'" },
    },
    {
      name: 'A trailing backslash is still a syntax error',
      desc: 'The tag changes how escapes are interpreted, not how the literal is terminated. A backslash immediately before the closing backtick escapes it, so the literal never closes.',
      wrong: { label: 'Will not parse', code: 'String.raw`C:\\`', output: 'SyntaxError: Unterminated template literal' },
      fix:   { label: 'Concatenate',    code: "String.raw`C:` + '\\\\'", output: "'C:\\\\'" },
    },
    {
      name: 'Not a substitute for proper escaping',
      desc: 'It makes regex sources and paths readable; it does nothing for safety. Interpolated values are inserted verbatim, so String.raw around user input in a regex or a query is exactly as dangerous as a plain template literal.',
      wrong: { label: 'Still unescaped', code: 'new RegExp(String.raw`${userInput}`)', output: 'user metacharacters are live' },
      fix:   { label: 'Escape the input', code: 'new RegExp(escapeRegExp(userInput))', output: 'literal' },
    },
  ],

  when: {
    use: [
      'Windows file paths written as literals',
      'Regular expression sources built as strings',
      'LaTeX, or anything else dense in backslashes',
      'Generating code or documentation that must show escape sequences',
    ],
    avoid: [
      'The string already exists in a variable → too late, escape at the source',
      'A regex you can write as a literal → /pattern/ needs no escaping of backslashes',
      'Forward-slash paths → no backslashes, no need',
      'Interpolating untrusted values → escape them explicitly',
    ],
  },

  notes: {
    complexity: 'O(n) in the length of the template',
    return:     'A new string',
    cpython:    'V8: Builtins-string-raw',
    memory:     'Allocates the result string',
    threadSafe: 'Single-threaded',
  },

  related: [
    { name: 'String.fromCharCode',      slug: 'string-fromcharcode', when: 'The other String static' },
    { name: 'String.fromCodePoint',     slug: 'string-fromcodepoint',when: 'Building characters from code points' },
    { name: 'String.prototype.replace', slug: 'string-replace',      when: 'Where $ escaping causes similar confusion' },
    { name: 'String.prototype.concat',  slug: 'string-concat',       when: 'Joining a raw literal to something else' },
  ],

  faq: [
    {
      q: 'Why is there no live demo on this page?',
      a: 'Because String.raw only does anything when it prefixes a template literal in source code. Any string typed into an input box has already had its escapes processed — or never had any — so a demo could only show the tag doing nothing, which would misrepresent it. The examples above are run against a real runtime instead.',
    },
    {
      q: 'What does the "raw" actually mean?',
      a: 'Every template tag receives a strings object with two views: the cooked text, where \\n has become a newline, and the raw text, where it is still a backslash followed by an n. String.raw simply returns the raw view with the interpolations filled in.',
      code: "function tag(s) { return [s[0], s.raw[0]]; }\ntag`a\\nb`;\n// s[0] is a real newline; s.raw[0] is backslash + n",
    },
    {
      q: 'Do I need it for regular expressions?',
      a: 'Not for a regex literal — /\\d+/ already means what it looks like. It helps when you must build the pattern as a string for new RegExp, where a literal would otherwise need every backslash doubled.',
      code: "new RegExp(String.raw`\\d+`);   // instead of '\\\\d+'",
    },
    {
      q: 'Can I write my own tag like this?',
      a: 'Yes — any function can be a template tag. It receives the strings object first and the interpolated values as the remaining arguments, which is how libraries implement things like SQL escaping and styled components.',
      code: 'function upper(s, ...v) {\n  return s.raw.reduce((a, p, i) => a + p + (v[i] ?? "").toString().toUpperCase(), "");\n}',
    },
  ],

  history: [
    { version: 'ES2015', note: 'String.raw added with template literals as the one built-in tag function.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/raw',
    meta:  'String.raw',
  },

  tryInTool: [],
};
