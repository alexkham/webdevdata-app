// content/reference/javascript/methods/string-touppercase.js
//
// toLocaleUpperCase is consolidated here, matching the toLowerCase page.

export const meta = {
  slug:        'string-touppercase',
  name:        'String.prototype.toUpperCase',
  signature:   'string.toUpperCase()',
  blurb:       'Upper case — where ß becomes SS and the string gets longer.',
  category:    'string',
  type:        'string',
  hasLiveDemo: true,
  version:     'ES1 (1997)',
  searchTerms: 'string toUpperCase toLocaleUpperCase uppercase capitals shout eszett sharp s length change unicode javascript',
};

export const method = {
  slug:      'string-touppercase',
  name:      'String.prototype.toUpperCase',
  signature: 'string.toUpperCase()',
  returns:   { type: 'string', desc: 'A new string mapped to upper case by the Unicode default rules. The result may be LONGER than the input — some characters expand.' },

  category:    'String method',
  version:     'ES1 (1997)',
  hasLiveDemo: true,

  subtitle: 'The mirror of toLowerCase, with one extra hazard: upper-casing can change the length of the string, which no amount of index arithmetic will survive.',

  cheat: {
    commonCall: 'code.toUpperCase()',
    returns:    'a new string — assign it',
    replaces:   'nothing; it is the base method',
    watchOut:   'length can grow — ß becomes SS',
  },

  parameters: [],

  demoParams: [
    { name: 's', type: 'string', hint: 'text to uppercase', input: 'text' },
  ],
  demoTemplate: '{s}.toUpperCase()',
  cases: [
    { id: 'basic',   label: 'mixed case',         values: { s: 'Hello World' } },
    { id: 'eszett',  label: 'German ß → SS (!)',  values: { s: 'straße' } },
    { id: 'accents', label: 'accented letters',   values: { s: 'élan vital' } },
    { id: 'sigma',   label: 'both Greek sigmas',  values: { s: 'όσος' } },
    { id: 'digits',  label: 'digits unchanged',   values: { s: 'abc123!' } },
  ],
  demoExplainer: "The German ß is the case to look at: it upper-cases to two characters, SS, so 'straße' becomes seven letters from six. Any code that assumed a case conversion preserves length — a fixed-width field, an index calculated before the call — is wrong for this input. The Greek case is a second example of a many-to-one mapping: both the regular sigma and the word-final sigma ς map to the same capital Σ, so upper-casing Greek text is not reversible either.",

  patterns: [
    {
      name: 'Normalise a code or identifier',
      desc: 'Upper case is conventional for country and currency codes.',
      code: 'const cc = input.trim().toUpperCase();',
    },
    {
      name: 'Capitalise the first letter only',
      desc: 'toUpperCase on one character, then the rest.',
      code: 'const title = s.charAt(0).toUpperCase() + s.slice(1);',
    },
    {
      name: 'Shout for display',
      desc: 'Prefer CSS — it keeps the underlying data intact.',
      code: 'text-transform: uppercase;',
    },
  ],

  examples: [
    { title: 'Mixed case',       code: "'Hello'.toUpperCase()",        returns: "'HELLO'" },
    { title: 'ß expands',        code: "'\\u00df'.toUpperCase()",      returns: "'SS'" },
    { title: 'Length grows',     code: "'stra\\u00dfe'.toUpperCase().length", returns: '7   // was 6' },
    { title: 'Not reversible',   code: "'\\u00df'.toUpperCase().toLowerCase()", returns: "'ss'" },
    { title: 'Both sigmas merge',code: "'\\u03c3\\u03c2'.toUpperCase()", returns: "'\\u03a3\\u03a3'" },
    { title: 'Turkish differs',  code: "'i'.toLocaleUpperCase('tr')",  returns: "'\\u0130'   // dotted capital" },
  ],

  pitfalls: [
    {
      name: 'The result can be longer than the input',
      desc: 'ß becomes SS, and several ligatures expand similarly. Code that upper-cases a value into a fixed-width field, or that reuses an index computed before the conversion, silently corrupts exactly the input it was least tested on.',
      wrong: { label: 'Length changed', code: "'stra\\u00dfe'.length + ' -> ' + 'stra\\u00dfe'.toUpperCase().length", output: "'6 -> 7'" },
      fix:   { label: 'Recompute after', code: 'const upper = s.toUpperCase();\nconst n = upper.length;', output: 'correct' },
    },
    {
      name: 'Case conversion is not reversible',
      desc: 'Upper-casing then lower-casing does not return the original for ß, for the final Greek sigma, or for any other many-to-one mapping. Keep the original string if you need it; derive the folded form separately.',
      wrong: { label: 'Lost', code: "'\\u00df'.toUpperCase().toLowerCase()", output: "'ss'" },
      fix:   { label: 'Keep both', code: 'const display = original;\nconst key = original.toLowerCase();', output: 'original preserved' },
    },
    {
      name: 'It returns a new string and changes nothing',
      desc: 'Same rule as everywhere else in the string API.',
      wrong: { label: 'Discarded', code: "let s = 'abc';\ns.toUpperCase();\ns", output: "'abc'" },
      fix:   { label: 'Assign it', code: "let s = 'abc';\ns = s.toUpperCase();\ns", output: "'ABC'" },
    },
    {
      name: 'Upper-casing for display belongs in CSS',
      desc: 'text-transform leaves the underlying value untouched, so copy-paste, form submission and screen readers all get the real text. Converting in JavaScript bakes the shouting into your data.',
      wrong: { label: 'Data changed', code: 'input.value = input.value.toUpperCase()', output: 'the stored value is now uppercase' },
      fix:   { label: 'Style only',   code: 'text-transform: uppercase', output: 'display only' },
    },
  ],

  when: {
    use: [
      'Normalising codes that are conventionally upper case — currency, country, state',
      'Capitalising a single leading character',
      'Matching a protocol that specifies upper case',
    ],
    avoid: [
      'Shouting for visual effect → text-transform in CSS',
      'Case-insensitive comparison → toLowerCase is the conventional direction',
      'Text the user reads → toLocaleUpperCase with their locale',
      'You rely on the length staying the same → it does not',
    ],
  },

  notes: {
    complexity: 'O(n)',
    return:     'A new string, possibly of a different length',
    cpython:    'V8: Builtins-string-touppercase / ICU',
    memory:     'Allocates the result',
    threadSafe: 'Single-threaded; the string is only read',
  },

  related: [
    { name: 'String.prototype.toLowerCase', slug: 'string-tolowercase', when: 'The other direction, and the usual one for comparison' },
    { name: 'String.prototype.at',          slug: 'string-at',          when: 'Grab the first character to capitalise' },
    { name: 'String.prototype.slice',       slug: 'string-slice',       when: 'Take the rest of the string unchanged' },
    { name: 'String.prototype.trim',        slug: 'string-trim',        when: 'Normalising input before converting' },
  ],

  faq: [
    {
      q: 'Why does straße become STRASSE and not STRAßE?',
      a: 'Because there was no capital ß in standard German orthography when the Unicode mappings were written, so the defined upper-case form of ß is the two-letter SS. A capital ẞ was later encoded, but the default mapping was not changed — it would break existing text.',
      code: "'stra\\u00dfe'.toUpperCase();   // 'STRASSE'",
    },
    {
      q: 'How do I capitalise just the first letter?',
      a: 'Convert the first character and concatenate the rest. Watch the empty-string case, and note that charAt is safer than at here because it returns an empty string rather than undefined.',
      code: "s.charAt(0).toUpperCase() + s.slice(1);",
    },
    {
      q: 'Should I uppercase in JavaScript or CSS?',
      a: 'CSS, whenever it is purely visual. text-transform: uppercase leaves the DOM text unchanged, so selection, copy, form values and assistive technology all see the real string. Convert in JavaScript only when the uppercase form is the actual data.',
    },
  ],

  history: [
    { version: 'ES1',    note: 'toUpperCase present from the first version of the language.' },
    { version: 'ES3',    note: 'toLocaleUpperCase added for locale-sensitive mapping.' },
    { version: 'ES2017', note: 'The locale variants gained an explicit locale argument.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase',
    meta:  'String.prototype.toUpperCase',
  },

};
