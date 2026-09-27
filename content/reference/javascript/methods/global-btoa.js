// content/reference/javascript/methods/global-btoa.js
//
// atob is consolidated here: the inverse, with the same Latin-1 limitation.

export const meta = {
  slug:        'global-btoa',
  name:        'btoa',
  signature:   'btoa(string)',
  blurb:       'Base64 encoding that only handles bytes — any character above U+00FF throws.',
  category:    'global',
  type:        'global',
  hasLiveDemo: true,
  version:     'HTML standard',
  searchTerms: 'btoa atob base64 encode decode binary Latin-1 InvalidCharacterError unicode TextEncoder data URL javascript',
};

export const method = {
  slug:      'global-btoa',
  name:      'btoa',
  signature: 'btoa(string)',
  returns:   { type: 'string', desc: 'The base64 encoding of the input, treating each character as ONE BYTE. Throws InvalidCharacterError for any code point above 255.' },

  category:    'Global function',
  version:     'HTML standard',
  hasLiveDemo: true,

  subtitle: 'A byte-to-base64 converter that takes a string, which is the source of all its trouble. Feeding it real Unicode text throws, and the fix is to encode to UTF-8 bytes first.',

  cheat: {
    commonCall: 'btoa(binaryString)',
    returns:    'a base64 string',
    replaces:   'a hand-written base64 encoder',
    watchOut:   'not Unicode-safe — encode to UTF-8 bytes first',
  },

  parameters: [
    { name: 'string', type: 'string', required: true, default: null, desc: 'A "binary string" — one where every character is in the range U+0000 to U+00FF and stands for one byte. Anything above that throws.' },
  ],

  demoParams: [
    { name: 's', type: 'string', hint: 'text to base64-encode', input: 'text' },
  ],
  demoTemplate: 'btoa({s})',
  cases: [
    { id: 'ascii',   label: 'plain ASCII',           values: { s: 'hello' } },
    { id: 'padded',  label: 'padding appears',       values: { s: 'hi' } },
    { id: 'latin1',  label: 'é works (Latin-1)',     values: { s: 'é' } },
    { id: 'cjk',     label: '中 → THROWS (!)',        values: { s: '中' } },
    { id: 'empty',   label: 'empty string',          values: { s: '' } },
  ],
  demoExplainer: "ASCII encodes cleanly, and the = padding appears whenever the input length is not a multiple of three. The é case works because U+00E9 fits in one byte — but note that it encodes the LATIN-1 byte, not the UTF-8 pair, so decoding it elsewhere as UTF-8 gives the wrong character. The fourth case is the hard limit: 中 is U+4E2D, above 255, and btoa throws rather than encoding it. Any text that might contain non-Latin-1 characters must be converted to UTF-8 bytes first.",

  patterns: [
    {
      name: 'Encode Unicode text safely',
      desc: 'UTF-8 bytes first, then base64.',
      code: "const bytes = new TextEncoder().encode(text);\nconst b64 = btoa(String.fromCharCode(...bytes));",
    },
    {
      name: 'Decode back to Unicode',
      desc: 'The mirror image.',
      code: "const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));\nconst text = new TextDecoder().decode(bytes);",
    },
    {
      name: 'A data URL',
      desc: 'The common real use.',
      code: "const src = `data:image/svg+xml;base64,${btoa(svg)}`;",
    },
  ],

  examples: [
    { title: 'ASCII',            code: "btoa('hello')",        returns: "'aGVsbG8='" },
    { title: 'And back',         code: "atob('aGVsbG8=')",     returns: "'hello'" },
    { title: 'Latin-1 works',    code: "btoa('é')",            returns: "'6Q=='" },
    { title: 'Beyond Latin-1 throws', code: "btoa('中')",       returns: 'InvalidCharacterError: Invalid character' },
    { title: 'UTF-8 first',      code: "btoa(String.fromCharCode(...new TextEncoder().encode('中')))", returns: "'5Lit'" },
    { title: 'Bad base64 throws',code: "atob('!!!')",          returns: 'InvalidCharacterError: Invalid character' },
  ],

  pitfalls: [
    {
      name: 'It is not Unicode-safe',
      desc: 'The single thing to know. btoa treats each character as a byte, so anything above U+00FF throws — emoji, CJK, Cyrillic, Greek. Encoding user text without a UTF-8 step works right up until someone types a character outside Latin-1.',
      wrong: { label: 'Throws', code: "btoa('中文')", output: 'InvalidCharacterError: Invalid character' },
      fix:   { label: 'Encode to bytes first', code: "btoa(String.fromCharCode(...new TextEncoder().encode('中文')))", output: "'5Lit5paH'" },
    },
    {
      name: 'Latin-1 characters encode as the WRONG bytes',
      desc: 'Worse than throwing, because it is silent. é encodes as the single Latin-1 byte 0xE9, not the UTF-8 pair 0xC3 0xA9 — so anything decoding the result as UTF-8 gets a replacement character. The data looks fine until it crosses a boundary.',
      wrong: { label: 'One Latin-1 byte', code: "btoa('é')", output: "'6Q==' — decodes as invalid UTF-8" },
      fix:   { label: 'UTF-8 bytes',      code: "btoa(String.fromCharCode(...new TextEncoder().encode('é')))", output: "'w6k='" },
    },
    {
      name: 'Base64 is not encryption',
      desc: 'It is a reversible encoding with no key. Putting a token or a password through btoa hides it from nobody — atob is one call away. It exists to make binary data safe to put in text, not to protect anything.',
      wrong: { label: 'Trivially reversed', code: "atob(btoa('my-secret'))", output: "'my-secret'" },
      fix:   { label: 'Actually encrypt',   code: 'await crypto.subtle.encrypt(alg, key, data)', output: 'ciphertext' },
    },
    {
      name: 'Standard base64 is not URL-safe',
      desc: 'The output can contain + and /, which are reserved in URLs, and the = padding needs escaping too. For a query parameter or a path, translate to the URL-safe alphabet or percent-encode the result.',
      wrong: { label: 'Not URL-safe', code: "btoa('\\xff\\xfe')", output: "'//4=' — slashes and padding" },
      fix:   { label: 'URL-safe form', code: "btoa(s).replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=+$/, '')", output: 'safe in a URL' },
    },
  ],

  when: {
    use: [
      'Data URLs for inline images and SVG',
      'Basic auth headers, which the spec defines in base64',
      'Putting binary data into JSON or a text field',
      'Round-tripping bytes through something that only accepts text',
    ],
    avoid: [
      'Unicode text → encode to UTF-8 bytes first',
      'Hiding secrets → it is not encryption',
      'URLs → translate to the URL-safe alphabet',
      'Large binary data → work with ArrayBuffer and streams instead',
    ],
  },

  notes: {
    complexity: 'O(n); the result is about 4/3 the input size',
    return:     'A new string; the input is unchanged',
    cpython:    'Not V8 — btoa and atob come from the HTML standard, not ECMAScript',
    memory:     'Allocates the result, roughly a third larger than the input',
    threadSafe: 'Single-threaded; available in workers as well as the main thread',
  },

  related: [
    { name: 'encodeURIComponent',    slug: 'global-encodeuricomponent', when: 'Percent encoding rather than base64' },
    { name: 'structuredClone',       slug: 'global-structuredclone',    when: 'Copying data rather than serialising it' },
    { name: 'String.fromCharCode',   slug: 'string-fromcharcode',       when: 'The bytes-to-binary-string step' },
    { name: 'String.prototype.padStart', slug: 'string-padstart',       when: 'Hex formatting as an alternative' },
  ],

  faq: [
    {
      q: 'Why does btoa throw on my text?',
      a: 'Because it contains a character above U+00FF and btoa only handles bytes. Convert to UTF-8 with TextEncoder first, then turn those bytes into a binary string.',
      code: "const b64 = btoa(String.fromCharCode(...new TextEncoder().encode(text)));",
    },
    {
      q: 'What do the names mean?',
      a: 'Binary TO ASCII and ASCII TO Binary — they come from a Unix convention, not from anything descriptive. They are defined in the HTML standard rather than in ECMAScript, which is why they are not on any built-in object.',
    },
    {
      q: 'How do I make the output URL-safe?',
      a: 'Replace + with -, / with _, and strip the = padding. That is the base64url alphabet from RFC 4648, and you reverse it before calling atob.',
      code: "const urlSafe = btoa(s).replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=+$/, '');",
    },
    {
      q: 'Is spreading the byte array safe for large data?',
      a: 'No — String.fromCharCode(...bytes) passes every byte as an argument and overflows the call stack at roughly 100 000. Chunk it, or use a loop, for anything sizeable.',
      code: "let s = '';\nfor (let i = 0; i < b.length; i += 8192) s += String.fromCharCode(...b.subarray(i, i + 8192));",
    },
  ],

  history: [
    { version: 'Netscape', note: 'btoa and atob shipped as browser extensions, taking their names from Unix utilities.' },
    { version: 'HTML5',    note: 'Standardised in the HTML specification rather than ECMAScript, with the Latin-1 restriction preserved.' },
  ],

  officialDocs: {
    label: 'MDN',
    href:  'https://developer.mozilla.org/en-US/docs/Web/API/Window/btoa',
    meta:  'btoa',
  },

  tryInTool: [
    { name: 'Base64 Encoder', href: '/tools/base64', meta: 'Encode and decode base64 interactively' },
  ],
};
