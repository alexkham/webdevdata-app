// content/reference/javascript/methods/string-trim.js

export const meta = {
  slug:        'string-trim',
  name:        'String.prototype.trim',
  signature:   'string.trim()',
  blurb:       'Strip whitespace from both ends — including the non-breaking spaces you cannot see.',
  category:    'string',
  type:        'string',
  hasLiveDemo: true,
  version:     'ES5 (2009)',
  searchTerms: 'string trim trimStart trimEnd trimLeft trimRight whitespace strip spaces tabs newlines validation form input javascript',
};

export const method = {
  slug:      'string-trim',
  name:      'String.prototype.trim',
  signature: 'string.trim()',
  returns:   { type: 'string', desc: 'A new string with leading and trailing whitespace removed. Whitespace in the middle is left completely alone.' },

  category:    'String method',
  version:     'ES5 (2009)',
  hasLiveDemo: true,

  subtitle: 'The first thing to do with any text a human typed. Its definition of whitespace is broader than the space bar — tabs, newlines, non-breaking spaces and a dozen Unicode separators all count.',

  cheat: {
    commonCall: 'input.value.trim()',
    returns:    'a new string — assign it',
    replaces:   "s.replace(/^\\s+|\\s+$/g, '')",
    watchOut:   'only the ends; interior whitespace is untouched',
  },

  parameters: [],

  demoParams: [
    { name: 's', type: 'string', hint: 'text with spaces around it', input: 'text' },
  ],
  demoTemplate: '{s}.trim()',
  cases: [
    { id: 'spaces',  label: 'spaces both ends',  values: { s: '  hi  ' } },
    { id: 'tabs',    label: 'tabs and newlines', values: { s: '\t\n hi \n' } },
    { id: 'inner',   label: 'inner space kept',  values: { s: '  a b  ' } },
    { id: 'nothing', label: 'nothing to trim',   values: { s: 'hi' } },
    { id: 'allspace',label: 'only whitespace',   values: { s: '   ' } },
  ],
  demoExplainer: "The quotes in the output are what make this readable — they show exactly where the string now begins and ends. Tabs and newlines are whitespace too, so the second case strips them alongside spaces. The third case is the limit of what trim does: the space between 'a' and 'b' survives, because only the ends are touched. The last case collapses to an empty string, which is why `if (input.trim())` is the standard test for whether a user actually typed anything.",

  patterns: [
    {
      name: 'Validate a form field',
      desc: 'The canonical use — whitespace is not input.',
      code: 'if (!name.trim()) return "Name is required";',
    },
    {
      name: 'Clean parsed fields',
      desc: 'Splitting leaves the spaces around delimiters behind.',
      code: "const fields = line.split(',').map(f => f.trim());",
    },
    {
      name: 'Normalise inner whitespace too',
      desc: 'trim does the ends; a replace collapses the middle.',
      code: "const clean = s.trim().replace(/\\s+/g, ' ');",
    },
  ],

  examples: [
    { title: 'Both ends',        code: "'  hi  '.trim()",        returns: "'hi'" },
    { title: 'Tabs and newlines',code: "'\\t\\n hi '.trim()",     returns: "'hi'" },
    { title: 'Leading only',     code: "'  hi  '.trimStart()",   returns: "'hi  '" },
    { title: 'Trailing only',    code: "'  hi  '.trimEnd()",     returns: "'  hi'" },
    { title: 'Interior kept',    code: "'  a b  '.trim()",       returns: "'a b'" },
    { title: 'All whitespace',   code: "'   '.trim()",           returns: "''" },
  ],

  pitfalls: [
    {
      name: 'It returns a new string and changes nothing',
      desc: 'The single most common trim bug: calling it on a variable and expecting that variable to be clean. Strings are immutable, so the result must be assigned or passed on.',
      wrong: { label: 'Discarded', code: "let s = ' hi ';\ns.trim();\ns", output: "' hi '" },
      fix:   { label: 'Assign it', code: "let s = ' hi ';\ns = s.trim();\ns", output: "'hi'" },
    },
    {
      name: 'Interior whitespace is not touched',
      desc: 'Trimming a name or a search term still leaves double spaces in the middle, so two entries that look identical can compare unequal. Collapse runs of whitespace separately if the comparison matters.',
      wrong: { label: 'Still differs', code: "'a  b'.trim() === 'a b'", output: 'false' },
      fix:   { label: 'Collapse too',  code: "'a  b'.trim().replace(/\\s+/g, ' ') === 'a b'", output: 'true' },
    },
    {
      name: 'Whitespace includes characters you cannot see',
      desc: 'Text pasted from a web page or a word processor often carries a non-breaking space (U+00A0). trim DOES remove it, which is helpful — but a hand-rolled replace of literal spaces will not, and neither will a comparison against " ".',
      wrong: { label: 'Literal space only', code: "'\\u00a0hi'.replace(/ /g, '')", output: "'\\u00a0hi'" },
      fix:   { label: 'trim handles it',    code: "'\\u00a0hi'.trim()", output: "'hi'" },
    },
    {
      name: 'trimLeft and trimRight are legacy aliases',
      desc: 'They are identical to trimStart and trimEnd, kept in Annex B only because old code uses them. The Start/End names match padStart and padEnd, so prefer those.',
      wrong: { label: 'Legacy name', code: "' hi '.trimLeft()", output: "'hi '   // works, but Annex B" },
      fix:   { label: 'Standard name', code: "' hi '.trimStart()", output: "'hi '" },
    },
  ],

  when: {
    use: [
      'Any text that came from a human — form fields, pasted content, file input',
      'Before comparing or storing a value',
      'Cleaning fields after a split',
      'Testing whether a field is genuinely empty',
    ],
    avoid: [
      'You need only one side → trimStart or trimEnd',
      'You want to remove something other than whitespace → replace, or slice',
      'Interior whitespace matters → collapse it with a replace as well',
      'You want to pad rather than strip → padStart, padEnd',
    ],
  },

  notes: {
    complexity: 'O(n) worst case, though typically only the ends are scanned',
    return:     'A new string; the original is untouched',
    cpython:    'V8: Builtins-string-trim',
    memory:     'Allocates the result, or returns the original when there is nothing to strip',
    threadSafe: 'Single-threaded; the string is only read',
  },

  related: [
    { name: 'String.prototype.padStart',   slug: 'string-padstart',   when: 'Adding characters rather than removing them' },
    { name: 'String.prototype.replace',    slug: 'string-replace',    when: 'Collapsing interior whitespace as well' },
    { name: 'String.prototype.split',      slug: 'string-split',      when: 'Breaking a line into fields to trim' },
    { name: 'String.prototype.toLowerCase',slug: 'string-tolowercase',when: 'The other half of normalising user input' },
  ],

  faq: [
    {
      q: 'What counts as whitespace?',
      a: 'More than you might expect: space, tab, carriage return, line feed, vertical tab, form feed, the non-breaking space U+00A0, the byte order mark U+FEFF, and the Unicode space separators. It is the same set the language uses for whitespace in source code.',
      code: "'\\u00a0\\u2003 hi '.trim();   // 'hi'",
    },
    {
      q: 'trimStart or trimLeft?',
      a: 'trimStart. The two are the same function — trimLeft is literally specified as an alias in Annex B — but Start and End match padStart and padEnd and read correctly in right-to-left contexts.',
      code: "' hi '.trimStart();   // standard\n' hi '.trimLeft();    // legacy alias",
    },
    {
      q: 'How do I remove whitespace everywhere, not just the ends?',
      a: 'A global replace. Decide whether you want runs collapsed to a single space, which is usually right for display text, or all whitespace deleted, which is right for things like card numbers.',
      code: "s.replace(/\\s+/g, ' ');   // collapse\ns.replace(/\\s/g, '');      // delete all",
    },
    {
      q: 'Is trim enough to validate a required field?',
      a: 'For emptiness, yes — trimming then testing catches the user who typed only spaces. It says nothing about invisible characters that are not whitespace, such as zero-width joiners, which survive a trim and can still make two values differ.',
      code: 'if (!value.trim()) showError();',
    },
  ],

  history: [
    { version: 'ES5',    note: 'trim standardised in 2009, replacing the regex idiom every library had shipped.' },
    { version: 'ES2019', note: 'trimStart and trimEnd standardised, with trimLeft and trimRight kept as Annex B aliases.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim',
    meta:  'String.prototype.trim',
  },

};
