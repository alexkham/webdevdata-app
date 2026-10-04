// content/reference/javascript/methods/string-padend.js

export const meta = {
  slug:        'string-padend',
  name:        'String.prototype.padEnd',
  signature:   'string.padEnd(targetLength[, padString])',
  blurb:       'Pad on the right — column alignment in logs and fixed-width output.',
  category:    'string',
  type:        'string',
  hasLiveDemo: true,
  version:     'ES2017',
  searchTerms: 'string padEnd padStart pad right align columns table fixed width whitespace log es2017 javascript',
};

export const method = {
  slug:      'string-padend',
  name:      'String.prototype.padEnd',
  signature: 'string.padEnd(targetLength[, padString])',
  returns:   { type: 'string', desc: 'A new string of at least targetLength, padded on the RIGHT. Like padStart it never truncates.' },

  category:    'String method',
  version:     'ES2017',
  hasLiveDemo: true,

  subtitle: 'The mirror of padStart, and the one you want for left-aligned columns. Same two rules: it never shortens, and a multi-character pad is cut to fit.',

  cheat: {
    commonCall: "label.padEnd(12)",
    returns:    'a new string of at least the target length',
    replaces:   'manual space concatenation in a loop',
    watchOut:   'trailing spaces are invisible and survive into your data',
  },

  parameters: [
    { name: 'targetLength', type: 'number', required: true,  default: null,  desc: 'Desired final length. At or below the current length, nothing happens.' },
    { name: 'padString',    type: 'string', required: false, default: "' '", desc: 'Text to pad with, repeated and truncated to fit exactly. An empty pad string does nothing.' },
  ],

  demoParams: [
    { name: 's',      type: 'string', hint: 'the string to pad', input: 'text' },
    { name: 'length', type: 'number', hint: 'target length',     input: 'number' },
    { name: 'pad',    type: 'string', hint: 'pad text',          input: 'text' },
  ],
  demoTemplate: '{s}.padEnd({length}, {pad})',
  cases: [
    { id: 'spaces',  label: 'space padding',       values: { s: 'name', length: 10, pad: ' ' } },
    { id: 'dots',    label: 'dot leader',          values: { s: 'Chapter', length: 12, pad: '.' } },
    { id: 'already', label: 'already long enough', values: { s: 'abcdef', length: 3, pad: ' ' } },
    { id: 'multi',   label: 'multi-char pad',      values: { s: 'x', length: 5, pad: 'ab' } },
    { id: 'emptypad',label: 'empty pad (!)',       values: { s: 'x', length: 5, pad: '' } },
  ],
  demoExplainer: "The quotes around the output matter here — trailing spaces are otherwise invisible, and they are exactly what this method adds. A dot leader shows that the pad need not be whitespace at all. The third case is the shared rule with padStart: a string longer than the target comes back unchanged, so this cannot enforce a column width on its own. The multi-character pad repeats then gets cut, so 'ab' to length 5 gives 'xabab'.",

  patterns: [
    {
      name: 'Align a column of labels',
      desc: 'Only meaningful in a monospaced context.',
      code: "rows.forEach(r => console.log(r.name.padEnd(16) + r.value));",
    },
    {
      name: 'Dot leader',
      desc: 'A table of contents look, in plain text.',
      code: "title.padEnd(40, '.') + page;",
    },
    {
      name: 'Bound the width both ways',
      desc: 'padEnd never truncates, so slice first.',
      code: 'const cell = s.slice(0, 16).padEnd(16);',
    },
  ],

  examples: [
    { title: 'Space padded',      code: "'name'.padEnd(8)",         returns: "'name    '" },
    { title: 'Dot leader',        code: "'ch'.padEnd(6, '.')",      returns: "'ch....'" },
    { title: 'Already longer',    code: "'abcdef'.padEnd(3)",       returns: "'abcdef'" },
    { title: 'Multi-char, cut',   code: "'x'.padEnd(5, 'ab')",      returns: "'xabab'" },
    { title: 'padStart mirrors it',code: "'x'.padStart(5, 'ab')",   returns: "'ababx'" },
    { title: 'Empty pad',         code: "'x'.padEnd(5, '')",        returns: "'x'" },
  ],

  pitfalls: [
    {
      name: 'Trailing whitespace is invisible and persistent',
      desc: 'Padding a value for display and then storing or comparing it is a classic source of bafflement — two strings that look identical differ, because one carries eight spaces nobody can see. Pad at the point of output, never before saving.',
      wrong: { label: 'Not equal', code: "'a'.padEnd(4) === 'a'", output: 'false' },
      fix:   { label: 'Trim before comparing', code: "'a'.padEnd(4).trim() === 'a'", output: 'true' },
    },
    {
      name: 'It never truncates',
      desc: 'Identical to padStart. A long value simply breaks the column rather than being cut, so any fixed-width layout needs a slice as well.',
      wrong: { label: 'Column breaks', code: "'a very long value'.padEnd(8)", output: 'length 17' },
      fix:   { label: 'Slice first',   code: "'a very long value'.slice(0, 8).padEnd(8)", output: "'a very l'" },
    },
    {
      name: 'Spaces collapse in HTML',
      desc: 'Padding for alignment only works where whitespace is significant — a terminal, a pre block, a log file. In ordinary HTML the run of spaces collapses to one and the alignment vanishes.',
      wrong: { label: 'No effect', code: "div.textContent = 'a'.padEnd(10) + 'b'", output: "renders as 'a b'" },
      fix:   { label: 'CSS or a table', code: 'display: grid', output: 'real columns' },
    },
    {
      name: 'It only works on strings',
      desc: 'As with padStart, numbers have no pad method. Convert first.',
      wrong: { label: 'Not a function', code: '(5).padEnd(3)', output: 'TypeError: 5.padEnd is not a function' },
      fix:   { label: 'Convert first',  code: "String(5).padEnd(3)", output: "'5  '" },
    },
  ],

  when: {
    use: [
      'Left-aligned columns in logs, terminals or pre blocks',
      'Dot leaders and other plain-text decoration',
      'Fixed-width record formats',
    ],
    avoid: [
      'Padding numbers on the left → padStart',
      'Aligning in HTML → CSS grid, flex or a table',
      'You need a maximum width → slice first',
      'The value will be stored or compared → pad only at output',
    ],
  },

  notes: {
    complexity: 'O(targetLength)',
    return:     'A new string, or the original when no padding is needed',
    cpython:    'V8: Builtins-string-pad',
    memory:     'Allocates the padded result',
    threadSafe: 'Single-threaded; the string is only read',
  },

  related: [
    { name: 'String.prototype.padStart', slug: 'string-padstart', when: 'Pad on the left — numbers and ids' },
    { name: 'String.prototype.trim',     slug: 'string-trim',     when: 'Removing the padding again' },
    { name: 'String.prototype.slice',    slug: 'string-slice',    when: 'Enforcing a maximum width' },
    { name: 'Array.prototype.join',      slug: 'array-join',      when: 'Assembling padded cells into a row' },
  ],

  faq: [
    {
      q: 'padEnd or padStart?',
      a: 'padEnd for text you want left-aligned — labels, names, anything read left to right. padStart for numbers, which align on their right-hand digit, and for zero-padded identifiers.',
      code: "name.padEnd(12);              // 'Alice       '\nString(n).padStart(4, '0');   // '0042'",
    },
    {
      q: 'Why does my padded output not line up in the browser?',
      a: 'Because HTML collapses runs of whitespace and most fonts are proportional, so even preserved spaces are different widths from the characters around them. Use a monospaced font with white-space: pre, or lay it out with CSS instead.',
    },
    {
      q: 'Does the pad string have to be one character?',
      a: 'No — it repeats and is then truncated to reach the exact length, so multi-character pads work but may end mid-repeat. Keep to single code units if a partial pad would look wrong.',
      code: "'x'.padEnd(5, 'ab');   // 'xabab'",
    },
  ],

  history: [
    { version: 'ES2017', note: 'Added together with padStart.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padEnd',
    meta:  'String.prototype.padEnd',
  },

};
