// content/reference/javascript/methods/string-tolowercase.js
//
// toLocaleLowerCase is consolidated here: same method with locale-sensitive
// mappings, and its only material difference — Turkish dotless i — belongs
// next to the pitfall it causes.

export const meta = {
  slug:        'string-tolowercase',
  name:        'String.prototype.toLowerCase',
  signature:   'string.toLowerCase()',
  blurb:       'Case-fold for comparison — and the Turkish i that breaks it.',
  category:    'string',
  type:        'string',
  hasLiveDemo: true,
  version:     'ES1 (1997)',
  searchTerms: 'string toLowerCase toLocaleLowerCase lowercase case insensitive compare fold turkish dotless i unicode javascript',
};

export const method = {
  slug:      'string-tolowercase',
  name:      'String.prototype.toLowerCase',
  signature: 'string.toLowerCase()',
  returns:   { type: 'string', desc: 'A new string with every character mapped to lower case according to the Unicode default case conversion. Characters without a lower-case form are left alone.' },

  category:    'String method',
  version:     'ES1 (1997)',
  hasLiveDemo: true,

  subtitle: 'The workhorse of case-insensitive comparison. It uses locale-independent Unicode rules, which is usually what you want — and is exactly wrong for Turkish.',

  cheat: {
    commonCall: 'a.toLowerCase() === b.toLowerCase()',
    returns:    'a new string — assign it',
    replaces:   'nothing; it is the base case-folding method',
    watchOut:   'locale-independent by design; use toLocaleLowerCase for display',
  },

  parameters: [],

  demoParams: [
    { name: 's', type: 'string', hint: 'text to lowercase', input: 'text' },
  ],
  demoTemplate: '{s}.toLowerCase()',
  cases: [
    { id: 'basic',   label: 'mixed case',        values: { s: 'Hello World' } },
    { id: 'shout',   label: 'all caps',          values: { s: 'STRASSE' } },
    { id: 'accents', label: 'accented letters',  values: { s: 'ÉLAN VITAL' } },
    { id: 'turkish', label: 'a capital I (!)',   values: { s: 'ISTANBUL' } },
    { id: 'digits',  label: 'digits unchanged',  values: { s: 'ABC123!' } },
  ],
  demoExplainer: "Accented capitals map to their accented lower-case forms, and anything without a case — digits, punctuation, spaces — passes through untouched. The fourth case looks unremarkable and is the one to think about: this method uses the LOCALE-INDEPENDENT Unicode mapping, so a capital I always becomes a dotted i. In Turkish that is the wrong letter, and toLocaleLowerCase('tr') produces the dotless ı instead.",

  patterns: [
    {
      name: 'Case-insensitive comparison',
      desc: 'Fold both sides, never just one.',
      code: 'if (a.toLowerCase() === b.toLowerCase()) { }',
    },
    {
      name: 'Normalise a key or slug',
      desc: 'Trim and fold before storing.',
      code: "const key = raw.trim().toLowerCase();",
    },
    {
      name: 'Display in the user locale',
      desc: 'The locale-aware variant, for text people read.',
      code: 'const shown = label.toLocaleLowerCase(navigator.language);',
    },
  ],

  examples: [
    { title: 'Mixed case',        code: "'Hello'.toLowerCase()",     returns: "'hello'" },
    { title: 'Already lower',     code: "'abc'.toLowerCase()",       returns: "'abc'" },
    { title: 'Digits unchanged',  code: "'ABC123'.toLowerCase()",    returns: "'abc123'" },
    { title: 'Locale-independent',code: "'I'.toLowerCase()",         returns: "'i'" },
    { title: 'Turkish differs',   code: "'I'.toLocaleLowerCase('tr')", returns: "'ı'   // dotless" },
    { title: 'Length can change', code: "'\\u0130'.toLowerCase().length", returns: '2' },
  ],

  pitfalls: [
    {
      name: 'It returns a new string and changes nothing',
      desc: 'The same immutability rule as every string method, and worth stating because case conversion feels like something that ought to happen in place.',
      wrong: { label: 'Discarded', code: "let s = 'ABC';\ns.toLowerCase();\ns", output: "'ABC'" },
      fix:   { label: 'Assign it', code: "let s = 'ABC';\ns = s.toLowerCase();\ns", output: "'abc'" },
    },
    {
      name: 'Case folding is not accent folding',
      desc: 'Lowercasing maps É to é, not to e. A search that should treat "elan" and "élan" as the same needs normalisation and diacritic removal as a separate step.',
      wrong: { label: 'Still differs', code: "'Élan'.toLowerCase() === 'elan'", output: 'false' },
      fix:   { label: 'Strip marks too', code: "'Élan'.toLowerCase().normalize('NFD').replace(/\\p{Diacritic}/gu, '') === 'elan'", output: 'true' },
    },
    {
      name: 'The Turkish dotless i',
      desc: 'The canonical reason toLocaleLowerCase exists. In Turkish and Azeri, capital I lowercases to ı and capital İ lowercases to i. Using the locale-aware version for a protocol comparison is the mistake — an identifier folded under a Turkish locale stops matching its ASCII form.',
      wrong: { label: 'Locale-dependent', code: "'ID'.toLocaleLowerCase('tr') === 'id'", output: 'false' },
      fix:   { label: 'Locale-independent', code: "'ID'.toLowerCase() === 'id'", output: 'true' },
    },
    {
      name: 'Round-tripping case is lossy',
      desc: 'Some characters change length or identity on conversion — the German ß uppercases to two characters, SS, which lowercases back to ss and not ß. Never assume upper-then-lower returns the original.',
      wrong: { label: 'Not reversible', code: "'\\u00df'.toUpperCase().toLowerCase()", output: "'ss'   // was 'ß'" },
      fix:   { label: 'Keep the original', code: 'const display = original;', output: "'ß'" },
    },
  ],

  when: {
    use: [
      'Case-insensitive comparison and lookup keys',
      'Normalising identifiers, protocols, header names and file extensions',
      'Search filtering, alongside trim',
    ],
    avoid: [
      'Text the user will read → toLocaleLowerCase with their locale',
      'Accent-insensitive matching → normalize and strip diacritics as well',
      'Sorting → localeCompare, which handles case and accents properly',
      'You want upper case → toUpperCase',
    ],
  },

  notes: {
    complexity: 'O(n)',
    return:     'A new string; the original is untouched',
    cpython:    'V8: Builtins-string-tolowercase / ICU',
    memory:     'Allocates the result; the length may differ from the input',
    threadSafe: 'Single-threaded; the string is only read',
  },

  related: [
    { name: 'String.prototype.toUpperCase', slug: 'string-touppercase', when: 'The other direction, with its own surprises' },
    { name: 'String.prototype.trim',        slug: 'string-trim',        when: 'The other half of normalising user input' },
    { name: 'String.prototype.includes',    slug: 'string-includes',    when: 'Case-insensitive substring search' },
    { name: 'String.prototype.replace',     slug: 'string-replace',     when: 'Stripping diacritics after normalising' },
  ],

  faq: [
    {
      q: 'toLowerCase or toLocaleLowerCase?',
      a: 'toLowerCase for anything a machine compares — keys, identifiers, protocols, extensions — because it is locale-independent and therefore stable. toLocaleLowerCase for text a person reads, where the user locale should decide. Using the locale version for comparisons is how the Turkish-i bug gets in.',
      code: "key.toLowerCase();                      // comparison\nlabel.toLocaleLowerCase(userLocale);    // display",
    },
    {
      q: 'How do I compare strings ignoring case AND accents?',
      a: 'Either normalise and strip combining marks, or use localeCompare with a sensitivity option — the latter is more correct and handles language-specific collation rules you would otherwise have to reimplement.',
      code: "a.localeCompare(b, undefined, {sensitivity: 'base'}) === 0;",
    },
    {
      q: 'Why did my string get longer?',
      a: 'Because case mapping is not one-to-one in Unicode. The capital İ lowercases to two code points, and ß uppercases to SS. Any code that assumes the length survives a case conversion is wrong for some input.',
      code: "'\\u0130'.toLowerCase().length;   // 2",
    },
  ],

  history: [
    { version: 'ES1',    note: 'toLowerCase and toUpperCase present from the first version.' },
    { version: 'ES3',    note: 'toLocaleLowerCase and toLocaleUpperCase added for locale-sensitive mapping.' },
    { version: 'ES2017', note: 'The locale variants gained an explicit locale argument rather than relying on the host default.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase',
    meta:  'String.prototype.toLowerCase',
  },

  tryInTool: [],
};
